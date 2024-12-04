import React, { useState, useMemo } from "react";
import debounce from "lodash.debounce";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function TableTag({ columns, rows }) {
  const columnDefs = columns.map((col) => ({
    headerName: col,
    field: col.toLowerCase(),
    autoHeight: true,
  }));

  const data = rows.map((row) =>
    columnDefs.reduce((newRow, { field }) => {
      const originalKey = Object.keys(row).find(
        (key) => key.toLowerCase() === field
      );
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

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <br />
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          marginBottom: "15px",
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      />
      <AgGridReact
        rowData={filteredData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        pagination={true}
        paginationPageSize={10}
        paginationAutoPageSize={true}
        rowStyle={{ fontSize: "14px" }}
        enableRtlSupport={true}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
        }}
        rowClassRules={{
          "row-stripe": (params) => params.node.rowIndex % 2 === 0,
          "high-priority": (params) => params.data.priority === "high",
        }}
        rowSelection="multiple"
      />
    </div>
  );
}
