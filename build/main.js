(()=>{var c=Object.defineProperty;var b=Object.getOwnPropertyDescriptor;var $=Object.getOwnPropertyNames;var M=Object.prototype.hasOwnProperty;var s=(e,o)=>()=>(e&&(o=e(e=0)),o);var O=(e,o)=>{for(var t in o)c(e,t,{get:o[t],enumerable:!0})},E=(e,o,t,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let n of $(o))!M.call(e,n)&&n!==t&&c(e,n,{get:()=>o[n],enumerable:!(r=b(o,n))||r.enumerable});return e};var I=e=>E(c({},"__esModule",{value:!0}),e);function g(e,o){let t=`${d}`;return d+=1,a[t]={handler:o,name:e},function(){delete a[t]}}function m(e,o){let t=!1;return g(e,function(...r){t!==!0&&(t=!0,o(...r))})}function u(e,o){for(let t in a)a[t].name===e&&a[t].handler.apply(null,o)}var a,d,p,x=s(()=>{a={},d=0;p=typeof window=="undefined"?function(e,...o){figma.ui.postMessage([e,...o])}:function(e,...o){window.parent.postMessage({pluginMessage:[e,...o]},"*")};typeof window=="undefined"?figma.ui.onmessage=function([e,...o]){u(e,o)}:window.onmessage=function(e){let[o,...t]=e.data.pluginMessage;u(o,t)}});function f(e,o){if(typeof __html__=="undefined")throw new Error("No UI defined");let t=`<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command=="undefined"?"":figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof o=="undefined"?{}:o)};${__html__}<\/script>`;figma.showUI(t,e)}var y=s(()=>{});var S=s(()=>{x();y()});var h,U,N,C,l,H,T,w=s(()=>{h=e=>{if(e.unit==="PIXELS")return`${e.value.toFixed(2)}px`;throw new Error(`Unsupported unit: ${e.unit}`)},U=e=>{switch(e.toLowerCase()){case"regular":return 400;case"semibold":return 600;case"bold":return 700;default:throw new Error(`Unsupported font weight: ${e}`)}},N=e=>e.replace(/\s|\/|-|(?:Regular)/gi,"").replace(/^./,e[0].toLowerCase()),C=()=>figma.getLocalTextStyles().reduce((e,o)=>{let t=N(o.name);return e[t]={fontFamily:o.fontName.family,fontSize:o.fontSize,letterSpacing:h(o.letterSpacing),lineHeight:h(o.lineHeight),fontWeight:U(o.fontName.style)},e},{}),l=e=>Math.round(e*255),H=e=>{var o;return`rgba(${l(e.color.r)}, ${l(e.color.g)}, ${l(e.color.b)}, ${(o=e.opacity)!=null?o:1})`},T=()=>figma.getLocalPaintStyles().reduce((e,o)=>{let t=N(o.name),r=o.paints[0];return r.type==="SOLID"&&(e[t]=H(r)),e},{})});var A={};O(A,{default:()=>L});function L(){m("CREATE_STYLES",()=>{let e=C(),o=T(),t=`

    declare module "@mui/material/styles" {
      interface TypographyVariants {
        ${Object.keys(e).map(i=>`${i}: React.CSSProperties`).join(`
`)}
      }
      interface TypographyVariantOptions {
        ${Object.keys(e).map(i=>`${i}: React.CSSProperties`).join(`
`)}
      }
    }

    declare module "@mui/material/Typography" {
      interface TypographyPropsVariantOverrides {
        ${Object.keys(e).map(i=>`${i}: true`).join(`
`)}
      }
    }
    `,r=`

    const figmaTypography = ${JSON.stringify(e,null,2)} as const
    `,n=`

    const figmaPalette = ${JSON.stringify(o,null,2)} as const

    `;console.log(o),p("GENERATED_STYLES",t+n+r)}),m("CLOSE",function(){figma.closePlugin()}),f({width:700,height:800})}var _=s(()=>{S();w()});var P={"src/main.ts--default":(_(),I(A)).default},R="src/main.ts--default";P[R]();})();
