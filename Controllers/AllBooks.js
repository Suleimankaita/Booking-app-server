const Book = require("../model/Books");
const PurchasedBook = require("../model/Pursedbooks"); 
const User = require("../model/User"); 
const Userbook = require("../model/UserBooks"); 
const asyncHandler = require("express-async-handler");

const GetBooks = asyncHandler(async (req, res) => {
    // NOTE: This endpoint provides GLOBAL analytics data across all books and all users.

    try {
        const now = new Date();

        // 1. CRITICAL: Update Expired Trials (Ensures data accuracy)
        await Userbook.updateMany(
            {
                istrialend: false, 
                trialExpires: { $lt: now } 
            },
            {
                $set: { istrialend: true }
            }
        );

        // --- 2. FETCH ALL USERS FIRST (as requested) ---
        // Fetch all users and populate their purchased and trial lists.
        const allUsers = await User.find({})
            .populate('pursedBooksID')
            .populate('TrialID');

        // Master map to store aggregated engagement data for all books
        // Key: BookName
        // Value: { purchasedUsers: [], activeTrialUsers: [] }
        const bookEngagementMap = new Map();

        // --- 3. LOOP THROUGH ALL USERS AND AGGREGATE DATA MANUALLY ---
        for (const user of allUsers) {
            const userDetails = {
                _id: user._id,
                Username: user.Username,
                email: user.email,
            };

            // Process Purchased Books
            user.pursedBooksID.forEach(pBook => {
                const bookName = pBook.BookName;
                if (!bookEngagementMap.has(bookName)) {
                    bookEngagementMap.set(bookName, { purchasedUsers: [], activeTrialUsers: [] });
                }
                const engagementData = bookEngagementMap.get(bookName);

                engagementData.purchasedUsers.push({
                    user: userDetails,
                    isPurchased: true,
                    PurchasedDate: pBook.PurchasedDate || `${pBook.Date} ${pBook.Time}`,
                });
            });

            // Process Trial Books
            user.TrialID.forEach(tBook => {
                // Only process active trials
                if (!tBook.istrialend) {
                    const bookName = tBook.BookName;
                    if (!bookEngagementMap.has(bookName)) {
                        bookEngagementMap.set(bookName, { purchasedUsers: [], activeTrialUsers: [] });
                    }
                    const engagementData = bookEngagementMap.get(bookName);

                    engagementData.activeTrialUsers.push({
                        user: userDetails,
                        isFreeTrial: true,
                        trialExpires: tBook.trialExpires,
                        readPercentage: tBook.readPercentage,
                    });
                }
            });
        }

        // 4. Fetch ALL available books from the master Book collection
        const allBooks = await Book.find({})
            .select('BookName Author CoverImg description EpubUri categories price title _id');

        // 5. Merge the master book catalog with the aggregated engagement data
        const booksWithEngagement = allBooks.map(book => {
            const bookName = book.BookName;
            // Get the aggregated data for this book, or empty arrays if no user engagement exists
            const engagementData = bookEngagementMap.get(bookName) || { purchasedUsers: [], activeTrialUsers: [] };

            return {
                // Core Book Details (From Master Catalog)
                _id: book._id,
                BookName: book.BookName,
                Author: book.Author,
                CoverImg: book.CoverImg,
                description: book.description,
                EpubUri: book.EpubUri,
                categories: book.categories,
                price: book.price,
                title: book.title,
                
                // Aggregated Data (From User Loops)
                totalPurchased: engagementData.purchasedUsers.length,
                totalActiveTrials: engagementData.activeTrialUsers.length,
                purchasedUsers: engagementData.purchasedUsers,
                activeTrialUsers: engagementData.activeTrialUsers,
                readPercentage: engagementData.readPercentage,
            };
        });

        // 6. Send the merged list to the client
        return res.status(200).json(booksWithEngagement);

    } catch (error) {
        console.error('Error fetching global book engagement data (Manual Merge):', error);
        return res.status(500).json({ 
            message: 'An internal error occurred while retrieving global book engagement data.', 
            error: error.message 
        });
    }
});

module.exports = GetBooks;