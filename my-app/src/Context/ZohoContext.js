import { createContext, useContext, useState, useEffect } from "react";
import {ZOHO} from '../assets/Zoho';

const ZohoContext = createContext();

export default function ZohoProvider({children}) {

   const [module, setModule] = useState(null);
   const [entity, setEntity] = useState(null);
   const [record, setRecord]= useState(null);
   const [user, setUser]= useState(null);
   const[dias, setDias]=useState({
      lunes:{},
      martes:{},
      miercoles:{},
      jueves:{},
      viernes:{},
      sabado:{},
      domingo:{},
      feriados:{}
  })
   const [cargado, setCargado] = useState(false);
   const [Horarios_Tienda, setHorarios_Tienda]=useState(null);

   useEffect(() => {

      const initWidget = () => {
         ZOHO.embeddedApp.on("PageLoad", function (data) {
            console.log(data);
            setModule(data.Entity);
            setEntity(data.EntityId);
            ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
               console.log(data.users[0].email);
               setUser(data.users[0].email);
            });
            ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId})
            .then(function(data){
               setRecord(data.data[0]);
               console.log(data.data[0].Horarios_Tienda);
               setHorarios_Tienda(data.data[0].Horarios_Tienda)
               let lunes = JSON.parse(data.data[0].Lunes); 
               lunes={...lunes, "dia":"lunes"}; 
               let martes = JSON.parse(data.data[0].Martes);  
               martes={...martes, "dia":"martes"};   
               let miercoles = JSON.parse(data.data[0].Miercoles);  
               miercoles={...miercoles, "dia":"miercoles"};   
               let jueves = JSON.parse(data.data[0].Jueves);  
               jueves={...jueves, "dia":"jueves"};   
               let viernes = JSON.parse(data.data[0].Viernes);  
               viernes={...viernes, "dia":"viernes"};   
               let sabado = JSON.parse(data.data[0].Sabado);  
               sabado={...sabado, "dia":"sabado"};   
               let domingo = JSON.parse(data.data[0].Domingo);  
               domingo={...domingo, "dia":"domingo"};   
               let feriados = JSON.parse(data.data[0].Feriados);  
               feriados={...feriados, "dia":"feriados"};   
               let diasZoho=[lunes, martes, miercoles, jueves, viernes, sabado, domingo, feriados];
               let arrayDias= dias;
               diasZoho.forEach(dia => {
                  if(dia.hasOwnProperty('apertura2')){
                     dia={...dia, "status":"abierto_Partido"}
                     arrayDias[dia.dia]=dia;
                     
                  }else if(dia.hasOwnProperty('apertura1')){
                     dia={...dia, "status":"abierto_Corrido"}
                     arrayDias[dia.dia]=dia;
                  }else if(dia.hasOwnProperty('status')){
                     arrayDias[dia.dia]=dia;
                  }
               });
               
               setDias(arrayDias)
               setCargado(true)

            })
         });

         ZOHO.embeddedApp.init();
      }

      setTimeout(()=> {
         initWidget();
      }, 1000);
      
   }, []);
   
   return (
      <ZohoContext.Provider value={{module: module, entity: entity, dias:dias, setDias:setDias, cargado, Horarios_Tienda, record, user:user}}>
         {children}
      </ZohoContext.Provider>
   );
};

export const useWidget = () => {

   const context = useContext(ZohoContext);

   if (!context) throw new Error("UseWidget inside ZohoContext");

   const { entity, module, dias, setDias, cargado, Horarios_Tienda, record, user} = context;

   return {
      entity, module, dias, setDias, cargado, Horarios_Tienda, record, user
   }
}