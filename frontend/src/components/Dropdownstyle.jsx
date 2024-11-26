// import React, { useState } from "react";

// export default function Dropdownstyle({ id, courseList, onChange }) {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [inputTime, setInputTime] = useState("");

//   const handleSelectChange = (event) => {
//     const value = event.target.value;
//     setSelectedOption(value);
//     if (onChange) onChange("selectedOption", value);
//   };

//   const handleInputChange = (event) => {
//     const value = event.target.value;
//     setInputTime(value);
//     if (onChange) onChange("inputTime", value);
//   };

//   return (
//     <div>
//       <select id={`${id}-select`} value={selectedOption} onChange={handleSelectChange}>
//         <option value="">Select Course</option>
//         {courseList.map((course, index) => (
//           <option key={index} value={course}>
//             {course}
//           </option>
//         ))}
//       </select>
//       <input
//         id={`${id}-input`}
//         type="text"
//         value={inputTime}
//         onChange={handleInputChange}
//         placeholder="Enter Time"
//       />
//     </div>
//   );
// }

//*************************************************** */


import React, { useState } from "react";

import { Dropdown, Form } from "react-bootstrap";

function Dropdownstyle({ courseList, onChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const[inputTime,setInputTime] = useState("");

  const filteredOptions = courseList.filter((option) =>
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
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedOption}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {/* Search Input */}
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <Form.Control type="text" value={inputTime} onChange={handleInputChange} placeholder="Enter Time"/>
        </Form.Group>
      </div>
    </div>
  );
}

export default Dropdownstyle;
