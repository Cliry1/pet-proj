import createHttpError from 'http-errors';
import { THIRTY_DAYS } from '../constants/index.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
  checkPasswordSet,
  requestSetPasswordToken,
  setPassword,
  
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

const setupSession = async (res, session) => {
res.cookie('refreshToken', session.refreshToken, {
  httpOnly: true,
  secure: true,       
  sameSite: "none",     
  path: "/",
  maxAge: THIRTY_DAYS
});

res.cookie('sessionId', session._id.toString(), {
  httpOnly: true,
  secure: true,
  sameSite: "none", 
  path: "/",
  maxAge: THIRTY_DAYS
});
};

export const registerUserController = async (req, res) => {
  const {user, session} = await registerUser(req.body);
  setupSession(res, session);

  res.status(201).json({
    status: 201,
    message: 'Succesfully registered a user!',
    data: {
      accessToken: session.accessToken,
      user
    },
  });
};

export const loginUserController = async (req, res) => {
  const {user, session} = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      user
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  } else {
    throw  createHttpError(401, "Authorization problem2");
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetTokenController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'If the account exists, a password reset has been sent on email.',
    status: 200,
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body, req.cookies.sessionId);
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.redirect(url);
};

export const loginWithGoogleController = async (req, res) => {
  const {user, session} = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);
  res.json({
    status: 200,
    message: 'Successfully logged in with Google OAuth!',
    data: {
      accessToken: session.accessToken,
      user
    },
  });
};

export const refreshUserController = async (req, res) => {
  const isPasswordSet = checkPasswordSet(req.user.password);

  res.json({
    status: 200,
    message: 'Successfully refreshed a user`s info!',
    data: {
      email: req.user.email,
      name: req.user.name,
      isPasswordSet,
    },
  });
};

export const requestSetPasswordTokenController = async (req, res) => {
  await requestSetPasswordToken(req.body.email);
  res.json({
    message: 'If the account exists, a password`s setter has been sent on email.',
    status: 200,
    data: {},
  });
};

export const setPasswordController = async (req, res) => {
  await setPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
