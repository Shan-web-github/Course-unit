import "./App.css";
import { React, useState } from "react";
import axios from "axios";
import Table from "./components/Table";

function App() {
  const [courses, setCourse] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [sem_reg, setSem_reg] = useState(null);
  const [offer_course_exm, setOffer_course_exm] = useState(null);

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [tableName, setTableName] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!courses || !mapping || !sem_reg || !offer_course_exm) {
      return alert("Please upload all files.");
    }
    const formData = new FormData();
    formData.append("courses", courses);
    formData.append("mapping", mapping);
    formData.append("sem_reg", sem_reg);
    formData.append("offer_course_exm", offer_course_exm);

    try {
      const response = await axios.post(
        "http://localhost:5000/studentdata/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Successfully uploaded");
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading files.");
    }
  };

  const load = async (event) => {
    event.preventDefault();
    if (!tableName) {
      return alert("Please enter a table name.");
    }
    try {
      const loadData = await axios.get(
        `http://localhost:5000/studentdata/data/${tableName}`
      );
      setColumns(loadData.data.columns);
      setRows(loadData.data.data);
    } catch (error) {
      console.error("Load error:", error);
      alert("An error occurred while loading data.");
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div className="file">
          <div>
            <label>Insert Courses File</label>
            <input
              id="courses"
              type="file"
              onChange={(event) => setCourse(event.target.files[0])}
            />
          </div>
          <div>
            <label>Insert Mapping File</label>
            <input
              id="mapping"
              type="file"
              onChange={(event) => setMapping(event.target.files[0])}
            />
          </div>
          <div>
            <label>Insert Semester Registration File</label>
            <input
              id="sem_reg"
              type="file"
              onChange={(event) => setSem_reg(event.target.files[0])}
            />
          </div>
          <div>
            <label>Insert Offered Courses For Examination File</label>
            <input
              id="offer_course_exm"
              type="file"
              onChange={(event) => setOffer_course_exm(event.target.files[0])}
            />
          </div>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      <div>
        <input
          type="text"
          placeholder="Enter table name"
          onChange={(event) => setTableName(event.target.value)}
        />
        <button type="button" onClick={load}>
          Load Data
        </button>
      </div>

      <label className="label">
        <Table columns={columns} rows={rows} />
      </label>
    </div>
  );
}

export default App;
