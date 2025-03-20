import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Table, CloseButton } from "react-bootstrap";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ExamHallArrangement() {
  const [hallNo, setHallNo] = useState("");
  const [hallName, setHallName] = useState("");
  const [hallCapacity, setHallCapacity] = useState("");

  const prevHalls = [
    { no: "BT2", name: "Botany New", capacity: 80 },
    { no: "BT3", name: "Botany Old", capacity: 45 },
    { no: "CH2", name: "Chemistry Lower", capacity: 32 },
    { no: "CH3", name: "Chemistry New", capacity: 80 },
    { no: "CH1", name: "Chemistry Upper", capacity: 115 },
    { no: "GL1", name: "Geology", capacity: 54 },
    { no: "GL2", name: "Geology", capacity: 44 },
    { no: "MT1", name: "Mathematics", capacity: 80 },
    { no: "MB1", name: "Molecular Biology", capacity: 68 },
    { no: "PH2", name: "Physics Lower", capacity: 32 },
    { no: "PH3", name: "Physics New - P1", capacity: 120 },
    { no: "PH4", name: "Physics -P2", capacity: 54 },
    { no: "PH5", name: "Physics -P3", capacity: 54 },
    { no: "PH1", name: "Physics Upper", capacity: 115 },
    { no: "SE1", name: "Science Education", capacity: 50 },
    { no: "SC2", name: "SCLT1 Lecture Theatre", capacity: 100 },
    { no: "SC3", name: "SCLT2 Lecture Theatre", capacity: 100 },
    { no: "SC6", name: "SCLT3 Lecture Theatre", capacity: 50 },
    { no: "SC4", name: "Statistics and Computer Science  Lab-4", capacity: 45 },
    { no: "ZL2", name: "Zoology New", capacity: 80 },
    { no: "ZL1", name: "Zoology Old", capacity: 45 },
  ];

  const [halls, setHalls] = useState(prevHalls);

  const [viewHalls, setViewHalls] = useState(false);

  const [timetableIndex, setTimetableIndex] = useState("");
  const [examData, setExamData] = useState([]);
  const [selectedHalls, setSelectedHalls] = useState({});
  const ipAddress = process.env.REACT_APP_IPADDRESS;

  const [timetables, setTimetables] = useState([]);

  useEffect(() => {
    // Check available timetables
    const checkTables = async () => {
      try {
        const tableNames = ["table1", "table2", "table3", "table4"];
        const existingTables = [];
        for (const table of tableNames) {
          const { data } = await axios.get(
            `http://${ipAddress}:5000/studentdata/checktable/${table}`
          );
          if (data.tableExists)
            existingTables.push({
              id: table.slice(-1),
              name: `Time Table ${table.slice(-1)}`,
            });
        }
        setTimetables(existingTables);
      } catch (error) {
        console.error("Error checking table existence:", error);
        alert("Error fetching timetable data.");
      }
    };

    checkTables();
  }, [ipAddress]);

  // Add new hall
  const addHall = (event) => {
    event.preventDefault();
    if (!hallName.trim() || !hallCapacity.trim() || !hallNo.trim()) {
      return alert("Hall Name and Capacity are required!");
    }
    setHalls((prev) => [
      ...prev,
      { no: hallNo, name: hallName, capacity: hallCapacity },
    ]);
    setHallNo("");
    setHallName("");
    setHallCapacity("");
  };

  const removeHall = (hallNo) => {
    setHalls((prev) => prev.filter((hall) => hall.no !== hallNo));
  };

  // Select timetable
  const handleTimetableSelect = (e) => {
    if (e.target.value !== "") {
      setTimetableIndex(e.target.value);
      axios
        .get(
          `http://${ipAddress}:5000/studentdata/view-final-schedule/${e.target.value}`
        )
        .then((response) => {
          setExamData(response.data);
        })
        .catch((error) => console.error("Error fetching exam data:", error));
    }
  };

  // Assign hall to an exam session
  const assignHall = (examSession, hallName) => {
    setSelectedHalls((prev) => ({ ...prev, [examSession]: hallName }));
  };

  // Export to PDF
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

  // Export to Word
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
      <Navbar path="/hallarrangement" />
      <div className="main-pane container mt-4">
        {/* <h2>Exam Hall Arrangement</h2> */}

        <Form>
          <Form.Group>
            <Form.Label>Add a New Hall</Form.Label>
            <div className="d-flex mt-2">
              <Form.Control
                type="text"
                placeholder="Hall Number"
                value={hallNo}
                onChange={(e) => setHallNo(e.target.value)}
                className="me-2"
              />
              <Form.Control
                type="text"
                placeholder="Hall Name"
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                className="me-2"
              />
              <Form.Control
                type="number"
                placeholder="Capacity"
                value={hallCapacity}
                onChange={(e) => setHallCapacity(e.target.value)}
              />
              <Button variant="success" onClick={addHall} className="ms-2">
                Add
              </Button>
            </div>
          </Form.Group>

          <br />

          {halls.length > 0 && viewHalls && (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Hall Name</th>
                  <th>Hall Capacity</th>
                  <th className="table-item-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                {halls.map((hall, index) => (
                  <tr key={index}>
                    <td>{hall.no}</td>
                    <td>{hall.name}</td>
                    <td>{hall.capacity}</td>
                    <td className="table-item-center">
                      <CloseButton onClick={() => removeHall(hall.no)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Form.Group className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => setViewHalls(!viewHalls)}
            >
              {viewHalls ? "Hide Exam Halls" : "Show Exam Halls"}
            </Button>
          </Form.Group>

          <hr />

          <Form.Group className="mt-3">
            <Form.Label>Select Timetable</Form.Label>
            <Form.Select
              onChange={handleTimetableSelect}
              value={timetableIndex}
            >
              {timetables.length > 0 ? (
                <>
                  <option value="">Select Timetable</option>
                  {timetables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No Timetable Available</option>
              )}
            </Form.Select>
          </Form.Group>
        </Form>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Exam Date</th>
              <th>Subject</th>
              <th>Assign Hall</th>
              <th>Candidates</th>
            </tr>
          </thead>
          <tbody>
            {examData.map((exam, index) => (
              <React.Fragment key={index}>
                {Object.values(exam.schedule_data?.morning?.level1 || []).map(
                  (subject, index) => (
                    <tr key={`morning-${exam.date_name}-${index}`}>
                      <td>{exam.date_name}</td>
                      <td>{subject}</td>
                      <td>
                        <Form.Select
                          onChange={(e) => assignHall(subject, e.target.value)}
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall, i) => (
                            <option key={i} value={hall.name}>
                              {hall.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {halls.length > 0 && (
                          <Form.Select
                          // onChange={(e) => assignHall(subject, e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {!subject.includes("/") ? (
                              <option value={subject}>{subject}</option>
                            ) : (
                              <>
                                <option value={subject.split("/")[0]}>
                                  {subject.split("/")[0]}
                                </option>
                                <option value={subject.split("/")[1]}>
                                  {subject.split("/")[1]}
                                </option>
                                {subject.split("/")[2] && (
                                  <option value={subject.split("/")[2]}>
                                    {subject.split("/")[2]}
                                  </option>
                                )}
                              </>
                            )}
                          </Form.Select>
                        )}
                      </td>
                    </tr>
                  )
                )}

                {Object.values(exam.schedule_data?.morning?.level2 || []).map(
                  (subject, index) => (
                    <tr key={`morning-${exam.date_name}-${index}`}>
                      <td>{exam.date_name}</td>
                      <td>{subject}</td>
                      <td>
                        <Form.Select
                          onChange={(e) => assignHall(subject, e.target.value)}
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall, i) => (
                            <option key={i} value={hall.name}>
                              {hall.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {halls.length > 0 && (
                          <Form.Select
                          // onChange={(e) => assignHall(subject, e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {!subject.includes("/") ? (
                              <option value={subject}>{subject}</option>
                            ) : (
                              <>
                                <option value={subject.split("/")[0]}>
                                  {subject.split("/")[0]}
                                </option>
                                <option value={subject.split("/")[1]}>
                                  {subject.split("/")[1]}
                                </option>
                                {subject.split("/")[2] && (
                                  <option value={subject.split("/")[2]}>
                                    {subject.split("/")[2]}
                                  </option>
                                )}
                              </>
                            )}
                          </Form.Select>
                        )}
                      </td>
                    </tr>
                  )
                )}

                {Object.values(exam.schedule_data?.morning?.level3 || []).map(
                  (subject, index) => (
                    <tr key={`morning-${exam.date_name}-${index}`}>
                      <td>{exam.date_name}</td>
                      <td>{subject}</td>
                      <td>
                        <Form.Select
                          onChange={(e) => assignHall(subject, e.target.value)}
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall, i) => (
                            <option key={i} value={hall.name}>
                              {hall.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {halls.length > 0 && (
                          <Form.Select
                          // onChange={(e) => assignHall(subject, e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {!subject.includes("/") ? (
                              <option value={subject}>{subject}</option>
                            ) : (
                              <>
                                <option value={subject.split("/")[0]}>
                                  {subject.split("/")[0]}
                                </option>
                                <option value={subject.split("/")[1]}>
                                  {subject.split("/")[1]}
                                </option>
                                {subject.split("/")[2] && (
                                  <option value={subject.split("/")[2]}>
                                    {subject.split("/")[2]}
                                  </option>
                                )}
                              </>
                            )}
                          </Form.Select>
                        )}
                      </td>
                    </tr>
                  )
                )}

                {Object.values(exam.schedule_data?.evening?.level1 || []).map(
                  (subject, index) => (
                    <tr key={`evening-${exam.date_name}-${index}`}>
                      <td>{exam.date_name}</td>
                      <td>{subject}</td>
                      <td>
                        <Form.Select
                          onChange={(e) => assignHall(subject, e.target.value)}
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall, i) => (
                            <option key={i} value={hall.name}>
                              {hall.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {halls.length > 0 && (
                          <Form.Select
                          // onChange={(e) => assignHall(subject, e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {!subject.includes("/") ? (
                              <option value={subject}>{subject}</option>
                            ) : (
                              <>
                                <option value={subject.split("/")[0]}>
                                  {subject.split("/")[0]}
                                </option>
                                <option value={subject.split("/")[1]}>
                                  {subject.split("/")[1]}
                                </option>
                                {subject.split("/")[2] && (
                                  <option value={subject.split("/")[2]}>
                                    {subject.split("/")[2]}
                                  </option>
                                )}
                              </>
                            )}
                          </Form.Select>
                        )}
                      </td>
                    </tr>
                  )
                )}

                {Object.values(exam.schedule_data?.evening?.level2 || []).map(
                  (subject, index) => (
                    <tr key={`evening-${exam.date_name}-${index}`}>
                      <td>{exam.date_name}</td>
                      <td>{subject}</td>
                      <td>
                        <Form.Select
                          onChange={(e) => assignHall(subject, e.target.value)}
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall, i) => (
                            <option key={i} value={hall.name}>
                              {hall.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {halls.length > 0 && (
                          <Form.Select
                          // onChange={(e) => assignHall(subject, e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {!subject.includes("/") ? (
                              <option value={subject}>{subject}</option>
                            ) : (
                              <>
                                <option value={subject.split("/")[0]}>
                                  {subject.split("/")[0]}
                                </option>
                                <option value={subject.split("/")[1]}>
                                  {subject.split("/")[1]}
                                </option>
                                {subject.split("/")[2] && (
                                  <option value={subject.split("/")[2]}>
                                    {subject.split("/")[2]}
                                  </option>
                                )}
                              </>
                            )}
                          </Form.Select>
                        )}
                      </td>
                    </tr>
                  )
                )}

                {Object.values(exam.schedule_data?.evening?.level3 || []).map(
                  (subject, index) => (
                    <tr key={`evening-${exam.date_name}-${index}`}>
                      <td>{exam.date_name}</td>
                      <td>{subject}</td>
                      <td>
                        <Form.Select
                          onChange={(e) => assignHall(subject, e.target.value)}
                        >
                          <option value="">Select Hall</option>
                          {halls.map((hall, i) => (
                            <option key={i} value={hall.name}>
                              {hall.name}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        {halls.length > 0 && (
                          <Form.Select
                          // onChange={(e) => assignHall(subject, e.target.value)}
                          >
                            <option value="">Select Subject</option>
                            {!subject.includes("/") ? (
                              <option value={subject}>{subject}</option>
                            ) : (
                              <>
                                <option value={subject.split("/")[0]}>
                                  {subject.split("/")[0]}
                                </option>
                                <option value={subject.split("/")[1]}>
                                  {subject.split("/")[1]}
                                </option>
                                {subject.split("/")[2] && (
                                  <option value={subject.split("/")[2]}>
                                    {subject.split("/")[2]}
                                  </option>
                                )}
                              </>
                            )}
                          </Form.Select>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </React.Fragment>
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
      <Footer />
    </div>
  );
}
