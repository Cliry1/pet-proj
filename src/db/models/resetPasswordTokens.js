import {model, Schema} from 'mongoose';

const resetPasswordTokensSchema = new Schema({
  resetPasswordToken: { 
    type: String, 
    required: true, 
   },
  resetPasswordTokenValidUntil:{
    type: Date, 
    required: true,
  },
  userId:{
    type:String,
    required:true,
    unique:true,
  }
},
   { timestamps: true, versionKey: false });

resetPasswordTokensSchema.index({ resetPasswordTokenValidUntil: 1 }, { expireAfterSeconds: 0 });

export const ResetPasswordCollection = model("resetTokens", resetPasswordTokensSchema);