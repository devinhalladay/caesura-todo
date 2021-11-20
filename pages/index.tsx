import dayjs from 'dayjs';
import 'firebase/firestore';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR
} from 'next-firebase-auth';
import { createRef, useEffect, useRef, useState } from 'react';
import {
  DragDropContext,
  resetServerContext
} from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import Column from '../components/Column';
import { useBoard } from '../contexts/Board';
import { Tasks } from '../lib/api';
import { Task, TaskAction } from '../types';
import {
  getDateRange
} from '../utils/dates';

type Home = {
  // tasks: Task,
  tasksByDate: Record<Task['plannedOnDate'], Task[]>,
  dates: string[],
  allTasks: Task[],
  taskList: Task[],
}

const Home = ({ tasksByDate, dates, allTasks, taskList }: Home) => {
  const AuthUser = useAuthUser();
  const { state: { tasks }, dispatch } = useBoard();

  console.log('TASK LIST', taskList);

  let columnRefs = useRef({});
  const boardRef = useRef()

  columnRefs.current = dates.reduce((newRefs, date, i) => {
    newRefs[date] = createRef();
    return newRefs
  }, {})

  useEffect(() => {
    console.log('TASKS', tasks);
    dispatch({ type: TaskAction.SET_TASKS, tasksByDate });
    console.log(tasks);

  }, [tasks]);

  const executeScroll = (date) => {
    const x = columnRefs.current[date].current.getBoundingClientRect().left + boardRef.current.scrollLeft;
    const offset = (columnRefs.current[date].current.offsetWidth * -1) - 32
    boardRef.current.scrollTo({ left: x + offset, behavior: 'smooth' });
  }

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
          onSelect={(date) => {
            let formattedDate = dayjs(date).format('YYYY-MM-DD')
            executeScroll(formattedDate)
          }}
          inline
        />
      </div>
      <div className="Board relative overflow-x-scroll flex flex-col w-full flex-auto h-full bg-gray-50 max-w-full" ref={boardRef}>
        <div className="Board__Nav sticky top-0 left-0 w-full h-14 flex flex-col border-b border-gray-400 p-4">
          Board nav
        </div>
        <div className="flex p-4 mt-14">
          <DragDropContext onDragEnd={dragEnd}>
            {dates.map((date, i) => {
              return (
                <Column
                  key={date}
                  // column={column}
                  innerRef={columnRefs.current[date]}
                  date={date}
                  tasks={tasks[date]}
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

    let taskList = await Tasks.getAll({
      userId: AuthUser.id,
    });

    console.log('TASK LISTTTTT==========');

    // console.log(taskList);

    let allTasks = Promise.all(
      dates.map(async (date) =>
        await Tasks.getTasksByDay({
          userId: AuthUser.id,
          date: dayjs(date).format('YYYY-MM-DD')
        })
      ))

    let tasks = await allTasks;

    // console.log(tasks.flat());

    const tasksByDate = dates.reduce((acc, date, index) => {
      let currentTasks = tasks[index]
      if (currentTasks === null) {
        currentTasks = []
      } else {
        currentTasks = currentTasks.map(task => {
          return task.data()
        })
      }
      return { ...acc, [date]: currentTasks };
    }, {});

    const flatTasks = tasks.flat().filter((task) => task !== null).reduce((acc, task, index) => {
      return {
        ...acc,
        [task.id]: task.data(),
      }
    }, {})

    console.log(flatTasks);



    return {
      props: {
        dates: dates,
        tasksByDate: tasksByDate,
        taskList: taskList
        // allTasks: flatTasks,
      },
    };
  }
);

export default withAuthUser()(Home);
