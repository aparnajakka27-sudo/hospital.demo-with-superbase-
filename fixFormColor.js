const fs = require('fs');
let content = fs.readFileSync('app/reception/page.tsx', 'utf8');

let parts = content.split('{isWalkInFormOpen && (');
let before = parts[0];
let after = parts[1];

let splitToken = '<div className="flex flex-col xl:flex-row gap-6 mb-12">';
let formBlock = after.split(splitToken)[0];
let rest = splitToken + after.split(splitToken).slice(1).join(splitToken);

// Apply replacements to formBlock
formBlock = formBlock.replace(/bg-\[\#0B1B36\]/g, 'bg-slate-100');
formBlock = formBlock.replace(/text-white border border-\[\#1a2c4e\]/g, 'text-slate-900 border border-slate-200');
formBlock = formBlock.replace(/bg-white\/10 p-3 rounded-xl border border-white\/10/g, 'bg-white p-3 rounded-xl border border-slate-200 shadow-sm');
formBlock = formBlock.replace(/text-gray-400 hover:text-white/g, 'text-slate-500 hover:text-slate-900');
formBlock = formBlock.replace(/text-gray-300/g, 'text-slate-700');
formBlock = formBlock.replace(/bg-\[\#061022\] border border-\[\#1a2c4e\]/g, 'bg-white border border-slate-300');
formBlock = formBlock.replace(/text-white/g, 'text-slate-900');
formBlock = formBlock.replace(/border-t border-\[\#1a2c4e\]/g, 'border-t border-slate-200');

content = before + '{isWalkInFormOpen && (' + formBlock + rest;

fs.writeFileSync('app/reception/page.tsx', content);
console.log('Fixed styles!');
