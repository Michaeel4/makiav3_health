import express = require('express');
import { requireAdmin, requireUser } from '../middleware/auth.middleware';
import { v4 as uuid} from 'uuid';
import { ProjectModel } from '../models/project.model';
import { getProjectCollection } from './mongodb.service';
import { UserModel } from '../models/user.model';


const projectRoutes = express.Router();

projectRoutes.post('/project', requireAdmin, async (req, res) => {
    const project: ProjectModel = req.body;
    await getProjectCollection().insertOne({
        ...project,
        _id: uuid()
    });
    res.status(200).end();
});

projectRoutes.get('/project', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;

    if (user) {
        const projects: ProjectModel[] = await getProjectCollection().find({}).toArray();
        res.json(projects);
    } else {
        res.sendStatus(403);
    }
});


export {projectRoutes};
