import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//components

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SheetUpload() {
  const [courses, setCourse] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [sem_reg, setSem_reg] = useState(null);
  const [offer_course_exm, setOffer_course_exm] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!courses || !mapping || !sem_reg || !offer_course_exm) {
      return alert("Please upload all files.");
    }
    const formData = new FormData();
    formData.append("courses", courses);
    formData.append("mapping", mapping);
    formData.append("sem_reg", sem_reg);
    formData.append("offer_course_exm", offer_course_exm);

    try {
      await axios
        .post("http://localhost:5000/studentdata/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          alert(res.status);
          // navigate("/home");
        })
        .catch((error) => {
          alert(error);
        });

      alert("Successfully uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading files.");
    }
  };

  const navigate = useNavigate();

  const goNext = () => {
    navigate("/home");
  };

  return (
    <div>
      <div className="uploadform">
        <Form onSubmit={submit}>
          <Form.Group controlId="courses" className="mb-3">
            <Form.Label>Insert Courses File</Form.Label>
            <Form.Control
              type="file"
              onChange={(event) => setCourse(event.target.files[0])}
            />
          </Form.Group>
          <Form.Group controlId="mapping" className="mb-3">
            <Form.Label>Insert Mapping File</Form.Label>
            <Form.Control
              type="file"
              onChange={(event) => setMapping(event.target.files[0])}
            />
          </Form.Group>
          <Form.Group controlId="sem_reg" className="mb-3">
            <Form.Label>Insert Semester Registration File</Form.Label>
            <Form.Control
              type="file"
              onChange={(event) => setSem_reg(event.target.files[0])}
            />
          </Form.Group>
          <Form.Group controlId="offer_course_exm" className="mb-3">
            <Form.Label>Insert Offered Courses For Examination File</Form.Label>
            <Form.Control
              type="file"
              onChange={(event) => setOffer_course_exm(event.target.files[0])}
            />
          </Form.Group>
          <div className="button">
            <Button variant="dark" type="submit">
              Submit
            </Button>
            <Button variant="dark" type="submit" onClick={goNext}>
              Next
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SheetUpload;
