(function() {
// Matriz de rotação homogênea em torno da reta s: x=2, y=1

// 1. Translação para origem (x-2, y-1)
const T1 = [
  [1, 0, 0, -2],
  [0, 1, 0, -1],
  [0, 0, 1,  0],
  [0, 0, 0,  1]
];

// 2. Rotação em torno do eixo z (reta paralela a s)
// Ângulo θ (exemplo: θ radianos)
const theta = Math.PI / 4; // exemplo: 45 graus
const cos = Math.cos(theta);
const sin = Math.sin(theta);

const Rz = [
  [ cos, -sin, 0, 0],
  [ sin,  cos, 0, 0],
  [   0,    0, 1, 0],
  [   0,    0, 0, 1]
];

// 3. Translação de volta (x+2, y+1)
const T2 = [
  [1, 0, 0, 2],
  [0, 1, 0, 1],
  [0, 0, 1, 0],
  [0, 0, 0, 1]
];

// Matriz final: T2 * Rz * T1
const TR = math.multiply(T2, math.multiply(Rz, T1));

console.log("Matriz de Rotação Homogênea em torno da reta s: x=2, y=1:");
console.log(TR);

window.startAnimation = function (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Exemplo de animação simples
    let x = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(x, 100, 50, 50);
        x = (x + 2) % canvas.width;
        requestAnimationFrame(animate);
    }
    animate();
}
})();