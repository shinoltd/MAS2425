let watchId;

export function appendLocation(location, verb) {
    verb = verb || 'aktualisiert';
    const locationList = document.getElementById('location-list');
    const newLocation = document.createElement('div');
    newLocation.className = 'collection-item';
    
    const lat = location.coords.latitude.toFixed(6);
    const lon = location.coords.longitude.toFixed(6);
    const timestamp = new Date().toLocaleTimeString();
    
    newLocation.innerHTML = `
        <span class="title">Standort ${verb}</span>
        <p>
            Breite: ${lat}<br>
            Länge: ${lon}<br>
            Zeit: ${timestamp}
        </p>
    `;
    
    locationList.insertBefore(newLocation, locationList.firstChild);
    
    if (locationList.children.length > 10) {
        locationList.removeChild(locationList.lastChild);
    }
}

export function startLocationTracking() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(location) {
                appendLocation(location, 'ermittelt');
                M.toast({html: 'Standort erfolgreich ermittelt', classes: 'teal'});
            },
            function(error) {
                M.toast({html: 'Fehler beim Ermitteln des Standorts: ' + error.message, classes: 'red'});
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        watchId = navigator.geolocation.watchPosition(
            function(location) {
                appendLocation(location);
            },
            function(error) {
                M.toast({html: 'Fehler bei der Standortüberwachung: ' + error.message, classes: 'red'});
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        document.getElementById('startTracking').style.display = 'none';
        document.getElementById('stopTracking').style.display = 'inline-block';
    }
}

export function stopLocationTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        M.toast({html: 'Standortüberwachung beendet', classes: 'teal'});
        document.getElementById('startTracking').style.display = 'inline-block';
        document.getElementById('stopTracking').style.display = 'none';
    }
}