// App.jsx
import React from 'react';
import { BrowserRouter,  Routes, Route } from 'react-router-dom'; 
import AdminNav from './Components/AdminNav.jsx';
import Reservation from "./Pages/Admin-Reservation.jsx";
import AddReservation from './Components/addNewReservation.jsx';
import AddReservationStage2 from './Components/addNewreservation2.jsx';
import EditReservation from './Components/Editreservation.jsx';
import EditReservationStage2 from './Components/Editreservation2.jsx';
import AddNewClient from './Components/AddNewClient.jsx';
import ClientDetailsTable from './Components/ClientDetailsTable.jsx';
import Login from './Pages/Login.jsx';
import AddHallsRooms from './Pages/AddHalls&Rooms.jsx';
import Blog from "./Pages/Blog.jsx";
import DonationDetails from './Pages/DonationDetails.jsx';
import AdminServices from './Pages/AdminServices.jsx';
import Homepage from './Pages/Homepage.jsx';
import Services from './Pages/Services.jsx';
import Programs from './Pages/Programs.jsx';
import Contact from './Pages/Contact.jsx';
import TrainingCenter from './Pages/TrainingCenter.jsx';
import About from './Pages/Aboutpage.jsx'

function App() {
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/AdminLogin" element ={<Login/>}/>
      <Route path="/admin" element={<AdminNav />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/addReservation" element={<AddReservation />} />
      <Route path="/addReservationStage2" element={<AddReservationStage2 />} />
      <Route path="/editReservation" element={<EditReservation />} />
      <Route path="/editReservationStage2" element={<EditReservationStage2 />} />
      <Route path="/addNewClient" element={<AddNewClient />} />
      <Route path="/clientDetailsTable" element={<ClientDetailsTable />} />
      <Route path="/admin/add-halls-rooms" element={<AddHallsRooms />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/DonationDetails" element={<DonationDetails />} />
      <Route path="/ServicesDetails" element={<AdminServices />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/TrainingCenter" element={<TrainingCenter />} />
      <Route path="/AboutUs" element={<About />} />




    </Routes>
   </BrowserRouter>
  );
}

export default App;

