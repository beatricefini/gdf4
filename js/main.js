document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const markerEl = document.getElementById('marker');
  if (!markerEl) {
    console.error("❌ marker non trovato nel DOM");
    return;
  }

  markerEl.addEventListener('markerFound', () => {
    console.log("📍 markerFound EVENT partito!");
  });

  markerEl.addEventListener('markerLost', () => {
    console.log("👋 markerLost EVENT partito!");
  });
});
