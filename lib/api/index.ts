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

type Task = {
  getTasksByDay: (options: { userId: string, date: Date | string }) => Promise<Task[]> | null;
  createTask: (options: { task: Task }) => Promise<Task>
}

export const Tasks: Task = {
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