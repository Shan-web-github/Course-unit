import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import Dropdownstyle from "../components/Dropdownstyle";
import SampleTimeTable from "./SampleTimeTable";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ManualTable({ level, semester, buttonClick }) {
  const [dateAndTime, setDateAndTime] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [startDateArray, setStartDateArray] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [timeSlotArray, setTimeSlotArray] = useState([]);
  //************************************ */
  const [coursesData, setCoursesData] = useState([]);
  //************************************ */
  const [tableData, setTableData] = useState("");
  const [groupTableData, setGroupTabledata] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  // const handleSaveData = (groupData, startDates, timeSlots) => {
  //   setGroupTableData(groupData);
  //   setStartDateArray(startDates);
  //   setTimeSlotArray(timeSlots);
  // };

  const rows = Array(4).fill(null);

  const [rowInputs, setRowInputs] = useState(
    rows.map(() => ({ morning: {}, evening: {} }))
  );

  const [finalData, setFinalData] = useState([{ metadata: {}, data: {} }]);

  const selectStartDate = async (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    setDateAndTime(newStartDate && timeSlot);
    try {
      const coursesAttribute = `${level}-${semester}`;
      const courses = await axios.get(
        `http://localhost:5000/studentdata/courses/${coursesAttribute}`
      );
      alert("Successfully continued");

      setCoursesData(courses.data.data);
      console.log("Courses data :", courses.data.data);
      setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  };

  const selectTimeSlot = (event) => {
    const newTimeSlot = event.target.value;
    setTimeSlot(newTimeSlot);
    setDateAndTime(startDate && newTimeSlot);
    setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));
    // const courseCodes = coursesData.map((course) => course.CO_CODE);
    // setColumns(coursesData);
  };

  const isBoth = timeSlot === "Both";

  const concatenatedOptions = useMemo(() => {
    return rowInputs
      .flatMap((item) => [
        item.morning?.selectedOption || "N/A",
        item.evening?.selectedOption || "N/A",
      ])
      .filter((item) => item !== "N/A")
      .join(",");
  }, [rowInputs]);

  const handleRowChange = (rowIndex, time, field, value) => {
    setRowInputs((prev) => {
      const updated = [...prev];
      updated[rowIndex][time][field] = value;
      return updated;
    });
  };

  /*************************************************

  const morningOptions = rowInputs.map(
    (item) => item.morning?.selectedOption || "N/A"
  );

  const eveningOptions = rowInputs.map(
    (item) => item.evening?.selectedOption || "N/A"
  );

  /************************************************* */

  const groupData = (data, batchSize) => {
    const result = [];
    for (let i = 0; i < data.length; i += batchSize) {
      result.push(data.slice(i, i + batchSize));
    }
    return result;
  };

  const saveAndNext = () => {
    if (concatenatedOptions.length === 0) {
      alert("Select subjects");
    } else {
      setStartDateArray((pre) => [...pre, startDate]);
      setTimeSlotArray((pre) => [...pre, timeSlot]);

      //these function must be run sequentially
      const newData = [...tableData, ...rowInputs];
      setTableData(newData);
      setGroupTabledata(groupData(newData, 4));
      setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));

      setResetKey((prevKey) => prevKey + 1);
      console.log("Saved Table Data: ", tableData);
      console.log("Saved Final Data: ", finalData);
    }
  };

  const saveAndFinish = (event) => {
    event.preventDefault();
    console.log("Final Data: ", tableData);
  };

  useEffect(() => {
    // setColumns([]);
    setResetKey(0);
  }, [buttonClick]);

  useEffect(() => {
    setFinalData((prev) => {
      const updated = [...prev];
      updated[resetKey] = {
        metadata: startDate,
        data: tableData,
      };
      return updated;
    });
  }, [tableData, startDate, resetKey]);

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
                        courseList={coursesData}
                        concatenatedOptions={concatenatedOptions}
                        selectedSubjects={tableData}
                        semester={semester}
                        level={level}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : timeSlot === "Morning" ? (
                      <Dropdownstyle
                        key={`${resetKey}-morning-${index}`}
                        id={`morning-${index}`}
                        courseList={coursesData}
                        concatenatedOptions={concatenatedOptions}
                        selectedSubjects={tableData}
                        semester={semester}
                        level={level}
                        onChange={(field, value) =>
                          handleRowChange(index, "morning", field, value)
                        }
                      />
                    ) : (
                      <Dropdownstyle
                        key={`${resetKey}-evening-${index}`}
                        id={`evening-${index}`}
                        courseList={coursesData}
                        concatenatedOptions={concatenatedOptions}
                        selectedSubjects={tableData}
                        semester={semester}
                        level={level}
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
                        courseList={coursesData}
                        concatenatedOptions={concatenatedOptions}
                        selectedSubjects={tableData}
                        semester={semester}
                        level={level}
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
