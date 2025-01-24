import { useState } from "react";

import TableRow from "../components/TableRow";

export default function CustomizeTable({ rows }) {
  const [data, setData] = useState(rows);

  const moveRow = (dragIndex, hoverIndex) => {
    setData((prevData) => {
      const newData = [...prevData];
      const [draggedRow] = newData.splice(dragIndex, 1);
      newData.splice(hoverIndex, 0, draggedRow);
      return newData; 
    });
  };
  

  return (
    <div>
      {data.map((row, index) => (
        <TableRow key={row.id} index={index} {...row} moveRow={moveRow} />
      ))}
    </div>
  );
}
