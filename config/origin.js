const allowedOrigin=require('./allowedOrigin')

 const origins={
    origin:(origin,cb)=>{
        if(allowedOrigin.includes(origin)||!origin){
            cb(null)
        }else{
            cb(new Error("Not Allowed by Cors origin "))
        }
    },
    credentials: true
} 

module.exports=origins