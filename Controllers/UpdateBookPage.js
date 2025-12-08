const Userbook=require("../model/UserBooks")
const asynchandler=require('express-async-handler');

const Update=asynchandler(async(req,res)=>{

    try{
        const {cfi,chapter,progress,BookName,}=req.body;
            console.log(req.body)
        if(!BookName)return res.status(400).json({'message':'BookName i required'})

            const found=await Userbook.findOne({BookName}).exec()
            
            if(!found)res.status(404).json({'message':`${BookName} Not found`})

                if(cfi)found.cfi=cfi
                if(chapter)found.ChapterNumber=chapter;
                if(progress)found.readPercentage=progress;
                const BookMarks={
                    cfi,
                    progress,
                    
                }
                // if(BookMarks)found.BookMarks.push(BookMarks);

                await found.save();

                res.status(201).json(found);


    }catch(err){
        res.status(500).json({'message':err.message})
    }
})

module.exports=Update