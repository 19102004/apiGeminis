const mongoose = require('mongoose');

const WasaSchema = new mongoose.Schema({
    phoneNumber: { 
        type: String, 
        required: true, 
    },
    token: { 
        type: String, 
        required: true, 
    }
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Wasa', WasaSchema);