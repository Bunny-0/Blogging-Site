const TweetsSchema=require('../Schemas/Tweets');
const constants=require('../constants');


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

    getTweetDatafromTweetId(){
        return new Promise(async(resolve,reject)=>{

            try{
                const tweetData=TweetsSchema.findOne({_id:this.tweetId});
                resolve(tweetData);

            }
            catch(err){
                reject(err);
            }
        })
    }

    static getTweets(offset){

        return new Promise(async (resolve,reject)=>{

            try{

                const dbTweets=await TweetsSchema.aggregate([
                   //sort ,pagination  
                   {$sort:{"creationDateTime":-1}},
                   {$facet:{
                    data:[
                        {"$skip":parseInt(offset)}
                        ,{"$limit":constants.TWEETSLIMIT}
                    ]
                }}
                ])

        

                console.log(dbTweets);
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
                   {$match:{userId:userId}},
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