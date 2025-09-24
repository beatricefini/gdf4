document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('modelsContainer');
  const markerEl = document.getElementById('marker');

  const models = [
    '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6','#piece7'
  ];
  let currentIndex = 0;

  // Quando il marker viene rilevato
  markerEl.addEventListener('markerFound', () => {
    if(currentIndex >= models.length) return;

    const modelEl = document.createElement('a-entity');
    modelEl.setAttribute('gltf-model', models[currentIndex]);
    modelEl.setAttribute('scale', { x:0.5, y:0.5, z:0.5 }); // scala di default
    container.appendChild(modelEl);

    console.log(`Modello aggiunto: ${models[currentIndex]}`);
    currentIndex++;
  });
});

