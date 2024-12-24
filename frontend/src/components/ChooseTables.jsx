import React from "react";

import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";

export default function ChooseTables({timetable, timetableIndex}) {
  return (
    <MDBTable
      key={timetableIndex}
      className="mb-4 table table-bordered rounded overflow-hidden"
      bordered
      hover
      responsive
      variant="light"
    >
      <MDBTableHead>
        <tr>
          <th>Date</th>
          <th>Subjects</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {timetable.map((subjectArray, arrayIndex) => (
          <tr key={arrayIndex}>
            <td>Day {arrayIndex + 1}</td>
            <td>
              {subjectArray.map((subject_id, subjectIndex) => (
                <span key={subjectIndex}>
                  {subject_id}
                  {", "}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
