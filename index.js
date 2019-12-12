const canvas = document.getElementById('thecanvas');
const context = canvas.getContext('2d');

let animating = false;
let line = [];
let time = 0;

let vectors = [];
let drawnPoints = [];


function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redraw();
}

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

function redraw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!animating) {
    context.strokeStyle = '#2c3e50';
    context.lineJoin = 'round';
    context.lineWidth = 5;

    context.beginPath();
    line.forEach((point, index) => {
      if (index == 0) {
        context.moveTo(point[0], point[1]);
      } else {
        context.lineTo(point[0], point[1]);
      }
    });

    context.stroke();
  } else {
    context.strokeStyle = '#2c3e50';
    context.lineJoin = 'round';
    context.lineWidth = 0.5;

    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2);
    let lastPoint = math.complex(canvas.width / 2, canvas.height / 2);
    const circles = [];
    const n = line.length;
    vectors.forEach((v_) => {
      const v = v_[1];
      const i = v_[0];
      const factor = math.exp(math.multiply(2 * math.pi / n * time * i, math.i));
      lastPoint = math.add(lastPoint, math.multiply(v, factor));
      context.lineTo(lastPoint.re, lastPoint.im);
      circles.push([lastPoint.re, lastPoint.im, v.toPolar().r]);
    });
    drawnPoints.push([lastPoint.re, lastPoint.im]);
    context.stroke();

    circles.forEach((circle) => {
      context.beginPath();
      context.arc(circle[0], circle[1], circle[2], 0, 2 * math.pi, false);
      context.stroke();
    });

    context.lineWidth = 5;

    context.beginPath();
    drawnPoints.forEach((point, index) => {
      if (index == 0) {
        context.moveTo(point[0], point[1]);
      } else {
        context.lineTo(point[0], point[1]);
      }
    });
    context.stroke();
  }
}

function clearAll() {
  line = [];
  redraw();
}

function addPoint(x, y) {
  line.push([x, y]);
  redraw();
}


let isPainting = false;
canvas.onmousedown = (e) => {
  if (animating) {
    return;
  }
  line = [];
  addPoint(e.x, e.y);
  isPainting = true;
};

canvas.onmousemove = (e) => {
  if (animating) {
    return;
  }
  if (isPainting) {
    addPoint(e.x, e.y);
  }
};

canvas.onmouseup = () => {
  if (animating) {
    return;
  }
  isPainting = false;
};



let start = null;
function nextFrame(timestamp) {
  if (!start) {
    start = timestamp;
  }
  const step = timestamp - start;
  window.requestAnimationFrame(nextFrame);
  time += step / 1000 / 10;
  if (time >= line.length - 1) {
    return;
  }
  redraw();
}


function reset() {
  document.getElementById('toolbar2').style.display = 'none';
  document.getElementById('toolbar').style.display = 'inherit';
  animating = false;
  clearAll();
}


function startAnimation() {
  document.getElementById('toolbar').style.display = 'none';
  document.getElementById('toolbar2').style.display = 'inherit';
  animating = true;
  time = 0;

  const n = line.length;

  vectors = [];
  drawnPoints = [];
  const points0 = line.map(p => math.complex(p[0] - canvas.width / 2, p[1] - canvas.height / 2));

  // const c0 = math.divide(
  //   points0.reduce((acc, p) => math.add(acc, p), math.complex(0, 0)),
  //   n
  // );
  // vectors.push(c0);

  for (let j=-50; j<50; j++) {
    const pointsn = points0.map((p, i) => math.multiply(
      math.exp(math.multiply(-2 * math.pi / n * i * j, math.i)), p
    ));
    const cn = math.divide(
      pointsn.reduce((acc, p) => math.add(acc, p), math.complex(0, 0)),
      n
    );
    vectors.push([j, cn]);
  }

  window.requestAnimationFrame(nextFrame);
}
