// const mongoose = require('mongoose');
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

// const ObjectId = require('mongodb').ObjectId;
// const express = require('express');
// const cors = require('cors');
// const passport = require('passport');
// const passportLocal = require('passport-local').Strategy;
// const cookieParser = require('cookie-parser');
// const bcrypt = require('bcryptjs');
// const session = require('express-session');
// const bodyParser = require('body-parser');
// const app = express();
// const Post = require('./blogPost');
// const ContentFolder = require('./postContentFolder.tsx');
// const User = require('./user.js');

import { ObjectId } from 'mongodb';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { Strategy as passportLocal } from 'passport-local';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import bodyParser from 'body-parser';
import { createResponse } from './services.js';
import { Post } from './blogPost.js';
import { ContentFolder } from './postContentFolder.js';
// import { User } from './user.js';

const app = express();

//----------------------------------------- END OF IMPORTS---------------------------------------------------
const port = 8080;
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.o1l2bk9.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// mongoose.connect(
//   `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.o1l2bk9.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`,

//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log('Mongoose Is Connected');
//   }
// );

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const allowedOrigins = [
  'http://localhost:3000',
  'https://personalblog-gzts.vercel.app/',
];
app.use(cors());
// app.use(
//   cors({
//     origin: allowedOrigins, // <-- location of the react app were connecting to
//     credentials: true,
//   })
// );
/// allows request from anything
//
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());
// import { passportConfig } from './passportConfig.js';

// passportConfig(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

//////////////      Routes      ///////////////

app.post('/login', (req, res, next) => {
  console.log('login initiated');
  console.log(req.body);
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    console.log({ user });
    if (err) throw err;
    if (!user) {
      console.log(info);
      res.send('No User Exists');
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        console.log('succesfully logged in');
        res.send(req.user);
        console.log(req.user);
        // res.redirect('/profile');
      });
    }
  })(req, res, next);
});
//////////////////////////

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
    // link: req.body.blogPost.link,
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

app.post('/postContentFolder', (req, res) => {
  console.log('posting content folder');
  // console.log(req.body.folderData);
  // console.log(req.body.folderData.links);
  const contentFolder = new ContentFolder({
    id: req.body.folderData.id,
    pictures: req.body.folderData.pictures,
    videos: req.body.folderData.videos,
    links: req.body.folderData.links,
  });
  contentFolder.save((err) => {
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
    .exec()
    .then((results) => {
      res.end(JSON.stringify(results));
    })
    .catch((err) => {
      console.log(err);
      // res.end(JSON.stringify('no response'));
    });
});
app.get('/getPostContent', (req, res) => {
  console.log('getting post content');
  // console.log(req.query);
  const key = req.query;
  //// validate query
  if (!key.id.length) {
    return res.json(createResponse(false, 400, 'no query'));
  }

  try {
    ContentFolder.find({ ['id']: key['id'] })
      .exec()
      .then((results) => {
        console.log(results);
        if (results.length < 1) {
          return res.json(createResponse(false, 400, 'no data'));
        }
        return res.json(createResponse(true, 200, results[0]));
      })
      .catch((err) => {
        console.log(err);
        const response = createResponse(false, 400, 'query failed');
        return res.json(response);
      });
  } catch (err) {
    console.log(err);
    const response = createResponse(false, 400, 'request failed');
    return res.json(response);
  }
});

app.get('/getAllPosts', (req, res) => {
  console.log('getting all posts');
  try {
    return Post.find()
      .sort({ timeStamp: -1 })
      .exec()
      .then((results) => {
        return res.end(JSON.stringify(results));
      });
  } catch {
    console.log('something went wrong');
  }
});

app.delete(`/delete/:id`, (req, res) => {
  try {
    console.log('delete in server');
    // console.log(req.params);
    const id = req.params.id;
    console.log(id);
    Post.deleteOne({ id: id })
      .then(() => {
        console.log('post deleted');
      })
      .catch((error) => {
        console.log(error);
        return;
      });
    ContentFolder.deleteOne({ id: id })
      .then(() => {
        console.log('content deleted');
        res
          .status(200)
          .json({ message: `Deleted post and picture folder for ${id}` });
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.put(`/update/:id/:id`, (req, res) => {
  console.log('updating in server');
  // console.log(req.body);
  const post = req.body.blogPost;
  const contentFolder = req.body.contentFolder;
  const newPost = req.body.newBlogPost;

  //need to find out what the req.body will look like
  const id = req.params.id;
  console.log(post._id);
  console.log({ contentFolder });
  console.log({ newPost });

  Post.findOneAndUpdate(
    { id: post.id },
    {
      title: newPost.title,
      category: newPost.category,
      description: newPost.description,
      // picture: newPost.picture,
      // video: newPost.video,
      // link: newPost.link,
      timeStamp: newPost.timeStamp,
    },
    { new: true },
    (err, updatedPost) => {
      if (err) {
        console.log(err);
      } else {
        console.log('post update', { updatedPost });
      }
    }
  );
  ContentFolder.findOneAndUpdate(
    { id: contentFolder.id },
    {
      pictures: contentFolder.pictures,
      videos: contentFolder.videos,
      links: contentFolder.links,
    },
    { new: true },
    (err, updatedContent) => {
      if (err) {
        console.log(err);
      } else {
        console.log('content update', { updatedContent });
      }
    }
  );
});

//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(port, () => {
  console.log('Server Has Started on ' + port);
});

//////////// i used this to hash the manually made password
// async function hashPassword() {
//   console.log('hashing');

//   try {
//     // Find a user by their username
//     const user = await User.findOne({ user: 'Admin' });
//     console.log({ user });

//     // Generate a new hashed password
//     const hashedPassword = await bcrypt.hash(user.password, 10);

//     // Update the user's password in the database
//     await User.updateOne({ username: 'Admin' }, { password: hashedPassword });
//     console.log('Password hash updated successfully');
//   } catch (err) {
//     console.error(err);
//   } finally {
//     return;
//   }
// }

// hashPassword();
