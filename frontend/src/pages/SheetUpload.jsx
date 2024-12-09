import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//components
import background from "../assets/background.jpg";

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
          console.log(res.status);
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

  const goNext = async (event) => {
    event.preventDefault();
    try {
      await axios
        .get("http://localhost:5000/studentdata/requiredtablesexist")
        .then((res) => {
          if (res.status === 200) {
            createNewSemReg();
          }
        })
        .catch((error) => {
          alert("please insert all excel sheets", error);
        });
    } catch (error) {
      console.error("Checking Exist Table Error:", error);
      alert("Checking Exist Table Error");
    }
  };

  const createNewSemReg = async () => {
    try {
      await axios.get("http://localhost:5000/studentdata/newsemreg");
      console.log("Successfully newsemreg create");
      navigate("/home");
    } catch (error) {
      console.error("newsemreg error:", error);
      alert("An error occurred while going next page.");
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
        <div>
          <Form>
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
              <Form.Label>
                Insert Offered Courses For Examination File
              </Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => setOffer_course_exm(event.target.files[0])}
              />
            </Form.Group>
            <div className="button">
              <Button variant="dark" type="submit" onClick={submit}>
                Submit
              </Button>
              <Button variant="dark" type="submit" onClick={goNext}>
                Next
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SheetUpload;
