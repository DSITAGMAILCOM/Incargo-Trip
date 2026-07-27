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


module.exports = mongoose.models.Packing || mongoose.model('Packing', packingSchema);