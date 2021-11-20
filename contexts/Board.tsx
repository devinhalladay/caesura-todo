import dayjs from "dayjs";
import React, {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useState,
} from "react";
import useOptimisticReducer from "use-optimistic-reducer";
import { Api } from "../lib/api";
import { v4 as uuid } from "uuid";
import { HttpMethod, Task, TaskAction, TaskIntent } from "../types";
import { createDaysForCurrentMonth } from "../utils/dates";
import { Optimistic } from "use-optimistic-reducer/build/types";

const initialColumns = createDaysForCurrentMonth("2021", "10").reduce(
  (acc, currentValue, currentIndex) => ({
    ...acc,
    [currentValue.dateString]: {
      id: currentValue.dateString,
      title: "testset",
      taskIds: [
        `${currentValue.dateString}-1`,
        `${currentValue.dateString}-2`,
        `${currentValue.dateString}-3`,
      ],
    },
  }),
  {}
);

let initialColumnOrder = createDaysForCurrentMonth("2021", "10").map(
  (day, index) => day.dateString
);

const initialTasks = {};

/**
 * This will be used to combine UI actions into a single type.
 * This is mainly to make it easier to maintain action types.
 */
type AllActionType = {
  type: TaskAction;
  payload?: object;
  optimistic?: Optimistic<typeof taskReducer>;
};

type InitialStateType = {
  tasks: Record<Task["id"], Task[]>;
  columns: object;
  columnOrder: string[];
};

const initialState = {
  tasks: initialTasks,
  columns: initialColumns,
  columnOrder: initialColumnOrder,
};

/**
 * UI Context is used to store state for global UI elements.
 * We rely on React's useReducer() hook to access and update the state.
 * This pattern works in a similar way as Redux.
 *
 * If you want to add a value to the context provider (BoardProvider)
 * you should first define the types here.
 */
export const BoardContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<AllActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

/** Controls the state of a task. */
export const taskReducer = async (
  state: InitialStateType,
  action: TaskIntent
): Promise<InitialStateType> => {
  switch (action.type) {
    case TaskAction.ADD_TASK: {
      console.log("adding task");

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

    case TaskAction.UPDATE_ALL_TASKS: {
      const newState = {
        ...state,
        ...action.payload,
      };

      return newState;
    }

    case TaskAction.SET_TASKS: {
      const newState = {
        ...state,
        tasks: action.payload,
      };

      console.log("SETTING TASKS", action.payload);

      return newState;
    }

    case TaskAction.COMPLETE_TASK: {
      const resp = Api.request({
        method: HttpMethod.POST,
        path: `/tasks/update`,
        body: {
          id: action.payload.id,
          updates: action.payload.updates,
        },
      })
        .then((doc) => {
          const newState = {
            ...state,
            tasks: {
              ...state.tasks,
              [action.payload.id]: {
                ...state.tasks[action.payload.id],
                ...action.payload.updates,
              },
            },
          };

          console.log("NEW STATE");

          console.log(newState);
          console.log(doc);

          return newState;
        })
        .catch((err) => {
          console.error(err);
          return err;
        });
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

          console.log("NEW STATE");

          console.log(newState);
          console.log(doc);

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
          columns: { ...state.columns, [newColumn.id]: newColumn },
          columnOrder: state.columnOrder,
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
          columns: {
            ...state.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
          },
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

/**
 * This pattern has the same rationale as AllActionType.
 * mainReducer() combines multiple reducers, each controlling
 * a specific piece of state. This keeps things a little cleaner
 * in the BoardProvider code.
 */
const mainReducer = (state: InitialStateType, action: AllActionType) => ({
  ...state,
  ...taskReducer(state, action),
});

export const BoardProvider: React.FC = ({ children, value }) => {
  console.log(value);

  const _initialState = initialState;
  _initialState.tasks = value.tasks
  const [state, dispatch] = useOptimisticReducer(mainReducer, _initialState);

  // const registerSheetIntent = (type: SheetIntent) =>
  //   dispatch({ type: type });
  // const closeSheet = () => dispatch({ type: 'CLOSE_SHEET' });

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};

/** This is a hook you may use to access our context in a component. */
export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error(
      "useBoard can only be used in the context of a BoardProvider."
    );
  }
  return ctx;
};
