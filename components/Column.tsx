import { useRef } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';

const Column = ({ column, tasks, newTask }) => {
  const ref = useRef(null);

  return (
    <div className="mr-4">
      <p>{column.title}</p>
      <div>
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              className="w-60"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              <button onClick={() => newTask(column.id)}>
                New Task
              </button>
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
