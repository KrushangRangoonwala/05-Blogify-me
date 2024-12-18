const { model,Schema } = require("mongoose");

const blogSchema = new Schema({
    title : {
        type: String,
        require: true,
    },
    body:{
        type:String,
        require:true,
    },
    coverImage:{
        type: String,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    like: {
        type: Number,
        require: true,
    },
}, {timestamps:true});

const Blog = model("blogs",blogSchema);

module.exports = Blog;