(function() {
    // Pontos
    const A = [2, -2, -3];
    const B = [2, 1, 0];
    const C = [0, -1, -1];

    // Vetores
    const v1 = [A[0]-C[0], A[1]-C[1], A[2]-C[2]]; // (2, -1, -2)
    const v2 = [B[0]-C[0], B[1]-C[1], B[2]-C[2]]; // (2, 2, 1)

    // Produto vetorial para o eixo
    const n = [
        v1[1]*v2[2] - v1[2]*v2[1], // 3
        v1[2]*v2[0] - v1[0]*v2[2], // -6
        v1[0]*v2[1] - v1[1]*v2[0]  // 6
    ];
    const n_norm = Math.sqrt(n[0]**2 + n[1]**2 + n[2]**2);
    const u = n.map(x => x/n_norm);

    // Matriz de rotação em torno de eixo arbitrário (Rodrigues)
    function getRotationMatrixArbitraryAxis(axis, theta) {
        const [ux, uy, uz] = axis;
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        const t = 1 - c;
        return [
            [t*ux*ux + c,     t*ux*uy - s*uz, t*ux*uz + s*uy, 0],
            [t*ux*uy + s*uz,  t*uy*uy + c,    t*uy*uz - s*ux, 0],
            [t*ux*uz - s*uy,  t*uy*uz + s*ux, t*uz*uz + c,    0],
            [0,               0,              0,              1]
        ];
    }

    // Matrizes de translação
    const T1 = [
        [1,0,0,-C[0]],
        [0,1,0,-C[1]],
        [0,0,1,-C[2]],
        [0,0,0,1]
    ];
    const T2 = [
        [1,0,0,C[0]],
        [0,1,0,C[1]],
        [0,0,1,C[2]],
        [0,0,0,1]
    ];

    // Ângulo de rotação (30 graus)
    const theta = Math.PI/6;

    // Matriz de rotação
    const R = getRotationMatrixArbitraryAxis(u, theta);

    // Matriz composta para cada passo de 30 graus
    const M = math.multiply(T2, math.multiply(R, T1));

    console.log("Eixo de rotação (normalizado):", u);
    console.log("Matriz de rotação (30 graus) em torno do eixo que passa por C:", R);
    console.log("Matriz composta (T2 * R * T1):", M);

    // Animação: partícula indo de A até B em arcos de 30 graus
    window.startAnimation = function(canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width/2;
        const centerY = canvas.height/2;
        const scale = 60;

        // Projeção simples 3D -> 2D (ignora z)
        function proj(p) {
            return [centerX + p[0]*scale, centerY - p[1]*scale];
        }

        // Gera todos os pontos da trajetória
        let points = [A];
        let current = math.matrix([...A, 1]);
        let maxSteps = Math.ceil(
            Math.acos(
                math.dot(
                    math.subtract(A, C),
                    math.subtract(B, C)
                ) / (math.norm(math.subtract(A, C)) * math.norm(math.subtract(B, C)))
            ) / (Math.PI/6)
        );
        for(let i=0; i<maxSteps; ++i) {
            current = math.multiply(M, current);
            points.push([current.get([0]), current.get([1]), current.get([2])]);
        }

        // Desenha trajetória e pontos
        function draw() {
            ctx.clearRect(0,0,canvas.width,canvas.height);

            // Centro C
            let [cx, cy] = proj(C);
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, 2*Math.PI);
            ctx.fill();
            ctx.fillText("C", cx+8, cy);

            // Trajetória
            ctx.strokeStyle = "#888";
            ctx.setLineDash([5,5]);
            ctx.beginPath();
            for(let i=0; i<points.length; ++i) {
                let [x, y] = proj(points[i]);
                if(i===0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Pontos
            for(let i=0; i<points.length; ++i) {
                let [x, y] = proj(points[i]);
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2*Math.PI);
                ctx.fillStyle = (i===0) ? "blue" : (i===points.length-1 ? "green" : "red");
                ctx.fill();
                if(i===0) ctx.fillText("A", x+8, y);
                if(i===points.length-1) ctx.fillText("B", x+8, y);
            }
        }

        draw();
    };
})();