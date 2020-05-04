const express = require("express");

const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: "John Smith",
    bio: "very generic person",
  },
];

server.get("/", (req, res) => {
  res.json({ api: "up and running!" });
});

// GET users
server.get("/api/users", (req, res) => {
  if (!users) {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  } else {
    res.status(201).json(users);
  }
});

// POST users
server.post("/api/users", (req, res) => {
  const newUser = {
    id: shortid.generate(),
    name: req.body.name,
    bio: req.body.bio,
  };

  try {
    if (typeof newUser.name !== "string" || typeof newUser.bio !== "string") {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user.",
      });
    } else {
      users.push(newUser);
      res.status(201).json(newUser);
    }
  } catch (err) {
    console.log("Error on GET /api/users", err);
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

// GET users by id
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  try {
    users.filter((user) => {
      if (id === user.id) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist.",
        });
      }
    });
  } catch (err) {
    console.log("Error on GET /api/users/:id", err);
    res.status(500).json({
      errorMessage: "The user information could not be retrieved.",
    });
  }
});

// DELETE user by id
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  console.log("delete request!!!", id);
  const deletedUser = users.filter((user) => user.id == id);
  users = users.filter((user) => user.id != id);

  try {
    if (deletedUser != 0) {
      res.status(200).json({
        users: users,
        deletedUser,
      });
    } else {
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    }
  } catch (err) {
    console.log("Error on DELETE /api/users/:id", err);
    res.status(500).json({
      errorMessage: "The user information could not be retrieved.",
    });
  }
});

// PUT update user
server.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);
  const index = users.indexOf(user);

  if (!user) {
    res.status(500).json({
      errorMessage: "The user information could not be modified.",
    });
  } else {
    const updatedUser = { ...user };
    users[index] = updatedUser;
    res.status(200).json(updatedUser);
  }
});

server.listen(8000, () => console.log("\n== API IS UP ==\n"));
