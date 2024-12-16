import React,{useContext, useState} from "react";
import axios from "axios";
import validator from 'validator';

import { Modal, Button, Form } from "react-bootstrap";
import { userReg } from "../pages/SignIn";


export default function Signup() {

  const{show, setShow}  = useContext(userReg);

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConPassword, setSignUpConPassword] = useState("");

  const handleClose = () => setShow(false);

  const validateEmail = (email) => {
    return validator.isEmail(email);
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
      const response = await axios.post(
        "http://localhost:5000/usersdata/signup",
        {
          email: signUpEmail,
          password: signUpPassword,
        }
      );
      alert(`Signup successful! Status: ${response.status}`);
      handleClose();
    } catch (error) {
      alert(`Signup failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(event) => {
                  setSignUpEmail(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event) => {
                  setSignUpPassword(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Conform Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event) => {
                  setSignUpConPassword(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={save}>
            Save
          </Button>
          <Button variant="warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
