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

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [task.plannedOnDate]: {
            ...state.tasks[task.plannedOnDate],
            [task.id]: { ...task },
          },
        },
      };
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
              completeDate: dayjs().format("YYYY-MM-DD"),
            },
          },
        },
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
              completeDate: null,
            },
          },
        },
      };
    }

    case TaskAction.REMOVE_TASK:
      // return state.filter((task) => task.id !== action.id);
      return state;

    case TaskAction.REORDER_TASK: {
      console.log(action.payload);
      const { draggableId, mode, reason, source, type, combine, destination } =
        action.payload;

      // if there is no destination, return the existing state
      if (!destination) {
        return state;
      }

      // if the destination is the same as the source, return the existing state
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return state;
      }

      // add a variable for the startColumn and assign it to the source.droppableId
      const startColumn = source.droppableId;
      const finishColumn = destination.droppableId;

      if (startColumn !== finishColumn) {
        const newState = {
          ...state,
          tasks: {
            ...state.tasks,
            [finishColumn]: {
              ...state.tasks[finishColumn],
              [draggableId]: {
                ...state.tasks[startColumn][draggableId],
              },
            },
          },
        };

        delete newState.tasks[startColumn][draggableId];

        return newState;
      } else {
        const newState = {
          ...state,
          tasks: {
            ...state.tasks,
            [startColumn]: {
              ...state.tasks[startColumn],
              [draggableId]: {
                ...state.tasks[startColumn][draggableId],
              },
            },
          },
        };

        return newState;
      }
    }

    case TaskAction.REVERT_STATE: {
      return action.payload;
    }

    default:
      return state;
  }
};
