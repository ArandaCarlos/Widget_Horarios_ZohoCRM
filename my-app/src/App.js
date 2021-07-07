import Horarios from "./Components/Horarios";
import ZohoProvider from './Context/ZohoContext';

function App() {
  return (
    <ZohoProvider>
      <Horarios/>
    </ZohoProvider>  
    
  );
}

export default App;
