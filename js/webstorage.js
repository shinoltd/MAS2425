let selectedEngine;
let logTarget;
let valueInput;

export function initWebStorage() {
    if (!('localStorage' in window) && !('sessionStorage' in window)) {
        M.toast({html: 'Web Storage wird nicht unterstützt', classes: 'red'});
        return;
    }

    logTarget = document.getElementById('storage-log');
    valueInput = document.getElementById('storage-value');

    // Radio Buttons Listener
    const radios = document.querySelectorAll('#selectEngine input');
    for (let radio of radios) {
        radio.addEventListener('change', function() {
            selectEngine(this.value);
        });
    }

    // Input Listener
    valueInput.addEventListener('keyup', function() {
        window[selectedEngine].setItem('myKey', this.value);
    });

    // Storage Event Listener
    window.addEventListener('storage', onStorageChanged);

    // Initial Engine Selection
    selectEngine('localStorage');
}

function selectEngine(engine) {
    selectedEngine = engine;
    reloadInputValue();
}

function reloadInputValue() {
    valueInput.value = window[selectedEngine].getItem('myKey') || '';
}

function handleChange(change) {
    const timeBadge = new Date().toLocaleTimeString();
    const newState = document.createElement('p');
    newState.innerHTML = `${timeBadge} ${change}`;
    logTarget.appendChild(newState);
}

function onStorageChanged(event) {
    const engine = event.storageArea === window.localStorage ? 'localStorage' : 'sessionStorage';
    handleChange(`Externe Änderung in ${engine}: Schlüssel ${event.key} wurde von "${event.oldValue}" zu "${event.newValue}" geändert`);
    if (engine === selectedEngine) {
        reloadInputValue();
    }
}