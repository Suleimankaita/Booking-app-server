const mongoose=require('mongoose')
const asynchandler=require('express-async-handler');

const connect=asynchandler(async(req,res)=>{
    try{
        await mongoose.connect(process.env.DBURI)
    }catch(err){
        res.status(400).json({'message':err.message})
    }
})
module.exports=connect;