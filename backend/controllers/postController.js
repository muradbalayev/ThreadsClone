import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary'


const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;

        if (!postedBy || !text) {
            res.status(400).json({ error: "PostedBy and text fields are required" })
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: "User not found!" })
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to create post!" })
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text must be less than ${maxLength}!` })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ postedBy, text, img });

        await newPost.save();
        res.status(201).json({ message: ' Post created succesfully!', newPost })

    } catch (err) {
        res.status(500).json({ error: err.message })
        console.log("Error in CreatePost", err.message)
    }

}


const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)

        if (!post) {
            return res.status(404).json({ error: "Post not found!" })
        }

        res.status(200).json({ post })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found!" })
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete post!" })
        }

        await Post.findByIdAndDelete(req.params.postId);

        res.status(200).json({ message: "Post deleted succesfully!" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const LikeUnlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found!" })
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            //Unlike Post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "Post unliked successfully!" })
        } else {
            //Like Post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully!" })

        }

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const replyPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.postId;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: "Text field is required!" })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found!" });
        }

        const reply = { userId, text, userProfilePic, username };

        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply added successfully!", post })


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" })
        }

        const following = user.following;

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json(feedPosts)


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" })

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


export { createPost, getPost, deletePost, LikeUnlikePost, replyPost, getFeedPosts, getUserPosts }