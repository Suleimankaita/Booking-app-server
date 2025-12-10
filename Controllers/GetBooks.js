const Book = require("../model/Books");
const PurchasedBook = require("../model/Pursedbooks");
const User = require("../model/User");
const Userbook = require("../model/UserBooks");
const asyncHandler = require("express-async-handler");

const GetBooks = asyncHandler(async (req, res) => {
  const userId = req.query.id;

  try {
    const now = new Date();

    // 1. Mark expired trials
    await Userbook.updateMany(
      { istrialend: false, trialExpires: { $lt: now } },
      { $set: { istrialend: true } }
    );

    // 2. Fetch User and Populate both Trial and Purchased books
    const user = await User.findById(userId)
      .populate('pursedBooksID')
      .populate('TrialID');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // --- 3. Map Purchased Books Data (FIXED) ---
    // Now extracting cfi, readPercentage, and BookMarks from purchased books too
    const purchasedBookSet = new Set();
    const purchasedBookMap = new Map();

    if (user.pursedBooksID) {
      user.pursedBooksID.forEach(pBook => {
        if (pBook.BookName) {
          purchasedBookSet.add(pBook.BookName);
          purchasedBookMap.set(pBook.BookName, {
            mt: pBook.mt,
            PurchasedDate: pBook.createdAt || pBook.updatedAt,
            cfi: pBook.cfi,
            readPercentage: pBook.readPercentage || 0,
            BookMarks: pBook.BookMarks || [],
            categories: pBook.categories
          });
        }
      });
    }

    // --- 4. Map Trial Books Data ---
    const trialStatusMap = new Map();
    if (user.TrialID) {
      user.TrialID.forEach(trial => {
        trialStatusMap.set(trial.BookName, {
          isFreeTrial: !trial.istrialend,
          istrialend: trial.istrialend,
          trialExpires: trial.trialExpires,
          cfi: trial.cfi,
          BookMarks: trial.BookMarks,
          price: trial.price,
          categories: trial.categories,
          PurchasedDate: trial.PurchasedDate,
          mt: trial.mt,
          readPercentage: trial.readPercentage || 0,
        });
      });
    }

    // --- 5. Fetch Master Book List ---
    const allBooks = await Book.find({})
      .select('BookName Author CoverImg description EpubUri categories price title');

    // --- 6. Combine Data ---
    const mappedBooks = allBooks.map(book => {
      const bookName = book.BookName;
      
      const isPurchased = purchasedBookSet.has(bookName);
      const purchasedData = purchasedBookMap.get(bookName);
      const trialData = trialStatusMap.get(bookName);

      // Determine which data source to use for progress (Purchased takes priority)
      const activeData = isPurchased ? purchasedData : trialData;

      let accessStatus = 'Not Owned';
      if (isPurchased) {
        accessStatus = 'Purchased';
      } else if (trialData) {
        if (trialData.isFreeTrial) {
          accessStatus = 'Active Trial';
        } else {
          accessStatus = 'Trial Expired';
        }
      }

      return {
        _id: book._id,
        BookName: book.BookName,
        title: book.title, 
        Author: book.Author,
        CoverImg: book.CoverImg,
        description: book.description,
        EpubUri: book.EpubUri,
        price: activeData?.price || book.price,
        categories: activeData?.categories || book.categories,
        
        // Status Flags
        accessStatus: accessStatus,
        isPurchased: isPurchased,
        isFreeTrial: trialData ? trialData.isFreeTrial : false,
        istrialend: trialData ? trialData.istrialend : false,
        trialExpires: trialData ? trialData.trialExpires : null,
        PurchasedDate: activeData?.PurchasedDate,

        // Progress Data (Now works for both Purchased and Trial)
        mt: activeData?.mt,
        cfi: activeData?.cfi,
        readPercentage: Math.round(activeData?.readPercentage || 0),
        BookMarks: activeData?.BookMarks || [],
      };
    });

    return res.status(200).json(mappedBooks);

  } catch (error) {
    console.error('Error fetching unified book status for user:', userId, error);
    return res.status(500).json({ 
      message: 'An internal error occurred while retrieving book data.', 
      error: error.message 
    });
  }
});

module.exports = GetBooks;