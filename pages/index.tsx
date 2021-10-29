import { getFirebaseAdmin } from 'next-firebase-auth'
import { v4 as uuid } from 'uuid';

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
  getDateRange,
} from '../utils/dates';
import DatePicker from 'react-datepicker';
import { useBoard } from '../contexts/Board';
import { useEffect } from 'hoist-non-react-statics/node_modules/@types/react';
import { TaskAction, Task } from '../types';
import { Api, Tasks } from '../lib/api';

type Home = {
  // tasks: Task,
  tasksByDate: Record<Task['plannedOnDate'], Task>,
  dates: string[]
}

const Home = ({tasksByDate, dates}: Home) => {
  const AuthUser = useAuthUser();
  const { state, dispatch } = useBoard();

  console.log(tasksByDate);



  const currentMonthDays = createDaysForCurrentMonth('2021', '10');

  const dragEnd = (result) => {
    dispatch({
      type: TaskAction.REORDER_TASK,
      payload: result,
    });
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
            {dates.map((date, index) => {
              console.log(date);

              return (
                <Column
                  key={date}
                  // column={column}
                  date={date}
                  tasks={tasksByDate[date]}
                  userId={AuthUser.id}
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

    const dates = getDateRange(dayjs().subtract(8, 'day'), dayjs().add(7, 'day'));

    let allTasks = Promise.all(
      dates.map(async (date) =>
        await Tasks.getTasksByDay({
          userId: AuthUser.id,
          date: dayjs(date).format('YYYY-MM-DD')
        })
    ))

    let tasks = await allTasks;

    const tasksByDate = dates.reduce((acc, date, index) => {
      let currentTasks = tasks[index]
      if (currentTasks === null) {
        currentTasks = []
      } else {
        currentTasks = currentTasks.map(task => {
          return task.data()
        })
      }
      return {...acc, [date]: currentTasks};
    }, {});

    return { props: {
      dates: dates,
      tasksByDate: tasksByDate,
      // tasks: tasks.map((a) => {
      //  return { ...a.data(), key: a.id }
      // }),

    } };
  }
);

export default withAuthUser()(Home);
