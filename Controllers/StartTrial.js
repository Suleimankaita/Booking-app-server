// const Books = require("../model/Books");
// const UserBook = require("../model/UserBooks");
// const User = require("../model/User");
// const asyncHandler = require("express-async-handler");

// const StartTrial = asyncHandler(async (req, res) => {
//   const { userId, bookId, Username, BookName } = req.body;

//   // Validate the user
//   const user = await User.findOne({ Username }).exec();
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const now = new Date();

//   // Check if this user already has a record for this book
//   const userBook = await UserBook.findOne({ BookName}).exec();

//   if (userBook) {
//     // Trial was already started in the past
//     if (userBook.isFreeTrial) {

//       // Case 1: Trial still active
//       if (userBook.trialExpires > now) {
//         return res.status(400).json({
//           message: "Trial is already active",
//           expiresAt: userBook.trialExpires,
//         });
//       }

//       // Case 2: Trial expired — DO NOT allow new trial
//       return res.status(403).json({
//         message: "Your free trial for this book has expired. You cannot start another trial.",
//         expiredAt: userBook.trialExpires,
//       });
//     }

//     // UserBook exists but without trial flag (rare case)
//     return res.status(403).json({
//       message: "You already have access record for this book. Trial cannot be started.",
//     });
//   }

//   // No previous record → allow first-time trial
//   const trialExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

//   const newTrial = await UserBook.create({
//     userId,
//     bookId,
//     BookName,
//     isFreeTrial: true,
//     trialExpires,
//     readPercentage: 0,
//     ChapterNumber: null,
//   });

//   return res.status(201).json({
//     message: "Trial started",
//     trialExpires: newTrial.trialExpires,
//   });
// });

// module.exports = StartTrial;
const UserBook = require("../model/UserBooks");
const User = require("../model/User");

const StartTrial = async (req, res) => {
  try {
    const { Username, BookName } = req.body;

    if (!Username || !BookName) {
      return res.status(400).json({ message: "Username and BookName required" });
    }

    // Check user exists
    const user = await User.findOne({ Username: Username }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if this user already has a trial for this book
    let existingTrial = await UserBook.findOne({
       BookName,
      // isFreeTrial: true,
    }).exec();

    console.log(existingTrial)
    const now = new Date();

    if (existingTrial) {
      // 1. Trial exists but expired
      if (existingTrial.trialExpires < now) {
        return res
          .status(200)
          .json({ 
            message: "Trial previously started but expired", 
            expired: true,
            trialExpires: existingTrial.trialExpires,
          });
      }

      // 2. Trial exists and still active
      return res.status(403).json({
        message: "You already have an active trial on this book",
        activeTrial: true,
        trialExpires: existingTrial.trialExpires,
      });
    }

    // 3. No trial exists → create new trial
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newTrial = await UserBook.create({
      userId: user._id,
      BookName: BookName,
      isFreeTrial: true,
      trialDays: 1,
      trialExpires: expires,
      readPercentage: 0,
      ChapterNumber: "1"
    });

    // Push trial to user account
    user.TrialID.push(newTrial._id);
    await user.save();

    return res.status(201).json({
      message: "Free trial started",
      trialExpires: expires,
      trial: newTrial,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = StartTrial;
