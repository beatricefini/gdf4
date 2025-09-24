document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('modelsContainer');
  const markerEl = document.getElementById('marker');

  const models = [
    '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6','#piece7'
  ];
  let currentIndex = 0;

  // Debug: controlliamo se container esiste
  if (!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  // Quando il marker viene rilevato
  markerEl.addEventListener('markerFound', () => {
    console.log("📍 Marker trovato!");

    if(currentIndex >= models.length) {
      console.log("ℹ️ Tutti i modelli già aggiunti.");
      return;
    }

    const modelEl = document.createElement('a-entity');
    modelEl.setAttribute('gltf-model', models[currentIndex]);
    modelEl.setAttribute('scale', { x:0.2, y:0.2, z:0.2 }); // più piccolo
    modelEl.setAttribute('position', { x:0, y:0.1, z:0 }); // sopra il marker

    container.appendChild(modelEl);

    console.log(`✅ Modello aggiunto: ${models[currentIndex]}`, modelEl);

    currentIndex++;
  });
});
