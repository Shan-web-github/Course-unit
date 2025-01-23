import React, { createContext, useState } from "react";

import ChooseSubTables from "./ChooseSubTables";

import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import { Button } from "react-bootstrap";

export const timeTableCom = createContext();

export default function ChooseTables({ timetable, timetableIndex }) {
  const [showComponent, setShowComponent] = useState(false);
  return (
    <div>
      <div>
        <MDBTable
          key={timetableIndex}
          className="mb-2 table table-bordered rounded overflow-hidden"
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
                      {subjectIndex < subjectArray.length - 1 && ", "}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </div>
      <div className="d-flex justify-content-end">
        <Button onClick={() => setShowComponent(true)}>Continue</Button>
      </div>
      <div>
        <timeTableCom.Provider
          value={{ showComponent, setShowComponent }}
        >
          <ChooseSubTables timetable={timetable}/>
        </timeTableCom.Provider>
      </div>
    </div>
  );
}
