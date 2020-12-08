// Add required packages
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());
const multer = require("multer");
const upload = multer();

app.use(express.urlencoded({ extended: false }));
const dblib = require("./dblib.js");

// Set up EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

app.get("/", async (req, res) => {
  // Omitted validation check
  const totRecs = await dblib.getTotalRecords();
  res.render("searchajax", {
      totRecs: totRecs.totRecords,
  });
});

app.post("/", async (req, res) => {
  console.log( "Request body: " + req.body.carvin );
  await dblib.findCars(req.body)
      .then(result => res.send(result))
      .catch(err => res.send({trans: "Error", result: err.message}));
});
