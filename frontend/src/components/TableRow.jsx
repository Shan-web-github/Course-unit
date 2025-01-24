import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

export default function TableRow({ id, Date, Subjects, index, moveRow }) {
  const ref = useRef(null);

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

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="mb-4">
      <div>
        <strong>{Date}</strong>
      </div>
      <table>
        <thead>
          <tr>
            <td>Morninig</td>
            <td>Evening</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{Subjects.join(", ")}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
