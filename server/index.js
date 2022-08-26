"use strict";

const app = require("express")();
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.post("/signup",async function (req, res) {
    console.log(req.body)
    if (!req.body.recaptchaToken) {
        return res.status(400).json({message: "recaptchaToken is required"});
    }
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: "email and password are required"});
    }
    const verifyCaptchaOptions = {
        uri: "https://www.google.com/recaptcha/api/siteverify",
        json: true,
        form: {
            secret: "Your site's secretkey",
            response: req.body.recaptchaToken
        }
    };

    request.post(verifyCaptchaOptions, function (err, response, body) {
        console.log("api hit");
        console.log(body);
            if (err) {
                return res.status(500).json({message: "oops, something went wrong on our side"});
            }

            if (!body.success) {
                return res.status(500).json({message: body["error-codes"].join(".")});
            }
            
            return res.status(201).json({message: "Congratulations! We think you are human."});
        }
    );
});


const port = process.env.PORT || 5000;
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("API running on port " + port);
});

app.get("/", function (req, res) {
    res.json({
        name: "vue-recaptcha-demo-api",
        status: "running"
    });
});