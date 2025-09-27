(function() {
    // Quadrado de lado 1 no plano z=0, centrado na origem
    const square = [
        [-0.5, -0.5, 0, 1],
        [ 0.5, -0.5, 0, 1],
        [ 0.5,  0.5, 0, 1],
        [-0.5,  0.5, 0, 1]
    ];

    // --- Operação A: Rotação homogênea em torno da reta s: x=2, y=1 ---
    const T1a = [
        [1, 0, 0, -2],
        [0, 1, 0, -1],
        [0, 0, 1,  0],
        [0, 0, 0,  1]
    ];
    const thetaA = Math.PI / 4; // 45 graus
    const cosA = Math.cos(thetaA);
    const sinA = Math.sin(thetaA);
    const RzA = [
        [ cosA, -sinA, 0, 0],
        [ sinA,  cosA, 0, 0],
        [   0,     0, 1, 0],
        [   0,     0, 0, 1]
    ];
    const T2a = [
        [1, 0, 0, 2],
        [0, 1, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    const MA = math.multiply(T2a, math.multiply(RzA, T1a));

    // --- Operação B: Reflexão em relação ao plano C ---
    const v1 = [-2, 4, -2];
    const v2 = [-1, -1, 1];
    const P0 = [0, 1, 0];
    const n = [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
    const n_magnitude_sq = n[0]*n[0] + n[1]*n[1] + n[2]*n[2];
    const factor = 2 / n_magnitude_sq;
    const nnT = [
        [n[0]*n[0]*factor, n[0]*n[1]*factor, n[0]*n[2]*factor],
        [n[1]*n[0]*factor, n[1]*n[1]*factor, n[1]*n[2]*factor],
        [n[2]*n[0]*factor, n[2]*n[1]*factor, n[2]*n[2]*factor]
    ];
    const I = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    const Rb = [
        [I[0][0] - nnT[0][0], I[0][1] - nnT[0][1], I[0][2] - nnT[0][2]],
        [I[1][0] - nnT[1][0], I[1][1] - nnT[1][1], I[1][2] - nnT[1][2]],
        [I[2][0] - nnT[2][0], I[2][1] - nnT[2][1], I[2][2] - nnT[2][2]]
    ];
    const T1b = [
        [1, 0, 0, -P0[0]],
        [0, 1, 0, -P0[1]],
        [0, 0, 1, -P0[2]],
        [0, 0, 0, 1]
    ];
    const Rb_hom = [
        [Rb[0][0], Rb[0][1], Rb[0][2], 0],
        [Rb[1][0], Rb[1][1], Rb[1][2], 0],
        [Rb[2][0], Rb[2][1], Rb[2][2], 0],
        [0, 0, 0, 1]
    ];
    const T2b = [
        [1, 0, 0, P0[0]],
        [0, 1, 0, P0[1]],
        [0, 0, 1, P0[2]],
        [0, 0, 0, 1]
    ];
    const MB = math.multiply(T2b, math.multiply(Rb_hom, T1b));

    // --- Operação C: Rotação homogênea em torno de D = (-t, 1-t, t) com fator 2/pi ---
    function getMatrixC(t) {
        const T1 = [
            [1, 0, 0, t],
            [0, 1, 0, t - 1],
            [0, 0, 1, -t],
            [0, 0, 0, 1]
        ];
        const theta = 2 / Math.PI;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        const R = [
            [cos, -sin, 0, 0],
            [sin, cos, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        const T2 = [
            [1, 0, 0, -t],
            [0, 1, 0, -(t - 1)],
            [0, 0, 1, t],
            [0, 0, 0, 1]
        ];
        return math.multiply(T2, math.multiply(R, T1));
    }
    const MC = getMatrixC(1);

    // --- Utilitários ---
    function transformPoints(matrix, points) {
        return points.map(pt => {
            const res = math.multiply(matrix, pt);
            return [res[0], res[1], res[2], res[3]];
        });
    }

    function drawSquare(ctx, points, color, centerX, centerY, scale) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        points.forEach((p, i) => {
            const x = centerX + p[0] * scale;
            const y = centerY - p[1] * scale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    function drawLabel(ctx, text, color, x, y) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = "bold 16px Arial";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    window.startAnimation = function(canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 80;

        let op = 0;
        const ops = [
            { name: "a) Rotação em torno da reta s", matrix: MA, color: "green" },
            { name: "b) Reflexão no plano C", matrix: MB, color: "red" },
            { name: "c) Rotação em torno de D", matrix: MC, color: "blue" }
        ];

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Quadrado original
            drawSquare(ctx, square, "#444", centerX, centerY, scale);
            drawLabel(ctx, "Original", "#444", centerX + 60, centerY + 60);

            // Quadrado transformado
            const transformed = transformPoints(ops[op].matrix, square);
            drawSquare(ctx, transformed, ops[op].color, centerX, centerY, scale);
            drawLabel(ctx, ops[op].name, ops[op].color, 30, 40);

            // Quadrado transformado label
            drawLabel(ctx, "Transformado", ops[op].color, centerX + 60, centerY + 80);
        }

        // Troca de operação a cada 3 segundos
        let lastSwitch = Date.now();
        function animate() {
            draw();
            if (Date.now() - lastSwitch > 3000) {
                op = (op + 1) % ops.length;
                lastSwitch = Date.now();
            }
            requestAnimationFrame(animate);
        }
        animate();
    };
})();