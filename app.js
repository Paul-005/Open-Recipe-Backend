const express = require("express");
const cors = require("cors");

require("dotenv").config();

//file imports
const authRoute = require("./routes/authRoute");
const recipesRoute = require("./routes/recipesRoute");
const connect_db = require("./start/db");

const app = express();
var port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use(authRoute);
app.use(recipesRoute);

// connect to mongodb
connect_db();

app.listen(port, () => console.log(`server listening on port ${port}....`));

app.get("/", (req, res) => {
  res.send("https://open-recipe-paul.vercel.app");
});
