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
  const baseHeight = -0.5;       // Altezza dei modelli (es. pavimento)
  const baseScale = 0.7;         // Scala base dei modelli
  const scaleOffset = 0.1;       // Variazione casuale della scala +/-10%
  const popupDuration = 800;     // Durata animazione pop-up
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
  startText.setAttribute('position', { x: 0, y: baseHeight + 1, z: 0 });
  startText.setAttribute('scale', { x: 3, y: 3, z: 3 });
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
            .then(() => {
              console.log("✅ Video piece7 avviato dopo 3s");
              // Dopo ~4s dall'inizio del video -> chiudi modelli e mostra finale
              setTimeout(() => {
                hideModelsAndShowFinal();
              }, 4000);
            })
            .catch(e => console.error("❌ Impossibile avviare il video:", e));
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

  // --- Animazione inversa solo scala a cascata dei modelli e comparsa finale ---
  function hideModelsAndShowFinal() {
    const children = Array.from(container.children).filter(c => c.tagName.toLowerCase() === 'a-entity');
    const delayBetween = 100; // ms tra l'inizio dell'animazione dei pezzi
    const animDuration = 400; // durata animazione scala

    children.forEach((child, i) => {
      child.setAttribute('animation__popdown_scale', {
        property: 'scale',
        to: '0 0 0',
        dur: animDuration,
        easing: 'easeInQuad',
        delay: i * delayBetween
      });

      setTimeout(() => {
        child.setAttribute('visible', 'false');
      }, animDuration + i * delayBetween);
    });

    // Mostra il modello finale dopo l'ultima animazione
    const totalDelay = animDuration + (children.length - 1) * delayBetween;
    setTimeout(() => {
      createFinalModel();
    }, totalDelay + 50);
  }

  // --- Mostra modello finale (piece_cinema4.glb) ---
  function createFinalModel() {
    const finalModel = document.createElement('a-entity');
    finalModel.setAttribute('gltf-model', '#pieceCinema');

    // Scala finale più grande (2x) e spostato leggermente a destra
    finalModel.setAttribute('scale', '2 2 2');
    finalModel.setAttribute('position', { x: 0.5, y: baseHeight, z: 0 });

    // Crescita dal basso (Y da 0 -> 2), con interpolazione fluida
    finalModel.setAttribute('animation__grow', {
      property: 'scale',
      from: '2 0 2',
      to: '2 2 2',
      dur: 1200,
      easing: 'easeOutElastic'
    });

    container.appendChild(finalModel);
  }
});

