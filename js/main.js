document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const container = document.getElementById('modelsContainer');
  if (!container) {
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
  const baseHeight = -0.5;        // Altezza dei modelli (es. pavimento)
  const baseScale = 0.7;          // Scala base dei modelli
  const scaleOffset = 0.1;        // Variazione casuale scala
  const popupDuration = 800;      // Durata animazione pop-up
  const stabilizeDuration = 600;  // Durata stabilizzazione rotazione
  const reversePopDuration = 400; // Durata pop inverso

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
  startText.setAttribute('position', { x: 0, y: baseHeight + 0.8, z: 0 });
  startText.setAttribute('scale', { x: 1.2, y: 1.2, z: 1.2 });
  startText.setAttribute('width', '2');
  startText.setAttribute('font', 'mozillavr');
  container.appendChild(startText);

  let firstClick = true;

  window.addEventListener('click', () => {
    if (firstClick) {
      if (startText) startText.setAttribute('visible', 'false');
      firstClick = false;
      return;
    }

    if (currentIndex >= models.length) return;

    const piece = document.createElement('a-entity');
    piece.setAttribute('gltf-model', models[currentIndex]);

    // Scala casuale leggermente variata
    const finalScale = baseScale + (Math.random() - 0.5) * scaleOffset;
    piece.setAttribute('scale', { x: finalScale, y: finalScale, z: finalScale });

    // Posizione sul pavimento con piccolo offset casuale
    const offsetX = (Math.random() - 0.5) * 0.2;
    const offsetZ = (Math.random() - 0.5) * 0.2;
    piece.setAttribute('position', { x: offsetX, y: baseHeight, z: offsetZ });

    // Rotazione iniziale instabile
    const rotX = (Math.random() - 0.5) * 20;
    const rotY = (Math.random() - 0.5) * 20;
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
    if (currentIndex === models.length - 1) {
      piece.setAttribute('id', 'piece7');

      piece.addEventListener('model-loaded', () => {
        console.log("✅ piece7 modello caricato, avvio video tra 3 secondi...");

        setTimeout(() => {
          const mesh = piece.getObject3D('mesh');
          if (!mesh) {
            console.error("❌ Mesh di piece7 non trovata!");
            return;
          }

          mesh.traverse(node => {
            if (node.isMesh) {
              const videoTexture = new THREE.VideoTexture(video7);
              videoTexture.flipY = false;
              videoTexture.center.set(0.5, 0.5);
              videoTexture.repeat.x = -1;
              node.material.map = videoTexture;
              node.material.needsUpdate = true;
            }
          });

          video7.play()
            .then(() => console.log("✅ Video piece7 avviato dopo 3s"))
            .catch(e => console.error("❌ Impossibile avviare il video:", e));

          // Dopo 4 secondi dall'inizio del video → animazione finale
          setTimeout(() => {
            removeAllPiecesAndShowFinal();
          }, 4000);
        }, 3000);
      });
    }

    piece.addEventListener('model-loaded', () => {
      console.log(`✅ Modello caricato: ${models[currentIndex]}`);
    });

    container.appendChild(piece);
    console.log(`📦 Modello aggiunto: ${models[currentIndex]}`);
    currentIndex++;
  });

  // --- Funzione per rimuovere i modelli con pop inverso e mostrare il finale ---
  function removeAllPiecesAndShowFinal() {
    const pieces = Array.from(container.querySelectorAll('a-entity[gltf-model]'));

    pieces.forEach((piece, i) => {
      piece.setAttribute('animation__shrink', {
        property: 'scale',
        to: '0 0 0',
        dur: reversePopDuration,
        easing: 'easeInBack',
        delay: i * 150
      });

      setTimeout(() => {
        piece.parentNode.removeChild(piece);
      }, reversePopDuration + i * 150 + 50);
    });

    const totalDelay = pieces.length * 150 + reversePopDuration + 200;
    setTimeout(() => {
      createFinalModel();
    }, totalDelay);
  }

  // --- Mostra modello finale con pop e testi centrati ---
  function createFinalModel() {
    const finalModel = document.createElement('a-entity');
    finalModel.setAttribute('gltf-model', '#pieceCinema');
    finalModel.setAttribute('scale', '0 0 0');
    finalModel.setAttribute('position', { x: 0.25, y: baseHeight, z: 0 });

    finalModel.setAttribute('animation__pop', {
      property: 'scale',
      from: '0 0 0',
      to: '2 2 2',
      dur: 1200,
      easing: 'easeOutElastic'
    });

    container.appendChild(finalModel);

    // --- Testo "1994" centrato su X ---
    const text1994 = document.createElement('a-text');
    text1994.setAttribute('value', '1994');
    text1994.setAttribute('align', 'center');
    text1994.setAttribute('anchor', 'center');
    text1994.setAttribute('color', '#FFFFFF');
    text1994.setAttribute('position', { x: 0, y: baseHeight + 0.7, z: 0 });
    text1994.setAttribute('scale', '0.5 0.5 0.5');
    text1994.setAttribute('opacity', '0');
    text1994.setAttribute('animation__fadein', {
      property: 'opacity',
      from: 0,
      to: 1,
      dur: 800,
      easing: 'easeInQuad',
      delay: 200
    });
    container.appendChild(text1994);

    // --- Testo "Renovation" centrato su X ---
    const textRenovation = document.createElement('a-text');
    textRenovation.setAttribute('value', 'Renovation');
    textRenovation.setAttribute('align', 'center');
    textRenovation.setAttribute('anchor', 'center');
    textRenovation.setAttribute('color', '#FFFFFF');
    textRenovation.setAttribute('position', { x: 0, y: baseHeight + 0.55, z: 0 });
    textRenovation.setAttribute('scale', '0.35 0.35 0.35');
    textRenovation.setAttribute('opacity', '0');
    textRenovation.setAttribute('animation__fadein', {
      property: 'opacity',
      from: 0,
      to: 1,
      dur: 800,
      easing: 'easeInQuad',
      delay: 1200
    });
    container.appendChild(textRenovation);
  }
});

