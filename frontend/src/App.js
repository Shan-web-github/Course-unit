import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SheetUpload from "./pages/SheetUpload";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import ChooseTimeTable from "./pages/ChooseTimeTable";
import CreateTimeTable from "./pages/CreateTimeTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/sheetupload" element={<SheetUpload />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/createTimetable" element={<CreateTimeTable/>}/>
        <Route path="/choosetimeTable" element={<ChooseTimeTable/>}/>
        {/* <Route path="/" element={}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
