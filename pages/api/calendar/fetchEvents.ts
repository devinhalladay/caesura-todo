// const functions = require('firebase-functions');
const {google} = require('googleapis');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// export function helloWorld(req, res) {
//   res.status(200).send("Hello from Server!")
// }

function getCredentials() {
    return {}
    //Replace this empty object with credentials.json contents
}

// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// export const authorize = functions.https.onRequest((request, response) => {
//     console.log('Authorize called')

//     const {client_secret, client_id, redirect_uris} = getCredentials().web
//     if(!client_secret || !client_id || !redirect_uris)
//         response.send("Credentials missing").status(500)

//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
//     let url = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//     })
//     response.send(url)
// })


// exports.token = functions.https.onRequest((request, response) => {
//     console.log('token called ' + JSON.stringify(request.body))
//     const code = request && request.query && request.query.code || null
//     if(!code)
//         response.send("code missing").status(400)

//     const {client_secret, client_id, redirect_uris} = getCredentials().web
//     if(!client_secret || !client_id || !redirect_uris)
//         response.send("Credentials missing").status(500)

//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
//     oAuth2Client.getToken(code, (err, token) => {
//         if(err) {
//             console.log('err ' + err.message)
//             response.status(500).send("Unable to generate token " + err.message)
//         }
//         oAuth2Client.setCredentials(token)

//         fetchEvents(oAuth2Client)
//         response.send("Access Granted. Please close this tab and continue.")
//     })
// })

export default async function fetchEvents(req, res) {
  const auth = req.body;
  const calendar = await google.calendar({ version: 'v3', auth })
  console.log(calendar);

  // const events = res.data.items;
  //   if (events.length) {
  //     console.log('Upcoming 10 events:');
  //     events.map((event, i) => {
  //       const start = event.start.dateTime || event.start.date;
  //       console.log(`${start} - ${event.summary}`);
  //     });
  //   } else {
  //     console.log('No upcoming events found.');
  //   }

  try {
    const result = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;

    res.status(200).json({ result })
  } catch (err) {
    return console.error('The API returned an error: ' + err)
    res.status(500).json({ error: 'failed to load data' })
  }
}

// function fetchEventsOld(auth) {
//     calendar.events.list({
//         calendarId: 'primary',
//         timeMin: (new Date()).toISOString(),
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: 'startTime',
//       }, (err, res) => {

//     })
// }