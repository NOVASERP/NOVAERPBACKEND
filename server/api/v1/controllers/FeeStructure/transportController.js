const TransportRoute = require('../../../../models/TransportRoute');
const StudentTransport = require('../../../../models/StudentTransport');
const User = require('../../../../models/userModel'); // Your Student model (assuming User is student)
const Vehicle = require('../../../../models/Vehicle'); // <--- NEW: Import Vehicle model

// --- Transport Routes Management ---

// 1. Create a new transport route
exports.createTransportRoute = async (req, res) => {
    try {
        const newRoute = new TransportRoute(req.body);
        await newRoute.save();
        res.status(201).json({ message: 'Transport route created successfully', route: newRoute });
    } catch (error) {
        console.error('Error creating transport route:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Transport route with this name already exists.' });
        }
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. Get all transport routes
exports.getAllTransportRoutes = async (req, res) => {
    try {
        // Populate vehicle details if assigned
        const routes = await TransportRoute.find({}).populate('vehicle', 'vehicleNumber vehicleType driverName');
        res.status(200).json({ message: 'Transport routes fetched successfully', data: routes });
    } catch (error) {
        console.error('Error fetching transport routes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 3. Update a transport route by ID
exports.updateTransportRoute = async (req, res) => {
    try {
        const updatedRoute = await TransportRoute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedRoute) return res.status(404).json({ message: 'Transport route not found' });
        res.status(200).json({ message: 'Transport route updated successfully', route: updatedRoute });
    } catch (error) {
        console.error('Error updating transport route:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Transport route with this name already exists.' });
        }
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 4. Delete a transport route by ID
exports.deleteTransportRoute = async (req, res) => {
    try {
        const deletedRoute = await TransportRoute.findByIdAndDelete(req.params.id);
        if (!deletedRoute) return res.status(404).json({ message: 'Transport route not found' });

        // Optional: Set associated StudentTransport records to 'Discontinued'
        await StudentTransport.updateMany({ transportRouteId: req.params.id }, { status: 'Discontinued' });

        res.status(200).json({ message: 'Transport route and associated student transport records discontinued successfully' });
    } catch (error) {
        console.error('Error deleting transport route:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Student Transport Assignment (No changes needed based on previous code) ---
// ... (your existing student transport assignment functions) ...

// routes/transportRoutes.js (No changes needed for routes, just ensure Vehicle model is available for population)
// ... (your existing router setup) ...