import React from "react";
import Dropdownstyle from "../components/Dropdownstyle";
import Table from "react-bootstrap/Table";

export default function ManualTable({
  columns,
  level,
  semester,
  startDate,
  timeSlot,
}) {
  const checkBoth = () => timeSlot === "Both";

  const isBoth = checkBoth();
  const rows = Array(5).fill(null); // Adjust the number of rows as needed

  return (
    <div>
      <div>
        {level} Level {semester} Semester End Examination
      </div>
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
    </div>
  );
}