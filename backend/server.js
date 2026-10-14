const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 7300;
const pool = require("./connectDB");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Welcome to the Student Management System");
})

app.get("/students", async (req, res) => {
    try {
        const student = await pool.query("SELECT * FROM students");
        res.json(student.rows);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

app.post("/students", async (req, res) => {
    try {
        const {name, email, course, address} = req.body;
        const student = await pool.query(
            "INSERT INTO students (name, email, course, address) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, course, address]
        );
        res.json(student.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

app.put("/students/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const{name, email, course, address} = req.body;
        const student = await pool.query(
            "UPDATE students SET name = $1, email = $2, course = $3, address = $4 WHERE id = $5 RETURNING *",
            [name, email, course, address, id]
        );
        res.json(student.rows[0]);
    }catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

app.delete("/students/:id", async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM students WHERE id = $1", [id]);
        res.json({message: "Student deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    } 
})


app.listen(PORT, "0.0.0.0" ,() => {
  console.log(`Server is running on port ${PORT}`);
});