const mongoose = require('mongoose');

var googleSchema=new mongoose.Schema({
        id:String,
        token:String,
        email:String,
        name:String
});
var gg=mongoose.model("google",googleSchema);


module.exports = {gg};