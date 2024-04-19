import { AuthPage } from "./Pages/Auth/AuthPage.jsx"
import { Toaster } from "react-hot-toast"


function App() {

  return (
    <>
      <AuthPage/>
      <Toaster position="bottom-right" reverseOrder={false}/>
    </>
  )

}

export default App
