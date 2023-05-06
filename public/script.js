if (window.location.protocol !== "https:") {
  window.location = `https://${window.location.hostname}`;
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const pre = document.querySelector("pre")

const video = document.createElement("video");
navigator
  .mediaDevices
  .getUserMedia({video: {facingMode: "user"}})
  .then(stream => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
  const showVideo = () => {
      requestAnimationFrame(showVideo);
      ctx.drawImage(video, 0, 0);
        window.ascii.fromCanvas(canvas, {
          callback: asciiString => {
            // pre.innerText = asciiString;
            socket.emit("send frame", asciiString)
          }
        });
  };

    (function waitUntilEnoughData() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.hidden = false;
        const scale = 0.15;
        canvas.height = video.videoHeight * scale;
        canvas.width = video.videoWidth * scale;
        ctx.scale(scale, scale);
        requestAnimationFrame(showVideo);
      }
      else {
        requestAnimationFrame(waitUntilEnoughData);
      }
    })();

  })
  .catch(err => {
    // 
  })
;

var socket = io();
let feeds = {};
const container = document.getElementById("feed-container")
socket.on("display frame", ({ frame, id }) => {
  if (!feeds[id]) {
    feeds[id] = document.createElement("pre")
    container.appendChild(feeds[id])
  }
  feeds[id].innerText = frame;
  // pre.innerText = frame;
})

socket.on("socket disconnecting", ({ id }) => {
  feeds[id].remove()
  delete feeds[id]
})

// https://ourcodeworld.com/articles/read/121/how-to-generate-an-ascii-art-photo-from-the-webcam-with-javascript