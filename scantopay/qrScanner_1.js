const qrcodescan = window.qrcodescan;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const recipient = document.getElementById("recipient").value;
const amountDQT = document.getElementById("amountDQT").value;
const message = document.getElementById("message").value;

const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

qrcode.callback = res => {

  if (res) {
posdata = res.split(" ");
if (posdata[0]) {
$("#recipient").val(posdata[0]);
}
if (posdata[1]) {
$("#amountDQT").val(posdata[1]);
}
if (posdata[2]) {
$("#message").val(posdata[2]);
}

$('#modalScantoPay').modal('hide');
$('#modalSendHbit').modal('show');
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}