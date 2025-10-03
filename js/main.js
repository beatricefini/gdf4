document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 main.js avviato");

  const sceneEl = document.querySelector("a-scene");
  const marker = document.getElementById("marker");
  const container = document.getElementById('modelsContainer');

  // --- Overlay iniziale count4.png ---
  const introOverlay = document.createElement("div");
  introOverlay.id = "introOverlay";
  introOverlay.style.position = "fixed";
  introOverlay.style.top = "0";
  introOverlay.style.left = "0";
  introOverlay.style.width = "100vw";
  introOverlay.style.height = "100vh";
  introOverlay.style.backgroundColor = "black";
  introOverlay.style.display = "flex";
  introOverlay.style.justifyContent = "center";
  introOverlay.style.alignItems = "center";
  introOverlay.style.zIndex = "9999";
  introOverlay.style.opacity = "0";
  introOverlay.style.transition = "opacity 1s ease-in-out";

  const introImg = document.createElement("img");
  introImg.src = "images/count4.png";
  introImg.style.maxWidth = "100%";
  introImg.style.maxHeight = "100%";
  introOverlay.appendChild(introImg);
  document.body.appendChild(introOverlay);

  setTimeout(() => { introOverlay.style.opacity = "1"; }, 100);
  setTimeout(() => { 
    introOverlay.style.opacity = "0"; 
    setTimeout(() => introOverlay.remove(), 1000);
  }, 5000);

  // --- Overlay istruzioni instructions.png ---
  const instructionsOverlay = document.createElement("div");
  instructionsOverlay.id = "instructionsOverlay";
  instructionsOverlay.style.position = "fixed";
  instructionsOverlay.style.top = "0";
  instructionsOverlay.style.left = "0";
  instructionsOverlay.style.width = "100vw";
  instructionsOverlay.style.height = "100vh";
  instructionsOverlay.style.backgroundColor = "black";
  instructionsOverlay.style.display = "flex";
  instructionsOverlay.style.flexDirection = "column";
  instructionsOverlay.style.justifyContent = "center";
  instructionsOverlay.style.alignItems = "center";
  instructionsOverlay.style.zIndex = "9999";
  instructionsOverlay.style.opacity = "0";
  instructionsOverlay.style.transition = "opacity 1s ease-in-out";

  const instructionsImg = document.createElement("img");
  instructionsImg.src = "images/instructions.png";
  instructionsImg.style.maxWidth = "90%";
  instructionsImg.style.maxHeight = "90%";
  instructionsOverlay.appendChild(instructionsImg);

  const tapText = document.createElement("div");
  tapText.id = "tapText";
  tapText.innerText = "Tap to start";
  tapText.style.color = "white";
  tapText.style.fontSize = "1.5rem";
  tapText.style.marginTop = "20px";
  instructionsOverlay.appendChild(tapText);

  document.body.appendChild(instructionsOverlay);

  setTimeout(() => { instructionsOverlay.style.opacity = "1"; }, 6000);

  instructionsOverlay.addEventListener("click", async () => {
    instructionsOverlay.style.opacity = "0";
    setTimeout(() => instructionsOverlay.remove(), 1000);

    // Mostra scena e avvia MindAR
    sceneEl.style.display = "flex";
    const mindarSystem = sceneEl.systems["mindar-image-system"];
    await mindarSystem.start();

  }, { once: true });

  // --- Custom scanning UI ---
  const scanningUI = document.createElement("div");
  scanningUI.id = "custom-scanning-ui";
  scanningUI.style.position = "fixed";
  scanningUI.style.top = "0";
  scanningUI.style.left = "0";
  scanningUI.style.width = "100vw";
  scanningUI.style.height = "100vh";
  scanningUI.style.pointerEvents = "none";
  scanningUI.style.display = "flex";
  scanningUI.style.justifyContent = "center";
  scanningUI.style.alignItems = "center";
  scanningUI.style.zIndex = "998";

  // Angoli
  ["top-left","top-right","bottom-left","bottom-right"].forEach(corner => {
    const div = document.createElement("div");
    div.className = "corner " + corner;
    div.style.position = "absolute";
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.border = "6px solid white";
    if(corner.includes("top")) div.style.top = "10%"; else div.style.bottom="10%";
    if(corner.includes("left")) div.style.left = "10%"; else div.style.right="10%";
    if(corner==="top-left") div.style.borderRight="none"; div.style.borderBottom="none";
    if(corner==="top-right") div.style.borderLeft="none"; div.style.borderBottom="none";
    if(corner==="bottom-left") div.style.borderRight="none"; div.style.borderTop="none";
    if(corner==="bottom-right") div.style.borderLeft="none"; div.style.borderTop="none";
    scanningUI.appendChild(div);
  });

  const scanBar = document.createElement("div");
  scanBar.className="scan-bar";
  scanBar.style.position="absolute";
  scanBar.style.width="80%";
  scanBar.style.height="6px";
  scanBar.style.background="#ffffff";
  scanBar.style.top="10%";
  scanBar.style.animation="moveBar 2s infinite alternate ease-in-out";
  scanningUI.appendChild(scanBar);

  document.body.appendChild(scanningUI);

  marker.addEventListener('targetFound', () => {
    scanningUI.style.display="none";
    initModelsSequence();
  });

  marker.addEventListener('targetLost', () => {
    scanningUI.style.display="flex";
  });

  // --- MAIN SEQUENCE ---
  function initModelsSequence() {
    const models = [
      '#piece1','#piece2','#piece3','#piece4','#piece5','#piece6','#piece7'
    ];
    let currentIndex = 0;

    const baseHeight = -0.5;
    const baseScale = 0.7;
    const scaleOffset = 0.1;
    const popupDuration = 800;
    const stabilizeDuration = 600;
    const reversePopDuration = 400;

    const video7 = document.createElement('video');
    video7.id = "video7";
    video7.src = "video/piece7.mp4";
    video7.loop = true;
    video7.autoplay = false;
    video7.playsInline = true;
    video7.webkitPlaysInline = true;
    document.body.appendChild(video7);

    const startText = document.createElement('a-text');
    startText.setAttribute('value', 'Tap the screen\nto create your\nown little cinema');
    startText.setAttribute('align', 'center');
    startText.setAttribute('color', '#000000');
    startText.setAttribute('font', 'roboto');
    startText.setAttribute('position', { x:0, y:baseHeight+0.8, z:0 });
    startText.setAttribute('scale', {x:1,y:1,z:1});
    startText.setAttribute('width','2');
    container.appendChild(startText);

    let firstClick = true;
    window.addEventListener('click', () => {
      if(firstClick){
        startText.setAttribute('visible','false');
        firstClick=false;
        return;
      }
      if(currentIndex>=models.length) return;

      const piece = document.createElement('a-entity');
      piece.setAttribute('gltf-model', models[currentIndex]);
      const finalScale = baseScale + (Math.random()-0.5)*scaleOffset;
      piece.setAttribute('scale',{x:finalScale,y:finalScale,z:finalScale});
      const offsetX = (Math.random()-0.5)*0.2;
      const offsetZ = (Math.random()-0.5)*0.2;
      piece.setAttribute('position',{x:offsetX,y:baseHeight,z:offsetZ});
      const rotX=(Math.random()-0.5)*20;
      const rotY=(Math.random()-0.5)*20;
      piece.setAttribute('rotation',{x:rotX,y:rotY,z:0});
      piece.setAttribute('animation__popup',{property:'position',from:`0 ${baseHeight-1} 0`,to:`0 ${baseHeight} 0`,dur:popupDuration,easing:'easeOutElastic'});
      piece.setAttribute('animation__stabilize',{property:'rotation',to:'0 0 0',dur:stabilizeDuration,easing:'easeOutQuad',delay:300});

      if(currentIndex===models.length-1){
        piece.id="piece7";
        piece.addEventListener('model-loaded', () => {
          setTimeout(()=>{
            const mesh=piece.getObject3D('mesh');
            if(mesh) mesh.traverse(node=>{ if(node.isMesh){ const videoTexture=new THREE.VideoTexture(video7); videoTexture.flipY=false; videoTexture.center.set(0.5,0.5); videoTexture.repeat.x=-1; node.material.map=videoTexture; node.material.needsUpdate=true; }});
            video7.play();
            setTimeout(removeAllPiecesAndShowFinal,4000);
          },3000);
        });
      }

      container.appendChild(piece);
      currentIndex++;
    });

    function removeAllPiecesAndShowFinal(){
      const pieces = Array.from(container.querySelectorAll('a-entity[gltf-model]'));
      pieces.forEach((piece,i)=>{
        piece.setAttribute('animation__shrink',{property:'scale',to:'0 0 0',dur:reversePopDuration,easing:'easeInBack',delay:i*150});
        setTimeout(()=>piece.parentNode.removeChild(piece),reversePopDuration+i*150+50);
      });
      const totalDelay = pieces.length*150+reversePopDuration+200;
      setTimeout(createFinalModel,totalDelay);
    }

    function createFinalModel(){
      const finalModel=document.createElement('a-entity');
      finalModel.setAttribute('gltf-model','#pieceCinema');
      finalModel.setAttribute('scale','0 0 0');
      finalModel.setAttribute('position',{x:0.25,y:baseHeight,z:0});
      finalModel.setAttribute('animation__pop',{property:'scale',from:'0 0 0',to:'2 2 2',dur:1200,easing:'easeOutElastic'});
      container.appendChild(finalModel);

      // Testi finali
      const text1994=document.createElement('a-text');
      text1994.setAttribute('value','1994');
      text1994.setAttribute('align','center');
      text1994.setAttribute('anchor','center');
      text1994.setAttribute('color','#000000');
      text1994.setAttribute('font','roboto');
      text1994.setAttribute('position',{x:0,y:baseHeight+0.7,z:0});
      text1994.setAttribute('scale','0.7 0.7 0.7');
      text1994.setAttribute('opacity','0');
      text1994.setAttribute('shader','msdf');
      text1994.setAttribute('negate','false');
      text1994.setAttribute('animation__fadein',{property:'opacity',from:0,to:1,dur:800,easing:'easeInQuad',delay:200});
      container.appendChild(text1994);

      const textRenovation=document.createElement('a-text');
      textRenovation.setAttribute('value','Renovation');
      textRenovation.setAttribute('align','center');
      textRenovation.setAttribute('anchor','center');
      textRenovation.setAttribute('color','#000000');
      textRenovation.setAttribute('font','roboto');
      textRenovation.setAttribute('position',{x:0,y:baseHeight+0.55,z:0});
      textRenovation.setAttribute('scale','0.4 0.4 0.4');
      textRenovation.setAttribute('opacity','0');
      textRenovation.setAttribute('shader','msdf');
      textRenovation.setAttribute('negate','false');
      textRenovation.setAttribute('animation__fadein',{property:'opacity',from:0,to:1,dur:800,easing:'easeInQuad',delay:1200});
      container.appendChild(textRenovation);

      // --- Overlay finale outro4.png ---
      setTimeout(() => {
        const outroOverlay = document.createElement('div');
        outroOverlay.id = "outroOverlay";
        outroOverlay.style.position = "fixed";
        outroOverlay.style.top = "0";
        outroOverlay.style.left = "0";
        outroOverlay.style.width = "100vw";
        outroOverlay.style.height = "100vh";
        outroOverlay.style.backgroundColor = "black";
        outroOverlay.style.display = "flex";
        outroOverlay.style.justifyContent = "center";
        outroOverlay.style.alignItems = "center";
        outroOverlay.style.zIndex = "9999";
        outroOverlay.style.opacity = "0";
        outroOverlay.style.transition = "opacity 1s ease-in-out";

        const img = document.createElement("img");
        img.src = "images/outro4.png";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        outroOverlay.appendChild(img);
        document.body.appendChild(outroOverlay);

        setTimeout(()=>{ outroOverlay.style.opacity = "1"; },100);
      }, 10000);
    }
  }
});
