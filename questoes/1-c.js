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

    function displayMatrix(matrix) {
        const matrixContainer = document.getElementById('matrixContainer');
        if (!matrixContainer) return;

        matrixContainer.innerHTML = ''; // Clear previous content

        const title = document.createElement('h3');
        title.textContent = 'Matriz de Transformação (t = 1):';
        matrixContainer.appendChild(title);

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.margin = '20px auto';
        table.style.fontFamily = 'monospace';

        matrix.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.style.border = '1px solid #ccc';
                td.style.padding = '8px';
                td.style.textAlign = 'right';
                td.textContent = Number(cell).toFixed(4);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        matrixContainer.appendChild(table);
    }

    // Exemplo de uso com t = 1
    const result = getTransformationMatrix(1);

    window.startAnimation = function(canvas) {
        displayMatrix(result);
    };
})();