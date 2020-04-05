const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
const HOST = "0.0.0.0";

var projects = [];
var count = 0;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for count quantity requests
app.use((req, res, next) => {
  count++;
  console.log(`Quantidade de requisições feitas: ${count}`);

  next();
});

// Check if project exists
const checkProjectExists = (req, res, next) => {
  var find = projects.find((p) => p.id === req.params.id);

  if (find) {
    next();
  } else {
    return res.json({ message: "Project not exists" });
  }
};

// Index
app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find((p) => p.id === id);

  return res.json(project);
});

// Create
app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  project = { id, title };

  projects.push(project);

  return res.json(projects);
});

// Update
app.put("/project/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map((p) => {
    if (p.id === id) {
      p.title = title;
    }

    return p;
  });

  return res.json(projects);
});

// Delete
app.delete("/project/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  projects = projects.filter((p) => {
    return p.id !== id;
  });

  return res.json(projects);
});

// Create nested attribute task for a project
app.post("/project/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects = projects.map((p) => {
    if (p.id === id) {
      p.tasks = p.tasks || [];
      p.tasks.push(title);
    }

    return p;
  });

  return res.json(projects);
});

app.listen(PORT, HOST);
