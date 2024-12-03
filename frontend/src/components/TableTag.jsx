import React, { useState, useMemo } from "react";
import debounce from "lodash.debounce";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function TableTag({ columns, rows }) {
  const columnDefs = columns.map((col) => ({
    headerName: col,
    field: col.toLowerCase(),
  }));

  const data = rows.map((row) =>
    columnDefs.reduce((newRow, { field }) => {
      const originalKey = Object.keys(row).find((key) => key.toLowerCase() === field); 
      if (originalKey) {
        newRow[field] = row[originalKey]; 
      }
      return newRow;
    }, {})
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        const filtered = data.filter((row) =>
          Object.entries(row).some(
            ([key, value]) =>
              value &&
              value.toString().toLowerCase().includes(query.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }, 300),
    [data]
  );

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: "10px", padding: "8px", width: "300px" }}
      />
      <AgGridReact
        rowData={filteredData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize= '10'
        paginationPageSizeSelector={[10, 20, 30, 50]}
      />
    </div>
  );
}

