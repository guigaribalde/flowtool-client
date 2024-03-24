import { Column, Task } from '@prisma/client';
import { StateCreator } from 'zustand';

export interface TaskSlice {
	tasks: Record<string, Task>;
	addTask: (task: Task) => void;
	deleteTask: (taskId: string) => void;
	updateTask: (taskId: string, task: Partial<Task>) => void;
	tasksToArray: () => Task[];
	groupedTasksByColumnId: () => Record<string, Task[]>;
}

type CreateTaskSlice = StateCreator<TaskSlice>;

type TaskPosition = {
	columnId: string;
	taskIndex: number;
};

export const createTaskSlice: CreateTaskSlice = (set, get: any) => ({
	tasks: {},
	addTask: (task: Task) => {
		set((state: any) => ({ tasks: { ...state.tasks, [task.id]: task } }));
	},
	deleteTask: (taskId: string) =>
		set((state: any) => {
			const { [taskId]: deleted, ...tasks } = state.tasks;
			return { tasks };
		}),
	updateTask: (taskId: string, task: Partial<Task>) => {
		if (taskId in get().spaces) {
			set((state: any) => ({
				tasks: {
					...state.tasks,
					[taskId]: { ...state.tasks[taskId], ...task },
				},
			}));
		}
	},
	groupedTasksByColumnId: () => {
		const {
			tasks,
			columns,
		}: { tasks: Record<string, Task>; columns: Record<string, Column> } = get();
		const groupedTasks: Record<string, Task[]> = {};

		Object.values(tasks).forEach((task) => {
			if (!task.columnId) return;
			const column = columns[task.columnId];

			if (column) {
				if (column.id in groupedTasks) {
					groupedTasks[column.id].push(task);
				} else {
					groupedTasks[column.id] = [task];
				}
			}
		});

		return groupedTasks;
	},

	updateTaskColumn: (
		taskId: string,
		source: TaskPosition,
		destination: TaskPosition,
	) => {
		const { columnId: sourceColumnId, taskIndex: sourceTaskIndex } = source;
		const { columnId: destinationColumnId, taskIndex: destinationTaskIndex } =
			destination;

		const groupedTasks: Record<string, Task[]> = get().groupedTasksByColumnId();
		const targetTask: Task = get().tasks[taskId];
		const sourceTasks: Task[] = groupedTasks[sourceColumnId];
		const destinationTasks: Task[] = groupedTasks[destinationColumnId];

		// update sourceTasks tasks.index
		sourceTasks.forEach((task, index) => {
			if (index === sourceTaskIndex) return;
			if (index > sourceTaskIndex) {
				get().updateTask(task.id, { index: index - 1 });
			}
		});

		// update destinationTasks tasks.index
		destinationTasks.forEach((task, index) => {
			if (index >= destinationTaskIndex) {
				get().updateTask(task.id, { index: index + 1 });
			}
		});

		// update targetTask columnId and index
		get().updateTask(taskId, {
			columnId: destinationColumnId,
			index: destinationTaskIndex,
		});
	},
	updateTaskOrder: (
		taskId: string,
		source: TaskPosition,
		destination: TaskPosition,
	) => {},
	tasksToArray: () => Object.values(get().tasks),
});
