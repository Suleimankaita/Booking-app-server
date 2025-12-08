    const mongoose=require('mongoose');

    const purchasedSchema=new mongoose.Schema({
        CoverImg:String,
        BookName:String,
        EpubUri:String,
        price:Number,
        title: String,
        cfi:String,
           categories:String,
        Author:String,
        description:String,
          BookMarks: [{
        cfi:String,
        Chapters:String,
        Progress:Number,
    }],
        ispurchased:{
            type:Boolean,
            default:true
        },

        ChapterNumer:String,
        readPercentage:Number,
        PurchasedDate:{
            type:String,
            default:()=>new Date().toISOString().split("T")[0]
        },
        PurchasedTime:{
            type:String,
            default:()=>new Date().toLocaleTimeString()
        },
    },{
        timestamps:true
    }) 

    module.exports=mongoose.model("PurchasedBook",purchasedSchema)