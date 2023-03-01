const express=require('express');
const tweetsRouter=express.Router();

const Tweets=require('../Models/Tweets');

tweetsRouter.post('/create-tweet',async (req,res)=>{

    const{title,bodyText}=req.body;
    const {userId}=req.session.user;

    if(!title || !bodyText)
    {
        res.send({
            status:601,
            message:"parameters missing"

        })
    }

    if(!userId){
        return res.send({
            status:400,
            message:"Invalid UserId"
        })
    }

    if(typeof(title)!=='string' || typeof(bodyText)!='string'){
        return res.send({
            status:400,
            message:"title and bodytext should be only text"
        })
    }

    if(title.length>200 || bodyText > 1000){
        return res.send({
            status:401,
            message:"Title and bodytext too long. Allowed chars for title is 200 and bodyText is 1000"
        })
    }

    const creationDateTime=new Date();

    const Tweet=new Tweet({title,bodyText,creationDateTime,userId});

    try{

        const dbTweet= await Tweet.createTweet();

        return res.send({
            status:200,
            message:"Tweet posted successfully",
            data:dbTweet
        })
    }
    catch(err){
        return res.send({
            status:404,

        })
    }
})

module.exports=tweetsRouter;
