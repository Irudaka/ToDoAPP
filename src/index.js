const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./config");
const TodoTask = require("../models/TodoTask");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));
app.set("view engine", "ejs");

app.listen(3000, () => console.log("Server up and running on port 3000"));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await TodoTask.find().sort({ date: -1 });
        res.render('home', { todoTasks: tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching tasks");
    }
});

app.post('/tasks', async (req, res) => {
    const todoTask = new TodoTask({ content: req.body.content });
    try {
        await todoTask.save();
        res.redirect("/tasks");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving task");
    }
});

app.get("/tasks/edit/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const task = await TodoTask.findById(id);
        res.render("todoEdit", { task, idTask: id }); // Pass idTask here
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching task for editing");
    }
});

app.post("/tasks/edit/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
        res.redirect("/tasks");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating task");
    }
});

app.get("/tasks/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndDelete(id);
        res.redirect("/tasks");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting task");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        const existingUser = await User.findOne({ name: data.name });
        if (existingUser) {
            res.send("User already exists. Please choose a different username and try again!");
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        await User.create(data);
        res.redirect("/login");
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send("An error occurred during the signup process.");
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.username });
        if (!user) {
            res.send("User name does not exist!");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            res.redirect("/tasks");
        } else {
            res.send("Incorrect password!");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Incorrect Details!");
    }
});
