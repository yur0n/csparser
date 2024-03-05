import { Schema, model } from 'mongoose'

const schema = new Schema({
    id: { 
		type: String, 
		required: true, 
		unique: true 
	},
	expirationDate: {
		type: Date,
		expires: 0
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
})



export default model('Subscriber', schema) 
