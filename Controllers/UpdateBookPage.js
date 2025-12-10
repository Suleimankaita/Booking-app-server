const Userbook = require("../model/UserBooks");
const PursedBooks = require("../model/Pursedbooks"); // Fixed variable name casing
const asynchandler = require('express-async-handler');

const Update = asynchandler(async (req, res) => {
    // 1. Get data from body
    // 'mt' seems to be your unique book identifier based on your schema
    const { cfi, chapter, progress, BookName, mt } = req.body;

    console.log("Update Request for:", req.body);

    if (!mt && !BookName) {
        return res.status(400).json({ 'message': 'Book Identifier (mt) or BookName is required' });
    }

    // --- 2. LOGIC: Check Trial Collection First ---
    let bookDoc = await Userbook.findOne({ mt: mt }).exec();
    let collectionType = "Trial";

    // --- 3. If not in Trial, Check Purchased Collection ---
    if (!bookDoc) {
        bookDoc = await PursedBooks.findOne({ mt: mt }).exec();
        collectionType = "Purchased";
    }

    // --- 4. If found in NEITHER ---
    if (!bookDoc) {
        return res.status(404).json({ 'message': `Book not found in Trial or Purchased list` });
    }

    // --- 5. Apply Updates ---
    // Since both models likely have similar fields, we can update directly
    if (cfi) bookDoc.cfi = cfi;
    if (chapter) bookDoc.ChapterNumber = chapter; // Ensure schema field matches 'ChapterNumber'
    if (progress) bookDoc.readPercentage = progress;

    // Optional: Update Bookmarks if needed
    /* if (cfi && progress) {
        bookDoc.BookMarks.push({ cfi, Chapters: chapter, Progress: progress });
    }
    */

    // --- 6. Save and Respond ---
    await bookDoc.save();

    console.log(`Updated ${collectionType} book:`,);
    
    return res.status(200).json({
        message: "Book progress updated successfully",
        type: collectionType,
        book: bookDoc
    });
});

module.exports = Update;