const URL = 'https://api.bluelytics.com.ar/v2/latest';

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
        url: URL
    }).done((res) => { 
        precioBlue = res.blue.value_sell;
        precioOficial = res.oficial.value_sell;
        /* Reemplazar Textos */
        dBlue.innerText = dBlueText + precioBlue;
        dOficial.innerText = dOficialText + precioOficial;
        /* Calcular brecha */
        dBrecha.innerText = brechaText + calcularBrecha(precioOficial, precioBlue);
    });

}, 1000);