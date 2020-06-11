import Book from '../models/bookModel';
import Joi from '@hapi/joi';

exports.books_get_all = async (req, res) => {
    try {
        const books = await Book.find();
        return res.send(books);
    } catch (err) {
        res.json({ message: err })
    }

}
exports.books_get_byId = async (req, res) => {
    //return a particular book with an id
    const book = await Book.findById(req.params.id); // Looking up for the book
    if (!book) res.status(404).send('The book with that particular ID not found.'); ////If it does not exist return Not Found 
    res.send(book);
}
exports.books_create = (req, res) => {
    
    // Validating the request body using joi
    console.log("request", req.file);
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        author: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body);

    // If invalid return a 400 error
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const book = {
        title: req.body.title,
        author: req.body.author,
        bookImage:req.file.path
    };

    let model = new Book(book);
    model.save().then((doc) => {
        res.status(201).send(doc)
    }).catch((err) => {
        res.status(500).send(err)
    })
}

exports.books_update_byId = async (req, res) => {

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
}

exports.books_delete_byId = async (req, res) => {
    const book = await Book.deleteOne({ _id: req.params.id });
    if (!book) res.status(404).send('The book with that particular ID not found.');

    else{
        res.send('Book deleted successfully')
    }

    return res.status(200).send(book);
}

function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    return schema.validate(book);
}
