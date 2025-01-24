// import React, { useMemo, useContext } from "react";

// // import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
// import { Modal } from "react-bootstrap";
// import { timeTableCom } from "./ChooseTables";

// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import {
//   ClientSideRowModelModule,
//   ModuleRegistry,
//   NumberFilterModule,
//   RowDragModule,
//   TextFilterModule,
//   ValidationModule,
// } from "ag-grid-community";
// ModuleRegistry.registerModules([
//   TextFilterModule,
//   NumberFilterModule,
//   RowDragModule,
//   ClientSideRowModelModule,
//   ValidationModule /* Development Only */,
// ]);

// export default function ChooseSubTables({ timetable }) {
//   const { showComponent, setShowComponent } = useContext(timeTableCom);

//   const columnDefs = [{ field: "Date", rowDrag: true }, { field: "Subjects" , resizable: true  }];

//   const formattedTimetable = useMemo(() =>
//     timetable.map((subjectArray, index) => ({
//       Date: `Date${index + 1}`,
//       Subjects: subjectArray
//     })),
//   [timetable]);

//   const onGridReady = (params) => {
//     params.api.sizeColumnsToFit();
//   };

//   const defaultColDef = useMemo(() => {
//     return {
//       width: 170,
//       filter: false,
//       resizable: false
//     };
//   }, []);

//   const handleClose = () => {
//     setShowComponent(false);
//   };

//   return (
//     <Modal show={showComponent} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title className="fw-bold">Time Table</Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="d-flex justify-content-center">
//         <div className="ag-theme-alpine"
//         style={{ height: "400px", width: "500px" }}>
//           <AgGridReact
//             rowData={formattedTimetable}
//             columnDefs={columnDefs}
//             defaultColDef={defaultColDef}
//             rowDragManaged={true}
//             onGridReady={onGridReady}
//           />
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }

import React, { useMemo, useContext } from "react";
import { v4 as uuidv4 } from 'uuid';

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
    <Modal show={showComponent} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Time Table</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
          <CustomizeTable rows={formattedTimetable} />
      </Modal.Body>
    </Modal>
  );
};

export default ChooseSubTables;
