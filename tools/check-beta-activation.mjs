// Allow the newly deployed Worker to reach the beta custom domain.
let lastError;
for(let attempt=0;attempt<10;attempt++) {
 try {
  const response=await fetch('https://beta.chapalaseminary.org/api/health',{signal:AbortSignal.timeout(5000)});
  if(!response.ok) {
   const ray=response.headers.get('cf-ray') || '';
   const requestId=/^[a-f0-9]+-[a-z]{3}$/i.test(ray)?`; Cloudflare request ${ray}`:'';
   const challenge=response.headers.get('cf-mitigated')==='challenge'?'; Cloudflare challenge':'';
   throw new Error(`beta health check returned HTTP ${response.status}${challenge}${requestId}`);
  }
  const state=await response.json(), dates=Object.values(state.requiredFrom||{});
  if(dates.length!==79 || new Set(dates).size!==1 || dates.some(date=>Number.isNaN(Date.parse(date))))throw new Error('the 79 beta master test requirements were not activated');
  console.log(`Beta: 79 master test requirements active since ${dates[0]}; production activation remains separate.`);
  process.exit(0);
 }catch(error){lastError=error;console.warn(`Beta health attempt ${attempt+1}/10: ${error.message}`);}
 if(attempt<9)await new Promise(resolve=>setTimeout(resolve,3000));
}
throw lastError;
