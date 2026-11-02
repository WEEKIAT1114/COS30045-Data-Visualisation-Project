// GenAI-assisted navigation. URL state preserves selections across real HTML pages.
import {YEARS,ROAD_USERS,REMOTENESS,AGE_GROUPS,SEXES} from './constants.js';
export const PAGES=[{id:'home',file:'index.html',label:'Hospitalised injuries',short:'Hospitalisations'},{id:'rates',file:'rates.html',label:'Hospitalised injury rates',short:'Injury rates'},{id:'glossary',file:'glossary.html',label:'Glossary',short:'Glossary'}];
const FILES={home:'index.html',rates:'rates.html',glossary:'glossary.html',about:'about.html',table:'table.html',decade:'decade.html',road:'road-users.html',age:'age.html',matrix:'intersection.html'};
export function readState(search='') {
  const q=new URLSearchParams(search),year=Number(q.get('year'));
  return {year:YEARS.includes(year)?year:2021,road:ROAD_USERS.includes(q.get('road'))?q.get('road'):'All',remoteness:REMOTENESS.includes(q.get('remoteness'))?q.get('remoteness'):'All',age:AGE_GROUPS.includes(q.get('age'))?q.get('age'):'All',sex:SEXES.includes(q.get('sex'))?q.get('sex'):'All',trend:q.get('trend')==='index'?'index':'count',matrix:q.get('matrix')==='share'?'share':'count',view:['decade','road','age','matrix'].includes(q.get('view'))?q.get('view'):'decade',topic:['source','limits','references','accessibility','dimensions','measures'].includes(q.get('topic'))?q.get('topic'):'source',part:0,tablePage:0,matrixPage:0,chartPage:0};
}
export function pageUrl(page,state,extras={}) {
  const file=FILES[page]||'index.html';
  const q=new URLSearchParams({year:String(state.year),road:state.road,remoteness:state.remoteness||'All',age:state.age||'All',sex:state.sex||'All',trend:state.trend,matrix:state.matrix,...extras});
  return `${file}?${q}`;
}
export function matrixCapacity(width) {return Math.max(2,Math.min(12,Math.floor((width-66)/81)));}
export function pageWindow(length,capacity,page) {
  const size=Math.max(1,Math.floor(capacity)),pages=Math.max(1,Math.ceil(length/size));
  const current=Math.max(0,Math.min(pages-1,Math.floor(page)||0));
  return {start:current*size,end:Math.min(length,(current+1)*size),current,pages,size};
}
export function matrixWindow(width,height,ageCount,page,columnCount=12) {
  const columns=matrixCapacity(width),rows=Math.max(1,Math.floor((height-80)/24));
  const columnPages=Math.max(1,Math.ceil(columnCount/columns)),rowPages=Math.max(1,Math.ceil(ageCount/rows));
  const pages=columnPages*rowPages,current=Math.max(0,Math.min(pages-1,Math.floor(page)||0));
  const columnStart=Math.floor(current/rowPages)*columns,rowStart=(current%rowPages)*rows;
  return {columnStart,columnEnd:Math.min(columnCount,columnStart+columns),rowStart,rowEnd:Math.min(ageCount,rowStart+rows),current,pages,rowPages,columns,rows};
}
