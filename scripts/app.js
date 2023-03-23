const express = require("express");
const app = express();
const path = require("path");
app.use(express.urlencoded({ extended: true }));
// localhost port
const port = 3000;
// --------------------------setting up mailchimp
const client = require("@mailchimp/mailchimp_marketing");
client.setConfig({
  apiKey: "f9ca494214dbf70c50216721e7331780-us21",
  server: "us21",
});
// --------------------------
// -------------------------- Going back 1 folder because app.js  is located on scripts/app.js
const urlDirName = path.join(__dirname, "..");
// -------------------------- Setting public folder
app.use(express.static(path.join(__dirname, "../public")));
// --------------------------
// -------------------------- When the user requests our index file (loads teh webpage)
app.get("/", (req, res) => {
  res.sendFile(urlDirName + "/signup.html");
});
// --------------------------
// -------------------------- When the user requests our index file from the failure page
app.post("/failure", (req, res) => {
  res.redirect("/");
});
// --------------------------
// -------------------------- When the user hits submit and posts into our server
app.post("/", (req, res) => {
  // ------------------------ Here we create our member data object
  const firstName = req.body.name;
  const surName = req.body.surname;
  const mail = req.body.mail;
  const data1 = [
    {
      email_address: mail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: surName,
      },
    },
  ];
  // ------------------------
  // ------------------------ Here we send our response to the mailchimp
  // ------------------------ server with our subscribers info
  const run = async () => {
    const response = await client.lists.batchListMembers("c90d77ced6", {
      members: data1,
    });
    console.log(response);
    if (response.error_count != 0) {
      res.sendFile(urlDirName + "/failure.html");
    } else {
      // if (response.total_created != 0 && response.total_created != undefined)
      res.sendFile(urlDirName + "/success.html");
    }
  };
  run();
});

app.listen(port, () => {
  console.log("Server running on port: " + port);
});
// api key: f9ca494214dbf70c50216721e7331780-us21
// audience id: c90d77ced6
// /lists/c90d77ced6/members
