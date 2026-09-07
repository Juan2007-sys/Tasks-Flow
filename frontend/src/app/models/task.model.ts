export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';
export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  project: string;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  project: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
