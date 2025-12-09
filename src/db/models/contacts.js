import {model, Schema } from "mongoose";

const contactsSchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  phoneNumber :{
    type:String,
    required:true,
  },
  userId:{
    type: Schema.Types.ObjectId,
    required:true, 
    ref: 'users'
  },
  photo:{
    type:String
  }
},
{
  timestamps: true,
  versionKey: false,
},);

export const ContactsCollection = model('contacts', contactsSchema);