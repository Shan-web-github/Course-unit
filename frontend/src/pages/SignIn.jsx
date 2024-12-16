import React, { createContext, useState } from "react";
import axios from "axios";
import validator from "validator";
import { useNavigate } from "react-router-dom";

import { setSessionData } from "../utils/storage/sessionStorageUtils";

import background from "../assets/background.jpg";

import { Button, Form } from "react-bootstrap";
import Signup from "../components/Signup";

export const userReg = createContext();

export default function SignIn() {
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const [check, setCheck] = useState(false);

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    if (!logInEmail || !logInPassword) {
      return alert("Please insert email and password");
    }

    if (!validateEmail(logInEmail)) {
      return alert("Invalid email format");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/usersdata/login",
        {
          email: logInEmail,
          password: logInPassword,
        }
      );
      setSessionData("jwt_token", response.data.token);
      alert(`Login successful! Status: ${response.status}`);
      navigate("/sheetupload");
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const click = () => {
    setCheck(!check);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card p-4"
        style={{
          width: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <div>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(event) => {
                  setLogInEmail(event.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={check ? "text" : "password"}
                placeholder="Password"
                onChange={(event) => {
                  setLogInPassword(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Show password"
                onChange={click}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
              <span
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={handleShow}
              >
                Create an account
              </span>

              <Button variant="dark" type="submit" onClick={submit}>
                Submit
              </Button>
            </Form.Group>
          </Form>
        </div>
        <userReg.Provider value={{show, setShow}}>
          <Signup />
        </userReg.Provider>
      </div>
    </div>
  );
}
