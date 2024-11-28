import { FcGoogle } from "react-icons/fc";
import {useState, useEffect, useRef} from 'react'
import { validEmail } from "../../utils/validEmail";
import { auth } from "../../utils/firebase";
import {  onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Signin() {

    const [form , setForm] = useState({ email : '', password: ''});
    const [err, setErr] = useState('');
    const ref = useRef();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    console.log(user);
     
    useEffect(() => {
      onAuthStateChanged(auth, (currentuser) => {
        setUser(currentuser)
      } )
    },[])

    const handleChange = (e) => {
       const { name, value } = e.target;
       setForm(prev => ({...prev, [name] : value}));
       setErr('');
    };

    useEffect(() => {
      ref.current.focus();
    }, [])
    

    const handleSubmit = (e) => {
        setLoading(true);
       e.preventDefault();

        if(!form?.email || !form?.password) {
            setErr('All fields are required');
            setLoading(false);
            return;
        }
        
        if(!validEmail(form?.email)){
            setErr('Email is not valid');
            setLoading(false);
            return;
        }

        async function login() {
            try {
              setLoading(true);
                const userCredential = await signInWithEmailAndPassword(auth,form?.email, form?.password)
                const user = userCredential.user;

                setLoading(false);
            }
            catch(E){
                console.log(E.message);
                setErr(E.message);   
                setLoading(false);
            }
        }
        login();
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[400px] space-y-6 p-8 rounded-xl bg-zinc-800 border border-zinc-700">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-purple-500">
            Login with
          </h1>
        </div>
        
        <button
          variant="outline"
          className="w-full flex justify-center py-2 rounded-md bg-zinc-700 border text-white border-zinc-600 hover:bg-zinc-600 hover:text-white"
          aria-label="Login with Google"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-600"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-800 px-2 text-zinc-400">or</span>
          </div>
        </div>
    
        <form className="space-y-4" onSubmit={handleSubmit} aria-labelledby="login-form">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="bg-zinc-700 p-2 rounded-md w-full border border-zinc-600 text-white outline-none placeholder:text-zinc-400 focus:border-purple-500 focus:ring-purple-500"
              value={form?.email}
              onChange={handleChange}
              ref={ref}
              aria-label="email"
            />
         </div>
    
          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="bg-zinc-700 p-2 rounded-md w-full border border-zinc-600 text-white outline-none placeholder:text-zinc-400 focus:border-purple-500 focus:ring-purple-500"
              value={form?.password}
              aria-label="password"
              onChange={handleChange}
            />

          </div>
    
          <div>
            <span className="font-medium text-red-500">{err && err}</span>
          </div>
    
          <button
            className="w-full outline-none bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            aria-label="Login"
            type="submit"
            disabled={loading}
          >
      
           {loading ? <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" /> : "Login"}
          </button>
          </form>        
      </div>
      
    </div>
    
    )
  }
  
  