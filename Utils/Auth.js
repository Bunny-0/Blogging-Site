const validator=require('validator');

function cleanUpAndValidate({name,username,email,phone,password}){
    return new Promise((resolve,reject)=>{
        if(!(name && username&& email&& password)){
            reject('Missing data');
        }

        if(!validator.isEmail(email)){
            return reject('Invalid email');
        }
        
        if(validator.isEmail(username)){
            return reject('username should not be an email');
        }

        if (phone && phone.length!==10){
            return reject('Invalid phone number');
        }

        if(username.length<3){
            return reject("Username is too small");
        }

        if(username.length>50)
        {
            return reject('username should be at max 50 character');
        }

        if(password.length<6)
        {
            return reject('password is too short');
        }

        if(password.length >200)
        {
            return reject('password should be at max 200 characters long');
        }
        if(name.length>100){
            return reject('Name should be max 100 characters long');
        }

        if(!validator.isAlphanumeric(password)){
            return reject('Password should be alphanumberic');
        }

        resolve();

    })

}

module.exports={cleanUpAndValidate};