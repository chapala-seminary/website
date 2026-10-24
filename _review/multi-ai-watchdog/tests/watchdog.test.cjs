const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname,'..','Code.gs'),'utf8');
const context = {module:{exports:{}}, Date, Number, String, Math, RegExp, Error, JSON, isFinite, parseInt};
vm.runInNewContext(source,context);
const f=context.module.exports;
const packet=fs.readFileSync(path.join(__dirname,'..','fixtures','Systematic_Theology_13Unit.txt'),'utf8');
for(let n=1;n<=13;n++){
  const unit=f.ctsExtractUnit_(packet,n);
  assert.ok(unit.length>1500,`unit ${n} too short`);
  assert.ok(!unit.includes(`==================== UNIT ${n+1}`),'unit splitter leaked next unit');
}
assert.equal(f.ctsClassifyReply_('Review complete [[CTS_DONE]]',1,4),'DONE');
assert.equal(f.ctsClassifyReply_('Need approval [[CTS_NEEDS_APPROVAL]]',1,4),'WAITING_APPROVAL');
assert.equal(f.ctsClassifyReply_('Missing evidence [[CTS_BLOCKED]]',1,4),'BLOCKED');
assert.equal(f.ctsClassifyReply_('Halfway, checkpoint',1,4),'CONTINUE');
assert.equal(f.ctsClassifyReply_('Halfway, checkpoint',4,4),'REVIEW_REQUIRED');
assert.ok(f.ctsSameReply_(' Same  content','Same content '));
assert.ok(!f.ctsSameReply_('First section','Second section'));
const p=f.ctsBuildPrompt_('Review','Specific accuracy',f.ctsExtractUnit_(packet,1),'Already checked scripture intro');
assert.ok(p.includes('Continue exactly where you left off'));
assert.ok(p.includes('Already checked scripture intro'));
assert.ok(!p.includes('=== STUDENT-FACING UNIT CONTENT ===\n==================== UNIT 2'));
assert.throws(()=>f.ctsExtractUnit_(packet,99));
console.log('PASS: 13 unit extractions, 5 terminal/continue cases, continuation checkpoint, invalid unit');
