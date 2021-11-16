/* Proceso Principal */
main();

/* Inicializo el array de tareas */
let arrayTareas = [];

function main(){
    auth();
}

/* Authorization */
function auth(){
    const clave = "coderhouse";
    const claveIngresada = prompt("Ingrese la contraseña 'coderhouse'");
    if(claveIngresada === clave){
        alert("Bienvenido");
    }else{
        auth();
    }
}

/* Fechas y Horas */
function calcularTiempoFinal(fecha, hora){
    const [year, month, day] = fecha.split("-");
    const [hour, minute] = hora.split(":");
    
    const tiempoFinal = new Date();
    tiempoFinal.setFullYear(year);
    tiempoFinal.setMonth(month - 1);
    tiempoFinal.setDate(day);
    tiempoFinal.setHours(hour);
    tiempoFinal.setMinutes(minute);

    return tiempoFinal;
}

/* Tareas */
const estados = ["espera","haciendo","terminado"];

function crearTarea(nombre, info, fecha, hora){
    const ahora = new Date();
    const tiempoFinal = calcularTiempoFinal(fecha, hora);
    /* Modelo de Tarea */
    return {
        nombre: nombre,
        info: info,
        inicio: ahora,
        fin: tiempoFinal,
        estado: estados[0]
    }
}

function crearTareaDOM(tarea){
    /* Crear tarea */
    const tareaDiv = document.createElement("div");
    tareaDiv.className = "tarea";
    /* Crear nombre de tarea */
    const nombreElement = document.createElement("h4");
    nombreElement.innerText = tarea.nombre;
    /* Crear info de tarea */
    const infoElement = document.createElement("p");
    infoElement.innerText = tarea.info;
    /* Crear fecha y hora final de tarea */
    const finElement = document.createElement("p");
    const fechaNormalizada = new Date(tarea.fin);
    const strHoras = (fechaNormalizada.getHours() < 10)? "0"+fechaNormalizada.getHours() : fechaNormalizada.getHours();
    const strMinutos = (fechaNormalizada.getMinutes() < 10)? "0"+fechaNormalizada.getMinutes() : fechaNormalizada.getMinutes();
    const strFecha = fechaNormalizada.getDate() +"/"+ fechaNormalizada.getMonth() +"/"+ fechaNormalizada.getFullYear() +" - "+ strHoras +":"+ strMinutos;
    finElement.innerText = strFecha;
    /* Crear botones de accion*/
    const buttonsDiv = document.createElement("div");
    const buttonHaciendo = document.createElement("button");
    buttonHaciendo.innerText = "Empezar";
    const buttonFin = document.createElement("button");
    buttonFin.innerText = "Finalizado";

    /* Unir botones */
    buttonsDiv.appendChild(buttonHaciendo);
    buttonsDiv.appendChild(buttonFin);
    /* Unir todo */
    tareaDiv.appendChild(nombreElement);
    tareaDiv.appendChild(infoElement);
    tareaDiv.appendChild(finElement);
    tareaDiv.appendChild(buttonsDiv);
    
    return tareaDiv;
}

/* Procesado del Formulario */
const formTarea = document.getElementById("form_tarea");
const nombreTarea = document.getElementById("nombre_input");
const horaTarea = document.getElementById("hora_input");
const fechaTarea = document.getElementById("fecha_input");
const infoTarea = document.getElementById("info_input");
const btnTarea = document.getElementById("crear_tarea_btn");

let formValues = { nombre: "", info: "", fecha: "", hora: "" };

function actualizarValores(){
    formValues.nombre = nombreTarea.value;
    formValues.info = infoTarea.value;
    formValues.fecha = fechaTarea.value;
    formValues.hora = horaTarea.value;

    console.log(JSON.stringify(formValues)); //Mostrar los datos actuales por consola
}

nombreTarea.addEventListener("input", actualizarValores);
horaTarea.addEventListener("input", actualizarValores);
fechaTarea.addEventListener("input", actualizarValores);
infoTarea.addEventListener("input", actualizarValores);

formTarea.addEventListener("submit", (e) => {
    e.preventDefault();
    arrayTareas.push(crearTarea(formValues.nombre, formValues.info, formValues.fecha, formValues.hora));
    actualizarColumnas();
})

/* Columnas de Tareas */
function actualizarColumnas(){
    const hoy = new Date();
    let arrayTareasAuxiliar = [...arrayTareas];

    const columnaHoy = document.getElementById("today_column_content");
    const columnaSemana = document.getElementById("weekly_column_content");
    const columnaMes = document.getElementById("monthly_column_content");

    columnaHoy.innerHTML = "";
    columnaSemana.innerHTML = "";
    columnaMes.innerHTML = "";

    /* El orden es importante, debe empezar por dia, luego semana y luego mes */
    arrayTareasAuxiliar.forEach((tarea, index) => {
        const fechaTareaDateType = new Date(tarea.fin);
        if(esTodayColumn(hoy, fechaTareaDateType)){
            columnaHoy.appendChild(crearTareaDOM(tarea));
            arrayTareasAuxiliar.splice(index, 1);
        }else if (esWeekColumn(hoy, fechaTareaDateType)) {
            columnaSemana.appendChild(crearTareaDOM(tarea));
            arrayTareasAuxiliar.splice(index, 1);
        }else if (esMonthColumn(hoy, fechaTareaDateType)) {
            columnaMes.appendChild(crearTareaDOM(tarea));
            arrayTareasAuxiliar.splice(index, 1);
        }
    });
}

/* Funciones para Elegir Columna */
function esTodayColumn(hoy, fin){
    if( esMismoDia(hoy, fin) && esMismoMes(hoy, fin) && esMismoAnio(hoy, fin) ){
        return true;
    }else{
        return false;
    }
}
function esWeekColumn(hoy, fin){ 
    if( esMismoMes(hoy, fin) && esMismoAnio(hoy, fin) && esMismaSemana(hoy, fin) ){
        console.log("misma semana");
        return true;
    }else{
        console.log("diferente semana");
        return false;
    }
}
function esMonthColumn(hoy, fin){
    if( esMismoMes(hoy, fin) && esMismoAnio(hoy, fin) ){
        return true;
    }else{
        return false;
    }
}

/* Funciones de Comparacion de Fechas */
function esMismoDia(fecha1, fecha2){
    console.log(fecha1 + " ::: " + fecha2);
    if(fecha1.getDate() === fecha2.getDate()){
        return true;
    }
    return false;
}
function esMismaSemana(fecha1, fecha2){
    const primerDiaSemana = fecha1.getDate() - fecha1.getDay() + 1;
    const ultimoDiaSemana = fecha1.getDate() + (7 - fecha1.getDay());
    if( (primerDiaSemana <= fecha2.getDate()) && (fecha2.getDate() <= ultimoDiaSemana) ){
        return true;
    }
    return false;
}
function esMismoMes(fecha1, fecha2){
    if(fecha1.getMonth() === fecha2.getMonth()){
        return true;
    }
    return false;
}
function esMismoAnio(fecha1, fecha2){
    if(fecha1.getFullYear() === fecha2.getFullYear()){
        return true;
    }
    return false;
}

/* Guardado y Carga de Tareas */
function guardarTareas(){
    localStorage.setItem("tareas-guardadas", JSON.stringify(arrayTareas));
}
function cargarTareas(){
    if(JSON.parse(localStorage.getItem("tareas-guardadas")) != null){
        arrayTareas = JSON.parse(localStorage.getItem("tareas-guardadas"));
        actualizarColumnas();
    }else{
        localStorage.setItem("tareas-guardadas", []);
    }
}

window.addEventListener("beforeunload", guardarTareas);
window.addEventListener("load", cargarTareas);