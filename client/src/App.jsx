import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"

function App() {
  

  return (
    <div className='app'>
      
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" exact element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </div>
  )
}

export default App
