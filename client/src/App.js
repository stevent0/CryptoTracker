import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

import Home from './components/home/home'
import Signup from "./components/signup/signup"
import Login from "./components/login/login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/main" element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App;
