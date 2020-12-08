// Add required packages
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());
const multer = require("multer");
const upload = multer();

app.use(express.urlencoded({ extended: false }));

/*
// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD, 
  port: process.env.PSQL_PORT
});

console.log("Successful connection to the database");

const sql_create = `DROP TABLE IF EXISTS car;
CREATE TABLE car (
  carvin     INTEGER PRIMARY KEY,
  carmake    VARCHAR(20) NOT NULL,
  carmodel   VARCHAR(20),
carmileage INTEGER
);`;

pool.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'car' table");

  // Database seeding
  const sql_insert = `INSERT INTO car (carvin, carmake, carmodel, carmileage)
  VALUES 
      (1001, 'Ford', 'Mustang', 9857),
    (1002, 'Ford', 'F150', 57249),
    (1003, 'Ford', 'Explorer', 53218),
    (1004, 'Chevy', 'Corvette', 0019),
    (1005, 'Chevy', 'Camaro', 32587),
    (1006, 'Chevy', 'S10', 44000),
    (1007, 'Chevy', 'Bolt', 7532),
    (1008, 'Dodge', 'Charger', 36000),
    (1009, 'Dodge', 'Challenger', 48256),
    (1010, 'Dodge', 'RAM', 65147);`;
  pool.query(sql_insert, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
  });
});
*/

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

// Setup routes
/*
app.get("/", (req, res) => {
  /*
  const sql = "SELECT * FROM car ORDER BY carvin";
  pool.query(sql, [], (err, result) => {
      var message = "";
      var model = {};
      var car = {};
      if(err) {
          message = `Error - ${err.message}`;
      } else {
          message = "success";
          model = result.rows;
      };

      res.render("index", {
        message: message,
        model : model,
        car : car
      });
  });

  var message = "";
  var model = {};
  var car = {};
  res.render("index", {
    message: message,
    model : model,
    car : car
  });
});
*/

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
