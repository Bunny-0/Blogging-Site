const UserSchema=require('../schemas/User');
const bcrypt=require('bcrypt')

class User{

    username;
    email;
    phone;
    name;
    password;

    constructor({username,name,email,password,phone}){
        this.email=email;
        this.name=name;
        this.password=password;
        this.phone=phone;
        this.username=username;
    }

    static verifyUsernameAndEmailExists({username,email}){

        return new Promise(async (resolve,reject)=>{

            try{
            const user=await UserSchema.findOne({$or:[{username},{email}]});
            
            if(user && user.email===email){
                return reject('Email already exists');
            }

            if(user && user.username===username){
                return reject('Username already exists');
            }

            return resolve();
        }
        catch(err){
            return reject(err);
        }
            
        })

    }

     registerUser(){
        return new Promise(async (resolve,reject)=>{
            const hashPassword=await bcrypt.hash(this.password,15);

            const user=new UserSchema({
                username:this.username,
                name:this.name,
                password:hashPassword,
                email:this.email,
                phone:this.phone
            })

            try{
                const dbUser=await user.save();

                return resolve(dbUser);
            }
            catch(err){
                return reject(err);
            }
        })

    }

    static loginUser({loginId,password}){

        return new Promise(async(resolve,reject)=>{
            let dbUser=await UserSchema.findOne({$or:[{email:loginId},{username:loginId}]});

            if(!dbUser){
                return reject('no user is found');
            }

            const isMatch=bcrypt.compare(password,dbUser.password);
            if(!isMatch){
                return reject('Invalid password');
            }

            resolve(dbUser);
            
        })
    }
    
     
}
module.exports=User;