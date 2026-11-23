
import {Routes,Route} from 'react-router-dom';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import './App.css';

const App = () => {
  return (
    <>
    <ToastContainer></ToastContainer>
     <Routes>
      <Route path="/" element={<Signup/>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </>
   
   
  )
}

export default App
