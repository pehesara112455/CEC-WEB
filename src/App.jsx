import {BrowserRouter,Routes, Route} from "react-router-dom";
import Homepage from './Pages/Homepage';
import About from "./Pages/Aboutpage";


function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/About" element={<About />} />
    </Routes>
   </BrowserRouter>
    
     
    
  );
}

export default App;