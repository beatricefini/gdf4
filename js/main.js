document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const container = document.getElementById('modelsContainer');
  if(!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  const models = [
    '#piece1',
    '#piece2',
    '#piece3',
    '#piece4',
    '#piece5',
    '#piece6',
    '#piece7'
  ];

  let currentIndex = 0;

  // Video HTML per piece7
  const video7 = document.createElement('video');
  video7.setAttribute('id', 'video7');
  video7.setAttribute('src', 'video/piece7.mp4');
  video7.setAttribute('loop', '');
  video7.setAttribute('autoplay', 'false');
  video7.setAttribute('playsinline', '');
  video7.setAttribute('webkit-playsinline', '');
  document.body.appendChild(video7);

  // --- Scritta iniziale ---
  const startText = document.createElement('a-text');
  startText.setAttribute('id', 'startText');
  startText.setAttribute('value', 'Tap the screen\nto create your\nown little cinema');
  startText.setAttribute('align', 'center');
  startText.setAttribute('color', '#FFFFFF');
  startText.setAttribute('position', { x:0, y:0.5, z:0 }); // più vicino al pavimento
  startText.setAttribute('scale', { x:3, y:3, z:3 });
  startText.setAttribute('width', '2');
  startText.setAttribute('font', 'mozillavr');
  container.appendChild(startText);

  let firstClick = true;

  window.addEventListener('click', () => {
    if(firstClick){
      if(startText) startText.setAttribute('visible','false');
      firstClick = false;
      return;
    }

    if(currentIndex >= models.length) return;

    const piece = document.createElement('a-entity');
    piece.setAttribute('gltf-model', models[currentIndex]);
    piece.setAttribute('scale', { x:1, y:1, z:1 });

    // Posizione sul pavimento, leggero offset casuale x/z
    const offsetX = (Math.random()-0.5)*0.2;
    const offsetZ = (Math.random()-0.5)*0.2;
    piece.setAttribute('position', { x:offsetX, y:-1, z:offsetZ });

    // Rotazione iniziale instabile
    const rotX = (Math.random()-0.5)*20;
    const rotY = (Math.random()-0.5)*20;
    piece.setAttribute('rotation', { x: rotX, y: rotY, z: 0 });

    // Animazione “pop-up” verticale con instabilità
    piece.setAttribute('animation__popup', {
      property: 'position',
      from: `0 -1 0`,
      to: `0 0 0`,
      dur: 800,
      easing: 'easeOutElastic'
    });

    // Stabilizzazione rotazione
    piece.setAttribute('animation__stabilize', {
      property: 'rotation',
      to: '0 0 0',
      dur: 600,
      easing: 'easeOutQuad',
      delay: 300
    });

    // Assegna id a piece7
    if(currentIndex === models.length - 1){
      piece.setAttribute('id','piece7');
    }

    piece.addEventListener('model-loaded', () => {
      console.log(`✅ Modello caricato: ${models[currentIndex]}`);
    });

    container.appendChild(piece);
    console.log(`📦 Modello aggiunto: ${models[currentIndex]}`);
    currentIndex++;

    // Video su piece7 dopo 3 secondi dall’ultimo tap
    if(currentIndex === models.length){
      console.log("⏱ Tutti i pezzi aggiunti, avvio video in 3s...");
      setTimeout(() => {
        const piece7El = document.getElementById('piece7');
        if(!piece7El){
          console.error("❌ piece7 non trovato!");
          return;
        }
        console.log("✅ piece7 trovato, aspetto che il modello sia caricato...");

        piece7El.addEventListener('model-loaded', () => {
          console.log("✅ piece7 modello caricato, applico video");

          const mesh = piece7El.getObject3D('mesh');
          if(!mesh){
            console.error("❌ Mesh di piece7 non trovata!");
            return;
          }

          mesh.traverse(node => {
            if(node.isMesh){
              const videoTexture = new THREE.VideoTexture(video7);
              videoTexture.flipY = false;
              videoTexture.center.set(0.5,0.5);
              videoTexture.repeat.x = -1;
              node.material.map = videoTexture;
              node.material.needsUpdate = true;
            }
          });

          video7.play()
            .then(() => console.log("✅ Video piece7 avviato"))
            .catch(e => console.error("❌ Impossibile avviare il video:", e));
        });
      }, 3000);
    }
  });
});
