import dbConnection from './mongodb';
import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import verifyToken from './middlewares/verifyToken';
import booksController from './controllers/books';
import userController from './controllers/userAuthentication';
import multer from 'multer';
import cloudinary from 'cloudinary';
import fileupload from 'express-fileupload'

dotenv.config();
const app = express();
// connect db
dbConnection();
app.disable('etag');
app.use(cors({
    host: true,
    methods: ['DELETE', 'GET', 'PUT', 'POST'],
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload({
    useTempFiles:true
}));


const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.send('Hello Api!!!');
});

app.get('/api/books', verifyToken, booksController.books_get_all);
app.get('/api/books/:id', verifyToken, booksController.books_get_byId);
app.post('/api/books', verifyToken, booksController.books_create);
app.put('/api/books/:id', booksController.books_update_byId);
app.delete('/api/books/:id', booksController.books_delete_byId);

app.post('/api/register', userController.user_register);
app.post('/api/login', userController.user_login);



app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))