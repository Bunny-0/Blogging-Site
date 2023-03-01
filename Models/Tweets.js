const TweetsSchema=require('../schemas/Tweets');

class Tweets{

    title;
    bodyText;
    userId;
    creationDatetime;

    constructor({title,bodyText,userId,creationDatetime})
    {
        this.bodyText=bodytext;
        this.creationDatetime=creationDatetime;
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
                creationDateTime:this.creationDatetime
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
}
module=Tweets;