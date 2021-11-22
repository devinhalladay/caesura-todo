import dayjs from "dayjs";
import "firebase/firestore";
import { createRef, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import { useBoard } from "../contexts/Board";
import { Tasks } from "../lib/api";
import { Task as TaskType, TaskAction } from "../types";

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task = ({ task, index }: TaskProps) => {
  const [windowReady, setWindowReady] = useState(false);

  const { dispatch } = useBoard();

  const text = useRef(task.text);
  const textEl = createRef();

  const sanitize = () => {
    text.current = sanitizeHtml(text.current, {
      allowedTags: [],
      allowedAttributes: {},
    });
  };

  const handleChange = (e) => {
    text.current = e.target.value;
  };

  const handleBlur = (e) => {
    sanitize();

    if (task.isPending && text.current.length > 0) {
      dispatch({
        type: TaskAction.ADD_TASK,
        payload: {
          id: task.id,
          task: {
            ...task,
            text: text.current,
            isPending: false,
          },
        },
        optimistic: {
          callback: async () => {
            await Tasks.addTask(task);
          },
          fallback: (prevState) => {
            dispatch({ type: TaskAction.REVERT_STATE, payload: prevState });
          }, // (Optional)
          queue: "tasks", // (Optional)
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleCheckClick = () => {
    console.log("CLICKED CHECK");

    if (task.completed) {
      console.log("UNCOMPLETING");

      dispatch({
        type: TaskAction.UNCOMPLETE_TASK,
        payload: {
          task: {
            ...task,
            completed: false,
            completedOn: null,
          },
        },
        optimistic: {
          callback: async () => {
            await Tasks.uncomplete(task);
          },
          fallback: (prevState) => {
            dispatch({ type: TaskAction.REVERT_STATE, payload: prevState });
          }, // (Optional)
          queue: "tasks", // (Optional)
        },
      });
    } else {
      console.log("COMPLETING");

      dispatch({
        type: TaskAction.COMPLETE_TASK,
        payload: {
          task: {
            ...task,
            completed: true,
            completedOn: dayjs(),
          },
        },
        optimistic: {
          callback: async () => {
            await Tasks.complete(task);
          },
          fallback: (prevState) => {
            dispatch({ type: TaskAction.REVERT_STATE, payload: prevState });
          }, // (Optional)
          queue: "tasks", // (Optional)
        },
      });
    }
  };

  useEffect(() => {
    setWindowReady(true);
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
          {...provided.dragHandleProps}
        >
          <div className="text-sm w-full mb-1.5">
            {task.isPending ? (
              <ContentEditable
                innerRef={textEl}
                html={text.current}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <p>{task.text}</p>
            )}
          </div>
          <div className="w-full">
            <button
              className={`border ${!task.completed ? "border-gray-300" : "border-green-500"
                } flex items-center justify-center h-5 w-5 rounded-full transition-all hover:border-green-500 hover:border-2 ${!task.completed ? "text-gray-300" : "text-green-500"
                } hover:text-green-500 stroke-4 hover:stroke-6`}
              onClick={handleCheckClick}
            >
              <svg
                className=""
                width="14"
                height="6"
                viewBox="0 0 30 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
