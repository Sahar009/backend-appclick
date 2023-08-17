const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = mongoose.Schema({
    
    email:{
        type:String,
        required:[true, 'please add an email'],
        unique: true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please enter a valid email'
        ]
    },
    password:{
        type:String,
        required:[true,'please add a password'],
        minLenght:[6, "password must be up to 6 characters"],
        // maxLenght:[23, "password must not be more than 23 characters"]
    },
   
   
},
{
    timestamps:true
}
)

// encrpypt password before saving to DB

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
const salt = await bcrypt.genSalt(10)
 const harshedpassword = await bcrypt.hash(this.password,salt);

 this.password = harshedpassword
  
})

const User = mongoose.model("user", userSchema)

module.exports = User