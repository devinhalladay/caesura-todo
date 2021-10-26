import { useRef, useState, useEffect, createRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import checkmark from '../assets/icons/check.svg';
import ContentEditable from 'react-contenteditable';

const Task = ({ task, index }) => {
  const [windowReady, setWindowReady] = useState(false);

  const text = useRef(task.text);
  const textEl = createRef();

  const handleChange = (e) => {
    text.current = e.target.value;
    console.log(text.current);
  };

  const handleBlur = () => {
    console.log(text.current);
  };

  useEffect(() => {
    setWindowReady(true);
    console.log(textEl);
  }, []);

  useEffect(() => {
    textEl.current && textEl.current.focus();
    return;
  }, [textEl]);

  return windowReady ? (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot, ...rest) => (
        <div
          className="border mb-2 shadow-sm hover:shadow-md rounded-md p-3 flex flex-col bg-white font-sans-serif transition-all duration-300"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <div className="text-sm w-full mb-1.5">
            {task.isPending ? (
              <ContentEditable
                innerRef={textEl}
                html={text.current}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            ) : (
              <p>{task.text}</p>
            )}
          </div>
          <div className="w-full">
            <button className="border border-gray-300 flex items-center justify-center h-5 w-5 rounded-full transition-all hover:border-green-500 hover:border-2 text-gray-300 hover:text-green-500 stroke-4 hover:stroke-6">
              <svg
                className=""
                width="14"
                height="6"
                viewBox="0 0 30 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M29 1L10.3333 19L1 10.0004"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  ) : null;
};

export default Task;
