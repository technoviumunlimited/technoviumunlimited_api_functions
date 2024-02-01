const { db, storage } = require("../models/db");
// //TODO fix pagination even if category is added!
// exports.getBlogs = async (req, res, next) => {
//   try {
//     const options = {
//       version: "v4",
//       action: "read",
//       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//     };
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const itemsPerPage = req.query.take ? parseInt(req.query.take) : 10;
//     const category_id = req.query.category_id ? req.query.category_id : null;

//     // Create a base query
//     const blogsCollection = db.collection('blogs');
//     let query = blogsCollection
//       .where('active', '==', true)
//       .orderBy('position');

//     // Apply category_id filter if provided
//     if (category_id) {
//       const querySnapshot = await query.get();
//       const filteredBlogs = [];

//       querySnapshot.forEach(async (doc) => {
//         const data = doc.data();
//         const categories = data.category;

//         if (categories.some((category) => category.category_id === category_id)) {
//           // Add the document to the results if it contains the specified category_id
//           const thumb = await storage
//            .bucket("technoviumunlimited.appspot.com")
//            .file("blog/" + data.blog.id + "/" + data.blog.thumb)
//            .getSignedUrl(options);
//           filteredBlogs.push({ _id: doc.id, _thumb: thumb, ...data });
//         }
//       });

//       res.status(200).json({ blogs: filteredBlogs });
//     } else {
//       // Perform pagination by skipping and limiting results
//       const startIndex = (page - 1) * itemsPerPage;
//       query = query.offset(startIndex).limit(itemsPerPage);

//       const querySnapshot = await query.get();
//       const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       // const thumb = await storage
//       //      .bucket("technoviumunlimited.appspot.com")
//       //      .file("blog/" + blog.id + "/" + blog.thumb)
//       //      .getSignedUrl(options);
    
//       const blogs = data.map(async (blog) => ({
//         _id: blog.id,
//         title: blog.title,
//         description: blog.description, // Corrected the property name
//         author: blog.author,
//         position: blog.position,
//         category: blog.category,
//         date: blog.date,
//         _thumb: await storage
//         .bucket("technoviumunlimited.appspot.com")
//         .file("blog/" + blog.id + "/" + blog.thumb)
//         .getSignedUrl(options)
//       }));

//       res.status(200).json({ blogs });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send();
//   }
// };

exports.getBlogs = async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const itemsPerPage = req.query.take ? parseInt(req.query.take) : 10;
    const category_id = req.query.category_id ? req.query.category_id : "";

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
    if (category_id) {
      let dataCategory = await db.collection("blogs_categories").doc(category_id).get();
      if(!dataCategory.data()){
        return res.status(500).send("No category data");
      }
      query = query.where("category", 
                          "array-contains",
                          { category_id: category_id, name:  dataCategory.data().name, color:  dataCategory.data().color}
                          );
    }

    // Perform pagination by skipping and limiting results
    const startIndex = (page - 1) * itemsPerPage;
    query = query.offset(startIndex).limit(itemsPerPage);

    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const blogs = await Promise.all(
      data.map(async (blog) => {
        // no need for storage anymore -> it is set to public via google storage
        // const thumb = await storage
        //   .bucket("storage.googleapis.com")
        //   .file("blog/" + blog.id + "/" + blog.thumb)
        //   .getSignedUrl(options);

        const thumb = "https://storage.googleapis.com/technoviumunlimited.appspot.com/blog/" + blog.id + "/"+ blog.thumb;
        //https://storage.googleapis.com/technoviumunlimited.appspot.com/blog/4UVRuFzKR0UHOxUs3ax1/thumb.png  

        return {
          _id: blog.id,
          _thumb: thumb,
          title: blog.title,
          description: blog.description, 
          author: blog.author,
          position: blog.position,
          category: blog.category,
          date: blog.date
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
exports.updateBlog = async (req, res, next) => {
  try {
    // Check user permissions
    if (req.user.permissions.includes('edit_blog')) {
      const { blog_id } = req.params;
      const { title, description, author, active, date, position, thumb, category } = req.body;

      // Check if required data is present
      if (!title || !description || !author || !date || !position || !thumb || !category) {
        return res.status(400).send('Title and description are required.');
      }

      // Check if the blog exists
      const blogRef = db.collection("blogs_davor").doc(blog_id);
      const blogDoc = await blogRef.get();

      if (!blogDoc.exists) {
        return res.status(404).send('Blog not found.');
      }

      // Update the blog in the Firestore collection
      await blogRef.update({
        title,
        description,
        author,
        date,
        position,
        thumb,
        category,
        active, 
      });

      res.status(200).send('Blog updated!');
    } else {
      res.status(403).send('Insufficient permissions to update a blog.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    // Check user permissions
    if (req.user.permissions.includes('delete_all')) {
      const { blog_id } = req.params;

      // Check if the blog exists
      const blogRef = db.collection("blogs_davor").doc(blog_id);
      const blogDoc = await blogRef.get();

      if (!blogDoc.exists) {
        return res.status(404).send('Blog not found.');
      }

      // Delete the blog from the Firestore collection
      await blogRef.delete();

      res.status(200).send('Blog deleted!');
    } else {
      res.status(403).send('Insufficient permissions to delete a blog.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

exports.insertBlog = async (req, res, next) => {   
     console.log('Gebruikerrechten:', req.user.permissions);
  try {
    // Controleer of de gebruiker de juiste rechten heeft (docent of admin)
    if (req.user.permissions.includes('add_blog')) {
      const { title, description, author, active, date, position, thumb, category} = req.body;

      // Controleer of de vereiste gegevens aanwezig zijn
      if (!title || !description || !author || !date || !position || !thumb || !category) {
        return res.status(400).send('Titel en beschrijving zijn verplicht.');
      }

      // Voeg de blog toe aan de Firestore-collectie "blogs"
      const newBlogRef = await db.collection("blogs_davor").add({
   
        author: author,
        date: date,   
        category: category,
        description: description,
        position: position,
        thumb: thumb,
        title: title,
        active: active,
        // Voeg hier andere velden toe die je wilt opslaan
      });

    
      res.status(200).send('Blog toegevoegd!');
    } else {
      res.status(403).send('Onvoldoende rechten om een blog toe te voegen.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
