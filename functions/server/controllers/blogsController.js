const { db, storage } = require("../models/db");

exports.getBlogs = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const itemsPerPage = req.query.take ? parseInt(req.query.take) : 10;
    const category = req.query.category ? req.query.category.toLowerCase() : "";
    console.log(category);

    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Create a base query
    let query = db
      .collection("blogs")
      .where("active", "==", true)
      .orderBy("position");

    // Apply category filter if provided
    if (category) {
      query = query.where("category", "==", category);
    }

    // Perform pagination by skipping and limiting results
    const startIndex = (page - 1) * itemsPerPage;
    query = query.offset(startIndex).limit(itemsPerPage);

    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const blogs = await Promise.all(
      data.map(async (blog) => {
        const thumb = await storage
          .bucket("technoviumunlimited.appspot.com")
          .file("blog/" + blog.id + "/" + blog.thumb)
          .getSignedUrl(options);

        return {
          _id: blog.id,
          _thumb: thumb,
          title: blog.title,
          description: blog.description, // Corrected the property name
          author: blog.author,
          position: blog.position,
          category: blog.category,
        };
      })
    );

    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.getBlog = async (req, res, next) => {
  let paramID = req.params.blog_id;
  console.log(paramID);
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    const blog = [];
    const query = await db.collection("blogs").doc(paramID).get();
    const thumb = await storage
      .bucket("technoviumunlimited.appspot.com")
      .file("blog/" + paramID + "/" + query.data().thumb)
      .getSignedUrl(options);
    blog.push({
      ...query.data(),
      _id: query.id,
      _thumb: thumb,
    });

    // Get a v4 signed URL for reading the file

    //file_path = await storage
    //	 .file('technoviumunlimited.appspot.com' +'/games/' + paramID + "/game.data.gz")
    //	 .getDownloadURL();
    //console.log(file_path);
    /*let url = await 
						firebase.storage()
						.ref('Audio/English/United_States-OED-' + i +'/' + $scope.word.word + ".mp3")
						.getDownloadURL();
*/
    res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.getBlogsCategories = async (req, res, next) => {
  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const query = await db
      .collection("blogs_categories")
      .where("active", "==", true)
      .orderBy("position")
      .get();
    const data = query.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const BlogsCategories = await Promise.all(
      data.map(async (blogCategorie) => {
        //const thumb = await storage
        //  .bucket("technoviumunlimited.appspot.com")
        //  .file("blog/" + blog.id + "/" + blog.thumb)
        //  .getSignedUrl(options);

        return new Promise((resolve, reject) => {
          return resolve({
            _id: blogCategorie.id,
            //_thumb: thumb,
            name: blogCategorie.name,
            position: blogCategorie.position,
          });
        });
      })
    );
    res.status(200).json({ BlogsCategories });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};