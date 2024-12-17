import React from "react";
import { MDBFooter } from "mdb-react-ui-kit";

import CalendarIcon from "../assets/Icons/calendar-icon.jpg";

export default function Footer() {
  return (
    <MDBFooter className="bg-light text-center text-muted d-flex justify-content-center align-items-center">
      <div className="text-center p-3 fw-semibold">
        <span>© 2024 Copyright:</span>
        <a className="text-black align-items-center ms-2" href="/home">
          <span>
            Exam<span className="text-primary">TimeTable</span>
          </span>
          <img src={CalendarIcon} alt="Logo" className="ms-2" width="30" />
        </a>
      </div>
    </MDBFooter>
  );
}
