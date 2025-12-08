    const mongoose=require('mongoose');
    
    const Name=new mongoose.Schema({
        firstname:String,
        lastname:String,
        email:String,
        img:{    
            type:String,
            default:""
        },
        Birth:String,
        Active:{
        type:Boolean,
        default:true
    },
    },{
        timestamps:true
    }
    )
    
    module.exports=mongoose.model("name",Name)