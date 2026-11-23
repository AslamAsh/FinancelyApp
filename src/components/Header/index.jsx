
import './style.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImg from '../../assets/user.svg'

const Header = () => {
  const navigate=useNavigate()

const [user, loading] = useAuthState(auth);

useEffect(() => {
  if (!loading && user) {
    navigate("/dashboard");
  }
}, [user, loading, navigate]);

async function logout() {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
    navigate("/");
  } catch (error) {
    toast.error(error.message);
  }
}

  return (
    <div className='nav-bar'>
      <p className='logo'>Financly.</p>
      {user&&(
        <div style={{display:"flex",alignItems:"center",gap:"0.3rem"}}>
          <img
          style={{borderRadius:"50%",height:"1.5rem",width:"2rem"}}
          src={user.photoURL?user.photoURL:userImg}
          />
           <p className='logo link' onClick={logout}>Logout</p>
        </div>
      
      
      
      )}
      
    </div>
  )
}

export default Header
