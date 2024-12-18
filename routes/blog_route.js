const { Router } = require("express");
const routeInstance = Router();
const multer = require("multer");

const Blog = require("../model/blogSchema");
const Comment = require("../model/commentSchema");

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // "cb" means callback func, 1st args for error, 2nd for uoload folder name
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}`); // 1st args for error, 2nd for uoload file name  >> "DAte.now()" use for unique filename though oruginalFilename is duplicated
  },
});

const upload = multer({ storage: storageConfig });

routeInstance
  .route("/add-blog")
  .get((req, res) => {
    res.render("add-blog", {
      user: req.user,
    });
  })
  .post(upload.fields([{ name: "image" }]), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const { title, body } = req.body;
    const coverImage = `uploads/${req.files.image[0].filename}`;
    const createdBy = req.user._id;
    console.log(coverImage);
    await Blog.create({ title, body, coverImage, createdBy });
    return res.redirect("/");
  });

routeInstance.get("/viewBlog/:blog_id/:c", async (req, res) => {
  const blog = await Blog.findById({ _id: req.params.blog_id }).populate(
    "createdBy"
  );
  // console.log(blog._id);
  const count = req.params.c;
  if((count)==0){
    res.render("viewBlog", {
      blog: blog,
      user: req.user,
      count: 1,
    });
  }else{
    const comments = await Comment.find({ blog_id: req.params.blog_id});
    // console.log(comments);    
    res.render("viewBlog", {
      blog: blog,
      user: req.user,
      comments: comments,
      count: 0,
    });
  }
});

routeInstance
  .route("/add-comment/:blog_id")
  .get((req, res) => {
    res.render("add-comment", {
      user: req.user,
      blog_id: req.params.blog_id,
    });
  })
  .post(upload.fields([{ name: "image" }]), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const { comment } = req.body;
    const user_id = req.user._id;
    const blog_id = req.params.blog_id;

    let image = undefined;
    if((req.files.image)){ 
      image = `uploads/${req.files.image[0].filename}`;
      console.log("image",image);
    }
    
    await Comment.create({ blog_id, comment, image, user_id });
    return res.redirect(`/blog/viewBlog/${blog_id}/0`);
  });

module.exports = routeInstance;
