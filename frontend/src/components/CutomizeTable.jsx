import { useState, useCallback } from "react";
import axios from "axios";

import { Button } from "react-bootstrap";

import TableRow from "../components/TableRow";

export default function CustomizeTable({ rows }) {
  const [data, setData] = useState(rows);
  const [subjectsCollection, setSubjectsCollection] = useState({});

  const moveRow = (dragIndex, hoverIndex) => {
    setData((prevData) => {
      const newData = [...prevData];
      const [draggedRow] = newData.splice(dragIndex, 1);
      newData.splice(hoverIndex, 0, draggedRow);
      return newData;
    });
  };

  const collectSubjects = useCallback((date, subjects) => {
    setSubjectsCollection((prev) => ({
      ...prev,
      [date]: subjects,
    }));
  }, []);

  console.log("Subjects Collection:", subjectsCollection);
  const ipAddress = process.env.REACT_APP_IPADDRESS;

  const fixTimeTable = async () => {
    try {
      for (const [date, schedule] of Object.entries(subjectsCollection)) {
        await axios.post(`http://${ipAddress}:5000/studentdata/save-schedule`, {
          date,
          schedule,
        });
      }
      alert("Timetable saved successfully!");
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  }


  return (
    <div>
      <div>
        {data.map((row, index) => (
          <TableRow
            key={row.id}
            index={index}
            {...row}
            moveRow={moveRow}
            collectSubjects={collectSubjects}
          />
        ))}
      </div>
      <div className="d-flex justify-content-end me-2">
        <Button variant="secondary" onClick={fixTimeTable}>
          Save
        </Button>
      </div>
    </div>
  );
}
