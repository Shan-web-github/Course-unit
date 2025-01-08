import React, {useState, createContext} from 'react'

export const TableContext = createContext();

export const TableProvider = ({children}) => {
    const [tableData, setTableData] = useState([]);
    const [startDateArray, setStartDateArray] = useState([]);
    const [timeSlotArray, setTimeSlotArray] = useState([]);
    const [finalData, setFinalData] = useState([]);

  return (
    <TableContext.Provider value={{tableData, setTableData, startDateArray, setStartDateArray, timeSlotArray, setTimeSlotArray, finalData, setFinalData}}>
        {children}
    </TableContext.Provider>
  )
}
