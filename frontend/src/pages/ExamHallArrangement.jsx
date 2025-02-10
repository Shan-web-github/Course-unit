import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ExamHallArrangement() {
  const [numHalls, setNumHalls] = useState(0);
  const [halls, setHalls] = useState([]);
  const [timetableIndex, setTimetableIndex] = useState("");
  const [examData, setExamData] = useState([]);
  const [selectedHalls, setSelectedHalls] = useState({});
  const ipAddress = process.env.REACT_APP_IPADDRESS;

  // Fetch available timetables
  const [isTable1Exist, setIsTable1Exist] = useState(false);
  const [isTable2Exist, setIsTable2Exist] = useState(false);
  const [isTable3Exist, setIsTable3Exist] = useState(false);
  const [isTable4Exist, setIsTable4Exist] = useState(false);

  useEffect(() => {
    const checkTableExist = async (tableName, setFunction) => {
      try {
        const { data } = await axios.get(
          `http://${ipAddress}:5000/studentdata/checktable/${tableName}`
        );
        setFunction(data.tableExists);
      } catch (error) {
        console.error("Error checking table existence:", error);
        alert(error);
      }
    };

    checkTableExist("table1", setIsTable1Exist);
    checkTableExist("table2", setIsTable2Exist);
    checkTableExist("table3", setIsTable3Exist);
    checkTableExist("table4", setIsTable4Exist);
  }, [ipAddress]);

  // Handle number of halls input
  const handleNumHallsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setNumHalls(value);
    setHalls(Array.from({ length: value }, () => ({ name: "", capacity: 0 })));
  };

  // Update hall details
  const updateHall = (index, field, value) => {
    setHalls((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Select timetable
  const handleTimetableSelect = (e) => {
    setTimetableIndex(e.target.value);
    axios
      .get(`http://${ipAddress}:5000/studentdata/view-schedule/${e.target.value}`)
      .then((response) => {
        // Assuming the response data is structured similarly to the PDF
        setExamData(response.data);
      })
      .catch((error) => console.error("Error fetching exam data:", error));
  };

  // Assign halls to exam sessions
  const assignHall = (examSession, hallName) => {
    setSelectedHalls((prev) => ({ ...prev, [examSession]: hallName }));
  };

  // Generate PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exam Hall Arrangement", 10, 10);
    let y = 20;
    Object.entries(selectedHalls).forEach(([examSession, hall]) => {
      doc.text(`${examSession}: ${hall}`, 10, y);
      y += 10;
    });
    doc.save("Exam_Hall_Arrangement.pdf");
  };

  // Generate Word Document
  const exportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Exam Hall Arrangement", bold: true }),
              ],
            }),
            ...Object.entries(selectedHalls).map(
              ([examSession, hall]) => new Paragraph(`${examSession}: ${hall}`)
            ),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Exam_Hall_Arrangement.docx");
    });
  };

  return (
    <div className="main">
      <div>
        <Navbar path="/hallarrangement" />
      </div>
      <div className="main-pane container mt-4">
        <h2>Exam Hall Arrangement</h2>
        <Form>
          <Form.Group>
            <Form.Label>Number of Halls</Form.Label>
            <Form.Control
              type="number"
              value={numHalls}
              onChange={handleNumHallsChange}
            />
          </Form.Group>
          {halls.map((hall, index) => (
            <div key={index} className="d-flex mt-2">
              <Form.Control
                type="text"
                placeholder="Hall Name"
                value={hall.name}
                onChange={(e) => updateHall(index, "name", e.target.value)}
                className="me-2"
              />
              <Form.Control
                type="number"
                placeholder="Capacity"
                value={hall.capacity}
                onChange={(e) => updateHall(index, "capacity", e.target.value)}
              />
            </div>
          ))}
          <Form.Group className="mt-3">
            <Form.Label>Select Timetable</Form.Label>
            <Form.Select onChange={handleTimetableSelect} value={timetableIndex}>
              <option value="">Select Timetable</option>
              <option value="1">{isTable1Exist && "Time Table 01"}</option>
              <option value="2">{isTable2Exist && "Time Table 02"}</option>
              <option value="3">{isTable3Exist && "Time Table 03"}</option>
              <option value="4">{isTable4Exist && "Time Table 04"}</option>
            </Form.Select>
          </Form.Group>
        </Form>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Exam Date</th>
              <th>Center</th>
              <th>Subject</th>
              <th>Candidates</th>
              <th>Assign Hall</th>
            </tr>
          </thead>
          <tbody>
            {examData.map((exam, index) => (
              <tr key={index}>
                <td>{exam.examDate}</td>
                <td>{exam.center}</td>
                <td>{exam.subject}</td>
                <td>{exam.candidates}</td>
                <td>
                  <Form.Select
                    onChange={(e) => assignHall(exam.subject, e.target.value)}
                  >
                    <option value="">Select Hall</option>
                    {halls.map((hall, i) => (
                      <option key={i} value={hall.name}>
                        {hall.name}
                      </option>
                    ))}
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button variant="success" className="me-2" onClick={exportPDF}>
          Export as PDF
        </Button>
        <Button variant="primary" onClick={exportWord}>
          Export as Word
        </Button>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}