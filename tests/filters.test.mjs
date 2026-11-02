// GenAI-assisted tests of shared filters and source-derived denominators.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {filterRows,validateRows,buildModel} from '../js/data.js';
import {YEARS,REMOTENESS,AGE_GROUPS,SEXES,ROAD_USERS} from '../js/constants.js';
const context=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../vendor/d3.v7.9.0.min.js',import.meta.url),'utf8'),context);globalThis.d3=context.d3;
const csv=d3.csvParse(fs.readFileSync(new URL('../data/road_crash_master.csv',import.meta.url),'utf8')),rows=validateRows(csv,csv.columns);
const sum=records=>records.reduce((total,row)=>total+row.hospitalisations,0);
test('every dimension filter preserves annual/age/matrix reconciliation',()=>{
  for(const [field,values] of [['remoteness',REMOTENESS],['age',AGE_GROUPS],['sex',SEXES],['road',ROAD_USERS]])for(const value of values){
    const selected=filterRows(rows,{[field]:value}),model=buildModel(selected);
    for(const year of YEARS){
      const expected=sum(selected.filter(row=>row.year===year));
      assert.equal(model.annual.get(year)??0,expected);
      assert.equal(d3.sum(model.ageData(year),d=>d.value),expected);
      assert.equal(d3.sum(model.cells(year),d=>d.value),expected);
    }
  }
});
test('combined filter intersections match independent source row selection',()=>{
  const filtered=filterRows(rows,{year:2021,remoteness:'Regional',age:'40-64',sex:'Female',road:'Pedal cyclist'});
  const expected=rows.filter(r=>r.remoteness==='Regional'&&r.age_group==='40-64'&&r.sex==='Female'&&r.road_user==='Pedal cyclist');
  assert.deepEqual(filtered,expected);assert.equal(new Set(filtered.map(d=>d.year)).size,11);
  const model=buildModel(filtered);
  assert.equal(model.annual.get(2021),sum(expected.filter(r=>r.year===2021)));
  assert.equal(model.ageData(2021).length,1);
});
test('year is a snapshot selector and does not discard trend context',()=>{
  assert.equal(filterRows(rows,{year:2011}).length,5178);
  assert.equal(filterRows(rows,{year:2021}).length,5178);
});
test('unknown categories remain selectable and are not folded into other categories',()=>{
  assert.equal(sum(filterRows(rows,{sex:'intersex or indeterminate or missing'})),15);
  assert.equal(sum(filterRows(rows,{age:'Missing'})),1);
  assert.equal(sum(filterRows(rows,{remoteness:'Missing'})),8833);
});
test('filtered shares use the complete matching age-group total across matrix pages',()=>{
  const selected=filterRows(rows,{remoteness:'Regional',sex:'Female'}),model=buildModel(selected);
  const cells=model.cells(2021).filter(d=>d.age==='40-64');
  const total=sum(selected.filter(r=>r.year===2021&&r.age_group==='40-64'));
  assert.equal(cells[0].total,total);assert.ok(Math.abs(d3.sum(cells,d=>d.share)-1)<1e-12);
});
test('empty combinations and zero totals do not invent records or invalid shares',()=>{
  const model=buildModel(filterRows(rows,{age:'Missing',sex:'Female'}));
  assert.equal(model.rows.length,0);assert.equal(model.cells(2021).length,0);assert.equal(model.maxCell,0);
  assert.ok(model.series('Car driver').every(d=>d.value===null));
  const zero=rows.find(d=>d.hospitalisations===0),zeroModel=buildModel([zero]);
  const cell=zeroModel.cells(zero.year).find(d=>d.age===zero.age_group&&d.user===zero.road_user);
  assert.equal(cell.value,0);assert.equal(cell.share,null);
});
