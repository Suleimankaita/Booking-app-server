const mongoose = require('mongoose');

const purchasedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "name",
    },
    CoverImg: String,
    title: String,
    EpubUri: String,
    description: String,
    BookName: String,
    price:Number,
    Author: String,
   categories:String,
    ChapterNumer: String,
    readPercentage: Number,
    Date: {
        type: String,
        default: () => new Date().toISOString().split("T")[0]
    },
    Time: {
        type: String,
        default: () => new Date().toLocaleTimeString()
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Book", purchasedSchema);
