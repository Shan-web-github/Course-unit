import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dropdownstyle from "../components/Dropdownstyle2";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ClashCheck() {
  const [allCourses, setAllCourses] = useState([]);
  const [rowInputs, setRowInputs] = useState("");
  const [checkResults, setCheckResults] = useState([]);
  const [checkResult, setCheckResult] = useState(0);

  const ipAddress = process.env.REACT_APP_IPADDRESS;

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

  return (
    <div>
      <div>
        <Navbar path="/clashcheck" />
      </div>
      <div className="h-100vh">
        <Container>
          <Row>
            <Col>
              <Form>
                <h5>
                  Select courses , you need to check conflict
                </h5>
                <Row className="mb-2 align-items-center">
                  <Col md="auto">
                    <Dropdownstyle
                      courseList={allCourses}
                      selectedCourses={rowInputs}
                      onChange={(value) => handleRowChange(0, value)}
                    />
                  </Col>
                  <Col md="auto">
                    <Dropdownstyle
                      courseList={allCourses}
                      selectedCourses={rowInputs}
                      onChange={(value) => handleRowChange(1, value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 align-items-center">
                  <Col md="auto">
                    <Dropdownstyle
                      courseList={allCourses}
                      selectedCourses={rowInputs}
                      onChange={(value) => handleRowChange(2, value)}
                    />
                  </Col>
                  <Col md="auto">
                    <Dropdownstyle
                      courseList={allCourses}
                      selectedCourses={rowInputs}
                      onChange={(value) => handleRowChange(3, value)}
                    />
                  </Col>
                </Row>
                <Row className="mb-2 align-items-center">
                  <Col md="auto">
                    <Dropdownstyle
                      courseList={allCourses}
                      selectedCourses={rowInputs}
                      onChange={(value) => handleRowChange(4, value)}
                    />
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col md="auto">
                    <Button onClick={checkClashes}>Check</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col>
              <h5>
                {checkResult === 1 && <span>! CONFLICTS</span>}
                {checkResult === 2 && <span>NO CONFLICTS</span>}
              </h5>
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
