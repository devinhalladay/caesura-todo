import { useRef, useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }) => {
  const [windowReady, setWindowReady] = useState(false);

  useEffect(() => {
    setWindowReady(true);
  }, []);

  return windowReady ? (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot, ...rest) => (
        <div
          className="border mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          {task.id}
        </div>
      )}
    </Draggable>
  ) : null;
};

export default Task;
