// Garden page logic - displays all completed flowers

let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
    // Apply background color from settings
    const settings = Storage.getSettings();
    if (settings.backgroundColor) {
        document.body.style.background = settings.backgroundColor;
    }

    loadGarden();
    setupControls();
});

function setupControls() {
    document.getElementById('sortNewest')?.addEventListener('click', () => {
        currentSort = 'newest';
        updateSortButtons();
        loadGarden();
    });

    document.getElementById('sortOldest')?.addEventListener('click', () => {
        currentSort = 'oldest';
        updateSortButtons();
        loadGarden();
    });

    document.getElementById('clearAll')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire garden? This cannot be undone!')) {
            const data = Storage.loadData();
            data.garden = [];
            Storage.saveData(data);
            loadGarden();
        }
    });
}

function updateSortButtons() {
    document.querySelectorAll('.garden-controls button').forEach(btn => {
        btn.classList.remove('active');
    });

    if (currentSort === 'newest') {
        document.getElementById('sortNewest')?.classList.add('active');
    } else {
        document.getElementById('sortOldest')?.classList.add('active');
    }
}

function loadGarden() {
    let flowers = Storage.getGarden();
    const emptyState = document.getElementById('emptyState');
    const gardenGrid = document.getElementById('gardenGrid');
    const gardenStats = document.getElementById('gardenStats');

    if (flowers.length === 0) {
        // Show empty state
        emptyState.classList.remove('hidden');
        gardenGrid.classList.add('hidden');
        gardenStats.classList.add('hidden');
    } else {
        // Sort flowers based on current sort option
        if (currentSort === 'newest') {
            flowers.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        } else {
            flowers.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        }

        // Show garden grid
        emptyState.classList.add('hidden');
        gardenGrid.classList.remove('hidden');
        gardenStats.classList.remove('hidden');

        // Render all flowers with staggered animation
        gardenGrid.innerHTML = '';
        flowers.forEach((flower, index) => {
            const flowerCard = renderFlowerCard(flower);
            flowerCard.style.animationDelay = `${index * 0.05}s`;
            gardenGrid.appendChild(flowerCard);
        });

        // Update stats
        document.getElementById('flowerCount').textContent = flowers.length;
    }
}

function renderFlowerCard(flower) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'flower-card';
    card.dataset.flowerId = flower.id;

    // Create SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 300');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Add soil/ground
    const soil = createSVGElement('rect', {
        x: '0',
        y: '270',
        width: '200',
        height: '30',
        fill: '#8B7355',
        rx: '5'
    });
    svg.appendChild(soil);

    // Render the specific flower type (full bloom)
    renderFlowerType(svg, flower.type);

    // Add bloom stage class
    svg.classList.add('stage-6');

    card.appendChild(svg);

    // Add flower info (shown on hover)
    const info = document.createElement('div');
    info.className = 'flower-info';
    const flowerName = flower.type.charAt(0).toUpperCase() + flower.type.slice(1);
    const date = new Date(flower.completedAt);
    const dateStr = date.toLocaleDateString();
    info.textContent = `${flowerName} - ${dateStr}`;
    card.appendChild(info);

    // Add delete button (shown on hover)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = 'Delete flower';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteFlower(flower.id);
    };
    card.appendChild(deleteBtn);

    // Add click animation
    card.addEventListener('click', () => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'pulse 0.5s ease';
        }, 10);
    });

    return card;
}

function deleteFlower(flowerId) {
    if (confirm('Delete this flower from your garden?')) {
        // Remove from storage
        const data = Storage.loadData();
        data.garden = data.garden.filter(f => f.id !== flowerId);
        Storage.saveData(data);

        // Reload garden
        loadGarden();
    }
}

function renderFlowerType(svg, type) {
    // Reuse the flower rendering logic from Flower object
    const tempFlower = Object.create(Flower);
    tempFlower.svg = svg;
    tempFlower.currentFlowerType = type;

    // Call the appropriate flower renderer
    if (Flower.flowerTypes[type]) {
        Flower.flowerTypes[type].call(tempFlower);
    } else {
        console.error(`Unknown flower type: ${type}`);
        Flower.flowerTypes.rose.call(tempFlower);
    }
}

function createSVGElement(tag, attrs) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }
    return element;
}
