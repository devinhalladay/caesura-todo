import { getFirebaseAdmin } from "next-firebase-auth";
import { HttpMethod, Task } from "../../types";
import Request from "../request";

export const Api = {
  url: (path: string) =>
    `/api${path}`,
  headers: async () => {
    const base = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // 'X-Shopify-Domain': process.env.SHOPIFY_DOMAIN,
      // 'X-Shopify-Storefront-Access-Token':
      //   process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    };
    // const authToken = await AuthTokens.get();
    // if (authToken !== null) {
    //   base['X-Shopify-Customer-Access-Token'] = authToken;
    // }
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
  getTasksByDay: (options: {userId: string, date: Date | string}) => Promise<Task[]> | null;
  createTask: (options: {task: Task}) => Promise<Task>
}

export const Tasks: Task = {
  getTasksByDay: async ({
    userId,
    date
  }) => {
    const db = getFirebaseAdmin().firestore()
    try {
      const tasks = await db.collection("tasks").where("createdBy", "==", userId).get()

      return tasks.docs.length > 0 ? tasks : null
    } catch (error) {
      console.error(error)
      return null;
    }
  },
}

  // createTask: (task: Task) => {
  //   const db = getFirebaseAdmin().firestore()

  //   db.collection("tasks").doc(task.id).set(task)
  //   .then((doc) => {
  //     console.log("Document successfully written!");
  //     console.log(doc);

  //   })
  //   .catch((error) => {
  //     console.error("Error writing document: ", error);
  //   });

    // return Api.request({
    //   method: HttpMethod.POST,
    //   path: `/tasks/create`,
    //   body: {
    //     userId: task.createdBy,
    //     task: task
    //   },
    // })
  // }
// }

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