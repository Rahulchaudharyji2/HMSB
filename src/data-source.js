const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_DB_URL || 'mongodb+srv://rahulchaudharyji2:s5lRXzU96ym1idoU@cluster0.nzxzs3o.mongodb.net/HospitalManagement?retryWrites=true&w=majority&appName=Cluster0';

class Database {
    static async connect() {
        try {
            await mongoose.connect(dbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Set a timeout (5 seconds)
            });
            console.log('Database connected successfully');
        } catch (err) {
            console.error('Database connection error:', err.message);
            // Additional logging for debugging
            console.error(err);
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Database disconnected');
        } catch (err) {
            console.error('Error disconnecting from the database:', err.message);
        }
    }
}

module.exports = Database;
