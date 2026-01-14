
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    const buffer = fs.readFileSync(envPath);
    console.log('Original Buffer Size:', buffer.length);

    // Convert to string and strip characters outside of normal ASCII range and whitespace
    let content = buffer.toString('utf8');

    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.substring(1);
    }

    // Remove null bytes and other common garble
    content = content.replace(/\0/g, '');

    // Attempt to fix broken lines (if a key is split by newlines/spaces)
    // Basic idea: Join lines that don't start with a key name but follow one
    let lines = content.split(/\r?\n/);
    let cleanedLines = [];
    let currentLine = "";

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.includes('=') && (line.startsWith('NEXT_PUBLIC_') || line.startsWith('SUPABASE_'))) {
            if (currentLine) cleanedLines.push(currentLine);
            currentLine = line;
        } else {
            // Append to current line if it seems like a continuation
            currentLine += line;
        }
    }
    if (currentLine) cleanedLines.push(currentLine);

    console.log('Cleaned Content:');
    cleanedLines.forEach(l => console.log(l.substring(0, 50) + '...'));

    // Write back cleaned file
    fs.writeFileSync(envPath, cleanedLines.join('\n'), 'utf8');
    console.log('Successfully cleaned .env.local');
} catch (err) {
    console.error('Error cleaning file:', err);
}
