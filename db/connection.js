const mongoose = require('mongoose');

// let connectMongo
(async function connect() {
	await mongoose.connect(process.env.MONGODB_CONNECTION)
})()

// module.exports = { connectMongo }