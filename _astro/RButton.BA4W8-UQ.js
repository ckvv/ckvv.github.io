import{r as d}from"./index.BVOCwoKb.js";var x={exports:{}},e={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l;function R(){if(l)return e;l=1;var n=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function s(o,t,r){var i=null;if(r!==void 0&&(i=""+r),t.key!==void 0&&(i=""+t.key),"key"in t){r={};for(var a in t)a!=="key"&&(r[a]=t[a])}else r=t;return t=r.ref,{$$typeof:n,type:o,key:i,ref:t!==void 0?t:null,props:r}}return e.Fragment=u,e.jsx=s,e.jsxs=s,e}var c;function p(){return c||(c=1,x.exports=R()),x.exports}var v=p();function E(n){const[u,s]=d.useState(n.count||0);function o(){s(u+1)}return v.jsxs("button",{className:"v-button text-sky-500 bg-sky-200 px-2 py-1 whitespace-nowrap rounded-lg",onClick:o,children:[n.children,u]})}export{E as default};
