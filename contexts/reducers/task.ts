import { Api } from "../../lib/api";
import { HttpMethod, TaskAction, TaskIntent } from "../../types";
import { InitialStateType } from "../Board";

/** Controls the state of a task. */
export const taskReducer = async (
  state: InitialStateType,
  action: TaskIntent
): Promise<InitialStateType> => {
  switch (action.type) {
    case TaskAction.ADD_TASK: {
      const { task } = action.payload;

      const newState = state;
      newState.tasks[task.plannedOnDate][task.id] = task;

      await Api.request({
        method: HttpMethod.POST,
        path: `/tasks/create`,
        body: {
          createdBy: task.createdBy,
          task: task,
        },
      })
        .then((r) => {
          console.log("ACTION DONE AND PROMISE RESOLVED:", r.docs);
        })
        .catch((err) => {
          console.error("ACTION FAILED:", err);
        });
    }

    case TaskAction.STAGE_TASK: {
      const { task } = action.payload;

      const newState = state;

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
      const newState = state;
      let task;
      console.log(state);


      // const resp = Api.request({
      //   method: HttpMethod.POST,
      //   path: `/tasks/update`,
      //   body: {
      //     id: action.payload.id,
      //     updates: action.payload.updates,
      //   },
      // })
      //   .then((doc) => {
      //     const newState = {
      //       ...state,
      //       tasks: {
      //         ...state.tasks,
      //         [action.payload.id]: {
      //           ...state.tasks[action.payload.id],
      //           ...action.payload.updates,
      //         },
      //       },
      //     };

      //     return newState;
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //     return err;
      //   });
    }

    case TaskAction.UPDATE_TASK: {
      await Api.request({
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
      const resp = Api.request({
        method: HttpMethod.POST,
        path: `/tasks/update`,
        body: {
          id: action.payload.id,
          updates: {
            completed: false,
            completedDate: null,
          },
        },
      }).then((doc) => console.log(doc));

      console.log(resp);

      const newState = {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.id]: {
            ...state.tasks[action.payload.id],
            completed: false,
            completedDate: null,
          },
        },
      };

      return newState;
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
