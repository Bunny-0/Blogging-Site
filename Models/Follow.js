const FollowSchema =require('../Schemas/Follow');
const constants=require('../constants');
const UserSchema =require('../Schemas/User');

const ObjectId=require('mongodb').ObjectId;

function followUser({followerUserId,followingUserId}){
    return new Promise(async (resolve,reject)=>{

        try{
            // const ObjectfollowerUserId=followerUserId;
            // const ObjectfollowingUserId=followingUserId;
            const followObj=await FollowSchema.findOne({followerUserId,followingUserId});

            if(followObj){
                return reject('User Already Followed');

            }
            const creationDatetime=new Date();
            const follow=new FollowSchema({
                followerUserId,
                followingUserId,
                creationDatetime
            })
            const followDb=await follow.save();
            resolve(followDb);

        }
        catch(err){
            reject(err);
        }

    })
}

function followingUserList({followerUserId,offset}){
    return new Promise(async (resolve,reject)=>{

    try{

        const followDb=await FollowSchema.aggregate([
            
            {$match:{followerUserId: new ObjectId(followerUserId) }},
            {$sort:{creationDatetime:-1}},
            {$project:{followingUserId:1 }},
            {$facet:{data:[{"$skip": parseInt(offset)},{"$limit":constants.FOLLOWLIMIT}]
            }}
        ])
        const followingUserIds=[];
        followDb[0].data.forEach((item) => {
            followingUserIds.push( new ObjectId(item.followingUserId));
            
        })
        console.log("recherd after loop");

        // await UserSchema.find({_id:{$in:followingUserIds}});
        const followingUserDetails=await UserSchema.aggregate([
            {
                $match:{_id:{$in:followingUserIds}}
                
            },
            {
                $project:{
                    username:1,
                    name:1,
                    _id:1
                }
            }
        ])
        resolve(followingUserDetails);

    }
    catch(err){

        reject(err);

    }

})
}
function followerUserList({followingUserId,offset}){
    return new Promise(async (resolve,reject)=>{

    try{
 
        const followDb=await FollowSchema.aggregate([
            {$match:{followingUserId:new ObjectId(followingUserId) }},
            {$sort:{creationDatetime:-1}},
            {$project:{followerUserId:1 }},
            {$facet:{
                data:[{"$skip":parseInt(offset)},{"$limit":constants.FOLLOWLIMIT}]
            }}
        ])
        const followerUserIds=[];
        followDb[0].data.forEach((item) => {
            followerUserIds.push( new ObjectId(item.followerUserId));
            
        })

        // await UserSchema.find({_id:{$in:followingUserIds}});
        const followerUserDetails=await UserSchema.aggregate([
            {
                $match:{_id:{$in:followerUserIds}}
                
            },
            {
                $project:{
                    username:1,
                    name:1,
                    _id:1
                }
            }
        ])
        resolve(followerUserDetails);

    }
    catch(err){

        reject(err);

    }

})
}

function unfollowUser({followingUserId,followerUserId}){

    return new Promise(async(resolve,reject)=>{
        try{
            const followDb=await FollowSchema.findOneAndDelete({followerUserId,followingUserId});
            
            if(!followDb){
                return reject("User not followed");
            }
            
            resolve(followDb);
        }
        catch(err) {
            reject(err);
        }
    })

}
module.exports={followUser,followingUserList,followerUserList,unfollowUser};