import React, {useState, createContext} from 'react'

export const TableContext = createContext();

export const TableProvider = ({children}) => {
    const [tableData, setTableData] = useState("");
  return (
    <TableContext.Provider value={{tableData, setTableData}}>
        {children}
    </TableContext.Provider>
  )
}
