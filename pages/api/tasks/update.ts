import { getFirebaseAdmin } from "next-firebase-auth";

export default async function udpateEvent(req, res) {
  const { id, updates } = req.body;
  const db = getFirebaseAdmin().firestore();

  db.collection("tasks").doc(id).update(updates)
    .then((doc) => {
      console.log("Document successfully written!");
      console.log(doc);
      res.status(200).json({ doc })
      // return doc
    })
    .catch((err) => {
      res.status(500).json({ error: 'failed to load data' })
      return console.error('The API returned an error: ' + err)
    });
}