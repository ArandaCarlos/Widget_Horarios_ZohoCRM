import Horarios from "./Horarios";
import useWidget from "../Context/ZohoContext";
import ZohoProvider from '../Context/ZohoContext';
const Check = () => {
    const {cargado}=useWidget();
    return ( 
        cargado?<ZohoProvider>
        <Horarios/>
      </ZohoProvider> :"Cargando"
     );
}
 
export default Check;