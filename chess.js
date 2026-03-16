// Chess Game State
const chessState = {
    board: [],
    currentTurn: 'white',
    selectedPiece: null,
    moveHistory: [],
    capturedPieces: { white: [], black: [] },
    isGameOver: false,
    aiMode: false,
    aiDifficulty: 'easy',
    boardRotation: 0
};

// Three.js Scene Setup
let scene, camera, renderer, boardGroup, piecesGroup;
let selectedSquare = null;
let highlightedSquares = [];

// Initialize Chess Board
function initChessBoard() {
    const container = document.getElementById('chessBoard');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2C3E50);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 12, 12);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xFF6B9D, 0.5);
    pointLight.position.set(0, 8, 0);
    scene.add(pointLight);
    
    // Create Board
    boardGroup = new THREE.Group();
    createChessboardSquares();
    scene.add(boardGroup);
    
    // Create Pieces
    piecesGroup = new THREE.Group();
    scene.add(piecesGroup);
    
    // Initialize board state
    initBoardState();
    createPieces();
    
    // Mouse interaction
    setupMouseInteraction();
    
    // Start animation loop
    animate();
    
    // Event listeners
    setupGameControls();
}

// Create Chessboard Squares
function createChessboardSquares() {
    const squareSize = 1;
    const boardSize = 8;
    
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const isLight = (row + col) % 2 === 0;
            const geometry = new THREE.BoxGeometry(squareSize, 0.2, squareSize);
            const material = new THREE.MeshStandardMaterial({
                color: isLight ? 0xF0D9B5 : 0xB58863,
                metalness: 0.3,
                roughness: 0.7
            });
            
            const square = new THREE.Mesh(geometry, material);
            square.position.set(
                col - 3.5,
                -0.1,
                row - 3.5
            );
            square.receiveShadow = true;
            square.userData = { row, col, type: 'square' };
            
            boardGroup.add(square);
        }
    }
    
    // Board base
    const baseGeometry = new THREE.BoxGeometry(9, 0.3, 9);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x34495E,
        metalness: 0.5,
        roughness: 0.5
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.35;
    base.receiveShadow = true;
    boardGroup.add(base);
}

// Initialize Board State
function initBoardState() {
    // Initialize 8x8 board
    chessState.board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Setup pieces
    const setup = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            chessState.board[row][col] = setup[row][col];
        }
    }
}

// Create 3D Chess Pieces
function createPieces() {
    piecesGroup.clear();
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = chessState.board[row][col];
            if (piece) {
                const isWhite = piece === piece.toUpperCase();
                const mesh = createPieceMesh(piece.toLowerCase(), isWhite);
                mesh.position.set(col - 3.5, 0.5, row - 3.5);
                mesh.userData = { row, col, piece, type: 'piece' };
                mesh.castShadow = true;
                piecesGroup.add(mesh);
            }
        }
    }
}

// Create Individual Piece Mesh
function createPieceMesh(type, isWhite) {
    let geometry;
    const color = isWhite ? 0xECF0F1 : 0x2C3E50;
    
    switch(type) {
        case 'p': // Pawn
            geometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 16);
            break;
        case 'r': // Rook
            geometry = new THREE.CylinderGeometry(0.25, 0.3, 0.9, 16);
            break;
        case 'n': // Knight
            geometry = new THREE.ConeGeometry(0.3, 1, 16);
            break;
        case 'b': // Bishop
            geometry = new THREE.ConeGeometry(0.25, 1.1, 16);
            break;
        case 'q': // Queen
            geometry = new THREE.SphereGeometry(0.35, 16, 16);
            break;
        case 'k': // King
            const king = new THREE.Group();
            const body = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.35, 1, 16),
                new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.3 })
            );
            const crown = new THREE.Mesh(
                new THREE.ConeGeometry(0.15, 0.4, 8),
                new THREE.MeshStandardMaterial({ color: 0xF7DC6F, metalness: 0.9, roughness: 0.1 })
            );
            crown.position.y = 0.7;
            king.add(body);
            king.add(crown);
            return king;
        default:
            geometry = new THREE.SphereGeometry(0.3, 16, 16);
    }
    
    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.7,
        roughness: 0.3
    });
    
    return new THREE.Mesh(geometry, material);
}

// Mouse Interaction
function setupMouseInteraction() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([...piecesGroup.children, ...boardGroup.children], true);
        
        if (intersects.length > 0) {
            handleClick(intersects[0].object);
        }
    });
}

// Handle Click on Board
function handleClick(object) {
    if (chessState.isGameOver) return;
    
    // Find the root object with userData
    let target = object;
    while (target.parent && !target.userData.type) {
        target = target.parent;
    }
    
    if (!target.userData.type) return;
    
    if (target.userData.type === 'piece') {
        const { row, col, piece } = target.userData;
        const isWhite = piece === piece.toUpperCase();
        const isCorrectTurn = (isWhite && chessState.currentTurn === 'white') || 
                              (!isWhite && chessState.currentTurn === 'black');
        
        if (isCorrectTurn) {
            selectPiece(row, col);
        } else if (chessState.selectedPiece) {
            tryMove(row, col);
        }
    } else if (target.userData.type === 'square' && chessState.selectedPiece) {
        tryMove(target.userData.row, target.userData.col);
    }
}

// Select Piece
function selectPiece(row, col) {
    chessState.selectedPiece = { row, col };
    highlightPossibleMoves(row, col);
    window.playSound('click');
}

// Highlight Possible Moves
function highlightPossibleMoves(row, col) {
    // Clear previous highlights
    clearHighlights();
    
    const piece = chessState.board[row][col];
    const moves = getPossibleMoves(row, col, piece);
    
    moves.forEach(([r, c]) => {
        const square = boardGroup.children.find(
            child => child.userData.row === r && child.userData.col === c
        );
        
        if (square) {
            const highlight = new THREE.Mesh(
                new THREE.CircleGeometry(0.3, 32),
                new THREE.MeshBasicMaterial({ 
                    color: 0x4ECDC4, 
                    transparent: true, 
                    opacity: 0.5 
                })
            );
            highlight.rotation.x = -Math.PI / 2;
            highlight.position.set(c - 3.5, 0.11, r - 3.5);
            scene.add(highlight);
            highlightedSquares.push(highlight);
        }
    });
}

// Clear Highlights
function clearHighlights() {
    highlightedSquares.forEach(h => scene.remove(h));
    highlightedSquares = [];
}

// Get Possible Moves (Simplified)
function getPossibleMoves(row, col, piece) {
    const moves = [];
    const pieceType = piece.toLowerCase();
    const isWhite = piece === piece.toUpperCase();
    const direction = isWhite ? -1 : 1;
    
    switch(pieceType) {
        case 'p': // Pawn
            // Forward move
            if (isValidSquare(row + direction, col) && !chessState.board[row + direction][col]) {
                moves.push([row + direction, col]);
                // Double move from start
                if ((isWhite && row === 6) || (!isWhite && row === 1)) {
                    if (!chessState.board[row + 2 * direction][col]) {
                        moves.push([row + 2 * direction, col]);
                    }
                }
            }
            // Captures
            [-1, 1].forEach(dc => {
                const newRow = row + direction;
                const newCol = col + dc;
                if (isValidSquare(newRow, newCol)) {
                    const target = chessState.board[newRow][newCol];
                    if (target && isOpponentPiece(target, isWhite)) {
                        moves.push([newRow, newCol]);
                    }
                }
            });
            break;
            
        case 'r': // Rook
            addLinearMoves(moves, row, col, isWhite, [[1,0], [-1,0], [0,1], [0,-1]]);
            break;
            
        case 'n': // Knight
            const knightMoves = [
                [2,1], [2,-1], [-2,1], [-2,-1],
                [1,2], [1,-2], [-1,2], [-1,-2]
            ];
            knightMoves.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidSquare(newRow, newCol)) {
                    const target = chessState.board[newRow][newCol];
                    if (!target || isOpponentPiece(target, isWhite)) {
                        moves.push([newRow, newCol]);
                    }
                }
            });
            break;
            
        case 'b': // Bishop
            addLinearMoves(moves, row, col, isWhite, [[1,1], [1,-1], [-1,1], [-1,-1]]);
            break;
            
        case 'q': // Queen
            addLinearMoves(moves, row, col, isWhite, [
                [1,0], [-1,0], [0,1], [0,-1],
                [1,1], [1,-1], [-1,1], [-1,-1]
            ]);
            break;
            
        case 'k': // King
            const kingMoves = [
                [1,0], [-1,0], [0,1], [0,-1],
                [1,1], [1,-1], [-1,1], [-1,-1]
            ];
            kingMoves.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isValidSquare(newRow, newCol)) {
                    const target = chessState.board[newRow][newCol];
                    if (!target || isOpponentPiece(target, isWhite)) {
                        moves.push([newRow, newCol]);
                    }
                }
            });
            break;
    }
    
    return moves;
}

// Add Linear Moves (for Rook, Bishop, Queen)
function addLinearMoves(moves, row, col, isWhite, directions) {
    directions.forEach(([dr, dc]) => {
        let newRow = row + dr;
        let newCol = col + dc;
        
        while (isValidSquare(newRow, newCol)) {
            const target = chessState.board[newRow][newCol];
            
            if (!target) {
                moves.push([newRow, newCol]);
            } else {
                if (isOpponentPiece(target, isWhite)) {
                    moves.push([newRow, newCol]);
                }
                break;
            }
            
            newRow += dr;
            newCol += dc;
        }
    });
}

// Try Move
function tryMove(toRow, toCol) {
    const { row: fromRow, col: fromCol } = chessState.selectedPiece;
    const piece = chessState.board[fromRow][fromCol];
    const moves = getPossibleMoves(fromRow, fromCol, piece);
    
    const isValidMove = moves.some(([r, c]) => r === toRow && c === toCol);
    
    if (isValidMove) {
        makeMove(fromRow, fromCol, toRow, toCol);
    }
    
    chessState.selectedPiece = null;
    clearHighlights();
}

// Make Move
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = chessState.board[fromRow][fromCol];
    const captured = chessState.board[toRow][toCol];
    
    // Capture piece
    if (captured) {
        const isWhite = captured === captured.toUpperCase();
        chessState.capturedPieces[isWhite ? 'white' : 'black'].push(captured);
        updateCapturedPieces();
        window.playSound('capture');
    } else {
        window.playSound('move');
    }
    
    // Move piece
    chessState.board[toRow][toCol] = piece;
    chessState.board[fromRow][fromCol] = null;
    
    // Record move
    const moveNotation = `${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    chessState.moveHistory.push({
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol },
        piece,
        captured,
        notation: moveNotation
    });
    
    // Update display
    createPieces();
    updateMoveHistory();
    updateGameStatus();
    
    // Switch turn
    chessState.currentTurn = chessState.currentTurn === 'white' ? 'black' : 'white';
    updateTurnDisplay();
    
    // Save game to history
    saveGameToHistory();
    recordAttendance();
    
    // Check for game over
    if (isCheckmate()) {
        endGame(chessState.currentTurn === 'white' ? 'black' : 'white');
    }
    
    // AI move
    if (chessState.aiMode && chessState.currentTurn === 'black') {
        setTimeout(() => makeAIMove(), 1000);
    }
}

// Helper Functions
function isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isOpponentPiece(piece, isWhite) {
    return (isWhite && piece === piece.toLowerCase()) || 
           (!isWhite && piece === piece.toUpperCase());
}

// Update Displays
function updateCapturedPieces() {
    const whiteContainer = document.getElementById('capturedWhite');
    const blackContainer = document.getElementById('capturedBlack');
    
    whiteContainer.innerHTML = chessState.capturedPieces.white.map(p => 
        `<span style="font-size: 1.2rem; margin: 2px;">${getPieceSymbol(p)}</span>`
    ).join('');
    
    blackContainer.innerHTML = chessState.capturedPieces.black.map(p => 
        `<span style="font-size: 1.2rem; margin: 2px;">${getPieceSymbol(p)}</span>`
    ).join('');
}

function getPieceSymbol(piece) {
    const symbols = {
        'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
        'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
    };
    return symbols[piece] || piece;
}

function updateMoveHistory() {
    const movesList = document.getElementById('movesList');
    movesList.innerHTML = chessState.moveHistory.map((move, i) => 
        `<div class="move-item">${i + 1}. ${move.notation}</div>`
    ).join('');
}

function updateTurnDisplay() {
    document.getElementById('currentTurn').textContent = 
        chessState.currentTurn.charAt(0).toUpperCase() + chessState.currentTurn.slice(1);
}

function updateGameStatus() {
    document.getElementById('moveCount').textContent = chessState.moveHistory.length;
}

function isCheckmate() {
    // Simplified checkmate detection - would need full implementation
    return false;
}

function endGame(winner) {
    chessState.isGameOver = true;
    const message = winner === 'draw' ? 'The game ended in a draw!' : 
                   `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`;
    window.showVictoryModal(winner, message);
}

// Game Controls
function setupGameControls() {
    document.getElementById('newGame').addEventListener('click', resetChessGame);
    document.getElementById('undoMove').addEventListener('click', undoMove);
    document.getElementById('rotateBoard').addEventListener('click', rotateBoard);
    document.getElementById('playAI').addEventListener('click', startAIGame);
    
    // Difficulty buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            chessState.aiDifficulty = btn.dataset.difficulty;
        });
    });
}

function resetChessGame() {
    chessState.board = [];
    chessState.currentTurn = 'white';
    chessState.selectedPiece = null;
    chessState.moveHistory = [];
    chessState.capturedPieces = { white: [], black: [] };
    chessState.isGameOver = false;
    chessState.aiMode = false;
    
    initBoardState();
    createPieces();
    updateMoveHistory();
    updateCapturedPieces();
    updateTurnDisplay();
    updateGameStatus();
    
    document.getElementById('gameStatus').textContent = 'Ready';
    window.playSound('click');
}

function undoMove() {
    if (chessState.moveHistory.length === 0) return;
    
    const lastMove = chessState.moveHistory.pop();
    chessState.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    chessState.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
    
    if (lastMove.captured) {
        const isWhite = lastMove.captured === lastMove.captured.toUpperCase();
        const index = chessState.capturedPieces[isWhite ? 'white' : 'black'].indexOf(lastMove.captured);
        if (index > -1) {
            chessState.capturedPieces[isWhite ? 'white' : 'black'].splice(index, 1);
        }
    }
    
    chessState.currentTurn = chessState.currentTurn === 'white' ? 'black' : 'white';
    
    createPieces();
    updateMoveHistory();
    updateCapturedPieces();
    updateTurnDisplay();
    updateGameStatus();
    
    window.playSound('click');
}

function rotateBoard() {
    chessState.boardRotation += 180;
    boardGroup.rotation.y = THREE.MathUtils.degToRad(chessState.boardRotation);
    piecesGroup.rotation.y = THREE.MathUtils.degToRad(chessState.boardRotation);
    window.playSound('click');
}

function startAIGame() {
    chessState.aiMode = true;
    resetChessGame();
    document.getElementById('gameStatus').textContent = 'Playing vs AI';
    window.playSound('click');
}

// AI Move (will be enhanced in ai-engine.js)
function makeAIMove() {
    if (!chessState.aiMode || chessState.currentTurn !== 'black') return;
    
    // Show thinking indicator
    document.getElementById('thinkingIndicator').classList.add('active');
    
    setTimeout(() => {
        // Simple random move for now
        const allMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = chessState.board[row][col];
                if (piece && piece === piece.toLowerCase()) {
                    const moves = getPossibleMoves(row, col, piece);
                    moves.forEach(([toRow, toCol]) => {
                        allMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    });
                }
            }
        }
        
        if (allMoves.length > 0) {
            const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            makeMove(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol);
        }
        
        document.getElementById('thinkingIndicator').classList.remove('active');
    }, 1500);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Subtle board rotation
    if (piecesGroup) {
        piecesGroup.children.forEach((piece, i) => {
            if (piece.userData.piece) {
                piece.rotation.y += 0.001;
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Window Resize
window.addEventListener('resize', () => {
    const container = document.getElementById('chessBoard');
    if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initChessBoard();
});

// Export for use in other files
window.resetChessGame = resetChessGame;
window.saveGameToHistory = function() {
    // Will be implemented in history.js
};
window.recordAttendance = function() {
    // Will be implemented in attendance.js
};
