import React, { useState } from "react";
// import { Link } from "react-router-dom";
import Validation from "./LoginValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "./imgs/4250422.jpg";

function Login() {
  const divStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh", // or any other height you prefer
  };
  const [values, setValues] = useState({
    UserID: "",
    Password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (validationErrors.UserID === "" && validationErrors.Password === "") {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          console.log("Server response:", res.data);
          if (res.data.status === "Success") {
            localStorage.setItem("employeeData", JSON.stringify(res.data.employee));

            // Redirect based on role
            if (res.data.role === "supervisor") {
              navigate("/supervisor-home");
            } else if (res.data.role === "admin") {
              navigate("/admin-home");
            } else {
              navigate("/employee-home");
            }
          } else {
            alert("Invalid credentials");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div style={divStyle} className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-opacity-50 bg-primary p-3 rounded-4 w-25 text-white">
        <h2>Sign In</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="UserID">
              <strong>UserID</strong>
            </label>
            <input type="text" placeholder="Enter UserID" name="UserID" onChange={handleInput} className=" form-control rounded-3" />
            {errors.UserID && <span className=" text-danger">{errors.UserID}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="Password">
              <strong>Password</strong>
            </label>
            <input type="password" placeholder="Enter Password" name="Password" onChange={handleInput} className=" form-control rounded-3" />
            {errors.Password && <span className=" text-danger">{errors.Password}</span>}
          </div>
          <button
            style={{
              background: "linear-gradient(45deg, #ff00ff, #00ffff)",
              boxShadow: "0 0 10px rgb(0, 255, 255), 0 0 20px rgb(208, 0, 255)",
            }}
            type="submit"
            className="btn w-100 rounded-3 text-white"
          >
            Log in
          </button>
          <p>You are agree to our terms and policies</p>
          {/* <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Create Account
          </Link> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
