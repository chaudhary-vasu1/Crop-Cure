import Plot from '../models/Plot.js';

// @desc    Get all plots for the logged-in user
// @route   GET /api/plots
// @access  Private
export const getPlots = async (req, res) => {
    try {
        // ✅ Changed to req.user._id
        const plots = await Plot.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(plots);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch plots', error: error.message });
    }
};

// @desc    Create a new plot
// @route   POST /api/plots
// @access  Private
export const createPlot = async (req, res) => {
    try {
        const { name, cropType, area, location, soilType, irrigationMethod } = req.body;

        if (!name || !cropType || !area) {
            return res.status(400).json({ message: 'Please provide name, crop type, and area' });
        }

        const plot = await Plot.create({
            user: req.user._id, // ✅ Changed to req.user._id
            name,
            cropType,
            area,
            location: location || 'Meerut',
            soilType: soilType || 'Loamy',
            irrigationMethod: irrigationMethod || 'Drip'
        });

        res.status(201).json(plot);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create plot', error: error.message });
    }
};

// @desc    Delete a plot
// @route   DELETE /api/plots/:id
// @access  Private
export const deletePlot = async (req, res) => {
    try {
        const plot = await Plot.findById(req.params.id);

        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }

        // ✅ Safely converting both to strings to ensure a perfect match
        if (plot.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this plot' });
        }

        await Plot.findByIdAndDelete(req.params.id);
        res.status(200).json({ id: req.params.id, message: 'Plot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete plot', error: error.message });
    }
};