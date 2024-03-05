import { Schema, model } from 'mongoose'

const schema = new Schema({
    id: { type: String, required: true, unique: true },
	photo: { type: String },
	displayName: { type: String }
})

export default model('User', schema) 
