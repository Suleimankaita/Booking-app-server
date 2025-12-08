const Pursedbooks = require('../model/Pursedbooks');
const asynchandler=require('express-async-handler');

const GetUsers=asynchandler(async(req,res)=>{

    try{
        const AllPursedbooks=await Pursedbooks.find()
        if(!AllPursedbooks)return res.status(404).json({'message':'No Purchase books to display'});
        
        res.status(201).json(AllPursedbooks) 
    }catch(err){
        res.status(500).json({'message':err.message})
    }
})

module.exports=GetUsers