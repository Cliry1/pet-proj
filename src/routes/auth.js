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

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
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

export default router;
