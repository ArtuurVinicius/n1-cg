# Animações de Computação Gráfica

Este projeto contém animações e visualizações de operadores afins, matrizes e transformações geométricas em 2D/3D, desenvolvidas para estudos de Computação Gráfica.

## Como rodar

1. **Pré-requisitos:**  
   - Apenas um navegador (Chrome, Firefox, Edge, etc).
   - Não é necessário instalar nada além dos arquivos do projeto.

2. **Executando:**
   - Baixe ou clone este repositório.
   - Abra o arquivo `index.html` na raiz do projeto com seu navegador.
   - Use os botões "Animação anterior" e "Próxima animação" para navegar entre as animações disponíveis.

## Estrutura

- **index.html**  
  Página principal, com o canvas e controles de navegação.
- **/questoes/**  
  Pasta com os scripts de cada animação (ex: `1-a.js`, `1-b.js`, ...).

## Peculiaridades do código

- **Exibição de Matrizes:**  
  Muitas animações exibem as matrizes de transformação no **console do navegador**.  
  > Para visualizar, pressione `F12` ou `Ctrl+Shift+I` e acesse a aba "Console".

- **Canvas:**  
  Todas as animações são desenhadas no elemento `<canvas>` da página.

- **Troca de Animação:**  
  Ao trocar de animação, o canvas é limpo e o script anterior é descarregado automaticamente.

- **Matrizes no Canvas:**  
  Algumas animações também desenham as matrizes como tabelas diretamente no canvas.

- **Limite de Passos:**  
  Em animações de trajetória, pode haver um limite de etapas exibidas (ex: até 12 passos).

- **Animações 3D:**  
  Algumas animações usam [Three.js](https://threejs.org/) para visualização 3D.  
  A câmera pode alternar automaticamente entre diferentes perspectivas.

## Observações

- O projeto usa [math.js](https://mathjs.org/) para operações matriciais.
- Se alguma animação não aparecer corretamente, recarregue a página ou verifique se o arquivo JS correspondente está presente na pasta `questoes/`.
- Confira o console para visualizar as matrizes sendo modificadas em tempo real.
- No caso da resolução da Questão 3, precisamos criar um novo HTML, portanto deve ser rodado isoladamente.

---
