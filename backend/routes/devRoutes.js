const express = require('express');
const multer = require('multer');
const DevEntry = require('../models/DevEntry');  // Replace with your actual model
const router = express.Router();

// Multer middleware for file upload (passed from app.js)
const upload = (req, res, next) => {
    multer({ dest: 'uploads/dev/' }).single('screenshot')(req, res, next);
};

router.post('/', upload, async (req, res) => {
    try {
        const { date, name, numberOfBuildings } = req.body;
        const newEntry = new DevEntry({
            date,
            name,
            numberOfBuildings,
            screenshot: req.file ? req.file.path : null,
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const entries = await DevEntry.find();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = (upload) => router; // Pass `upload` to be used in routes
