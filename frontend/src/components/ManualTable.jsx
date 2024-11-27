// import React, { useState } from "react";
// import Dropdownstyle from "../components/Dropdownstyle";
// import SampleTimeTable from "./SampleTimeTable";

// import Table from "react-bootstrap/Table";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";

// export default function ManualTable({ columns }) {
//   const [dateAndTime, setDateAndTime] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [timeSlot, setTimeSlot] = useState("");
//   const [tableData, setTableData] = useState([]);

//   const rows = Array(4).fill(null); // Fixed number of rows

//   // State for dynamically storing selected options and inputs
//   const [rowInputs, setRowInputs] = useState(
//     rows.map(() => ({ morning: {}, evening: {} }))
//   );

//   const selectStartDate = (event) => {
//     const newStartDate = event.target.value;
//     setStartDate(newStartDate);
//     setDateAndTime(newStartDate && timeSlot);
//   };

//   const selectTimeSlot = (event) => {
//     const newTimeSlot = event.target.value;
//     setTimeSlot(newTimeSlot);
//     setDateAndTime(startDate && newTimeSlot);
//   };

//   const isBoth = timeSlot === "Both";

//   const handleRowChange = (rowIndex, time, field, value) => {
//     setRowInputs((prev) => {
//       const updated = [...prev];
//       updated[rowIndex][time][field] = value;
//       return updated;
//     });
//   };

//   const saveAndNext = () => {
//     // Save current inputs into tableData
//     setTableData((prevData) => [...prevData, ...rowInputs]);

//     // Reset rowInputs to its initial state to clear inputs in the table
//     setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));

//     console.log("Saved Table Data: ", rowInputs);
//   };

//   const saveAndFinish = (event) => {
//     event.preventDefault();
//     console.log("Final Data: ", rowInputs);
//   };

//   return (
//     <div>
//       <div>
//         <Form.Group className="mb-3">
//           <Form.Label>Exam Start Date</Form.Label>
//           <Form.Control
//             type="date"
//             value={startDate || ""}
//             onChange={selectStartDate}
//           />
//         </Form.Group>
//         <Form.Group>
//           <Form.Label>Time Slot</Form.Label>
//           <Form.Select value={timeSlot} onChange={selectTimeSlot}>
//             <option value="">Select...</option>
//             <option value="Morning">Morning</option>
//             <option value="Evening">Evening</option>
//             <option value="Both">Both</option>
//           </Form.Select>
//         </Form.Group>
//       </div>
//       {dateAndTime && (
//         <div>
//           <br />
//           <Table
//             striped
//             bordered
//             hover
//             responsive
//             size="md"
//             variant="secondary"
//           >
//             <thead>
//               <tr>
//                 <th colSpan={isBoth ? 2 : 1}>{startDate}</th>
//               </tr>
//               {isBoth ? (
//                 <tr>
//                   <th>Morning</th>
//                   <th>Evening</th>
//                 </tr>
//               ) : (
//                 <tr>
//                   <th>{timeSlot}</th>
//                 </tr>
//               )}
//             </thead>
//             <tbody>
//               {rows.map((_, index) => (
//                 <tr key={index}>
//                   <td>
//                     {isBoth ? (
//                       <Dropdownstyle
//                         id={`morning-${index}`}
//                         courseList={columns}
//                         value={rowInputs[index]?.morning || ""}
//                         onChange={(field, value) =>
//                           handleRowChange(index, "morning", field, value)
//                         }
//                       />
//                     ) : timeSlot === "Morning" ? (
//                       <Dropdownstyle
//                         id={`morning-${index}`}
//                         courseList={columns}
//                         value={rowInputs[index]?.morning || ""}
//                         onChange={(field, value) =>
//                           handleRowChange(index, "morning", field, value)
//                         }
//                       />
//                     ) : (
//                       <Dropdownstyle
//                         id={`evening-${index}`}
//                         courseList={columns}
//                         // value={rowInputs[index]?.evening || ""}
//                         onChange={(field, value) =>
//                           handleRowChange(index, "evening", field, value)
//                         }
//                       />
//                     )}
//                   </td>
//                   {isBoth && (
//                     <td>
//                       <Dropdownstyle
//                         id={`evening-${index}`}
//                         courseList={columns}
//                         // value={rowInputs[index]?.evening || ""}
//                         onChange={(field, value) =>
//                           handleRowChange(index, "evening", field, value)
//                         }
//                       />
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <div className="manualtablebutton">
//             <Button variant="dark" onClick={saveAndNext}>
//               Save
//             </Button>
//             <Button variant="dark" onClick={saveAndFinish}>
//               Finish
//             </Button>
//           </div>
//         </div>
//       )}
//       {tableData.length > 0 && (
//         <div>
//           <h4>Saved Table Data</h4>
//           <SampleTimeTable tableData={tableData} startDate={startDate} timeSlot={timeSlot}/>
//         </div>
//       )}
//     </div>
//   );
// }

//******************************************************************************************* */

import React, { useState } from "react";
import Dropdownstyle from "../components/Dropdownstyle";
import SampleTimeTable from "./SampleTimeTable";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ManualTable({ columns }) {
  const [dateAndTime, setDateAndTime] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  // const [tableData, setTableData] = useState([]);
  const tableData = [];
  const [resetKey, setResetKey] = useState(0); // To force reset of Dropdownstyle

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

  const saveAndNext = () => {
    // setTableData((prevData) => [...prevData, ...rowInputs]);

    // setTableData(rowInputs);

    tableData.push(rowInputs);

    setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));
    setResetKey((prevKey) => prevKey + 1);
    console.log("Saved Table Data: ", tableData);
  };

  const saveAndFinish = (event) => {
    event.preventDefault();
    console.log("Final Data: ", tableData);
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
          <br />
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
                        key={`${resetKey}-morning-${index}`} // Unique key for reset
                        id={`morning-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : timeSlot === "Morning" ? (
                      <Dropdownstyle
                        key={`${resetKey}-morning-${index}`} // Unique key for reset
                        id={`morning-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : (
                      <Dropdownstyle
                        key={`${resetKey}-evening-${index}`} // Unique key for reset
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
                        key={`${resetKey}-evening-${index}`} // Unique key for reset
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
      <div>
        <h4>Saved Table Data</h4>
        {tableData.map((_, index) => (
          <SampleTimeTable
            key={index}
            tableData={tableData[index]}
            startDate={startDate}
            timeSlot={timeSlot}
          />
        ))}
      </div>
    </div>
  );
}
