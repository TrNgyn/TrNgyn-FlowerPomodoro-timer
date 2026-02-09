// Flower visualization with multiple types and SVG growth stages

const Flower = {
    svg: null,
    currentStage: 0,
    currentProgress: 0,
    currentFlowerType: 'rose',

    // Growth stage thresholds (same for all flower types)
    stages: [
        { threshold: 0, class: 'stage-0' },    // Seed
        { threshold: 15, class: 'stage-1' },   // Sprout
        { threshold: 30, class: 'stage-2' },   // Small stem with leaves
        { threshold: 50, class: 'stage-3' },   // Taller stem
        { threshold: 65, class: 'stage-4' },   // Bud appears
        { threshold: 80, class: 'stage-5' },   // Bud opening
        { threshold: 100, class: 'stage-6' }   // Full bloom
    ],

    // Available flower types
    availableTypes: ['rose', 'sunflower', 'tulip', 'daisy', 'lavender', 'lotus', 'cherry', 'poppy'],

    init(flowerType = 'rose') {
        this.svg = document.getElementById('flowerSvg');
        this.currentFlowerType = flowerType;
        this.render();
        this.updateGrowth(0);
    },

    render() {
        // Clear existing content
        this.svg.innerHTML = '';

        // Add soil/ground (common to all flowers)
        const soil = this.createSVGElement('rect', {
            x: '0',
            y: '270',
            width: '200',
            height: '30',
            fill: '#8B7355',
            rx: '5'
        });
        this.svg.appendChild(soil);

        // Render the specific flower type
        this.renderFlower(this.currentFlowerType);
    },

    renderFlower(type) {
        const renderMethod = this.flowerTypes[type];
        if (renderMethod) {
            renderMethod.call(this);
        } else {
            console.error(`Unknown flower type: ${type}`);
            this.flowerTypes.rose.call(this);
        }
    },

    // Flower type renderers
    flowerTypes: {
        rose() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            const seedCircle = this.createSVGElement('ellipse', {
                cx: '100', cy: '265', rx: '8', ry: '10', fill: '#D4A574'
            });
            seed.appendChild(seedCircle);
            this.svg.appendChild(seed);

            // Stem
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            const stemPath = this.createSVGElement('path', {
                d: 'M 100 260 Q 105 200, 100 140 Q 95 80, 100 60',
                stroke: '#228B22', 'stroke-width': '6', fill: 'none', 'stroke-linecap': 'round'
            });
            stem.appendChild(stemPath);
            this.svg.appendChild(stem);

            // Leaves
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            const leftLeaf = this.createSVGElement('path', {
                d: 'M 100 180 Q 70 175, 60 185 Q 70 195, 100 190',
                fill: '#32CD32', stroke: '#228B22', 'stroke-width': '1'
            });
            const rightLeaf = this.createSVGElement('path', {
                d: 'M 100 150 Q 130 145, 140 155 Q 130 165, 100 160',
                fill: '#32CD32', stroke: '#228B22', 'stroke-width': '1'
            });
            leaves.appendChild(leftLeaf);
            leaves.appendChild(rightLeaf);
            this.svg.appendChild(leaves);

            // Bud
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            const budShape = this.createSVGElement('ellipse', {
                cx: '100', cy: '55', rx: '15', ry: '20', fill: '#FF69B4', stroke: '#FF1493', 'stroke-width': '2'
            });
            bud.appendChild(budShape);
            this.svg.appendChild(bud);

            // Petals (full bloom)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            const petalColors = ['#FF69B4', '#FF1493', '#FF69B4', '#FF1493', '#FF69B4', '#FF1493', '#FF69B4', '#FF1493'];
            for (let i = 0; i < 8; i++) {
                const angle = (i * 360 / 8) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 20;
                const petalY = 50 + Math.sin(angle) * 20;
                const petal = this.createSVGElement('ellipse', {
                    cx: petalX, cy: petalY, rx: '12', ry: '18',
                    fill: petalColors[i], stroke: '#FF1493', 'stroke-width': '1',
                    transform: `rotate(${i * 45}, ${petalX}, ${petalY})`
                });
                petals.appendChild(petal);
            }
            const center = this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '15', fill: '#FFD700', stroke: '#FFA500', 'stroke-width': '2'
            });
            petals.appendChild(center);
            this.svg.appendChild(petals);
        },

        sunflower() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('ellipse', { cx: '100', cy: '265', rx: '8', ry: '10', fill: '#8B7355' }));
            this.svg.appendChild(seed);

            // Stem (thicker for sunflower)
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 L 100 60', stroke: '#5D8C3E', 'stroke-width': '8', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(stem);

            // Leaves
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '70', cy: '180', rx: '25', ry: '15', fill: '#6B8E23', transform: 'rotate(-30, 70, 180)'
            }));
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '130', cy: '140', rx: '25', ry: '15', fill: '#6B8E23', transform: 'rotate(30, 130, 140)'
            }));
            this.svg.appendChild(leaves);

            // Bud
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('circle', { cx: '100', cy: '50', r: '20', fill: '#DAA520' }));
            this.svg.appendChild(bud);

            // Petals (many thin yellow petals)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            for (let i = 0; i < 16; i++) {
                const angle = (i * 360 / 16) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 28;
                const petalY = 50 + Math.sin(angle) * 28;
                petals.appendChild(this.createSVGElement('ellipse', {
                    cx: petalX, cy: petalY, rx: '8', ry: '20',
                    fill: '#FFD700', stroke: '#FFA500', 'stroke-width': '1',
                    transform: `rotate(${i * 22.5}, ${petalX}, ${petalY})`
                }));
            }
            // Dark center
            petals.appendChild(this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '18', fill: '#8B4513', stroke: '#654321', 'stroke-width': '2'
            }));
            // Center pattern
            for (let i = 0; i < 20; i++) {
                const angle = (i * 18) * (Math.PI / 180);
                petals.appendChild(this.createSVGElement('circle', {
                    cx: 100 + Math.cos(angle) * 10, cy: 50 + Math.sin(angle) * 10, r: '1.5', fill: '#654321'
                }));
            }
            this.svg.appendChild(petals);
        },

        tulip() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('ellipse', { cx: '100', cy: '265', rx: '7', ry: '9', fill: '#CD853F' }));
            this.svg.appendChild(seed);

            // Stem
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 Q 98 180, 100 100 Q 102 70, 100 60',
                stroke: '#2E7D32', 'stroke-width': '5', fill: 'none', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(stem);

            // Leaves (long for tulip)
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('path', {
                d: 'M 100 200 Q 60 180, 50 220', stroke: '#388E3C', 'stroke-width': '8',
                fill: 'none', 'stroke-linecap': 'round'
            }));
            leaves.appendChild(this.createSVGElement('path', {
                d: 'M 100 170 Q 140 150, 150 190', stroke: '#388E3C', 'stroke-width': '8',
                fill: 'none', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(leaves);

            // Bud (cup-shaped)
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('ellipse', {
                cx: '100', cy: '50', rx: '18', ry: '25', fill: '#DC143C', stroke: '#8B0000', 'stroke-width': '2'
            }));
            this.svg.appendChild(bud);

            // Petals (6 cup-shaped petals)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 18;
                const petalY = 50 + Math.sin(angle) * 18;
                petals.appendChild(this.createSVGElement('ellipse', {
                    cx: petalX, cy: petalY, rx: '14', ry: '22',
                    fill: '#FF0000', stroke: '#8B0000', 'stroke-width': '1',
                    transform: `rotate(${i * 60}, ${petalX}, ${petalY})`
                }));
            }
            // Center
            petals.appendChild(this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '8', fill: '#000000'
            }));
            this.svg.appendChild(petals);
        },

        daisy() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('ellipse', { cx: '100', cy: '265', rx: '6', ry: '8', fill: '#BDB76B' }));
            this.svg.appendChild(seed);

            // Stem (thin)
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 Q 95 150, 100 60', stroke: '#228B22', 'stroke-width': '4', fill: 'none'
            }));
            this.svg.appendChild(stem);

            // Leaves
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '75', cy: '190', rx: '15', ry: '8', fill: '#3CB371', transform: 'rotate(-20, 75, 190)'
            }));
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '125', cy: '160', rx: '15', ry: '8', fill: '#3CB371', transform: 'rotate(20, 125, 160)'
            }));
            this.svg.appendChild(leaves);

            // Bud
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('circle', { cx: '100', cy: '50', r: '15', fill: '#FFFACD' }));
            this.svg.appendChild(bud);

            // Petals (simple white petals)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            for (let i = 0; i < 12; i++) {
                const angle = (i * 30) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 22;
                const petalY = 50 + Math.sin(angle) * 22;
                petals.appendChild(this.createSVGElement('ellipse', {
                    cx: petalX, cy: petalY, rx: '6', ry: '14',
                    fill: '#FFFFFF', stroke: '#F0F0F0', 'stroke-width': '1',
                    transform: `rotate(${i * 30}, ${petalX}, ${petalY})`
                }));
            }
            // Yellow center
            petals.appendChild(this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '12', fill: '#FFD700', stroke: '#FFA500', 'stroke-width': '2'
            }));
            this.svg.appendChild(petals);
        },

        lavender() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('ellipse', { cx: '100', cy: '265', rx: '6', ry: '8', fill: '#8B7D6B' }));
            this.svg.appendChild(seed);

            // Stem
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 L 100 80', stroke: '#556B2F', 'stroke-width': '4', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(stem);

            // Leaves (thin at base)
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('path', {
                d: 'M 100 220 L 80 235', stroke: '#6B8E23', 'stroke-width': '3', 'stroke-linecap': 'round'
            }));
            leaves.appendChild(this.createSVGElement('path', {
                d: 'M 100 210 L 120 225', stroke: '#6B8E23', 'stroke-width': '3', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(leaves);

            // Bud (spike-shaped)
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('ellipse', {
                cx: '100', cy: '60', rx: '10', ry: '25', fill: '#9370DB', stroke: '#8B008B', 'stroke-width': '1'
            }));
            this.svg.appendChild(bud);

            // Petals (clustered flowers on spike)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            for (let y = 35; y <= 75; y += 8) {
                for (let x = -8; x <= 8; x += 8) {
                    petals.appendChild(this.createSVGElement('circle', {
                        cx: 100 + x, cy: y, r: '3', fill: '#9370DB', stroke: '#8B008B', 'stroke-width': '0.5'
                    }));
                }
            }
            this.svg.appendChild(petals);
        },

        lotus() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('circle', { cx: '100', cy: '265', r: '8', fill: '#D2B48C' }));
            this.svg.appendChild(seed);

            // Stem (underwater style)
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 Q 90 180, 100 100 Q 110 70, 100 60',
                stroke: '#2E8B57', 'stroke-width': '6', fill: 'none', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(stem);

            // Leaves (lily pads)
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '70', cy: '200', rx: '30', ry: '20', fill: '#3CB371', opacity: '0.8'
            }));
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '130', cy: '180', rx: '28', ry: '18', fill: '#2E8B57', opacity: '0.8'
            }));
            this.svg.appendChild(leaves);

            // Bud
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('ellipse', {
                cx: '100', cy: '55', rx: '16', ry: '22', fill: '#FFB6C1', stroke: '#FF69B4', 'stroke-width': '2'
            }));
            this.svg.appendChild(bud);

            // Petals (layered lotus petals)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            // Outer layer
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 25;
                const petalY = 50 + Math.sin(angle) * 25;
                petals.appendChild(this.createSVGElement('ellipse', {
                    cx: petalX, cy: petalY, rx: '12', ry: '20',
                    fill: '#FFC0CB', stroke: '#FFB6C1', 'stroke-width': '1',
                    transform: `rotate(${i * 45}, ${petalX}, ${petalY})`
                }));
            }
            // Inner layer
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60 + 30) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 15;
                const petalY = 50 + Math.sin(angle) * 15;
                petals.appendChild(this.createSVGElement('ellipse', {
                    cx: petalX, cy: petalY, rx: '10', ry: '16',
                    fill: '#FFE4E1', stroke: '#FFC0CB', 'stroke-width': '1',
                    transform: `rotate(${i * 60 + 30}, ${petalX}, ${petalY})`
                }));
            }
            // Center
            petals.appendChild(this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '10', fill: '#FFD700', stroke: '#FFA500', 'stroke-width': '2'
            }));
            this.svg.appendChild(petals);
        },

        cherry() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('ellipse', { cx: '100', cy: '265', rx: '5', ry: '7', fill: '#A0826D' }));
            this.svg.appendChild(seed);

            // Stem (branch-like)
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 Q 110 180, 100 100 Q 95 70, 100 60',
                stroke: '#8B4513', 'stroke-width': '5', fill: 'none', 'stroke-linecap': 'round'
            }));
            this.svg.appendChild(stem);

            // Leaves (small)
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '85', cy: '180', rx: '12', ry: '6', fill: '#90EE90', transform: 'rotate(-15, 85, 180)'
            }));
            leaves.appendChild(this.createSVGElement('ellipse', {
                cx: '115', cy: '150', rx: '12', ry: '6', fill: '#90EE90', transform: 'rotate(15, 115, 150)'
            }));
            this.svg.appendChild(leaves);

            // Bud
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('circle', { cx: '100', cy: '50', r: '12', fill: '#FFB6C1' }));
            this.svg.appendChild(bud);

            // Petals (5 delicate petals)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            for (let i = 0; i < 5; i++) {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 18;
                const petalY = 50 + Math.sin(angle) * 18;
                // Notched petal (two circles)
                petals.appendChild(this.createSVGElement('circle', {
                    cx: petalX - 3, cy: petalY, r: '10',
                    fill: '#FFE4E1', stroke: '#FFB6C1', 'stroke-width': '1'
                }));
                petals.appendChild(this.createSVGElement('circle', {
                    cx: petalX + 3, cy: petalY, r: '10',
                    fill: '#FFE4E1', stroke: '#FFB6C1', 'stroke-width': '1'
                }));
            }
            // Small center
            petals.appendChild(this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '6', fill: '#FFB6C1', stroke: '#FF69B4', 'stroke-width': '1'
            }));
            this.svg.appendChild(petals);
        },

        poppy() {
            // Seed
            const seed = this.createSVGElement('g', { class: 'flower-part seed' });
            seed.appendChild(this.createSVGElement('ellipse', { cx: '100', cy: '265', rx: '7', ry: '9', fill: '#8B7355' }));
            this.svg.appendChild(seed);

            // Stem (hairy/fuzzy appearance)
            const stem = this.createSVGElement('g', { class: 'flower-part stem' });
            stem.appendChild(this.createSVGElement('path', {
                d: 'M 100 260 Q 105 160, 100 60', stroke: '#556B2F', 'stroke-width': '5', fill: 'none'
            }));
            // Add "hairs" to stem
            for (let i = 0; i < 5; i++) {
                const y = 260 - i * 40;
                stem.appendChild(this.createSVGElement('line', {
                    x1: '100', y1: y, x2: '95', y2: y - 8, stroke: '#556B2F', 'stroke-width': '1'
                }));
            }
            this.svg.appendChild(stem);

            // Leaves (feathery)
            const leaves = this.createSVGElement('g', { class: 'flower-part leaves' });
            leaves.appendChild(this.createSVGElement('path', {
                d: 'M 100 200 Q 70 200, 60 210 Q 70 215, 100 210',
                fill: '#6B8E23', stroke: '#556B2F', 'stroke-width': '1'
            }));
            leaves.appendChild(this.createSVGElement('path', {
                d: 'M 100 170 Q 130 170, 140 180 Q 130 185, 100 180',
                fill: '#6B8E23', stroke: '#556B2F', 'stroke-width': '1'
            }));
            this.svg.appendChild(leaves);

            // Bud (egg-shaped)
            const bud = this.createSVGElement('g', { class: 'flower-part bud' });
            bud.appendChild(this.createSVGElement('ellipse', {
                cx: '100', cy: '55', rx: '14', ry: '20', fill: '#FF4500', stroke: '#8B0000', 'stroke-width': '2'
            }));
            this.svg.appendChild(bud);

            // Petals (4 large ruffled petals)
            const petals = this.createSVGElement('g', { class: 'flower-part petals' });
            for (let i = 0; i < 4; i++) {
                const angle = (i * 90) * (Math.PI / 180);
                const petalX = 100 + Math.cos(angle) * 22;
                const petalY = 50 + Math.sin(angle) * 22;
                // Ruffled effect with path
                const ruffledPath = `M ${petalX} ${petalY} Q ${petalX + 12} ${petalY - 10}, ${petalX + 8} ${petalY + 15} Q ${petalX} ${petalY + 10}, ${petalX - 8} ${petalY + 15} Q ${petalX - 12} ${petalY - 10}, ${petalX} ${petalY}`;
                petals.appendChild(this.createSVGElement('path', {
                    d: ruffledPath, fill: '#FF6347', stroke: '#FF4500', 'stroke-width': '1',
                    transform: `rotate(${i * 90}, ${petalX}, ${petalY})`
                }));
            }
            // Black center with detail
            const centerGroup = this.createSVGElement('g', {});
            centerGroup.appendChild(this.createSVGElement('circle', {
                cx: '100', cy: '50', r: '14', fill: '#000000'
            }));
            // Center pattern
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45) * (Math.PI / 180);
                centerGroup.appendChild(this.createSVGElement('line', {
                    x1: '100', y1: '50',
                    x2: 100 + Math.cos(angle) * 12, y2: 50 + Math.sin(angle) * 12,
                    stroke: '#2F4F2F', 'stroke-width': '1'
                }));
            }
            petals.appendChild(centerGroup);
            this.svg.appendChild(petals);
        }
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
            this.svg.classList.remove(this.stages[this.currentStage].class);
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
