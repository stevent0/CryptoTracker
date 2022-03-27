import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

import Home from './components/home/home'
import Signup from "./components/signup/signup"
import Login from "./components/login/login"
import Dashboard from "./components/dashboard/dashboard"
import Cookies from 'js-cookie'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  )
}

export default App;
