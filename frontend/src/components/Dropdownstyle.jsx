import React, { useState } from "react";
import axios from "axios";

import { Dropdown, Form } from "react-bootstrap";

function Dropdownstyle({ courseList, concatenatedOptions, semester, level, onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [inputTime, setInputTime] = useState("");

  const [columns, setColumns] = useState(courseList);

  const dynamicOptions = async () => {
    if (concatenatedOptions) {
      try {
        const response = await axios.get(
          `http://localhost:5000/studentdata/notclashes/${concatenatedOptions}?semester=${semester}&level=${level}`
        );
        setColumns(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching not clash courses data:", error);
      }
    }
  };

  const courseListNew = columns.map((course) => course.CO_CODE);
  const filteredOptions = courseListNew.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputTime(value);
    if (onChange) onChange("inputTime", value);
  };

  return (
    <div className="dropdownstyle">
      <div>
        <Dropdown onClick={dynamicOptions}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedOption}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {/* Search Input */}
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ margin: "0.5rem" }}
            />

            {/* Dropdown Items */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => {
                    setSelectedOption(option);
                    setSearchTerm("");
                    if (onChange) onChange("selectedOption", option);
                  }}
                >
                  {option}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No options found</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            type="text"
            value={inputTime}
            onChange={handleInputChange}
            placeholder="Enter Time"
          />
        </Form.Group>
      </div>
    </div>
  );
}

export default Dropdownstyle;
