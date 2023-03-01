//packages imports
const express=require('express');
const session=require('express-session');
const MongoDbSession=require('connect-mongodb-session')(session);
//Files imports
const constants=require('./private_constants');


//controllers
const AuthRouter=require('./Controllers/Auth');
const TweetsRouter=require('./Controllers/Tweets');
const app=express();

const store=new MongoDbSession({
    uri:constants.MONGOURI,
    collection:'tb_sessions'
}) 

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:constants.SESSIONSECRETKEY,
    resave:false,
    saveUninitialized:false,
    store:store

})) 

//controllers
app.use('/auth',AuthRouter);
app.use('/tweets',TweetsRouter);

app.get('/',(req,res)=>{
    res.send({
        status:200,
        message:"welcome"
    })
})


module.exports=app;
