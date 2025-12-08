 const Book = require("../model/Books");
const PurchasedBook = require("../model/Pursedbooks");
const User = require("../model/User");
const Userbook = require("../model/UserBooks");
const asyncHandler = require("express-async-handler");

const GetBooks = asyncHandler(async (req, res) => {

  // IMPORTANT: Replace this static ID with req.user.id or a dynamically passed ID in a real app
  console.log(req.query)
  const userId = req.query.id ; 

  try {
    const now = new Date();

    await Userbook.updateMany(
      {
        istrialend: false, 
        trialExpires: { $lt: now } // $lt means "less than" (i.e., in the past)
      },
      {
        $set: { istrialend: true }
      }
    );
    const user = await User.findById(userId)
      .populate('pursedBooksID').populate('TrialID');   
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const purchasedBookNames = new Set(
      user.pursedBooksID.map(pBook => pBook.BookName)
    );

    // Map 2: Trial Status and Progress (for mapping trial data)
    const trialStatusMap = new Map();
    user.TrialID.forEach(trial => {
      // We use BookName as the key to link the trial status back to the master book
      trialStatusMap.set(trial.BookName, {
        isFreeTrial: !trial.istrialend, // Active if not ended
        istrialend: trial.istrialend,
        trialExpires: trial.trialExpires,
        cfi: trial.cfi,
        BookMarks: trial.BookMarks,
        price: trial.price,
        categories: trial.categories,
        PurchasedDate:trial?.PurchasedDate,
        readPercentage: trial.readPercentage || 0,
      });
    });

    const allBooks = await Book.find({})
      .select('BookName Author CoverImg description EpubUri categories price'); 


    const mappedBooks = allBooks.map(book => {
      const bookName = book.BookName;
      const isPurchased = purchasedBookNames.has(bookName);
      const trialData = trialStatusMap.get(bookName);
      let accessStatus = 'Not Owned';
      let finalReadPercentage = 0;
      if (isPurchased) {
        accessStatus = 'Purchased';
      } else if (trialData) {
        if (trialData.isFreeTrial) {
          accessStatus = 'Active Trial';
        } else {
          accessStatus = 'Trial Expired';
        }
        finalReadPercentage = trialData.readPercentage;
      }

      
      return {
        _id: book._id,
        BookName: book.BookName,
        Author: book.Author,
        CoverImg: book.CoverImg,
        description: book.description,
        EpubUri: book.EpubUri,
        title: book.title,
        accessStatus: accessStatus,
        isPurchased: isPurchased,
        isFreeTrial: trialData ? trialData.isFreeTrial : false,
        istrialend: trialData ? trialData.istrialend : false,
        trialExpires: trialData ? trialData.trialExpires : null,
        cfi:trialData?.cfi,
         categories:trialData?.categories||book.categories,
        BookMarks:trialData?.BookMarks||[],
        price:trialData?.price||book?.price,
        PurchasedDate:trialData?.PurchasedDate,
        readPercentage: Math.round(trialData?.readPercentage), 
      };
    });

    // 6. Send the mapped array to the client
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