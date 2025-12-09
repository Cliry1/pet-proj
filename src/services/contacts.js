import { ContactsCollection } from "../db/models/contacts.js";
import {SORT_ORDER} from "../constants/index.js";


export const getAllContacts = async ({sortBy="name", sortOrder=SORT_ORDER.ASC, userId }) => {

  return await ContactsCollection.find({userId}).sort({[sortBy]:sortOrder}).exec();
};

export const getContactsById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({_id:contactId, userId});
  return contact;
};

export const createContact = async (payload, userId, photoUrl) => {
  const contact = await ContactsCollection.create({...payload, userId, photo:photoUrl});
  return contact;
};

export const deleteContact = async (contactId, userId) => { 
  const contact = await ContactsCollection.findOneAndDelete({_id: contactId, userId});
  return contact;
};
export const updateContact = async (contactId, {userId,...payload}, options = {} ) => {
  console.log(payload);
  console.log(userId);
  const contact  = await ContactsCollection.findOneAndUpdate({_id:contactId, userId }, payload, {new:true, includeResultMetadata:true,...options});

  return {
    contact: contact.value,
  };
};