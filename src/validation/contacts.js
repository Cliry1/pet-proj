import Joi from "joi";

export const createContactSchema = Joi.object({
  name:Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string', 
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber:Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number should be a string', 
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  }),
});



export const updateContactSchema = Joi.object({
  name:Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string', 
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber:Joi.string().min(3).messages({
    'string.base': 'Phone number should be a string', 
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
});