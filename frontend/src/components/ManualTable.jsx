import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import axios from "axios";

import Dropdownstyle from "../components/Dropdownstyle";
import {
  setSessionData,
  getSessionData,
} from "../utils/storage/sessionStorageUtils";
import { TableContext } from "../utils/Tablecontext";

// import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function ManualTable({ level, semester, buttonClick, onSave }) {
  const { tableData, startDateArray, timeSlotArray, finalData, setFinalData } =
    useContext(TableContext);
  const [dateAndTime, setDateAndTime] = useState(false);

  const [startDate, setStartDate] = useState("");
  const startDateRef = useRef("");
  const [timeSlot, setTimeSlot] = useState("");
  const timeSlotRef = useRef("");
  //************************************ */
  const [coursesData, setCoursesData] = useState([]);
  //************************************ */
  const [groupTableData, setGroupTabledata] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  const rows = Array(4).fill(null);

  const [rowInputs, setRowInputs] = useState(
    rows.map(() => ({ morning: {}, evening: {} }))
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesAttribute = `${level}-${semester}`;
        const response = await axios.get(
          `http://${ipAddress}:5000/studentdata/courses/${coursesAttribute}`
        );
        setCoursesData(response.data.data);
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    };

    if (level && semester && ipAddress) {
      fetchCourses();
    }
  }, [level, semester, ipAddress]);

  const selectStartDate = (event) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    setDateAndTime(newStartDate && timeSlot);
    startDateRef.current = newStartDate;
    // console.log(startDate);
    setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));
    setResetKey((prevKey) => prevKey + 1);
  };

  const selectTimeSlot = (event) => {
    const newTimeSlot = event.target.value;
    setTimeSlot(newTimeSlot);
    setDateAndTime(startDate && newTimeSlot);
    setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));
    setResetKey((prevKey) => prevKey + 1);
    timeSlotRef.current = newTimeSlot;
    // console.log( timeSlotRef.current, startDateRef.current );
    // console.log(timeSlot);
  };

  //************************************************************************************************** */
  const tTarr = useMemo(() => {
    const tT1000 = getSessionData("1000_level");
    const tT2000 = getSessionData("2000_level");
    const tT3000 = getSessionData("3000_level");

    return [tT1000, tT2000, tT3000].filter(
      (entry) =>
        entry !== null &&
        entry !== undefined &&
        !(Array.isArray(entry) && entry.length === 0)
    );
  }, []);

  const checkStartDateAndTimeSlot = (metadata, startDateRef, timeSlotRef) => {
    // Extract the current values from the references
    const startDate = startDateRef?.current;
    const timeSlot = timeSlotRef?.current;

    // Iterate through the main array
    if (metadata.startDate && metadata.timeSlot) {
      // Check if the metadata contains the startDate and timeSlot
      if (metadata.startDate === startDate && metadata.timeSlot === timeSlot) {
        return true;
      }
    }
    return false;
  };

  const processTimetables = useCallback((arr, level, startDate, timeSlot) => {
    let coCodes = [];
    if (arr && Array.isArray(arr)) {
      // Remove `tT${level}` if it exists in the array and create newArr
      const newArr = arr.filter(
        (entry) => !(entry?.level === `${level}_level`)
      );

      // Check if newArr has elements
      if (newArr.length > 0) {
        for (let i = 0; i < newArr.length; i++) {
          // Check if the startDate and timeSlot match in the current entry
          let entry = newArr[i][0];
          // console.log(entry.metadata.startDate);
          if (
            entry.data &&
            checkStartDateAndTimeSlot(entry.metadata, startDate, timeSlot)
          ) {
            console.log(entry.metadata.startDate, entry.metadata.timeSlot);
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
    }
    return coCodes;
  }, []);

  //************************************************************************************************** */

  const isBoth = timeSlot === "Both";

  const concatenatedOptions = useMemo(() => {
    // Get the coCodes from processTimetables
    const coCodes = processTimetables(tTarr, level, startDateRef, timeSlotRef);

    // Concatenate coCodes with rowInputs
    const rowInputOptions = rowInputs
      .flatMap((item) => [
        item.morning?.selectedOption || "N/A",
        item.evening?.selectedOption || "N/A",
      ])
      .filter((item) => item !== "N/A" && item !== "NULL");

    // Combine and return as a single string
    return [...rowInputOptions, ...coCodes].join(",");
  }, [tTarr, level, rowInputs, processTimetables]);

  const cleanRowInputs = (inputs) =>
    inputs.map((row) => ({
      morning: {
        ...row.morning,
        selectedOption:
          row.morning?.selectedOption === "NUL"
            ? null
            : row.morning?.selectedOption,
      },
      evening: {
        ...row.evening,
        selectedOption:
          row.evening?.selectedOption === "NUL"
            ? null
            : row.evening?.selectedOption,
      },
    }));

  const handleRowChange = (rowIndex, time, field, value) => {
    setRowInputs((prev) => {
      const updated = [...prev];
      updated[rowIndex][time][field] = value;
      return updated;
    });
  };

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
      const updatedRowInputs = cleanRowInputs(rowInputs);

      //************************************************ */
      const newStartDateArray = [...startDateArray, startDate];
      const newTimeSlotArray = [...timeSlotArray, timeSlot];
      const newTableData = [
        ...(Array.isArray(tableData) ? tableData : []),
        ...updatedRowInputs,
      ];
      const newGroupTableData = groupData(newTableData, 4);
      //*************************************************/

      //these function must be run sequentially
      setGroupTabledata(groupData(newTableData, 4));
      setFinalData((prev) => {
        const updated = {
          metadata: { startDate: startDate, timeSlot: timeSlot },
          data: updatedRowInputs,
        };
        return [...prev, updated];
      });
      console.log(typeof groupTableData);
      setRowInputs(rows.map(() => ({ morning: {}, evening: {} })));

      if (typeof onSave === "function") {
        onSave(newGroupTableData, newStartDateArray, newTimeSlotArray);
      }

      setResetKey((prevKey) => prevKey + 1);
      console.log("Saved Table Data: ", tableData);
      console.log("Saved Final Data: ", finalData);
    }
  };

  const saveAndFinish = (event) => {
    event.preventDefault();
    if (Array.isArray(finalData) && finalData.length > 0) {
      setSessionData(`${level}_level`, finalData);
      console.log("Final Data: ", finalData);
    }
  };

  useEffect(() => {
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
            {/* <option value="Both">Both</option> */}
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
            <MDBTableHead>
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
            </MDBTableHead>
            <MDBTableBody>
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
            </MDBTableBody>
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
