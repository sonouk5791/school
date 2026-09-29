/* Room illustrations only; character and clothing assets remain untouched. */
(()=>{
const art={
f_bed:'<path d="M17 121V32h18v63h127v26M30 115v18m120-18v18" fill="#c8ad8a"/><rect x="33" y="65" width="126" height="40" rx="10" fill="#b0cbdc"/><rect x="37" y="58" width="40" height="22" rx="8" fill="#fff6e3"/><path d="M80 67v35" stroke="#e8f1ee"/>',
t_slide:'<path d="M42 125V35h46v90M43 59h40M43 83h40M43 105h40" stroke="#b59a75" stroke-width="7"/><path d="M83 35q10 40 52 78h30v15h-39Q79 79 69 35z" fill="#e8c87f"/>',
t_tent:'<path d="M13 126 90 14l77 112z" fill="#b1c8bd"/><path d="M90 14v112H50z" fill="#f2e5cb"/><path d="m90 45 38 81H90z" fill="#728b83"/>',
t_box:'<rect x="24" y="65" width="132" height="64" rx="8" fill="#dcc2a1"/><circle cx="58" cy="50" r="25" fill="#d5b1c0"/><path d="m87 64 17-44 33 39" fill="#b5c8a3"/><path d="M71 91h39"/>',
d_bone:'<path d="M47 64q-24-34-35-8q-7 17 13 27q-20 25 4 33q18 4 24-19h75q15 31 33 9q10-15-9-27q20-26-5-33q-16-2-23 18z" fill="#f1dfb5"/>',
d_carrot:'<path d="M53 45q32-23 66 2L70 130z" fill="#e6ae74"/><path d="M80 43 66 9m16 34 20-32M64 67l24 4m-14 22 13 3" stroke="#88a77c" stroke-width="7"/>',
d_star:'<path d="m90 14 20 39 43 5-31 31 7 42-39-20-39 20 7-42-31-31 43-5z" fill="#e7d08d"/>',
d_doghouse:'<path d="M29 66h122v64H29z" fill="#dfc398"/><path d="m15 68 75-54 75 54z" fill="#adbc97"/><path d="M66 130V95q24-38 48 0v35" fill="#9b8264"/>',
f_sofa:'<rect x="18" y="36" width="144" height="64" rx="18" fill="#a7b998"/><rect x="24" y="80" width="132" height="32" rx="10" fill="#c1ceb0"/><rect x="10" y="65" width="24" height="51" rx="10" fill="#91a681"/><rect x="146" y="65" width="24" height="51" rx="10" fill="#91a681"/><path d="M29 116v12m122-12v12"/><rect x="40" y="52" width="35" height="31" rx="9" fill="#eee1bb"/><path d="M90 43v35"/>',
f_chair:'<rect x="48" y="24" width="84" height="70" rx="20" fill="#b4c8ac"/><rect x="38" y="82" width="104" height="26" rx="9" fill="#cbd7bc"/><path d="M50 108l-7 22m88-22 7 22M36 65v33m108-33v33"/>',
f_table:'<ellipse cx="90" cy="74" rx="74" ry="22" fill="#dac4a2"/><path d="M36 84v43m108-43v43M86 92v33"/><ellipse cx="90" cy="68" rx="74" ry="19" fill="#eddbc0"/><path d="M68 54h23v12H68z" fill="#fff7e7"/><path d="M91 56q17-2 10 10H91"/>',
f_bookshelf:'<rect x="40" y="10" width="100" height="120" rx="5" fill="#c6a780"/><path d="M47 49h86M47 88h86"/><path d="M54 43V20h12v23m8 0V17h15v26m11 0-3-22h13l3 22" fill="#9fb4a4"/><path d="M54 82V57h17v25m8 0V60h12v22m12 0V57h19v25" fill="#cfaca0"/><rect x="51" y="98" width="78" height="24" rx="4" fill="#e8d9be"/>',
f_drawer:'<rect x="27" y="40" width="126" height="85" rx="6" fill="#d9c09b"/><path d="M30 67h120M30 96h120M78 55h24M78 82h24M78 110h24M40 125v7m100-7v7"/>',
p_tree:'<path d="M90 92V32" stroke="#72866a"/><ellipse cx="68" cy="38" rx="24" ry="13" transform="rotate(30 68 38)" fill="#9ab38b"/><ellipse cx="111" cy="28" rx="25" ry="14" transform="rotate(-30 111 28)" fill="#829f77"/><ellipse cx="112" cy="61" rx="23" ry="13" transform="rotate(-25 112 61)" fill="#b4c7a0"/><path d="M62 85h56l-9 46H72z" fill="#cfab8e"/>',
l_stand:'<ellipse cx="90" cy="128" rx="30" ry="6" fill="#c5b79e"/><path d="M90 51v75"/><path d="M63 16h54l19 46H44z" fill="#f3e6bd"/>',
c_knit:'<rect x="52" y="52" width="76" height="64" rx="19" fill="#e8d5b0"/><path d="M66 64v38m12-38v38m12-38v38m12-38v38m12-38v38" stroke="#d5bd96"/>',
pic_family:'<rect x="42" y="20" width="96" height="80" rx="3" fill="#d4b995"/><rect x="49" y="27" width="82" height="66" fill="#f8f2df"/><circle cx="107" cy="43" r="10" fill="#edcf8e"/><path d="m50 90 29-33 21 24 14-17 17 26" fill="#aac2a0"/>',
};
window.HouseFurnishings={draw(id){const shape=art[id]||(/^p_/.test(id)?art.p_tree:/^l_/.test(id)?art.l_stand:/^pic_/.test(id)?art.pic_family:null);return shape?`<svg viewBox="0 0 180 140" aria-hidden="true" fill="none" stroke="#927b60" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${shape}</svg>`:'';}};
})();
