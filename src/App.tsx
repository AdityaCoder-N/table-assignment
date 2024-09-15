
import { PrimeReactProvider } from 'primereact/api';
        
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './App.css'
import Home from './pages/Home';


function App() {
  
  return (
    <PrimeReactProvider>
      <Home />
    </PrimeReactProvider>
  )
}

export default App
