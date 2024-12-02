import React, { useState } from "react";

import background from "../assets/background.jpg";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SignIn() {
  const [check, setCheck] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    window.location.href = "/sheetupload";
  };

  const click = (event) => {
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
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={check ? "text" : "password"}
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Show password"
                onChange={click}
              />
            </Form.Group>
            <Form.Group className="mb-3 text-end">
            <Button variant="dark" type="submit" onClick={submit}>
              Submit
            </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
