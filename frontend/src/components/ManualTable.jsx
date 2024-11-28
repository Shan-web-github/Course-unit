import React, { useState } from "react";
import Dropdownstyle from "../components/Dropdownstyle";
import SampleTimeTable from "./SampleTimeTable";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ManualTable({ columns }) {
  const [dateAndTime, setDateAndTime] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [startDateArray, setStartDateArray] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [timeSlotArray, setTimeSlotArray] = useState([]);

  const [tableData, setTableData] = useState("");
  const [groupTableData,setGroupTabledata] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  const rows = Array(4).fill(null); 

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

  const groupData = (data, batchSize) =>{
      const result = [];
      for (let i = 0; i < data.length; i += batchSize) {
        result.push(data.slice(i, i + batchSize));
      }
      return result; 
  };

  const saveAndNext = () => {

    const newData = [...tableData, ...rowInputs];

    setStartDateArray((pre) => [...pre, startDate]);
    setTimeSlotArray((pre) => [...pre, timeSlot]);

    setTableData(newData);
    setGroupTabledata(groupData(newData,4));
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
                        key={`${resetKey}-morning-${index}`} 
                        id={`morning-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : timeSlot === "Morning" ? (
                      <Dropdownstyle
                        key={`${resetKey}-morning-${index}`} 
                        id={`morning-${index}`}
                        courseList={columns}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : (
                      <Dropdownstyle
                        key={`${resetKey}-evening-${index}`} 
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
                        key={`${resetKey}-evening-${index}`} 
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
        {groupTableData.map((data, index) => (
          <SampleTimeTable
            key={index}
            tableData={data}
            startDate={startDateArray[index]}
            timeSlot={timeSlotArray[index]}
          />
        ))}
      </div>
    </div>
  );
}
