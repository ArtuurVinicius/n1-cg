(function() {
    // Matriz de coordenadas homogêneas para rotação em torno de D = (-t, 1-t, t) 
    // com fator de translação 2/π

    function getTransformationMatrix(t) {
        // 1. Translação para levar D para origem
        const T1 = [
            [1, 0, 0, t], // Translação em x: -(-t) = t
            [0, 1, 0, t - 1], // Translação em y: -(1-t) = t-1
            [0, 0, 1, -t], // Translação em z: -t
            [0, 0, 0, 1]
        ];

        // 2. Matriz de rotação com fator 2/π
        const theta = 2 / Math.PI;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const R = [
            [cos, -sin, 0, 0],
            [sin, cos, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // 3. Translação de volta para a posição original
        const T2 = [
            [1, 0, 0, -t], // Translação em x: -t
            [0, 1, 0, -(t - 1)], // Translação em y: -(t-1)
            [0, 0, 1, t], // Translação em z: t
            [0, 0, 0, 1]
        ];

        // A matriz final é o produto T2 * R * T1
        // Usando a biblioteca math.js para multiplicação de matrizes
        const finalMatrix = math.multiply(T2, math.multiply(R, T1));

        return finalMatrix;
    }

    // Exemplo de uso com t = 1
    const result = getTransformationMatrix(1);

    function drawMatrixOnCanvas(ctx, matrix, x, y, label) {
        ctx.save();
        ctx.font = "18px monospace";
        ctx.fillStyle = "#222";
        ctx.fillText(label, x, y);

        ctx.font = "16px monospace";
        const cellW = 90;
        const cellH = 32;
        const startY = y + 16;

        // Desenha bordas e valores
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                let val = Number(matrix[i][j]).toFixed(4);
                let cx = x + j * cellW;
                let cy = startY + i * cellH;
                // Borda
                ctx.strokeStyle = "#bbb";
                ctx.strokeRect(cx, cy, cellW, cellH);
                // Valor
                ctx.fillStyle = "#222";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(val, cx + cellW/2, cy + cellH/2);
            }
        }
        ctx.restore();
    }

    window.startAnimation = function(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawMatrixOnCanvas(ctx, result, 60, 60, "Matriz de Transformação (t = 1):");
    };
})();