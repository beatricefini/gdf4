document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const container = document.getElementById('modelsContainer');
  const sceneEl = document.querySelector('a-scene');

  if(!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  const models = [
    '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6','#piece7'
  ];

  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    models.forEach((modelId, index) => {
      setTimeout(() => {
        const modelEl = document.createElement('a-entity');
        modelEl.setAttribute('gltf-model', modelId);
        modelEl.setAttribute('scale', { x:1, y:1, z:1 });
        modelEl.setAttribute('position', { x:0, y:-0.5, z:0 });

        // Rotazione iniziale casuale (instabile)
        const rotX = (Math.random() - 0.5) * 20; // ±10°
        const rotY = (Math.random() - 0.5) * 20;
        modelEl.setAttribute('rotation', { x: rotX, y: rotY, z: 0 });

        // Animazione pop-up dal pavimento
        modelEl.setAttribute('animation__popup', {
          property: 'position',
          from: `0 -0.5 0`,
          to: `0 0 0`,
          dur: 800,
          easing: 'easeOutElastic'
        });

        // Animazione per stabilizzare la rotazione
        modelEl.setAttribute('animation__stabilize', {
          property: 'rotation',
          to: '0 0 0',
          dur: 600,
          easing: 'easeOutQuad',
          delay: 300 // parte dopo il pop-up iniziale
        });

        modelEl.addEventListener('model-loaded', () => {
          console.log(`✅ Modello caricato: ${modelId}`);
        });
        modelEl.addEventListener('model-error', (err) => {
          console.error(`❌ Errore caricamento: ${modelId}`, err);
        });

        container.appendChild(modelEl);
        console.log(`📦 Modello aggiunto: ${modelId}`);
      }, index * 500); // delay tra un modello e l'altro
    });
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
