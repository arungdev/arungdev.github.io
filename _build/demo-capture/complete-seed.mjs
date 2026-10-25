const base = 'http://127.0.0.1:5097';
const login = await fetch(`${base}/api/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:'demo',password:'Password123!'})});
if(!login.ok) throw new Error('Demo login failed');
const headers = {'Content-Type':'application/json', Cookie:login.headers.get('set-cookie').split(';')[0]};
const goals = [
  {name:'Demo emergency reserve',targetAmount:300000,currentSaved:210000,category:'Savings',notes:'Fictional demo goal'},
  {name:'Sample laptop fund',targetAmount:120000,currentSaved:65000,category:'Electronics',notes:'Fictional demo goal'},
  {name:'Sample holiday',targetAmount:60000,currentSaved:35000,category:'Travel',notes:'Fictional demo goal'},
];
const existing = await (await fetch(`${base}/api/goals`,{headers})).json();
for(const goal of goals) {
  if(existing.some(g=>g.name===goal.name)) continue;
  const res=await fetch(`${base}/api/goals`,{method:'POST',headers,body:JSON.stringify(goal)});
  if(!res.ok) throw new Error(await res.text());
  console.log(`Created ${goal.name}`);
}
for(const dep of [
  {kind:'FD',matchKey:'IB FD CREATION - 987654321',nickname:'Demo term deposit',interestRate:7.1,termMonths:12,maturityDate:'2027-08-15',note:'Fictional demo investment'},
  {kind:'RD',matchKey:'12345- RD INSTALLMENT',nickname:'Demo recurring deposit',interestRate:6.8,termMonths:24,maturityDate:'2028-07-18',note:'Fictional demo investment'},
]) {
  const res=await fetch(`${base}/api/deposits`,{method:'PUT',headers,body:JSON.stringify(dep)});
  if(!res.ok) throw new Error(await res.text());
  console.log(`Saved ${dep.nickname}`);
}
