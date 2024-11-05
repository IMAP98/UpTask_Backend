import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../middleware/AuthController";

const router = Router();

router.post('/create-account',
    body('name').isString().withMessage('Invalid name'),
    body('email').isString().withMessage('Invalid email'),
    body('password').isString().isLength({min: 8}).withMessage('Invalid password.'), 
    body('password-confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.createAccount
);

export default router;