import{w as D}from"./runtime-dom.esm-bundler.BY0Bn5Jo.js";import{g as S,f as j,i as H}from"./shared.C2hNlEjk.js";import{_ as E}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{d as A,u as z,o as i,c,a as h,r as L,b as P,w as U,F as C,e as b,f as y,g as m,h as M,t as k}from"./runtime-core.esm-bundler.DKSusNuW.js";async function w(s,r,n=6e3){const e=new AbortController,a=setTimeout(()=>e.abort(),n);return fetch(s,{...r,signal:e.signal}).then(o=>(clearTimeout(a),o)).catch(o=>{throw o.name==="AbortError"?new Error("Request timed out"):o})}const x={async upload(s){const r=(s.name.split(".").pop()||"").toLowerCase(),n=await S(s),e=new FormData;return e.append("file",s),(await w(`https://api.ckvv.net/r2/${n}.${r}`,{method:"POST",body:e})).json()},async list(s){return(await w(`https://api.ckvv.net/r2?${new URLSearchParams(s)}`)).json()},async del(s,r){return(await w(`https://api.ckvv.net/r2/${s}`,{headers:new Headers({Authorization:r}),method:"DELETE"})).json()}},T=A({__name:"Upload",emits:["change"],setup(s,{expose:r,emit:n}){r();const e=n,a=z("input");function o(){a.value?.click()}function t(p){const _=p.target,v=_?.files;v?.length&&(e("change",v[0]),_.value="")}const d={emits:e,inputRef:a,onClick:o,onInput:t};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}});function I(s,r,n,e,a,o){return i(),c("div",{onClick:e.onClick},[h("input",{ref:"input",type:"file",class:"hidden",onInput:e.onInput},null,544),L(s.$slots,"default")])}const R=E(T,[["render",I]]),F=20,N=A({__name:"Asstst",setup(s,{expose:r}){r();const n=m(!1),e=m(!1),a=m(!0),o=m(!1),t=m([]);async function d(u){try{o.value=!0;const l=await x.upload(u);t.value.push(l)}catch{}finally{o.value=!1}}async function p(){a.value=!0,n.value=!1,e.value=!1;try{const u={limit:F},l=t.value[t.value.length-1]?.key;l&&(u.startAfter=l);const f=await x.list(u);Array.isArray(f)&&(t.value=t.value.concat(f),f.length>=F&&(e.value=!0))}catch{n.value=!0,e.value=!1}finally{a.value=!1}}async function _(u,l,f,B){u.preventDefault();try{const g=prompt(B||"请输入密码");if(!g)return;if((await x.del(l.key,g))?.success===!1)return _(u,l,f,"密码错误, 请重新输入密码");t.value.splice(f,1)}catch{}}M(async()=>{p()});const v={limit:F,isHaveError:n,isHaveMore:e,isLoading:a,isUploading:o,files:t,onChange:d,search:p,handlerDel:_,get formatFileSize(){return j},get isPicture(){return H},Upload:R};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}}),O={class:"flex flex-col gap-4"},V={class:"px-4 py-2 text-blue-500 bg-gray-100 rounded hover:text-blue-600"},q={class:"flex flex-wrap justify-center items-center gap-6"},$=["href"],G=["src","alt"],J={key:1,class:""},K=["onClick"],Q={class:"select-none text-center cursor-pointer"},W={key:0},X={key:3};function Y(s,r,n,e,a,o){return i(),c("div",O,[P(e.Upload,{class:"self-end",onChange:e.onChange},{default:U(()=>[h("button",V,k(e.isUploading?"正在上传...":"上传"),1)]),_:1}),h("div",q,[(i(!0),c(C,null,b(e.files,(t,d)=>(i(),c("a",{key:t.key,href:`https://r2.ckvv.net/${t.key}`,target:"_blank",class:"group w-full md:w-52 md:h-52 p-2 hover:shadow-md cursor-pointer flex justify-center items-center !bg-gray-100 rounded relative"},[e.isPicture(t.key)?(i(),c("img",{key:0,class:"max-w-full max-h-full",src:`https://r2.ckvv.net/${t.key}`,alt:`.${t.key.split(".").pop()}(${e.formatFileSize(t.size)})`},null,8,G)):(i(),c("div",J,k(`.${t.key.split(".").pop()}`)+"("+k(e.formatFileSize(t.size))+") ",1)),h("div",{class:"w-8 h-8 justify-center items-center text-red-500 absolute top-0 right-0 hidden group-hover:flex text-xl hover:text-2xl",onClick:D(p=>e.handlerDel(p,t,d),["stop"])},"x",8,K)],8,$))),128)),(i(),c(C,null,b(4,t=>h("div",{key:t,class:"w-52 h-0"})),64))]),h("div",Q,[e.isLoading?(i(),c("div",W," 加载中... ")):y("",!0),e.isHaveError?(i(),c("div",{key:1,onClick:e.search}," 加载失败, 请点击重试 ")):y("",!0),e.isHaveMore?(i(),c("div",{key:2,onClick:e.search}," 加载更多 ")):y("",!0),!e.isHaveMore&&!e.isLoading&&!e.isHaveError?(i(),c("div",X," --- 到底部了 --- ")):y("",!0)])])}const ne=E(N,[["render",Y]]);export{ne as default};
