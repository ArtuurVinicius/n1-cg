(function() {
    // Considere a reflexão em relação ao plano x - y = 1, seguida de uma rotação anti-horária 
    // de 30° em torno da reta (t,0,-t)

    // --- Parte 1: Reflexão em relação ao plano x - y = 1 ---
    const n = [1, -1, 0]; // Vetor normal ao plano x - y = 1

    // Normalização do vetor normal
    const nMag = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    const nUnit = n.map(x => x / nMag);

    // Matriz de reflexão R = I - 2nn^T
    const factor = 2;
    const nnT = [
        [nUnit[0] * nUnit[0] * factor, nUnit[0] * nUnit[1] * factor, nUnit[0] * nUnit[2] * factor],
        [nUnit[1] * nUnit[0] * factor, nUnit[1] * nUnit[1] * factor, nUnit[1] * nUnit[2] * factor],
        [nUnit[2] * nUnit[0] * factor, nUnit[2] * nUnit[1] * factor, nUnit[2] * nUnit[2] * factor]
    ];

    // Matriz identidade 3x3
    const I = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];

    // Matriz de reflexão R = I - 2nn^T
    const R = [
        [I[0][0] - nnT[0][0], I[0][1] - nnT[0][1], I[0][2] - nnT[0][2]],
        [I[1][0] - nnT[1][0], I[1][1] - nnT[1][1], I[1][2] - nnT[1][2]],
        [I[2][0] - nnT[2][0], I[2][1] - nnT[2][1], I[2][2] - nnT[2][2]]
    ];

    // Matriz de reflexão homogênea
    const MR = [
        [R[0][0], R[0][1], R[0][2], 0],
        [R[1][0], R[1][1], R[1][2], 0],
        [R[2][0], R[2][1], R[2][2], 0],
        [0, 0, 0, 1]
    ];

    // --- Parte 2: Rotação de 30° em torno da reta (t,0,-t) ---
    function getRotationMatrix(t) {
        // 1. Translação para levar o ponto (t,0,-t) para origem
        const T1 = [
            [1, 0, 0, -t],
            [0, 1, 0, 0],
            [0, 0, 1, t],
            [0, 0, 0, 1]
        ];

        // 2. Rotação de 30° em torno do eixo (1,0,-1)
        const theta = Math.PI / 6; // 30 graus em radianos
        const u = [1, 0, -1]; // Vetor direção da reta

        // Normalização do vetor direção
        const uMag = Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
        const ux = u[0] / uMag;
        const uy = u[1] / uMag;
        const uz = u[2] / uMag;

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        const oneMinusCos = 1 - cos;

        // Matriz de rotação em torno de um eixo arbitrário
        const Raxis = [
            [cos + ux * ux * oneMinusCos, ux * uy * oneMinusCos - uz * sin, ux * uz * oneMinusCos + uy * sin, 0],
            [uy * ux * oneMinusCos + uz * sin, cos + uy * uy * oneMinusCos, uy * uz * oneMinusCos - ux * sin, 0],
            [uz * ux * oneMinusCos - uy * sin, uz * uy * oneMinusCos + ux * sin, cos + uz * uz * oneMinusCos, 0],
            [0, 0, 0, 1]
        ];

        // 3. Translação de volta
        const T2 = [
            [1, 0, 0, t],
            [0, 1, 0, 0],
            [0, 0, 1, -t],
            [0, 0, 0, 1]
        ];

        return math.multiply(T2, math.multiply(Raxis, T1));
    }

    // Composição final das transformações para t = 1
    const t = 1;
    const MRot = getRotationMatrix(t);
    const M = math.multiply(MRot, MR);

    function displayMatrix(matrix, canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configuração do texto
        ctx.font = '16px monospace';
        ctx.fillStyle = 'black';

        // Título
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Matriz da Transformação Composta:', 50, 50);

        // Descrição
        ctx.font = '14px Arial';
        const desc = 'Reflexão em relação ao plano x - y = 1, seguida de rotação de 30° em torno da reta (t,0,-t)';
        ctx.fillText(desc, 50, 80);

        // Matriz
        ctx.font = '16px monospace';
        const cellWidth = 100;
        const cellHeight = 30;
        const startX = (canvas.width - cellWidth * 4) / 2;
        const startY = 120;

        matrix.forEach((row, i) => {
            row.forEach((value, j) => {
                const x = startX + j * cellWidth;
                const y = startY + i * cellHeight;

                // Desenha borda da célula
                ctx.strokeStyle = '#ccc';
                ctx.strokeRect(x, y, cellWidth, cellHeight);

                // Desenha valor
                ctx.fillStyle = 'black';
                const text = Number(value).toFixed(4);
                const textWidth = ctx.measureText(text).width;
                ctx.fillText(text, x + (cellWidth - textWidth) / 2, y + 20);
            });
        });
    }

    window.startAnimation = function(canvas) {
        displayMatrix(M, canvas);
    };
})();