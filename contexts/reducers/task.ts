import dayjs from "dayjs";
import { Api } from "../../lib/api";
import { HttpMethod, TaskAction, TaskIntent } from "../../types";
import { InitialStateType } from "../Board";

/** Controls the state of a task. */
export const taskReducer = (
  state: InitialStateType,
  action: TaskIntent
): InitialStateType => {
  switch (action.type) {
    case TaskAction.ADD_TASK: {
      const { task } = action.payload;

      const newState = state;
      newState.tasks[task.plannedOnDate][task.id] = task;
    }

    case TaskAction.STAGE_TASK: {
      const { task } = action.payload;

      let newState = state;

      newState.tasks[task.plannedOnDate][task.id] = task;

      return newState;
    }

    case TaskAction.SET_TASKS: {
      const newState = {
        ...state,
        tasks: action.payload,
      };

      return newState;
    }

    case TaskAction.COMPLETE_TASK: {
      const { task } = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.plannedOnDate]: {
            ...state.tasks[task.plannedOnDate],
            [task.id]: {
              ...state.tasks[task.plannedOnDate][task.id],
              completed: true,
              completeDate: dayjs().format("YYYY-MM-DD")
            }
          }
        }
      };
    }

    case TaskAction.UPDATE_TASK: {
      Api.request({
        method: HttpMethod.POST,
        path: `/tasks/update`,
        body: {
          id: action.payload.id,
          updates: action.payload.task,
        },
      })
        .then((doc) => {
          const newState = state;
          const task = action.payload.task;

          newState.tasks[task.plannedOnDate][task.id] = task;

          return newState;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    }

    case TaskAction.REFETCH_TASK: {
      const resp = Api.request({
        method: HttpMethod.GET,
        path: `/tasks`,
        body: {
          id: action.payload.id,
        },
      })
        .then((doc) => {
          console.log(doc);

          return state;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
    }

    case TaskAction.UNCOMPLETE_TASK: {
      const { task } = action.payload;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.plannedOnDate]: {
            ...state.tasks[task.plannedOnDate],
            [task.id]: {
              ...state.tasks[task.plannedOnDate][task.id],
              completed: false,
              completeDate: null
            }
          }
        }
      };
    }

    case TaskAction.REMOVE_TASK:
      // return state.filter((task) => task.id !== action.id);
      return state;

    case TaskAction.REORDER_TASK: {
      const { destination, source, draggableId } = action.payload;

      if (!destination) {
        return state;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return state;
      }

      const startColumn = state.columns[source.droppableId];
      const finishColumn = state.columns[destination.droppableId];

      if (startColumn === finishColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);

        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = {
          ...startColumn,
          taskIds: newTaskIds,
        };

        return {
          tasks: state.tasks,
        };
      } else {
        // Move from one list to another
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
          ...startColumn,
          taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
          ...finishColumn,
          taskIds: finishTaskIds,
        };

        const newState = {
          ...state,
        };

        return newState;
      }
    }

    case TaskAction.RESET_STATE: {
      return action.payload;
    }

    default:
      return state;
  }
};
