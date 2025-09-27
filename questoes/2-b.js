(function() {
    // Translação para origem
    const T1 = [
        [1, 0, 0, 1],
        [0, 1, 0, -1],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    // Eixo unitário
    const norm = Math.sqrt(1*1 + (-1)*(-1) + 1*1);
    const ux = 1/norm, uy = -1/norm, uz = 1/norm;
    const theta = Math.PI/6;
    const c = Math.cos(theta), s = Math.sin(theta), t = 1 - c;

    // Rotação Rodrigues
    const R = [
        [t*ux*ux + c,     t*ux*uy - s*uz, t*ux*uz + s*uy, 0],
        [t*ux*uy + s*uz,  t*uy*uy + c,    t*uy*uz - s*ux, 0],
        [t*ux*uz - s*uy,  t*uy*uz + s*ux, t*uz*uz + c,    0],
        [0,               0,              0,              1]
    ];

    // Translação de volta
    const T2 = [
        [1, 0, 0, -1],
        [0, 1, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    // Escala
    const S = [
        [3,  0,   0, 0],
        [0, -2,   0, 0],
        [0,  0, 0.5, 0],
        [0,  0,   0, 1]
    ];

    // Translação final
    const T3 = [
        [1, 0, 0, 1],
        [0, 1, 0, -2],
        [0, 0, 1, -3],
        [0, 0, 0, 1]
    ];

    // Operador afim total
    const M = math.multiply(T3, math.multiply(S, math.multiply(T2, math.multiply(R, T1))));

    console.log("Matriz composta (T3 · S · T2 · R · T1):");
    console.log(M);

    function drawMatrix(ctx, matrix, x, y, label) {
        ctx.save();
        ctx.font = "16px monospace";
        ctx.fillStyle = "#222";
        ctx.fillText(label, x, y);
        for (let i = 0; i < matrix.length; i++) {
            let row = matrix[i].map(v => v.toFixed(3)).join("   ");
            ctx.fillText(row, x, y + 24 + i * 22);
        }
        ctx.restore();
    }

    window.startAnimation = function(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Parâmetros de layout
        const colWidth = 340;
        const rowHeight = 140;

        // Primeira coluna
        drawMatrix(ctx, T1, 30, 30, "T1 (Translação para origem):");
        drawMatrix(ctx, R, 30, 30 + rowHeight, "R (Rotação Rodrigues):");
        drawMatrix(ctx, T2, 30, 30 + 2 * rowHeight, "T2 (Translação de volta):");

        // Segunda coluna
        drawMatrix(ctx, S, 30 + colWidth, 30, "S (Escala):");
        drawMatrix(ctx, T3, 30 + colWidth, 30 + rowHeight, "T3 (Translação final):");
        drawMatrix(ctx, M, 30 + colWidth, 30 + 2 * rowHeight, "Matriz composta (T3·S·T2·R·T1):");
    };
})();