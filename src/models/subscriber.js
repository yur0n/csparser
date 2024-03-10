import { Schema, model } from 'mongoose'

const schema = new Schema({
    _id: { 
		type: String,
		ref: 'User' 
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
