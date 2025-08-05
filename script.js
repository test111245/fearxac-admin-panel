// FearXAC Admin Panel JavaScript
let currentPage = 'overview';
let isLoggedIn = false;
let refreshInterval;

// Login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Demo credentials for FearXAC
    if (username === 'admin' && password === 'fearxac2025') {
        login(username);
    } else {
        alert('Access Denied! Invalid credentials for FearXAC system.');
    }
});

function login(username) {
    isLoggedIn = true;
    document.getElementById('currentUser').textContent = username;
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    
    startThreatMonitoring();
    showDetectionAlert('SUCCESS', 'FearXAC system access granted - Protection systems online');
}

function logout() {
    isLoggedIn = false;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
    clearInterval(refreshInterval);
    
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageName).classList.add('active');
    
    // Add active class to clicked nav item
    event.target.closest('.nav-item').classList.add('active');
    
    currentPage = pageName;
}

function startThreatMonitoring() {
    refreshInterval = setInterval(() => {
        if (isLoggedIn) {
            updateThreatStats();
            if (Math.random() < 0.3) { // 30% chance of new detection
                simulateDetection();
            }
        }
    }, 5000);
}

function updateThreatStats() {
    const threatsBlocked = Math.floor(Math.random() * 50) + 1200;
    const playersProtected = Math.floor(Math.random() * 20) + 50;
    
    if (document.getElementById('threatsBlocked')) {
        document.getElementById('threatsBlocked').textContent = threatsBlocked.toLocaleString();
    }
    if (document.getElementById('playersProtected')) {
        document.getElementById('playersProtected').textContent = playersProtected;
    }
}

function simulateDetection() {
    const detectionTypes = [
        { type: 'CRITICAL', details: 'Speed hack + Godmode detected - Auto-ban initiated', player: 'Cheater' + Math.floor(Math.random() * 999) },
        { type: 'HIGH', details: 'Teleportation hack detected - Player kicked', player: 'SuspiciousUser' + Math.floor(Math.random() * 999) },
        { type: 'MEDIUM', details: 'Weapon spawn violation - Warning issued', player: 'Player' + Math.floor(Math.random() * 999) },
        { type: 'LOW', details: 'Suspicious movement pattern detected', player: 'User' + Math.floor(Math.random() * 999) }
    ];
    
    const detection = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
    showDetectionAlert(detection.type, `${detection.player}: ${detection.details}`);
    
    // Add to live logs
    if (currentPage === 'detections') {
        addDetectionLog(detection);
    }
    
    // Add to threat activity table
    addThreatActivity(detection);
}

function showDetectionAlert(type, details) {
    const alertPanel = document.getElementById('detectionAlert');
    const alertType = document.getElementById('alertType');
    const alertDetails = document.getElementById('alertDetails');
    
    alertType.textContent = `${type} THREAT DETECTED`;
    alertDetails.textContent = details;
    alertPanel.style.display = 'block';
    
    setTimeout(() => {
        alertPanel.style.display = 'none';
    }, 5000);
}

function addDetectionLog(detection) {
    const logsContainer = document.getElementById('liveDetections');
    if (!logsContainer) return;
    
    const time = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-type detection">${detection.type}</span>
        <span class="log-message">[FEARXAC] ${detection.details}</span>
    `;
    
    logsContainer.insertBefore(logEntry, logsContainer.firstChild);
    
    // Keep only last 20 logs
    while (logsContainer.children.length > 20) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

function addThreatActivity(detection) {
    const threatTable = document.getElementById('threatActivity');
    if (!threatTable) return;
    
    const time = new Date().toLocaleTimeString();
    const threatLevels = {
        'CRITICAL': 'threat-critical',
        'HIGH': 'threat-high',
        'MEDIUM': 'threat-medium',
        'LOW': 'threat-low'
    };
    
    const actions = {
        'CRITICAL': 'Banned',
        'HIGH': 'Kicked',
        'MEDIUM': 'Warning',
        'LOW': 'Flagged'
    };
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${time}</td>
        <td><span class="threat-level ${threatLevels[detection.type]}">${detection.type}</span></td>
        <td>${detection.player}</td>
        <td>${detection.details.split(' - ')[0]}</td>
        <td><span class="btn ${detection.type === 'CRITICAL' ? 'danger' : 'warning'}">${actions[detection.type]}</span></td>
    `;
    
    threatTable.insertBefore(row, threatTable.firstChild);
    
    // Keep only last 10 entries
    while (threatTable.children.length > 10) {
        threatTable.removeChild(threatTable.lastChild);
    }
}

// Action functions
function scanPlayer(playerId) {
    showDetectionAlert('INFO', `Scanning player ${playerId} - Deep scan completed, no threats found`);
}

function kickPlayer(playerId) {
    if (confirm('Are you sure you want to kick this player?')) {
        showDetectionAlert('ACTION', `Player ${playerId} has been kicked by FearXAC system`);
        
        // Update player table
        const row = event.target.closest('tr');
        if (row) {
            row.style.opacity = '0.5';
            row.querySelector('.threat-level').textContent = 'Kicked';
            row.querySelector('.threat-level').className = 'threat-level threat-high';
        }
    }
}

function banPlayer(playerId) {
    if (confirm('Are you sure you want to permanently ban this player?')) {
        showDetectionAlert('ACTION', `Player ${playerId} has been permanently banned by FearXAC`);
        
        // Update player table
        const row = event.target.closest('tr');
        if (row) {
            row.style.opacity = '0.3';
            row.querySelector('.threat-level').textContent = 'Banned';
            row.querySelector('.threat-level').className = 'threat-level threat-critical';
        }
    }
}

function toggleProtection(type) {
    const button = event.target;
    const isEnabled = button.textContent === 'ENABLED';
    
    if (isEnabled) {
        button.textContent = 'DISABLED';
        button.className = 'btn warning';
        showDetectionAlert('CONFIG', `${type.toUpperCase()} protection disabled - Server vulnerability increased`);
    } else {
        button.textContent = 'ENABLED';
        button.className = 'btn success';
        showDetectionAlert('CONFIG', `${type.toUpperCase()} protection enabled - Server security enhanced`);
    }
}

function toggleAction(type) {
    const button = event.target;
    const isEnabled = button.textContent === 'ENABLED';
    
    if (isEnabled) {
        button.textContent = 'DISABLED';
        button.className = 'btn warning';
        showDetectionAlert('CONFIG', `${type.toUpperCase()} action disabled`);
    } else {
        button.textContent = 'ENABLED';
        button.className = 'btn success';
        showDetectionAlert('CONFIG', `${type.toUpperCase()} action enabled`);
    }
}

function saveConfig() {
    showDetectionAlert('SUCCESS', 'FearXAC configuration saved successfully - All protection systems updated');
}

function scanAllPlayers() {
    showDetectionAlert('INFO', 'Full server scan initiated - Scanning all 64 players for threats...');
    
    setTimeout(() => {
        const threatsFound = Math.floor(Math.random() * 3);
        if (threatsFound > 0) {
            showDetectionAlert('WARNING', `Server scan complete - ${threatsFound} potential threats detected and flagged`);
        } else {
            showDetectionAlert('SUCCESS', 'Server scan complete - No threats detected, all players clean');
        }
    }, 3000);
}

function refreshPlayers() {
    showDetectionAlert('INFO', 'Player list refreshed - Real-time data synchronized');
    
    // Simulate player list update
    const playerCount = Math.floor(Math.random() * 30) + 40;
    if (document.getElementById('playersProtected')) {
        document.getElementById('playersProtected').textContent = playerCount;
    }
}

function refreshBans() {
    showDetectionAlert('INFO', 'Ban database refreshed - All active bans synchronized');
}

function addBan() {
    const playerName = prompt('Enter player name to ban:');
    const reason = prompt('Enter ban reason:');
    
    if (playerName && reason) {
        showDetectionAlert('SUCCESS', `Manual ban added for ${playerName} - Reason: ${reason}`);
        
        // Add to bans table
        const bansTable = document.getElementById('bansTable');
        if (bansTable) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${playerName}</td>
                <td>Manual Ban</td>
                <td>${reason}</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td><span class="threat-level threat-critical">Permanent</span></td>
                <td>
                    <button class="btn success" onclick="unbanPlayer('manual:${playerName}')">Unban</button>
                </td>
            `;
            bansTable.insertBefore(row, bansTable.firstChild);
        }
    }
}

function unbanPlayer(steamId) {
    if (confirm('Are you sure you want to unban this player?')) {
        showDetectionAlert('SUCCESS', 'Player unbanned successfully - Access restored');
        
        // Remove from table
        const row = event.target.closest('tr');
        if (row) {
            row.style.opacity = '0.3';
            setTimeout(() => {
                row.remove();
            }, 1000);
        }
    }
}

function appealBan(steamId) {
    showDetectionAlert('INFO', 'Ban review initiated - Case flagged for manual review');
}

function clearLogs() {
    if (confirm('Clear all security logs? This action cannot be undone.')) {
        const containers = ['securityLogs', 'liveDetections'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="log-entry">
                        <span class="log-time">${new Date().toLocaleTimeString()}</span>
                        <span class="log-type info">INFO</span>
                        <span class="log-message">[FEARXAC] Security logs cleared by administrator</span>
                    </div>
                `;
            }
        });
        showDetectionAlert('INFO', 'Security logs cleared successfully');
    }
}

function exportLogs() {
    showDetectionAlert('SUCCESS', 'Security logs exported successfully - File saved to downloads');
    
    // Simulate file download
    const logData = "FearXAC Security Log Export\n" +
                   "Generated: " + new Date().toISOString() + "\n" +
                   "=================================\n" +
                   "Sample log entries would be here...";
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fearxac_logs_' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Search functionality
function setupSearchHandlers() {
    const searchBoxes = ['playerSearch', 'banSearch', 'logSearch'];
    
    searchBoxes.forEach(id => {
        const searchBox = document.getElementById(id);
        if (searchBox) {
            searchBox.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const tableId = id.replace('Search', 'Table');
                const table = document.getElementById(tableId);
                
                if (table) {
                    const rows = table.querySelectorAll('tr');
                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(searchTerm) ? '' : 'none';
                    });
                }
            });
        }
    });
}

// Initialize search handlers when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setupSearchHandlers();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                showPage('overview');
                break;
            case '2':
                event.preventDefault();
                showPage('detections');
                break;
            case '3':
                event.preventDefault();
                showPage('players');
                break;
            case '4':
                event.preventDefault();
                showPage('bans');
                break;
            case '5':
                event.preventDefault();
                showPage('config');
                break;
            case 'l':
                event.preventDefault();
                if (isLoggedIn) {
                    logout();
                }
                break;
        }
    }
    
    // ESC key to close alerts
    if (event.key === 'Escape') {
        const alert = document.getElementById('detectionAlert');
        if (alert && alert.style.display === 'block') {
            alert.style.display = 'none';
        }
    }
});

// Add some demo data on page load
function initializeDemoData() {
    // Add some initial threat activity
    const initialThreats = [
        { type: 'CRITICAL', details: 'Speed hack + Godmode detected', player: 'Cheater123' },
        { type: 'HIGH', details: 'Teleportation hack detected', player: 'SuspiciousPlayer' },
        { type: 'MEDIUM', details: 'Weapon spawn violation', player: 'PlayerABC' }
    ];
    
    initialThreats.forEach(threat => {
        addThreatActivity(threat);
    });
}

// Initialize demo data when page loads
window.addEventListener('load', function() {
    setTimeout(initializeDemoData, 1000);
});

// Prevent right-click context menu for security
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable F12 and other dev tools shortcuts for security
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        showDetectionAlert('SECURITY', 'Developer tools access blocked - FearXAC security protocol active');
    }
});

// Add loading animation for buttons
function addButtonLoading(button, duration = 2000) {
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, duration);
}

// Enhanced button interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && !e.target.textContent.includes('Processing')) {
        const actions = ['Scan', 'Refresh', 'Save', 'Export', 'Add'];
        if (actions.some(action => e.target.textContent.includes(action))) {
            addButtonLoading(e.target, 1500);
        }
    }
});

// Auto-logout after inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (isLoggedIn) {
        inactivityTimer = setTimeout(() => {
            showDetectionAlert('SECURITY', 'Session expired due to inactivity - Logging out for security');
            setTimeout(logout, 2000);
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Reset timer on user activity
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

console.log('🛡️ FearXAC Admin Panel Loaded - System Ready');