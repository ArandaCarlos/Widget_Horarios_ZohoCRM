import { useState,useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {ZOHO} from "../assets/Zoho";
import {useWidget} from "../Context/ZohoContext";
import swal from 'sweetalert';


const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    }
  }));

const Horarios = () => {

    const{dias, setDias}=useWidget();
    const[showHorarioCorrido, setShowHorarioCorrido]=useState(false);
    const[showHorarioPartido, setShowHorarioPartido]=useState(false);
    const classes = useStyles();
    const [horarios, setHorarios]=useState({
        status:'',
        apertura1:'',
        cierre1:'',
        apertura2:'',
        cierre2:''
    })
    const {cargado}=useWidget();
    const {record}=useWidget();
    const {user}=useWidget();
    const [listaDias]= useState(["lunes","martes","miercoles","jueves","viernes","sabado","domingo","feriados"]);
    const [showErrorHorario, setShowErrorHorario] = useState(false);
    const [cargarHorarios, setShowCargarHorarios] = useState(false);

    
    useEffect(() => {
        if(cargado){
            console.log(record.id)
            listaDias.forEach(dia => {
                //console.log(dias[dia])
                if(dias[dia].hasOwnProperty('apertura2')){
                    const span= document.getElementById("span_"+dia);
                    span.textContent = dias[dia].apertura1+"-"+dias[dia].cierre1+"/"+dias[dia].apertura2+"-"+dias[dia].cierre2;
                }else if(dias[dia].hasOwnProperty('apertura1')){
                    const span= document.getElementById("span_"+dia);
                    span.textContent = dias[dia].apertura1+"-"+dias[dia].cierre1;
                }else if(dias[dia].hasOwnProperty('status')){
                    if(dias[dia].status=="cerrado"){
                        const span= document.getElementById("span_"+dia);
                        span.textContent = "Cerrado";
                    }else{
                        const span= document.getElementById("span_"+dia);
                        span.textContent = "Abierto 24hs";
                    }
                }
            });
            showButton();
        }
        
    }, [cargado])

    //const[showCargarHorarios, setShowCargarHorarios]=useState(false);

    const handleHour=(select)=>{
        setShowHorarioCorrido(false);
        setShowHorarioPartido(false);
        const inputs= document.getElementsByTagName("input");
        let arrayAllInputs = [...inputs];
        let arrayInputs = [...inputs];
        let diasArray= dias;
        arrayInputs= arrayInputs.filter(input=> input.checked===true);
        if(arrayInputs.length > 0){
            arrayInputs.forEach(input => {
                diasArray[input.value]={"status":select};
                const span= document.getElementById("span_"+input.value);
                span.textContent = select;
                input.checked=false; 
            });
            setDias(diasArray);
            showButton();
            arrayAllInputs.forEach(inp => {
                inp.disabled=false;
            });
        }else{
            swal("Debe seleccionar un día para ingresar el horario")
        }
    }

    const setHoras=()=>{
        //console.log(dias);
        const inputs= document.getElementsByTagName("input");
        let arrayInputs = [...inputs];
        let diasArray= dias;
        arrayInputs= arrayInputs.filter(input=> input.checked===true);
        if(arrayInputs.length > 0){
            arrayInputs.forEach(input => {
                if(horarios.status==='horario_corrido'){
                    diasArray[input.value]={"status":"abierto_Corrido", "apertura1":horarios.apertura1, "cierre1":horarios.cierre1, "dia":input.value};
                    const span= document.getElementById("span_"+input.value);
                    span.textContent = horarios.apertura1+"-"+horarios.cierre1;  
                }else if(horarios.status==='horario_partido'){
                    diasArray[input.value]={"status":"abierto_Partido", "apertura1":horarios.apertura1, "cierre1":horarios.cierre1,"apertura2":horarios.apertura2, "cierre2":horarios.cierre2, "dia":input.value};
                    const span= document.getElementById("span_"+input.value);
                    span.textContent = horarios.apertura1+"-"+horarios.cierre1+"/"+horarios.apertura2+"-"+horarios.cierre2;  
                }
                input.checked= false;
                
            });
            setDias(diasArray);
            showButton();
            let arrayAllInputs = [...inputs];
            arrayAllInputs.forEach(inp => {
                inp.disabled=false;
            });
            resetHours(horarios.status);
        }else{
            swal("Debe seleccionar un día antes de ingresar el horario");
        }
        
    }
    
    const handleHorarioCorrido=()=>{
        setHorarios({...horarios, status:"horario_corrido"});
        setShowHorarioPartido(false);
        setShowHorarioCorrido(true);
    }
    const handleHorarioPartido=()=>{
        setHorarios({...horarios, status:"horario_partido"});
        setShowHorarioCorrido(false);
        setShowHorarioPartido(true);
    }

    const handleInputHours = (e)=>{
        setShowErrorHorario(false)
        let horas= horarios;
        horas[e.target.id]=e.target.value;
        setHorarios(horas);
        //console.log(horas)
    }
    
    const showButton = () =>{
        let flag=true;
        console.log(dias)
        const listaDias= ["lunes","martes","miercoles","jueves","viernes","sabado","domingo","feriados"]
        listaDias.forEach(d => {
            if(dias[d].hasOwnProperty("status")){
                if(dias[d].status==""){
                    flag=false;
                }
            }else{
                flag=false;
            }
            
        });
        if(flag){
            setShowCargarHorarios(true);
        }
    }

    const resetHours = (status) =>{
        let apertura1 = document.getElementById("apertura1");
        let apertura2 = document.getElementById("apertura2");
        let cierre1 = document.getElementById("cierre1");
        let cierre2 = document.getElementById("cierre2");
        apertura1.value = "00:00";
        cierre1.value = "00:00";
        if(status == "horario_partido"){
            apertura2.value = "00:00";
            cierre2.value = "00:00";
        }
        setHorarios({...horarios,
            apertura1:'',
            cierre1:'',
            apertura2:'',
            cierre2:''
        })
    }

    const setHour =()=>{

        if(horarios.status=="horario_corrido"){
            if(horarios.apertura1!="" && horarios.cierre1!=""){
                let hora1= Number(horarios.apertura1.slice(0, 2));
                let hora2= Number(horarios.cierre1.slice(0, 2));
                //console.log(horarios.apertura1)
                let minutos1= Number(horarios.apertura1.slice(3, 5));
                let minutos2= Number(horarios.cierre1.slice(3, 5));

                //console.log(minutos1)
                if(hora1 >= 7){
                    if(hora2==hora1 && minutos2<= minutos1){
                        swal("El horario de cierre debe ser mayor al de apertura");
                    }else{
                        if(hora2<hora1){
                            swal("El horario de cierre debe ser mayor al de apertura");
                        }else{
                            setHoras();
                            setShowErrorHorario(false);
                        }  
                    }
                    
                }else{
                    swal("El horario de apertura debe ser mayor a 7am");
                }
               
            }else{
                setShowErrorHorario(true)
            }
        }
        if(horarios.status=="horario_partido"){
            if(horarios.apertura1!="" && horarios.apertura2!="" && horarios.cierre1!="" && horarios.cierre2!=""){
                let hora1= Number(horarios.apertura1.slice(0, 2));
                let hora2= Number(horarios.cierre1.slice(0, 2));
                let hora3= Number(horarios.apertura2.slice(0, 2));
                let hora4= Number(horarios.cierre2.slice(0, 2));

                let minutos1= Number(horarios.apertura1.slice(3, 5));
                let minutos2= Number(horarios.cierre1.slice(3, 5));
                let minutos3= Number(horarios.apertura2.slice(3, 5));
                let minutos4= Number(horarios.cierre2.slice(3, 5));

                if(hora1>=7 && hora3>=7){
                    if((hora2==hora1 && minutos2<=minutos1) || (hora4==hora3 && minutos4<=minutos3) ){
                        swal("El horario de cierre debe ser mayor al de apertura");
                    }else{
                        if(hora2<hora1 || hora4<hora3 || hora3<hora2 ){
                            swal("El horario de cierre debe ser mayor al de apertura");
                            }else{
                                setHoras();
                                setShowErrorHorario(false)
                            } 
                    }
                    
                }else{
                    swal("El horario de apertura debe ser mayor a 7am");
                }
            }else{
                setShowErrorHorario(true)
            }
        }
        //console.log(dias)
    }

    const handleInputClick = (e) =>{
        let inputs = document.getElementsByTagName("input");
        let arrayInputs = [...inputs];
        arrayInputs= arrayInputs.filter(input=> input.checked!=true && input.type!="time");
        if(e.target.checked==true){
            
            //console.log(arrayInputs)
            arrayInputs.forEach(inp => {
                inp.disabled = true;
            });
        }else{
            arrayInputs.forEach(inp => {
                inp.disabled = false;
            });
        }
        
    }

    const onSubmit =()=>{
        console.log(dias);
        const listaDias= ["lunes","martes","miercoles","jueves","viernes","sabado","domingo","feriados"]
        let arrayHorarios = [];
        let diasCerrados = 0;
        listaDias.forEach(d => {
            if(dias[d].status=="Cerrado" || dias[d].status=="cerrado"){
                diasCerrados= diasCerrados+1;
            }
        });
        if(diasCerrados>=8){
            swal("No pueden estar todos los dias cerrados");
        }else{
            listaDias.forEach(d => {
                if(dias[d].status!="Cerrado" && dias[d].status!="cerrado"){
                    //console.log(Horarios_Tienda)
                    if(dias[d].status=="Abierto_24hs"){
                        const mapDia={
                            $in_merge: false,
                            Apertura: "00:01",
                            Apertura_2: "",
                            Cierre: "23:59",
                            Cierre_2: "",
                            Dias: [d],
                            Parent_Id:{
                                id: record.id.toString(),
                                module: "CustomModule6",
                                name: "naty2"
                            }
                        }
                        arrayHorarios.push(mapDia);
                        //console.log(arrayHorarios);
                    }else{
                        const mapDia={
                            $in_merge: false,
                            Apertura: dias[d].apertura1,
                            Apertura_2: dias[d].apertura2,
                            Cierre: dias[d].cierre1,
                            Cierre_2: dias[d].cierre2,
                            Dias: [d],
                            Parent_Id:{
                                id: record.id.toString(),
                                module: "CustomModule6",
                                name: "naty2"
                            }
                        }
                        arrayHorarios.push(mapDia);
                        //console.log(arrayHorarios);
                    }
                    
                } 
            });
            console.log(arrayHorarios)
            // var config={
            //     Entity:"Apollo_Stores",
            //     APIData:{
            //         "id": record.id,
            //         "Horarios_Tienda": arrayHorarios,
            //         "Horarios_validados_desde_el_widget": "SI",
            //     },
            //     Trigger:["workflow"]
            // }
            let conn_name = "crm";
            let map = {
                "id": record.id,
                "Horarios_Tienda": arrayHorarios,
                "user":user
            }
            console.log(map)
            let req_data ={
                "parameters" : { 
                    map
                },
                "method" : "POST",
                "url" : "https://www.zohoapis.com/crm/v2/functions/impactar_horarios_subtabla_widget/actions/execute?auth_type=apikey&zapikey=1003.7c02a5b10f13810ff9499d39a02c0d43.605b9c5964f99646e4da05c6b3e3afdc",
                "param_type" : 1
            };
            //https://sandbox.zohoapis.com/crm/v2/functions/impactar_horarios_subtabla_widget/actions/execute?auth_type=apikey&zapikey=1003.2adc43de08da9debb61656e2b5ee18e2.5f15e6da14582678a2cd59414c68ed79
            //https://www.zohoapis.com/crm/v2/functions/impactar_horarios_subtabla_widget/actions/execute?auth_type=apikey&zapikey=1003.7c02a5b10f13810ff9499d39a02c0d43.605b9c5964f99646e4da05c6b3e3afdc
            ZOHO.CRM.CONNECTION.invoke(conn_name, req_data)
            .then(function(data){
                console.log(data)
            })
            proceedToNextState();
        }
    }

    function proceedToNextState() {
        ZOHO.embeddedApp.init().then(function(){
        return ZOHO.CRM.BLUEPRINT.proceed();
        }).then(function(data){
        console.log(data);
        })
    }
    
    return ( 
        
        <div className="text-center row">
            <div className=" col-6">                
                <table className="table">
                <thead>
                    <tr>
                    <th scope="col">Dias</th>
                    <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="lunes" value="lunes" autoComplete="off" onChange={handleInputClick}/> Lunes
                </label></th>
                    <td><h6 id="span_lunes">-</h6></td>
                
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="martes" value="martes" autoComplete="off" onChange={handleInputClick}/> Martes
                </label></th>
                    <td><h6 id="span_martes">-</h6></td>
                    
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="miercoles" value="miercoles" autoComplete="off" onChange={handleInputClick}/> Miercoles
                </label></th>
                    <td><h6 id="span_miercoles">-</h6></td>
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="jueves" value="jueves" autoComplete="off" onChange={handleInputClick}/> Jueves
                </label></th>
                    <td><h6 id="span_jueves">-</h6></td>
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="viernes" value="viernes" autoComplete="off" onChange={handleInputClick}/> Viernes
                </label></th>
                    <td><h6 id="span_viernes">-</h6></td>
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="sabado" value="sabado" autoComplete="off" onChange={handleInputClick}/> Sabado
                </label></th>
                    <td><h6 id="span_sabado">-</h6></td>
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="domingo" value="domingo" autoComplete="off" onChange={handleInputClick}/> Domingo
                </label></th>
                    <td ><h6 id="span_domingo">-</h6></td>
                    </tr>
                    <tr>
                    <th scope="row"><label className="btn btn-primary " style={{width: '50%', boxSizing: 'content-box'}}>
                    <input type="checkbox" name="feriados" value="feriados" autoComplete="off" onChange={handleInputClick}/> Feriados
                </label></th>
                    <td><h6 id="span_feriados">-</h6></td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div className="btn-group-sm mt-5 d-block col-6" role="group" aria-label="Basic outlined example">
                <button type="button" className="btn btn-outline-primary" onClick={()=>handleHour("Cerrado")}>Cerrado</button>
                <button type="button" className="btn btn-outline-primary" onClick={()=>handleHour("Abierto_24hs")}>Abierto 24hs</button>
                <button type="button" className="btn btn-outline-primary" onClick={handleHorarioCorrido}>Horario Corrido</button>
                <button type="button" className="btn btn-outline-primary"onClick={handleHorarioPartido}>Horario Partido</button>
            
            {showHorarioCorrido?
                <div className="text-center mt-3">
                    <h6 className="mt-3">Horario Apertura y Cierre 1</h6>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="apertura1"
                            label="Apertura"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            onChange={handleInputHours}
                        />
                    </form>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="cierre1"
                            label="Cierre"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            onChange={handleInputHours}
                        />
                    </form>
                    <button className="btn btn-primary mt-3" onClick={setHour}>Set</button>
                </div>:showHorarioPartido?<div>
                <h6 className="mt-3">Horario Apertura y Cierre 1</h6>
                <form className={classes.container} noValidate>
                        <TextField
                            id="apertura1"
                            label="Apertura"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            onChange={handleInputHours}
                        />
                    </form>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="cierre1"
                            label="Cierre"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            onChange={handleInputHours}
                        />
                    </form>
                    <h6 className="mt-3">Horario Apertura y Cierre 2</h6>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="apertura2"
                            label="Apertura"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            onChange={handleInputHours}
                        />
                    </form>
                    <form className={classes.container} noValidate>
                        <TextField
                            id="cierre2"
                            label="Cierre"
                            type="time"
                            defaultValue="00:00"
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            inputProps={{
                            step: 300, // 5 min
                            }}
                            onChange={handleInputHours}
                        />
                    </form>
                    <button className="btn btn-primary mt-3" onClick={setHour}>Set</button>
                </div>:""
            }
            <div>
                {cargarHorarios ? <button className="btn btn-primary mt-4" onClick={onSubmit}>Cargar Horarios</button>:""}
            </div>
            {showErrorHorario?<div className="mt-2 text-danger">Debe setear horarios antes de cargarlos</div>:""}
            </div>
            
        </div>
     );
}
 
export default Horarios;