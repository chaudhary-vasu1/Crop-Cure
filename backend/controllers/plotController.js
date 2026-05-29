import Plot from '../models/Plot.js';

// @desc    Get all plots for the logged-in user
// @route   GET /api/plots
// @access  Private
export const getPlots = async (req, res) => {
    try {
        // Find plots where the 'user' field matches the logged-in user's ID
        const plots = await Plot.find({ user: req.user.id }).sort({ createdAt: -1 });
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
        const { name, cropType, location, soilType, irrigationMethod } = req.body;

        if (!name || !cropType || !location || !soilType || !irrigationMethod) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const plot = await Plot.create({
            user: req.user.id,
            name,
            cropType,
            location,
            soilType,
            irrigationMethod,
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

        // Ensure the user deleting the plot is the owner
        if (plot.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this plot' });
        }

        await plot.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Plot deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete plot', error: error.message });
    }
};