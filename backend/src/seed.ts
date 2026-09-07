import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserSchema } from './auth/schemas/user.schema';
import { ProjectSchema } from './projects/schemas/project.schema';
import { TaskSchema, TaskStatus } from './tasks/schemas/task.schema';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';

async function seed() {
  console.log('🌱 Iniciando Seeder de TaskFlow...');
  console.log(`🔌 Conectando a MongoDB: ${MONGO_URI}`);

  await mongoose.connect(MONGO_URI);

  const UserModel = mongoose.model('User', UserSchema);
  const ProjectModel = mongoose.model('Project', ProjectSchema);
  const TaskModel = mongoose.model('Task', TaskSchema);

  // 1. Limpiar o crear Usuario Demo
  const demoEmail = 'demo@taskflow.dev';
  const existingUser = await UserModel.findOne({ email: demoEmail });

  let demoUser = existingUser;
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  if (demoUser) {
    console.log(`🔄 Actualizando usuario de prueba existente: ${demoEmail}`);
    demoUser.password = hashedPassword;
    demoUser.name = 'Alex Mercer (Lead Dev)';
    await demoUser.save();
  } else {
    console.log(`👤 Creando nuevo usuario de prueba: ${demoEmail}`);
    demoUser = await UserModel.create({
      name: 'Alex Mercer (Lead Dev)',
      email: demoEmail,
      password: hashedPassword,
      role: 'user',
    });
  }

  const userId = demoUser._id;

  // 2. Limpiar proyectos y tareas previas del usuario demo para evitar duplicados
  const oldProjects = await ProjectModel.find({ owner: userId });
  const oldProjectIds = oldProjects.map((p) => p._id);
  await TaskModel.deleteMany({ project: { $in: oldProjectIds } });
  await ProjectModel.deleteMany({ owner: userId });
  console.log('🧹 Datos previos del usuario demo limpiados.');

  // 3. Crear Proyectos de Ejemplo
  const project1 = await ProjectModel.create({
    name: 'Rediseño Mobile App (React Native)',
    description: 'Actualización visual de la aplicación móvil con animaciones fluidas y autenticación biométrica.',
    status: 'active',
    owner: userId,
  });

  const project2 = await ProjectModel.create({
    name: 'TaskFlow Cloud Platform',
    description: 'Infraestructura web escalable con microservicios, OpenAPI Swagger y tablero Kanban en tiempo real.',
    status: 'active',
    owner: userId,
  });

  console.log('📁 Proyectos de prueba creados.');

  // 4. Crear Tareas para Proyecto 1
  const project1Tasks = [
    {
      title: 'Diseñar wireframes en Figma',
      description: 'Estructurar flujo de navegación principal y componentes atómicos según el sistema de diseño.',
      status: TaskStatus.COMPLETADA,
      project: project1._id,
      owner: userId,
    },
    {
      title: 'Configurar tokens de color accesibles (WCAG AA)',
      description: 'Garantizar ratio de contraste de mínimo 4.5:1 en temas oscuro y claro.',
      status: TaskStatus.COMPLETADA,
      project: project1._id,
      owner: userId,
    },
    {
      title: 'Implementar autenticación Biométrica',
      description: 'Integrar FaceID y TouchID nativos usando expo-local-authentication.',
      status: TaskStatus.EN_PROGRESO,
      project: project1._id,
      owner: userId,
    },
    {
      title: 'Animaciones de gestos con Reanimated 3',
      description: 'Crear swipe actions fluidos en tarjetas de tareas con física de resortes.',
      status: TaskStatus.EN_PROGRESO,
      project: project1._id,
      owner: userId,
    },
    {
      title: 'Configurar Push Notifications con Firebase',
      description: 'Enviar alertas cuando una tarea sea asignada o cambie de estado.',
      status: TaskStatus.PENDIENTE,
      project: project1._id,
      owner: userId,
    },
    {
      title: 'Subir build Beta a TestFlight',
      description: 'Preparar release candidate para pruebas internas con QA.',
      status: TaskStatus.PENDIENTE,
      project: project1._id,
      owner: userId,
    },
  ];

  // 5. Crear Tareas para Proyecto 2
  const project2Tasks = [
    {
      title: 'Estructurar arquitectura NestJS modular',
      description: 'Separación por dominios (Auth, Projects, Tasks) con DTOs validados con class-validator.',
      status: TaskStatus.COMPLETADA,
      project: project2._id,
      owner: userId,
    },
    {
      title: 'Configurar documentación OpenAPI / Swagger',
      description: 'Decoradores @ApiTags, @ApiOperation y esquemas interactivos en /api/docs.',
      status: TaskStatus.COMPLETADA,
      project: project2._id,
      owner: userId,
    },
    {
      title: 'Tablero Kanban con Native Drag & Drop',
      description: 'Mover tarjetas entre Por Hacer, En Progreso y Completadas con feedback visual.',
      status: TaskStatus.EN_PROGRESO,
      project: project2._id,
      owner: userId,
    },
    {
      title: 'Configurar pipelines de CI/CD en GitHub Actions',
      description: 'Validar linters, tests unitarios y builds automáticos en cada pull request.',
      status: TaskStatus.EN_PROGRESO,
      project: project2._id,
      owner: userId,
    },
    {
      title: 'Integrar WebSockets para colaboración en vivo',
      description: 'Sincronizar cambios de estado en tiempo real entre múltiples clientes.',
      status: TaskStatus.PENDIENTE,
      project: project2._id,
      owner: userId,
    },
  ];

  await TaskModel.insertMany([...project1Tasks, ...project2Tasks]);
  console.log(`📋 ${project1Tasks.length + project2Tasks.length} tareas de prueba insertadas.`);

  console.log('\n======================================================');
  console.log('✅ SEED COMPLETADO EXITOSAMENTE');
  console.log('======================================================');
  console.log('🔑 CREDENCIALES DE ACCESO DEMO:');
  console.log('   Email:     demo@taskflow.dev');
  console.log('   Password:  Password123!');
  console.log('======================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error al ejecutar el seed:', err);
  mongoose.disconnect();
  process.exit(1);
});
