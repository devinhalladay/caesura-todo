import dayjs from 'dayjs';
import React, {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useState,
} from 'react';
import { Api } from '../lib/api'
import { v4 as uuid } from 'uuid';
import { HttpMethod, Task, TaskAction, TaskIntent } from '../types';
import { createDaysForCurrentMonth } from '../utils/dates';

const initialColumns = createDaysForCurrentMonth('2021', '10').reduce(
  (acc, currentValue, currentIndex) => ({
    ...acc,
    [currentValue.dateString]: {
      id: currentValue.dateString,
      title: 'testset',
      taskIds: [
        `${currentValue.dateString}-1`,
        `${currentValue.dateString}-2`,
        `${currentValue.dateString}-3`,
      ],
    },
  }),
  {}
);

let initialColumnOrder = createDaysForCurrentMonth('2021', '10').map(
  (day, index) => day.dateString
);

const initialTasks = createDaysForCurrentMonth('2021', '10').reduce(
  (acc, currentValue, currentIndex) => ({
    ...acc,
    [`${currentValue.dateString}-1`]: {
      'id': `${currentValue.dateString}-1`,
      'actualTime': null,
      'completeDate': null,
      'completeOn': null,
      'completed': false,
      'completedBy': null,
      'createdAt': '2021-10-11T20:05:47.293Z',
      'createdBy': '6116d75820a45f00095030ae',
      'dueDate': null,
      'duration': null,
      'eventInfo': null,
      'groupId': '6116d78120a45f00095030b0',
      'integration': null,
      'lastModified': '2021-10-25T14:31:12.628Z',
      'notes': '',
      'objectiveId': null,
      'runDate': null,
      'taskType': 'outcomes',
      'text': 'Clear sink of dishes',
      'timeEstimate': 15,
    },
    [`${currentValue.dateString}-2`]: {
      'id': `${currentValue.dateString}-2`,
      'actualTime': null,
      'completeDate': null,
      'completeOn': null,
      'completed': false,
      'completedBy': null,
      'createdAt': '2021-10-11T20:05:47.293Z',
      'createdBy': '6116d75820a45f00095030ae',
      'dueDate': null,
      'duration': null,
      'eventInfo': null,
      'groupId': '6116d78120a45f00095030b0',
      'integration': null,
      'lastModified': '2021-10-25T14:31:12.628Z',
      'notes': '',
      'objectiveId': null,
      'runDate': null,
      'taskType': 'outcomes',
      'text': 'Clear sink of dishes',
      'timeEstimate': 15,
    },
    [`${currentValue.dateString}-3`]: {
      'id': `${currentValue.dateString}-3`,
      'actualTime': null,
      'completeDate': null,
      'completeOn': null,
      'completed': false,
      'completedBy': null,
      'createdAt': '2021-10-11T20:05:47.293Z',
      'createdBy': '6116d75820a45f00095030ae',
      'dueDate': null,
      'duration': null,
      'eventInfo': null,
      'groupId': '6116d78120a45f00095030b0',
      'integration': null,
      'lastModified': '2021-10-25T14:31:12.628Z',
      'notes': '',
      'objectiveId': null,
      'runDate': null,
      'taskType': 'outcomes',
      'text': 'Clear sink of dishes',
      'timeEstimate': 15,
    },
  }),
  {}
);

/**
 * This will be used to combine UI actions into a single type.
 * This is mainly to make it easier to maintain action types.
 */
type AllActionType = {
  type: TaskAction;
  payload?: object;
};

type InitialStateType = {
  tasks: Record<Task['id'], Task>;
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
export const taskReducer = (
  state: InitialStateType,
  action: TaskIntent
): InitialStateType => {
  switch (action.type) {
    case TaskAction.ADD_TASK: {
      console.log(action);
      console.log(state);

      const resp = Api.request({
        method: HttpMethod.POST,
        path: `/tasks/create`,
        body: {
          createdBy: action.payload.task.createdBy,
          task: action.payload.task
        },
      })

      console.log('RESPONSE FROM API');

      console.log(resp);


      return state;

      // const { columnId } = action.payload;
      // let newTaskIds = Array.from(state.columns[columnId].taskIds);

      // // console.log(newTaskIds);
      // let taskId = `${columnId}-${state.columns[columnId].taskIds.length + 1
      //   }`;

      // newTaskIds.unshift(taskId);

      // let newTasks = {
      //   ...state.tasks,
      //   [taskId]: {
      //     isPending: true,
      //     'id': taskId,
      //     'actualTime': null,
      //     'completeDate': null,
      //     'completeOn': null,
      //     'completed': false,
      //     'completedBy': null,
      //     'createdAt': '2021-10-11T20:05:47.293Z',
      //     'createdBy': '6116d75820a45f00095030ae',
      //     'dueDate': null,
      //     'duration': null,
      //     'eventInfo': null,
      //     'groupId': '6116d78120a45f00095030b0',
      //     'integration': null,
      //     'lastModified': '2021-10-25T14:31:12.628Z',
      //     'notes': '',
      //     'objectiveId': null,
      //     'runDate': null,
      //     'taskType': 'outcomes',
      //     'text': '',
      //     'timeEstimate': 15,
      //   },
      // };

      // const newColumn = {
      //   ...state.columns[columnId],
      //   taskIds: newTaskIds,
      // };

      // const newState = {
      //   ...state,
      //   columns: { ...state.columns, [columnId]: newColumn },
      //   tasks: { ...state.tasks, ...newTasks },
      // };

      // return newState;
    }

    case TaskAction.COMPLETE_TASK: {
      const resp = Api.request({
        method: HttpMethod.POST,
        path: `/tasks/update`,
        body: {
          id: action.payload.id,
          updates: action.payload.updates
        },
      }).then((doc) => {
        const newState = {
          ...state,
          tasks: {
            ...state.tasks, [action.payload.id]: {
              ...state.tasks[action.payload.id],
              ...action.payload.updates
            },
          },
        };

        console.log('NEW STATE');

        console.log(newState);
        console.log(doc);



        return newState
      }).catch((err) => {
        console.error(err)
        return err
      })
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
          }
        },
      }).then((doc) =>
        console.log(doc)
      );

      console.log(resp);

      const newState = {
        ...state,
        tasks: {
          ...state.tasks, [action.payload.id]: {
            ...state.tasks[action.payload.id],
            completed: false,
            completedDate: null,
          },
        },
      };

      return newState

      // let newTask = { ...state.tasks[action.payload.taskId] }
      // newTask.completed = false;
      // newTask.completeDate = null;

      // return {
      //   ...state,
      //   tasks: {
      //     ...state.tasks,
      //     [newTask.id]: newTask
      //   },
      // };
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
const mainReducer = (
  state: InitialStateType,
  action: AllActionType
) => ({
  ...state,
  ...taskReducer(state, action),
});

export const BoardProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

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
      'useBoard can only be used in the context of a BoardProvider.'
    );
  }
  return ctx;
};
