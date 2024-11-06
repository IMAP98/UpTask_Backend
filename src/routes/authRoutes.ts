import { Router } from "express";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../middleware/AuthController";

const router = Router();

router.post('/create-account',
    body('name').isString().withMessage('Invalid name'),
    body('email').isEmail().isString().withMessage('Invalid email'),
    body('password').isString().isLength({min: 8}).withMessage('Invalid password.'), 
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token').notEmpty().withMessage('Invalid token'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isString().notEmpty().withMessage('Invalid password.'), 
    handleInputErrors,
    AuthController.login
);

export default router;