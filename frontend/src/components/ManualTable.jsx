import React, { useState, useEffect, useMemo } from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import axios from "axios";

import Dropdownstyle from "../components/Dropdownstyle";
import {
  setSessionData,
  getSessionData,
} from "../utils/storage/sessionStorageUtils";

// import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ManualTable({ level, semester, buttonClick, onSave }) {
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

  const rows = Array(4).fill(null);

  const [rowInputs, setRowInputs] = useState(
    rows.map(() => ({ morning: {}, evening: {} }))
  );

  const [finalData, setFinalData] = useState([]);

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
      setResetKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  };

  const selectTimeSlot = (event) => {
    const newTimeSlot = event.target.value;
    setTimeSlot(newTimeSlot);
    setDateAndTime(startDate && newTimeSlot);
    setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));
    setResetKey((prevKey) => prevKey + 1);
    console.log(tTarr);
  };

  //************************************************************************************************** */
  const tT1000 = getSessionData(`1000_level`);
  const tT2000 = getSessionData(`2000_level`);
  const tT3000 = getSessionData(`3000_level`);

  const tTarr = [tT1000, tT2000, tT3000];

  const checkStartDateAndTimeSlot = (data, startDate, timeSlot) => {
    // Iterate through the main array
    for (let entry of data) {
      if (entry && entry.metadata) {
        // Check if the metadata contains the startDate and timeSlot
        if (
          entry.metadata.startDate === startDate &&
          entry.metadata.timeSlot === timeSlot
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const processTimetables = (arr, level, startDate, timeSlot) => {
    if (arr && Array.isArray(arr)) {
      const coCodes = [];

      // Remove `tT${level}` if it exists in the array and create newArr
      const newArr = arr.filter(
        (entry) => !(entry?.level === `${level}_level`)
      );

      // Check if newArr has elements
      if (newArr.length > 0) {
        for (const entry of newArr) {
          // Check if the startDate and timeSlot match in the current entry
          if (
            entry?.data &&
            checkStartDateAndTimeSlot(entry.data, startDate, timeSlot)
          ) {
            // Collect coCodes from morning and evening schedules
            for (let schedule of entry.data) {
              if (schedule.morning?.selectedOption) {
                coCodes.push(schedule.morning.selectedOption);
              }
              if (schedule.evening?.selectedOption) {
                coCodes.push(schedule.evening.selectedOption);
              }
            }
          }
        }
      }

      // Return concatenated options with coCodes
      return [...coCodes].join(",");
    }
  };

  //************************************************************************************************** */

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

  let newConcatenatedOptions= [];

  useEffect(() => {
    newConcatenatedOptions = processTimetables(tTarr, level, startDate, timeSlot);
  }, [tTarr, level, startDate, timeSlot]);

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

      //************************************************ */
      const newStartDateArray = [...startDateArray, startDate];
      const newTimeSlotArray = [...timeSlotArray, timeSlot];
      const newTableData = [...tableData, ...rowInputs];
      const newGroupTableData = groupData(newTableData, 4);
      //*************************************************/

      //these function must be run sequentially
      const newData = [...tableData, ...rowInputs];
      setTableData(newData);
      setGroupTabledata(groupData(newData, 4));
      setFinalData((prev) => {
        const updated = {
          metadata: { startDate: startDate, timeSlot: timeSlot },
          data: rowInputs,
        };
        return [...prev, updated];
      });
      console.log(typeof groupTableData);
      console.log(typeof tableData);
      console.log(typeof finalData);
      setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));

      if (typeof onSave === "function") {
        // onSave(groupTableData, startDateArray, timeSlotArray);
        onSave(newGroupTableData, newStartDateArray, newTimeSlotArray);
      }

      setResetKey((prevKey) => prevKey + 1);
      console.log("Saved Table Data: ", tableData);
      console.log("Saved Final Data: ", finalData);
    }
  };

  const saveAndFinish = (event) => {
    event.preventDefault();
    console.log("Final Data: ", tableData);
    setSessionData(`${level}_level`, finalData);
    console.log(finalData);
  };

  useEffect(() => {
    // setColumns([]);
    setResetKey(0);
  }, [buttonClick]);

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
          <MDBTable
            bordered
            hover
            responsive
            variant="light"
            className="table table-bordered rounded overflow-hidden"
          >
            {/* <Table
            bordered
            hover
            responsive
            size="md"
            variant="light"
            className="table table-bordered rounded overflow-hidden"
          > */}
            <MDBTableHead>
              {/* <thead> */}
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
              {/* </thead> */}
            </MDBTableHead>
            <MDBTableBody>
              {/* <tbody> */}
              {rows.map((_, index) => (
                <tr key={index}>
                  <td>
                    {isBoth ? (
                      <Dropdownstyle
                        key={`${resetKey}-morning-${index}`}
                        id={`morning-${index}`}
                        courseList={coursesData}
                        concatenatedOptions={newConcatenatedOptions}
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
                        concatenatedOptions={newConcatenatedOptions}
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
                        concatenatedOptions={newConcatenatedOptions}
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
                        concatenatedOptions={newConcatenatedOptions}
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
              {/* </tbody> */}
            </MDBTableBody>
            {/* </Table> */}
          </MDBTable>
          <div className="manualtablebutton">
            <Button variant="primary" onClick={saveAndNext}>
              Save
            </Button>
            <Button variant="dark" onClick={saveAndFinish}>
              Finish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
