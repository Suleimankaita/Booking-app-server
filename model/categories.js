const { default: mongoose } = require('mongoose');
const moongose=require('mongoose');

const Categories=new moongose.Schema({
    categories:[{
        name:String
    }]
},{
    timestamps:true
}

)

module.exports=mongoose.model("category",Categories)