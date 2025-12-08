const Trials=require('../model/UserBooks')
const asynchandler=require('express-async-handler');

const GetTrials=asynchandler(async(req,res)=>{

    try{
        const item=await Trials.find().lean()
        if(!item.length)return res.status(404).json({'message':'No Trials Book to display'});
        res.status(201).json(item);
         
    }catch(err){
        res.status(500).json({'message':err.message})
    }

})

module.exports=GetTrials