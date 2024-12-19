import { calculateWorkingDays } from './arbeitstage.js';
import { getStream } from './media.js';
import { startLocationTracking, stopLocationTracking } from './location.js';
import { initDeviceOrientation, requestOrientationPermission } from './orientation.js';
import { checkStorage, requestPersistence } from './storage.js';

// Funktionen global verfügbar machen
window.getStream = getStream;
window.startLocationTracking = startLocationTracking;
window.stopLocationTracking = stopLocationTracking;
window.requestOrientationPermission = requestOrientationPermission;
window.requestPersistence = requestPersistence;

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // Sidenav initialisieren
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
    
    // Startseite anzeigen
    showPage('arbeitstage');
    
    // App initialisieren
    initializeApp();
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    const elem = document.querySelector('.sidenav');
    const instance = M.Sidenav.getInstance(elem);
    instance.close();
}

window.showPage = showPage;

function initializeApp() {
    const endOfYearDate = new Date('2024-12-31');
    const today = new Date();
    const daysUntilEndOfYear = calculateWorkingDays(today, endOfYearDate);
    document.getElementById('days-to-end-of-year').textContent = daysUntilEndOfYear;

    initDeviceOrientation();
    checkStorage();
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}