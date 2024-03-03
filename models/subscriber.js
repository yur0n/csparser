const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    id: { 
		type: String, 
		required: true, 
		unique: true 
	},
	// expirationDate: {
	// 	type: Date,
	// 	expires: 0
	// },
	// createdAt: {
	// 	type: Date,
	// 	default: Date.now
	// }
})



module.exports = {
	Subscriber: mongoose.model('Subscriber', schema)
} 
