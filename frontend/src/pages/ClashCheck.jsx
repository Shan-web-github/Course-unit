import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dropdownstyle from "../components/Dropdownstyle2";
import Clashlogo from "../assets/Icons/clashlogo.png";

import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

export default function ClashCheck() {
  const [allCourses, setAllCourses] = useState([]);
  const [rowInputs, setRowInputs] = useState("");
  const [checkResults, setCheckResults] = useState([]);
  const [checkResult, setCheckResult] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  useEffect(() => {
    const createClashes = async () => {
      try {
        await axios.get(`http://${ipAddress}:5000/studentdata/clashesForCheck`);
        console.log("Successfully created clashes table.");
      } catch (error) {
        console.error(
          "repeatclahes error:",
          error.response?.data || error.message
        );
        alert("An error occurred while creating clashes table.");
      }
    };

    createClashes();
  }, [ipAddress]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://${ipAddress}:5000/studentdata/allcourses`
        );
        if (
          Array.isArray(response.data.data) &&
          response.data.data.length > 0
        ) {
          setAllCourses(response.data.data);
          console.log(response.data.data);
        } else {
          console.error("Invalid courses data received", response.data);
        }
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    };
    if (ipAddress) {
      fetchCourses();
    }
  }, [ipAddress]);

  useEffect(() => {
    setCheckResult(0);
    setResetKey(0);
  }, []);

  const handleRowChange = (rowIndex, value) => {
    setRowInputs((prev) => {
      const updated = [...prev];
      updated[rowIndex] = value;
      return updated;
    });
  };

  const checkClashes = async () => {
    if (rowInputs.length < 2) return alert("Select at least two courses");
    console.log(rowInputs);
    try {
      const response = await axios.get(
        `http://${ipAddress}:5000/studentdata/checkclashes/${rowInputs}`
      );
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setCheckResults(response.data.data);
        console.log(checkResults);
        setCheckResult(1);
      } else {
        setCheckResult(2);
      }
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  };

  const resetClashes = () => {
    setCheckResults([]);
    setCheckResult(0);
    setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="main">
      <div>
        <Navbar path="/clashcheck" />
      </div>
      <div className="main-pane">
        <Container
          fluid
          className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
        >
          <Card className="p-4 shadow-sm" style={{ width: "50rem" }}>
            <Row>
              <h2 className="fw-bold d-flex justify-content-center align-items-center mb-4">
                <img src={Clashlogo} alt="Logo" className="me-2" width="40" />
                Check<span className="text-primary">Conflict</span>
              </h2>
              <Col className="border-end border-1 border-secondary">
                <Form>
                  <Row className="mb-2 align-items-center">
                    <Col md="auto">
                      <Dropdownstyle
                        key={resetKey}
                        courseList={allCourses}
                        selectedCourses={rowInputs}
                        onChange={(value) => handleRowChange(0, value)}
                      />
                    </Col>
                    <Col md="auto">
                      <Dropdownstyle
                        key={resetKey}
                        courseList={allCourses}
                        selectedCourses={rowInputs}
                        onChange={(value) => handleRowChange(1, value)}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2 align-items-center">
                    <Col md="auto">
                      <Dropdownstyle
                        key={resetKey}
                        courseList={allCourses}
                        selectedCourses={rowInputs}
                        onChange={(value) => handleRowChange(2, value)}
                      />
                    </Col>
                    <Col md="auto">
                      <Dropdownstyle
                        key={resetKey}
                        courseList={allCourses}
                        selectedCourses={rowInputs}
                        onChange={(value) => handleRowChange(3, value)}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2 align-items-center">
                    <Col md="auto">
                      <Dropdownstyle
                        key={resetKey}
                        courseList={allCourses}
                        selectedCourses={rowInputs}
                        onChange={(value) => handleRowChange(4, value)}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col className="d-flex justify-content-center align-items-center">
                <h5 className="fw-bold">
                  {checkResult === 1 && (
                    <span className="text-danger">CONFLICTS ! </span>
                  )}
                  {checkResult === 2 && (
                    <span className="text-success">NO CONFLICTS</span>
                  )}
                </h5>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between mt-4">
              <Col md="auto">
                <Button variant="dark" onClick={resetClashes} className="mt-2">
                  Reset
                </Button>
              </Col>
              <Col md="auto">
                <Button
                  variant="primary"
                  onClick={checkClashes}
                  className="mt-2"
                >
                  Check
                </Button>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
