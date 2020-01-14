const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")({ origin: true });
const app = express();

// TODO: Remember to set token using >> firebase functions:config:set stripe.token="SECRET_STRIPE_TOKEN_HERE"
const stripe = require("stripe")(functions.config().stripe.token);
// const stripe = require("stripe")("sk_test_pG5S9YWFSFO4JzLXAtJ6LlG200ujjX9XWS");

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
