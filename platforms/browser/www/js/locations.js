var app = {
    inicio: function() {
        this.iniciaFastClick();
    },
    iniciaFastClick: function() {
        FastClick.attach(document.body);
    },
    dispositivoListo: function() {
        // navigator.geolocation.getCurrentPosition(app.pintaCoordenadasMapa, app.errorAlSolicitarLocalizacion);
        navigator.geolocation.watchPosition(app.dibujaCoordenadas,
                                                  app.errorAlSolicitarLocalizacion,
                                                  { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
    },
    dibujaCoordenadas: function(position) {
        var coordsDiv = document.querySelector("#coords");
        app.pintaCoordenadasMapa(position);
        coordsDiv.innerHTML = "Latitud: " + position.coords.latitude + " Longitud: " + position.coords.longitude;
    },
    errorAlSolicitarLocalizacion: function(error) {
        // console.log(error.code +": "+ error.message);
        alert(error.code + ": " + error.message);
    },
    pintaCoordenadasMapa: function(position) {
    	var arrayPos = [position.coords.latitude, position.coords.longitude];
        var miMapa = L.map("map").setView(arrayPos, 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVjbm9sb2dlciIsImEiOiJjaXkzZDU1b24wMDAwMnF0OWVmMGVnYjc5In0.jhjh02EMcRdv-hL1rrrKlg', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }).addTo(miMapa);
        
        var newPin = L.icon({
		    iconUrl: 'img/pin.png',
		    iconSize:    [25, 41],
			iconAnchor:  [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28]
		});

        var circle = L.circle(arrayPos, {
		    color: 'red',
		    // fillColor: '#f03',
		    fillOpacity: 0,
		    radius: 1000
		}).addTo(miMapa);

        app.pintaMarcador(arrayPos, "Estoy aqui!", miMapa, newPin);

        miMapa.on("click", function(event){
        	var text = "Marcador en l("+event.latlng.lat.toFixed(2)+") y L("+event.latlng.lng.toFixed(2)+")";
        	app.pintaMarcador(event.latlng, text, miMapa);
        });
    },
    pintaMarcador: function(lat_lng, text, map, pin){
    	if(pin)
    		var marcador = L.marker(lat_lng, {icon: pin}).addTo(map);
    	else 
    		var marcador = L.marker(lat_lng).addTo(map);
    	marcador.bindPopup(text).openPopup();
    }
};

if ("addEventListener" in document) {
    document.addEventListener("DOMContentLoaded", function() {
        app.inicio();
    }, false);

    document.addEventListener("deviceready", function() {
        app.dispositivoListo();
    }, false);
}
