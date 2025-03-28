// Conector.js

// En la página del iframe
if (document.getElementById("videoFrame")) {
    const iframe = document.getElementById("videoFrame");
    const dataSrc = iframe.getAttribute("data-src");
  
    if (dataSrc) {
      // Enviar el data-src al video mediante postMessage
      window.parent.postMessage({ type: "SET_VIDEO_SRC", dataSrc }, "*");
    } else {
      console.warn("El atributo data-src del iframe está vacío.");
    }
  }
  
  // En la página del video
  if (document.getElementById("video")) {
    const video = document.getElementById("video");
  
    // Escuchar mensajes provenientes de otras ventanas
    window.addEventListener("message", (event) => {
      if (event.data.type === "SET_VIDEO_SRC") {
        const videoSrc = event.data.dataSrc;
  
        if (videoSrc) {
          video.setAttribute("src", videoSrc); // Asignar el src recibido al video
          console.log("El video src ha sido actualizado a:", videoSrc);
        } else {
          console.warn("El data-src recibido está vacío.");
        }
      }
    });
  }
  