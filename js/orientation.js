export function initDeviceOrientation() {
    if ('DeviceOrientationEvent' in window) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            document.getElementById('orientationPermission').style.display = 'block';
        } else {
            window.addEventListener('deviceorientation', deviceOrientationHandler, false);
            M.toast({html: 'Geräteorientierung aktiviert', classes: 'teal'});
        }
    }
}

export function requestOrientationPermission() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response === 'granted') {
                window.addEventListener('deviceorientation', deviceOrientationHandler, false);
                document.getElementById('orientationPermission').style.display = 'none';
                M.toast({html: 'Geräteorientierung aktiviert', classes: 'teal'});
            }
        })
        .catch(console.error);
}

export function deviceOrientationHandler(eventData) {
    const tiltLR = eventData.gamma;
    const tiltFB = eventData.beta;
    const dir = eventData.alpha;

    document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR || 0);
    document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB || 0);
    document.getElementById("doDirection").innerHTML = Math.round(dir || 0);

    const logo = document.getElementById("imgLogo");
    logo.style.transform = `
        rotateY(${tiltLR}deg) 
        rotateX(${tiltFB * -1}deg) 
        rotateZ(${dir}deg)
    `;
}