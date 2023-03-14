const express=require('express');

const {cleanUpAndValidate,isAuth}=require('../Utils/Auth');

const User=require('../Models/User');
const UserSchema = require('../Schemas/User');

const authRouter=express.Router();

authRouter.post('/login',async(req,res)=>{

    const {loginId,password}=req.body;
    if(!loginId|| !password){
        return res.send({
            status:500,
            message:"parameter missing"
        })
    }

    try{
        console.log("Hey");
        const dbUser= await User.loginUser({loginId,password});
        console.log(dbUser);
        req.session.isAuth=true;
        console.log("yes");
        req.session.user={
            email:dbUser.email,
            username:dbUser.username,
            name:dbUser.name,
            userId:dbUser._id
        }
        return res.send({
            status:200,
            message:"logged in successfully",
            data:{
                email:dbUser.email,
                username:dbUser.username,
                name:dbUser.name,
                _id:dbUser._id
            }})
    }
    catch(err){

        return res.send({
            status:404,
            message:"Database error while checking loginUser",
            error:err
        })
        

    }



})
authRouter.post('/register',async(req,res)=>{

    const {username,email,name,password,phone}=req.body;
    
    cleanUpAndValidate({username,email,name,password,phone}).then(async()=>{
        try{

            await User.verifyUsernameAndEmailExists({username,email});
    
        }
        catch(err){
            return res.send({
                status:401,
                message:err
            })
        }
        const user=new User({name,password,username,email,phone});

    try{
        const dbUser=await user.registerUser();

        return res.send({
            status:200,
            message:"Registration Successfully",
            data:dbUser
        })
    }
    catch(err){
        return res.send({
            status:402,
            message:"Database error. please try again",
            err:err
        })
    }
    })
    .catch(err=>{
        return res.send({     
            status:403,
            message:err,
            data:"inside catch block of Auth Controller"
        })
    });

    

    //save user in db
    //verify if it is an existing user.

  
    
    
})
authRouter.post('/logout',isAuth,(req,res)=>{

    const userData=req.session.user;
    req.session.destroy(err=>{
        if(err){
            return res.send({
                status:404,
                 message:"logout unsuccessfull,try again",
                error:err
            })
        }
        return res.send({
            status:200,
            message:"logged out successfully",
            data:userData
        })
    })
})

module.exports=authRouter;