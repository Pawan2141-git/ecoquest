// Mock user state (replace via API)
let userPoints = 1240;

// Sample rewards (swap with backend response)
const rewards = [
    { 
        id:1, 
        name:"Cloth Tote Bag", 
        type:"product", 
        points:800,  
        tags:["Reusable","Plastic-free"], 
        img:"TOTE" 
    },
    { 
        id:2, 
        name:"Steel Water Bottle", 
        type:"product", 
        points:1500, 
        tags:["Durable","Refill"], 
        img:"BOTTLE" 
    },
    { 
        id:3, 
        name:"10% Off • EcoBrand", 
        type:"coupon", 
        points:600,  
        tags:["Discount","Brand"], 
        img:"COUPON" 
    },
    { 
        id:4, 
        name:"Sapling Kit", 
        type:"product", 
        points:1200, 
        tags:["Tree kit","Home"], 
        img:"SAPLING" 
    },
    { 
        id:5, 
        name:"NGO Clean-up Drive", 
        type:"experience", 
        points:1000, 
        tags:["Field trip","Community"], 
        img:"NGO" 
    },
    { 
        id:6, 
        name:"Recycling Guide Poster", 
        type:"product", 
        points:300, 
        tags:["Print","Awareness"], 
        img:"POSTER" 
    },
    { 
        id:7, 
        name:"Upcycled Notebook", 
        type:"product", 
        points:700, 
        tags:["Recycled"], 
        img:"NOTE" 
    },
    { 
        id:8, 
        name:"15% Off • EcoBrand+", 
        type:"coupon", 
        points:1100, 
        tags:["Discount"], 
        img:"COUPON+" 
    },
    { 
        id:9, 
        name:"Campus Tree Planting", 
        type:"experience", 
        points:900, 
        tags:["On-campus"], 
        img:"TREE" 
    }
];

const $ = (q)=>document.querySelector(q);
const $$ = (q)=>Array.from(document.querySelectorAll(q));

const catalog = $("#catalog");
const filter = $("#filter");
const sort = $("#sort");
const search = $("#search");
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalCost = $("#modalCost");
const confirmRedeem = $("#confirmRedeem");
const pointsEl = $("#points");
const progressEl = $("#progressBar");

function fmt(n){ 
    return n.toLocaleString() 
}

function renderCards(){
    const q = (search.value || "").toLowerCase();
    let list = rewards.filter(r =>
    (filter.value === "all" || r.type === filter.value) &&
    (r.name.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)))
    );

    const [k, dir] = sort.value.split("-");
    list.sort((a,b)=>{
    if(k === "points") return dir === "asc" ? a.points-b.points : b.points-a.points;
    return a.name.localeCompare(b.name);
    });

    catalog.innerHTML = list.map(r=>card(r)).join("");
    attachCardEvents();
}

function card(r){
    const affordable = userPoints >= r.points;
    return `
    <article class="card" data-id="${r.id}">
        <div class="img">${r.img}</div>
        <div class="body">
        <div class="row">
            <h3 style="margin:0;font-size:16px">${r.name}</h3>
            <span class="price">${fmt(r.points)}</span>
        </div>
        <div style="margin:10px 0 12px 0">${r.tags.map(t=>`<span class="tag">${t}</span>`).join(" ")}</div>
        <div class="row">
            <button class="btn redeem" ${affordable? "" : "disabled"}>Redeem</button>
            <button class="btn ghost details">Details</button>
        </div>
        </div>
    </article>
    `;
}

function attachCardEvents(){
    $$(".redeem").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
        const id = +e.target.closest(".card").dataset.id;
        openRedeem(id);
    });
    });
    $$(".details").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
        const id = +e.target.closest(".card").dataset.id;
        openDetails(id);
    });
    });
}

function openRedeem(id){
    const r = rewards.find(x=>x.id===id);
    modalTitle.textContent = "Redeem • " + r.name;
    modalDesc.textContent  = "You’re about to redeem this reward. Codes/Instructions will be issued right after confirmation.";
    modalCost.textContent  = fmt(r.points);
    confirmRedeem.onclick = ()=> doRedeem(r);
    modal.showModal();
}
function openDetails(id){
    const r = rewards.find(x=>x.id===id);
    modalTitle.textContent = r.name;
    modalDesc.textContent  = `${r.type.toUpperCase()} • ${r.tags.join(", ")}. This reward aligns with EcoQuest’s sustainable actions and partnerships.`;
    modalCost.textContent  = fmt(r.points);
    confirmRedeem.onclick = ()=> doRedeem(r);
    modal.showModal();
}
function closeModal(){ modal.close() }
window.closeModal = closeModal;

function doRedeem(r){
    if(userPoints < r.points){ alert("Not enough EcoPoints yet."); return }
    userPoints -= r.points;
    pointsEl.textContent = fmt(userPoints);
    progressEl.style.width = Math.min(100, (userPoints/1500)*100) + "%";
    closeModal();
    alert("Redeemed! Check your Rewards → My Redemptions for the code or instructions.");
    renderCards();
    // TODO: POST /api/rewards/redeem with { rewardId: r.id }
}

// Events
[filter, sort, search].forEach(el=> el.addEventListener("input", renderCards));
$("#viewBadges").addEventListener("click", ()=> alert("Coming soon: Badge gallery & shareable certificates."));
// Init
pointsEl.textContent = fmt(userPoints);
renderCards();