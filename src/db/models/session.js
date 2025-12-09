import {model, Schema} from 'mongoose';

const sessionsSchema = new Schema({
  userId: {
    type:Schema.Types.ObjectId,
    ref:"users"
  },
  accessToken: { 
    type: String, 
    required: true, 
   },
  refreshToken:{
    type: String, 
    required: true, 
   },
  accessTokenValidUntil:{
    type: Date,
    required: true
  },
  refreshTokenValidUntil:{
    type: Date, 
    required: true
  }
},
   { timestamps: true, versionKey: false });

sessionsSchema.index({ refreshTokenValidUntil: 1 }, { expireAfterSeconds: 0 });

export const SessionCollection = model("sessions", sessionsSchema);