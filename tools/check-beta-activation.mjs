// Allow the newly deployed Worker to reach the beta custom domain.
let lastError;
for(let attempt=0;attempt<10;attempt++) {
 try {
  const response=await fetch('https://beta.chapalaseminary.org/api/health',{signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw new Error('beta health check failed after deployment');
  const state=await response.json(), dates=Object.values(state.requiredFrom||{});
  if(dates.length!==79 || new Set(dates).size!==1 || dates.some(date=>Number.isNaN(Date.parse(date))))throw new Error('the 79 beta master test requirements were not activated');
  console.log(`Beta: 79 master test requirements active since ${dates[0]}; production activation remains separate.`);
  process.exit(0);
 }catch(error){lastError=error;}
 if(attempt<9)await new Promise(resolve=>setTimeout(resolve,3000));
}
throw lastError;
