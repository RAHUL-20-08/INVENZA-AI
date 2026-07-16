const fs = require('fs');

let code = fs.readFileSync('backend/users.json', 'utf8');

// The lines with `>>>>>>>`
code = code.replace(/>>>>>>> 3070b5eb2159d7a7a667b877cd7c4855bd050071\r?\n/g, '');

// The block with `<<<<<<< HEAD`
code = code.replace(/<<<<<<< HEAD\r?\n[\s\S]*?=======\r?\n/g, '');

fs.writeFileSync('backend/users.json', code);
console.log('Fixed syntax markers.');

try {
    const data = JSON.parse(code);
    console.log('Parsed successfully! Total users:', data.length);
} catch (e) {
    console.error('Still fails parsing:', e.message);
}
