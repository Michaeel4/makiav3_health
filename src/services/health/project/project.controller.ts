import { ProjectModel } from '../../../models/health/project.model';
import { getProjectCollection } from '../../db/mongodb.service';
import { v4 as uuid } from 'uuid';
import { UserModel } from '../../../models/health/user.model';

export async function createProject(project: ProjectModel): Promise<void> {
    await getProjectCollection().insertOne({
        ...project,
        _id: uuid()
    } as any);
}

export async function getProjects(): Promise<ProjectModel[]> {
    return await getProjectCollection().find<ProjectModel>({}).toArray();
}

export function isAllowedForProject(user: UserModel, projectId: string | undefined): boolean {
    return user.admin || (!!projectId && (user.permissions.allowedProjects.findIndex(allowed => {
        return projectId === allowed;
    }) > -1));
}
