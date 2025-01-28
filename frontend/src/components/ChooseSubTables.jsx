import React, { useMemo, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

import { Modal } from "react-bootstrap";

import { timeTableCom } from "./ChooseTables";
import CustomizeTable from "../components/CutomizeTable";

const ChooseSubTables = ({ timetable }) => {
  const { showComponent, setShowComponent } = useContext(timeTableCom);

  const formattedTimetable = useMemo(
    () =>
      timetable.map((subjectArray, index) => ({
        id: uuidv4(),
        Date: `Date${index + 1}`,
        Subjects: subjectArray,
      })),
    [timetable]
  );

  const handleClose = () => {
    setShowComponent(false);
  };

  return (
    <Modal
      show={showComponent}
      onHide={handleClose}
      size="lg"
      centered
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Time Table</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <div className="table-responsive w-100">
          <CustomizeTable rows={formattedTimetable} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChooseSubTables;
