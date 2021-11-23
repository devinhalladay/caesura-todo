import dayjs from "dayjs";
import Modal from "react-modal";

import "firebase/firestore";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { createRef, useRef, useState } from "react";
import {
  DragDropContext,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import Column from "../components/Column";
import { useBoard } from "../contexts/Board";
import { Tasks } from "../lib/api";
import { Task as TaskType, TaskAction, TaskModalAction } from "../types";
import { getDateRange } from "../utils/dates";
import Task from "../components/Task";

type Home = {
  dates: string[];
  tasksData: Record<string, TaskType[]>;
};

// Modal.setAppElement("body");

const Home = ({ dates }: Home) => {
  const AuthUser = useAuthUser();
  const {
    state: { tasks, openTask },
    dispatch,
  } = useBoard();

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (task: TaskType) => {
    dispatch({
      type: TaskModalAction.OPEN_MODAL,
      payload: task,
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  let columnRefs = useRef({});
  const boardRef = useRef();

  columnRefs.current = dates.reduce((newRefs, date, i) => {
    newRefs[date] = createRef();
    return newRefs;
  }, {});

  const executeScroll = (date: string) => {
    const x =
      columnRefs.current[date].current.getBoundingClientRect().left +
      boardRef.current.scrollLeft;
    const offset = columnRefs.current[date].current.offsetWidth * -1 - 32;
    boardRef.current.scrollTo({ left: x + offset, behavior: "smooth" });
  };

  const dragEnd = (result: DropResult) => {
    dispatch({
      type: TaskAction.REORDER_TASK,
      payload: result,
    });
  };

  const [startDate, setStartDate] = useState(new Date());

  return (
    <>
      <div className="flex absolute top-0 left-0 w-full h-full">
        <div className="LeftSidebar min-w-60 flex flex-col bg-gray-50 h-full flex-grow-0 p-4 border-r border-gray-200 shadow-inner">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            onSelect={(date) => {
              let formattedDate = dayjs(date).format("YYYY-MM-DD");
              executeScroll(formattedDate);
            }}
            inline
          />
        </div>
        <div
          className="Board relative overflow-x-scroll flex flex-col w-full flex-auto h-full bg-gray-50 max-w-full"
          ref={boardRef}
        >
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
                    handleOpenModal={handleOpenModal}
                    tasks={tasks[date]}
                    userId={AuthUser.id}
                  />
                );
              })}
            </DragDropContext>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        contentLabel="Task Modal"
        bodyOpenClassName="overflow-y-hidden"
        preventScroll={true}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        shouldFocusAfterRender={true}
        onRequestClose={handleCloseModal}
      >
        {openTask && (
          <>
            <div className="flex items-center">
              <div className="mr-2">
                <button
                  className={`border ${
                    !openTask.completed ? "border-gray-300" : "border-green-500"
                  } flex items-center justify-center h-5 w-5 rounded-full transition-all hover:border-green-500 hover:border-2 ${
                    !openTask.completed ? "text-gray-300" : "text-green-500"
                  } hover:text-green-500 stroke-4 hover:stroke-6`}
                  // onClick={handleCheckClick}
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
              <div className="text-2xl">
                <p>{openTask.text}</p>
              </div>
            </div>
          </>
        )}

        <button onClick={handleCloseModal}>close</button>
      </Modal>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(
  async ({ AuthUser }) => {
    resetServerContext();

    const dates = getDateRange(
      dayjs().subtract(8, "day"),
      dayjs().add(7, "day")
    );

    let tasks = await Tasks.getTasksByDay({
      userId: AuthUser.id,
    });

    dates.forEach((date) => {
      if (!tasks[date]) {
        tasks[date] = {};
      }
    });

    return {
      props: {
        dates: dates,
        tasks: tasks,
      },
    };
  }
);

export default withAuthUser()(Home);
