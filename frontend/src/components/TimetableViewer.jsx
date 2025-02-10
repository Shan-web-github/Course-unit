import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { popUpdata } from "./Navbar";
import { Card, Badge, Modal, CloseButton, Form, Button } from "react-bootstrap";

export default function TimetableViewer({ tableIndex }) {
  const { show, setShow } = useContext(popUpdata);
  const [timetable, setTimetable] = useState([]);

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  // Fetch timetable from backend
  useEffect(() => {
    axios
      .get(`http://${ipAddress}:5000/studentdata/view-schedule/${tableIndex}`)
      .then((response) => setTimetable(response.data))
      .catch((error) => console.error("Error fetching timetable:", error));
  }, [tableIndex, ipAddress]);

  // update exam date
  const updateDate = (id, newDate) => {
    setTimetable((prev) =>
      prev.map((day) => (day.id === id ? { ...day, date_name: newDate } : day))
    );
  };

  //add a new day
  const addNewDay = () => {
    const newDay = {
      id: Date.now(),
      date_name: "",
      schedule_data: {
        morning: {},
        evening: {},
      },
    };
    setTimetable((prev) => [...prev, newDay]);
  };

  // add a subject to a session and level
  const addSubject = (dayId, session, level, subject) => {
    setTimetable((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedSession = {
            ...day.schedule_data[session],
            [level]: [...(day.schedule_data[session][level] || []), subject],
          };
          return {
            ...day,
            schedule_data: { ...day.schedule_data, [session]: updatedSession },
          };
        }
        return day;
      })
    );
  };

  // remove a Date
  const removeDate = (dayId) => {
    setTimetable((prev) => prev.filter((day) => day.id !== dayId));
  };

  // remove a subject
  const removeSubject = (dayId, session, level, subject) => {
    setTimetable((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedSession = {
            ...day.schedule_data[session],
            [level]: day.schedule_data[session][level].filter(
              (s) => s !== subject
            ),
          };
          return {
            ...day,
            schedule_data: { ...day.schedule_data, [session]: updatedSession },
          };
        }
        return day;
      })
    );
  };

  // save timetable in sorted order
  const saveUpdatedTimetable = async () => {
    try {
      // Sort timetable by date
      const sortedTimetable = [...timetable].sort(
        (a, b) => new Date(a.date_name) - new Date(b.date_name)
      );

      // Send updated timetable to backend
      await axios.put(
        `http://${ipAddress}:5000/studentdata/update-schedule/${tableIndex}`,
        { timetable: sortedTimetable }
      );

      alert("Timetable updated successfully!");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to update timetable");
    }
  };

  const handleClose = () => {
    setShow(false);
    // if (onClose) onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Time Table</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Form.Group>
          <Form.Label className="required">
            If you need to add another subjects into a session, Please{" "}
            <a
              href="/clashcheck"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "red",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              check
            </a>{" "}
            subject conflict of the session.
          </Form.Label>
        </Form.Group>
        {timetable.map((day) => (
          <Card key={day.id} className="container mt-4">
            <Card.Body>
              <Card.Title>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center justify-content-between">
                    <h5>{day.date_name || "Select Date"}</h5>
                    <CloseButton
                      style={{ cursor: "pointer" }}
                      onClick={() => removeDate(day.id)}
                    />
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={""}
                    // value={
                    //   day.date_name && !isNaN(new Date(day.date_name))
                    //     ? new Date(day.date_name).toISOString().split("T")[0]
                    //     : ""
                    // }
                    onChange={(e) => updateDate(day.id, e.target.value)}
                  />
                </Form.Group>
              </Card.Title>
              {["morning", "evening"].map((session) => (
                <Card key={session} className="mb-3">
                  <Card.Body>
                    <Card.Title className="text-capitalize">
                      {session} Session
                    </Card.Title>

                    {Object.entries(day.schedule_data[session] || {}).map(
                      ([level, subjects]) => (
                        <div key={level} className="mb-2">
                          <h5>{level.toUpperCase()}</h5>
                          {subjects.length > 0 ? (
                            subjects.map((subject) => (
                              <Badge
                                key={subject}
                                bg="primary"
                                size="sm"
                                className="me-2 p-2 mb-2"
                              >
                                <span
                                  className="d-flex align-items-center justify-content-between"
                                  style={{ gap: "5px" }}
                                >
                                  <label className="mb-0">{subject}</label>
                                  <CloseButton
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      removeSubject(
                                        day.id,
                                        session,
                                        level,
                                        subject
                                      )
                                    }
                                  />
                                </span>
                              </Badge>
                            ))
                          ) : (
                            <p className="text-muted">No subjects</p>
                          )}
                        </div>
                      )
                    )}

                    {/* Add Subject Section */}
                    <Form className="d-flex align-items-center mt-2">
                      <Form.Control
                        type="text"
                        placeholder="Enter Subject"
                        id={`subject-input-${day.id}-${session}`}
                      />
                      <Form.Select
                        id={`level-select-${day.id}-${session}`}
                        className="mx-2"
                      >
                        <option value="">Select Level</option>
                        <option value="level1">Level 1</option>
                        <option value="level2">Level 2</option>
                        <option value="level3">Level 3</option>
                      </Form.Select>
                      <Button
                        variant="success"
                        onClick={() => {
                          const subjectInput = document.getElementById(
                            `subject-input-${day.id}-${session}`
                          );
                          const levelSelect = document.getElementById(
                            `level-select-${day.id}-${session}`
                          );
                          if (subjectInput.value && levelSelect.value) {
                            addSubject(
                              day.id,
                              session,
                              levelSelect.value,
                              subjectInput.value
                            );
                            subjectInput.value = "";
                          }
                        }}
                      >
                        Add
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        ))}
        <Button variant="primary" className="mb-3 mt-3" onClick={addNewDay}>
          Add New Day
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={saveUpdatedTimetable}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
