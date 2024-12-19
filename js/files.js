export function initFileHandling() {
    const dropZone = document.getElementById('drop-zone');
    const fileList = document.getElementById('file-list');
    const fileCount = document.getElementById('file-count');

    // Drag & Drop Event Listener
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        readFiles(e.dataTransfer.files);
    });

    // File Input Event Listener
    document.getElementById('file-input').addEventListener('change', (e) => {
        readFiles(e.target.files);
    });

    // Write File Button
    document.getElementById('write-file').addEventListener('click', writeFile);
}

function getReadFile(reader, i) {
    return function() {
        const li = document.querySelector(`[data-idx="${i}"]`);
        if (li) {
            li.innerHTML += `<br>Dateiinhalt beginnt mit: "${reader.result.substr(0, 25)}..."`;
        }
    }
}

function readFiles(files) {
    const fileCount = document.getElementById('file-count');
    const fileList = document.getElementById('file-list');
    
    fileCount.textContent = files.length;
    fileList.innerHTML = '';

    for (let i = 0; i < files.length; ++i) {
        const item = document.createElement('li');
        item.setAttribute('data-idx', i);
        item.className = 'collection-item';
        const file = files[i];

        const reader = new FileReader();
        reader.addEventListener('load', getReadFile(reader, i));
        reader.readAsText(file);

        const date = file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'Unbekannt';
        item.innerHTML = `
            <div class="file-info">
                <strong>${file.name}</strong><br>
                Typ: ${file.type || 'Unbekannt'}<br>
                Größe: ${(file.size / 1024).toFixed(2)} KB<br>
                Zuletzt geändert: ${date}
            </div>
        `;
        fileList.appendChild(item);
    }
}

async function writeFile() {
    if (!('showSaveFilePicker' in window)) {
        M.toast({html: 'Native File System API wird nicht unterstützt', classes: 'red'});
        return;
    }
    
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: 'meine-notiz.txt',
            types: [{
                description: 'Text Files',
                accept: {'text/plain': ['.txt']},
            }],
        });
        
        const writable = await handle.createWritable();
        await writable.write('Hallo Welt von der PWA!');
        await writable.close();
        
        M.toast({html: 'Datei erfolgreich gespeichert', classes: 'teal'});
    } catch (error) {
        if (error.name !== 'AbortError') {
            M.toast({html: 'Fehler beim Speichern der Datei', classes: 'red'});
            console.error('Fehler beim Dateischreiben:', error);
        }
    }
}