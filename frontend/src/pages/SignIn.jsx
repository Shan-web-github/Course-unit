import React, { createContext, useState } from "react";
import axios from "axios";
import validator from "validator";
import { useNavigate } from "react-router-dom";

import { setSessionData } from "../utils/storage/sessionStorageUtils";

import CalendarIcon from "../assets/Icons/calendar-icon.jpg";

import { Container, Card, Form, Button } from "react-bootstrap";
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
    <div className="main">
      <Container
        fluid
        className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      >
        <Card className="p-4 shadow-sm" style={{ width: "24rem" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold d-flex justify-content-center align-items-center">
              <img src={CalendarIcon} alt="Logo" className="me-2" width="30" />
              Exam <span className="text-primary">TimeTable</span>
            </h2>
          </div>
          <div>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  className="border-bottom"
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
                  className="border-bottom"
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
                  className="text-primary text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={handleShow}
                >
                  Create an account
                </span>

                <Button
                  variant="dark"
                  type="submit"
                  onClick={submit}
                  className="w-40 fw-bold"
                >
                  Sign In
                </Button>
              </Form.Group>
            </Form>
          </div>
          <userReg.Provider value={{ show, setShow }}>
            <Signup />
          </userReg.Provider>
        </Card>
      </Container>
    </div>
  );
}
