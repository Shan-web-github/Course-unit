import React, { useContext } from "react";

import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import { Modal } from "react-bootstrap";

import { timeTableCom } from "./ChooseTables";

export default function ChooseSubTables({ timetable }) {
  const { showComponent, setShowComponent } = useContext(timeTableCom);

  const handleClose = () => {
    setShowComponent(false);
  };

  return (
    <Modal show={showComponent} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Time Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MDBTable
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
                      {subjectIndex < subjectArray.length - 1 && ", "}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </Modal.Body>
    </Modal>
  );
}
