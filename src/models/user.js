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
	cookies: { 
		type: [Object]
	}
})

export default model('User', schema) 
