import dayjs from 'dayjs';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { useState } from 'react';
import {
  DragDropContext,
  resetServerContext,
} from 'react-beautiful-dnd';
import Column from '../components/Column';
import {
  createDaysForCurrentMonth,
  daysOfWeek,
} from '../utils/dates';

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

const Home = () => {
  const AuthUser = useAuthUser();

  console.log(initialData);
  const currentMonthDays = createDaysForCurrentMonth('2021', '10');

  const [data, setData] = useState(initialData);

  const dragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      };

      setData(newState);

      return;
    }

    // Move from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  const newTask = (columnId: string) => {
    let newTaskIds = Array.from(data.columns[columnId].taskIds);

    console.log(newTaskIds);
    let taskId = `${columnId}-${
      data.columns[columnId].taskIds.length + 1
    }`;

    newTaskIds.unshift(taskId);

    let newTasks = {
      ...data.tasks,
      [taskId]: {
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
        'text': 'Clear sink of diretyshes',
        'timeEstimate': 15,
      },
    };

    const newColumn = {
      ...data.columns[columnId],
      taskIds: newTaskIds,
    };

    const newState = {
      ...data,
      columns: { ...data.columns, [columnId]: newColumn },
      tasks: { ...initialTasks, ...newTasks },
    };

    console.log(data);

    console.log(newState);

    setData(newState);

    return;
  };

  return (
    <div className="flex absolute top-0 left-0 w-full h-full">
      <div className="LeftSidebar w-60 flex flex-col bg-gray-100 h-full flex-grow-0 p-4">
        Calendar
      </div>
      <div className="Board flex flex-col w-full flex-auto h-full bg-gray-100 max-w-full">
        <div className="Board__Nav flex flex-col border-b border-gray-400 p-4">
          Nav
        </div>
        <div className="flex p-4">
          <DragDropContext onDragEnd={dragEnd}>
            {data.columnOrder.map((columnId, index) => {
              const column = data.columns[columnId];

              const tasks = column.taskIds.map(
                (taskId) => data.tasks[taskId]
              );

              return (
                <Column
                  newTask={newTask}
                  key={column.id}
                  column={column}
                  tasks={tasks}
                />
              );
            })}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ AuthUser }) => {
    resetServerContext();

    return { props: {} };
  }
);

export default withAuthUser()(Home);
