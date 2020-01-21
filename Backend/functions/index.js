const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")({ origin: true });
const app = express();
const admin = require('firebase-admin');
const moment = require("moment")
const _ = require("lodash")
const nodemailer = require('nodemailer');
const config = require("./config.json")
const serviceAccount = require("./taux.json");

const stripe = require("stripe")(config.stripe_key);
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: config.smtp_email,
      pass: config.smtp_password
  }
});
admin.initializeApp({
  credential:admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
});


async function calculatePrizes(skipEmail){
  skipEmail = skipEmail || false
  try{
    const basePool = 250 // Base prize pool
    const poolAddPerPost = 0.5 // How much of each post goes into the poo
    const placesPercentages = [50,25,10,2,2] // Percentages each place take as a price
    let numberPosts = 0

    const date = moment(new Date())
    .startOf("day")
    .toDate();

    const db = admin.firestore();
    const postQuery = await db.collection("posts")
    .where("paid", "==", true)
    .where("createdAtDate", "==", date)
    .orderBy("likesDayCount","desc")
    .get();

    let posts = [];
    postQuery.forEach(post => {
      posts.push(post.data());
    });
    numberPosts = posts.length

    let userIds = _.map(posts,"uid")
    let userQuery = db.collection("users")

    if(userIds.length > 0 ){
      userQuery = userQuery.where("uid","in",userIds)
    }

    userQuery = await userQuery.get();

    let users = [];
    userQuery.forEach(user => {
      users.push(user.data());
    });

    const resultToEmail = []
    let prizePool = basePool
    const calculatedPrize = numberPosts * poolAddPerPost
    let passedThreshold = false
    if(calculatedPrize > basePool){
      prizePool = calculatedPrize
      passedThreshold = true
    }
    resultToEmail.push(`Has the competition of day ${date} passed the base pool prize : ${passedThreshold ? "Yes" : "No"}`)
    resultToEmail.push(`Base Pool : ${basePool}`)
    resultToEmail.push(`Number of posts : ${numberPosts}`)
    resultToEmail.push(`Value added to pool per post : ${poolAddPerPost}`)
    resultToEmail.push(`Percentages per place : ${placesPercentages}`)
    resultToEmail.push(`Prize pool: ${prizePool}`)
    resultToEmail.push(`\nWinners:\n`)
    const numberOfPrizes = placesPercentages.length -1
    let postsWithUser = []
    const prizesPerPlace = []

    for(let pos = 0; pos < placesPercentages.length;pos++){
      //Calculates how much each place makes
      const place = pos+1;
      const percentagePrize = placesPercentages[pos]
      const amount = prizePool * (percentagePrize * 0.01) // Converting percentage and calculates how much the user gets based on the prize pool and percentages positions
      prizesPerPlace.push({place,amount})
    }


    for(let position = 0;position < posts.length;position++){
      const post = posts[position]
      const user = _.find(users,["uid",post.uid])
      const percentagePrize = placesPercentages.shift()
      if(percentagePrize){
        const place = position+1;
        const amount = prizePool * (percentagePrize * 0.01) // Converting percentage and calculates how much the user gets based on the prize pool and percentages positions
        resultToEmail.push(`User "${user.username}" place nº "${place}" Amount:"$${amount}" Paypal: "${user.emailPaypal}" Email: "${user.email}" PostId: "${post.id}"`)
      }
      postsWithUser.push(post)
      if(position >= numberOfPrizes){
        break;
      }
    }

    console.log("Calculations complete")
    if(!skipEmail){
      console.log("Preparing to send email")
      const emailHtml = resultToEmail.join("\n<br>")
      const mailOptions = {
          to: config.email_destination,
          subject: `Competition of date ${date.toLocaleDateString()}`,
          html:`${emailHtml}`
      };

      return transporter.sendMail(mailOptions, (err, info) => {
          if(err){
            console.log("Error sending email! ",err)
            return
          }
          console.log("Email sent!")
          return

      });
    }
    return prizesPerPlace

  }catch(err){
    console.log(err)
  }

  return null;
}

exports.calculatePrizes = functions.pubsub.schedule('59 23 * * *')
.onRun(async (context) => {
  calculatePrizes()
});



function charge(req, res) {
  const body = JSON.parse(JSON.stringify(req.body));
  const token = body.token;
  const amount = body.charge.amount;
  const currency = body.charge.currency;
  const description = body.charge.description;

  // Charge card
  stripe.charges
    .create({
      amount,
      currency,
      description: description,
      source: token
    })
    .then(charge => {
      send(res, 200, {
        message: "Success",
        success: true,
        charge
      });
    })
    .catch(err => {
      console.log(err);
      send(res, 500, {
        error: err.message,
        success: false
      });
    });
}

function send(res, code, body) {
  res.send({
    statusCode: code,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body)
  });
}

app.use(cors);

app.get("/", async (req,res) => {
  try {
    const prizes = await calculatePrizes(true);
    send(res, 200, {
      prizes:prizes,
      success: true
    });
  } catch (e) {
    console.log(e);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
      errorStack: e,
      errorMsg: e.message,
      success: false
    });
  }
});

app.post("/", (req, res) => {
  // Catch any unexpected errors to prevent crashing
  try {
    charge(req, res);
  } catch (e) {
    console.log(e);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
      errorStack: e,
      errorMsg: e.message,
      success: false
    });
  }
});

exports.charge = functions.https.onRequest(app);
exports.prizes = functions.https.onRequest(app);
