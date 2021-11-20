import { getFirebaseAdmin } from "next-firebase-auth";
import 'firebase/firestore';
import { HttpMethod, Task } from "../../types";
import Request from "../request";
import dayjs from "dayjs";

export const Api = {
  url: (path: string) =>
    `/api${path}`,
  headers: async () => {
    const base = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
  getTasksByDay: (options: { userId: string, date: Date | string }) => Promise<Task[]> | null;
  getAll: (options: { userId: string }) => Promise<Task[]> | null;
  addTask: (task: Task) => Promise<Task>
}

export const Tasks: TasksTypes = {
  addTask: async (task: Task) => {
    const res = await Api.request({
      method: HttpMethod.POST,
      path: `/tasks/create`,
      body: {
        createdBy: task.createdBy,
        task: task
      },
    })

    return res
  },

  getAll: async ({
    userId,
  }) => {
    const db = getFirebaseAdmin().firestore()
    let tasks = await db.collection("tasks").where("createdBy", "==", userId).get()
    // tasks = tasks.docs.map(doc => doc.data());

    // Reduce tasks.docs to an object with the id as the key and the task as the value
    let tasksKeyedById = tasks.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.id] = data;
      return acc;
    }, {})

    console.log(tasksKeyedById);


    // db.collection("tasks").where("createdBy", "==", userId).onSnapshot((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     tasks.push(doc.data());
    //   });
    // });

    // tasks.docs.map(task => {
    //   console.log(dayjs(date).isSame(task.data().plannedOnDate, 'day'));
    // })

    try {
      return tasksKeyedById
    } catch (error) {
      console.error(error)
      return null;
    }
  },

  getTasksByDay: async ({
    userId,
    date
  }) => {
    const db = getFirebaseAdmin().firestore()
    let tasks = await db.collection("tasks").where("createdBy", "==", userId).get()

    // db.collection("tasks").where("createdBy", "==", userId).onSnapshot((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     tasks.push(doc.data());
    //   });
    // });

    // tasks.docs.map(task => {
    //   console.log(dayjs(date).isSame(task.data().plannedOnDate, 'day'));
    // })

    tasks = tasks.docs.filter(task => dayjs(date).isSame(task.data().plannedOnDate, 'day'))

    try {
      return tasks.length > 0 ? tasks : null
    } catch (error) {
      console.error(error)
      return null;
    }
  },
}

// export const createEvent = () => {
// 	let title = document.getElementById("titleInput").value;
// 	let startDate = document.getElementById("startDateInput").value;
// 	let startTime = document.getElementById("startTimeInput").value;
// 	let endDate = document.getElementById("endDateInput").value;
// 	let endTime = document.getElementById("endTimeInput").value;
// 	let calendarEventInput = document.getElementById("calendarEventInput").value;

// 	const newEventObj = {
// 		title: title,
// 		start: Date,
// 		end: Date,
// 		calendar: calendarEventInput
// 	};

// 	usersRef
// 		.doc(userId)
// 		.collection("events")
// 		.add(newEventObj)
// 		.then(function(docRef) {
// 			addEventDone.classList.remove("hide");
// 			loadingSpinner.classList.remove("d-flex");
// 			loadingSpinner.classList.add("hide");
// 			form.reset();
// 			console.log("Document written with ID: ", docRef.id);
// 		})
// 		.catch(function(error) {
// 			console.error("Error adding document: ", error);
// 		});
// }