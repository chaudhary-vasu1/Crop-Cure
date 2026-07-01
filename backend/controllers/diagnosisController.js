import { GoogleGenAI } from '@google/genai';
import Diagnosis from '../models/Diagnosis.js';
import Plot from '../models/Plot.js';

// Lazy client initialization to avoid ES Module import hoisting issues
let aiInstance = null;
const getAi = () => {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiInstance;
};

// @desc    Analyze crop image and save diagnosis
// @route   POST /api/diagnostics/:plotId
// @access  Private
export const analyzeCrop = async (req, res) => {
    try {
        const { plotId } = req.params;
        const { lang } = req.query;

        let targetLanguage = 'English';
        if (lang === 'hi') targetLanguage = 'Hindi (हिंदी)';
        else if (lang === 'es') targetLanguage = 'Spanish (Español)';

        // 1. Validate the file exists
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image of the crop.' });
        }

        // 2. Validate the plot belongs to the user
        const plot = await Plot.findById(plotId);
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found.' });
        }
        if (plot.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to diagnose this plot.' });
        }

        // 3. Prepare the image for Gemini
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
            }
        };

        // 4. Construct the prompt with strict JSON instructions
        const prompt = `
            You are an expert agricultural AI. Analyze this image of a crop leaf.
            Identify any diseases or nutrient deficiencies.
            
            Please translate all user-facing description text fields (diseaseName, organic treatment, and chemical treatment) into ${targetLanguage}.
            
            You MUST return your response as a raw, valid JSON object without any markdown wrapping or code blocks.
            Use this exact schema:
            {
                "diseaseName": "Name of the disease in ${targetLanguage} or 'Healthy' or 'स्वस्थ' / 'Saludable'",
                "confidenceScore": 0.00 to 1.00,
                "treatmentPlan": {
                    "organic": "Specific organic treatment instructions written in ${targetLanguage}",
                    "chemical": "Specific chemical treatment instructions written in ${targetLanguage}"
                },
                "isContagious": true or false
            }
        `;

        // 5. Call the Gemini API
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [prompt, imagePart],
            config: {
                // Enforce JSON output at the model level
                responseMimeType: "application/json", 
            }
        });

        // 6. Parse the AI response (PARENTHESES REMOVED HERE!)
        const aiData = JSON.parse(response.text);

        // 7. Save the diagnosis to MongoDB
        const diagnosis = await Diagnosis.create({
            user: req.user.id,
            plot: plot._id,
            diseaseName: aiData.diseaseName,
            confidenceScore: aiData.confidenceScore,
            treatmentPlan: {
                organic: aiData.treatmentPlan.organic,
                chemical: aiData.treatmentPlan.chemical,
            },
            isContagious: aiData.isContagious,
        });

        // 8. Return the saved record to the frontend
        res.status(201).json(diagnosis);

    } catch (error) {
        console.error("AI Diagnostics Error:", error);
        res.status(500).json({ 
            message: 'Failed to analyze the image. Please try again.', 
            error: error.message 
        });
    }
};

// Helper to translate list of diagnoses on the fly
const translateDiagnoses = async (diagnoses, lang) => {
    if (!lang || lang === 'en') return diagnoses;
    
    const textToTranslate = [];
    diagnoses.forEach((d, idx) => {
        textToTranslate.push({
            idx,
            diseaseName: d.diseaseName,
            organic: d.treatmentPlan?.organic || '',
            chemical: d.treatmentPlan?.chemical || ''
        });
    });

    if (textToTranslate.length === 0) return diagnoses;

    let targetLanguage = 'Hindi (हिंदी)';
    if (lang === 'es') targetLanguage = 'Spanish (Español)';

    const prompt = `You are an expert translator. Translate the following array of crop diagnoses text into ${targetLanguage}.
Keep agricultural terminology accurate. Output ONLY a valid JSON array of objects representing the translations. Do not include markdown code blocks or wrapping.

Schema:
[
  {
    "idx": number,
    "diseaseName": "Translated disease name",
    "organic": "Translated organic treatment",
    "chemical": "Translated chemical treatment"
  }
]

Data to translate:
${JSON.stringify(textToTranslate, null, 2)}`;

    try {
        const response = await getAi().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const translatedArray = JSON.parse(response.text);
        
        const clonedDiagnoses = JSON.parse(JSON.stringify(diagnoses));
        translatedArray.forEach(item => {
            const orig = clonedDiagnoses[item.idx];
            if (orig) {
                orig.diseaseName = item.diseaseName;
                if (!orig.treatmentPlan) orig.treatmentPlan = {};
                orig.treatmentPlan.organic = item.organic;
                orig.treatmentPlan.chemical = item.chemical;
            }
        });
        return clonedDiagnoses;
    } catch (err) {
        console.error("Failed to translate diagnoses:", err);
        return diagnoses;
    }
};

// @desc    Get all diagnoses for a specific plot
// @route   GET /api/diagnostics/:plotId
// @access  Private
export const getDiagnosesByPlot = async (req, res) => {
    try {
        const { lang } = req.query;
        const diagnoses = await Diagnosis.find({ 
            plot: req.params.plotId, 
            user: req.user.id 
        }).sort({ createdAt: -1 });
        
        const localized = await translateDiagnoses(diagnoses, lang);
        res.status(200).json(localized);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch diagnoses', error: error.message });
    }
};

// @desc    Get all diagnoses for the logged-in user across all plots
// @route   GET /api/diagnostics
// @access  Private
export const getAllDiagnoses = async (req, res) => {
    try {
        const { lang } = req.query;
        const diagnoses = await Diagnosis.find({ user: req.user.id || req.user._id })
            .populate('plot', 'name cropType location')
            .sort({ createdAt: -1 });

        const localized = await translateDiagnoses(diagnoses, lang);
        res.status(200).json(localized);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch diagnoses', error: error.message });
    }
};