// Garden page logic - displays all completed flowers

document.addEventListener('DOMContentLoaded', () => {
    loadGarden();
});

function loadGarden() {
    const flowers = Storage.getGarden();
    const emptyState = document.getElementById('emptyState');
    const gardenGrid = document.getElementById('gardenGrid');
    const gardenStats = document.getElementById('gardenStats');

    if (flowers.length === 0) {
        // Show empty state
        emptyState.classList.remove('hidden');
        gardenGrid.classList.add('hidden');
        gardenStats.classList.add('hidden');
    } else {
        // Show garden grid
        emptyState.classList.add('hidden');
        gardenGrid.classList.remove('hidden');
        gardenStats.classList.remove('hidden');

        // Render all flowers
        gardenGrid.innerHTML = '';
        flowers.forEach(flower => {
            const flowerCard = renderFlowerCard(flower);
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
    return card;
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
