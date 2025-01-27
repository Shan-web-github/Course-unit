import { useDrag, useDrop } from "react-dnd";
import { useMemo, useRef, useState } from "react";

import { Button } from "react-bootstrap";

export default function TableRow({ id, Date, Subjects, index, moveRow }) {
  const ref = useRef(null);
  const [swap, setSwap] = useState(false);

  const [, drop] = useDrop({
    accept: "ROW",
    hover(item, monitor) {
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

  const filteredSubjects1 = Subjects.filter((item) => item[3] === "1");
  const filteredSubjects2 = Subjects.filter((item) => item[3] === "2");
  const filteredSubjects3 = Subjects.filter((item) => item[3] === "3");

  const isMerge = useMemo(
    () => (filteredSubjects1.length === 0 && filteredSubjects3.length === 0) || filteredSubjects2.length === 0,
    [filteredSubjects1, filteredSubjects2, filteredSubjects3]
  );

  const changeSwap = () => {
    setSwap(!swap);
  };

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-4">
      <div>
        <strong>{Date}</strong>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            {swap === false ? (
              <tr>
                {(filteredSubjects1.length > 0 ||
                  filteredSubjects3.length > 0) && <td colSpan={ isMerge ? 2 : 1}>Morning</td>}
                {filteredSubjects2.length > 0 && <td colSpan={ isMerge ? 2 : 1}>Evening</td>}
              </tr>
            ) : (
              <tr>
                {filteredSubjects2.length > 0 && <td colSpan={ isMerge ? 2 : 1}>Morning</td>}
                {(filteredSubjects1.length > 0 ||
                  filteredSubjects3.length > 0) && <td colSpan={ isMerge ? 2 : 1}>Evening</td>}
              </tr>
            )}
          </thead>
          <tbody>
            {swap === false ? (
              <tr>
                <td>
                  {filteredSubjects1.length > 0 && (
                    <span>{filteredSubjects1.join(",")}{filteredSubjects3.length > 0 &&'/'}</span>
                  )}
                  {filteredSubjects3.length > 0 && (
                    <span>{filteredSubjects3.join(",")}</span>
                  )}
                </td>
                <td>
                  {filteredSubjects2.length > 0 && (
                    <span>{filteredSubjects2.join(",")}</span>
                  )}
                </td>
              </tr>
            ) : (
              <tr>
                <td>
                  {filteredSubjects2.length > 0 && (
                    <span>{filteredSubjects2.join(",")}</span>
                  )}
                </td>
                <td>
                  {filteredSubjects1.length > 0 && (
                    <span>{filteredSubjects1.join(",")}{filteredSubjects3.length > 0 &&'/'}</span>
                  )}
                  {filteredSubjects3.length > 0 && (
                    <span>{filteredSubjects3.join(",")}</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Button onClick={changeSwap}>Swap</Button>
    </div>
  );
}
