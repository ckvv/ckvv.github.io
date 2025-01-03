import{w as S}from"./runtime-dom.esm-bundler.BY0Bn5Jo.js";import{_ as E}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{d as A,u as D,o as i,c as u,a as h,r as j,b as H,w as M,F,e as C,f as y,g as m,h as P,t as k}from"./runtime-core.esm-bundler.DKSusNuW.js";async function z(t){const r=await t.arrayBuffer(),n=await crypto.subtle.digest("SHA-256",r);return Array.from(new Uint8Array(n)).map(e=>e.toString(16).padStart(2,"0")).join("")}function L(t,r=1){const e=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],o=Math.floor(Math.log(t)/Math.log(1024));return`${Number.parseFloat((t/1024**o).toFixed(r))} ${e[o]}`}function U(t){return["png","jpg","jpeg","gif","tif","tiff","svg"].includes(`${t.split(".").pop()}`)}async function w(t,r,n=6e3){const e=new AbortController,o=setTimeout(()=>e.abort(),n);return fetch(t,{...r,signal:e.signal}).then(a=>(clearTimeout(o),a)).catch(a=>{throw a.name==="AbortError"?new Error("Request timed out"):a})}const B={async upload(t){const r=(t.name.split(".").pop()||"").toLowerCase(),n=await z(t),e=new FormData;return e.append("file",t),(await w(`https://files.ckvv.net/${n}.${r}`,{method:"POST",body:e})).json()},async list(t){return(await w(`https://files.ckvv.net?${new URLSearchParams(t)}`)).json()},async del(t,r){return(await w(`https://files.ckvv.net/${t}`,{headers:new Headers({Authorization:r}),method:"DELETE"})).json()}},T=A({__name:"Upload",emits:["change"],setup(t,{expose:r,emit:n}){r();const e=n,o=D("input");function a(){o.value?.click()}function s(d){const _=d.target,v=_?.files;v?.length&&(e("change",v[0]),_.value="")}const f={emits:e,inputRef:o,onClick:a,onInput:s};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}});function N(t,r,n,e,o,a){return i(),u("div",{onClick:e.onClick},[h("input",{ref:"input",type:"file",class:"hidden",onInput:e.onInput},null,544),j(t.$slots,"default")])}const I=E(T,[["render",N]]),x=20,R=A({__name:"Asstst",setup(t,{expose:r}){r();const n=m(!1),e=m(!1),o=m(!0),a=m(!1),s=m([]);async function f(c){try{a.value=!0;const l=await B.upload(c);s.value.push(l)}catch{}finally{a.value=!1}}async function d(){o.value=!0,n.value=!1,e.value=!1;try{const c={limit:x},l=s.value[s.value.length-1]?.key;l&&(c.startAfter=l);const p=await B.list(c);Array.isArray(p)&&(s.value=s.value.concat(p),p.length>=x&&(e.value=!0))}catch{n.value=!0,e.value=!1}finally{o.value=!1}}async function _(c,l,p,b){c.preventDefault();try{const g=prompt(b||"请输入密码");if(!g)return;if((await B.del(l.key,g))?.success===!1)return _(c,l,p,"密码错误, 请重新输入密码");s.value.splice(p,1)}catch{}}P(async()=>{d()});const v={limit:x,isHaveError:n,isHaveMore:e,isLoading:o,isUploading:a,files:s,onChange:f,search:d,handlerDel:_,get formatFileSize(){return L},get isPicture(){return U},Upload:I};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}}),V={class:"flex flex-col gap-4"},$={class:"px-4 py-2 text-blue-500 bg-gray-100 rounded hover:text-blue-600"},O={class:"flex flex-wrap justify-center items-center gap-6"},q=["href"],G=["src","alt"],K={key:1,class:""},Y=["onClick"],Z={class:"select-none text-center cursor-pointer"},J={key:0},Q={key:3};function W(t,r,n,e,o,a){return i(),u("div",V,[H(e.Upload,{class:"self-end",onChange:e.onChange},{default:M(()=>[h("button",$,k(e.isUploading?"正在上传...":"上传"),1)]),_:1}),h("div",O,[(i(!0),u(F,null,C(e.files,(s,f)=>(i(),u("a",{key:s.key,href:`https://r2.ckvv.net/${s.key}`,target:"_blank",class:"group w-full md:w-52 md:h-52 p-2 hover:shadow-md cursor-pointer flex justify-center items-center !bg-gray-100 rounded relative"},[e.isPicture(s.key)?(i(),u("img",{key:0,class:"max-w-full max-h-full",src:`https://r2.ckvv.net/${s.key}`,alt:`.${s.key.split(".").pop()}(${e.formatFileSize(s.size)})`},null,8,G)):(i(),u("div",K,k(`.${s.key.split(".").pop()}`)+"("+k(e.formatFileSize(s.size))+") ",1)),h("div",{class:"w-8 h-8 justify-center items-center text-red-500 absolute top-0 right-0 hidden group-hover:flex text-xl hover:text-2xl",onClick:S(d=>e.handlerDel(d,s,f),["stop"])},"x",8,Y)],8,q))),128)),(i(),u(F,null,C(4,s=>h("div",{key:s,class:"w-52 h-0"})),64))]),h("div",Z,[e.isLoading?(i(),u("div",J," 加载中... ")):y("",!0),e.isHaveError?(i(),u("div",{key:1,onClick:e.search}," 加载失败(需要 VPN 访问), 点击重试 ")):y("",!0),e.isHaveMore?(i(),u("div",{key:2,onClick:e.search}," 加载更多 ")):y("",!0),!e.isHaveMore&&!e.isLoading&&!e.isHaveError?(i(),u("div",Q," --- 到底部了 --- ")):y("",!0)])])}const re=E(R,[["render",W]]);export{re as default};
