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
import DatePicker from 'react-datepicker';
import { useBoard } from '../contexts/Board';
import { useEffect } from 'hoist-non-react-statics/node_modules/@types/react';

const Home = () => {
  const AuthUser = useAuthUser();

  const { state, setState, createTask } = useBoard();

  const currentMonthDays = createDaysForCurrentMonth('2021', '10');

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

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: { ...state.columns, [newColumn.id]: newColumn },
      };

      setState(newState);

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
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="flex absolute top-0 left-0 w-full h-full">
      <div className="LeftSidebar min-w-60 flex flex-col bg-gray-50 h-full flex-grow-0 p-4 border-r border-gray-200 shadow-inner">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          inline
        />
      </div>
      <div className="Board overflow-x-scroll flex flex-col w-full flex-auto h-full bg-gray-50 max-w-full">
        <div className="Board__Nav flex flex-col border-b border-gray-400 p-4">
          Board nav
        </div>
        <div className="flex p-4">
          <DragDropContext onDragEnd={dragEnd}>
            {state.columnOrder.map((columnId, index) => {
              const column = state.columns[columnId];

              const tasks = column.taskIds.map(
                (taskId) => state.tasks[taskId]
              );

              return (
                <Column
                  newTask={createTask}
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
