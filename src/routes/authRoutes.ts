import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { AuthController } from "../middleware/AuthController";

const router = Router();

router.post('/create-account',
    body('name').isString().withMessage('Invalid name'),
    body('email').isEmail().isString().withMessage('Invalid email'),
    body('password').isString().isLength({min: 8}).withMessage('The password must have at least 8 characters'),
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

router.post('/request-code',
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);

router.post('/forgot-password',
    body('email').isEmail().withMessage('Invalid email'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token').notEmpty().withMessage('Invalid token'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Invalid token'),
    body('password').isString().isLength({min: 8}).withMessage('The password must have at least 8 characters'), 
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
);

export default router;