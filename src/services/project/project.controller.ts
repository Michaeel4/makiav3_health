import { ProjectModel } from '../../models/project.model';
import { getProjectCollection } from '../mongodb.service';
import { v4 as uuid } from 'uuid';
import { UserModel } from '../../models/user.model';

export async function createProject(project: ProjectModel): Promise<void> {
    await getProjectCollection().insertOne({
        ...project,
        _id: uuid()
    });
}

export async function getProjects(): Promise<ProjectModel[]> {
    return await getProjectCollection().find({}).toArray();
}

export function isAllowedForProject(user: UserModel, projectId: string | undefined): boolean {
    return user.admin || (!!projectId && (user.permissions.allowedProjects.findIndex(allowed => {
        return projectId === allowed;
    }) > -1));
}
