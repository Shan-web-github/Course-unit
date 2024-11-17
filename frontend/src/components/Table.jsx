import React from "react";

import Table from 'react-bootstrap/Table';

export default function TableTag({ columns, rows }) {
    const data = Object.values(rows);
  return (
    <div>
      <Table responsive striped bordered hover size="md" variant="secondary">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
