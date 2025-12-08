const asynchandler=require('express-async-handler');
const User=require('../model/User')
const PurchasedBook=require('../model/Pursedbooks')
const Books=require('../model/Books')

const BuyBooks=asynchandler(async(req,res)=>{
    try{

        const {id,CoverImg,EpubUri,description,BookName,Author}=req.body;

        const found=await User.findOne({_id:id}).populate('pursedBooksID').exec();

        const findbook=found?.pursedBooksID.find(res=>res.BookName.includes(BookName))
        if(findbook) return res.status(409).json({'message':`${BookName} is already Purchased`})
             
           
        // const Purchasedfound=await Books.findOne({BookName}).collation({strength:2,locale:"en"}).exec()
      
        //           if(Purchasedfound)return res.status(409).json({'message':`${BookName} is already Purchased`})
             
        
        if(!found)return res.status(401).json({'message':`User not found`});

        const purId=await PurchasedBook.create({
            CoverImg,
            description,
            EpubUri,
            BookName,
            Author

        });

        found.pursedBooksID.push(purId._id);
        await found.save()

        res.status(201).json({'message':`new Book Purchased ${BookName}`})

    }catch(err){
        res.status(400).json({'message':err.message})
    }
})

module.exports=BuyBooks