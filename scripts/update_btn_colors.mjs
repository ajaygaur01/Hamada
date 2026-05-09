import fs from 'fs';
import path from 'path';

const directory = 'src';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const colorRegexes = [
    { regex: /bg-\[\#4C632E\]/g, replacement: 'bg-[#D04636]' },
    { regex: /hover:bg-\[\#3E4F25\]/g, replacement: 'hover:bg-[#B83C2D]' },
    { regex: /bg-brand-green/g, replacement: 'bg-[#D04636]' },
    { regex: /hover:bg-\[\#3f5226\]/g, replacement: 'hover:bg-[#B83C2D]' },
    { regex: /bg-zinc-900/g, replacement: 'bg-[#D04636]' },
    { regex: /hover:bg-zinc-800/g, replacement: 'hover:bg-[#B83C2D]' },
    { regex: /bg-amber-500/g, replacement: 'bg-[#D04636]' },
    { regex: /hover:bg-amber-600/g, replacement: 'hover:bg-[#B83C2D]' },
    { regex: /bg-zinc-100/g, replacement: 'bg-white border border-[#D04636] text-[#D04636]' },
    { regex: /hover:bg-zinc-200/g, replacement: 'hover:bg-[#fdebea]' },
    { regex: /text-brand-green/g, replacement: 'text-[#D04636]' }
];

function processContent(content) {
    // We match tags that look like buttons or Links, spanning multiple lines up to the >
    const tagRegex = /<(button|Link)[\s\S]*?>/g;
    
    return content.replace(tagRegex, (match) => {
        // Only modify if it has a className
        if (!match.includes('className=')) return match;
        
        let newMatch = match;
        
        // We only want to replace colors if it has a background color to begin with
        if (newMatch.includes('bg-')) {
             colorRegexes.forEach(r => {
                 newMatch = newMatch.replace(r.regex, r.replacement);
             });
             // Fix text colors for new red backgrounds
             if (newMatch.includes('bg-[#D04636]')) {
                 newMatch = newMatch.replace(/text-zinc-[0-9]+/g, 'text-white');
                 newMatch = newMatch.replace(/text-black/g, 'text-white');
                 newMatch = newMatch.replace(/text-zinc-700/g, 'text-white');
                 if (!newMatch.includes('text-white') && !newMatch.includes('text-[#E7DDC1]')) {
                     newMatch = newMatch.replace(/className=(["'`])/, 'className=$1text-white ');
                 }
             }
        } else if (newMatch.includes('border') && !newMatch.includes('bg-')) {
            // Outline buttons
            newMatch = newMatch.replace(/text-zinc-[0-9]+/g, 'text-[#D04636]');
            newMatch = newMatch.replace(/border-zinc-[0-9]+/g, 'border-[#D04636]');
            newMatch = newMatch.replace(/hover:bg-zinc-[0-9]+/g, 'hover:bg-[#D04636] hover:text-white');
        }
        
        return newMatch;
    });
}

walk(directory, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = processContent(content);
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
