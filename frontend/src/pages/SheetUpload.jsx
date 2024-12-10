import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import background from "../assets/background.jpg";

// Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function SheetUpload() {
  const [courses, setCourses] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [semReg, setSemReg] = useState(null);
  const [offerCourseExam, setOfferCourseExam] = useState(null);

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
        "http://localhost:5000/studentdata/upload",
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
        "http://localhost:5000/studentdata/requiredtablesexist"
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
      await axios.get("http://localhost:5000/studentdata/newsemreg");
      console.log("Successfully created new sem reg.");
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
          width: "500px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <Form onSubmit={submit}>
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
            <Form.Label>Insert Offered Courses for Examination File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setOfferCourseExam(e.target.files[0])}
            />
          </Form.Group>
          <div className="button">
            <Button variant="dark" type="submit">
              Submit
            </Button>
            <Button variant="dark" onClick={goNext}>
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
