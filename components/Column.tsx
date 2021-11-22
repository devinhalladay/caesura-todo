import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import { Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { useBoard } from '../contexts/Board';
import { TaskAction } from '../types';
import Task from './Task';
dayjs.extend(localeData);
dayjs.extend(isoWeek);

const Column = ({ date, tasks, userId, innerRef }) => {
  const { dispatch } = useBoard();

  const dayOfWeek = dayjs.weekdays()[dayjs(date).day()].toString();

  const handleAddTask = () => {
    const task = {
      id: uuid(),
      completed: false,
      createdBy: userId,
      isPending: true,
      spaceId: null,
      taskType: "outcome",
      text: "",
      plannedOnDate: date
    };

    dispatch({
      type: TaskAction.STAGE_TASK,
      payload: {
        columnId: date,
        task: task,
        createdBy: userId
      },
    });
  };

  return (
    <div className="mr-4" ref={innerRef}>
      <p className="font-sans-serif text-2xl font-bold">
        {dayOfWeek}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        {dayjs(date).format('MMMM DD')}
      </p>
      <div className="h-2 relative w-full bg-gray-200 rounded-full overflow-hidden mb-4">
        <span className="absolute top-0 left-0 h-full w-10 bg-green-500"></span>
      </div>
      <div>
        <Droppable droppableId={date}>
          {(provided) => (
            <div
              className="w-60 cursor-pointer"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <div
                className="text-sm border mb-2 shadow-sm hover:shadow-md rounded-md p-3 flex bg-white font-sans-serif transition-all duration-300"
                onClick={handleAddTask}>
                <button className="border mr-2 border-gray-300 flex items-center justify-center h-5 w-5 rounded-full transition-all  hover:border-2 text-gray-300  stroke-4 hover:stroke-6">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.125 10H16.875"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 3.125V16.875"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <span>Add a task</span>
              </div>
              {Object.values(tasks).map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default Column;
