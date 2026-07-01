/* ── PARTICLE CANVAS ────────────────────────────────────────────────── */
(function(){
    const canvas = document.getElementById('hero-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W,H,particles,mouse={x:-9999,y:-9999};

    /* Hint: hide once the user interacts or after 10s */
    const hint = document.getElementById('netHint');
    function hideHint(){ if(hint && !hint.classList.contains('is-hidden')) hint.classList.add('is-hidden'); }
    if (hint) {
        const hero = document.getElementById('home');
        if (hero) {
            hero.addEventListener('mousemove', hideHint, { once: true });
            hero.addEventListener('touchstart', hideHint, { once: true, passive: true });
        }
        setTimeout(hideHint, 10000);
    }
    const COLORS=['rgba(139,92,246,','rgba(59,130,246,','rgba(34,211,238,','rgba(99,102,241,'];
    const N=180, CONNECT=175, MOUSE_R=130;
    function resize(){
        const rect = canvas.parentElement.getBoundingClientRect();
        W=canvas.width=canvas.offsetWidth||window.innerWidth;
        H=canvas.height=canvas.offsetHeight||window.innerHeight;
    }
    function mk(){ const c=COLORS[Math.floor(Math.random()*COLORS.length)]; return {x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.75,vy:(Math.random()-.5)*.75,r:Math.random()*2+.9,c}; }
    function init(){ resize(); particles=Array.from({length:N},mk); }
    function draw(){
        ctx.clearRect(0,0,W,H);
        particles.forEach(p=>{
            const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<MOUSE_R){ const f=(MOUSE_R-d)/MOUSE_R*.016; p.vx+=dx*f; p.vy+=dy*f; }
            p.vx*=.995; p.vy*=.995; p.x+=p.vx; p.y+=p.vy;
            if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        });
        for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
            const a=particles[i],b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<CONNECT){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=a.c+(1-d/CONNECT)*.85+')'; ctx.lineWidth=1.3; ctx.stroke(); }
        }
        particles.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.c+'.8)'; ctx.shadowBlur=7; ctx.shadowColor=p.c+'.5)'; ctx.fill(); ctx.shadowBlur=0; });
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize',resize);
    const hero=document.getElementById('home');
    hero.addEventListener('mousemove',e=>{ const r=canvas.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; });
    hero.addEventListener('mouseleave',()=>{ mouse.x=-9999; mouse.y=-9999; });
    init(); draw();
})();

/* ── WINDOW CARDS FLY-IN ────────────────────────────────────────────── */
(function(){
    const delays = {winShell:900, winCode:1150, winExo:1420};
    Object.entries(delays).forEach(([id,ms])=>{
        const el=document.getElementById(id);
        if(!el) return;
        setTimeout(()=>el.classList.add('win-in'), ms);
    });
})();

/* ── WORD SPLIT REVEAL on section titles ────────────────────────────── */
(function(){
    function splitWords(el){
        const html = el.innerHTML;
        // wrap each text node word in spans, preserve HTML tags
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        let node;
        while(node = walker.nextNode()) textNodes.push(node);
        textNodes.forEach(tn=>{
            const words = tn.textContent.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            words.forEach(w=>{
                if(/^\s+$/.test(w)){ frag.appendChild(document.createTextNode(w)); return; }
                if(!w) return;
                const wrap = document.createElement('span');
                wrap.className='word-wrap';
                const inner = document.createElement('span');
                inner.className='word-inner';
                inner.textContent=w;
                wrap.appendChild(inner);
                frag.appendChild(wrap);
            });
            tn.parentNode.replaceChild(frag,tn);
        });
    }

    const titleObs = new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(!e.isIntersecting) return;
            const inners = e.target.querySelectorAll('.word-inner');
            inners.forEach((w,i)=>setTimeout(()=>w.classList.add('word-in'), i*60));
            titleObs.unobserve(e.target);
        });
    },{threshold:.3});

    document.querySelectorAll('.s-title').forEach(el=>{
        splitWords(el);
        titleObs.observe(el);
    });
})();


 
/* SCROLL PROGRESS */
window.addEventListener('scroll',()=>{
    document.getElementById('spbar').style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%';
});
 
/* NAV TOGGLE */
function toggleNav(){document.getElementById('navLinks').classList.toggle('open');}
function closeNav(){document.getElementById('navLinks').classList.remove('open');}
 
/* TYPEWRITER */
const phrases=['Mechatronics Engineering','Robotics','Leadership','First Year'];
let pi=0,ci=0,del=false;
const tw=document.getElementById('tw');
function type(){
    const w=phrases[pi];
    if(!del){tw.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(type,1900);return;}}
    else    {tw.textContent=w.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phrases.length;}}
    setTimeout(type,del?50:95);
}
setTimeout(type,1400);
 
/* COUNTER */
function animCount(el){
    const t=parseInt(el.dataset.count); if(isNaN(t))return;
    let c=0; const step=Math.ceil(t/60);
    (function tick(){c=Math.min(c+step,t);el.textContent=c;if(c<t)requestAnimationFrame(tick);})();
}
 
/* SCROLL REVEAL */
const ro=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.classList.add('visible');
            e.target.querySelectorAll('[data-count]').forEach(animCount);
            e.target.querySelectorAll('.wip-fill').forEach(b=>{b.style.width=b.dataset.pct+'%';});
        }
    });
},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
 
/* Hero stats counter on visible */
const heroObs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting) entries[0].target.querySelectorAll('[data-count]').forEach(animCount);
},{threshold:.5});
document.querySelectorAll('.hero-stats').forEach(el=>heroObs.observe(el));
 
/* PORTFOLIO FILTER */
document.querySelectorAll('.flt').forEach(btn=>{
    btn.addEventListener('click',()=>{
        document.querySelectorAll('.flt').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f=btn.dataset.f;
        document.querySelectorAll('.pcard').forEach(c=>{c.style.display=(f==='all'||c.dataset.cat===f)?'':'none';});
    });
});
 
/* 3D TILT */
document.querySelectorAll('.pcard').forEach(card=>{
    card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translateY(-8px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
});

/* CERT MODAL */
function openModal(src,cap){
    if (window.event) event.preventDefault();
    const box=document.getElementById('modalBox');
    const cnt=document.getElementById('modalContent');
    const isPdf=src.endsWith('.pdf');
    box.style.maxWidth=isPdf?'960px':'860px';
    cnt.innerHTML=isPdf
        ?`<iframe src="${src}" style="width:100%;height:80vh;border:none;display:block;border-radius:12px 12px 0 0;"></iframe>`
        :`<img src="${src}" alt="${cap}" style="width:100%;display:block;max-height:80vh;object-fit:contain;background:#000;border-radius:12px 12px 0 0;">`;
    document.getElementById('modalCap').textContent=cap;
    document.getElementById('certModal').classList.add('open');
    document.body.style.overflow='hidden';
}
function closeModal(){
    document.getElementById('certModal').classList.remove('open');
    document.getElementById('modalContent').innerHTML='';
    document.body.style.overflow='';
}
document.getElementById('certModal').addEventListener('click',e=>{if(e.target.id==='certModal')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* CHATBOT */
(function(){
    var KB = [
        {
            keys: ['wcr', 'west coast', 'robotics', 'co-op', 'lely', 'discovery', 'milking', 'manure', 'crash', 'bracket', 'power bi', 'optimization', 'analytics', 'coop', 'bc'],
            answer: "🤖 Spent my first co-op at <strong>West Coast Robotics</strong> in Agassiz, BC:<br>• <strong>Root-Cause Optimization:</strong> Reduced autonomous robot crashes from 4+/day to target by designing custom brush brackets using SolidWorks CAD & machine shop tools.<br>• <strong>Data Infrastructure:</strong> Programmed Power BI dashboards identifying over $2.9M in overstock/deadstock capital and mapping optimal field routes.<br>• <strong>Field Deployments:</strong> Co-installed Lely A5 milking systems and set up complex 360 Rain irrigation machinery."
        },
        {
            keys: ['arcade', 'cabinet', 'game', 'engine', 'unity', 'c#', 'wood', 'milled', 'milling', 'wiring', 'laser', 'lightburn', 'joystick', 'custom'],
            answer: "🕹️ Built a fully operational <strong>Custom Arcade Cabinet & Game Engine</strong>:<br>• <strong>Fabrication:</strong> Milled 10+ custom wood components using miter, jigsaw, and routers, plus laser-cut components via Lightburn.<br>• <strong>Hardware:</strong> Soldered customized wiring harnesses to link joysticks, microswitches, an internal PC, and a monitor.<br>• <strong>Software:</strong> Programmed the game using C# and Unity with data-driven architecture, played by 300+ people at competitive showcases."
        },
        {
            keys: ['vex', 'car', 'drivetrain', 'chassis', 'metal', 'motor', 'gears', 'intake', 'lift', 'mechanism'],
            answer: "🤖 Developed a <strong>VEX Robot</strong>:<br>• <strong>Chassis Design:</strong> Built a high-mobility robot chassis with custom structural metal layouts and optimized high-torque gear profiles.<br>• <strong>Subsystems:</strong> Integrated dynamic physical intake and mechanical lifting subsystems, configuring motor boundaries to eliminate binding."
        },
        {
            keys: ['baja', 'sae', 'suspension', 'fea', 'simulation', 'solidworks', 'control arm', 'wbs', 'gantt', 'sponsorship'],
            answer: "🏎️ Active on the <strong>University of Waterloo Baja SAE Team</strong> (Operations & Dynamics):<br>• <strong>Simulation:</strong> Executing SolidWorks Finite Element Analysis (FEA) on front control arm configurations to check safety factors.<br>• <strong>Project Management:</strong> Co-developing Work Breakdown Structures (WBS) and engineering Gantt charts, alongside boosting operational budgets via corporate sponsorship outreach."
        },
        {
            keys: ['first', '9465', 'axolotls', 'captain', 'driver', 'roborio', 'andymark', 'climbing', 'arm', 'stem', 'presentation', 'outreach'],
            answer: "🤖 Team Captain & Primary Driver for <strong>FIRST Robotics Club 9465 (Imagine Axolotls)</strong>:<br>• <strong>Technical Build:</strong> Wired RoboRIO platforms, managed AndyMark mechanical architectures, and built a custom high-success climbing arm.<br>• <strong>Competitive Record:</strong> Handled rapid pit repairs and drove through 11 high-stakes matches to finish 21st out of 48 teams at Pacific Regionals.<br>• <strong>Outreach:</strong> Delivered live-telemetry presentations to 200+ prospective students at SFU and UW to scale STEM interest."
        },
        {
            keys: ['skill', 'know', 'language', 'python', 'c#', 'c++', 'unity', 'solidworks', 'cad', 'fea', 'power bi', 'excel', 'machining', 'laser', 'soldering', 'wiring'],
            answer: "My core engineering competencies:<br><strong>Software & Analytics:</strong> C#, C++, Python, Unity Engine, Power BI, Advanced Excel Analytics.<br><strong>CAD & Simulation:</strong> SolidWorks CAD, SolidWorks FEA Structural Simulation, AutoCAD.<br><strong>Fabrication & Shop:</strong> UW Machine Shop Certified, Custom Wiring Design, Lightburn Laser Cutting, Industrial Milling/Lathes, Saws, Tooling, Soldering."
        },
        {
            keys: ['leadership', 'service club', 'president', 'government', 'grad committee', 'fundraiser', 'cyrus', 'wilma', 'volunteer', 'hours'],
            answer: "🌟 Community Impact & Student Leadership profile:<br>• <strong>Service Club (Founder & President):</strong> Spearheaded local drives raising $2,100+ for the Cyrus Centre youth shelter and Wilma's Transition House, and logged 250+ community service hours.<br>• <strong>Student Government (President / Co-President):</strong> Managed senior class operational budgets and structural event logistics for 100+ grads, organized orientation programs, and ran general election poll setups."
        },
        {
            keys: ['engsoc', 'class rep', 'representative', 'society', 'waterloo engineering'],
            answer: "⚙️ Elected <strong>Class Representative for the UW Engineering Society (EngSoc)</strong>. Review and vote on institutional motions, funding layouts, and constitutional policies while engineering structured feedback surveys for the Mechatronics cohort."
        },
        {
            keys: ['education', 'study', 'school', 'waterloo', 'uw', 'imagine', 'degree', 'mechatronics', 'university', 'valedictorian', 'basc'],
            answer: "🎓 <strong>Academic Framework:</strong><br>• <strong>University of Waterloo:</strong> Bachelor of Applied Science (BASc) in Mechatronics Engineering (Honours Co-op Track, Class of 2030).<br>• <strong>Imagine High Secondary:</strong> Graduated as High School Class Valedictorian, specializing in Integrated Arts & Technology."
        },
        {
            keys: ['internship', 'hire', 'job', 'coop', 'co-op', 'opportunity', 'open', 'available', 'recruit', 'looking', 'winter', '2027'],
            answer: "💼 Yes! I am actively seeking <strong>Mechatronics Engineering Co-op positions for the Winter 2027 term</strong>. I am eager to apply my diverse technical fabrication, hardware automation, and analytical dataset skills to a forward-thinking team. Reach me at <a href='mailto:tmbrown@uwaterloo.ca' style='color:#38bdf8'>tmbrown@uwaterloo.ca</a>!"
        },
        {
            keys: ['contact', 'email', 'linkedin', 'github', 'reach', 'find', 'social', 'connect'],
            answer: "Let's connect! Best routes to reach me:<br>• Email: <a href='mailto:tmbrown@uwaterloo.ca' style='color:#38bdf8'>tmbrown@uwaterloo.ca</a><br>• LinkedIn: <a href='https://linkedin.com/in/tamika-brown-' target='_blank' style='color:#38bdf8'>tamika-brown-</a><br>• GitHub: <a href='https://github.com/tmbrown32' target='_blank' style='color:#38bdf8'>tmbrown32</a>"
        },
        {
            keys: ['who', 'about', 'yourself', 'you', 'tamika', 'name', 'intro', 'tell me', 'hello', 'hi', 'hey'],
            answer: "Hey there! I'm <strong>Tamika Brown</strong>, a Mechatronics Engineering student at the University of Waterloo. I have hands-on experience optimizing field robotics at West Coast Robotics, building custom arcade hardware, engineering FEA models for UW Baja SAE, and leading service organizations. Ask me about my engineering work or upcoming Winter 2027 co-op targets!"
        },
        {
            keys: ['cv', 'resume', 'pdf', 'download'],
            answer: "You can open and read my complete technical resume here: <a href='assets/documents/cv.pdf' target='_blank' style='color:#38bdf8'>Open Resume PDF →</a>"
        },
        {
            keys: ['karate', 'black belt', 'martial arts', 'dan', 'tournament', 'sparring', 'kata', 'weapons', 'judge'],
            answer: "🥋 Earned my <strong>1st Dan Black Belt</strong> at Chilliwack Central Karate Club in May 2024 after over a decade of discipline. Competed across 13 distinct provincial championships (winning multiple Gold, Silver, and Bronze medals in sparring/weapons) and served as a certified regional Ring Judge."
        }
    ];

    var FALLBACKS = [
        "Not sure about that — try asking about my <strong>West Coast Robotics co-op</strong>, <strong>arcade machine project</strong>, <strong>engineering skills</strong>, or my availability for <strong>Winter 2027 co-op opportunities</strong>!",
        "That falls outside my immediate knowledge base. Try checking: 'Tell me about your FIRST Robotics experience' or 'What skills do you have?'.",
        "No direct answer found in my database. Feel free to shoot me an email directly at <a href='mailto:tmbrown@uwaterloo.ca' style='color:#38bdf8'>tmbrown@uwaterloo.ca</a>!"
    ];
})();
    var fallbackIdx = 0;
    var chatOpen = false;
    var greeted = false;

    var win   = document.getElementById('chatWindow');
    var msgs  = document.getElementById('chatMessages');
    var inputEl = document.getElementById('chatInput');
    var tip   = document.getElementById('chatTip');
    var btnEl = document.getElementById('chatbotBtn');
    var chips = document.getElementById('chatChips');

    if(tip) setTimeout(function(){ tip.style.opacity='0'; setTimeout(function(){ tip.style.display='none'; },400); }, 5000);

    function toggleChat(){
        chatOpen = !chatOpen;
        if(win) win.classList.toggle('open', chatOpen);
        if(btnEl){
            btnEl.querySelector('.chat-icon-open').style.display  = chatOpen ? 'none' : '';
            btnEl.querySelector('.chat-icon-close').style.display = chatOpen ? ''     : 'none';
        }
        if(tip) tip.style.display='none';
        if(chatOpen && !greeted){
            greeted = true;
            setTimeout(function(){ addBot("Hey! I'm a quick chatbot version of Tamika. Ask me about my projects, skills, competitions, or whether I'm open to work \u2014 I'll do my best to answer!"); }, 350);
        }
        if(chatOpen) setTimeout(function(){ if(inputEl) inputEl.focus(); }, 400);
    }

    function addMsg(html, role){
        var wrap = document.createElement('div');
        wrap.className = 'chat-msg ' + role;
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = html;
        wrap.appendChild(bubble);
        msgs.appendChild(wrap);
        msgs.scrollTop = msgs.scrollHeight;
        return wrap;
    }

    function addBot(html){
        var typing = document.createElement('div');
        typing.className = 'chat-msg bot';
        typing.innerHTML = '<div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
        msgs.appendChild(typing);
        msgs.scrollTop = msgs.scrollHeight;
        var delay = 600 + Math.min(html.length * 1.5, 800);
        setTimeout(function(){
            if(msgs.contains(typing)) msgs.removeChild(typing);
            addMsg(html, 'bot');
        }, delay);
    }

    function respond(text){
        var lower = text.toLowerCase();
        for(var i=0; i<KB.length; i++){
            var entry = KB[i];
            for(var j=0; j<entry.keys.length; j++){
                if(lower.indexOf(entry.keys[j]) !== -1){
                    return entry.answer;
                }
            }
        }
        var fb = FALLBACKS[fallbackIdx % FALLBACKS.length];
        fallbackIdx++;
        return fb;
    }

    function send(text){
        var trimmed = text.trim();
        if(!trimmed) return;
        addMsg(trimmed, 'user');
        if(chips) chips.style.display = 'none';
        addBot(respond(trimmed));
    }

    function handleChatSubmit(e){
        e.preventDefault();
        if(!inputEl) return;
        var val = inputEl.value;
        inputEl.value = '';
        send(val);
    }

    function sendChip(el){
        send(el.textContent.trim());
    }

    window.toggleChat       = toggleChat;
    window.handleChatSubmit = handleChatSubmit;
    window.sendChip         = sendChip;
})();
