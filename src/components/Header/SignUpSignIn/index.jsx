import { useState } from "react";
import Input from "../../Input";
import {useNavigate} from 'react-router-dom';
import "./style.css";
import Button from "../../Button";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword   } from "firebase/auth";
import { toast } from "react-toastify";
import { auth,db} from "../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {  signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignUpSignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading,setLoading]=useState(false);
  const [loginForm,setLoginForm]=useState(false);
  const navigate=useNavigate();
  const provider = new GoogleAuthProvider();


  function signUp() {
    if (
      name != "" &&
      email != "" &&
      password!= "" &&
      confirmPassword != ""
    ) {

        if(password==confirmPassword){
  setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("newUser:"+user);
    toast.success("new User Created");
  
      setName("");
      setEmail("");
      setPassword("");
      setconfirmPassword("");
      createDoc(user);
     navigate("/dashboard");
    // ...
  })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorCode,errorMessage)
          setLoading(false);
        });
        }
        else{
            toast.error("passwords doesnt match");
            setLoading(false);
        }

    
    }
    else {
      toast.error("All fields are required");
      setLoading(false);
    }
  }




  function loginUsingEmail()
  {
    setLoading(true);
    if(email!=""&&password!=""){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged In");
     setLoading(false);
    console.log(user);
     navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
     setLoading(false);
    toast.error(errorCode,errorMessage);
  });
}else{
    toast.error("required all the fields");
     setLoading(false);
}
  }



 async function createDoc(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      await setDoc(userRef, {
        name: user.displayName ? user.displayName : name,
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
      });
      toast.success("Doc created");
    } else {
      toast.error("Doc already exists");
    }
  } catch (e) {
    toast.error(e.message);
  }
  setLoading(false);
}



    async function googleAuth() {
  if (loading) return;

  try {
    setLoading(true);

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    toast.success("User Authenticated");

    // ✅ VERY IMPORTANT: create Firestore document
    await createDoc(user);

    console.log("Google user:", user);

     navigate("/dashboard"); 
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }

  setLoading(false);
}
  return (
    <>
    {
        loginForm ?<>
          <div className="signUp-wrapper">
      <h2 className="title">
        Sign up on <span style={{ color: "var(--theme)" }}>Financly.</span>
      </h2>
      <form>
       
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"johndoe@gmail.com"}
          type={"email"}
        ></Input>
        <Input
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"@Example123"}
          type={"password"}
        ></Input>
        
        <Button
        disabled={loading}
          text={loading?"Loading...":"Login Using Email and Password"}
          onClick={() => loginUsingEmail()}
        ></Button>
        <p className="p-style">Or</p>
        <Button text={loading?"Loading...":"Login Using Google"} blue={true} onClick={googleAuth}></Button>
        <p className="p-style" onClick={()=>setLoginForm(!loginForm)}>Or Dont have an Account Already?</p>
      </form>
    </div>
    </>:
        
    <>  <div className="signUp-wrapper">
      <h2 className="title">
        Sign up on <span style={{ color: "var(--theme)" }}>Financly.</span>
      </h2>
      <form>
        <Input
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"jon doe"}
          type={"text"}
        ></Input>
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"johndoe@gmail.com"}
          type={"email"}
        ></Input>
        <Input
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"@Example123"}
          type={"password"}
        ></Input>
        <Input
          label={"ConfirmPassword"}
          state={confirmPassword}
          setState={setconfirmPassword}
          placeholder={"@Example123"}
          type={"password"}
        ></Input>
        <Button
        disabled={loading}
          text={loading?"Loading...":"SignUp Using Email and Password"}
          onClick={() => signUp()}
        ></Button>
        <p className="p-style">Or</p>
        <Button text={loading?"Loading...":"SignUp Using Google"} blue={true} onClick={googleAuth}></Button>
        <p className="p-style" onClick={()=>setLoginForm(!loginForm)}>Or have an Account Already? Click Here</p>
      </form>
    </div></>
    }
   
    </>
   
  );
};

export default SignUpSignIn;
