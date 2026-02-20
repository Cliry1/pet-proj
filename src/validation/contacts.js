import Joi from "joi";

export const createContactSchema = Joi.object({
  name:Joi.string().min(3).max(40).required().messages({
    'string.base': 'Name should be a string', 
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber:Joi.string().min(5).max(12).required().messages({
    'string.base': 'Phone number should be a string', 
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  }),
  instagram:Joi.string().min(1).messages({
    'string.base': 'Instagram should be a string', 
    'string.min': 'Instagram should have at least {#limit} characters',
  }),
  telegram:Joi.string().min(1).messages({
    'string.base': 'Telegram should be a string', 
    'string.min': 'Telegram should have at least {#limit} characters',
  }),
  facebook:Joi.string().min(1).messages({
    'string.base': 'Facebook should be a string', 
    'string.min': 'Facebook should have at least {#limit} characters',
  }),
  twitter:Joi.string().min(1).messages({
    'string.base': 'Twitter should be a string', 
    'string.min': 'Twitter should have at least {#limit} characters',
  }),
  secondPhoneNumber:Joi.string().min(5).max(12).messages({
    'string.base': 'Phone number should be a string', 
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
});



export const updateContactSchema = Joi.object({
  name:Joi.string().min(3).max(40).messages({
    'string.base': 'Name should be a string', 
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber:Joi.string().min(5).max(12).messages({
    'string.base': 'Phone number should be a string', 
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
  instagram:Joi.string().allow('').messages({
    'string.base': 'Instagram should be a string', 
  }),
  telegram:Joi.string().allow('').messages({
    'string.base': 'Telegram should be a string', 
  }),
  facebook:Joi.string().allow('').messages({
    'string.base': 'Facebook should be a string', 
  }),
  twitter:Joi.string().allow('').messages({
    'string.base': 'Twitter should be a string', 
  }),
  secondPhoneNumber:Joi.string().allow('').min(5).max(12).messages({
    'string.base': 'Phone number should be a string', 
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
});