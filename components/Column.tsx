import dayjs from 'dayjs';
import { useRef } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(localeData);
dayjs.extend(isoWeek);

const Column = ({ column, tasks, newTask }) => {
  const ref = useRef(null);

  const date = dayjs(column.id);
  const dayOfWeek = dayjs.weekdays()[date.day()].toString();

  return (
    <div className="mr-4">
      <p className="font-sans-serif text-2xl font-bold">
        {dayOfWeek}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        {date.format('MMMM DD')}
      </p>
      <div className="h-2 relative w-full bg-gray-200 rounded-full overflow-hidden mb-4">
        <span className="absolute top-0 left-0 h-full w-10 bg-green-500"></span>
      </div>
      <div>
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              className="w-60 cursor-pointer"
              onClick={() => newTask(column.id)}
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <div className="text-sm border mb-2 shadow-sm hover:shadow-md rounded-md p-3 flex bg-white font-sans-serif transition-all duration-300">
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
              {tasks.map((task, index) => (
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
