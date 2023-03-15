const express=require('express');
const tweetsRouter=express.Router();

const Tweets=require('../Models/Tweets');
const{isAuth}= require('../Utils/Auth');
const {getFeedFollowingList }=require('../Utils/Tweet');

tweetsRouter.post('/create-tweet',isAuth,async (req,res)=>{

    const{title,bodyText}=req.body;
    const {userId}=req.body;//req.session.user;

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

     const creationDateTime= new Date();

    const Tweet=new Tweets({title,bodyText,creationDateTime,userId});

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
            errp:err
            

        })
    }
})

tweetsRouter.get('/get-tweets',async (req,res)=>{

    const offset=req.query.offset ||0;
    const userId=req.session.user.userId;

    try{
    const followingUserIds=await getFeedFollowingList(userId);
   
    const dbTweets=await Tweets.getTweets(offset,followingUserIds);

    res.send({
        status:200,
        message:"read successfull ",
        data:dbTweets
    })
}
catch(err) {
    return res.send({
        status:400,
        message:"Internal error in get tweets api",
        error:err
    })
}
    



    
});

tweetsRouter.get('/get-my-tweets/:userId',isAuth,async (req,res)=>{

    const offset=req.query.offset ||0;
    const userId=req.params.userId;
    //const userId=req.session.user.userId;

    try{
    const dbTweets=await Tweets.getTweets(offset,userId);

    res.send({
        status:200,
        message:"read successfull ",
        data:dbTweets
    })
}
catch(err) {
    return res.send({
        status:400,
        message:"Internal error in get tweets api",
        error:err
    })
}
    



    
})


tweetsRouter.post('/edit-tweet/:userId',isAuth,async(req,res)=>{
    
    if(!req.body.tweetId || !req.body.data){
        return res.send({
            status:500,
            message:"Parameter missing "
        })
    }
    const {tweetId,data:{title,bodyText}}=req.body;
    const {userId}=req.params;

    if(!title && !bodyText){

        return res.send({ 
            status:400,
            message:"empty data , in edit tweet ",
            error:" Missing title and bodyText"
        })
    }
    if(title && typeof(title)!=='string'){
        return res.send({
            status:400,
            message:"Title should be only text"
        })
    }

    if(title.length>200 || bodyText > 1000){
        return res.send({
            status:401,
            message:"Title and bodytext too long. Allowed chars for title is 200 and bodyText is 1000"
        })
    }
    if(bodyText && typeof(bodyText)!=='string'){
        return res.send({ 
            status:400,
            message:"bodytext should be only text"
        })
    }
    try{

        //check wheather this tweet actually belongs to the user
        const tweet=new Tweets({title,bodyText,tweetId});
        const tweetData=await tweet.getTweetDatafromTweetId();
        console.log(userId+" "+tweetData.userId);
        if(userId.toString()!==tweetData.userId.toString()){
            return res.send({
                status:400,
                message:"edit not allowed,tweet is owned by some other user",
                
            })
        }

        //edit the tweet
        //1.verify the creartion dateTime

        const currentDateTime=Date.now();
        const creationDateTime=new Date(tweetData.craetionDateTime);
        const diff=(currentDateTime-creationDateTime.getTime())/(1000*60);//diff in minutes
        if(diff > 30){
            return res.send({
                status:400,
                message:"Edit not allowed afterr 30 seconds of tweeting"
            })
        }

        //update the tweets in db.

        const tweetDb=await tweet.editTweet();

        return res.send({
            status:200,
            message:"edit successfull",
            data:tweetDb

        })



    }
    catch(err){
        return res.send({
            status:401,
            message:"internal error",
            error:err
        })
    }

})

tweetsRouter.post('/delete-tweet',isAuth,async(req,res)=>{

    
    const {tweetId}=req.body;
    const {userId}=req.session.user;

    if(!tweetId){
        return res.send({
            status:500,
            message:"Parameter Missing."
        })
    }

    try{

        const tweet=new Tweets({tweetId,userId});
        
        const tweetData= await tweet.getTweetDatafromTweetId();
        if(userId.toString()!==tweetData.userId.toString()){
            return res.send({
                status:400,
                message:"Delete not allowed,tweet is owned by some other user",
                
            })
        }

        const tweetDb=await tweet.deleteTweet();
        return res.send({
            status:200,
            message:"Delete successful",
            data:tweetDb
        })


    }
    catch(err){
        return res.send({
            status:400,
            message:"Internal Error",
            error:err 
        })       

    }

})

module.exports=tweetsRouter;
