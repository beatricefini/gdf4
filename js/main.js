document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const sceneEl = document.querySelector('a-scene');
  const container = document.getElementById('modelsContainer');

  // Test rapido: log se il container esiste
  if (!container) {
    console.error("❌ modelsContainer non trovato!");
    return;
  }

  // Quando MindAR è pronto
  sceneEl.addEventListener("arReady", () => {
    console.log("✅ AR pronta");
  });

  // Quando il marker viene trovato
  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    // Aggiungiamo il modello piece1
    const modelEl = document.createElement('a-entity');
    modelEl.setAttribute('gltf-model', '#piece1'); // usa id da <a-assets>
    modelEl.setAttribute('scale', { x:0.2, y:0.2, z:0.2 }); // scala più piccola
    modelEl.setAttribute('position', { x:0, y:0.1, z:0 }); // leggermente sopra il marker

    // Debug eventi modello
    modelEl.addEventListener('model-loaded', () => {
      console.log("✅ Modello piece1 caricato correttamente");
    });
    modelEl.addEventListener('model-error', (err) => {
      console.error("❌ Errore caricamento modello piece1", err);
    });

    container.appendChild(modelEl);
    console.log("📦 Modello piece1 aggiunto al container");
  });

  // Quando il marker non è più visibile
  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
