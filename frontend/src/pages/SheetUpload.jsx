import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import CalendarIcon from "../assets/Icons/table_icon.png";

//bootstrapt lib
import { Container, Card, Form, Button } from "react-bootstrap";

export default function SheetUpload() {
  const [courses, setCourses] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [semReg, setSemReg] = useState(null);
  const [offerCourseExam, setOfferCourseExam] = useState(null);

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!courses || !mapping || !semReg || !offerCourseExam) {
      return alert("Please upload all files.");
    }
    const formData = new FormData();
    formData.append("courses", courses);
    formData.append("mapping", mapping);
    formData.append("sem_reg", semReg);
    formData.append("offer_course_exm", offerCourseExam);

    try {
      const res = await axios.post(
        `http://${ipAddress}:5000/studentdata/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.status);
      alert("Successfully uploaded");
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("An error occurred while uploading files.");
    }
  };

  const goNext = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get(
        `http://${ipAddress}:5000/studentdata/requiredtablesexist`
      );
      if (res.status === 200) {
        await createNewSemReg();
      }
    } catch (error) {
      console.error(
        "Checking Exist Table Error:",
        error.response?.data || error.message
      );
      alert("Please insert all Excel sheets.");
    }
  };

  const createNewSemReg = async () => {
    try {
      await axios.get(`http://${ipAddress}:5000/studentdata/newsemreg`);
      console.log("Successfully created new_sem_reg");
      navigate("/home");
    } catch (error) {
      console.error(
        "New sem reg error:",
        error.response?.data || error.message
      );
      alert("An error occurred while navigating to the next page.");
    }
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
              Insert <span className="text-primary">YourTables</span>
            </h2>
          </div>
          <Form>
            <Form.Group controlId="courses" className="mb-3">
              <Form.Label>Insert Courses File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setCourses(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="mapping" className="mb-3">
              <Form.Label>Insert Mapping File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setMapping(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="semReg" className="mb-3">
              <Form.Label>Insert Semester Registration File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSemReg(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="offerCourseExam" className="mb-3">
              <Form.Label>
                Insert Offered Courses for Examination File
              </Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setOfferCourseExam(e.target.files[0])}
              />
            </Form.Group>
          </Form>
          <div className="button">
            <Button
              variant="primary"
              type="submit"
              onClick={submit}
              className="w-40 fw-bold"
            >
              Submit
            </Button>
            <Button variant="dark" onClick={goNext} className="w-40 fw-bold">
              Next
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
