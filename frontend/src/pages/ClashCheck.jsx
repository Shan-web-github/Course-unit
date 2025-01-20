import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Dropdownstyle from "../components/Dropdownstyle2";

export default function ClashCheck() {
  const [allCourses, setAllCourses] = useState([]);
  const [rowInputs, setRowInputs] = useState("");
  // const [selectedCourses, setSelectedCourses] = useState([]);

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

  const checkClashes = () => {
    if (rowInputs.length<2) return alert("Select at least two courses")
    console.log(rowInputs);
  }

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
