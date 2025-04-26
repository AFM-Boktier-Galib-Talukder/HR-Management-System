import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "./imgs/realistic-neon-lights-background_52683-59948.jpg";

function AdminHome() {
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(JSON.parse(localStorage.getItem("employeeData")) || {});
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    UserID: "",
    Password: "qwer1234",
    Role: "contractual_worker",
    Name: "",
    Salary: 0,
    Date_of_Birth: "",
    Department: "",
    Joining_Date: "",
  });

  // Fetch all employees on component mount
  useEffect(() => {
    if (!employeeData.UserID) {
      navigate("/");
      return;
    }
    fetchEmployees();
  }, [navigate, employeeData]);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:8081/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: name === "Salary" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/add-employee", newEmployee)
      .then(() => {
        setShowAddModal(false);
        setNewEmployee({
          UserID: "",
          Password: "qwer1234",
          Role: "contractual_worker",
          Name: "",
          Salary: 0,
          Date_of_Birth: "",
          Department: "",
          Joining_Date: "",
        });
        fetchEmployees();
      })
      .catch((err) => console.error(err));
  };

  const confirmDelete = (userId) => {
    setEmployeeToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteEmployee = () => {
    axios
      .delete(`http://localhost:8081/delete-employee/${employeeToDelete}`)
      .then(() => {
        setShowDeleteModal(false);
        fetchEmployees();
      })
      .catch((err) => console.error(err));
  };

  const logout = () => {
    localStorage.removeItem("employeeData");
    navigate("/");
  };

  if (!employeeData.UserID) {
    return null;
  }

  return (
    <div style={divStyle} className="container-fluid p-4 text-white">
      <div className="row mb-4">
        <div className="col">
          <h2>Admin Dashboard</h2>
          <p>
            Welcome, {employeeData.Name} ({employeeData.UserID})
          </p>
          <p>Current Salary {employeeData.Salary}$</p>
        </div>
        <div className="col text-end">
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="card mb-4 bg-opacity-50 bg-primary rounded-3">
        <div
          style={{
            background: "linear-gradient(45deg,rgb(0, 60, 255),rgb(255, 0, 242))",
            boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
          }}
          className="card-header bg-primary text-white"
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5>Employee Management</h5>
            <button onClick={() => setShowAddModal(true)} className="btn btn-light">
              Add New Employee
            </button>
          </div>
        </div>
        <div className="card-body bg-transparent">
          <div className="table-responsive bg-transparent">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>UserID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Salary</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.UserID}>
                    <td className="bg-transparent text-white">{emp.UserID}</td>
                    <td className="bg-transparent text-white">{emp.Name}</td>
                    <td className="bg-transparent text-white">{emp.Role}</td>
                    <td className="bg-transparent text-white">${emp.Salary}</td>
                    <td className="bg-transparent text-white">{emp.Department || "N/A"}</td>
                    <td className="bg-transparent text-white">
                      <button onClick={() => confirmDelete(emp.UserID)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header
          className="text-white"
          style={{
            background: "linear-gradient(45deg,rgb(0, 30, 255),rgb(255, 0, 217))",
            boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
          }}
          closeButton
        >
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="text-white"
          style={{
            background: "linear-gradient(45deg,rgb(0, 30, 255),rgb(255, 0, 217))",
            boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
          }}
        >
          <form onSubmit={handleAddEmployee}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">UserID</label>
                <input type="text" className="form-control" name="UserID" value={newEmployee.UserID} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="Password" value={newEmployee.Password} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="Name" value={newEmployee.Name} onChange={handleInputChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select className="form-select" name="Role" value={newEmployee.Role} onChange={handleInputChange} required>
                  <option value="contractual_worker">Contractual Worker</option>
                  <option value="general_worker">General Worker</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Salary ($)</label>
                <input type="number" className="form-control" name="Salary" value={newEmployee.Salary} onChange={handleInputChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control" name="Date_of_Birth" value={newEmployee.Date_of_Birth} onChange={handleInputChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Joining Date</label>
                <input type="date" className="form-control" name="Joining_Date" value={newEmployee.Joining_Date} onChange={handleInputChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label">Department</label>
                <input type="text" className="form-control" name="Department" value={newEmployee.Department} onChange={handleInputChange} />
              </div>
            </div>

            <div className="text-end">
              <button type="button" className="btn btn-danger me-2" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                style={{
                  background: "linear-gradient(45deg,rgb(0, 255, 255),rgb(60, 0, 255))",
                  boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
                }}
                type="submit"
                className="btn btn-primary"
              >
                Save Employee
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete employee {employeeToDelete}? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEmployee}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminHome;
