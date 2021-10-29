import { getFirebaseAdmin } from "next-firebase-auth";

export default async function createEvent(req, res) {
  const { userId, task } = req.body;
  const db = getFirebaseAdmin().firestore()

  db.collection("tasks").doc(`${task.id}`).set(task)
    .then((doc) => {
      console.log("Document successfully written!");
      console.log(doc);
      res.status(200).json({ doc })
      // return doc
    })
    .catch((err) => {
      return console.error('The API returned an error: ' + err)
      res.status(500).json({ error: 'failed to load data' })
    });
}