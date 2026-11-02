// GenAI-assisted regression checks for counts, sparse cells, and input validation.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {YEARS,ROAD_USERS,AGE_GROUPS} from '../js/constants.js';
import {validateRows,buildModel} from '../js/data.js';
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('../vendor/d3.v7.9.0.min.js',import.meta.url),'utf8'),context);
globalThis.d3=context.d3;
const bytes=fs.readFileSync(new URL('../data/road_crash_master.csv',import.meta.url));
const csv=d3.csvParse(bytes.toString('utf8'));
const rows=validateRows(csv,csv.columns),model=buildModel(rows);
const expected=[34033,34024,35001,35515,37082,38963,39339,39590,39866,37966,39505];

test('delivered CSV is byte-identical to the reviewed KNIME export',()=>{
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'ad7e8a76d4f40fb6c0c3a60cdbebd63b5f6334dfdc14d67c8cb5f1d55995514d');
  assert.equal(rows.length,5178);
});
test('every annual total matches original workbook Table 1',()=>{
  assert.deepEqual(YEARS.map(year=>model.annual.get(year)),expected);
  assert.equal(d3.sum(model.annual.values()),410884);
});
test('age, road-user, sex, remoteness and heatmap aggregates reconcile in every year',()=>{
  for(const year of YEARS){
    const total=model.annual.get(year);
    assert.equal(d3.sum(model.ageData(year),d=>d.value),total);
    assert.equal(d3.sum(model.road.get(year).values()),total);
    assert.equal(d3.sum(model.sexes.get(year).values()),total);
    assert.equal(d3.sum(model.remoteness.get(year).values()),total);
    assert.equal(d3.sum(model.cells(year),d=>d.value),total);
    for(const road of ROAD_USERS)assert.equal(d3.sum(model.ageData(year,road),d=>d.value),model.road.get(year).get(road));
  }
});
test('2021 age counts match supplied bar chart, in chronological order',()=>{
  assert.deepEqual(model.ageData(2021).map(d=>[d.age,d.value]),[['0-7',707],['8-16',2863],['17-25',8010],['26-39',9423],['40-64',13026],['65-74',3018],['75+',2458]]);
});
test('unknown categories stay in totals; missing age appears after the ordered ages',()=>{
  assert.equal(model.ageData(2014).at(-1).age,'Missing');
  assert.equal(model.ageData(2014).at(-1).value,1);
  assert.equal(model.sexes.get(2021).get('intersex or indeterminate or missing'),1);
  assert.equal(model.remoteness.get(2021).get('Missing'),629);
});
test('heatmap shares sum to one within each observed nonempty age group',()=>{
  for(const year of YEARS)for(const age of AGE_GROUPS){
    const cells=model.cells(year).filter(d=>d.age===age);
    if(cells.length&&cells[0].total>0)assert.ok(Math.abs(d3.sum(cells,d=>d.share)-1)<1e-12);
  }
});
test('absent heatmap combinations remain null and explicit zero remains zero',()=>{
  const cells=model.cells(2021);
  assert.ok(cells.some(d=>d.value===null));
  assert.ok(cells.some(d=>d.value===0));
  assert.equal(cells.find(d=>d.age==='40-64'&&d.user==='Car driver').value,4036);
  assert.equal(model.maxCell,4298); // 2019, age 40–64, car driver; independently summed in Python.
});
test('narrative statistics independently match the CSV',()=>{
  assert.equal(((model.annual.get(2021)/model.annual.get(2020)-1)*100).toFixed(1),'4.1');
  assert.equal(((model.road.get(2021).get('Motorcyclist')+model.road.get(2021).get('Pedal cyclist'))/39505*100).toFixed(1),'43.1');
  assert.equal(((model.road.get(2021).get('Pedal cyclist')/model.road.get(2011).get('Pedal cyclist')-1)*100).toFixed(1),'51.4');
  assert.equal(((model.road.get(2021).get('Motorcyclist')/model.road.get(2011).get('Motorcyclist')-1)*100).toFixed(1),'17.4');
});
test('index baseline is defined for all selectable road users',()=>{
  for(const road of ROAD_USERS)assert.ok(model.road.get(2011).get(road)>0);
});
test('malformed, blank, negative and noninteger counts are rejected',()=>{
  for(const value of ['',null,'n.p.','-1','1.5','Infinity'])assert.throws(()=>validateRows([{...csv[0],hospitalisations:value},...csv.slice(1)]));
});
test('duplicates, missing years and unexpected categories fail clearly',()=>{
  assert.throws(()=>validateRows([...csv,csv[0]]),/Duplicate/);
  assert.throws(()=>validateRows(csv.filter(d=>d.year!=='2020')),/every year/);
  assert.throws(()=>validateRows([{...csv[0],age_group:'0-16'},...csv.slice(1)]),/Unexpected/);
  assert.throws(()=>validateRows(csv,['year']),/headers/);
  assert.throws(()=>validateRows([]),/empty/);
});
