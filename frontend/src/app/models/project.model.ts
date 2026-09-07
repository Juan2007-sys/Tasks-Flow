export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed';
  owner: string;
  createdAt?: string;
  updatedAt?: string;
  // Campos calculados en el frontend para métricas
  taskCount?: number;
  completedTaskCount?: number;
  progressPercentage?: number;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  status?: 'active' | 'completed';
}
