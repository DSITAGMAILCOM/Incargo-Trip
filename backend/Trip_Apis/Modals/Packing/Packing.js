const mongoose=require('mongoose');
const packingSchema=new mongoose.Schema({
    packingType:{
        type:String,
        required:true
    },
    packingDescription:{
        type:String,
        required:true
    },
    packingImage:{
        type:String,
        required:true
    }
})

const Packing=mongoose.model('Packing',packingSchema);
module.exports=Packing;