const asynchandler = require('express-async-handler');
const Books = require('../model/Books');
const trials = require('../model/UserBooks'); // This is your UserBooks model
const fs = require('fs');
const path = require('path');

const DeleteBook = asynchandler(async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: 'Book id is required' });

        // 1. Find the book first to get its details (like bookName and file paths)
        const book = await Books.findById(id).exec();
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // 2. Delete associated "trials" in UserBooks using the bookName
        // We use deleteMany in case multiple users have a trial for this book
        if (book.bookName) {
            await trials.deleteMany({ bookName: book.bookName });
        }

        // 3. Attempt to remove physical files from the server
        try {
            if (book.CoverImg) {
                const coverPath = path.join(__dirname, '..', 'Public', 'img', book.CoverImg);
                if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
            }
            if (book.EpubUri) {
                const epubPath = path.join(__dirname, '..', 'Public', 'uploads', book.EpubUri);
                if (fs.existsSync(epubPath)) fs.unlinkSync(epubPath);
            }
        } catch (fsErr) {
            console.error('File removal error:', fsErr.message || fsErr);
        }

        // 4. Finally, delete the book record itself
        await book.deleteOne();

        return res.status(200).json({ 
            message: 'Book and associated trials deleted successfully', 
            id 
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = DeleteBook;