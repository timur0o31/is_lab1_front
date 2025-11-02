import './App.css'
import {BrowserRouter, Navigate, Route, Router, Routes} from "react-router-dom";
import {PrimeReactProvider} from "primereact/api";
import Header from "./components/Header/Header.jsx";
import WorkerPage from "./pages/WorkerPage.jsx";
import PersonPage from "./pages/PersonPage.jsx";
import OrganizationPage from "./pages/OrganizationPage.jsx";
import SpecialOperationsPage from "./pages/SpecialOperationsPage.jsx";

function App() {
  return (
      <PrimeReactProvider>
          <BrowserRouter>
              <Header/>
                    <Routes>
                        <Route path='/' element={<WorkerPage/>}/>
                        <Route path='/people' element={<PersonPage/>}/>
                        <Route path='/organizations' element={<OrganizationPage/>}/>
                        <Route path='/special_operations' element={<SpecialOperationsPage/>}/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                    </Routes>
          </BrowserRouter>
      </PrimeReactProvider>
  )
}

export default App
