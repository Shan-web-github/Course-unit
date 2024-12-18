import React from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";

// import Table from "react-bootstrap/Table";

export default function SampleTimeTable({ tableData, startDate, timeSlot }) {
  const rows = Array(4).fill(null);

  const isBoth = timeSlot === "Both";

  const morningOptions = tableData.map(
    (item) => item.morning?.selectedOption || "N/A"
  );

  const morningTime = tableData.map((item) => item.morning?.inputTime || "N/A");

  const eveningOptions = tableData.map(
    (item) => item.evening?.selectedOption || "N/A"
  );

  const eveningTime = tableData.map((item) => item.evening?.inputTime || "N/A");

  return (
    <MDBTable
      bordered
      hover
      responsive
      variant="light"
      className="table table-bordered rounded overflow-hidden"
    >
      {/* <Table striped bordered hover responsive size="md" variant="light"> */}
      <MDBTableHead>
        {/* <thead> */}
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
        {/* </thead> */}
      </MDBTableHead>
      <MDBTableBody>
        {/* <tbody> */}
        {rows.map(
          (_, index) =>
            (morningOptions[index] !== "N/A" ||
              eveningOptions[index] !== "N/A") && (
              <tr key={index}>
                <td>
                  {isBoth ? (
                    <span>
                      {morningOptions[index]} -{morningTime[index]}
                    </span>
                  ) : timeSlot === "Morning" ? (
                    <span>
                      {morningOptions[index]} -{morningTime[index]}
                    </span>
                  ) : (
                    <span>
                      {eveningOptions[index]} -{eveningTime[index]}
                    </span>
                  )}
                </td>
                {isBoth && (
                  <td>
                    <span>
                      {eveningOptions[index]} -{eveningTime[index]}
                    </span>
                  </td>
                )}
              </tr>
            )
        )}
        {/* </tbody> */}
      </MDBTableBody>
      {/* </Table> */}
    </MDBTable>
  );
}
