const FollowSchema =require('../Schemas/Follow');
function followUser(followerUserId,followingUserId){
    return new Promise(async (resolve,reject)=>{

        try{
            const followObj=await FollowSchema.findOne(followerUserId,followerUserId);

            if(followObj){
                reject('User Already Followed');

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
module.exports={followUser};