import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router();

// SECTION: Routes for projects
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
router.param('projectId',projectExists);

router.post('/:projectId/tasks',

    body('name')
    .notEmpty().withMessage("The task name is required."),

    body('description')
    .notEmpty().withMessage("The tas description is required."),

    handleInputErrors,

    TaskController.createTask,

);

router.get('/:projectId/tasks',
    TaskController.getProjectTasks,
);

router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID.'),
    handleInputErrors,
    TaskController.getTasksById,
);

router.put('/:projectId/tasks/:taskId',

    param('taskId').isMongoId().withMessage('Invalid ID.'),

    body('name')
    .notEmpty().withMessage("The task name is required."),

    body('description')
    .notEmpty().withMessage("The tas description is required."),

    handleInputErrors,

    TaskController.updateTask,

);

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID.'),
    handleInputErrors,
    TaskController.deleteTask,
);

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid ID.'),
    body('status')
    .notEmpty().withMessage('The status is required.'),
    handleInputErrors,
    TaskController.updateStatus,
);

export default router;