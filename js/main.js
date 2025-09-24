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
  let modelsAdded = false; // flag per aggiungere solo una volta

  sceneEl.addEventListener("arReady", () => {
    console.log("✅ AR pronta");
  });

  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    if (modelsAdded) return; // aggiungiamo solo la prima volta
    modelsAdded = true;

    // Aggiungi i modelli con delay crescente per stabilità
    models.forEach((modelId, index) => {
      setTimeout(() => {
        const modelEl = document.createElement('a-entity');
        modelEl.setAttribute('gltf-model', modelId);
        modelEl.setAttribute('scale', { x:1, y:1, z:1 });
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
      }, index * 200); // 200ms di differenza tra i modelli
    });
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
