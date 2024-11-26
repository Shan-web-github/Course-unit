import React, { useState } from "react";
import Dropdownstyle from "../components/Dropdownstyle";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ManualTable({ columns }) {
  const [dateAndTime, setDateAndTime] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [tableData, setTableData] = useState([]);

  const rows = Array(4).fill(null); // Fixed number of rows

  // State for dynamically storing selected options and inputs
  const [rowInputs, setRowInputs] = useState(
    rows.map(() => ({ morning: {}, evening: {} }))
  );

  const selectStartDate = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    setDateAndTime(newStartDate && timeSlot);
  };

  const selectTimeSlot = (event) => {
    const newTimeSlot = event.target.value;
    setTimeSlot(newTimeSlot);
    setDateAndTime(startDate && newTimeSlot);
  };

  const isBoth = timeSlot === "Both";

  const handleRowChange = (rowIndex, time, field, value) => {
    setRowInputs((prev) => {
      const updated = [...prev];
      updated[rowIndex][time][field] = value;
      return updated;
    });
  };

  const saveAndNext = (event) => {
    event.preventDefault();
    setTableData(rowInputs);
    console.log(rowInputs);
    console.log("Saved Table Data: ", rowInputs);
  };

  const saveAndFinish = (event) => {
    event.preventDefault();
    console.log("Final Data: ", rowInputs);
  };

  return (
    <div>
      <div>
        <Form.Group className="mb-3">
          <Form.Label>Exam Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate || ""}
            onChange={selectStartDate}
          />
        </Form.Group>
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
      {dateAndTime && (
        <div>
          <Table
            striped
            bordered
            hover
            responsive
            size="md"
            variant="secondary"
          >
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
                    {isBoth ? (
                      <Dropdownstyle
                        id={`morning-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : timeSlot === "Morning" ? (
                      <Dropdownstyle
                        id={`morning-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : (
                      <Dropdownstyle
                        id={`evening-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "evening", field, value)
                        }
                      />
                    )}
                  </td>
                  {isBoth && (
                    <td>
                      <Dropdownstyle
                        id={`evening-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "evening", field, value)
                        }
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="manualtablebutton">
            <Button variant="dark" onClick={saveAndNext}>
              Save
            </Button>
            <Button variant="dark" onClick={saveAndFinish}>
              Finish
            </Button>
          </div>
        </div>
      )}
      {tableData.length > 0 && (
        <div>
          <h4>Saved Table Data</h4>
          <pre>{JSON.stringify(tableData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

//************************************************************* */
// import React, { useState } from "react";
// import Dropdownstyle from "../components/Dropdownstyle";

// import Table from "react-bootstrap/Table";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";

// export default function ManualTable({ columns }) {
//   const [dateAndTime, setDateAndTime] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [timeSlot, setTimeSlot] = useState("");
//   const [tableData, setTableData] = useState([]);

//   const selectStartDate = (event) => {
//     const newStartDate = event.target.value;
//     setStartDate(newStartDate);

//     if (newStartDate && timeSlot) {
//       setDateAndTime(true);
//     } else {
//       setDateAndTime(false);
//     }
//   };

//   const selectTimeSlot = (event) => {
//     const newTimeSlot = event.target.value;
//     setTimeSlot(newTimeSlot);

//     if (startDate && newTimeSlot) {
//       setDateAndTime(true);
//     } else {
//       setDateAndTime(false);
//     }
//   };

//   const checkBoth = () => timeSlot === "Both";

//   const isBoth = checkBoth();
//   const rows = Array(4).fill(null);

//   const saveAndNext = (event) => {
//     event.preventDefault();
//     const data = rows.map((_, index) => {
//       const morningCourse = document.getElementById(
//         `column1-${index}`
//       )?.selectedOption;
//       const eveningCourse = document.getElementById(
//         `column2-${index}`
//       )?.selectedOption;

//       const morningText = document.getElementById(
//         `column1-${index}`
//       )?.inputTime;
//       const eveningText = document.getElementById(
//         `column2-${index}`
//       )?.inputTime;

//       return isBoth
//         ? { morningCourse, morningText, eveningCourse, eveningText }
//         : {
//             course: morningCourse || eveningCourse,
//             text: morningText || eveningText,
//           };
//     });

//     setTableData(data);
//     console.log(data);
//   };

//   const saveAndFinish = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <div>
//       <div>
//         <div>
//           {/* {level} Level {semester} Semester End Examination */}
//           <br />
//         </div>
//         <div className="manualtablediv">
//           <div>
//             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//               <Form.Label>Exam Start date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={startDate || ""}
//                 onChange={selectStartDate}
//               />
//             </Form.Group>
//           </div>
//           <div>
//             <Form.Group>
//               <Form.Label>Time Slot</Form.Label>
//               <Form.Select value={timeSlot} onChange={selectTimeSlot}>
//                 <option value="">Select...</option>
//                 <option value="Morning">Morning</option>
//                 <option value="Evening">Evening</option>
//                 <option value="Both">Both</option>
//               </Form.Select>
//             </Form.Group>
//           </div>
//         </div>
//       </div>
//       {dateAndTime && (
//         <div>
//           <div>
//             <Table
//               striped
//               bordered
//               hover
//               responsive
//               size="md"
//               variant="secondary"
//             >
//               <thead>
//                 <tr>
//                   <th colSpan={isBoth ? 2 : 1}>{startDate}</th>
//                 </tr>
//                 {isBoth ? (
//                   <tr>
//                     <th>Morning</th>
//                     <th>Evening</th>
//                   </tr>
//                 ) : (
//                   <tr>
//                     <th>{timeSlot}</th>
//                   </tr>
//                 )}
//               </thead>
//               <tbody>
//                 {rows.map((_, index) => (
//                   <tr key={index}>
//                     <td>
//                       <Dropdownstyle
//                         courseList={columns}
//                         id={`column1-${index}`}
//                       />
//                     </td>
//                     {isBoth && (
//                       <td>
//                         <Dropdownstyle
//                           courseList={columns}
//                           id={`column2-${index}`}
//                         />
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           <div className="manualtablebutton">
//             <Button variant="dark" type="submit" onClick={saveAndNext}>
//               Save
//             </Button>
//             <Button variant="dark" type="submit" onClick={saveAndFinish}>
//               Finish
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
