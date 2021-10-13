import { requireAdmin, requireUser } from '../../middleware/auth.middleware';
import { ProjectModel } from '../../models/project.model';
import { UserModel } from '../../models/user.model';
import { createProject, getProjects } from './project.controller';
import express from 'express';

const projectRoutes = express.Router();

projectRoutes.post('/project', requireAdmin, async (req, res) => {
    const project: ProjectModel = req.body;
    await createProject(project);
    res.status(200).end();
});

projectRoutes.get('/project', requireUser, async (req, res) => {
    const user: UserModel = req.user as UserModel;

    if (user) {
        res.json(await getProjects());
    } else {
        res.sendStatus(403);
    }
});


export { projectRoutes };
