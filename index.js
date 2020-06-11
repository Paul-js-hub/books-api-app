import dbConnection from './mongodb';
import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import verifyToken from './middlewares/verifyToken';
import booksController from './controllers/books';
import userController from './controllers/userAuthentication';
import multer from 'multer';
import path from 'path';
//import upload from './middlewares/upload'

dotenv.config();
const app = express();
// connect db
dbConnection();
app.disable('etag');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 80;

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(null, false);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }

});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('bookImage')

app.get('/', (req, res) => {
    res.send('Hello Api!!!');
});

app.get('/api/books', verifyToken, booksController.books_get_all);
app.get('/api/books/:id', verifyToken, booksController.books_get_byId);
app.post('/api/books', verifyToken, upload, booksController.books_create);
app.put('/api/books/:id', booksController.books_update_byId);
app.delete('/api/books/:id', booksController.books_delete_byId);

app.post('/api/register', userController.user_register);
app.post('/api/login', userController.user_login);



app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))