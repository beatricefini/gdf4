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
  let modelsAdded = false;

  sceneEl.addEventListener("arReady", () => {
    console.log("✅ AR pronta");
  });

  sceneEl.addEventListener("targetFound", async () => {
    console.log("📍 targetFound EVENT");

    if (modelsAdded) return;
    modelsAdded = true;

    for (let i = 0; i < models.length; i++) {
      const modelId = models[i];

      await new Promise((resolve) => {
        setTimeout(() => {
          const modelEl = document.createElement('a-entity');
          modelEl.setAttribute('gltf-model', modelId);
          modelEl.setAttribute('scale', { x:1, y:1, z:1 });
          modelEl.setAttribute('position', { x:0, y:0.1, z:0 });

          modelEl.addEventListener('model-loaded', () => {
            console.log(`✅ Modello caricato correttamente: ${modelId}`);
            resolve();
          });

          modelEl.addEventListener('model-error', (err) => {
            console.error(`❌ Errore caricamento modello: ${modelId}`, err);
            resolve(); // risolve comunque per non bloccare la sequenza
          });

          container.appendChild(modelEl);
          console.log(`📦 Modello aggiunto al container: ${modelId}`);
        }, i * 300); // delay 300ms tra modelli
      });
    }
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
