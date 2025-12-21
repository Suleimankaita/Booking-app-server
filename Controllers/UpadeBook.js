const asynchandler = require('express-async-handler');
const Books = require('../model/Books');
const path = require('path');

const UpdateBook = asynchandler(async (req, res) => {
    try {
        const { id, description, BookName, Author, categories, price, title } = req.body;

        // 1. Check if ID is provided
        if (!id) {
            return res.status(400).json({ message: "Book ID is required for updating" });
        }

        // 2. Find the existing book
        const book = await Books.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // 3. Handle Files (Multer puts files in req.files)
        // If the user didn't upload a new file, keep the old filename from the database
        let EpubUri = book.EpubUri;
        let CoverImg = book.CoverImg;

        if (req.files) {
            if (req.files['epub'] && req.files['epub'][0]) {
                const newEpub = req.files['epub'][0].filename;
                // Validate extension
                if (path.extname(newEpub).toLowerCase() !== ".epub") {
                    return res.status(400).json({ message: "Invalid file: Only EPUB files are supported." });
                }
                EpubUri = newEpub;
            }

            if (req.files['file'] && req.files['file'][0]) {
                CoverImg = req.files['file'][0].filename;
            }
        }

        // 4. Update fields
        book.description = description || book.description;
        book.BookName = BookName || book.BookName;
        book.Author = Author || book.Author;
        book.categories = categories || book.categories;
        book.price = price ? Number(price) : book.price;
        book.title = title || book.title;
        book.EpubUri = EpubUri;
        book.CoverImg = CoverImg;

        // 5. Save the updated document
        const updatedBook = await book.save();

        console.log("Updated Book:", updatedBook);
        res.status(200).json({ 
            message: `Book '${book.BookName}' updated successfully`,
            data: updatedBook 
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = UpdateBook;