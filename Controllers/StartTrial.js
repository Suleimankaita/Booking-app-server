const UserBook = require("../model/UserBooks");
const User = require("../model/User");
const asyncHandler = require("express-async-handler");

const StartTrial = asyncHandler(async (req, res) => {
  const { Username, BookName } = req.body;

  // 1. Validation
  if (!Username || !BookName) {
    return res.status(400).json({ message: "Username and BookName required" });
  }

  // 2. Find User and Populate their current trials
  // We populate 'TrialID' so we can look inside the user's book history
  const user = await User.findOne({ Username: Username })
    .populate("TrialID") 
    .exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 3. Search inside the populated array
  // We look for a book with the same name that is marked as a free trial
  const existingTrial = user.TrialID.find(
    (book) => book.BookName === BookName && book.isFreeTrial === true
  );

  const now = new Date();

  // 4. Handle Existing Trial
  if (existingTrial) {
    // Check if the trial date has passed
    if (existingTrial.trialExpires && new Date(existingTrial.trialExpires) < now) {
      return res.status(200).json({
        message: "Trial previously started but expired",
        expired: true,
        trialExpires: existingTrial.trialExpires,
      });
    }

    // Trial is still valid
    return res.status(403).json({
      message: "You already have an active trial on this book",
      activeTrial: true,
      trialExpires: existingTrial.trialExpires,
    });
  }

  // 5. No trial exists → Create new trial
  const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const newTrial = await UserBook.create({
    userId: user._id, // (Ensure your UserBook schema has this field!)
    BookName: BookName,
    isFreeTrial: true,
    trialDays: 1,
    trialExpires: oneDayFromNow,
    readPercentage: 0,
    ChapterNumber: "1",
  });

  // 6. Push new trial ID to user account and save
  user.TrialID.push(newTrial._id);
  await user.save();

  return res.status(201).json({
    message: "Free trial started",
    trialExpires: oneDayFromNow,
    trial: newTrial,
  });
});

module.exports = StartTrial;