import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Apod from "./pages/Apod";
import MarsRovers from "./pages/MarsRovers";
import NeoWs from "./pages/NeoWs";
import SearchMedia from "./pages/SearchMedia";

function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apod" element={<Apod />} />
          <Route path="/mars" element={<MarsRovers />} />
          <Route path="/neo" element={<NeoWs />} />
          <Route path="/search" element={<SearchMedia />} />
          {/* <Route path="*" element={<Error404 />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Router;
