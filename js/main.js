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

    // Aggiungiamo i modelli in sequenza, uno alla volta
    models.forEach((modelId, index) => {
      setTimeout(() => {
        const modelEl = document.createElement('a-entity');
        modelEl.setAttribute('gltf-model', modelId);
        modelEl.setAttribute('scale', { x:1, y:1, z:1 });
        modelEl.setAttribute('position', { x:0, y:-0.5, z:0 });

        // Evento caricamento modello
        modelEl.addEventListener('model-loaded', () => {
          console.log(`✅ Modello caricato: ${modelId}`);
        });
        modelEl.addEventListener('model-error', (err) => {
          console.error(`❌ Errore caricamento: ${modelId}`, err);
        });

        container.appendChild(modelEl);
        console.log(`📦 Modello aggiunto: ${modelId}`);
      }, index * 500); // delay 0.5s tra un modello e l'altro
    });
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
