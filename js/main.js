document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const sceneEl = document.querySelector('a-scene');
  const container = document.getElementById('modelsContainer');

  if (!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  const models = [
    '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6'
  ];
  let modelsAdded = false;

  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    if (modelsAdded) return;
    modelsAdded = true;

    // Aggiungi piece1–6 con delay breve
    models.forEach((modelId, index) => {
      setTimeout(() => {
        const modelEl = document.createElement('a-entity');
        modelEl.setAttribute('gltf-model', modelId);
        modelEl.setAttribute('scale', { x:1, y:1, z:1 });
        modelEl.setAttribute('position', { x:0, y:-0.5, z:0 });

        modelEl.addEventListener('model-loaded', () => {
          console.log(`✅ Modello caricato: ${modelId}`);
        });
        modelEl.addEventListener('model-error', (err) => {
          console.error(`❌ Errore caricamento: ${modelId}`, err);
        });

        container.appendChild(modelEl);
        console.log(`📦 Modello aggiunto: ${modelId}`);
      }, index * 200);
    });

    // Aggiungi piece7 separatamente dopo 1 secondo
    setTimeout(() => {
      const piece7El = document.createElement('a-entity');
      piece7El.setAttribute('gltf-model', '#piece7');
      piece7El.setAttribute('scale', { x:1, y:1, z:1 });
      piece7El.setAttribute('position', { x:0, y:-0.5, z:0 });

      piece7El.addEventListener('model-loaded', () => {
        console.log("✅ piece7 caricato correttamente");
      });
      piece7El.addEventListener('model-error', (err) => {
        console.error("❌ Errore caricamento piece7", err);
      });

      container.appendChild(piece7El);
      console.log("📦 piece7 aggiunto al container");
    }, 1000);
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
