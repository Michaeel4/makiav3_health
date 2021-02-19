import { ProjectModel } from '../../models/project.model';
import { getProjectCollection } from '../mongodb.service';
import { v4 as uuid } from 'uuid';

export async function createProject(project: ProjectModel): Promise<void> {
    await getProjectCollection().insertOne({
        ...project,
        _id: uuid(),
        deviceToken: uuid()
    });
}

export async function getProjects(): Promise<ProjectModel[]> {
    return await getProjectCollection().find({}).toArray();
}
