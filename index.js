require('dotenv').config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRouteInstance = require("./routes/user_route");
const blogRouteInstance = require("./routes/blog_route");
const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./middleware/checkForAuthentication")
const blog = require("./model/blogSchema")

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
.connect(process.env.MONGO_URL)
.then(console.log("mongoose connected "))
.catch((err) => console.log(err));

app.use(express.urlencoded ({ extended : false }));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get("/", async (req, res) => {
    // console.log(req.user);
    const allblog = await blog.find({});
      res.render("home",{
        user : req.user,
        allblog : allblog,
      });
  });

app.use('/blog',blogRouteInstance);
app.use('/',userRouteInstance);

app.listen(PORT, ()=> console.log(`App startedon PORT : ${PORT}`));
