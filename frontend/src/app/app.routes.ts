import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login";
import { RegisterComponent } from "./pages/register/register";
import { DashboardComponent } from "./pages/dashboard/dashboard";
import { ProjectsComponent } from "./pages/projects/projects";
import { TasksComponent } from "./pages/tasks/tasks";
import { AuthGuard } from "./guards/auth-guard";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:projectId', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'projects/:projectId/tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];