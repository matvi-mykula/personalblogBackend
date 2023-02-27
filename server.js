const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const Post = require('./blogPost');
const PictureFolder = require('./postPictureFolder');
//----------------------------------------- END OF IMPORTS---------------------------------------------------
mongoose.connect(
  'mongodb+srv://matvi_mykula:this1works@cluster0.o1l2bk9.mongodb.net/Blog?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Mongoose Is Connected');
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:3000', // <-- location of the react app were connecting to
    credentials: true,
  })
);
// app.use(
//   session({
//     secret: 'secretcode',
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// app.use(cookieParser('secretcode'));
// app.use(passport.initialize());
// app.use(passport.session());
// require('./passportConfig')(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes

// app.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) throw err;
//     if (!user) res.send('No User Exists');
//     else {
//       req.logIn(user, (err) => {
//         if (err) throw err;
//         console.log('succesfully logged in');
//         res.send(req.user);
//         // res.send(req.user);
//         console.log(req.user);
//         // res.redirect('/profile');
//       });
//     }
//   })(req, res, next);
// });

app.get('/user', (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.get('/profile', (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

app.post('/logout', function (req, res, next) {
  req.logout(req.user, function (err) {
    if (err) {
      return next(err);
    }
  });
  res.clearCookie('connect.sid');
  res.send(req.user);
});

app.post('/postBlogPost', (req, res) => {
  console.log('posting message');
  // console.log(req.body);
  // console.log(req.body.blogPost.category);
  const post = new Post({
    id: req.body.blogPost.id,
    category: req.body.blogPost.category,
    title: req.body.blogPost.title,
    description: req.body.blogPost.description,
    // picture: req.body.blogPost.picture,
    // video: req.body.blogPost.video,
    link: req.body.blogPost.link,
    timeStamp: req.body.blogPost.timeStamp,
  });
  post.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.json({ message: req.body });
  console.log('post logged');
});

app.post('/postPictureFolder', (req, res) => {
  console.log('posting picture folder');
  const pictureFolder = new PictureFolder({
    id: req.body.blogPost.id,
    entries: req.body.blogPost.picture,
  });
  pictureFolder.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.json({ message: req.body });
  console.log('picture folder logged');
});

app.get('/getPosts', (req, res) => {
  console.log('getting posts...');
  // console.log(req.query);
  const key = req.query;
  //   const value = req.query.value;
  //   const { key, value } = {req.query.key,;
  return Post.find({ ['category']: key['category'] })
    .sort({ timeStamp: -1 })
    .exec(function (err, entries) {
      // console.log(entries);
      return res.end(JSON.stringify(entries));
    });
});

app.get('/getAllPosts', (req, res) => {
  console.log('getting all posts');
  return Post.find()
    .sort({ timeStamp: -1 })
    .exec(function (err, entries) {
      // console.log(entries);
      return res.end(JSON.stringify(entries));
    });
});

app.delete(`/delete/:id`, (req, res) => {
  console.log('delete in server');
  console.log(req.params);
  const id = Number(req.params.id);
  console.log(id);
  return Post.deleteOne({ id: id }, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

app.put(`/update/:id/:id`, (req, res) => {
  console.log('updating in server');
  console.log(req.body);
  const post = req.body.blogPost;
  const newPost = req.body.newBlogPost;
  //need to find out what the req.body will look like
  const id = Number(req.params.id);
  console.log(typeof mongoose.Types.ObjectId(post._id));
  Post.findByIdAndUpdate(
    mongoose.Types.ObjectId(post._id),
    {
      title: newPost.title,
      category: newPost.category,
      description: newPost.description,
      // picture: newPost.picture,
      // video: newPost.video,
      link: newPost.link,
      timeStamp: newPost.timeStamp,
    },
    { new: true },
    (err, updatedEntry) => {
      if (err) {
        console.log(err);
      } else {
        console.log({ updatedEntry });
      }
    }
  );

  // // try {
  // console.log(post.id);

  // const filter = { id: post.id };
  // const update = {
  //   $set: {
  //     title: post.title,
  //     category: post.category,
  //     description: post.description,
  //     picture: post.picture,
  //     video: post.video,
  //     link: post.link,
  //     timeStamp: post.timeStamp,
  //   },
  // };
  // const options = { returnOriginal: false };
  // return Post.findOneAndUpdate(filter, update, options);

  // return Post.findByIdAndUpdate(
  //   post.id,
  //   {
  //     title: post.title,
  //     category: post.category,
  //     description: post.description,
  //     picture: post.picture,
  //     video: post.video,
  //     link: post.link,
  //     timeStamp: post.timeStamp,
  //   },
  //   (err, entry) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   }
  // );
});

/// datascience
const natural = require('natural');

app.get('/stats', (error, response, body) => {
  console.log('made it to stats');
  if (error) {
    console.log(error);
    return;
  }
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(body);
  console.log(tokens);
  console.log(response);
});

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(4000, () => {
  console.log('Server Has Started');
});
