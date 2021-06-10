import mongoose from 'mongoose'
//Set up default mongoose connection
const dbConnection = () => {
    const mongoDB = process.env.MONGODB_URI;
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    //Get the default connection
    const db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    // db.on("Connected", () =>{
    //     console.log("Mongoose connected")
    // })
}

export default dbConnection;