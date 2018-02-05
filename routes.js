
var {User}=require('./models/Users');

module.exports=(app,passport)=>{

    app.get('/',(req,res)=>{
        console.log("In get ");
        res.send({msg:"success"});
    });
    app.get('/profile',(req,res)=>{
        res.send({msg:"user"});
    });

    // google ROUTES
    app.get('/auth/google', passport.authenticate('google',
        //{  scope : ['public_profile', 'email']}
        { scope: ['profile','email'] }
        )
    );

    app.get('/auth/google/callback',passport.authenticate('google', {

            successRedirect: '/profile',
            failureRedirect: '/'
        }
    ));

};