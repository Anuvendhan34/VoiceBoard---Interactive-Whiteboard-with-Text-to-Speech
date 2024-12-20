// Canvas and Context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 100;

// Toolbar Elements
const tools = {
  select: document.getElementById("selectTool"),
  draw: document.getElementById("drawTool"),
  rect: document.getElementById("rectTool"),
  circle: document.getElementById("circleTool"),
  line: document.getElementById("lineTool"),
};
const colorPicker = document.getElementById("colorPicker");
const strokeWidth = document.getElementById("strokeWidth");
const clearCanvas = document.getElementById("clearCanvas");

// State Management
let currentTool = "select";
let isDrawing = false;
let startX = 0;
let startY = 0;
let shapes = [];
let currentShape = null;

// Tool Selection
Object.values(tools).forEach((tool) => {
  tool.addEventListener("click", () => {
    Object.values(tools).forEach((t) => t.classList.remove("active"));
    tool.classList.add("active");
    currentTool = tool.id.replace("Tool", "").toLowerCase();
  });
});

// Event Listeners
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  if (currentTool !== "draw") {
    currentShape = {
      tool: currentTool,
      startX,
      startY,
      endX: startX,
      endY: startY,
      color: colorPicker.value,
      size: strokeWidth.value,
    };
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  if (currentTool === "draw") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = strokeWidth.value;
    ctx.stroke();
    startX = e.offsetX;
    startY = e.offsetY;
  } else if (currentShape) {
    currentShape.endX = e.offsetX;
    currentShape.endY = e.offsetY;
    redrawCanvas();
    drawShape(currentShape);
  }
});

canvas.addEventListener("mouseup", () => {
  if (currentShape) {
    shapes.push(currentShape);
    currentShape = null;
  }
  isDrawing = false;
});

// Clear Canvas
clearCanvas.addEventListener("click", () => {
  shapes = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Redraw Canvas
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(drawShape);
}

// Draw Shape Function
function drawShape(shape) {
  const { tool, startX, startY, endX, endY, color, size } = shape;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;

  // Ensure each shape type is drawn correctly
  if (tool === "rect") {
    ctx.beginPath();
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  } else if (tool === "circle") {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
  } else if (tool === "line") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}
