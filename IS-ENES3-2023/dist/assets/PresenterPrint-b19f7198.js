import{h as _,j as d,k as p,ak as h,c as m,al as u,m as n,am as t,an as o,z as s,F as f,ao as g,ap as v,aq as x,q as r,ar as y,as as b,n as N,at as k,au as S,_ as P}from"./nav-11d6d61c.js";import{N as w}from"./NoteDisplay-4ffc551e.js";import{u as V}from"./index-7e27cbbf.js";import"./_commonjsHelpers-28e086c5.js";const j={class:"m-4"},L={class:"mb-10"},T={class:"text-4xl font-bold mt-2"},z={class:"opacity-50"},B={class:"text-lg"},C={class:"font-bold flex gap-2"},D={class:"opacity-50"},E=t("div",{class:"flex-auto"},null,-1),H={key:0,class:"border-gray-400/50 mb-8"},q=_({__name:"PresenterPrint",setup(F){d(p),h(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),V({title:`Notes - ${m.title}`});const i=u(()=>x.slice(0,-1).map(a=>{var l;return(l=a.meta)==null?void 0:l.slide}).filter(a=>a!==void 0&&a.noteHTML!==""));return(a,l)=>(r(),n("div",{id:"page-root",style:v(s(S))},[t("div",j,[t("div",L,[t("h1",T,o(s(m).title),1),t("div",z,o(new Date().toLocaleString()),1)]),(r(!0),n(f,null,g(s(i),(e,c)=>(r(),n("div",{key:c,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",B,[t("div",C,[t("div",D,o(e==null?void 0:e.no)+"/"+o(s(y)),1),b(" "+o(e==null?void 0:e.title)+" ",1),E])]),N(w,{"note-html":e.noteHTML,class:"max-w-full"},null,8,["note-html"])]),c<s(i).length-1?(r(),n("hr",H)):k("v-if",!0)]))),128))])],4))}}),U=P(q,[["__file","/Users/oliver/cylc-presentations/IS-ENES3-2023/node_modules/@slidev/client/internals/PresenterPrint.vue"]]);export{U as default};
