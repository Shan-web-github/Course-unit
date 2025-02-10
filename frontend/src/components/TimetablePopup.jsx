import React, { useContext } from "react";

import { removeSessionData } from "../utils/storage/sessionStorageUtils";
import { popUpdata } from "./Navbar";

import { Modal, Button, Table } from "react-bootstrap";

export default function TimetablePopup({ timetableData = [], level }) {
  const {show, setShow} = useContext(popUpdata);


  if (!Array.isArray(timetableData) || timetableData.length === 0) {
    return <p>No timetable data available for level {level}.</p>;
  }

  const handleClose = () => setShow(false);
  const removeTable = () => {
    removeSessionData(`${level}_level`);
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{level}Level Timetable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {timetableData.map((entry, index) => (
            <div key={index} className="mb-4">
              {entry.metadata !== null && (
                <div>
                  <h5>Date: {entry.metadata.startDate}</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Subject</th>
                      </tr>
                    </thead>
                    {entry.metadata.timeSlot === "Both" ? (
                      <tbody>
                        {entry.data.map((session, index) => (
                          <tr key={index - "morning"}>
                            {index === 0 && (
                              <td rowSpan={entry.data.length}>Morning</td>
                            )}

                            {session?.morning?.selectedOption && (
                              <td>
                                {session?.morning?.selectedOption} -{" "}
                                {session?.morning?.inputTime}
                              </td>
                            )}
                          </tr>
                        ))}
                        {entry.data.map((session, index) => (
                          <tr key={index - "evening"}>
                            {index === 0 && (
                              <td rowSpan={entry.data.length}>Evening</td>
                            )}
                            {session?.evening?.selectedOption && (
                              <td>
                                {session?.evening?.selectedOption} -{" "}
                                {session?.evening?.inputTime}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {entry.data.map((session, index) => (
                          <tr key={index}>
                            {index === 0 && (
                              <td rowSpan={entry.data.length}>
                                {entry.data[0]?.morning?.selectedOption
                                  ? "Morning"
                                  : "Evening"}
                              </td>
                            )}
                            {(session?.morning?.selectedOption ||
                              session?.evening?.selectedOption) && (
                              <td>
                                {session?.morning?.selectedOption ||
                                  session?.evening?.selectedOption}{" "}
                                -{" "}
                                {session?.morning?.inputTime ||
                                  session?.evening?.inputTime}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </Table>
                </div>
              )}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={removeTable}>
            Remove Data
          </Button>
          <Button variant="warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
