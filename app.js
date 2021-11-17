/* Proceso Principal */
main();

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
class Tareas{
    /* Array principal */
    static arrayTareas = [];
    /* Manipulacion del array */
    static agregarTarea(tarea){
        Tareas.arrayTareas.push(tarea);
        Columnas.actualizarColumnas();
    }
    static borrarTarea(id){
        Tareas.arrayTareas.forEach((tarea, index) => {
            if(tarea.id == id){
                Tareas.arrayTareas.splice(index,1)
                Columnas.actualizarColumnas();
            }
        });
    }
    static borrarTodasLasTareas(){
        Tareas.arrayTareas = [];
        Columnas.actualizarColumnas();
    }
    static finalizarTarea(id){
        Tareas.arrayTareas.forEach((tarea, index) => {
            if(tarea.id == id){
                tarea.finalizado = true;
                tarea.enProgreso = false;
                Columnas.actualizarColumnas();
            }
        });
    }
    static switchProgreso(id){
        Tareas.arrayTareas.forEach((tarea, index) => {
            if(tarea.id == id){
                tarea.enProgreso = !tarea.enProgreso;
                Columnas.actualizarColumnas();
            }
        });
    }

    /* Tareas */
    static crearTarea(nombre, info, fecha, hora){
        const ahora = new Date();
        const tiempoFinal = calcularTiempoFinal(fecha, hora);
        /* Modelo de Tarea */
        const tarea = {
            id: ahora.getTime().toString(),
            nombre: nombre,
            info: info,
            inicio: ahora,
            fin: tiempoFinal,
            enProgreso: false,
            finalizado: false,
            vencido: false
        };
        return tarea;
    }

    /* Guardado y Carga de Tareas */
    static guardarTareas = () => {
        if(Tareas.arrayTareas){
            localStorage.setItem("tareas-guardadas", JSON.stringify(Tareas.arrayTareas));
            Columnas.actualizarColumnas();
        }else{
            localStorage.setItem("tareas-guardadas", []);
        }
        
    }
    static cargarTareas = () => {
        if(JSON.parse(localStorage.getItem("tareas-guardadas")) != undefined){
            Tareas.arrayTareas = JSON.parse(localStorage.getItem("tareas-guardadas"));
            Columnas.actualizarColumnas();
        }else{
            localStorage.setItem("tareas-guardadas", []);
            Tareas.arrayTareas = [];
        }
    }
}

function crearTareaDOM(tarea){
    /* Crear tarea */
    const tareaDiv = document.createElement("div");
    tareaDiv.className = "tarea";
    tareaDiv.dataset.id = tarea.id;
    tareaDiv.id = tarea.id;
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
    buttonsDiv.className = "tarea__buttons";

    const buttonHaciendo = document.createElement("button");
    buttonHaciendo.innerText = "Empezar";
    buttonHaciendo.className = "tarea__btn";
    buttonHaciendo.addEventListener('click', () => {
        Tareas.switchProgreso(tarea.id);
    });

    const buttonFin = document.createElement("button");
    buttonFin.innerText = "Finalizado";
    buttonFin.className = "tarea__btn";
    buttonFin.addEventListener('click', () => {
        Tareas.finalizarTarea(tarea.id);
    });

    const buttonEliminar = document.createElement("button");
    buttonEliminar.innerText = "Borrar";
    buttonEliminar.className = "tarea__btn btn__borrar";
    buttonEliminar.addEventListener('click', (e) => {
        Tareas.borrarTarea(tarea.id);
    })

    /* Tarea Finalizada */
    if(tarea.finalizado){
        tareaDiv.classList.add('tarea--finalizada');
        buttonEliminar.classList.add('tarea__btn--desactivate');
        buttonHaciendo.classList.add('tarea__btn--desactivate');
    }

    /* Tarea En Progreso */
    if(tarea.enProgreso){
        tareaDiv.classList.add('tarea--on_progress');
        buttonHaciendo.innerText = "Pausar";
    }

    /* Unir botones */
    buttonsDiv.appendChild(buttonHaciendo);
    buttonsDiv.appendChild(buttonFin);
    buttonsDiv.appendChild(buttonEliminar);
    /* Unir todo */
    tareaDiv.appendChild(nombreElement);
    tareaDiv.appendChild(infoElement);
    tareaDiv.appendChild(finElement);
    tareaDiv.appendChild(buttonsDiv);

    return tareaDiv;
}

/* Procesado del Formulario */
class Formulario{
    /* Almacenamiento de los datos */
    static valores = { nombre: "", info: "", fecha: "", hora: "" };
    /* Elementos HTML del formulario */
    static formTarea = document.getElementById("form_tarea");
    static nombreTarea = document.getElementById("nombre_input");
    static horaTarea = document.getElementById("hora_input");
    static fechaTarea = document.getElementById("fecha_input");
    static infoTarea = document.getElementById("info_input");
    static btnTarea = document.getElementById("crear_tarea_btn");

    static actualizarValores(){
        Formulario.valores.nombre = Formulario.nombreTarea.value;
        Formulario.valores.info = Formulario.infoTarea.value;
        Formulario.valores.fecha = Formulario.fechaTarea.value;
        Formulario.valores.hora = Formulario.horaTarea.value;
        Formulario.mostrarValores();
    }

    static submit(e){
        e.preventDefault();
        Tareas.agregarTarea(Tareas.crearTarea(Formulario.valores.nombre, Formulario.valores.info, Formulario.valores.fecha, Formulario.valores.hora));
    }

    static mostrarValores(){
        console.log(JSON.stringify(Formulario.valores));
    }
}

Formulario.nombreTarea.addEventListener('input', Formulario.actualizarValores);
Formulario.horaTarea.addEventListener('input', Formulario.actualizarValores);
Formulario.fechaTarea.addEventListener('input', Formulario.actualizarValores);
Formulario.infoTarea.addEventListener('input', Formulario.actualizarValores);
Formulario.formTarea.addEventListener("submit", Formulario.submit);

/* Columnas de Tareas */
class Columnas{
    static columnaHoy = document.getElementById("today_column_content");
    static columnaSemana = document.getElementById("weekly_column_content");
    static columnaMes = document.getElementById("monthly_column_content");

    static actualizarColumnas(){
        if(Tareas.arrayTareas != undefined){
            const hoy = new Date();
            let arrayTareasAuxiliar = [...Tareas.arrayTareas];

            Columnas.columnaHoy.innerHTML = "";
            Columnas.columnaSemana.innerHTML = "";
            Columnas.columnaMes.innerHTML = "";

            let arrayHoy = [];
            let arraySemana = [];
            let arrayMes = [];

            arrayTareasAuxiliar.forEach((tarea) => {
                const fechaTareaDateType = new Date(tarea.fin);
                if(esTodayColumn(hoy, fechaTareaDateType)){
                    arrayHoy.push(tarea);
                }
                if(esWeekColumn(hoy, fechaTareaDateType)){
                    arraySemana.push(tarea);
                }
                if(esMonthColumn(hoy, fechaTareaDateType)){
                    arrayMes.push(tarea);
                }
            });

            arrayHoy = Columnas.ordenarPorFecha(arrayHoy);
            arraySemana = Columnas.ordenarPorFecha(arraySemana);
            arrayMes = Columnas.ordenarPorFecha(arrayMes);

            Columnas.renderHoyCol(arrayHoy);
            Columnas.renderWeekCol(arraySemana);
            Columnas.renderMonthCol(arrayMes);
        }
    }

    static ordenarPorFecha = (array) => {
        return array.sort((a,b) => {
            if(a.finalizado){
                return (new Date(a.fin).getTime() * 100) - new Date(b.fin).getTime();
            }
            if(b.finalizado){
                return new Date(a.fin).getTime() - (new Date(b.fin).getTime() * 100);
            }
            return new Date(a.fin).getTime() - new Date(b.fin).getTime();
        });
    }

    static renderHoyCol = (col) => {
        col.forEach((tarea) => {
            Columnas.columnaHoy.appendChild(crearTareaDOM(tarea));
        });
    }
    static renderWeekCol = (col) => {
        col.forEach((tarea) => {
            Columnas.columnaSemana.appendChild(crearTareaDOM(tarea));
        });
    }
    static renderMonthCol = (col) => {
        col.forEach((tarea) => {
            Columnas.columnaMes.appendChild(crearTareaDOM(tarea));
        });
    }
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
    if( !esMismoDia(hoy, fin) && esMismoMes(hoy, fin) && esMismoAnio(hoy, fin) && esMismaSemana(hoy, fin) ){
        return true;
    }else{
        return false;
    }
}
function esMonthColumn(hoy, fin){
    if( !esMismoDia(hoy, fin) && !esMismaSemana(hoy, fin) && esMismoMes(hoy, fin) && esMismoAnio(hoy, fin) ){
        return true;
    }else{
        return false;
    }
}

/* Funciones de Comparacion de Fechas */
function esMismoDia(fecha1, fecha2){
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

document.getElementById('borrar_todo').addEventListener('click', () => {
    Tareas.borrarTodasLasTareas();
});

window.addEventListener("beforeunload", Tareas.guardarTareas);
window.addEventListener("load", Tareas.cargarTareas);

/* Efectos Jquery */
$('header').animate({opacity: 1}, 1500);
$('form').delay(750).animate({opacity: 1}, 1500);
$('main').delay(1500).animate({opacity: 1}, 1500);
$('footer').animate({opacity: 1}, 1500);