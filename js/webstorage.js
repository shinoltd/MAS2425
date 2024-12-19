export function initWebStorage() {
    if (!('localStorage' in window) && !('sessionStorage' in window)) {
        M.toast({html: 'Web Storage wird nicht unterstützt', classes: 'red'});
        return;
    }

    logTarget = document.getElementById('storage-log');
    valueInput = document.getElementById('storage-value');

    // Input Listener für direkte Speicherung bei Eingabe
    valueInput?.addEventListener('input', function() {
        // Speichern bei jeder Eingabe
        const value = this.value;
        try {
            window[selectedEngine].setItem('myKey', value);
            handleChange(`Wert gespeichert in ${selectedEngine}: "${value}"`);
        } catch (e) {
            M.toast({html: 'Fehler beim Speichern: ' + e.message, classes: 'red'});
        }
    });

    // Radio Buttons für Storage-Auswahl
    const radios = document.querySelectorAll('#selectEngine input');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            selectEngine(this.value);
            M.toast({html: `Gewechselt zu ${this.value}`, classes: 'teal'});
        });
    });

    // Initial Setup
    selectEngine('localStorage');

    // Storage Event Listener für Änderungen in anderen Tabs
    window.addEventListener('storage', onStorageChanged);
}

function selectEngine(engine) {
    selectedEngine = engine;
    reloadInputValue();
}

function reloadInputValue() {
    const value = window[selectedEngine].getItem('myKey');
    if (valueInput) {
        valueInput.value = value || '';
        // Label aktivieren, wenn Wert vorhanden
        if (value) {
            valueInput.classList.add('active');
        }
    }
}

function handleChange(message) {
    const timeBadge = new Date().toLocaleTimeString();
    const newState = document.createElement('p');
    newState.className = 'storage-log-entry';
    newState.innerHTML = `${timeBadge}: ${message}`;
    if (logTarget) {
        logTarget.insertBefore(newState, logTarget.firstChild);
    }
}

function onStorageChanged(event) {
    if (!event.key) return;
    
    const engine = event.storageArea === window.localStorage ? 'localStorage' : 'sessionStorage';
    handleChange(`Externe Änderung in ${engine}: "${event.oldValue}" → "${event.newValue}"`);
    
    if (engine === selectedEngine) {
        reloadInputValue();
    }
}