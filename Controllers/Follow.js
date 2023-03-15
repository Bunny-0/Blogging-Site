const express=require('express');
const FollowRouter=express.Router();

const { validateMongoDbUserID }=require('../Utils/Follow');
const User=require('../Models/User');
const {followUser,followingUserList,followerUserList,unfollowUser}=require('../Models/Follow');
const constants = require('../constants');

const {isAuth}=require('../Utils/Auth');



FollowRouter.post('/follow-user',isAuth,async (req,res)=>{

    const followerUserId=req.session.user.userId;
    const followingUserId=req.body.userId;

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

    // try{
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


    // }
    // catch(err){
    //     return res.send({
    //         status:400,
    //         message:"Internal Error",
    //         error:err
    //     })
    // }


    //if the user is currently following the user
    //create the entry in db 

    

})

FollowRouter.get('/following-list/:userId/:offset',isAuth,async (req,res)=>{
    const { userId,offset }=req.params || 0;
    if(!validateMongoDbUserID(userId)){
        return res.send({
            status:200,
            message:"UserId Invalid"
        })

    }

    try{
        const userDb=await User.verifyUserIdExists(userId);

       if(!userDb){
        return res.send({
            status:401,
            message:'No User Found'
        })
       }
                
       const followingUserDetails=await followingUserList({followerUserId:userId,offset,limit:constants.FOLLOWLIMIT});

       return res.send({
        status:200,
        message:"Read Suiccessfull",
        data:followingUserDetails
       })
    }
    catch(err){
        return res.send({
            status:401,
            message:"Internal error",
            error:err

        })
    }

})

FollowRouter.get('/follower-list/:userId/:offset',isAuth,async (req,res)=>{
    const { userId,offset }=req.params || 0;
    if(!validateMongoDbUserID(userId)){
        return res.send({
            status:200,
            message:"UserId Invalid"
        })

    }

    try{
        const userDb=await User.verifyUserIdExists(userId);

       if(!userDb){
        return res.send({
            status:401,
            message:'No User Found'
        })
       }
                
       const followerUserDetails=await followerUserList({followingUserId:userId,offset,limit:constants.FOLLOWLIMIT});
 
       return res.send({
        status:200,
        message:"Read Suiccessfull",
        data:followerUserDetails
       })
    }
    catch(err){
        return res.send({
            status:401,
            message:"Internal error",
            error:err

        })
    }

})

FollowRouter.post('/unfollow-user',isAuth,async (req,res)=>{
    const followerUserId=req.session.user.userId;
    const followingUserId=req.body.userId;

    

    try{

        const followDb=await unfollowUser({followerUserId,followingUserId});
        return res.send({
            status:200,
            message:"unfollow successfully",
            data:followDb
        })



    }
    catch(err){
        return res.send({
            status:400,
            message:"Operation Unsuccessful",
            error:err
        })
    }

})


module.exports=FollowRouter;