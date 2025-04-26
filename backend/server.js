const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "HRM",
});

// Get all employees
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM Employee";
  db.query(sql, (err, data) => {
    if (err) return res.json("Error");
    return res.json(data);
  });
});

// Add new employee
app.post("/add-employee", (req, res) => {
  const sql = "INSERT INTO Employee SET ?";
  db.query(sql, req.body, (err, data) => {
    if (err) return res.json("Error");
    return res.json("Success");
  });
});

// Delete employee
app.delete("/delete-employee/:userId", (req, res) => {
  const sql = "DELETE FROM Employee WHERE UserID = ?";
  db.query(sql, [req.params.userId], (err, data) => {
    if (err) return res.json("Error");
    return res.json("Success");
  });
});

///////////////////
// Employee request endpoints
app.post("/request-overtime", (req, res) => {
  const { UserID, Hours, Date } = req.body;
  const sql = "INSERT INTO OvertimeRequest (UserID, Hours, Date, Status) VALUES (?, ?, ?, 'Pending')";
  db.query(sql, [UserID, Hours, Date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ status: "Overtime request submitted" });
  });
});

app.post("/request-leave", (req, res) => {
  const { UserID, StartDate, EndDate, No_of_Days, Reason } = req.body;
  const sql = "INSERT INTO LeaveRequest (UserID, StartDate, EndDate, No_of_Days, Reason, Status) VALUES (?, ?, ?, ?, ?, 'Pending')";
  db.query(sql, [UserID, StartDate, EndDate, No_of_Days, Reason], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ status: "Leave request submitted" });
  });
});

// Supervisor approval endpoints
app.get("/pending-requests", (req, res) => {
  const sql = `
    SELECT 'overtime' AS type, Overtime_id AS id, UserID, Hours AS amount, Date, Status 
    FROM OvertimeRequest WHERE Status = 'Pending'
    UNION ALL
    SELECT 'leave' AS type, Leave_id AS id, UserID, No_of_Days AS amount, StartDate AS Date, Status 
    FROM LeaveRequest WHERE Status = 'Pending'
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Get employee names
    const userIds = [...new Set(results.map((r) => r.UserID))];
    if (userIds.length === 0) return res.json([]);

    const empSql = "SELECT UserID, Name FROM Employee WHERE UserID IN (?)";
    db.query(empSql, [userIds], (err, employees) => {
      if (err) return res.status(500).json({ error: err.message });

      const empMap = employees.reduce((map, emp) => {
        map[emp.UserID] = emp.Name;
        return map;
      }, {});

      const enrichedResults = results.map((req) => ({
        ...req,
        Name: empMap[req.UserID] || "Unknown",
      }));

      return res.json(enrichedResults);
    });
  });
});

app.post("/approve-request", (req, res) => {
  const { id, type } = req.body;
  const table = type === "overtime" ? "OvertimeRequest" : "LeaveRequest";
  const sql = `UPDATE ${table} SET Status = 'Approved' WHERE ${type === "overtime" ? "Overtime_id" : "Leave_id"} = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ status: `${type} request approved` });
  });
});

app.post("/reject-request", (req, res) => {
  const { id, type } = req.body;
  const table = type === "overtime" ? "OvertimeRequest" : "LeaveRequest";
  const sql = `UPDATE ${table} SET Status = 'Rejected' WHERE ${type === "overtime" ? "Overtime_id" : "Leave_id"} = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ status: `${type} request rejected` });
  });
});

// Get pending overtime requests
app.get("/pending-overtime", (req, res) => {
  const sql = `
    SELECT o.*, e.Name 
    FROM OvertimeRequest o
    JOIN Employee e ON o.UserID = e.UserID
    WHERE o.Status = 'Pending'
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// Get pending leave requests
app.get("/pending-leave", (req, res) => {
  const sql = `
    SELECT l.*, e.Name 
    FROM LeaveRequest l
    JOIN Employee e ON l.UserID = e.UserID
    WHERE l.Status = 'Pending'
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});
////////////////////////
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM Employee WHERE `UserID` = ? AND `Password` = ?";
  db.query(sql, [req.body.UserID, req.body.Password], (err, data) => {
    if (err) return res.json("Error");
    if (data.length > 0) {
      const user = data[0];
      let role = "General Worker"; // default role

      // Check UserID prefix
      if (user.UserID.startsWith("SU")) {
        role = "supervisor";
      } else if (user.UserID.startsWith("AD")) {
        role = "admin";
      } else if (user.UserID.startsWith("CW")) {
        role = "Contractual Worker";
      }

      return res.json({
        status: "Success",
        employee: user,
        role: role,
      });
    } else {
      return res.json({ status: "Fail" });
    }
  });
});

app.listen(8081, () => {
  console.log("listening");
});
