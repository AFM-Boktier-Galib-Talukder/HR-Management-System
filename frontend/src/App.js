import React from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Signup from "./Signup";
import EmployeeHome from "./EmployeeHome";
import SupervisorHome from "./SupervisorHome";
import AdminHome from "./AdminHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        {/* <Route path="/signup" element={<Signup />}></Route> */}
        <Route path="/employee-home" element={<EmployeeHome />}></Route>
        <Route path="/supervisor-home" element={<SupervisorHome />}></Route>
        <Route path="/admin-home" element={<AdminHome />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
