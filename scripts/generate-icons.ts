import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable-192.png', size: 192, maskable: true },
    { name: 'icon-maskable-512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-32.png', size: 32 },
    { name: 'favicon-16.png', size: 16 },
];

const svgPath = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Create maskable version with padding
function createMaskableSvg(originalSvg: string): string {
    // For maskable icons, we need to add padding (safe zone is 80% of the icon)
    // Wrap the original content in a group with a transform to scale down and center
    return originalSvg.replace(
        'viewBox="0 0 512 512"',
        'viewBox="-64 -64 640 640"'
    );
}

async function generateIcons() {
    console.log('Generating PWA icons...');

    const svgBuffer = fs.readFileSync(svgPath);

    for (const { name, size, maskable } of sizes) {
        const outputPath = path.join(outputDir, name);

        let sourceBuffer = svgBuffer;
        if (maskable) {
            const maskableSvg = createMaskableSvg(svgBuffer.toString());
            sourceBuffer = Buffer.from(maskableSvg);
        }

        await sharp(sourceBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);

        console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
