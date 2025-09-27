(function() {
// Reflexão em relação ao plano C = {(x,y,z)| (0,1,0) + q(-2,4,-2) + p(-1,-1,1)}

// Definindo os vetores direcionais do plano
const v1 = [-2, 4, -2];
const v2 = [-1, -1, 1];

// Ponto no plano
const P0 = [0, 1, 0];

// Calculando o vetor normal n = v1 × v2
const n = [
    v1[1] * v2[2] - v1[2] * v2[1],  // 4*1 - (-2)*(-1) = 4 - 2 = 2
    v1[2] * v2[0] - v1[0] * v2[2],  // (-2)*(-1) - (-2)*1 = 2 + 2 = 4
    v1[0] * v2[1] - v1[1] * v2[0]   // (-2)*(-1) - 4*(-1) = 2 + 4 = 6
];

console.log("Vetor normal n:", n);

// Magnitude do vetor normal
const n_magnitude_sq = n[0]*n[0] + n[1]*n[1] + n[2]*n[2]; // 4 + 16 + 36 = 56

console.log("Magnitude² do vetor normal:", n_magnitude_sq);

// Vetor normal unitário
const n_unit = [n[0]/Math.sqrt(n_magnitude_sq), n[1]/Math.sqrt(n_magnitude_sq), n[2]/Math.sqrt(n_magnitude_sq)];

console.log("Vetor normal unitário:", n_unit);

// Matriz de reflexão R = I - 2nn^T/|n|²
// Onde nn^T é o produto externo de n consigo mesmo

// Calculando 2nn^T/|n|²
const factor = 2 / n_magnitude_sq;
const nnT = [
    [n[0]*n[0]*factor, n[0]*n[1]*factor, n[0]*n[2]*factor],
    [n[1]*n[0]*factor, n[1]*n[1]*factor, n[1]*n[2]*factor],
    [n[2]*n[0]*factor, n[2]*n[1]*factor, n[2]*n[2]*factor]
];

// Matriz identidade 3x3
const I = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
];

// Matriz de reflexão R = I - 2nn^T/|n|²
const R = [
    [I[0][0] - nnT[0][0], I[0][1] - nnT[0][1], I[0][2] - nnT[0][2]],
    [I[1][0] - nnT[1][0], I[1][1] - nnT[1][1], I[1][2] - nnT[1][2]],
    [I[2][0] - nnT[2][0], I[2][1] - nnT[2][1], I[2][2] - nnT[2][2]]
];

console.log("Matriz de reflexão R:");
console.log(R);

// Para reflexão de um ponto P em relação ao plano, a transformação completa é:
// 1. Transladar o plano para que passe pela origem (subtrair P0)
// 2. Aplicar a reflexão R
// 3. Transladar de volta (somar P0)

// Matriz de translação para origem
const T1 = [
    [1, 0, 0, -P0[0]],
    [0, 1, 0, -P0[1]],
    [0, 0, 1, -P0[2]],
    [0, 0, 0, 1]
];

// Matriz de reflexão homogênea
const R_homogenea = [
    [R[0][0], R[0][1], R[0][2], 0],
    [R[1][0], R[1][1], R[1][2], 0],
    [R[2][0], R[2][1], R[2][2], 0],
    [0, 0, 0, 1]
];

// Matriz de translação de volta
const T2 = [
    [1, 0, 0, P0[0]],
    [0, 1, 0, P0[1]],
    [0, 0, 1, P0[2]],
    [0, 0, 0, 1]
];

// Transformação completa: M = T2 * R * T1
const M_temp = math.multiply(R_homogenea, T1);
const M = math.multiply(T2, M_temp);

console.log("Matriz de Reflexão Homogênea completa (T2 * R * T1):");
console.log(M);

// Decomposição: Transformação Linear seguida de Translação
// M = [R  t]  onde R é a parte linear 3x3 e t é o vetor de translação
//     [0  1]

console.log("\n=== DECOMPOSIÇÃO ===");
console.log("Transformação Linear (matriz 3x3):");
const linear_part = [
    [M[0][0], M[0][1], M[0][2]],
    [M[1][0], M[1][1], M[1][2]],
    [M[2][0], M[2][1], M[2][2]]
];
console.log(linear_part);

console.log("Vetor de Translação:");
const translation_vector = [M[0][3], M[1][3], M[2][3]];
console.log(translation_vector);

// Função de animação para visualizar a reflexão
window.startAnimation = function(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Configurações da animação
    let time = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Pontos do objeto original (um triângulo)
    const originalPoints = [
        [1, 0, 1],  // Ponto A
        [2, 1, 0],  // Ponto B  
        [0, 2, 1]   // Ponto C
    ];
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha informações do plano
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('Reflexão em relação ao plano C', 10, 30);
        ctx.font = '12px Arial';
        ctx.fillText('Plano: (0,1,0) + q(-2,4,-2) + p(-1,-1,1)', 10, 50);
        ctx.fillText('Vetor normal: (2, 4, 6)', 10, 70);
        
        // Desenha o objeto original
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < originalPoints.length; i++) {
            const point = originalPoints[i];
            // Projeção simples 3D -> 2D (ignorando z por simplicidade visual)
            const x = centerX + point[0] * 50;
            const y = centerY - point[1] * 50;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Desenha o objeto refletido
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        
        for (let i = 0; i < originalPoints.length; i++) {
            const point = originalPoints[i];
            // Aplica a transformação de reflexão
            const homogeneousPoint = [point[0], point[1], point[2], 1];
            const transformedPoint = math.multiply(M, homogeneousPoint);
            
            // Projeção 3D -> 2D
            const x = centerX + transformedPoint[0] * 50;
            const y = centerY - transformedPoint[1] * 50;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Legenda
        ctx.fillStyle = 'blue';
        ctx.fillText('Original', canvas.width - 100, canvas.height - 40);
        ctx.fillStyle = 'red';
        ctx.fillText('Refletido', canvas.width - 100, canvas.height - 20);
        
        time += 0.02;
        requestAnimationFrame(animate);
    }
    
    animate();
}

})();
