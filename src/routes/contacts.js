import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from "../middlewares/isValidId.js";
import { checkElegibility } from "../middlewares/checkElegibility.js";
import { getAllContactsController, createContactController, deleteContactController, patchContactController } from "../controllers/contacts.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { upload } from '../middlewares/multer.js';

const router = Router();
router.use(authenticate);


router.get('/', ctrlWrapper(getAllContactsController));

router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', checkElegibility, isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/:contactId', checkElegibility, isValidId, ctrlWrapper(deleteContactController));

export default router;