document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('modelsContainer');
  const markerEl = document.getElementById('marker');

  const models = [
    '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6','#piece7'
  ];
  let currentIndex = 0;

  if (!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  markerEl.addEventListener('markerFound', () => {
    console.log("📍 Marker trovato!");

    if(currentIndex >= models.length) {
      console.log("ℹ️ Tutti i modelli già aggiunti.");
      return;
    }

    const modelId = models[currentIndex];
    const modelEl = document.createElement('a-entity');
    modelEl.setAttribute('gltf-model', modelId);
    modelEl.setAttribute('scale', { x:0.2, y:0.2, z:0.2 });
    modelEl.setAttribute('position', { x:0, y:0.1, z:0 });

    // Debug: log se caricato o errore
    modelEl.addEventListener('model-loaded', () => {
      console.log(`✅ Modello caricato correttamente: ${modelId}`);
    });
    modelEl.addEventListener('model-error', (err) => {
      console.error(`❌ Errore caricamento modello: ${modelId}`, err);
    });

    container.appendChild(modelEl);

    console.log(`📦 Modello aggiunto al container: ${modelId}`);
    currentIndex++;
  });
});
