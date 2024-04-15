let map;
let markers = [];
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -6.530731, lng: -49.851650 },
        zoom: 13,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    map.addListener("click", (event) => {
        addMarker(event.latLng);
    });
}

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true 
    });
    markers.push(marker);
    displayPoint(location, markers.length);
}

function displayPoint(location, index) {
    const pointList = document.getElementById("pointList");
    const li = document.createElement("li");
    li.innerHTML = `
    <div class="point-info">
        <strong>Ponto ${index}</strong><br>
        <strong>Coordenadas:</strong> Latitude: ${location.lat().toFixed(6)}, Longitude: ${location.lng().toFixed(6)}<br>
        <strong>Endereço:</strong> <span id="address_${index}">Aguardando Endereço...</span>
        <button onclick="removeMarker(${index})" class="btn btn-remove-marker">Remover</button>
    </div>
`;
    pointList.appendChild(li);

    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {
                const addressElement = document.getElementById(`address_${index}`);
                addressElement.textContent = results[0].formatted_address;
            } else {
                window.alert("Nenhum resultado encontrado para estas coordenadas.");
            }
        } else {
            window.alert("Falha ao obter o endereço: " + status);
        }
    });
}

function generateRoute() {
    if (markers.length < 2) {
        window.alert("Adicione pelo menos dois pontos para gerar a rota.");
        return;
    }

    const waypoints = markers.map(marker => ({
        location: marker.getPosition(),
        stopover: true
    }));

    const request = {
        origin: markers[0].getPosition(),
        destination: markers[markers.length - 1].getPosition(),
        waypoints: waypoints.slice(1, -1),
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            let tempoEstimado = 0;
            let distanciaRota = 0;
            route.legs.forEach(leg => {
                tempoEstimado += leg.duration.value;
                distanciaRota += leg.distance.value;
            });
            tempoEstimado = Math.round(tempoEstimado / 60); // Convertendo para minutos
            distanciaRota = (distanciaRota / 1000).toFixed(2); // Convertendo para quilômetros com duas casas decimais
            document.getElementById("tempoEstimado").value = tempoEstimado + " minutos";
            document.getElementById("distanciaRota").value = distanciaRota + " km";
        } else {
            window.alert("Falha ao gerar a rota: " + status);
        }
    });
}

function removeMarker(index) {
    markers[index - 1].setMap(null); // Remover o marcador do mapa
    markers.splice(index - 1, 1); // Remover o marcador do array
    updatePointList(); // Atualizar a lista de pontos
}

function moveMarker(index) {
    markers[index - 1].setMap(null); // Remover o marcador do mapa
    markers[index - 1] = new google.maps.Marker({ // Criar um novo marcador com draggable
        position: markers[index - 1].getPosition(),
        map: map,
        draggable: true
    });
    google.maps.event.addListener(markers[index - 1], 'dragend', function (event) {
        updatePointList(); // Atualizar a lista de pontos quando o marcador for movido
    });
    updatePointList(); // Atualizar a lista de pontos
}

function updatePointList() {
    const pointList = document.getElementById("pointList");
    pointList.innerHTML = ""; // Limpar a lista de pontos
    markers.forEach((marker, index) => {
        displayPoint(marker.getPosition(), index + 1); // Exibir novamente os pontos atualizados
    });
}

function undoLastMarker() {
    if (markers.length > 0) {
        markers.pop().setMap(null); // Remover o último marcador adicionado
        updatePointList(); // Atualizar a lista de pontos
    } else {
        window.alert("Não há pontos para remover.");
    }
}


// Supondo que você tenha um formulário HTML com IDs correspondentes aos campos
const form = document.getElementById('formCadastroRotas');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/cadastrar-rota', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Mensagem de sucesso
        } else {
            console.error('Erro ao cadastrar rota:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao enviar dados do formulário:', error);
    }
});
