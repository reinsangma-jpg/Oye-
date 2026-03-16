// AI Chess Engine
const aiEngine = {
    difficulty: 'medium',
    searchDepth: {
        easy: 1,
        medium: 2,
        hard: 3
    },
    pieceValues: {
        'p': 100,
        'n': 320,
        'b': 330,
        'r': 500,
        'q': 900,
        'k': 20000
    }
};

// Evaluate board position
function evaluateBoard(board) {
    let score = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const value = aiEngine.pieceValues[piece.toLowerCase()];
                const isWhite = piece === piece.toUpperCase();
                score += isWhite ? value : -value;
                
                // Positional bonuses
                score += getPositionalValue(piece.toLowerCase(), row, col, isWhite);
            }
        }
    }
    
    return score;
}

// Get positional value
function getPositionalValue(pieceType, row, col, isWhite) {
    const centerBonus = Math.max(0, 2 - Math.abs(row - 3.5)) + 
                        Math.max(0, 2 - Math.abs(col - 3.5));
    
    switch(pieceType) {
        case 'p':
            // Pawns advance
            return isWhite ? (7 - row) * 10 : row * 10;
        case 'n':
        case 'b':
            // Knights and bishops prefer center
            return centerBonus * 5;
        case 'k':
            // King safety in early game
            return isWhite ? (row > 5 ? 20 : 0) : (row < 2 ? 20 : 0);
        default:
            return 0;
    }
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, isMaximizing, currentTurn) {
    if (depth === 0) {
        return evaluateBoard(board);
    }
    
    const moves = getAllPossibleMoves(board, currentTurn);
    
    if (moves.length === 0) {
        return isMaximizing ? -Infinity : Infinity;
    }
    
    if (isMaximizing) {
        let maxEval = -Infinity;
        
        for (const move of moves) {
            const newBoard = applyMove(board, move);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, false, 
                                     currentTurn === 'white' ? 'black' : 'white');
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            
            if (beta <= alpha) break; // Alpha-beta pruning
        }
        
        return maxEval;
    } else {
        let minEval = Infinity;
        
        for (const move of moves) {
            const newBoard = applyMove(board, move);
            const evalScore = minimax(newBoard, depth - 1, alpha, beta, true,
                                     currentTurn === 'white' ? 'black' : 'white');
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            
            if (beta <= alpha) break; // Alpha-beta pruning
        }
        
        return minEval;
    }
}

// Get all possible moves for a color
function getAllPossibleMoves(board, color) {
    const moves = [];
    const isWhite = color === 'white';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!piece) continue;
            
            const pieceIsWhite = piece === piece.toUpperCase();
            if (pieceIsWhite !== isWhite) continue;
            
            const pieceMoves = getPossibleMovesForPiece(board, row, col, piece);
            pieceMoves.forEach(([toRow, toCol]) => {
                moves.push({
                    fromRow: row,
                    fromCol: col,
                    toRow,
                    toCol,
                    piece
                });
            });
        }
    }
    
    return moves;
}

// Get possible moves for a specific piece (simplified version)
function getPossibleMovesForPiece(board, row, col, piece) {
    // This would use the same logic as in chess.js
    // For now, returning a simplified version
    const moves = [];
    const pieceType = piece.toLowerCase();
    const isWhite = piece === piece.toUpperCase();
    
    // Add basic move logic here (simplified)
    const directions = {
        'r': [[1,0], [-1,0], [0,1], [0,-1]],
        'b': [[1,1], [1,-1], [-1,1], [-1,-1]],
        'q': [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]],
        'k': [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]],
        'n': [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]]
    };
    
    if (directions[pieceType]) {
        const dirs = directions[pieceType];
        const maxDist = ['k', 'n'].includes(pieceType) ? 1 : 8;
        
        dirs.forEach(([dr, dc]) => {
            for (let dist = 1; dist <= maxDist; dist++) {
                const newRow = row + dr * dist;
                const newCol = col + dc * dist;
                
                if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
                
                const target = board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                    if (['k', 'n'].includes(pieceType)) break;
                } else {
                    if ((isWhite && target === target.toLowerCase()) ||
                        (!isWhite && target === target.toUpperCase())) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
            }
        });
    }
    
    // Pawn moves
    if (pieceType === 'p') {
        const direction = isWhite ? -1 : 1;
        const newRow = row + direction;
        
        if (newRow >= 0 && newRow < 8 && !board[newRow][col]) {
            moves.push([newRow, col]);
        }
        
        // Captures
        [-1, 1].forEach(dc => {
            const newCol = col + dc;
            if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) {
                const target = board[newRow][newCol];
                if (target && ((isWhite && target === target.toLowerCase()) ||
                              (!isWhite && target === target.toUpperCase()))) {
                    moves.push([newRow, newCol]);
                }
            }
        });
    }
    
    return moves;
}

// Apply move to board (returns new board)
function applyMove(board, move) {
    const newBoard = board.map(row => [...row]);
    newBoard[move.toRow][move.toCol] = newBoard[move.fromRow][move.fromCol];
    newBoard[move.fromRow][move.fromCol] = null;
    return newBoard;
}

// Get best move for AI
function getBestMove(board, difficulty, currentTurn) {
    const depth = aiEngine.searchDepth[difficulty];
    const moves = getAllPossibleMoves(board, currentTurn);
    
    if (moves.length === 0) return null;
    
    // For easy mode, sometimes make random moves
    if (difficulty === 'easy' && Math.random() < 0.3) {
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    let bestMove = null;
    let bestValue = currentTurn === 'black' ? Infinity : -Infinity;
    
    for (const move of moves) {
        const newBoard = applyMove(board, move);
        const value = minimax(
            newBoard,
            depth - 1,
            -Infinity,
            Infinity,
            currentTurn === 'white',
            currentTurn === 'white' ? 'black' : 'white'
        );
        
        if (currentTurn === 'black') {
            if (value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        } else {
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
    }
    
    return bestMove;
}

// Export for use in chess.js
window.aiEngine = {
    getBestMove,
    evaluateBoard
};
