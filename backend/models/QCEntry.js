const mongoose = require('mongoose');

const qcEntrySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true },
    numberOfBuildings: { type: Number, required: true },
    screenshot: { type: String }, // Filepath to the uploaded screenshot
});

module.exports = mongoose.model('QCEntry', qcEntrySchema);
