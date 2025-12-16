import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
  setPasswordSchema,
  requestSetPasswordEmailSchema,
  loginWithGithubOAuthSchema
} from '../validation/auth.js';
import {
  refreshUserController,
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  requestResetTokenController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
  requestSetPasswordTokenController,
  setPasswordController,
  getGithubOAuthUrlController,
  loginWithGithubController
} from '../controllers/auth.js';

const router = Router();
router.get('/refresh-user', authenticate, ctrlWrapper(refreshUserController));

router.post('/refreshToken', ctrlWrapper(refreshUserSessionController));

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetTokenController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.get('/get-oauth-url-google', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth-google',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

router.post(
  '/send-set-pwd-email',
  authenticate,
  validateBody(requestSetPasswordEmailSchema),
  ctrlWrapper(requestSetPasswordTokenController),
);

router.post(
  '/set-password',
  authenticate,
  validateBody(setPasswordSchema),
  ctrlWrapper(setPasswordController),
);

router.get('/get-oauth-url-github', ctrlWrapper(getGithubOAuthUrlController));

router.post(
  '/confirm-oauth-github',
  validateBody(loginWithGithubOAuthSchema),
  ctrlWrapper(loginWithGithubController),
);

export default router;
