var mongoose=require("mongoose");
//var Schema=mongoose.Schema;
 var ProductSchema=new mongoose.Schema({
    pname:String,
     price:Number,
     updated_at:{ type:Date,default:Date.now}
});
 module.exports=mongoose.model('ProductCol',ProductSchema);
