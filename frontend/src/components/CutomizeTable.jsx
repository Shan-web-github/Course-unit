import { useState, useCallback } from "react";
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

  const fixTimeTable = (schedule) => {
    let validDatesSet1 = [];
    let validDatesSet2 = [];

    for (let date in schedule) {
      let day = schedule[date];

      // Ensure both morning and evening sessions exist
      if (!day.morning || !day.evening) continue;

      let level1 = day.morning.level1 || day.evening.level1 || [];
      let level2 = day.evening.level2 || day.morning.level2 || [];
      let level3 = day.morning.level3 || day.evening.level3 || [];

      if (0 < level1.length + level3.length && level1.length + level3.length < 4) {
        validDatesSet1.push({ date, level1, level3 });
      }

      if (0 < level2.length && level2.length < 4) {
        validDatesSet2.push({ date, level2 });
      }
    }

    return { validDatesSet1, validDatesSet2 };
  };

  console.log(
    "Selected subjects Collection:",
    fixTimeTable(subjectsCollection)
  );

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
