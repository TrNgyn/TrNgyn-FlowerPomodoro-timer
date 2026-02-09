// Flower visualization with SVG and growth stages

const Flower = {
    svg: null,
    currentStage: 0,
    currentProgress: 0,

    // Growth stage thresholds
    stages: [
        { threshold: 0, class: 'stage-0' },    // Seed
        { threshold: 15, class: 'stage-1' },   // Sprout
        { threshold: 30, class: 'stage-2' },   // Small stem with leaves
        { threshold: 50, class: 'stage-3' },   // Taller stem
        { threshold: 65, class: 'stage-4' },   // Bud appears
        { threshold: 80, class: 'stage-5' },   // Bud opening
        { threshold: 100, class: 'stage-6' }   // Full bloom
    ],

    init() {
        this.svg = document.getElementById('flowerSvg');
        this.render();
        this.updateGrowth(0);
    },

    render() {
        // Clear existing content
        this.svg.innerHTML = '';

        // Create soil/ground
        const soil = this.createSVGElement('rect', {
            x: '0',
            y: '270',
            width: '200',
            height: '30',
            fill: '#8B7355',
            rx: '5'
        });
        this.svg.appendChild(soil);

        // Seed (always visible at start)
        const seed = this.createSVGElement('g', { class: 'flower-part seed' });
        const seedCircle = this.createSVGElement('ellipse', {
            cx: '100',
            cy: '265',
            rx: '8',
            ry: '10',
            fill: '#D4A574'
        });
        seed.appendChild(seedCircle);
        this.svg.appendChild(seed);

        // Stem
        const stem = this.createSVGElement('g', { class: 'flower-part stem' });
        const stemPath = this.createSVGElement('path', {
            d: 'M 100 260 Q 105 200, 100 140 Q 95 80, 100 60',
            stroke: '#228B22',
            'stroke-width': '6',
            fill: 'none',
            'stroke-linecap': 'round'
        });
        stem.appendChild(stemPath);
        this.svg.appendChild(stem);

        // Leaves
        const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });

        // Left leaf
        const leftLeaf = this.createSVGElement('path', {
            d: 'M 100 180 Q 70 175, 60 185 Q 70 195, 100 190',
            fill: '#32CD32',
            stroke: '#228B22',
            'stroke-width': '1'
        });
        leaves.appendChild(leftLeaf);

        // Right leaf
        const rightLeaf = this.createSVGElement('path', {
            d: 'M 100 150 Q 130 145, 140 155 Q 130 165, 100 160',
            fill: '#32CD32',
            stroke: '#228B22',
            'stroke-width': '1'
        });
        leaves.appendChild(rightLeaf);

        this.svg.appendChild(leaves);

        // Bud (closed flower)
        const bud = this.createSVGElement('g', { class: 'flower-part bud' });
        const budShape = this.createSVGElement('ellipse', {
            cx: '100',
            cy: '55',
            rx: '15',
            ry: '20',
            fill: '#FF69B4',
            stroke: '#FF1493',
            'stroke-width': '2'
        });
        bud.appendChild(budShape);

        // Bud details
        const budDetail1 = this.createSVGElement('path', {
            d: 'M 100 40 Q 95 50, 100 60',
            stroke: '#FF1493',
            'stroke-width': '1',
            fill: 'none'
        });
        const budDetail2 = this.createSVGElement('path', {
            d: 'M 100 40 Q 105 50, 100 60',
            stroke: '#FF1493',
            'stroke-width': '1',
            fill: 'none'
        });
        bud.appendChild(budDetail1);
        bud.appendChild(budDetail2);

        this.svg.appendChild(bud);

        // Petals (full bloom)
        const petals = this.createSVGElement('g', { class: 'flower-part petals' });

        // Create 8 petals in a circle
        const petalColors = ['#FF69B4', '#FF1493', '#FF69B4', '#FF1493', '#FF69B4', '#FF1493', '#FF69B4', '#FF1493'];
        const centerX = 100;
        const centerY = 50;
        const petalCount = 8;

        for (let i = 0; i < petalCount; i++) {
            const angle = (i * 360 / petalCount) * (Math.PI / 180);
            const petalX = centerX + Math.cos(angle) * 20;
            const petalY = centerY + Math.sin(angle) * 20;

            const petal = this.createSVGElement('ellipse', {
                cx: petalX,
                cy: petalY,
                rx: '12',
                ry: '18',
                fill: petalColors[i],
                stroke: '#FF1493',
                'stroke-width': '1',
                transform: `rotate(${i * 45}, ${petalX}, ${petalY})`
            });

            petals.appendChild(petal);
        }

        // Flower center
        const center = this.createSVGElement('circle', {
            cx: centerX,
            cy: centerY,
            r: '15',
            fill: '#FFD700',
            stroke: '#FFA500',
            'stroke-width': '2'
        });
        petals.appendChild(center);

        // Center details (stamens)
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * (Math.PI / 180);
            const stamenX = centerX + Math.cos(angle) * 8;
            const stamenY = centerY + Math.sin(angle) * 8;

            const stamen = this.createSVGElement('circle', {
                cx: stamenX,
                cy: stamenY,
                r: '1.5',
                fill: '#FF8C00'
            });
            petals.appendChild(stamen);
        }

        this.svg.appendChild(petals);
    },

    createSVGElement(tag, attrs) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [key, value] of Object.entries(attrs)) {
            element.setAttribute(key, value);
        }
        return element;
    },

    updateGrowth(progress) {
        this.currentProgress = Math.min(100, Math.max(0, progress));

        // Determine which stage we're in
        let newStage = 0;
        for (let i = this.stages.length - 1; i >= 0; i--) {
            if (this.currentProgress >= this.stages[i].threshold) {
                newStage = i;
                break;
            }
        }

        // Update stage class if changed
        if (newStage !== this.currentStage) {
            // Remove old stage class
            this.svg.classList.remove(this.stages[this.currentStage].class);

            // Add new stage class
            this.svg.classList.add(this.stages[newStage].class);

            this.currentStage = newStage;
        }
    },

    reset() {
        this.updateGrowth(0);
    },

    // Get current stage name for debugging
    getCurrentStageName() {
        const stageNames = ['Seed', 'Sprout', 'Small Stem', 'Growing', 'Budding', 'Opening', 'Blooming'];
        return stageNames[this.currentStage];
    }
};
