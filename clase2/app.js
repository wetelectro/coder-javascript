const htmlResultElement = document.getElementById("valordecuota");

let importe = prompt("Ingrese la cantidad que debe abonar");
let cuotas = prompt("Ingrese la cantidad de cuotas en la que desea abonar");

function calcularCantidadDeCuotas(importe, cuotas){
    let result;
    if(importe == undefined || cuotas == undefined){
        result = 0;
    }else{
        result = importe/cuotas;
    }

    alert("El valor de la cuota sera : " + result);

    return result;
}

htmlResultElement.innerHTML = calcularCantidadDeCuotas(importe, cuotas);