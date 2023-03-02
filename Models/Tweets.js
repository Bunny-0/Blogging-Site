const TweetsSchema=require('../Schemas/Tweets');
const constants=require('../constants');


class Tweets{

    title;
    bodyText;
    userId;
    creationDateTime;

    constructor({title,bodyText,userId,creationDateTime})
    {
        this.bodyText=bodyText;
        this.creationDateTime=creationDateTime;
        this.userId=userId;
        this.title=title;
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
}
module.exports=Tweets;