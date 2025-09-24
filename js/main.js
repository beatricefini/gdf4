document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const container = document.getElementById('modelsContainer');
  if(!container) console.error("❌ modelsContainer non trovato nel DOM!");

  const models = [
    'models/piece1.glb',
    'models/piece2.glb',
    'models/piece3.glb',
    'models/piece4.glb',
    'models/piece5.glb',
    'models/piece6.glb',
    'models/piece7.glb'
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
  startText.setAttribute('position', { x:0, y:1.5, z:-1 }); // leggermente sopra il pavimento
  startText.setAttribute('scale', { x:4, y:4, z:4 });
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
    piece.setAttribute('position', { x:0, y:-0.5, z:0 }); // pavimento

    // Rotazione casuale iniziale
    const rotX = (Math.random() - 0.5) * 20;
    const rotY = (Math.random() - 0.5) * 20;
    piece.setAttribute('rotation', { x: rotX, y: rotY, z: 0 });

    // Animazione pop-up verticale dal pavimento
    piece.setAttribute('animation__popup', {
      property: 'position',
      from: `0 -0.5 0`,
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

    // Video alla fine
    if(currentIndex === models.length){
      setTimeout(() => {
        const piece7El = document.getElementById('piece7');
        if(piece7El){
          const mesh = piece7El.getObject3D('mesh');
          if(mesh){
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
          }
          video7.play().catch(e => console.warn("Impossibile avviare il video:", e));
        }
      }, 3000);
    }
  });
});
