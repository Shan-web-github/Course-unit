import { useDrag, useDrop } from "react-dnd";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Button } from "react-bootstrap";

export default function TableRow({
  id,
  Subjects,
  index,
  moveRow,
  collectSubjects,
}) {
  const ref = useRef(null);
  const [swap, setSwap] = useState(false);

  // Drag and drop logic
  const [, drop] = useDrop({
    accept: "ROW",
    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "ROW",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // Memoized void redundant calculations
  const filteredSubjects1 = useMemo(
    () => Subjects.filter((item) => item[3] === "1"),
    [Subjects]
  );
  const filteredSubjects2 = useMemo(
    () => Subjects.filter((item) => item[3] === "2"),
    [Subjects]
  );
  const filteredSubjects3 = useMemo(
    () => Subjects.filter((item) => item[3] === "3"),
    [Subjects]
  );

  const date = useMemo(()=>{
    return `Day ${index+1}`;
  },[index]);

  //Merged
  const isMerge = useMemo(
    () =>
      (filteredSubjects1.length === 0 && filteredSubjects3.length === 0) ||
      filteredSubjects2.length === 0,
    [filteredSubjects1, filteredSubjects2, filteredSubjects3]
  );

  // Use callback
  const collectData = useCallback(() => {
    const collected = swap
      ? {
          morning: { level2: filteredSubjects2 },
          evening: { level1: filteredSubjects1, level3: filteredSubjects3 },
        }
      : {
          morning: { level1: filteredSubjects1, level3: filteredSubjects3 },
          evening: { level2: filteredSubjects2 },
        };

    collectSubjects(date, collected);
  }, [
    swap,
    filteredSubjects1,
    filteredSubjects2,
    filteredSubjects3,
    collectSubjects,
    date,
  ]);

  // Trigger collection of subjects when dependencies change
  useEffect(() => {
    collectData();
  }, [ collectData ]);

  // Handle swap toggle
  const changeSwap = () => {
    setSwap((prev) => !prev);
  };

  // Render table row
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-4">
      <div>
        <strong>{date}</strong>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            {swap ? (
              <tr>
                {filteredSubjects2.length > 0 && (
                  <td colSpan={isMerge ? 2 : 1}>Morning</td>
                )}
                {(filteredSubjects1.length > 0 ||
                  filteredSubjects3.length > 0) && (
                  <td colSpan={isMerge ? 2 : 1}>Evening</td>
                )}
              </tr>
            ) : (
              <tr>
                {(filteredSubjects1.length > 0 ||
                  filteredSubjects3.length > 0) && (
                  <td colSpan={isMerge ? 2 : 1}>Morning</td>
                )}
                {filteredSubjects2.length > 0 && (
                  <td colSpan={isMerge ? 2 : 1}>Evening</td>
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {swap ? (
              <tr>
                {filteredSubjects2.length > 0 && (
                  <td colSpan={isMerge ? 2 : 1}>
                    {filteredSubjects2.join(",")}
                  </td>
                )}
                {(filteredSubjects1.length > 0 ||
                  filteredSubjects3.length > 0) && (
                  <td colSpan={isMerge ? 2 : 1}>
                    {filteredSubjects1.length > 0 && (
                      <span>
                        {filteredSubjects1.join(",")}
                        {filteredSubjects3.length > 0 && "/"}
                      </span>
                    )}
                    {filteredSubjects3.length > 0 && (
                      <span>{filteredSubjects3.join(",")}</span>
                    )}
                  </td>
                )}
              </tr>
            ) : (
              <tr>
                {(filteredSubjects1.length > 0 ||
                  filteredSubjects3.length > 0) && (
                  <td colSpan={isMerge ? 2 : 1}>
                    {filteredSubjects1.length > 0 && (
                      <span>
                        {filteredSubjects1.join(",")}
                        {filteredSubjects3.length > 0 && "/"}
                      </span>
                    )}
                    {filteredSubjects3.length > 0 && (
                      <span>{filteredSubjects3.join(",")}</span>
                    )}
                  </td>
                )}
                {filteredSubjects2.length > 0 && (
                  <td colSpan={isMerge ? 2 : 1}>
                    {filteredSubjects2.join(",")}
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Button onClick={changeSwap}>Swap</Button>
    </div>
  );
}
