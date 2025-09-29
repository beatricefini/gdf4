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

  // --- CONFIGURAZIONI ---
  const baseHeight = -0.5;    // Altezza dei modelli (es. pavimento)
  const baseScale = 0.7;      // Scala base dei modelli
  const scaleOffset = 0.1;    // Variazione casuale della scala +/-10%
  const popupDuration = 800;  // Durata animazione pop-up
  const stabilizeDuration = 600; // Durata animazione stabilizzazione rotazione

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
  startText.setAttribute('position', { x:0, y:baseHeight + 1, z:0 }); 
  startText.setAttribute('scale', { x:3, y:3, z:3 });
  startText.setAttribute('width', '2');
  startText.setAttribute('font', 'mozillavr');
  container.appendChild(startText);

  let firstClick = true;

  // Flag per gestione cubo finale
  let allModelsAdded = false;
  let finalCubeTimeout = null;

  // Funzione per creare il cubo finale
  function createFinalCube() {
    const finalCube = document.createElement('a-box');
    finalCube.setAttribute('color', '#FF00FF'); // colore viola
    finalCube.setAttribute('depth', 0.5);
    finalCube.setAttribute('height', 0.5);
    finalCube.setAttribute('width', 0.5);
    finalCube.setAttribute('position', '0 0 -0.5'); // davanti alla camera
    finalCube.setAttribute('scale', '0.5 0.5 0.5');
    container.appendChild(finalCube);
    console.log("🎉 Cubo finale apparso!");
  }

  window.addEventListener('click', () => {
    if(firstClick){
      if(startText) startText.setAttribute('visible','false');
      firstClick = false;
      return;
    }

    if(currentIndex >= models.length) return;

    const piece = document.createElement('a-entity');
    piece.setAttribute('gltf-model', models[currentIndex]);

    // Scala casuale leggermente variata
    const finalScale = baseScale + (Math.random()-0.5)*scaleOffset;
    piece.setAttribute('scale', { x: finalScale, y: finalScale, z: finalScale });

    // Posizione sul pavimento con piccolo offset casuale
    const offsetX = (Math.random()-0.5)*0.2;
    const offsetZ = (Math.random()-0.5)*0.2;
    piece.setAttribute('position', { x:offsetX, y:baseHeight, z:offsetZ });

    // Rotazione iniziale instabile
    const rotX = (Math.random()-0.5)*20;
    const rotY = (Math.random()-0.5)*20;
    piece.setAttribute('rotation', { x: rotX, y: rotY, z: 0 });

    // Pop-up animazione verticale
    piece.setAttribute('animation__popup', {
      property: 'position',
      from: `0 ${baseHeight - 1} 0`,
      to: `0 ${baseHeight} 0`,
      dur: popupDuration,
      easing: 'easeOutElastic'
    });

    // Stabilizzazione rotazione
    piece.setAttribute('animation__stabilize', {
      property: 'rotation',
      to: '0 0 0',
      dur: stabilizeDuration,
      easing: 'easeOutQuad',
      delay: 300
    });

    // Se è piece7, assegna id e evento per il video
    if(currentIndex === models.length - 1){
      piece.setAttribute('id','piece7');

      piece.addEventListener('model-loaded', () => {
        console.log("✅ piece7 modello caricato, avvio video tra 3 secondi...");

        setTimeout(() => {
          const mesh = piece.getObject3D('mesh');
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
            .then(() => console.log("✅ Video piece7 avviato dopo 3s"))
            .catch(e => console.error("❌ Impossibile avviare il video:", e));

          // --- Gestione fine esperienza (dopo 4s video) ---
          finalCubeTimeout = setTimeout(() => {
            console.log("⏳ Tutti i modelli spariscono, cubo finale in arrivo...");

            // Nascondi tutti i modelli e testi
            const children = Array.from(container.children);
            children.forEach(child => {
              child.setAttribute('visible', 'false');
            });

            // Mostra il cubo finale
            createFinalCube();
          }, 4000);

        }, 3000); // 3s prima di avviare il video
      });
    }

    piece.addEventListener('model-loaded', () => {
      console.log(`✅ Modello caricato: ${models[currentIndex]}`);
    });

    container.appendChild(piece);
    console.log(`📦 Modello aggiunto: ${models[currentIndex]}`);
    currentIndex++;
  });
});
