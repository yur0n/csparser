import { connect } from 'mongoose';

(async function connectDB() {
	await connect(process.env.MONGODB_CONNECTION)
})()