// Variável global para armazenar o marcador
var marker;

// Função para inicializar o mapa
function initializeMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -6.530551137481605, lng: -49.85176024450633 },
        zoom: 12
    });
    // Adiciona um ouvinte de clique no mapa
    var clickListener = google.maps.event.addListener(map, 'click', function (event) {
        // Obtém as coordenadas do clique
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();

        // Atualiza os campos de entrada com as coordenadas
        document.getElementById('reglatEscola').value = latitude;
        document.getElementById('reglonEscola').value = longitude;

        // Define a posição para o marcador e para a geocodificação reversa
        var location = { lat: latitude, lng: longitude }; // Adicione esta linha


        // Se o marcador já existe, atualiza a posição
        if (marker) {
            marker.setPosition({ lat: latitude, lng: longitude });
        } else {
            // Caso contrário, adiciona um novo marcador com um ícone personalizado
            marker = new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                icon: '/assets/img/icones/escola-marker.png' // Adicione o caminho para o seu ícone personalizado aqui
            });
        }

        // Cria uma instância do serviço de Geocodificação
        var geocoder = new google.maps.Geocoder();

        // Solicita a geocodificação reversa para o local clicado
        geocoder.geocode({ 'location': location }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    // Preenche os campos do formulário com as informações do endereço
                    var address_components = results[0].address_components;
                    address_components.forEach(function (component) {
                        var types = component.types;
                        if (types.includes('route')) {
                            document.getElementById('inputAddressEscola').value = component.long_name;
                        }
                        if (types.includes('street_number')) {
                            document.getElementById('inputNumberEscola').value = component.long_name;
                        }
                        if (types.includes('postal_code')) {
                            document.getElementById('inputZipEscola').value = component.long_name;
                        }
                    });
                } else {
                    alert('Nenhum resultado encontrado');
                }
            } else {
                alert('Geocodificador falhou devido a: ' + status);
            }
        });
    });
}



// Carrega a API do Google Maps assincronamente
function loadGoogleMapScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCNHjbosI2sw_FV2pGeuYdEJsvI0AwA49A&callback=initializeMap';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAnaQD9q_1LApNGxclN7jJvuatl6YPa9ww&callback=initializeMap';
    document.body.appendChild(script);
}

// Chama a função de carregamento da API do Google Maps
loadGoogleMapScript();


  
