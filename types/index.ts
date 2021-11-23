import { Dayjs } from "dayjs";
import { DropResult } from "react-beautiful-dnd";
import { InitialStateType } from "../contexts/Board";

export enum HttpMethod {
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE",
}

export enum TaskAction {
  ADD_TASK = "ADD_TASK",
  UPDATE_TASK = "UPDATE_TASK",
  STAGE_TASK = "STAGE_TASK",
  COMPLETE_TASK = "COMPLETE_TASK",
  REMOVE_TASK = "REMOVE_TASK",
  REORDER_TASK = "REORDER_TASK",
  UNCOMPLETE_TASK = "UNCOMPLETE_TASK",
  REVERT_STATE = "REVERT_STATE",
}

export type TaskPayload = {
  task: Task;
};

export enum TaskModalAction {
  OPEN_MODAL = "OPEN_MODAL",
}

export type TaskModalIntent = {
  type: TaskModalAction.OPEN_MODAL;
  payload: {
    task: Task | null;
  };
};

export type TaskIntent =
  | {
      type:
        | TaskAction.ADD_TASK
        | TaskAction.UPDATE_TASK
        | TaskAction.STAGE_TASK
        | TaskAction.COMPLETE_TASK
        | TaskAction.REMOVE_TASK
        | TaskAction.UNCOMPLETE_TASK;
      payload: TaskPayload;
    }
  | {
      type: TaskAction.REVERT_STATE;
      payload: InitialStateType;
    }
  | {
      type: TaskAction.REORDER_TASK;
      payload: DropResult;
    };

export type Task = {
  id: string;
  createdAt: Date;
  text: string;
  completed: boolean;
  createdBy: string;
  plannedOnDate: string;
  actualTime?: number;
  completeDate?: string | null;
  dueDate?: string;
  duration?: number;
  notes?: string;
  objectiveId?: string;
  timeEstimate?: number;
  isPending: boolean;
  /** After will null if it is the first task in a day */
  after?: string | null;
};
