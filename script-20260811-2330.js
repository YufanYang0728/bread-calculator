
const baseRecipe = { flour:6000, sugar:290, salt:136, yeast:60, water:3700, oil:360, potato:2600 };
const totalBaseWeight = Object.values(baseRecipe).reduce((a,b)=>a+b,0);

const sections = document.querySelectorAll(".app-section");
const navButtons = document.querySelectorAll("[data-nav]");
const mainNavButtons = document.querySelectorAll(".nav-btn");
const mainNav = document.getElementById("mainNav");
const menuBtn = document.getElementById("menuBtn");

function showSection(id){
  sections.forEach(section => section.classList.toggle("active", section.id === id));
  mainNavButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.nav === id));
  mainNav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"smooth"});
}
navButtons.forEach(btn => btn.addEventListener("click", () => showSection(btn.dataset.nav)));

menuBtn.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".subnav-btn").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".subnav-btn").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".recipe-page").forEach(x => x.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.recipePage).classList.add("active");
  });
});

const ingredient = document.getElementById("ingredientSelect");
const target = document.getElementById("targetWeight");
const unit = document.getElementById("unitSelect");
const msg = document.getElementById("calcMessage");
const multi = document.getElementById("multiplier");
const total = document.getElementById("totalWeight");

const output = {
  flour:document.getElementById("out-flour"),
  sugar:document.getElementById("out-sugar"),
  salt:document.getElementById("out-salt"),
  yeast:document.getElementById("out-yeast"),
  water:document.getElementById("out-water"),
  oil:document.getElementById("out-oil"),
  potato:document.getElementById("out-potato")
};
const water80 = document.getElementById("out-water80");
const water20 = document.getElementById("out-water20");

function formatWeight(grams){
  if(unit.value === "kg"){
    return `${(grams/1000).toLocaleString(undefined,{maximumFractionDigits:3})} kg`;
  }
  return `${Math.round(grams).toLocaleString()} g`;
}

function render(multiplier=1){
  for(const [key,base] of Object.entries(baseRecipe)){
    output[key].textContent = formatWeight(base*multiplier);
  }
  const water = baseRecipe.water*multiplier;
  water80.textContent = formatWeight(water*0.8);
  water20.textContent = formatWeight(water*0.2);
  total.textContent = formatWeight(totalBaseWeight*multiplier);
  multi.textContent = `×${multiplier.toFixed(3)}`;
}

function calculate(){
  let entered = Number(target.value);
  if(!Number.isFinite(entered) || entered <= 0){
    msg.textContent = "请输入大于 0 的目标重量。";
    target.focus();
    return;
  }
  if(unit.value === "kg") entered *= 1000;
  const multiplier = entered / baseRecipe[ingredient.value];
  render(multiplier);
  msg.textContent = `已按 ${ingredient.options[ingredient.selectedIndex].text} 作为基准完成换算。`;
}

document.getElementById("calculateBtn").addEventListener("click", calculate);
document.getElementById("resetBtn").addEventListener("click", () => {
  ingredient.value = "flour";
  target.value = "";
  unit.value = "g";
  render(1);
  msg.textContent = "请输入重量开始计算。";
  target.focus();
});
target.addEventListener("keydown", e => { if(e.key === "Enter") calculate(); });
unit.addEventListener("change", () => {
  const current = Number(multi.textContent.replace("×","")) || 1;
  render(current);
});
document.querySelectorAll("[data-quick]").forEach(btn => {
  btn.addEventListener("click", () => {
    unit.value = "g";
    target.value = btn.dataset.quick;
    calculate();
  });
});

render(1);
