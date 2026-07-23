const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env.local';
const envFile = fs.readFileSync(envPath, 'utf8');
let url = '', key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
}

const supabase = createClient(url, key);

async function check() {
  const { data: d, error: e } = await supabase.from('departments').select('*').limit(5);
  console.log('departments table:', d ? d : e);
  
  const { data: d2, error: e2 } = await supabase.from('Departments').select('*').limit(5);
  console.log('Departments table:', d2 ? d2 : e2);

  const { data: d3, error: e3 } = await supabase.from('Doctors').select('*').limit(1);
  console.log('Doctors columns:', d3 && d3.length ? Object.keys(d3[0]) : (d3 || e3));
}
check();
