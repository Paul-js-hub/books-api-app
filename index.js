const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const books = [
    { id: 1, title: 'Java' },
    { id: 2, title: 'CSS' },
    { id: 3, title: 'JavaScript' },
];

app.get('/', (req, res) => {
    res.send('Hello Api!!!');
});

app.get('/api/books', (req, res) => {
    return res.send(books); // getting all the courses
});

app.get('/api/books/:id', (req, res) => {
    //return a particular book with an id
    const book = books.find(b => b.id === parseInt(req.params.id)); // Looking up for the book
    if (!book) res.status(404).send('The book with that particular ID not found.'); ////If it does not exist return Not Found 

    res.send(book);
});

app.post('/api/books', (req, res) => {
    // Validating the request body using joi
    const schema = {
        title: Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body, schema);

    // If invalid return a 400 error
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const book = {
        id: books.length + 1,
        title: req.body.title
    };
    books.push(book);
    return res.send(book);
});

app.put('/api/books/:id', (req, res) =>{

    const book = books.find(b => b.id === parseInt(req.params.id)); 
    if (!book) res.status(404).send('The book with that particular ID not found.'); 

    const {error} = validateBook(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // Updating the book
    book.title = req.body.title;
    // returning the updated book to the client
    return res.send(book);
});

app.delete('/api/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id)); 
    if (!book) res.status(404).send('The book with that particular ID not found.'); 

    const index = books.indexOf(book);
    books.splice(index, 1);

    return res.send(book);
});

function validateBook(book){
    const schema = {
        title: Joi.string().min(3).required()
    };
  return Joi.validate(book, schema);
}
    


app.listen(3000, () => console.log('Listening on Port 3000...'))