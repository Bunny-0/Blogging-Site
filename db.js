const mongoose=require('mongoose');
const constants=require('./private_constants');
const app=require('./index');
mongoose.connect(constants.MONGOURI,{   
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('connected with mongodb');
    const PORT=3000;
    app.listen(PORT ,()=>{

        console.log(`Listening to port ${PORT}`);
})

}).catch(err=>{
    console.log('Error in connecting with mongo');
})

