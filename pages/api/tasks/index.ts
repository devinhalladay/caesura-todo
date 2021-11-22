import { getFirebaseAdmin } from "next-firebase-auth";

export default async function getEvent(req, res) {
  const { id } = req.body;
  const db = getFirebaseAdmin().firestore();

  db.collection("tasks")
    .doc(`${id}`)
    .get()
    .then((doc) => {
      console.log("Document successfully written!");
      console.log(doc);
      res.status(200).json({ doc });
    })
    .catch((err) => {
      res.status(500).json({ error: "failed to load data" });
      return console.error("The API returned an error: " + err);
    });
}
