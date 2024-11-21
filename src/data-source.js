const mongoose = require('mongoose');

const dbUrl = process.env.MONGO_DB_URL || 'mongodb+srv://rahulchaudharyji2:s5lRXzU96ym1idoU@cluster0.nzxzs3o.mongodb.net/HospitalManagement?retryWrites=true&w=majority&appName=Cluster0';



class Database{
    static async connect() {
        try {
            await mongoose.connect(dbUrl);
        
        }
        catch (err) {
            console.error(err);
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
        }
        catch (err) {
            console.error(err);
        }
    }
}

module.exports = Database;
