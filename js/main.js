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

    // Aggiunge tutti i modelli in sequenza
    for (let i = modelsAdded; i < models.length; i++) {
      const modelEl = document.createElement('a-entity');
      modelEl.setAttribute('gltf-model', models[i]);
      modelEl.setAttribute('scale', { x:1, y:1, z:1 }); // scala uniforme 1 1 1
      modelEl.setAttribute('position', { x:0, y:0.1, z:0 });

      modelEl.addEventListener('model-loaded', () => {
        console.log(`✅ Modello caricato correttamente: ${models[i]}`);
      });
      modelEl.addEventListener('model-error', (err) => {
        console.error(`❌ Errore caricamento modello: ${models[i]}`, err);
      });

      container.appendChild(modelEl);
      console.log(`📦 Modello aggiunto al container: ${models[i]}`);
      modelsAdded++;
    }
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
