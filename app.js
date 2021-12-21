var express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//file imports
const HomePage = require("./routes/authProtector");
const { CreateAccount, LoginAccount } = require("./routes/AuthService");
const Content = require("./routes/content/content-recipe");
const recipe = require("./routes/recipes/recipiesContent");
const recipeById = require("./routes/recipes/recipeById");

const app = express();
var port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

//routes
app.use(HomePage);
app.use(CreateAccount);
app.use(LoginAccount);
app.use(Content);
app.use(recipe);
app.use(recipeById);

mongoose
  .connect(
    "mongodb+srv://paulbabu05:11102005@paul-cluster.4qemp.mongodb.net/Open_Recipe?retryWrites=true&w=majority"
  )
  .then(() => app.listen(port))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("<h1>Open Recipe API</h1>");
});
