// GenAI-assisted checks for shared state and pagination boundaries.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readState,pageUrl,matrixCapacity,pageWindow,matrixWindow,PAGES} from '../js/navigation.js';
test('validated selection state survives a navigation URL round-trip',()=>{
  const state=readState('?year=2014&road=Pedal+cyclist&remoteness=Regional&age=40-64&sex=Female&trend=index&matrix=share');
  for(const page of PAGES){
    const url=pageUrl(page.id,state);
    const round=readState(url.slice(url.indexOf('?')));
    for(const field of ['year','road','remoteness','age','sex','trend','matrix'])assert.equal(round[field],state[field]);
  }
});
test('untrusted query values cannot become arbitrary categories or page routes',()=>{
  const state=readState('?year=9999&road=%3Cscript%3E&remoteness=bad&age=bad&sex=bad&trend=bad&matrix=bad&topic=bad&view=bad');
  assert.equal(state.year,2021);assert.equal(state.road,'All');assert.equal(state.topic,'source');assert.equal(state.view,'decade');
  assert.equal(state.remoteness,'All');assert.equal(state.age,'All');assert.equal(state.sex,'All');
  assert.ok(pageUrl('https://example.com',state).startsWith('index.html?'));
});
test('matrix pagination reaches every category once at narrow and wide widths',()=>{
  for(const width of [260,320,390,700,1000,1200]){
    const size=matrixCapacity(width),seen=[];
    const pages=pageWindow(12,size,0).pages;
    for(let page=0;page<pages;page++){const w=pageWindow(12,size,page);seen.push(...Array.from({length:w.end-w.start},(_,i)=>w.start+i));}
    assert.deepEqual(seen,Array.from({length:12},(_,i)=>i));
  }
});
test('pagination clamps after viewport changes and preserves the last records',()=>{
  const w=pageWindow(84,7,100);
  assert.equal(w.end,84);assert.equal(w.current,11);
  assert.equal(pageWindow(8,20,7).current,0);
  assert.equal(pageWindow(11,0,-1).size,1);
});
test('two-dimensional pagination exposes every matrix cell exactly once',()=>{
  for(const [width,height] of [[267,150],[300,330],[900,300],[1200,450]]){
    const initial=matrixWindow(width,height,8,0),seen=[];
    for(let page=0;page<initial.pages;page++){
      const w=matrixWindow(width,height,8,page);
      for(let row=w.rowStart;row<w.rowEnd;row++)for(let col=w.columnStart;col<w.columnEnd;col++)seen.push(`${row}-${col}`);
    }
    assert.equal(seen.length,96);assert.equal(new Set(seen).size,96);
  }
});
