const URL = 'https://api-dolar-argentina.herokuapp.com/api/';

let precioBlue;
let precioOficial;

const dBlue = document.getElementById('price-blue');
let dBlueText = 'Precio del Dolar Blue : $';

const dOficial = document.getElementById('price-oficial');
let dOficialText = 'Precio del Dolar Oficial : $';

const dBrecha = document.getElementById('brecha');
let brechaText = 'Brecha : ';

function calcularBrecha(oficial, blue){
    let res = ((blue * 100) / oficial) - 100;
    res = res.toFixed(2);
    return res + '%';
}

setInterval(() => {
    $.ajax({
        url: URL + 'dolarblue'
    }).done((res) => { 
        precioBlue = res.venta;
        dBlue.innerText = dBlueText + res.venta;
    });

    $.ajax({
        url: URL + 'dolaroficial'
    }).done((res) => { 
        precioOficial = res.venta;
        dOficial.innerText = dOficialText + res.venta;
    });

    dBrecha.innerText = brechaText + calcularBrecha(precioOficial, precioBlue);

}, 1000);