import React from "react";

import Nav from "react-bootstrap/Nav";

export default function Navbar() {
  return (
    <div>
      <Nav justify variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/choosetimetable">ChooseTimeTable</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/createtimetable">CreateTimeTable</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
