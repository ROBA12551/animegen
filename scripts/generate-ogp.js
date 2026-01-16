/**
 * OGP Image Generator for AnimeGen
 * Creates social media preview images (1200x630 for Facebook/Twitter)
 * 
 * This generates og-image.png which should be placed in the public folder
 * You can use this to generate the image locally and commit it to the repository
 */

// Node.js version (requires node-canvas or similar)
// For browser version, use HTML5 Canvas

function generateOGPImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Overlay with pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(i * 60, 0, 2, 630);
        ctx.fillRect(0, i * 63, 1200, 2);
    }

    // Pink accent line
    ctx.fillStyle = '#ffc0d9';
    ctx.fillRect(0, 0, 1200, 3);
    ctx.fillRect(0, 627, 1200, 3);

    // Logo/Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AnimeGen', 600, 200);

    // Subtitle
    ctx.font = '40px "Urbanist", sans-serif';
    ctx.fillStyle = '#ffc0d9';
    ctx.fillText('AI Anime Image Generator', 600, 280);

    // Description
    ctx.font = '28px "Urbanist", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Create stunning anime art with artificial intelligence', 600, 360);
    ctx.fillText('Free + Premium • Multi-language • Professional Quality', 600, 420);

    // Features badges
    const features = ['1-4 Images', 'HD-8K Quality', '9 Languages'];
    const badgeY = 520;
    const badgeWidth = 300;
    const badgeHeight = 60;
    const totalWidth = features.length * badgeWidth;
    const startX = (1200 - totalWidth) / 2;

    features.forEach((feature, index) => {
        const x = startX + index * badgeWidth + 20;
        
        // Badge background
        ctx.fillStyle = 'rgba(255, 192, 217, 0.2)';
        ctx.fillRect(x, badgeY, 260, badgeHeight);
        ctx.strokeStyle = '#ffc0d9';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, badgeY, 260, badgeHeight);
        
        // Badge text
        ctx.fillStyle = '#ffc0d9';
        ctx.font = 'bold 20px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(feature, x + 130, badgeY + 30);
    });

    return canvas.toDataURL('image/png');
}

// For browser implementation
if (typeof window !== 'undefined') {
    window.generateOGPImage = generateOGPImage;
}

// Node.js version (for automatic generation during build)
if (typeof module !== 'undefined' && module.exports) {
    const { createCanvas } = require('canvas');

    function generateOGPImageNode() {
        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 630);

        // Overlay with pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 20; i++) {
            ctx.fillRect(i * 60, 0, 2, 630);
            ctx.fillRect(0, i * 63, 1200, 2);
        }

        // Pink accent line
        ctx.fillStyle = '#ffc0d9';
        ctx.fillRect(0, 0, 1200, 3);
        ctx.fillRect(0, 627, 1200, 3);

        // Logo/Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AnimeGen', 600, 200);

        // Subtitle
        ctx.font = '40px "Urbanist", sans-serif';
        ctx.fillStyle = '#ffc0d9';
        ctx.fillText('AI Anime Image Generator', 600, 280);

        // Description
        ctx.font = '28px "Urbanist", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('Create stunning anime art with artificial intelligence', 600, 360);
        ctx.fillText('Free + Premium • Multi-language • Professional Quality', 600, 420);

        // Features badges
        const features = ['1-4 Images', 'HD-8K Quality', '9 Languages'];
        const badgeY = 520;
        const badgeWidth = 300;
        const badgeHeight = 60;
        const totalWidth = features.length * badgeWidth;
        const startX = (1200 - totalWidth) / 2;

        features.forEach((feature, index) => {
            const x = startX + index * badgeWidth + 20;
            
            // Badge background
            ctx.fillStyle = 'rgba(255, 192, 217, 0.2)';
            ctx.fillRect(x, badgeY, 260, badgeHeight);
            ctx.strokeStyle = '#ffc0d9';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, badgeY, 260, badgeHeight);
            
            // Badge text
            ctx.fillStyle = '#ffc0d9';
            ctx.font = 'bold 20px "Space Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(feature, x + 130, badgeY + 30);
        });

        return canvas.toBuffer('image/png');
    }

    module.exports = { generateOGPImage, generateOGPImageNode };
}