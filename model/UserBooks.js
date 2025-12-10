const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
   
    ispurchased: {
        type: Boolean,
        default: false
    },
    isFreeTrial: {
        type: Boolean,
        default: false
    },
       categories:String,
    img:String,
    cfi:String,
    trialDays: {
        type: Number,
        default: 1
    },
    mt:{
            type:String,
            default:()=>{
                return Math.floor(99999,Math.random()*10000)+Math.floor(Math.random()*10000).toString('34')
            }
        },
    istrialend: {
        type: Boolean,
        default: false
    },
    trialExpires: {
        type: Date,
        default: function() {
            return  new Date(Date.now() +24*60*60*1000) 
        }
    },
    BookName: String,
    BookMarks: [{
        cfi:String,
        Chapters:String,
        Progress:Number,
    }],
    price:Number,
    title: String,
    ChapterNumber: String,
    readPercentage: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("UserBook", userBookSchema);
