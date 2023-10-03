const { db, storage } = require("../models/db");

exports.getBlogs = async (req, res, next) => {
  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const query = await db
      .collection("blogs")
      .where("active", "==", true)
      .orderBy("position")
      .get();
    const data = query.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const blogs = await Promise.all(
      data.map(async (blog) => {
        const thumb = await storage
          .bucket("technoviumunlimited.appspot.com")
          .file("blog/" + blog.id + "/" + blog.thumb)
          .getSignedUrl(options);

        return new Promise((resolve, reject) => {
          return resolve({
            _id: blog.id,
            _thumb: thumb,
            title: blog.title,
            discription: blog.discription,
            author: blog.author,
            position: blog.position,
          });
        });
      })
    );
    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
