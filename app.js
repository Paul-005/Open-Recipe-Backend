const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

require("dotenv").config();

//file imports
const { CreateAccount, LoginAccount } = require("./routes/auth/AuthService");
const Content = require("./routes/content/content-recipe");
const recipe = require("./routes/recipes/recipiesContent");
const recipeById = require("./routes/recipes/recipeById");
const deleteAccount = require("./routes/auth/deleteAccount");
const recipeByIdComment = require("./routes/recipes/recipeByIdComment");
const proPayment = require("./routes/auth/ProPayment");
const getUsersRecipe = require("./routes/auth/getUserProfile");
const deleteRecipe = require("./routes/auth/deleteRecipe");
const upload = require("./routes/content/file-upload");

const app = express();
var port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: 100000000 }));
app.use(cors({ origin: "*" }));
app.use(fileUpload());

//routes
app.use(CreateAccount);
app.use(LoginAccount);
app.use(Content);
app.use(recipe);
app.use(recipeById);
app.use(proPayment);
app.use(recipeByIdComment);
app.use(deleteAccount);
app.use(getUsersRecipe);
app.use(deleteRecipe);
app.use(upload);

mongoose
  .connect(
    "mongodb+srv://paulbabu05:11102005@paul-cluster.4qemp.mongodb.net/Open_Recipe?retryWrites=true&w=majority"
  )
  .then(() => app.listen(port))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("<h1>Open Recipe API</h1>");
});
