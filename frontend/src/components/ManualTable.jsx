import React, { useState } from "react";
import Dropdownstyle from "../components/Dropdownstyle";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

export default function ManualTable({ columns, level, semester }) {
  const [dateAndTime, setDateAndTime] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const selectStartDate = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);

    if (newStartDate && timeSlot) {
      setDateAndTime(true);
    } else {
      setDateAndTime(false);
    }
  };

  const selectTimeSlot = (event) => {
    const newTimeSlot = event.target.value;
    setTimeSlot(newTimeSlot);

    if (startDate && newTimeSlot) {
      setDateAndTime(true);
    } else {
      setDateAndTime(false);
    }
  };

  const checkBoth = () => timeSlot === "Both";

  const isBoth = checkBoth();
  const rows = Array(4).fill(null);

  return (
    <div>
      <div>
        <div>
          {level} Level {semester} Semester End Examination
          <br />
        </div>
        <div className="manualtablediv">
          <div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Exam Start date</Form.Label>
              <Form.Control
                type="date"
                value={startDate || ""}
                onChange={selectStartDate}
              />
            </Form.Group>
          </div>
          <div>
            <Form.Group>
              <Form.Label>Time Slot</Form.Label>
              <Form.Select value={timeSlot} onChange={selectTimeSlot}>
                <option value="">Select...</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Both">Both</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </div>
      {dateAndTime && (
        <Table striped bordered hover responsive size="md" variant="secondary">
          <thead>
            <tr>
              <th colSpan={isBoth ? 2 : 1}>{startDate}</th>
            </tr>
            {isBoth ? (
              <tr>
                <th>Morning</th>
                <th>Evening</th>
              </tr>
            ) : (
              <tr>
                <th>{timeSlot}</th>
              </tr>
            )}
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr key={index}>
                <td>
                  <Dropdownstyle courseList={columns} />
                </td>
                {isBoth && (
                  <td>
                    <Dropdownstyle courseList={columns} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
