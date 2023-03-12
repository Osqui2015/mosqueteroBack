import Post from "../models/Post.js";
import fs from "fs-extra";


export const getPosts = async (req, res) => {
  try {
    const q = new RegExp(req.query.query ,"i") ;
    
    const posts = await Post.find({$or: [{artist: q}, {show: q}] });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { artist,
            image,
            imageslider,
            state,
            show,
            blog } = req.body;
    const newPost = new Post({ artist,
                                image,
                                imageslider,
                                state,
                                show,
                                blog});
    await newPost.save();
    return res.json(newPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.sendStatus(404);
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
 

    
    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath);
      
      req.body.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
      }
    );
    return res.json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const removePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (post && post.image.public_id) {
      await deleteImage(post.image.public_id);
    }

    if (!post) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({state:"Si"});    
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
