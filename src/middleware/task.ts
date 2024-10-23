import { Request, Response, NextFunction } from "express";
import Task, { InterfaceTask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: InterfaceTask;
        }
    }
}

export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        
        if (!task) {
            const error = new Error('Task not found.');
            res.status(404).json({error: error.message});
            return;
        }
        
        req.task = task;
        
        next();
        
    } catch (error) {
        res.status(500).json({error: 'There has been an error'});
    }
    
}

export const taskBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
    
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Invalid action.');
        res.status(400).json({ error: error.message });
        return;
    }
    
    next();

}