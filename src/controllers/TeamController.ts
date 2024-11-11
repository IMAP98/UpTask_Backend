import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamController {
    static findMemberByEmail = async (req: Request, res: Response) => {

        const {email} = req.body;
        const user = await User.findOne({email}).select('id email name');

        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return;
        }

        res.status(200).json(user);
        return;
    }

    static getProjectTeam = async (req: Request, res: Response) => {

        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name',
        });
        
        res.json(project.team);
        return;
    }

    static addMemberById = async (req: Request, res: Response) => {

        const {id} = req.body;
        
        const user = await User.findById(id).select('id');

        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return;
        }

        if (req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already in team');
            res.status(409).json({ error: error.message });
            return;
        }

        req.project.team.push(user.id);
        await req.project.save();

        res.send('Team member added successfully');
        return;
    }

    static removeMemberById = async (req: Request, res: Response) => {

        const {id} = req.body;

        if (!req.project.team.some(teamMember => teamMember.toString() === id)) {
            const error = new Error('The user is not in the project');
            res.status(409).json({ error: error.message });
            return;
        }
        
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id);

        await req.project.save();

        res.send('Team member removed successfully');
        return;
    }
}