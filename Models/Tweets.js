const TweetsSchema=require('../Schemas/Tweets');
const constants=require('../constants');
const ObjectId=require('mongodb').ObjectId;


class Tweets{

    title;
    bodyText;
    userId;
    creationDateTime;
    tweetId;

    constructor({title,bodyText,userId,creationDateTime,tweetId})
    {
        this.bodyText=bodyText;
        this.creationDateTime=creationDateTime;
        this.userId=userId;
        this.title=title;
        this.tweetId=tweetId;
    }

    createTweet(){
        return new Promise(async(resolve ,reject)=>{

            this.title.trim();
            this.bodyText.trim();

            const tweet=new TweetsSchema({
                title:this.title,
                bodyText:this.bodyText,
                userId:this.userId,
                creationDateTime:this.creationDateTime
            })

            try{
                
            const dbTweet=await tweet.save();
            
            return resolve(dbTweet);
            }
            catch(err){
               return reject(err);
            }


        })
    }

    editTweet(){
        return new Promise(async(resolve,reject)=>{
            let newTweetData={};
            if(this.title){
                newTweetData.title=this.title;
            }
            if(this.bodyText){
                newTweetData.bodyText=this.bodyText;
            }

            try{
                const oldTweetData=await TweetsSchema.findOneAndUpdate({_id:this.tweetId},newTweetData);
                resolve(oldTweetData);
            }
            catch(err){
                return reject(err);
            }
        })
    }

    deleteTweet(){
        return new Promise(async(resolve,reject)=>{

            try{

               // const tweetData=await TweetsSchema.findOneAndDelete({_id:this.tweetId});
               const tweetData=await TweetsSchema.findOneAndUpdate({_id:this.tweetId},{isDeleted:true},{deletionDatetime:new Date()});

                resolve(tweetData);

            }
            catch(err){
                reject(err);

            }

        })
    }

    getTweetDatafromTweetId(){
        return new Promise(async(resolve,reject)=>{

            try{
                const tweetData=await TweetsSchema.findOne({_id:this.tweetId});
                resolve(tweetData);

            }
            catch(err){
                reject(err);
            }
        })
    }

    static getTweets(offset,followingUserIds){

        return new Promise(async (resolve,reject)=>{

            try{

                const dbTweets=await TweetsSchema.aggregate([
                   //sort ,pagination  
                   {$match :{userId:{$in:followingUserIds},isDeleted:{$ne:true}}},
                   {$sort:{"creationDateTime":-1}},
                   {$facet:{
                    data:[
                        {"$skip":parseInt(offset)}
                        ,{"$limit":constants.TWEETSLIMIT}
                    ]
                }}
                ])

                resolve(dbTweets[0].data);
 
                

            }
            catch(err){
                return reject(err);
            }

        })

        
    }

    static getMyTweets(offset,userId){

        return new Promise(async (resolve,reject)=>{

            try{

                const dbTweets=await TweetsSchema.aggregate([
                   //sort ,pagination  ,check userid
                   {$match:{userId:new ObjectId(userId),isDeleted:{$ne:true} }},
                   {$sort:{"creationDateTime":-1}},
                   {$facet:{
                    data:[
                        {"$skip":parseInt(offset)}
                        ,{"$limit":constants.TWEETSLIMIT}
                    ]
                }}
                ])

                resolve(dbTweets[0].data);
 
                

            }
            catch(err){
                return reject(err);
            }

        })

        
    }
}
module.exports=Tweets;