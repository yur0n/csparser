const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
	photo: { type: String },
	displayName: { type: String }
})

module.exports = {
	User: mongoose.model('User', schema)
} 
