(function() {
    // Utilitários de álgebra linear
    function dot(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    }
    function cross(a, b) {
        return [
            a[1]*b[2] - a[2]*b[1],
            a[2]*b[0] - a[0]*b[2],
            a[0]*b[1] - a[1]*b[0]
        ];
    }
    function norm(v) {
        let l = Math.sqrt(dot(v, v));
        return v.map(x => x/l);
    }
    function scale(v, s) {
        return v.map(x => x*s);
    }

    // Matrizes homogêneas
    function rotationMatrix(axis, theta) {
        axis = norm(axis);
        let [x, y, z] = axis;
        let c = Math.cos(theta), s = Math.sin(theta), t = 1-c;
        return [
            [t*x*x+c,   t*x*y-s*z, t*x*z+s*y, 0],
            [t*x*y+s*z, t*y*y+c,   t*y*z-s*x, 0],
            [t*x*z-s*y, t*y*z+s*x, t*z*z+c,   0],
            [0,         0,         0,         1]
        ];
    }
    function translationMatrix(v) {
        return [
            [1,0,0,v[0]],
            [0,1,0,v[1]],
            [0,0,1,v[2]],
            [0,0,0,1]
        ];
    }
    function reflectionMatrix(planeNormal, planePoint) {
        let n = norm(planeNormal);
        let d = -dot(n, planePoint);
        let m = [
            [1-2*n[0]*n[0], -2*n[0]*n[1],   -2*n[0]*n[2],   -2*d*n[0]],
            [-2*n[1]*n[0],  1-2*n[1]*n[1],  -2*n[1]*n[2],   -2*d*n[1]],
            [-2*n[2]*n[0],  -2*n[2]*n[1],   1-2*n[2]*n[2],  -2*d*n[2]],
            [0,             0,              0,              1]
        ];
        return m;
    }

    // Planos da fenda
    const planeA = { normal: [-2,1,-1], d: -1 }; // -2x + y - z = 1
    const planeB = { normal: [0,1,1], d: -1 };   // y + z = 1

    // Plano de reflexão C
    const C_point = [0,1,0];
    const C_dir1 = [-2,4,-2];
    const C_dir2 = [-1,-1,1];
    const C_normal = norm(cross(C_dir1, C_dir2));

    // Eixo D: (-t, 1-t, t)
    function D_axis(t) {
        return norm([-1, -1, 1]);
    }
    function D_point(t) {
        return [-t, 1-t, t];
    }

    function crossedPlane(point, prevPoint, plane) {
        let f = (p) => dot(plane.normal, p) + plane.d;
        return f(point)*f(prevPoint) < 0;
    }

    function applyMatrix(mat, point) {
        let p = [...point, 1];
        let res = mat.map(row => row.reduce((acc, val, i) => acc + val*p[i], 0));
        return res.slice(0,3);
    }

    // Simulação do movimento espiral
    function simulateSerpente(steps = 10, turns = 2) {
        let t = 0;
        let theta = 0;
        let pos = D_point(t);
        let prevPos = pos;
        let matrices = [];
        for (let i=0; i<steps; ++i) {
            let axis = D_axis(t);
            let rot = rotationMatrix(axis, Math.PI*2*turns/steps);
            theta += Math.PI*2*turns/steps;
            let trans = translationMatrix(scale(axis, 2*theta/(2*Math.PI)));
            let mat = rot.map((row, r) => row.map((v, c) => v + trans[r][c]));
            let newPos = applyMatrix(mat, pos);

            if (crossedPlane(newPos, prevPos, planeA) || crossedPlane(newPos, prevPos, planeB)) {
                let reflect = reflectionMatrix(C_normal, C_point);
                newPos = applyMatrix(reflect, newPos);
                matrices.push({step: i, type: 'reflexão', matrix: reflect});
            }
            matrices.push({step: i, type: 'movimento', matrix: mat});
            prevPos = pos;
            pos = newPos;
        }
        return matrices;
    }

    // Desenha as matrizes no canvas
    function drawMatricesOnCanvas(canvas, matrices) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "14px monospace";
        ctx.fillStyle = "#222";
        let x = 20, y = 30;
        let rowHeight = 22;
        let colWidth = 90;
        let maxCols = 4;
        let maxY = canvas.height - 40;

        matrices.forEach((m, idx) => {
            ctx.fillStyle = "#0077cc";
            ctx.fillText(`Etapa ${m.step} - ${m.type}:`, x, y);
            ctx.fillStyle = "#222";
            m.matrix.forEach((row, r) => {
                row.forEach((val, c) => {
                    ctx.fillText(Number(val).toFixed(3), x + c * colWidth, y + (r+1) * rowHeight);
                });
            });
            y += (m.matrix.length + 1) * rowHeight;
            if (y + (m.matrix.length + 1) * rowHeight > maxY) {
                y = 30;
                x += (maxCols + 1) * colWidth;
            }
        });
    }

    window.startAnimation = function(canvas) {
        const matrices = simulateSerpente(20, 3);
        drawMatricesOnCanvas(canvas, matrices);
    };
})();
