const GetPurchased=require('../model/Pursedbooks')
const asynchandler=require('express-async-handler');

const GetPurchase=asynchandler(async(req,res)=>{

    try{
        const item=await GetPurchased.find().lean()
        if(!item.length)return res.status(404).json({'message':'No Purchased Books to display'});
        res.status(201).json(item);
         
    }catch(err){
        res.status(500).json({'message':err.message})
    }

})

module.exports=GetPurchase