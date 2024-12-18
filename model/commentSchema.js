const { model,Schema } = require("mongoose");

const commentSchema = new Schema({
    blog_id: {
        type: Schema.Types.ObjectId,
        ref: "blogs",
    },
    comment: {
        type: String,
        require: true,
    },
    image: {
        type: String,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
},{timestamps:true});

const Comment = model("comment",commentSchema);

module.exports = Comment;