import Joi from "joi";


export const registerUserSchema = Joi.object({
  name:Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string', 
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  email:Joi.string().email().required().messages({
    'string.base': 'Email should be a string', 
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required',
  }),
  password:Joi.string().required().min(8).max(64).pattern(/[a-zA-Z]/, 'letter').pattern(/\d/, 'digit').messages({
    'string.base': 'Password should be a string', 
    'any.required': 'Password is required',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password must be at most {#limit} characters long',
    'string.pattern.name': 'Password must contain at least one latin letter and one digit',
  }),
});

export const loginUserSchema = Joi.object({
  email:Joi.string().email().required().messages({
    'string.base': 'Email should be a string', 
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password:Joi.string().required().messages({
    'string.base': 'Password should be a string', 
    'any.required': 'Password is required',
  }),
});


export const requestResetEmailSchema = Joi.object({
  email:Joi.string().email().required().messages({
    'string.base': 'Email should be a string', 
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required'})
});


export const resetPasswordSchema = Joi.object({
  token:Joi.string().required().messages({
    'string.base': 'Token should be a string', 
    'any.required': 'Token is required'}),
  password:Joi.string().required().min(8).max(64).pattern(/[a-zA-Z]/, 'letter').pattern(/\d/, 'digit').messages({
    'string.base': 'Password should be a string', 
    'any.required': 'Password is required',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password must be at most {#limit} characters long',
    'string.pattern.name': 'Password must contain at least one latin letter and one digit',
  }),
});


export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.base':'Code should be a string',
    'any.required': 'Code is required',
  })
});


export const requestSetPasswordEmailSchema =Joi.object({
  email:Joi.string().email().required().messages({
    'string.base': 'Email should be a string', 
    'string.email': 'Please enter a valid email address.',
    'any.required': 'Email is required'})
});


export const setPasswordSchema = Joi.object({
  token:Joi.string().required().messages({
    'string.base': 'Token should be a string', 
    'any.required': 'Token is required'}),
  password:Joi.string().required().min(8).max(64).pattern(/[a-zA-Z]/, 'letter').pattern(/\d/, 'digit').messages({
    'string.base': 'Password should be a string', 
    'any.required': 'Password is required',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password must be at most {#limit} characters long',
    'string.pattern.name': 'Password must contain at least one latin letter and one digit',
  }),
});