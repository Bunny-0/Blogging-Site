const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const TweetSchema=new Schema({

    title:{
        type:String,
        required:true
    },
    bodyText:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    creationDateTime:{
        type:String,
        required:true

    }


},{strict:false})
module.exports=mongoose.model('tb_tweets',TweetSchema,'tb_tweets');
