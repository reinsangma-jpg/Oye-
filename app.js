// App State
const appState = {
    currentSection: 'chess',
    darkTheme: false,
    soundEnabled: true
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initSoundToggle();
    createBackgroundParticles();
    loadAppState();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            switchSection(sectionId);
        });
    });
}

function switchSection(sectionId) {
    // Update active section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    appState.currentSection = sectionId;
    saveAppState();
    
    // Play sound
    playSound('navigate');
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', () => {
        appState.darkTheme = !appState.darkTheme;
        document.body.classList.toggle('dark-theme');
        
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = appState.darkTheme ? '☀️' : '🌙';
        
        saveAppState();
        playSound('click');
    });
}

// Sound Toggle
function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    
    soundToggle.addEventListener('click', () => {
        appState.soundEnabled = !appState.soundEnabled;
        
        const icon = soundToggle.querySelector('.sound-icon');
        icon.textContent = appState.soundEnabled ? '🔊' : '🔇';
        
        saveAppState();
    });
}

// Background Particles
function createBackgroundParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Sound Effects
const sounds = {
    click: () => {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVq/m77JdGAg+ltryxnMoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg=';
        if (appState.soundEnabled) audio.play();
    },
    navigate: () => {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVq/m77JdGAg+ltryxnMoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg=';
        if (appState.soundEnabled) audio.play();
    },
    move: () => {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVq/m77JdGAg+ltryxnMoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg=';
        if (appState.soundEnabled) audio.play();
    },
    capture: () => {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVq/m77JdGAg+ltryxnMoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg=';
        if (appState.soundEnabled) audio.play();
    },
    victory: () => {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVq/m77JdGAg+ltryxnMoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg+ltryxnQoBSl+y/LaizsIGGS57OihUBELTKXh8bllHAU2jdXzz38vBSd7yvLaizYIHm3A7+KYRw0PVK7m77NdGAg=';
        if (appState.soundEnabled) audio.play();
    }
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type]();
    }
}

// Local Storage
function saveAppState() {
    localStorage.setItem('chessmaster_state', JSON.stringify(appState));
}

function loadAppState() {
    const saved = localStorage.getItem('chessmaster_state');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(appState, loaded);
        
        if (appState.darkTheme) {
            document.body.classList.add('dark-theme');
            document.querySelector('.theme-icon').textContent = '☀️';
        }
        
        if (!appState.soundEnabled) {
            document.querySelector('.sound-icon').textContent = '🔇';
        }
    }
}

// Victory Modal
function showVictoryModal(winner, message) {
    const modal = document.getElementById('victoryModal');
    const title = document.getElementById('victoryTitle');
    const messageEl = document.getElementById('victoryMessage');
    
    title.textContent = winner === 'draw' ? 'Game Draw!' : 
                       winner === 'white' ? 'White Wins!' : 'Black Wins!';
    messageEl.textContent = message;
    
    modal.classList.add('active');
    playSound('victory');
    createConfetti();
}

function closeVictoryModal() {
    document.getElementById('victoryModal').classList.remove('active');
}

document.getElementById('closeModal').addEventListener('click', closeVictoryModal);
document.getElementById('playAgain').addEventListener('click', () => {
    closeVictoryModal();
    if (typeof resetChessGame === 'function') {
        resetChessGame();
    }
});

// Confetti Effect
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    if (!confettiContainer) return;
    
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const colors = ['#FF6B9D', '#4ECDC4', '#F7DC6F', '#95E1D3', '#FFB4D0'];
        
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -20px;
            opacity: ${Math.random() * 0.7 + 0.3};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        confettiContainer.appendChild(confetti);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(600px) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for other modules
window.playSound = playSound;
window.showVictoryModal = showVictoryModal;
