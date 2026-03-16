// Game History Manager
const historyManager = {
    games: [],
    storageKey: 'chessmaster_game_history'
};

// Initialize History
function initHistory() {
    loadHistory();
    updateHistoryDisplay();
}

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem(historyManager.storageKey);
    if (saved) {
        historyManager.games = JSON.parse(saved);
    }
}

// Save history to localStorage
function saveHistory() {
    localStorage.setItem(historyManager.storageKey, JSON.stringify(historyManager.games));
}

// Save current game to history
window.saveGameToHistory = function() {
    if (!chessState || chessState.moveHistory.length === 0) return;
    
    const game = {
        id: Date.now(),
        date: new Date().toISOString(),
        moves: [...chessState.moveHistory],
        result: chessState.isGameOver ? determineResult() : 'Ongoing',
        moveCount: chessState.moveHistory.length,
        aiMode: chessState.aiMode,
        aiDifficulty: chessState.aiDifficulty
    };
    
    // Check if this game already exists (update it)
    const existingIndex = historyManager.games.findIndex(g => 
        g.date === game.date && g.moveCount === game.moveCount
    );
    
    if (existingIndex >= 0) {
        historyManager.games[existingIndex] = game;
    } else {
        historyManager.games.unshift(game);
    }
    
    // Keep only last 50 games
    historyManager.games = historyManager.games.slice(0, 50);
    
    saveHistory();
    updateHistoryDisplay();
};

// Determine game result
function determineResult() {
    if (!chessState.isGameOver) return 'Ongoing';
    
    // Simple result determination
    const lastMove = chessState.moveHistory[chessState.moveHistory.length - 1];
    if (!lastMove) return 'Draw';
    
    const winner = chessState.currentTurn === 'white' ? 'Black' : 'White';
    return `${winner} Wins`;
}

// Update history display
function updateHistoryDisplay() {
    const stats = calculateStats();
    
    document.getElementById('totalGames').textContent = stats.total;
    document.getElementById('totalWins').textContent = stats.wins;
    document.getElementById('totalLosses').textContent = stats.losses;
    document.getElementById('totalDraws').textContent = stats.draws;
    
    const gamesList = document.getElementById('gamesList');
    
    if (historyManager.games.length === 0) {
        gamesList.innerHTML = '<p class="empty-state">No games played yet. Start your first game!</p>';
        return;
    }
    
    gamesList.innerHTML = historyManager.games.map(game => createGameCard(game)).join('');
    
    // Add click handlers for game cards
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = parseInt(card.dataset.gameId);
            viewGameDetails(gameId);
        });
    });
}

// Calculate stats
function calculateStats() {
    const stats = {
        total: historyManager.games.length,
        wins: 0,
        losses: 0,
        draws: 0
    };
    
    historyManager.games.forEach(game => {
        if (game.result.includes('White Wins')) {
            stats.wins++;
        } else if (game.result.includes('Black Wins')) {
            stats.losses++;
        } else if (game.result === 'Draw') {
            stats.draws++;
        }
    });
    
    return stats;
}

// Create game card HTML
function createGameCard(game) {
    const date = new Date(game.date);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    
    const resultClass = game.result.includes('White Wins') ? 'win' : 
                       game.result.includes('Black Wins') ? 'loss' : 'draw';
    
    return `
        <div class="game-card" data-game-id="${game.id}" style="
            background: rgba(255, 255, 255, 0.7);
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 4px solid ${resultClass === 'win' ? '#43e97b' : resultClass === 'loss' ? '#fa709a' : '#f7dc6f'};
        ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${dateStr}</strong>
                    <span style="color: #7F8C8D; margin-left: 1rem;">${timeStr}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 600; color: ${resultClass === 'win' ? '#27ae60' : resultClass === 'loss' ? '#e74c3c' : '#f39c12'};">
                        ${game.result}
                    </div>
                    <div style="font-size: 0.85rem; color: #7F8C8D;">
                        ${game.moveCount} moves ${game.aiMode ? `• AI (${game.aiDifficulty})` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// View game details
function viewGameDetails(gameId) {
    const game = historyManager.games.find(g => g.id === gameId);
    if (!game) return;
    
    // Create modal for game details
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2 style="margin-bottom: 1rem;">Game Details</h2>
            <div style="margin-bottom: 1rem;">
                <strong>Date:</strong> ${new Date(game.date).toLocaleString()}<br>
                <strong>Result:</strong> ${game.result}<br>
                <strong>Moves:</strong> ${game.moveCount}<br>
                ${game.aiMode ? `<strong>AI Difficulty:</strong> ${game.aiDifficulty}<br>` : ''}
            </div>
            <h3>Move List (PGN Style)</h3>
            <div style="max-height: 300px; overflow-y: auto; background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 8px; font-family: monospace;">
                ${game.moves.map((move, i) => `${i + 1}. ${move.notation}`).join('<br>')}
            </div>
            <button class="btn btn-primary" style="margin-top: 1rem;" onclick="this.closest('.modal').remove()">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initHistory();
});
