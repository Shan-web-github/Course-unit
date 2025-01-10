import React, {useState, useMemo, createContext} from 'react'

export const TableContext = createContext();

export const TableProvider = ({children}) => {
    const [finalData, setFinalData] = useState([]);

  //********************************************************************************** */
  //finalData Handling
  const { startDateArray, timeSlotArray, tableData } = useMemo(() => {
    // Filter out invalid or empty entries
    const validEntries = finalData.filter(
      (item) =>
        item.metadata?.startDate &&
        item.metadata?.timeSlot &&
        Array.isArray(item.data) &&
        item.data.length > 0
    );

    // Extract attributes from valid entries
    const startDateArray = validEntries.map((item) => item.metadata.startDate);
    const timeSlotArray = validEntries.map((item) => item.metadata.timeSlot);
    const tableData = validEntries.flatMap((item) => item.data);

    return { startDateArray, timeSlotArray, tableData };
  }, [finalData]);

  //********************************************************************************* */

  return (
    <TableContext.Provider value={{tableData, startDateArray, timeSlotArray, finalData, setFinalData}}>
        {children}
    </TableContext.Provider>
  )
}
