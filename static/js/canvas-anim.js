var context;
var numPoints = 20;
var points = [];
var width;
var height;
var t;
var colors;
var context;

function FixedPoint1() {
  this.x = 0;
  this.y = 0;
  this.dx = 0;
  this.dy = 0;
}
function FixedPoint2() {
  this.x = canvas.width - 1;//window.innerWidth - 1;//$(window).width() - 1;
  this.y = 0;
  this.dx = 0;
  this.dy = 0;
}
function FixedPoint3() {
  this.x = 0;
  this.y = canvas.height - 1;//window.innerHeight - 1;//$(window).height() - 1;
  this.dx = 0;
  this.dy = 0;
}
function FixedPoint4() {
  this.x = canvas.width - 1;//window.innerWidth - 1;//$(window).width() - 1;
  this.y = canvas.height - 1;//window.innerHeight - 1;//$(window).height() - 1;
  this.dx = 0;
  this.dy = 0;
}
function Point() {

  // random x and y
  this.x = Math.floor(Math.random() * (width));
  this.y = Math.floor(Math.random() * (height));

  // random direction, +1 or -1
  //this.dx = Math.floor((Math.random()) * 2) * 2 - 1;
  //this.dy = Math.floor((Math.random()) * 2) * 2 - 1;
  this.dx = 0
  this.dy = 0
}

function resizeCanvas() {
  //width = window.innerWidth;
  //height = window.innerHeight;

  width = window.screen.width;
  height = window.screen.height;

  //canvas.width = width;
  //canvas.height = height;

  canvas.width = $('.body-container').width();
  canvas.height = $('.body-container').height();
}

function init() {
  context = canvas.getContext('2d');
  resizeCanvas();

  // create an array of points
  points.push(new FixedPoint1());
  points.push(new FixedPoint2());
  points.push(new FixedPoint3());
  points.push(new FixedPoint4());
  for (i = 0; i < numPoints; i++) {
    points.push(new Point());
  }

  colors = ["#f0f0f0", "#98D1D9","#bdbdbd", "#eeeeee","#C0C0C0"];

  draw()

  //setInterval(draw, 10);
}

function drawTriangs() {

  for (i = 0; i < numPoints; i++) {
    var point = points[i];

    if (point.x < 0 || point.x > width) point.dx = -point.dx;
    if (point.y < 0 || point.y > height) point.dy = -point.dy;

    point.x += point.dx;
    point.y += point.dy;
  }

  var vertices = points.map(function(d) {
    return [d.x, d.y];
  });

  t = new Trianglify({
    noiseIntensity: 0,
    format: "png",
    x_gradient: colors,
    points: vertices
  });
  t.generate(width, height);

}

function draw() {
  context.clearRect(0, 0, width, height);
  drawTriangs();
}

document.addEventListener('DOMContentLoaded', init);

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('resize', draw, false);




// Taken from http://qrohlf.com/trianglify/
// canvas from PNG version https://github.com/alx5962/trianglify
function Trianglify(options) {
  if (typeof options === 'undefined') {
    options = {};
  }

  function defaults(opt, def) {
      return (typeof opt !== 'undefined') ? opt : def;
    }
    // defaults
  this.options = {
    cellsize: defaults(options.cellsize, 150), // zero not valid here
    bleed: defaults(options.cellsize, 150),
    cellpadding: defaults(options.cellpadding, 0.1 * options.cellsize || 15),
    noiseIntensity: defaults(options.noiseIntensity, 0.3),
    x_gradient: defaults(options.x_gradient, ["#f0f0f0", "#bdbdbd", "#eeeeee","#C0C0C0"]),
    format: defaults(options.format, "svg"),
    fillOpacity: defaults(options.fillOpacity, 1),
    strokeOpacity: defaults(options.strokeOpacity, 1),
    points: defaults(options.points, false)
  };

  this.options.y_gradient = options.y_gradient || this.options.x_gradient.map(function(c) {
    return d3.rgb(c).brighter(0.5);
  });
}

Trianglify.prototype.generate = function(width, height) {
  return new Trianglify.Pattern(this.options, width, height);
};

Trianglify.Pattern = function(options, width, height) {
  this.options = options;
  this.width = width;
  this.height = height;
  this.polys = this.generatePolygons();
  if (options.format === "png") {
    this.canvas = this.generateCanvas();
    this.dataUri = this.canvas.toDataURL("image/png");
  } else {
    this.svg = this.generateSVG();
    var s = new XMLSerializer();
    this.svgString = s.serializeToString(this.svg);
    this.base64 = btoa(this.svgString);
    this.dataUri = 'data:image/svg+xml;base64,' + this.base64;
  }
  this.dataUrl = 'url(' + this.dataUri + ')';
};

Trianglify.Pattern.prototype.append = function() {
  document.body.appendChild(this.svg);
};

Trianglify.Pattern.gradient_2d = function(x_gradient, y_gradient, width, height) {

  return function(x, y) {
    var color_x = d3.scale.linear()
      .range(x_gradient)
      .domain(d3.range(0, width, width / x_gradient.length)); //[-bleed, width+bleed]
    var color_y = d3.scale.linear()
      .range(y_gradient)
      .domain(d3.range(0, height, height / y_gradient.length)); //[-bleed, width+bleed]
    return d3.interpolateRgb(color_x(x), color_y(y))(0.5);
  };
};

Trianglify.Pattern.prototype.generatePolygons = function() {
  var options = this.options;

  if (options.points) {
    return d3.geom.delaunay(options.points);
  }
  var cellsX = Math.ceil((this.width + options.bleed * 2) / options.cellsize);
  var cellsY = Math.ceil((this.height + options.bleed * 2) / options.cellsize);

  var vertices = d3.range(cellsX * cellsY).map(function(d) {
    // figure out which cell we are in
    var col = d % cellsX;
    var row = Math.floor(d / cellsX);
    var x = -options.bleed + col * options.cellsize + Math.random() * (options.cellsize - options.cellpadding * 2) + options.cellpadding;
    var y = -options.bleed + row * options.cellsize + Math.random() * (options.cellsize - options.cellpadding * 2) + options.cellpadding;
    // return [x*cellsize, y*cellsize];
    return [x, y]; // Populate the actual background with points
  });

  return d3.geom.delaunay(vertices);
};

Trianglify.Pattern.prototype.generateCanvas = function() {
  var options = this.options;
  var xn, yn;
  var number = 0;
  var opacity = options.noiseIntensity;
  var color = Trianglify.Pattern.gradient_2d(options.x_gradient, options.y_gradient, this.width, this.height);
  // var canvas = document.createElement("canvas");
  //canvas.style.display = "none";

  this.polys.forEach(function(d) {
    var x = (d[0][0] + d[1][0] + d[2][0]) / 3;
    var y = (d[0][1] + d[1][1] + d[2][1]) / 3;
    var c = color(x, y);
    context.beginPath();
    context.moveTo(d[0][0], d[0][1]);
    context.lineTo(d[1][0], d[1][1]);
    context.lineTo(d[2][0], d[2][1]);
    context.closePath();
    context.lineWidth = 2;
    context.fillStyle = c;
    context.fill();
    context.strokeStyle = c;
    context.stroke();

  });
  if (options.noiseIntensity > 0.01) {
    for (xn = 0; xn < canvas.width; xn = xn + 2) {
      for (yn = 0; yn < canvas.height; yn = yn + 2) {
        number = Math.floor(Math.random() * 20);
        context.fillStyle = "rgba(" + number + "," + number + "," + number + "," + opacity + ")";
        context.fillRect(xn, yn, 2, 2);
      }
    }
  }
  return canvas;
};
// I've left out the non-continuous colorbrewer scales here because they don't really look that nice as mesh
// palettes, but if you want to try them out you can grab them from http://bl.ocks.org/mbostock/5577023


/*
var bg = new Trianglify({
  noiseIntensity: 0,
  cellsize: 50,
  cellpadding: 5,
  fillOpacity: 1,
  strokeOpacity: 0
});

var pattern = bg.generate(document.body.clientWidth, document.body.clientHeight);
document.body.setAttribute('style', 'background-image: '+pattern.dataUrl);*/