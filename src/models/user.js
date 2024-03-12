import { Schema, model } from 'mongoose'

const schema = new Schema({
    _id: { 
		type: String, 
		ref: 'Subscriber'
	},
	photo: { 
		type: String 
	},
	displayName: { 
		type: String 
	},
	cookie: { 
		type: String
	}
})

export default model('User', schema) 
