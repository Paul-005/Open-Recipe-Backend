const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

require("dotenv").config();

//file imports
const Content = require("./routes/content/content-recipe");
const recipe = require("./routes/recipes/recipiesContent");
const recipeById = require("./routes/recipes/recipeById");
const recipeByIdComment = require("./routes/recipes/recipeByIdComment");
const proPayment = require("./controllers/ProPayment");
const getUsersRecipe = require("./routes/auth/getUserProfile");
const deleteRecipe = require("./routes/auth/deleteRecipe");
const upload = require("./routes/content/file-upload");

const authRoute = require("./routes/auth/authRoute");

const app = express();
var port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: 100000000 }));
app.use(cors({ origin: "*" }));
app.use(fileUpload());

app.use(authRoute);

app.use(Content);
app.use(recipe);
app.use(recipeById);
app.use(proPayment);
app.use(recipeByIdComment);
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
  res.send("https://open-recipe-paul.vercel.app");
});
