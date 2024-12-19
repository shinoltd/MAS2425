export function getUserMedia(constraints) {
    if (navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }
    
    const legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
        
    if (legacyApi) {
        return new Promise(function (resolve, reject) {
            legacyApi.bind(navigator)(constraints, resolve, reject);
        });
    }
}

export function getStream(type) {
    if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
        !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
        M.toast({html: 'User Media API wird nicht unterstützt.', classes: 'red'});
        return;
    }

    const constraints = {};
    constraints[type] = true;
    
    getUserMedia(constraints)
        .then(function (stream) {
            const mediaControl = document.querySelector('#' + type);
            
            if ('srcObject' in mediaControl) {
                mediaControl.srcObject = stream;
            } else if (navigator.mozGetUserMedia) {
                mediaControl.mozSrcObject = stream;
            } else {
                mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
            }
            
            mediaControl.play();
            M.toast({html: type + ' wurde erfolgreich aktiviert', classes: 'teal'});
        })
        .catch(function (err) {
            M.toast({html: 'Fehler: ' + err, classes: 'red'});
        });
}