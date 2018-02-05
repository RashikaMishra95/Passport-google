var mongoose=require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/GoogleDB").then(() =>  console.log('Connection Successful'))
    .catch((err) => console.error(err));
module.exports={mongoose};