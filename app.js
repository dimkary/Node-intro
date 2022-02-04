const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const fs = require('fs');

const API_KEY = "fadde67f3fb685cad355cd7487352681-us14"
const list_id = "5729c3e3ae"

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
    apiKey: API_KEY,
    server: "us14"
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/', (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const data = {

        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstname,
            LNAME: lastname

        }

    };

    const jsonData = JSON.stringify(data);

    const run = async () => {
        const response = await mailchimp.lists.addListMember(list_id, data);
        fs.writeFileSync("./log.json", JSON.stringify(response));
        console.log(response);
        // response.on("data", (data) => {
        //     const all_data = JSON.parse(data);
        //     console.log(all_data);
        // });
        // res.sendFile(__dirname + "/success.html");
        res.sendFile(__dirname + "/success.html");
    };

    run().catch(e => {
        // res.append("response object", JSON.stringify(e, null, 4));
        res.statusCode = e.status;
        res.sendFile(__dirname + "/failure.html");
        // res.send(e);
        console.log("ERRRRRRROR IS:  " + e);
        console.log(JSON.stringify(e, null, 4));
    });


});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000.");
});