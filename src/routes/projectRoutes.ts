import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";

const router = Router();

router.post('/',
    
    body('projectName')
    .notEmpty().withMessage("The project name is required."),

    body('clientName')
    .notEmpty().withMessage("The client name is required."),

    body('description')
    .notEmpty().withMessage("The project description is required."),

    handleInputErrors,

    ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get('/:id', 
    param('id').isMongoId().withMessage('Invalid ID.'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id', 
    param('id').isMongoId().withMessage('Invalid ID.'),
    
    body('projectName')
    .notEmpty().withMessage("The project name is required."),

    body('clientName')
    .notEmpty().withMessage("The client name is required."),

    body('description')
    .notEmpty().withMessage("The project description is required."),

    handleInputErrors,

    ProjectController.updateProject
);

router.delete('/:id', 
    param('id').isMongoId().withMessage('Invalid ID.'),
    handleInputErrors,
    ProjectController.deleteProject
);

// SECTION: Routes for tasks
router.post('/:projectId/tasks',
    TaskController.createTask,
);

export default router;