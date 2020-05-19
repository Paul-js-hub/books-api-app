import dbConnection from './mongodb';
import Book from './bookModel';
import User from './user';
import Joi from '@hapi/joi';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
// connect db
dbConnection();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.send('Hello Api!!!');
});

app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        return res.send(books);
    } catch (err) {
        res.json({ message: err })
    }

});

app.get('/api/books/:id', async (req, res) => {
    //return a particular book with an id
    const book = await Book.findById(req.params.id); // Looking up for the book
    if (!book) res.status(404).send('The book with that particular ID not found.'); ////If it does not exist return Not Found 
    res.send(book);
});

app.post('/api/books', (req, res) => {
    // Validating the request body using joi
    console.log("request", req.body);
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);

    // If invalid return a 400 error
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const book = {
        title: req.body.title
    };

    let model = new Book(book);
    model.save().then((doc) => {
        res.status(201).send(doc)
    }).catch((err) => {
        res.status(500).send(err)
    })
});

app.put('/api/books/:id', async (req, res) => {

    const book = await Book.updateOne(
        { _id: req.params.id },
        { $set: { title: req.body.title } }
    );
    if (!book) res.status(404).send('The book with that particular ID not found.');

    const { error } = validateBook(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // returning the updated book to the client
    return res.status(201).send(book);
});

app.delete('/api/books/:id', async (req, res) => {
    const book = await Book.deleteOne({ _id: req.params.id });
    if (!book) res.status(404).send('The book with that particular ID not found.');

    return res.status(200).send(book);
});


//REGISTER
const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required()
});
app.post('/api/register', async(req, res) => {

    //validation
    const {error}= schema.validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message)
    }

    // If email exists
    const emailExists = await User.findOne({email:req.body.email});
    if(emailExists) res.status(400).send('Email already exists');

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

function validateBook(book) {
    const schema = {
        title: Joi.string().min(3).required()
    };
    return Joi.validate(book, schema);
}

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))