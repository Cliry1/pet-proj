import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import { ResetPasswordCollection } from '../db/models/resetPasswordTokens.js';
import bcrypt from 'bcrypt';
import {
  FIFTEEN_MINUTES,
  TEMPLATES_DIR,
  THIRTY_DAYS,
  FIVE_MINUTES,
} from '../constants/index.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';



const createSession = () => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
  const newSession = createSession();
  const createdSession = await SessionCollection.create({
    userId: newUser._id,
    ...newSession,
  });
  return {...createdSession.toObject(), ...newUser.toObject()};
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');


  const newSession = createSession();

  const createdSession = await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
  return {...createdSession.toObject(), ...user.toObject()};
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, 'Session not found');

  const newSession = createSession();
  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    return;
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSourse = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSourse);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
    const encryptedResetPasswordToken = await bcrypt.hash(resetToken, 10);
    await ResetPasswordCollection.deleteOne({ userId: user._id });
    await ResetPasswordCollection.create({
      resetPasswordToken: encryptedResetPasswordToken,
      resetPasswordTokenValidUntil: new Date(Date.now() + FIVE_MINUTES),
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload, sessionId) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        401,
        'Token for reset password is expired or invalid.',
      );
    throw error;
  }

  const resetPasswordTokenInfo = await ResetPasswordCollection.findOne({
    userId: entries.sub,
  });
  if (resetPasswordTokenInfo == null) {
    throw createHttpError(401, 'Token for reset password is expired');
  }

  if (resetPasswordTokenInfo.resetPasswordTokenValidUntil < Date.now()) {
    await ResetPasswordCollection.deleteOne({ userId: entries.sub });
    throw createHttpError(401, 'Token for reset password is expired');
  }

  const isEqual = await bcrypt.compare(
    payload.token,
    resetPasswordTokenInfo.resetPasswordToken,
  );
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionCollection.deleteOne({ _id: sessionId });

  await ResetPasswordCollection.deleteOne({ userId: user._id });
};



export const loginOrSignupWithGoogle = async (code) => {
  const decoded = decodeURIComponent(code);
  const loginTicket = await validateCode(decoded);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    user = await UserCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password: env("NO_PASSWORD_FOR_OAUTH"),
    });
  }

  const newSession = createSession();

  const createdSession = await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
  return {...createdSession.toObject(), ...user.toObject()};
};


export const checkPasswordSet = (password)=>{
  let isPasswordSet=true;
  if(password ===env("NO_PASSWORD_FOR_OAUTH")){
    isPasswordSet = false;
  }
  return isPasswordSet;
};





















export const requestSetPasswordToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    return;
  }
  if(user.password !==env("NO_PASSWORD_FOR_OAUTH")){
    throw createHttpError(409, 'Password already set.');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'set-password-email.html',
  );
  const templateSourse = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSourse);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Set your password',
      html,
    });
    const encryptedResetPasswordToken = await bcrypt.hash(resetToken, 10);
    await ResetPasswordCollection.deleteOne({ userId: user._id });
    await ResetPasswordCollection.create({
      resetPasswordToken: encryptedResetPasswordToken,
      resetPasswordTokenValidUntil: new Date(Date.now() + FIVE_MINUTES),
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};







export const setPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(
        401,
        'Token for set password is expired or invalid.',
      );
    throw error;
  }

  const resetPasswordTokenInfo = await ResetPasswordCollection.findOne({
    userId: entries.sub,
  });
  if (resetPasswordTokenInfo == null) {
    throw createHttpError(401, 'Token for reset password is expired');
  }

  if (resetPasswordTokenInfo.resetPasswordTokenValidUntil < Date.now()) {
    await ResetPasswordCollection.deleteOne({ userId: entries.sub });
    throw createHttpError(401, 'Token for reset password is expired');
  }

  const isEqual = await bcrypt.compare(
    payload.token,
    resetPasswordTokenInfo.resetPasswordToken,
  );
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );


  await ResetPasswordCollection.deleteOne({ userId: user._id });
};