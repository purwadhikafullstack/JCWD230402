import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import {Footer, Navbar} from './components'
import { Home} from './pages';
import {Routes, Route} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);
  return (
    <AnimatePresence>
    <div className=' w-screen h-auto flex flex-col bg-[#FFF2CC]' >
      <Navbar />
      <main className='mt-2 md:mt-2 px-4 md:px-16 w-full'>
      <Routes>
        <Route path='/' element={<Home />} />
        </Routes> 
        </main> 
        <Footer />
    </div>
    </AnimatePresence>
  );
}

export default App;
