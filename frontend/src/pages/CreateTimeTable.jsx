import React from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function CreateTimeTable() {
  return (
    <div className="label">
      <p>No Clashes Sets</p>
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary">4 sets</Button>
        <Button variant="secondary">3 sets</Button>
        <Button variant="secondary">2 sets</Button>
      </ButtonGroup>
    </div>
  );
}
