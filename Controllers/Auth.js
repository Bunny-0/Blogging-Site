const express=require('express');

const {cleanUpAndValidate}=require('../Utils/Auth');

const User=require('../Models/User');

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
        const dbUser= await User.loginUser({loginId,password});
        req.session.isAuth=true;
        req.session.user={
            email:dbUser.email,
            username:dbUser.username,
            name:dbUser.name
        }
        return res.send({
            status:200,
            message:"logged in successfully",
            data:{
                email:dbUser.email,
                username:dbUser.username,
                name:dbUser.name,
                _id:dbUser._id
            }
        })
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

module.exports=authRouter;