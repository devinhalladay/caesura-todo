import dayjs from "dayjs";
import "firebase/firestore";
import { getFirebaseAdmin } from "next-firebase-auth";
import { HttpMethod, Task } from "../../types";
import Request from "../request";

export const Api = {
  url: (path: string) => `/api${path}`,
  headers: async () => {
    const base = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return base;
  },
  async request(options: {
    method: HttpMethod;
    path: string;
    body?: object;
    params?: object;
  }): Promise<unknown> {
    return Request.make({
      method: options.method,
      url: Api.url(options.path),
      body: options.body,
      params: options.params,
      headers: await Api.headers(),
    });
  },
};

type TasksTypes = {
  getTasksByDay: (options: {
    userId: string;
    date: Date | string;
  }) => Promise<Task[]> | null;
  getAll: (options: { userId: string }) => Promise<Task[]> | null;
  addTask: (task: Task) => Promise<Task>;
  update: (task: Task) => Promise<Task>;
  complete: (task: Task) => Promise<Task>;
};

export const Tasks: TasksTypes = {
  addTask: async (task: Task) => {
    const res = await Api.request({
      method: HttpMethod.POST,
      path: `/tasks/create`,
      body: {
        createdBy: task.createdBy,
        task: task,
      },
    });

    return res;
  },

  update: async (task: Task) => {
    const res = await Api.request({
      method: HttpMethod.POST,
      path: `/tasks/update`,
      body: {
        id: task.id,
        updates: task,
      },
    });

    return res;
  },

  complete: async (task: Task) => {
    const res = await Api.request({
      method: HttpMethod.POST,
      path: `/tasks/update`,
      body: {
        id: task.id,
        updates: {
          completed: true,
          completedDate: dayjs(),
        },
      },
    });

    return res;
  },

  uncomplete: async (task: Task) => {
    console.log(task);

    const res = await Api.request({
      method: HttpMethod.POST,
      path: `/tasks/update`,
      body: {
        id: task.id,
        updates: {
          completed: false,
          completedDate: null,
        },
      },
    });

    return res;
  },

  getAll: async ({ userId }) => {
    const db = getFirebaseAdmin().firestore();
    let tasks = await db
      .collection("tasks")
      .where("createdBy", "==", userId)
      .get();
    // tasks = tasks.docs.map(doc => doc.data());

    // Reduce tasks.docs to an object with the id as the key and the task as the value
    let tasksKeyedById = tasks.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.id] = data;
      return acc;
    }, {});

    try {
      return tasksKeyedById;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getTasksByDay: async ({ userId, date }) => {
    const db = getFirebaseAdmin().firestore();
    let snapshot = await db
      .collection("tasks")
      .where("createdBy", "==", userId)
      .get();

    let collection = snapshot.docs.reduce((acc, task) => {
      const data = task.data();

      if (!acc[data.plannedOnDate]) {
        acc[data.plannedOnDate] = {};
      }

      acc[data.plannedOnDate][data.id] = data;

      return acc;
    }, {});

    // console.log('COLLECTION');
    // console.log(collection);

    try {
      return collection;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
