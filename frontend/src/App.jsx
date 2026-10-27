
import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [address, setAddress] = useState("");
    const [editId, setEditId] = useState(null);

    const API =
        import.meta.env.VITE_API_URL ||
        "http://localhost:7300/students";

    const apiRequest = async (url, options = {}) => {
        const response = await fetch(url, options);
        const text = await response.text();

        let data = null;

        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    `Expected JSON but received: ${text.slice(0, 100)}`
                );
            }
        }

        if (!response.ok) {
            throw new Error(
                data?.message || `HTTP error: ${response.status}`
            );
        }

        return data;
    };

    // Get all students
    const getStudents = async () => {
        try {
            const data = await apiRequest(API);
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching students:", error);
            alert(error.message);
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    // Clear form
    const clearForm = () => {
        setName("");
        setEmail("");
        setCourse("");
        setAddress("");
        setEditId(null);
    };

    // Add student
    const addStudent = async () => {
        try {
            await apiRequest(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    course,
                    address,
                }),
            });

            clearForm();
            await getStudents();
        } catch (error) {
            console.error("Error adding student:", error);
            alert(error.message);
        }
    };

    // Load student details into the form
    const editStudent = (student) => {
        setEditId(student.id);
        setName(student.name);
        setEmail(student.email);
        setCourse(student.course);
        setAddress(student.address);
    };

    // Update student
    const updateStudent = async () => {
        try {
            await apiRequest(`${API}/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    course,
                    address,
                }),
            });

            clearForm();
            await getStudents();
        } catch (error) {
            console.error("Error updating student:", error);
            alert(error.message);
        }
    };

    // Delete student
    const deleteStudent = async (id) => {
        try {
            await apiRequest(`${API}/${id}`, {
                method: "DELETE",
            });

            await getStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert(error.message);
        }
    };

    return (
        <div className="container">
            <h1>Student Management System</h1>

            <div className="form">
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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

                {editId !== null && (
                    <button onClick={clearForm}>
                        Cancel
                    </button>
                )}
            </div>

            <h2>Students</h2>

            <div className="students">
                {students.map((student) => (
                    <div
                        className="student-card"
                        key={student.id}
                    >
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
                            <button
                                onClick={() => editStudent(student)}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteStudent(student.id)}
                            >
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
