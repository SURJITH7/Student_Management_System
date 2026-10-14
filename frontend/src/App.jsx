import { useEffect, useState } from "react";
import "./App.css";


function App() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [address, setAddress] = useState("");
    const [editId, setEditId] = useState(null);

    const API = import.meta.env.VITE_API_URL ||
  "http://localhost:7300/students";


    const getStudents = () => {
        fetch(API)
            .then(response => response.json())
            .then(data => setStudents(data));
    };


    useEffect(() => {
        getStudents();
    }, []);


    const addStudent = () => {
        fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                course,
                address
            })
        })
            .then(response => response.json())
            .then(() => {
                setName("");
                setEmail("");
                setCourse("");
                setAddress("");
                getStudents();
            });
    };


    const editStudent = (student) => {
        setEditId(student.id);
        setName(student.name);
        setEmail(student.email);
        setCourse(student.course);
        setAddress(student.address);
    };


    const updateStudent = () => {
        
        fetch((API)/{editId}, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                course,
                address
            })
        })
            .then(response => response.json())
            .then(() => {
                setName("");
                setEmail("");
                setCourse("");
                setAddress("");
                setEditId(null);
                getStudents();
            });
    };


    const deleteStudent = (id) => {
        fetch(API/{id}, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(() => {
                getStudents();
            });
    };


    return (
        <div className="container">
            <h1>Student Management System</h1>


            <div className="form">
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />


                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />


               
                <input
                    type="text"
                    placeholder="Enter Course"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                />

                 <input
                    type="text"
                    placeholder="Enter Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />

            </div>


            <div className="main-buttons">
                {editId === null ? (
                    <button onClick={addStudent}>
                        Add Student
                    </button>
                ) : (
                    <button onClick={updateStudent}>
                        Update Student
                    </button>
                )}


                <button onClick={getStudents}>
                    Refresh
                </button>
            </div>


            <h2>Students</h2>


            <div className="students">
                {students.map(student => (
                    <div className="student-card" key={student.id}>
                        <h3>{student.name}</h3>


                        <p>
                            <strong>Email:</strong> {student.email}
                        </p>


                        <p>
                            <strong>Course:</strong> {student.course}
                        </p>

                        <p>
                            <strong>Address:</strong> {student.address}
                        </p>


                        <div className="card-buttons">
                            <button onClick={() => editStudent(student)}>
                                Edit
                            </button>


                            <button onClick={() => deleteStudent(student.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default App;
