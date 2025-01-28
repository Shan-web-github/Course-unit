import { useState, useCallback } from "react";

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

  return (
    <div>
      {data.map((row, index) => (
        <TableRow key={row.id} index={index} {...row} moveRow={moveRow} collectSubjects={collectSubjects} />
      ))}
    </div>
  );
}
