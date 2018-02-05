const express=require('express');
const passport=require('passport');
const bodyParser=require('body-parser');
const {mongoose}=require("../db/conn");
const {gg}=require("../models/Users");
var cors=require('cors');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var LocalStrategy=require('passport-local').Strategy;

var configAuth=require("./auth");
var app=express();

passport.serializeUser((user,done)=>{
    console.log("serializer");
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    console.log("deserializer");
    done(null,user);
});
//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    encoded:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(`Access-Control-Allow-Methods`, `POST`);
    res.header(`Access-Control-Expose-Headers`, `x-auth`);
    next();
});

passport.use("google",new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    // google will send back the token and profile
    (accessToken, refreshToken, profile, done)=> {
        // asynchronous // Event Loop
        console.log(profile);

            //find the user in the database based on their facebook id
            gg.findOne({ 'id' : profile.id }, (err, user)=> {

               // console.log('start gg');

                // if there is an error, stop everything and return that error connecting to the database
                if (err) return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new gg({
                        id:profile.id,
                        token:accessToken,
                        name:profile.displayName,
                        email:profile.emails[0].value
                    });
                    console.log(newUser);

                    // save our user to the database
                    newUser.save().then((doc)=>{
                        console.log("Saved User :: = "+doc);
                        return doc;
                    }).catch((err)=>{
                        console.log("User Error :: = "+err);
                        return err;
                    });
                }

            });
    }));





// app.post('/passUser',passport.authenticate('local',(req, res, err) => {
//     if(err) {
//         console.log(err);
//     }
//     res.json({message:"Success"});
// }));


// app.post('/passUser',passport.authenticate('local',(res)=>{
//     console.log('sucess');
//   res.json({message:"Success"});
// }));
// app.get('/suc',(req,res)=>{
//     res.json({message:"Success"});
// });
// app.get('/err',(req,res)=>{
//     console.log('Fail');
//     res.json({message:"Fail"});
// });

//insert
// app.post('/loginUser',(req,res)=>{
//     var usr=new loginUser({
//         username: req.body.username,
//         password: req.body.password
//     });
//     usr.save().then((docs)=>{
//         console.log(docs);
//         res.send(docs);
//     }).catch((err)=>{
//         console.log(err);
//         res.send(err);
//     });
// });
//get
// app.get('/loginUser',(req,res)=>{
//     loginUser.find().then((docs)=>{
//         console.log(docs);
//         res.send(docs);
//     }).catch((err)=>{
//         console.log(err);
//         res.send(err);
//     });
// });
require('../routes')(app,passport);
app.listen(5555,()=>{
    console.log('connected to server....');
});


