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

const getTotalRecords = () => {
    sql = "SELECT COUNT(*) FROM car";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error: ${err.message}`
            }
        });
};

const findCars = (car) => {
    // Will build query based on data provided from the form
    //  Use parameters to avoid sql injection

    console.log( car );

    // Declare variables
    var i = 0;
    params = [];
    sql = "SELECT * FROM car WHERE true";

    // Check data provided and build query as necessary
    if (car.carvin !== "") {
        params.push(parseInt(car.carvin));
        sql += ` AND carvin = ${params[i]}`;
        i++;
    };
    if (car.carmake !== "") {
        params.push(`${car.carmake}%`);
        sql += ` AND carmake ILIKE '${params[i]}'`;
        i++;
    };
    if (car.carmodel !== "") {
        params.push(`${car.carmodel}%`);
        sql += ` AND UPPER(carmodel) ILIKE '${params[i]}'`;
        i++;
    };
    if (car.carmileage !== "") {
        params.push(parseFloat(car.carmileage));
        sql += ` AND carmileage >= ${params[i]}`;
        i++;
    };

    sql += ` ORDER BY carvin`;
    // for debugging
     console.log("sql: " + sql);
     console.log("params: " + params);

    return pool.query(sql)
        .then(result => {
            return { 
                trans: "success",
                result: result.rows
            }
        })
        .catch(err => {
            return {
                trans: "Error",
                result: `Error: ${err.message}`
            }
        });
};

module.exports.getTotalRecords = getTotalRecords;
module.exports.findCars = findCars;