import{_ as x}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{d as F,u as A,o,c as i,a as p,r as S,b,w as C,F as k,e as w,f as v,g as d,h as E,t as g}from"./runtime-core.esm-bundler.DPwrVdfn.js";async function j(s){const a=await s.arrayBuffer(),r=await crypto.subtle.digest("SHA-256",a);return Array.from(new Uint8Array(r)).map(e=>e.toString(16).padStart(2,"0")).join("")}function D(s,a=1){const e=["B","KB","MB","GB","TB","PB","EB","ZB","YB"],n=Math.floor(Math.log(s)/Math.log(1024));return`${Number.parseFloat((s/1024**n).toFixed(a))} ${e[n]}`}function H(s){return["png","jpg","jpeg","gif","tif","tiff","svg"].includes(`${s.split(".").pop()}`)}const B={async upload(s){const a=(s.name.split(".").pop()||"").toLowerCase(),r=await j(s),e=new FormData;return e.append("file",s),(await fetch(`https://files.ckpavv.workers.dev/${r}.${a}`,{method:"POST",body:e})).json()},async list(s){return(await fetch(`https://files.ckpavv.workers.dev?${new URLSearchParams(s)}`)).json()}},M=F({__name:"Upload",emits:["change"],setup(s,{expose:a,emit:r}){a();const e=r,n=A("input");function l(){n.value?.click()}function t(h){const u=h.target,c=u?.files;c?.length&&(e("change",c[0]),u.value="")}const _={emits:e,inputRef:n,onClick:l,onInput:t};return Object.defineProperty(_,"__isScriptSetup",{enumerable:!1,value:!0}),_}});function P(s,a,r,e,n,l){return o(),i("div",{onClick:e.onClick},[p("input",{ref:"input",type:"file",class:"hidden",onInput:e.onInput},null,544),S(s.$slots,"default")])}const z=x(M,[["render",P]]),m=20,U=F({__name:"Asstst",setup(s,{expose:a}){a();const r=d(!1),e=d(!1),n=d(!0),l=d(!1),t=d([]);async function _(c){try{l.value=!0;const f=await B.upload(c);t.value.push(f)}catch{}finally{l.value=!1}}async function h(){n.value=!0,r.value=!1,e.value=!1;try{const c={limit:m},f=t.value[t.value.length-1]?.key;f&&(c.startAfter=f);const y=await B.list(c);Array.isArray(y)&&(t.value=t.value.concat(y),y.length>=m&&(e.value=!0))}catch{r.value=!0,e.value=!1}finally{n.value=!1}}E(async()=>{h()});const u={limit:m,isHaveError:r,isHaveMore:e,isLoading:n,isUploading:l,files:t,onChange:_,search:h,get formatFileSize(){return D},get isPicture(){return H},Upload:z};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),L={class:"flex flex-col gap-4"},$={class:"px-4 py-2 text-blue-500 bg-gray-100 rounded hover:text-blue-600"},N={class:"flex flex-wrap justify-center items-center gap-6"},I=["href"],O=["src","alt"],R={key:1,class:""},T={class:"select-none text-center cursor-pointer"},V={key:0},G={key:3};function K(s,a,r,e,n,l){return o(),i("div",L,[b(e.Upload,{class:"self-end",onChange:e.onChange},{default:C(()=>[p("button",$,g(e.isUploading?"正在上传...":"上传"),1)]),_:1}),p("div",N,[(o(!0),i(k,null,w(e.files,t=>(o(),i("a",{key:t.key,href:`https://files.ckpavv.workers.dev/${t.key}`,target:"_blank",class:"w-52 h-52 p-2 hover:shadow-md cursor-pointer flex justify-center items-center !bg-gray-100 rounded"},[e.isPicture(t.key)?(o(),i("img",{key:0,class:"max-w-full max-h-full",src:`https://files.ckpavv.workers.dev/${t.key}`,alt:`.${t.key.split(".").pop()}(${e.formatFileSize(t.size)})`},null,8,O)):(o(),i("div",R,g(`.${t.key.split(".").pop()}`)+"("+g(e.formatFileSize(t.size))+") ",1))],8,I))),128)),(o(),i(k,null,w(4,t=>p("div",{key:t,class:"w-52 h-0"})),64))]),p("div",T,[e.isLoading?(o(),i("div",V," 加载中... ")):v("",!0),e.isHaveError?(o(),i("div",{key:1,onClick:e.search}," 加载失败, 点击重试 ")):v("",!0),e.isHaveMore?(o(),i("div",{key:2,onClick:e.search}," 加载更多 ")):v("",!0),!e.isHaveMore&&!e.isLoading&&!e.isHaveError?(o(),i("div",G," --- 到底部了 --- ")):v("",!0)])])}const q=x(U,[["render",K]]);export{q as default};
