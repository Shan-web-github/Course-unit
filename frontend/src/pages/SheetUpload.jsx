import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import CalendarIcon from "../assets/Icons/table_icon.png";
import ExcelIcon from "../assets/Icons/excel icon2.jpg";

//bootstrapt lib
import { Container, Card, Form, Button } from "react-bootstrap";

const requiredHeaders = {
  courses: [
    "BATCH",
    "LEVEL",
    "CO_CODE",
    "CO_TITLE",
    "CREDITS",
    "ACYEAR",
    "SEMESTER",
  ],
  semReg: [
    "ACYEAR",
    "SEMESTER",
    "LEVEL",
    "BATCH",
    "REG_NO",
    "CO_CODE",
    "REMARK",
  ],
  offerCourseExam: [
    "SUB_CODE",
    "BATCH",
    "LEVEL",
    "CO_CODE",
    "CO_TITLE",
    "CREDITS",
    "ACYEAR",
    "SEMESTER",
  ],
  mapping: ["CO_CODE", "OLD_CODE"],
  equivalent: ["CO_CODE", "EQUIVALENT_CODE"],
};

const sampleFiles = {
  courses: "../assets/sample/course_sample.xlsx",
  semReg: "../assets/sample/sem_Reg_sample.xlsx",
  offerCourseExam: "../assets/sample/sem_courses_sample.xlsx",
  mapping: "../assets/sample/mapping_sample.xlsx",
  equivalent: "../assets/sample/equivalent_sample.xlsx",
};

export default function SheetUpload() {
  const [courses, setCourses] = useState(null);
  const [semReg, setSemReg] = useState(null);
  const [offerCourseExam, setOfferCourseExam] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [equivalent, setEquivalent] = useState(null);

  const validateExcelFile = async (file, type) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const fileHeaders = jsonData[0];

        const missingHeaders = requiredHeaders[type].filter(
          (header) => !fileHeaders.includes(header)
        );

        if (missingHeaders.length > 0) {
          alert(`Missing headers in ${type}: ${missingHeaders.join(", ")}`);
          reject(false);
        } else {
          resolve(true);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!courses || !semReg || !offerCourseExam) {
      return alert("Please upload all files.");
    }
    const formData = new FormData();
    try {
      const isValidCourese = await validateExcelFile(courses, "courses");
      if (!isValidCourese) {
        formData.append("courses", courses);
      }
      const isValidSemReg = await validateExcelFile(semReg, "semReg");
      if (isValidSemReg) {
        formData.append("sem_reg", semReg);
      }
      const isValidOfferCourseExam = await validateExcelFile(
        offerCourseExam,
        "offerCourseExam"
      );
      if (isValidOfferCourseExam) {
        formData.append("offer_course_exm", offerCourseExam);
      }
      if (mapping) {
        const isValidMapping = await validateExcelFile(mapping, "mapping");
        if (isValidMapping) {
          formData.append("mapping", mapping);
        }
      }
      if (equivalent) {
        const isValidEquivalent = await validateExcelFile(
          equivalent,
          "equivalent"
        );
        if (isValidEquivalent) {
          formData.append("equivalent", equivalent);
        }
      }
    } catch (error) {
      console.error("File validation failed", error);
    }

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
        if (courses === null && semReg === null && offerCourseExam === null) {
          navigate("/home");
        } else {
          await createNewSemReg();
        }
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
        <Card className="p-4 shadow-sm" style={{ width: "26rem" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold d-flex justify-content-center align-items-center">
              <img src={CalendarIcon} alt="Logo" className="me-2" width="30" />
              Insert <span className="text-primary">YourTables</span>
            </h2>
          </div>
          <Form>
            <Form.Group controlId="courses" className="mb-3">
              <Form.Label className="required">
                Upload the Courses File{" "}
                <a
                  href={sampleFiles["courses"]}
                  download
                  style={{
                    marginLeft: "10px",
                    textDecoration: "none",
                    color: "blue",
                  }}
                >
                  <img
                    src={ExcelIcon}
                    alt="Download Excel"
                    style={{ width: "25px", cursor: "pointer" }}
                  />
                </a>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setCourses(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="semReg" className="mb-3">
              <Form.Label className="required">
                Upload the Semester Registration File{" "}
                <a
                  href={sampleFiles["semReg"]}
                  download
                  style={{
                    marginLeft: "10px",
                    textDecoration: "none",
                    color: "blue",
                  }}
                >
                  <img
                    src={ExcelIcon}
                    alt="Download Excel"
                    style={{ width: "25px", cursor: "pointer" }}
                  />
                </a>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setSemReg(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="offerCourseExam" className="mb-3">
              <Form.Label className="required">
                Upload Offered Courses for Examination File{" "}
                <a
                  href={sampleFiles["offerCourseExam"]}
                  download
                  style={{
                    marginLeft: "10px",
                    textDecoration: "none",
                    color: "blue",
                  }}
                >
                  <img
                    src={ExcelIcon}
                    alt="Download Excel"
                    style={{ width: "25px", cursor: "pointer" }}
                  />
                </a>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setOfferCourseExam(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="mapping" className="mb-3">
              <Form.Label>
                Upload the Mapping File (if necessary){" "}
                <a
                  href={sampleFiles["mapping"]}
                  download
                  style={{
                    marginLeft: "10px",
                    textDecoration: "none",
                    color: "blue",
                  }}
                >
                  <img
                    src={ExcelIcon}
                    alt="Download Excel"
                    style={{ width: "25px", cursor: "pointer" }}
                  />
                </a>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setMapping(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="equivalent" className="mb-3">
              <Form.Label>
                Upload the Equivalent File (if necessary){" "}
                <a
                  href={sampleFiles["equivalent"]}
                  download
                  style={{
                    marginLeft: "10px",
                    textDecoration: "none",
                    color: "blue",
                  }}
                >
                  <img
                    src={ExcelIcon}
                    alt="Download Excel"
                    style={{ width: "25px", cursor: "pointer" }}
                  />
                </a>
              </Form.Label>
              <Form.Control
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setEquivalent(e.target.files[0])}
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
