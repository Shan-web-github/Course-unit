import React, { useState } from "react";
import axios from "axios";
import validator from 'validator';
import { useNavigate } from "react-router-dom";

import { setSessionData } from "../utils/storage/sessionStorageUtils";

import background from "../assets/Akbar_Bridge.jpg";

import { Modal, Button, Form } from "react-bootstrap";

export default function SignIn() {

  const [logInEmail,setLogInEmail] = useState('');
  const [logInPassword,setLogInPassword] = useState('');
  const [signUpEmail,setSignUpEmail] = useState('');
  const [signUpPassword,setSignUpPassword] = useState('');
  const [signUpConPassword,setSignUpConPassword] = useState('');

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
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
      const response = await axios.post("http://localhost:5000/usersdata/login", {
        email: logInEmail,
        password: logInPassword,
      });
      setSessionData('jwt_token',response.data.token);
      alert(`Login successful! Status: ${response.status}`);
      navigate("/sheetupload");
    } catch (error) {
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const save = async (event) => {
    event.preventDefault();
  
    if (!signUpEmail || !signUpPassword) {
      return alert("Please insert email and password");
    }

    if (!validateEmail(signUpEmail)) {
      return alert("Invalid email format");
    }
    
    if (signUpPassword !== signUpConPassword) {
      return alert("Passwords do not match");
    }
  
    try {
      const response = await axios.post("http://localhost:5000/usersdata/signup", {
        email: signUpEmail,
        password: signUpPassword,
      });
      alert(`Signup successful! Status: ${response.status}`);
      handleClose();
    } catch (error) {
      alert(`Signup failed: ${error.response?.data?.message || error.message}`);
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
              <Form.Control type="email" placeholder="Enter email" onChange={(event)=>{setLogInEmail(event.target.value)}}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={check ? "text" : "password"}
                placeholder="Password"
                onChange={(event)=>{setLogInPassword(event.target.value)}}
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
        <div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" onChange={(event)=>{setSignUpEmail(event.target.value)}}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(event)=>{setSignUpPassword(event.target.value)}}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Conform Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(event)=>{setSignUpConPassword(event.target.value)}}/>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={save}>
                Save 
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

