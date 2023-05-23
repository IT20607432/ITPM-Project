const dotenv = require("dotenv");
dotenv.config();

const mongodb = require("mongodb").MongoClient;
const express = require("express");

const mongoose = require("mongoose");

const supertokens = require("supertokens-node");
const { errorHandler } = require("supertokens-node/framework/express");

const middleware = require("./middleware/auth_middleware");

const cors = require("cors");
const BodyParser = require("body-parser");
const morgan = require("morgan");

const initializeSupertokens = require("./config/supertokens");

const {
  verifySession,
} = require("supertokens-node/recipe/session/framework/express");
const UserMetadata = require("supertokens-node/recipe/usermetadata");

// Importing the schema
const Post = require("./models/data");
const UserRole = require("./models/user_roles");
const DocInfo = require("./models/doc_profile");
const Comments = require("./models/comments");

// Initializing
initializeSupertokens();

const connectionstring = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihznx.mongodb.net/?retryWrites=true&w=majority`;
const app = express();
const router = express.Router({ mergeParams: true });
const PORT = process.env.PORT || 6700;

// Connecting to the DB
mongoose
  .connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(PORT))

  .catch((err) => console.error(err));

console.log("Deployment Successful");
console.log(`Server started at PORT ${PORT}`);

// Middleware and static files
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(BodyParser.urlencoded({ extended: false }));

// cors middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

// auth middleware
app.use(middleware());

// /api endpoint that returns all the vegetables in the DB
app.get("/api/posts", (req, res) => {
  Post.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/comments/:post_id", (req, res) => {
  const post_id = req.params.post_id;
  Comments.find({ post_id })
    .then((response) => res.send(response).status(200))
    .catch((err) => res.send(err).status(500));
});

app.get("/api/comments", (req, res) => {
  Comments.find()
    .then((response) => res.send(response).status(200))
    .catch((err) => res.send(err).status(500));
});

app.delete("/api/comments/:comment_id", (req, res) => {
  Comments.find({ _id: req.params.user_id }).then((response) => {
    if (!response) {
      res.send({ message: "Access Denied" }).status(400);
      return;
    }
  });
  Comments.deleteOne({ _id: req.params.comment_id })
    .then((response) => res.send(response).status(200))
    .catch((err) => res.send(err).status(500));
});

app.post("/api/comments/:post_id", (req, res) => {
  const user_id = req.body.user_id;
  console.log(user_id);
  UserRole.find({ user_id: user_id })
    .then((response) => {
      console.log("found", response);
      if (response[0].role === 1 || response[0].role === 2) {
        Comments.insertMany([
          {
            post_id: req.params.post_id,
            comment_title: req.body.comment_title,
            comment_content: req.body.comment_content,
            owner_id: user_id,
          },
        ])
          .then((commentResponse) => {
            res.send(commentResponse).status(200);
          })
          .catch((err) => {
            res.send(err).status(500);
          });
      } else res.send({ message: "Access Denied" }).status(400);
    })
    .catch((err) => res.send(err).status(500));
});

app.delete("/api/posts/:post_id", (req, res) => {
  console.log(req.params.post_id);
});

app.post("/api/posts", (req, res) => {
  console.log(req.body.title, req.body.content, req.body.user_id);
  if (true) {
    UserRole.findOne({ user_id: req.body.user_id })
      .then((user_result) => {
        console.log("user_result", user_result);
        Post.insertMany([
          {
            title: req.body.title ?? "",
            owner_email: user_result.user_email,
            content: req.body.content,
          },
        ])
          .then((result) => res.status(200).json(result))
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500));
  } else
    res
      .send({
        message:
          "Please provide all the arguments to create a post: title, content and body",
      })
      .status(500);
});

app.delete("/api/posts/:post_id", (req, res) => {
  if (req.params.post_id) Post.deleteOne((post_id = req.params.post_id));
  else res.send({ message: "Please provide post_id to delete the post" });
});

app.get("/api/user_info/:user_id", (req, res) => {
  console.log(req.params.user_id);
  if (req.params.user_id)
    UserRole.findOne({ user_id: req.params.user_id })
      .then((result) => {
        console.log(result);
        res.send({
          id: result.user_id,
          role: result.role,
          email: result.user_email,
        });
      })
      .catch((err) => res.status(500));
  else res.status(400);
});

// get current user info
app.get("/api/profile", (req, res) => {
  res.send({});
});

app.post("/api/on_boarding/doc/data", (req, res) => {
  DocInfo.find({ user_id: req.body.user_id }).then((response) => {
    if (response) {
      const ids = response.map((item) => item._id);
      DocInfo.findByIdAndDelete(ids);
    }
  });

  DocInfo.insertMany([
    {
      user_id: req.body.user_id,
      doc_name: req.body.doc_name,
      registration_number: req.body.registration_number,
      qualifications: req.body.qualifications,
      locationData: {
        longitude: req.body.longitude ?? null,
        latitude: req.body.latitude ?? null,
      },
    },
  ])
    .then((response) => res.send(response).status(200))
    .catch((err) => res.send(err).status(500));
});

app.get("/api/on_boarding/doc/data", (req, res) => {
  DocInfo.find()
    .then((response) => res.send(response).status(200))
    .catch((err) => res.send(err).status);
});

app.post("/api/dump_data", (req, res) => {
  res.send(200);
});

app.post("/api/update_info", verifySession(), async (req, res) => {
  const session = req.session;
  const userId = session.getUserId();

  const { metadata } = await UserMetadata.getUserMetadata(userId);

  res.json({ preferences: metadata.preferences });
});

// error handler
app.use(errorHandler());
