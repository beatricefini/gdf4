document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 main.js avviato");

  const sceneEl = document.querySelector('a-scene');
  sceneEl.addEventListener("arReady", () => {
    console.log("✅ AR pronta");
  });

  sceneEl.addEventListener("targetFound", (e) => {
    console.log("📍 targetFound EVENT:", e);
  });

  sceneEl.addEventListener("targetLost", (e) => {
    console.log("👋 targetLost EVENT:", e);
  });
});
