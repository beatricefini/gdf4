document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const container = document.getElementById('modelsContainer');
  if (!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  const sceneEl = document.querySelector('a-scene');

  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    // Aggiungi solo piece7
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
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
