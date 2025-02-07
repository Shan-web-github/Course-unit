import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Badge, Modal } from "react-bootstrap";

export default function TimetableViewer({ tableIndex, isShow, onClose }) {
  const [show, setShow] = useState(isShow);
  const [timetable, setTimetable] = useState([]);

  // Fetch timetable from backend
  useEffect(() => {
    axios
      .get(`http://localhost:5000/studentdata/view-schedule/${tableIndex}`)
      .then((response) => setTimetable(response.data))
      .catch((error) => console.error("Error fetching timetable:", error));
  }, [tableIndex]);

  // Function to remove a subject
  const removeSubject = (session, level, subject) => {
    setTimetable((prev) =>
      prev.map((day) => ({
        ...day,
        schedule_data: {
          ...day.schedule_data,
          [session]: {
            ...day.schedule_data[session],
            [level]: day.schedule_data[session][level].filter(
              (s) => s !== subject
            ),
          },
        },
      }))
    );
  };

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose(); // Notify parent to update state
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Time Table</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        {timetable.map((day) => (
          <div key={day.id} className="container mt-4">
            <h3>Timetable for {day.date_name}</h3>
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
                              className="me-2 p-2"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                removeSubject(session, level, subject)
                              }
                            >
                              {subject} &times;
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted">No subjects</p>
                        )}
                      </div>
                    )
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
}
