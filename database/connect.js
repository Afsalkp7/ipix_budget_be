import mongoose from "mongoose";
const database = async () => {
    await mongoose.connect(process.env.mongodb_url);
    console.log(`connected`);
}

export default database;