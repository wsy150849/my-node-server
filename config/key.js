const { mongo } = require("mongoose");

module.exports = {
    mongoURI: process.env.MONGO_URI || "mongodb+srv://test:1920910906521sy@cluster0.4qhfm6m.mongodb.net/?appName=Cluster0"
}