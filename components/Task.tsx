import { useRef, useState, useEffect, createRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Draggable } from "react-beautiful-dnd";
import checkmark from "../assets/icons/check.svg";
import ContentEditable from "react-contenteditable";
import { useBoard } from "../contexts/Board";
import { Task as TaskType, TaskAction } from "../types";
import dayjs from "dayjs";
import { getFirebaseAdmin } from "next-firebase-auth";

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task = ({ task, index }: TaskProps) => {
  const [windowReady, setWindowReady] = useState(false);

  const { dispatch } = useBoard();

  const text = useRef(task.text);
  const textEl = createRef();

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  // const firebase = getFirebaseAdmin().firestore()

  const handleChange = debounce((e) => {
    text.current = e.target.value;
    dispatch({
      type: TaskAction.UPDATE_TASK,
      payload: {
        id: task.id,
        updates: {
          text: text.current,
          isPending: false,
        },
      },
    });
  });

  const handleBlur = () => {
    console.log(text.current);
  };

  const handleCheckClick = () => {
    if (task.completed) {
      dispatch({
        type: TaskAction.UNCOMPLETE_TASK,
        payload: {
          id: task.id,
        },
      });
    } else {
      dispatch({
        type: TaskAction.COMPLETE_TASK,
        payload: {
          id: task.id,
          updates: {
            completed: true,
            completedDate: dayjs(),
          },
        },
      });
    }
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
          {...provided.dragHandleProps}
        >
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
            <button
              className={`border ${
                !task.completed ? "border-gray-300" : "border-green-500"
              } flex items-center justify-center h-5 w-5 rounded-full transition-all hover:border-green-500 hover:border-2 ${
                !task.completed ? "text-gray-300" : "text-green-500"
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
