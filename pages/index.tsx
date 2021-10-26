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

const initialData = {
  tasks: {
    '1': {
      'id': '1',
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
    '2': {
      'id': '2',
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
    '3': {
      'id': '3',
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
    '4': {
      'id': '4',
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
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['1', '3'],
    },
  },
  columnOrder: ['column-1'],
};

const Home = () => {
  const AuthUser = useAuthUser();

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

    const column = data.columns[source.droppableId];

    const newTaskIds = Array.from(column.taskIds);

    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...data,
      columns: { ...data.columns, [newColumn.id]: newColumn },
    };

    console.log(newState);

    console.log(data);

    setData(newState);
  };

  return (
    <div className="flex absolute top-0 left-0 w-full h-full">
      <div className="LeftSidebar w-60 flex flex-col bg-gray-100 h-full flex-grow-0 p-4">
        Calendar
      </div>
      <div className="Board flex flex-col w-full flex-auto h-full">
        <div className="Board__Nav flex flex-col border-b border-gray-400 p-4">
          Nav
        </div>
        <div className="flex p-4">
          <DragDropContext onDragEnd={dragEnd}>
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map(
                (taskId) => data.tasks[taskId]
              );
              return (
                <Column
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
