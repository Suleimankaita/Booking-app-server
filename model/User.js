const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
   NameId:{type:mongoose.Types.ObjectId,
        ref:"name"},
    Username:{
        type:String,
        unique: true, 
        index: true
    },
    email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
}
,
     isotp:{
        expireresAt:Number,
        otp:Number,
    },
    pursedBooksID:[{type:mongoose.Types.ObjectId,
        ref:"PurchasedBook"}],
    
    TrialID:[{type:mongoose.Types.ObjectId, 
        ref:"UserBook"}],
    
    password:{
        type:String,
    },
    
    Role:{
        type:String,
        default:"User"
    }

    
},{
    timestamps:true
}
)

module.exports=mongoose.model("E-Book-Registration",UserSchema)