import dbConnection from './mongodb';
import Book from './bookModel';
import User from './user';
import Joi from '@hapi/joi';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import booksController from './controllers/books'

dotenv.config();
const app = express();
// connect db
dbConnection();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.send('Hello Api!!!');
});

app.get('/api/books', verifyToken, booksController.books_get_all);

app.get('/api/books/:id',verifyToken, booksController.books_get_byId);

app.post('/api/books', verifyToken, booksController.books_create);

app.put('/api/books/:id', booksController.books_update_byId);

app.delete('/api/books/:id', booksController.books_delete_byId);


//REGISTER
const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});
app.post('/api/register', async (req, res) => {

    //validation
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    // If email exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) res.status(400).send('Email already exists');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });

    await user.save()
        .then((doc) => {
            res.status(201).send(doc)
        }).catch((err) => {
            res.status(500).send(err)
        })

});

//LOGIN
const schemaLogin = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

app.post('/api/login', async (req, res) => {
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(422).send(error)

    //check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User with the email doesn't exist");

    //Check if the passwords match
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).send('Invalid login credentials');
    if (match) {
        const accessToken = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
        return res.status(201)
            .send({ message: 'Login Success', accessToken });
    }
    return res.send('An error occurred').status(500)
});


//middleware
function verifyToken(req, res, next) {
    const accessToken = req.header('auth-token');
    if (!accessToken) {
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        req.u = verified;
        next();
    } catch (error) {
        res.status(403).send('Invalid Token')
    }
}

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))