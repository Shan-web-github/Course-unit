// import React,{useEffect} from "react";

// import DataTable from 'datatables.net-dt';
// import 'datatables.net-responsive-dt';


// export default function TableTag({ columns, rows }) {
//     const data = Object.values(rows);

//     useEffect(() => {
//       const table = new DataTable('#myTable', {
//         responsive: true,
//         paging: true, 
//         searching: true, 
//         ordering: true,
//         lengthChange: false, 
//         info: false, 
//       });
  
//       return () => {
//         table.destroy();
//       };
//     }, []);

//   return (
//     <div>
//       <table id="myTable" >
//         <thead>
//           <tr>
//             {columns.map((col, index) => (
//               <th key={index}>{col}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col, colIndex) => (
//                 <td key={colIndex}>{row[col]}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function TableTag({ columns, rows }){
  const data = Object.values(rows);
  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        rowData={data}
        columnDefs={columns}
        pagination={true}
      />
    </div>
  );
};
