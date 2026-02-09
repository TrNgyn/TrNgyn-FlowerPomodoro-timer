// Flower Pomodoro Timer - Main Application Logic

class PomodoroTimer {
    constructor() {
        this.state = 'idle'; // idle, running, paused, break
        this.timeRemaining = 0; // in seconds
        this.totalTime = 0; // total time for current session
        this.startTime = null;
        this.pausedTime = 0;
        this.animationFrameId = null;
        this.workDuration = 25;
        this.breakDuration = 5;

        this.init();
    }

    init() {
        // Load settings from storage
        const settings = Storage.getSettings();
        this.workDuration = settings.workDuration;
        this.breakDuration = settings.breakDuration;

        // Initialize UI
        this.updateTimerDisplay();
        this.updateStatsDisplay();

        // Set up event listeners
        this.setupEventListeners();

        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Initialize flower
        if (typeof Flower !== 'undefined') {
            Flower.init();
        }
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('skipBtn').addEventListener('click', () => this.skip());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());

        // Settings
        document.getElementById('settingsToggle').addEventListener('click', () => this.toggleSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Space: Start/Pause
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                if (this.state === 'idle' || this.state === 'paused') {
                    this.start();
                } else if (this.state === 'running') {
                    this.pause();
                }
            }
            // R: Reset
            if (e.code === 'KeyR' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.reset();
            }
        });
    }

    start() {
        if (this.state === 'idle') {
            // Starting fresh
            this.totalTime = this.workDuration * 60;
            this.timeRemaining = this.totalTime;
            this.state = 'running';
            this.startTime = Date.now();

            document.getElementById('sessionType').textContent = 'Focus time!';
        } else if (this.state === 'paused') {
            // Resuming from pause
            this.state = 'running';
            this.startTime = Date.now() - this.pausedTime;
        }

        this.updateButtonStates();
        this.updateBodyClass();
        this.tick();
    }

    pause() {
        if (this.state === 'running') {
            this.state = 'paused';
            this.pausedTime = Date.now() - this.startTime;

            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            document.getElementById('sessionType').textContent = 'Paused';
            this.updateButtonStates();
            this.updateBodyClass();
        }
    }

    skip() {
        if (this.state === 'break') {
            // Skip break, start new work session
            this.reset();
        } else if (this.state === 'running' || this.state === 'paused') {
            // Skip to break
            this.completeSession();
        }
    }

    reset() {
        this.state = 'idle';
        this.timeRemaining = this.workDuration * 60;
        this.totalTime = this.workDuration * 60;
        this.startTime = null;
        this.pausedTime = 0;

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        document.getElementById('sessionType').textContent = 'Ready to focus?';
        this.updateTimerDisplay();
        this.updateButtonStates();
        this.updateBodyClass();

        // Reset flower
        if (typeof Flower !== 'undefined') {
            Flower.reset();
        }
    }

    tick() {
        if (this.state !== 'running') return;

        const elapsed = Date.now() - this.startTime;
        this.timeRemaining = Math.max(0, this.totalTime - Math.floor(elapsed / 1000));

        this.updateTimerDisplay();
        this.updateProgress();

        if (this.timeRemaining <= 0) {
            this.completeSession();
        } else {
            this.animationFrameId = requestAnimationFrame(() => this.tick());
        }
    }

    completeSession() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.state === 'running' || this.state === 'paused') {
            // Work session completed
            const stats = Storage.updateStats(this.workDuration);
            this.updateStatsDisplay();

            // Show completion and start break
            this.state = 'break';
            this.totalTime = this.breakDuration * 60;
            this.timeRemaining = this.totalTime;
            this.startTime = Date.now();

            document.getElementById('sessionType').textContent = 'Break time!';
            document.title = 'Break Time - Flower Pomodoro';

            // Update flower to full bloom
            if (typeof Flower !== 'undefined') {
                Flower.updateGrowth(100);
            }

            // Auto-start break
            this.tick();
        } else if (this.state === 'break') {
            // Break completed
            document.getElementById('sessionType').textContent = 'Break complete!';
            document.title = 'Flower Pomodoro - Focus & Grow';
            this.reset();
        }

        this.updateButtonStates();
        this.updateBodyClass();
    }

    updateProgress() {
        const progress = ((this.totalTime - this.timeRemaining) / this.totalTime) * 100;

        // Update flower growth (only during work sessions)
        if (this.state === 'running' && typeof Flower !== 'undefined') {
            Flower.updateGrowth(progress);
        }

        // Update page title with timer
        if (this.state === 'running' || this.state === 'paused') {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Flower Pomodoro`;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerText').textContent = display;
    }

    updateButtonStates() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (this.state === 'idle' || this.state === 'paused') {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
        } else if (this.state === 'running' || this.state === 'break') {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        }
    }

    updateBodyClass() {
        const container = document.querySelector('.container');
        container.classList.remove('timer-running', 'timer-paused', 'timer-break');

        if (this.state === 'running') {
            container.classList.add('timer-running');
        } else if (this.state === 'paused') {
            container.classList.add('timer-paused');
        } else if (this.state === 'break') {
            container.classList.add('timer-break');
        }
    }

    updateStatsDisplay() {
        const stats = Storage.getStats();
        document.getElementById('todaySessions').textContent = stats.todaySessions;
        document.getElementById('totalMinutes').textContent = stats.totalMinutes;
        document.getElementById('totalSessions').textContent = stats.totalSessions;
    }

    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.toggle('hidden');

        // Load current settings into inputs
        if (!panel.classList.contains('hidden')) {
            const settings = Storage.getSettings();
            document.getElementById('workDuration').value = settings.workDuration;
            document.getElementById('breakDuration').value = settings.breakDuration;
        }
    }

    saveSettings() {
        const workDuration = document.getElementById('workDuration').value;
        const breakDuration = document.getElementById('breakDuration').value;

        const settings = Storage.saveSettings({
            workDuration: workDuration,
            breakDuration: breakDuration
        });

        this.workDuration = settings.workDuration;
        this.breakDuration = settings.breakDuration;

        // Update timer display if idle
        if (this.state === 'idle') {
            this.timeRemaining = this.workDuration * 60;
            this.totalTime = this.workDuration * 60;
            this.updateTimerDisplay();
        }

        // Hide settings panel
        document.getElementById('settingsPanel').classList.add('hidden');

        // Show confirmation (optional)
        const sessionType = document.getElementById('sessionType');
        const originalText = sessionType.textContent;
        sessionType.textContent = 'Settings saved!';
        setTimeout(() => {
            sessionType.textContent = originalText;
        }, 2000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timer = new PomodoroTimer();
});
