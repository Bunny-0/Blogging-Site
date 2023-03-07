const express=require('express');
const FollowRoute=express.Router();

const { validateMongoDbUserID }=require('../Utils/Follow');
// const UserSchema=require('../Schemas/User');
// const FollowSchema=require('../Schemas/Follow');
const User=require('../Models/User');
const {followUser}=require('../Models/Follow');

FollowRoute.post('/follow-user',async (req,res)=>{

    const followerUserId=req.session.user.userId;
    const followingUserId=req.body.followingUserId;

    //check IDs are valid
    if(!validateMongoDbUserID(followingUserId)){
        return res.send({
            status:400,
            message:"Invalid user id"
        })

    }
    if(followerUserId===followingUserId){
        return res.send({
            status:404,
            message:"You cannnot follow urself"
        })
    }
    //check wheather this user exists in my db.

    try{
        const userDb=await User.verifyUserIdExists(followingUserId);

       if(!userDb){
        return res.send({
            status:401,
            message:'No User Found'
        })
       }
       //if the user is currently following the user
       const followDb=await followUser({followerUserId,followingUserId});

       return res.send({
        status:200,
        message:"User successfully followed",
        data:followDb
       })


    }
    catch(err){
        return res.send({
            status:400,
            message:"Internal Error",
            error:err
        })
    }

    //if the user is currently following the user
    //create the entry in db 

    

})


module.exports=FollowRoute;