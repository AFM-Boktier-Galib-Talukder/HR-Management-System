import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "./imgs/5270007.jpg";

function SupervisorHome() {
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };
  const navigate = useNavigate();
  const employeeData = JSON.parse(localStorage.getItem("employeeData")) || {};
  const [requests, setRequests] = useState({ overtime: [], leave: [] });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overtime");

  useEffect(() => {
    if (!employeeData.UserID) {
      navigate("/");
      return;
    }
    fetchPendingRequests();
  }, [navigate, employeeData]);

  const fetchPendingRequests = async () => {
    try {
      // Fetch overtime requests
      const overtimeRes = await axios.get("http://localhost:8081/pending-overtime");
      // Fetch leave requests
      const leaveRes = await axios.get("http://localhost:8081/pending-leave");

      setRequests({
        overtime: overtimeRes.data,
        leave: leaveRes.data,
      });
    } catch (err) {
      setMessage("Error fetching requests");
      console.error(err);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleString();
  };

  const handleApprove = async (id, type) => {
    try {
      await axios.post("http://localhost:8081/approve-request", { id, type });
      setMessage(`${type} request approved`);
      fetchPendingRequests();
    } catch (err) {
      setMessage(`Error approving ${type} request`);
    }
  };

  const handleReject = async (id, type) => {
    try {
      await axios.post("http://localhost:8081/reject-request", { id, type });
      setMessage(`${type} request rejected`);
      fetchPendingRequests();
    } catch (err) {
      setMessage(`Error rejecting ${type} request`);
    }
  };

  const logout = () => {
    localStorage.removeItem("employeeData");
    navigate("/");
  };

  if (!employeeData.UserID) {
    return null;
  }

  return (
    <div style={divStyle} className="container-fluid text-white p-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Supervisor Dashboard</h2>
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

      <div className="card bg-opacity-50 bg-primary rounded-3">
        <div
          style={{
            background: "linear-gradient(45deg,rgb(0, 30, 255),rgb(255, 0, 242))",
            boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
          }}
          className="card-header bg-primary text-white rounded-3"
        >
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "overtime" ? "active bg-primary" : ""} text-white`}
                onClick={() => setActiveTab("overtime")}
                style={{
                  backgroundColor: activeTab === "overtime" ? "#0d6efd" : "transparent",
                  borderColor: activeTab === "overtime" ? "#0d6efd" : "transparent",
                }}
              >
                Overtime Requests
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "leave" ? "active bg-primary" : ""} text-white`}
                onClick={() => setActiveTab("leave")}
                style={{
                  backgroundColor: activeTab === "leave" ? "#0d6efd" : "transparent",
                  borderColor: activeTab === "leave" ? "#0d6efd" : "transparent",
                }}
              >
                Leave Requests
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}

          {activeTab === "overtime" ? (
            requests.overtime.length === 0 ? (
              <p className="text-white">No pending overtime requests</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Hours</th>
                      <th>Date</th>
                      <th>Request Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.overtime.map((req) => (
                      <tr key={`overtime-${req.Overtime_id}`}>
                        <td className="bg-transparent text-white">{req.Overtime_id}</td>
                        <td className="bg-transparent text-white">{req.UserID}</td>
                        <td className="bg-transparent text-white">{req.Name || "N/A"}</td>
                        <td className="bg-transparent text-white">{req.Hours}</td>
                        <td className="bg-transparent text-white">{req.Date}</td>
                        <td className="bg-transparent text-white">{formatDateTime(req.request_date)}</td>
                        <td className="bg-transparent text-white">
                          <button onClick={() => handleApprove(req.Overtime_id, "overtime")} className="btn btn-primary btn-sm me-2">
                            Approve
                          </button>
                          <button onClick={() => handleReject(req.Overtime_id, "overtime")} className="btn btn-danger btn-sm">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : requests.leave.length === 0 ? (
            <p className="text-white">No pending leave requests</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Request Date</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.leave.map((req) => (
                    <tr key={`leave-${req.Leave_id}`}>
                      <td className="bg-transparent text-white">{req.Leave_id}</td>
                      <td className="bg-transparent text-white">{req.UserID}</td>
                      <td className="bg-transparent text-white">{req.Name || "N/A"}</td>
                      <td className="bg-transparent text-white">{req.StartDate}</td>
                      <td className="bg-transparent text-white">{req.EndDate}</td>
                      <td className="bg-transparent text-white">{req.No_of_Days}</td>
                      <td className="bg-transparent text-white">{formatDateTime(req.request_date)}</td>
                      <td className="bg-transparent text-white">{req.Reason || "N/A"}</td>
                      <td className="bg-transparent text-white">
                        <button onClick={() => handleApprove(req.Leave_id, "leave")} className="btn btn-primary btn-sm me-2">
                          Approve
                        </button>
                        <button onClick={() => handleReject(req.Leave_id, "leave")} className="btn btn-danger btn-sm">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupervisorHome;
