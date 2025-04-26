import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "./imgs/realistic-neon-lights-background_52683-60224.jpg";

function EmployeeHome() {
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };
  const navigate = useNavigate();
  const employeeData = JSON.parse(localStorage.getItem("employeeData")) || {};
  const [overtimeData, setOvertimeData] = useState({
    Hours: 0,
    Date: new Date().toISOString().split("T")[0],
  });
  const [leaveData, setLeaveData] = useState({
    StartDate: new Date().toISOString().split("T")[0],
    EndDate: new Date().toISOString().split("T")[0],
    No_of_Days: 0,
    Reason: "",
  });
  const [message, setMessage] = useState("");

  const handleOvertimeRequest = () => {
    if (overtimeData.Hours <= 0) {
      setMessage("Please enter valid overtime hours");
      return;
    }

    axios
      .post("http://localhost:8081/request-overtime", {
        UserID: employeeData.UserID,
        Hours: overtimeData.Hours,
        Date: overtimeData.Date,
      })
      .then((res) => {
        setMessage(res.data.status);
        setOvertimeData({ Hours: 0, Date: new Date().toISOString().split("T")[0] });
      })
      .catch((err) => setMessage("Error submitting request"));
  };

  const handleLeaveRequest = () => {
    if (leaveData.No_of_Days <= 0) {
      setMessage("Please enter valid leave days");
      return;
    }

    axios
      .post("http://localhost:8081/request-leave", {
        UserID: employeeData.UserID,
        ...leaveData,
      })
      .then((res) => {
        setMessage(res.data.status);
        setLeaveData({
          StartDate: new Date().toISOString().split("T")[0],
          EndDate: new Date().toISOString().split("T")[0],
          No_of_Days: 0,
          Reason: "",
        });
      })
      .catch((err) => setMessage("Error submitting request"));
  };

  const logout = () => {
    localStorage.removeItem("employeeData");
    navigate("/");
  };

  if (!employeeData.UserID) {
    navigate("/");
    return null;
  }

  return (
    <div style={divStyle} className="container-fluid text-white p-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Employee Dashboard</h2>
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

      <div className="card mb-4 bg-opacity-50 bg-primary">
        <div className="card-header bg-transparent text-white">
          <h5>Request Management</h5>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div
                  style={{
                    background: "linear-gradient(45deg,rgb(225, 0, 255),rgb(0, 149, 255))",
                    boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
                  }}
                  className="card-header text-white"
                >
                  <h6>Overtime Request</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Hours:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={overtimeData.Hours}
                      onChange={(e) => setOvertimeData({ ...overtimeData, Hours: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={overtimeData.Date}
                      onChange={(e) => setOvertimeData({ ...overtimeData, Date: e.target.value })}
                    />
                  </div>
                  <button
                    style={{
                      background: "linear-gradient(45deg,rgb(247, 0, 255),rgb(17, 0, 255))",
                      boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
                    }}
                    onClick={handleOvertimeRequest}
                    className="btn text-white"
                  >
                    Request Overtime
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div
                  style={{
                    background: "linear-gradient(45deg,rgb(8, 0, 255), #00ffff)",
                    boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
                  }}
                  className="card-header text-white"
                >
                  <h6>Leave Request</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Start Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={leaveData.StartDate}
                      onChange={(e) => setLeaveData({ ...leaveData, StartDate: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={leaveData.EndDate}
                      onChange={(e) => setLeaveData({ ...leaveData, EndDate: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Days:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={leaveData.No_of_Days}
                      onChange={(e) => setLeaveData({ ...leaveData, No_of_Days: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason:</label>
                    <textarea className="form-control" value={leaveData.Reason} onChange={(e) => setLeaveData({ ...leaveData, Reason: e.target.value })} />
                  </div>
                  <button
                    style={{
                      background: "linear-gradient(45deg, rgb(34, 0, 255),rgb(0, 149, 255))",
                      boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
                    }}
                    onClick={handleLeaveRequest}
                    className="btn btn-info text-white"
                  >
                    Request Leave
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeHome;
