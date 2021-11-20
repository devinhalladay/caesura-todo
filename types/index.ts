import { Dayjs } from "dayjs"

export enum HttpMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

export enum TaskAction {
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  STAGE_TASK = 'STAGE_TASK',
  UPDATE_ALL_TASKS = 'UPDATE_ALL_TASKS',
  COMPLETE_TASK = 'COMPLETE_TASK',
  REMOVE_TASK = 'REMOVE_TASK',
  REORDER_TASK = 'REORDER_TASK',
  UNCOMPLETE_TASK = 'UNCOMPLETE_TASK',
  REFETCH_TASK = 'REFETCH_TASK',
  RESET_STATE = 'RESET_STATE',
  SET_TASKS = 'SET_TASKS',
}

export type TaskIntent =
  | {
    type: TaskAction.ADD_TASK,
    payload?: any
  } |
  {
    type: TaskAction.COMPLETE_TASK,
    payload: {
      taskId: string
    }
  } |
  {
    type: TaskAction.REMOVE_TASK,
    payload?: any
  } |
  {
    type: TaskAction.REORDER_TASK,
    payload?: any
  } |
  {
    type: TaskAction.UNCOMPLETE_TASK,
    payload: {
      taskId: string
    }
  } |
  {
    type: TaskAction.REFETCH_TASK,
    payload: {
      taskId: string
    }
  } | {
    type: TaskAction.STAGE_TASK,
    payload: {
      task: Task
    }
  } | {
    type: TaskAction.UPDATE_ALL_TASKS,
    payload: {
      tasks: Task[]
    }
  } | {
    type: TaskAction.RESET_STATE,
    payload: object
  } | {
    type: TaskAction.SET_TASKS,
    payload: any
  }

export type Task = {
  id: string,
  createdAt: Date,
  text: string,
  completed: boolean,
  createdBy: string,
  plannedOnDate: Date | string,
  actualTime?: number,
  completeDate?: string | Dayjs | Date | null,
  dueDate?: Date,
  duration?: number,
  notes?: string,
  objectiveId?: string,
  timeEstimate?: number,
  isPending: boolean,
}