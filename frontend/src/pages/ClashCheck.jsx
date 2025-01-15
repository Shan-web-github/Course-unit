import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function ClashCheck() {
  return (
    <div>
      <div>
        <Navbar path="/clashcheck" />
      </div>
      <div>
        <div>
          <Form>
            <Form.Label column="lg" lg={2}>
              Select courses , you need to check conflict
            </Form.Label>
            <Row className="mb-2 align-items-center">
              <Col md="auto">
                <Form.Select aria-label="Default select example">
                  <option>Select course</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Col>
              <Col md="auto">
                <Form.Select aria-label="Default select example">
                  <option>Select course</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-2 align-items-center">
              <Col md="auto">
                <Form.Select aria-label="Default select example">
                  <option>Select course</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Col>
              <Col md="auto">
                <Form.Select aria-label="Default select example">
                  <option>Select course</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col md="auto">
                <Form.Select aria-label="Default select example">
                  <option>Select course</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Form.Label column="lg" lg={2}>
            Select courses , you need to check conflict
          </Form.Label>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
