//Import the mongoose module
import mongoose from 'mongoose'
//Set up default mongoose connection
const dbConnection = () => {
    const mongoDB = 'mongodb://127.0.0.1/book-db';
    mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

    //Get the default connection
    const db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

export default dbConnection;