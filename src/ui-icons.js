'use strict';
const paths={play:'<path d="m9 5 11 7-11 7Z"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',history:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2"/>',check:'<path d="m6 12 4 4 8-9"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>'};
function icon(name){const template=document.createElement('template');template.innerHTML='<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths[name]+'</svg>';return template.content.firstChild}
module.exports={icon};
