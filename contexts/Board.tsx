import React, {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useState,
} from 'react';
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

const initialData = {
  tasks: initialTasks,
  columns: initialColumns,
  columnOrder: initialColumnOrder,
};

// /**
//  * This will be used to combine UI actions into a single type.
//  * This is mainly to make it easier to maintain action types.
//  */
// type AllActionType = {
//   type: SheetIntent;
// };

// type InitialStateType = {
//   sheetIntent: SheetIntent;
// };

// const initialState = {
//   sheetIntent: null,
// };

/**
 * UI Context is used to store state for global UI elements.
 * We rely on React's useReducer() hook to access and update the state.
 * This pattern works in a similar way as Redux.
 *
 * If you want to add a value to the context provider (BoardProvider)
 * you should first define the types here.
 */
export const BoardContext = createContext<{
  state: object;
  dispatch: Dispatch<any>;
  createTask: (columnId: string) => void;
  closeSheet: () => void;
}>({
  state: initialData,
  dispatch: () => null,
  createTask: (columnId) => {},
  closeSheet: () => {},
});

/** Controls the global state of Sheets, including visibility and content. */
// export const sheetReducer = (
//   state: object,
//   action: any
// ) => {
//   switch (action.type) {
//     case 'CREATE_TASK':
//       // TODO: Accept a payload to populate state with order data.
//       return 'SHOW_ORDER_DETAILS';
//     case 'CLOSE_SHEET':
//       return null;
//     default:
//       return state;
//   }
// };

/**
 * This pattern has the same rationale as AllActionType.
 * mainReducer() combines multiple reducers, each controlling
 * a specific piece of state. This keeps things a little cleaner
 * in the BoardProvider code.
 */
// const mainReducer = (
//   { sheetIntent }: InitialStateType,
//   action: AllActionType
// ) => ({
//   sheetIntent: sheetReducer(sheetIntent, action),
// });

export const BoardProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(initialData);
  // const [state, dispatch] = useReducer(mainReducer, initialState);

  // const registerSheetIntent = (type: SheetIntent) =>
  //   dispatch({ type: type });
  // const closeSheet = () => dispatch({ type: 'CLOSE_SHEET' });

  const createTask = (columnId: string) => {
    let newTaskIds = Array.from(state.columns[columnId].taskIds);

    console.log(newTaskIds);
    let taskId = `${columnId}-${
      state.columns[columnId].taskIds.length + 1
    }`;

    newTaskIds.unshift(taskId);

    let newTasks = {
      ...state.tasks,
      [taskId]: {
        isPending: true,
        'id': taskId,
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
        'text': '',
        'timeEstimate': 15,
      },
    };

    const newColumn = {
      ...state.columns[columnId],
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      columns: { ...state.columns, [columnId]: newColumn },
      tasks: { ...state.tasks, ...newTasks },
    };

    console.log(state);

    console.log(newState);

    setState(newState);

    return;
  };

  return (
    <BoardContext.Provider value={{ state, setState, createTask }}>
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
