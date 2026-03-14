let audioCtx, node, gainNode;
let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0, z1=0, z2=0, g1=0, g2=0;

document.getElementById('toggleBtn').onclick = () => {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = document.getElementById('gain').value;
        
        node = audioCtx.createScriptProcessor(4096, 0, 1);
        node.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            const color = document.getElementById('colorSelect').value;
            for (let i = 0; i < output.length; i++) {
                let white = Math.random() * 2 - 1;
                let out = white;
                if (color === 'pink') {
                    b0 = 0.99886*b0 + white*0.0555; b1 = 0.99332*b1 + white*0.075;
                    out = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white*0.53) * 0.11;
                } else if (color === 'brown') {
                    b0 = (b0 + (0.02 * white)) / 1.02; out = b0 * 3.5;
                } else if (color === 'blue') {
                    out = white - z1; z1 = white;
                } else if (color === 'purple') {
                    let t = white - z1; z1 = white; out = t - z2; z2 = t;
                } else if (color === 'black') {
                    b0 = b0 + 0.05 * (white - b0); out = b0;
                } else if (color === 'green') {
                    g1 = 0.98 * g1 + 0.1 * white; g2 = 0.95 * g2 + 0.1 * g1; out = g1 - g2;
                } else if (color === 'grey') {
                    out = white * 0.7;
                }
                output[i] = out;
            }
        };
        node.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        document.getElementById('toggleBtn').innerText = "Stop AuraNoise";
    } else {
        audioCtx.close();
        audioCtx = null;
        document.getElementById('toggleBtn').innerText = "Start AuraNoise";
    }
};

document.getElementById('gain').oninput = (e) => {
    if (gainNode) gainNode.gain.setTargetAtTime(e.target.value, audioCtx.currentTime, 0.05);
};