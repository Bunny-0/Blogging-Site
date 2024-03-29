const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const TweetsSchema=new Schema({

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

    },
    isDeleted:{
        type:Boolean,
        required:false
    },
    deletionDatetime:{
        tyep:String,
        required:false

    }


},{strict:false})
module.exports=mongoose.model('tb_tweets',TweetsSchema,'tb_tweets');
