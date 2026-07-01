import { GoogleGenAI } from '@google/genai';

// Lazy client initialization to avoid ES Module import hoisting issues
let aiInstance = null;
const getAi = () => {
    if (!aiInstance) {
        aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiInstance;
};

// @desc    Chat with agricultural assistant
// @route   POST /api/chat
// @access  Private
export const getChatResponse = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message content is required.' });
        }

        const ai = getAi();
        
        const contents = [];
        if (history && history.length > 0) {
            history.forEach(msg => {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                });
            });
        }
        
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const systemInstruction = `You are CropCure AI, an expert agricultural advisor specializing in farming, crop diseases, soil fertility, pest control, and smart irrigation. 
        Answer the farmer's questions clearly, concisely, and supportively. 
        Provide practical recommendations, detailing both:
        1. Organic/preventive remedies
        2. Safe chemical treatments (mentioning exact chemical composition and stages of application).
        Ensure answers are highly readable with simple bullet points. Use the user's language (e.g. English, Hindi, Spanish) matching the query.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction
            }
        });

        const textResponse = response.text.trim();
        res.status(200).json({ response: textResponse });
    } catch (error) {
        console.error("AI Chat Error:", error.message);
        res.status(500).json({ message: "Failed to load chat response", error: error.message });
    }
};
