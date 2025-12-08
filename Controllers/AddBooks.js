 const asynchandler=require('express-async-handler');
const User=require('../model/User')
const Books=require('../model/Books')
const path=require('path')
const AddBooks=asynchandler(async(req,res)=>{
    try{

        const {description,BookName,Author,categories,price,title}=req.body;
        console.log(req.body)
        const EpubUri=req.files['epub'][0]?.filename
        const CoverImg=req.files['file'][0]?.filename
        console.log("BookName",BookName)
        console.log("epub",EpubUri)
        console.log("CoverImg",CoverImg)
        if(!CoverImg||!EpubUri||!description||!BookName||!Author||!categories||!price||!title)return res.status(400).json({'message':`All field are required to add ${BookName}`})

            const found=await Books.findOne({BookName}).collation({strength:2,locale:"en"}).exec()
            
            if(found)return res.status(409).json({'message':`${BookName} is already exist`})
                if(path.extname(EpubUri).toLowerCase()!==".epub")return res.status(400).json({'message':`Sorry, only EPUB files are supported. Please upload a valid EPUB file.`}) 
                

        const ms=await Books.create({
            CoverImg,
            description,
            EpubUri,    
            BookName,
            price:Number(price),
            Author,
            categories
            // ispurchased:false

        });

        console.log(ms)

        res.status(201).json({'message':`new Book Created ${BookName}`})

    }catch(err){
        res.status(400).json({'message':err.message})
    }
})

module.exports=AddBooks