document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const sceneEl = document.querySelector('a-scene');
  const container = document.getElementById('modelsContainer');

  if (!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  const models = [
    '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6','#piece7'
  ];
  let modelsAdded = 0;

  sceneEl.addEventListener("arReady", () => {
    console.log("✅ AR pronta");
  });

  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    for (let i = modelsAdded; i < models.length; i++) {
      const modelId = models[i]; // variabile locale per closure

      const modelEl = document.createElement('a-entity');
      modelEl.setAttribute('gltf-model', modelId);
      modelEl.setAttribute('scale', { x:1, y:1, z:1 }); // scala uniforme
      modelEl.setAttribute('position', { x:0, y:0.1, z:0 });

      // Eventi di debug
      modelEl.addEventListener('model-loaded', () => {
        console.log(`✅ Modello caricato correttamente: ${modelId}`);
      });
      modelEl.addEventListener('model-error', (err) => {
        console.error(`❌ Errore caricamento modello: ${modelId}`, err);
      });

      container.appendChild(modelEl);
      console.log(`📦 Modello aggiunto al container: ${modelId}`);
      modelsAdded++;
    }
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
