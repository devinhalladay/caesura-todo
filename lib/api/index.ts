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