import { sendTelegramAlert } from "./telegram";

interface Task {
  name: string;
  courseName: string;
  dueDate: Date;
}

interface Course {
  name: string;
}

export async function alertTaskDueSoon(task: Task): Promise<boolean> {
  const hoursLeft = Math.round(
    (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60)
  );

  const message =
    `⚠️ <b>Tarea próxima a vencer</b>\n\n` +
    `📚 <b>${task.courseName}</b>\n` +
    `📝 ${task.name}\n` +
    `⏰ Faltan <b>${hoursLeft}h</b>`;

  return sendTelegramAlert(message);
}

export async function alertLowGrade(
  course: Course,
  grade: number
): Promise<boolean> {
  const message =
    `🔴 <b>Calificación baja detectada</b>\n\n` +
    `📚 <b>${course.name}</b>\n` +
    `📉 Calificación: <b>${grade.toFixed(1)}</b>\n` +
    `💡 Revisa tus pendientes y busca apoyo si lo necesitas.`;

  return sendTelegramAlert(message);
}
