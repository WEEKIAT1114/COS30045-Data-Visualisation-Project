/**
 * GenAI acknowledgement: OpenAI Codex assisted with the project and this revision.
 * Prompt summary: match the supplied header/navigation/filter/four-chart sketch;
 * support year, remoteness, age, sex and road-user filters; preserve fixed screens;
 * explain missing data for rates; apply the user's sand/lavender/navy palette.
 * See docs/AI-ACKNOWLEDGEMENT.md.
 */
import {YEARS,ROAD_USERS,AGE_GROUPS,SEXES,REMOTENESS,number,percent,ageLabel} from './constants.js';
import {loadData,filterRows,buildModel} from './data.js';
import {hideTooltip,table} from './ui.js';
import {readState,pageUrl,matrixWindow,pageWindow} from './navigation.js';
import {mountPage,INFO,CHARTS} from './pages.js';
import {drawNational,drawAge,drawRoad,drawMatrix,roadSeries} from './dashboard-charts.js';

const page=document.body.dataset.page||'home',state=readState(location.search);
if(page==='glossary'&&!['measures','dimensions','limits'].includes(state.topic))state.topic='measures';
let source,model,filterKey='';
mountPage(page);
const d3=globalThis.d3;
const text=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=value;};
const on=(id,event,fn)=>document.getElementById(id)?.addEventListener(event,fn);
function summary(){return [state.remoteness==='All'?'All remoteness':state.remoteness==='Missing'?'Other/unknown residence':state.remoteness,state.age==='All'?'All ages':ageLabel(state.age),state.sex==='All'?'All sex categories':state.sex,state.road==='All'?'All road users':state.road].join(' · ');}
function setYear(year){if(YEARS.includes(+year)){state.year=+year;state.tablePage=0;state.matrixPage=0;state.agePage=0;render();}}
function setRoad(road){if(road==='All'||ROAD_USERS.includes(road)){state.road=road;state.matrixPage=0;state.tablePage=0;state.agePage=0;render();}}
function updateLinks(){
  document.querySelectorAll('a[data-page]').forEach(link=>{const extras={};if(link.dataset.view)extras.view=link.dataset.view;if(link.dataset.topic)extras.topic=link.dataset.topic;link.href=pageUrl(link.dataset.page,state,extras);});
  history.replaceState(null,'',pageUrl(page,state,page==='table'?{view:state.view}:['about','glossary'].includes(page)?{topic:state.topic}:{}));
}
function updatePager(prefix,range,total,label){
  document.getElementById(`${prefix}-prev`).disabled=range.current===0;
  document.getElementById(`${prefix}-next`).disabled=range.current===range.pages-1;
  text(`${prefix}-range`,total?`${label} ${range.start+1}–${range.end} of ${total}`:'No matching rows');
}
function renderMatrix(){
  const host=document.getElementById('heatmap-chart'),cells=model.cells(state.year),ages=[...new Set(cells.map(d=>d.age))];
  const users=state.road==='All'?ROAD_USERS:[state.road];
  const range=matrixWindow(host.clientWidth,host.clientHeight,ages.length,state.matrixPage,users.length);
  state.matrixPage=range.current;state.matrixColumns=users.slice(range.columnStart,range.columnEnd);state.matrixAges=ages.slice(range.rowStart,range.rowEnd);
  document.getElementById('matrix-prev').disabled=range.current===0;document.getElementById('matrix-next').disabled=range.current===range.pages-1;
  text('matrix-range',`View ${range.current+1} / ${range.pages}`);
  document.getElementById('matrix-range').setAttribute('aria-label',`View ${range.current+1} of ${range.pages}; road users ${range.columnStart+1} to ${range.columnEnd} of ${users.length}; age groups ${range.rowStart+1} to ${range.rowEnd} of ${ages.length}`);
  text('heatmap-legend-title',state.matrix==='share'?'Age share':'Count');text('heatmap-legend-range',state.matrix==='share'?'0–100%':`0–${number(model.maxCell)}`);
  drawMatrix(model,state,setRoad,value=>text('chart-announcer',value));
}
function renderAge(){
  const all=model.ageData(state.year),height=document.getElementById('age-chart').clientHeight;
  const compact=page==='home'&&window.innerWidth>850&&window.innerHeight>=680;
  const range=pageWindow(all.length,Math.max(1,Math.floor((height-29)/(compact?14:19))),state.agePage||0);
  document.querySelector('.card-age').classList.toggle('age-paged',range.pages>1);
  state.agePage=range.current;state.ageRows=all.slice(range.start,range.end);
  updatePager('age',range,all.length,'Ages');
  drawAge(model,state);
}
function renderAnalytics(){
  const total=model.annual.get(state.year),rows=model.rows.filter(d=>d.year===state.year);
  text('snapshot-total',total==null?'—':number(total));text('snapshot-label',`${state.year} matching admissions`);text('filter-summary',summary());
  text('decade-context','Count · 2011–2021 · selected year highlighted');
  text('age-context',`${state.year} snapshot · count of matching hospitalisations`);
  text('matrix-context',`${state.year} snapshot · ${state.matrix==='count'?'matching counts':'shares within the filtered age group'}`);
  const users=roadSeries(model,state);
  text('road-context',`${state.trend==='count'?'Count':'Index'} · ${state.road==='All'?'three largest filtered road-user totals across 2011–2021':state.road}`);
  const narrow=window.innerWidth<=850;
  document.querySelectorAll('.dashboard-grid>[data-chart]').forEach(card=>card.classList.toggle('visible-chart',page!=='home'||!narrow||card.dataset.chart===CHARTS[state.chartPage].id));
  if(page==='home'){
    text('chart-range',`${state.chartPage+1} / ${CHARTS.length}`);text('chart-question',CHARTS[state.chartPage].question);
    document.getElementById('chart-prev').disabled=state.chartPage===0;document.getElementById('chart-next').disabled=state.chartPage===CHARTS.length-1;
  }
  const visible=page==='home'?(narrow?[CHARTS[state.chartPage].id]:CHARTS.map(c=>c.id)):[page];
  if(visible.includes('decade'))drawNational(model,state,setYear);
  if(visible.includes('age'))renderAge();
  if(visible.includes('matrix'))renderMatrix();
  if(visible.includes('road'))drawRoad(model,state,setYear,setRoad);
  const prev=model.annual.get(state.year-1);
  let insight=!rows.length?`No records match this snapshot. Try another year or reset a filter.`:`${state.year}: ${number(total)} matching admissions. `;
  if(rows.length){
    if(state.year===2012||state.year===2017)insight+='Admission criteria changed; the previous year is not directly comparable.';
    else if(prev>0)insight+=`${total>=prev?'+':'−'}${percent(Math.abs(total-prev)/prev)} recorded count vs ${state.year-1}. Counts describe burden, not individual risk.`;
    else insight+='Counts describe hospital burden, not individual risk.';
  }
  text('dashboard-insight',window.innerWidth<=850&&window.innerHeight<=680?'Counts describe hospital burden, not individual risk.':insight);
}
function renderInfo(){
  const node=document.getElementById('info-stage'),cards=INFO[state.topic]||INFO.source,mobile=window.innerWidth<=850;
  const capacity=mobile?(node.clientHeight>445?2:1):window.innerWidth<1100?2:3;
  const range=pageWindow(cards.length,capacity,state.part);state.part=range.current;
  node.style.gridTemplateColumns=mobile?'1fr':`repeat(${Math.min(capacity,cards.length)},minmax(0,1fr))`;
  node.innerHTML=cards.slice(range.start,range.end).map((card,i)=>`<article class="info-card"><span class="info-number">${String(range.start+i+1).padStart(2,'0')} / ${cards.length}</span><h2>${card.title}</h2>${card.html}</article>`).join('');
  document.querySelectorAll('button[data-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.topic===state.topic)));
  updatePager('info',range,cards.length,'Notes');
}
function renderRates(){
  const current=state.ratesPage||0;
  document.querySelectorAll('[data-rate]').forEach(node=>node.classList.toggle('visible-rate',Number(node.dataset.rate)===current));
  text('rates-range',`${current+1} / 3`);
  document.getElementById('rates-prev').disabled=current===0;document.getElementById('rates-next').disabled=current===2;
}
function renderTable(){
  const year=state.year,total=model.annual.get(year),users=state.road==='All'?ROAD_USERS:[state.road];
  let headers,rows,caption;
  if(state.view==='decade'){headers=['Year','Matching count'];rows=YEARS.map(y=>[y,model.annual.get(y)??null]);caption='Filtered history · — = no record · policy breaks in 2012/2017.';}
  if(state.view==='road'){headers=['Road user','Count','Share'];rows=users.map(user=>{const value=model.road.get(year)?.get(user)??null;return [user,value,value!=null&&total>0?percent(value/total):'—'];});caption=`${year} · filtered snapshot · shares of matching admissions.`;}
  if(state.view==='age'){const values=model.ageData(year),sum=d3.sum(values,d=>d.value);headers=['Age group','Count','Share'];rows=values.map(d=>[ageLabel(d.age),d.value,sum>0?percent(d.value/sum):'—']);caption=`${year} · filtered age-group counts and shares.`;}
  if(state.view==='matrix'){headers=['Age','Road user','Count','Age share'];rows=model.cells(year).filter(d=>users.includes(d.user)).map(d=>[ageLabel(d.age),d.user,d.value,percent(d.share)]);caption=`${year} · — = no record or undefined share · 0 = explicit zero.`;}
  const height=document.getElementById('data-table').clientHeight,range=pageWindow(rows.length,Math.max(1,Math.floor((height-84)/44)),state.tablePage);state.tablePage=range.current;
  table('data-table',caption,headers,rows.slice(range.start,range.end));document.querySelector('#data-table table').dataset.view=state.view;document.getElementById('table-view').value=state.view;
  text('filter-summary',summary());updatePager('table',range,rows.length,'Rows');
}
function render(){
  if(!source)return;
  hideTooltip();
  const key=JSON.stringify([state.remoteness,state.age,state.sex,state.road]);
  if(key!==filterKey){model=buildModel(filterRows(source.rows,state));filterKey=key;}
  for(const [id,field] of [['year-select','year'],['remoteness-select','remoteness'],['age-select','age'],['sex-select','sex'],['road-select','road']]){
    const el=document.getElementById(id);if(el){el.value=state[field];el.classList.toggle('active-filter',field==='year'?state.year!==2021:state[field]!=='All');}
  }
  if(['home','decade','age','matrix','road'].includes(page))renderAnalytics();
  if(['about','glossary'].includes(page))renderInfo();
  if(page==='rates')renderRates();
  if(page==='table')renderTable();
  document.querySelectorAll('[data-trend]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.trend===state.trend)));
  document.querySelectorAll('[data-matrix]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.matrix===state.matrix)));
  updateLinks();
}
function bindControls(){
  const options=[['year-select','year',YEARS.map(value=>({value,label:String(value)}))],['remoteness-select','remoteness',[{value:'All',label:'All remoteness'},...REMOTENESS.map(value=>({value,label:value==='Missing'?'Other / unknown residence':value}))]],['age-select','age',[{value:'All',label:'All age groups'},...AGE_GROUPS.map(value=>({value,label:ageLabel(value)}))]],['sex-select','sex',[{value:'All',label:'All sex categories'},...SEXES.map(value=>({value,label:value==='intersex or indeterminate or missing'?'Intersex / indeterminate / missing':value}))]],['road-select','road',[{value:'All',label:'All road users'},...ROAD_USERS.map(value=>({value,label:value}))]]];
  for(const [id,field,values] of options){if(!document.getElementById(id))continue;d3.select(`#${id}`).selectAll('option').data(values).join('option').attr('value',d=>d.value).text(d=>d.label);on(id,'change',e=>{state[field]=field==='year'?+e.target.value:e.target.value;state.matrixPage=0;state.agePage=0;state.tablePage=0;render();});}
  document.querySelector('form')?.addEventListener('submit',e=>e.preventDefault());
  on('reset','click',()=>{Object.assign(state,{year:2021,remoteness:'All',age:'All',sex:'All',road:'All',trend:'count',matrix:'count',matrixPage:0,agePage:0,tablePage:0});render();});
  document.querySelectorAll('[data-trend]').forEach(button=>button.addEventListener('click',()=>{state.trend=button.dataset.trend;render();}));
  document.querySelectorAll('[data-matrix]').forEach(button=>button.addEventListener('click',()=>{state.matrix=button.dataset.matrix;render();}));
  document.querySelectorAll('button[data-topic]').forEach(button=>button.addEventListener('click',()=>{state.topic=button.dataset.topic;state.part=0;render();}));
  for(const [prefix,key] of [['matrix','matrixPage'],['age','agePage'],['info','part'],['table','tablePage']]){on(`${prefix}-prev`,'click',()=>{state[key]=(state[key]||0)-1;render();});on(`${prefix}-next`,'click',()=>{state[key]=(state[key]||0)+1;render();});}
  on('chart-prev','click',()=>{state.chartPage=Math.max(0,state.chartPage-1);render();});on('chart-next','click',()=>{state.chartPage=Math.min(CHARTS.length-1,state.chartPage+1);render();});
  on('table-view','change',e=>{state.view=e.target.value;state.tablePage=0;render();});
  on('rates-prev','click',()=>{state.ratesPage=Math.max(0,(state.ratesPage||0)-1);render();});on('rates-next','click',()=>{state.ratesPage=Math.min(2,(state.ratesPage||0)+1);render();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTooltip();});
  let timer;const observer=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(render,80);});document.querySelectorAll('.chart-host,.info-stage,.table-stage').forEach(host=>observer.observe(host));
  window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(render,80);});
}
loadData().then(data=>{source=data;document.getElementById('load-status').hidden=true;bindControls();render();}).catch(error=>{const node=document.getElementById('load-status');node.hidden=false;node.classList.add('error-message');node.setAttribute('role','alert');node.textContent=`The page could not load. ${error.message} Serve the folder over HTTP using Live Server or node server.mjs.`;console.error('Dashboard load failed:',error);});
