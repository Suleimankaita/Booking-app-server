const jwt=require("jsonwebtoken");
const asynchandler=require("express-async-handler");
const User=require("../model/User");

const login=asynchandler(async(req,res)=>{
    try{
    
        const {Username,password}=req.body;
    
    if(!Username||!password)return res.status(400).json
    ({message:"all field are required"})
    
    const found = await User.findOne({ Username })
  .collation({ locale: 'en', strength: 2 })
  .populate('NameId')
  .exec();

      console.log(found.NameId)
    if(!found.NameId.Active)return res.status(403).json({'message':'This account has been Suspended '})
    if(!found)return res.status(401).json({'message':`User not found`})
    if(found.Username!==Username||found.password!==password){
        return res.status(404).json({message:"invalid username or password"})
    }
    const accessToken=jwt.sign(
        {
            "UserInfo":{
                "username":found.Username,
                "password":found.password,
                "id":found._id,
                "Role":found.Role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1d'}
        )
        
        const refreshToken=jwt.sign(
          {
            "UserInfo":{
                "username":found.Username,
                "password":found.password,
                "id":found._id,
                "Role":found.Role
            }
        },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'7d'}
            )
            res.cookie('jwt',refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite:'None',
                Role:found.Role,
                maxAge:7*24*60*60*1000
            })
            res.status(201).json(accessToken)
}catch(err){
    res.status(400).json({message:err.message})
}

    }

)

module.exports=login