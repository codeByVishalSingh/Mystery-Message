import mongoose,{Schema,Document} from "mongoose"

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true

    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }

})

export interface User extends Document{
   username:string,
   email:string,
   password:string
   verifycode:string,
   verifyExprireCode:Date,
   isVerified:boolean,
   isAccept:boolean,
   messages:Message[]
}
const userSchema:Schema<User> = new Schema({
  username:{
    type:String,
    required:[true, 'Username is Require'],
    unique:true,
    trim:true
  },
  email:{
    type:String,
    required:[true, 'Email is Require'],
    unique:true,
  },
  password:{
    type:String,
    required:[true, 'Username is Require'],
   
  },
  verifycode:{
    type:String,
    required:[true, 'Verify codeis Require'],
  },
   verifyExprireCode:{
    type:Date,
    required:[true, 'Verify code expiry is is Require'],
   
  },
  isVerified:{
    type:Boolean,
    default:false,

  },
    isAccept:{
    type:Boolean,
    default:true,

  },
  messages:[MessageSchema]
   
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',userSchema)

export default  UserModel;