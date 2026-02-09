// LocalStorage management for Flower Pomodoro Timer

const Storage = {
    STORAGE_KEY: 'flowerPomodoro',

    // Default data structure
    getDefaultData() {
        return {
            stats: {
                totalSessions: 0,
                totalMinutes: 0,
                todaySessions: 0,
                todayMinutes: 0,
                lastSessionDate: this.getTodayDate()
            },
            settings: {
                workDuration: 25,
                breakDuration: 5
            },
            garden: [] // Array of completed flowers
        };
    },

    // Get today's date in YYYY-MM-DD format
    getTodayDate() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    // Load all data from localStorage
    loadData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                return this.getDefaultData();
            }

            const parsed = JSON.parse(data);

            // Check if we need to reset daily stats
            if (parsed.stats.lastSessionDate !== this.getTodayDate()) {
                parsed.stats.todaySessions = 0;
                parsed.stats.todayMinutes = 0;
                parsed.stats.lastSessionDate = this.getTodayDate();
                this.saveData(parsed);
            }

            return parsed;
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            return this.getDefaultData();
        }
    },

    // Save all data to localStorage
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            return false;
        }
    },

    // Get statistics
    getStats() {
        const data = this.loadData();
        return data.stats;
    },

    // Update statistics after a completed session
    updateStats(minutes) {
        const data = this.loadData();
        data.stats.totalSessions += 1;
        data.stats.totalMinutes += minutes;
        data.stats.todaySessions += 1;
        data.stats.todayMinutes += minutes;
        data.stats.lastSessionDate = this.getTodayDate();
        this.saveData(data);
        return data.stats;
    },

    // Get user settings
    getSettings() {
        const data = this.loadData();
        return data.settings;
    },

    // Save user settings
    saveSettings(settings) {
        const data = this.loadData();
        data.settings = {
            workDuration: parseInt(settings.workDuration) || 25,
            breakDuration: parseInt(settings.breakDuration) || 5
        };
        this.saveData(data);
        return data.settings;
    },

    // Reset all data (optional utility function)
    resetAll() {
        const defaultData = this.getDefaultData();
        this.saveData(defaultData);
        return defaultData;
    },

    // Garden functionality

    // Get all flowers in the garden
    getGarden() {
        const data = this.loadData();
        return data.garden || [];
    },

    // Save a completed flower to the garden
    saveCompletedFlower(flowerType, duration) {
        const data = this.loadData();
        if (!data.garden) {
            data.garden = [];
        }

        const flower = {
            id: this.generateId(),
            type: flowerType,
            completedAt: new Date().toISOString(),
            duration: duration
        };

        data.garden.push(flower);
        this.saveData(data);
        return flower;
    },

    // Get a random flower type
    getRandomFlowerType() {
        const types = ['rose', 'sunflower', 'tulip', 'daisy', 'lavender', 'lotus', 'cherry', 'poppy'];
        const randomIndex = Math.floor(Math.random() * types.length);
        return types[randomIndex];
    },

    // Generate a simple unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
