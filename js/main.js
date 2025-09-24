document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const sceneEl = document.querySelector('a-scene');
  const container = document.getElementById('modelsContainer');

  sceneEl.addEventListener("arReady", () => {
    console.log("✅ AR pronta");
  });

  sceneEl.addEventListener("targetFound", () => {
    console.log("📍 targetFound EVENT");

    // Test: carichiamo un modello
    const modelEl = document.createElement('a-entity');
    modelEl.setAttribute('gltf-model', '#piece1'); // riferimento da <a-assets>
    modelEl.setAttribute('scale', '0.2 0.2 0.2');
    modelEl.setAttribute('position', '0 0 0');

    container.appendChild(modelEl);

    console.log("✅ Modello aggiunto a container");
  });

  sceneEl.addEventListener("targetLost", () => {
    console.log("👋 targetLost EVENT");
  });
});
