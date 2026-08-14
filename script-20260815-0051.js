const baseRecipe={flour:6000,sugar:290,salt:136,yeast:60,water:3700,oil:360,potato:2600};
const totalBaseWeight=Object.values(baseRecipe).reduce((a,b)=>a+b,0);
const almondRecipe={butter:1500,sugar:1125,eggs:20,almondMeal:1665,cornflour:250,plainFlour:500,bakingPowder:30};
const eggWhitePerUnit=35,eggYolkPerUnit=25,eggTotalPerUnit=60;
const almondBaseKnownWeight=1500+1125+(20*60)+1665+250+500+30;

const sections=document.querySelectorAll(".app-section"),navButtons=document.querySelectorAll("[data-nav]"),mainNavButtons=document.querySelectorAll(".nav-btn");
const mainNav=document.getElementById("mainNav"),menuBtn=document.getElementById("menuBtn");
function showSection(id){sections.forEach(s=>s.classList.toggle("active",s.id===id));mainNavButtons.forEach(b=>b.classList.toggle("active",b.dataset.nav===id));mainNav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false");window.scrollTo({top:0,behavior:"smooth"});}
navButtons.forEach(btn=>btn.addEventListener("click",()=>{showSection(btn.dataset.nav);if(btn.classList.contains("almond-calc-jump"))showCalculatorPage("almond-calculator");}));
menuBtn.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".subnav-btn").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll(".subnav-btn").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".recipe-page").forEach(x=>x.classList.remove("active"));tab.classList.add("active");document.getElementById(tab.dataset.recipePage).classList.add("active");}));
function showCalculatorPage(id){document.querySelectorAll(".calc-tab").forEach(t=>t.classList.toggle("active",t.dataset.calculator===id));document.querySelectorAll(".calculator-page").forEach(p=>p.classList.toggle("active",p.id===id));}
document.querySelectorAll(".calc-tab").forEach(t=>t.addEventListener("click",()=>showCalculatorPage(t.dataset.calculator)));

function formatWeight(g,u="g"){return u==="kg"?`${(g/1000).toLocaleString(undefined,{maximumFractionDigits:3})} kg`:`${Math.round(g).toLocaleString()} g`;}

/* Focaccia */
const ingredient=document.getElementById("ingredientSelect"),target=document.getElementById("targetWeight"),unit=document.getElementById("unitSelect"),msg=document.getElementById("calcMessage"),multi=document.getElementById("multiplier"),total=document.getElementById("totalWeight");
const output={flour:document.getElementById("out-flour"),sugar:document.getElementById("out-sugar"),salt:document.getElementById("out-salt"),yeast:document.getElementById("out-yeast"),water:document.getElementById("out-water"),oil:document.getElementById("out-oil"),potato:document.getElementById("out-potato")};
const water80=document.getElementById("out-water80"),water20=document.getElementById("out-water20");
function renderFocaccia(m=1){for(const[k,b]of Object.entries(baseRecipe))output[k].textContent=formatWeight(b*m,unit.value);const w=baseRecipe.water*m;water80.textContent=formatWeight(w*.8,unit.value);water20.textContent=formatWeight(w*.2,unit.value);total.textContent=formatWeight(totalBaseWeight*m,unit.value);multi.textContent=`×${m.toFixed(3)}`;}
function calculateFocaccia(){let v=Number(target.value);if(!Number.isFinite(v)||v<=0){msg.textContent="请输入大于 0 的目标重量。";target.focus();return;}if(unit.value==="kg")v*=1000;const m=v/baseRecipe[ingredient.value];renderFocaccia(m);msg.textContent=`已按 ${ingredient.options[ingredient.selectedIndex].text} 作为基准完成换算。`;}
document.getElementById("calculateBtn").addEventListener("click",calculateFocaccia);document.getElementById("resetBtn").addEventListener("click",()=>{ingredient.value="flour";target.value="";unit.value="g";renderFocaccia(1);msg.textContent="请输入重量开始计算。";});
target.addEventListener("keydown",e=>{if(e.key==="Enter")calculateFocaccia();});unit.addEventListener("change",()=>renderFocaccia(Number(multi.textContent.replace("×",""))||1));
document.querySelectorAll("[data-quick]").forEach(b=>b.addEventListener("click",()=>{unit.value="g";target.value=b.dataset.quick;calculateFocaccia();}));

/* Almond Cream */
const ai=document.getElementById("almondIngredientSelect"),at=document.getElementById("almondTargetWeight"),au=document.getElementById("almondUnitSelect"),al=document.getElementById("almondTargetLabel"),am=document.getElementById("almondCalcMessage"),amul=document.getElementById("almondMultiplier"),atotal=document.getElementById("almondTotalWeight");
const ao={butter:document.getElementById("almond-out-butter"),sugar:document.getElementById("almond-out-sugar"),almondMeal:document.getElementById("almond-out-almondMeal"),cornflour:document.getElementById("almond-out-cornflour"),plainFlour:document.getElementById("almond-out-plainFlour"),bakingPowder:document.getElementById("almond-out-bakingPowder")};
const aEgg=document.getElementById("almond-out-eggs"),aWhite=document.getElementById("almond-out-white"),aYolk=document.getElementById("almond-out-yolk"),aVanilla=document.getElementById("almond-out-vanilla");
function syncAlmondInput(){const egg=ai.value==="eggs";al.textContent=egg?"目标鸡蛋数量":"目标重量";at.placeholder=egg?"例如：20":"例如：1500";au.disabled=egg;au.innerHTML=egg?'<option value="unit">units</option>':'<option value="g">g</option><option value="kg">kg</option>';}
function renderAlmond(m=1){const displayUnit=ai.value==="eggs"?"g":(au.value==="unit"?"g":au.value);ao.butter.textContent=formatWeight(almondRecipe.butter*m,displayUnit);ao.sugar.textContent=formatWeight(almondRecipe.sugar*m,displayUnit);ao.almondMeal.textContent=formatWeight(almondRecipe.almondMeal*m,displayUnit);ao.cornflour.textContent=formatWeight(almondRecipe.cornflour*m,displayUnit);ao.plainFlour.textContent=formatWeight(almondRecipe.plainFlour*m,displayUnit);ao.bakingPowder.textContent=formatWeight(almondRecipe.bakingPowder*m,displayUnit);const eggs=almondRecipe.eggs*m;aEgg.textContent=`${eggs.toLocaleString(undefined,{maximumFractionDigits:2})} units · ${Math.round(eggs*60).toLocaleString()} g`;aWhite.textContent=`${Math.round(eggs*35).toLocaleString()} g`;aYolk.textContent=`${Math.round(eggs*25).toLocaleString()} g`;aVanilla.textContent=`${m.toLocaleString(undefined,{maximumFractionDigits:2})} spoon`;atotal.textContent=`${Math.round(almondBaseKnownWeight*m).toLocaleString()} g`;amul.textContent=`×${m.toFixed(3)}`;}
function calculateAlmond(){let v=Number(at.value);if(!Number.isFinite(v)||v<=0){am.textContent="请输入大于 0 的目标用量。";at.focus();return;}let m;if(ai.value==="eggs"){m=v/20;}else{if(au.value==="kg")v*=1000;m=v/almondRecipe[ai.value];}renderAlmond(m);am.textContent=`已按 ${ai.options[ai.selectedIndex].text} 作为基准完成换算。鸡蛋按每个 60 g（蛋白 35 g + 蛋黄 25 g）计算。`;}
ai.addEventListener("change",()=>{syncAlmondInput();renderAlmond(Number(amul.textContent.replace("×",""))||1);});au.addEventListener("change",()=>renderAlmond(Number(amul.textContent.replace("×",""))||1));at.addEventListener("keydown",e=>{if(e.key==="Enter")calculateAlmond();});
document.getElementById("almondCalculateBtn").addEventListener("click",calculateAlmond);document.getElementById("almondResetBtn").addEventListener("click",()=>{ai.value="butter";syncAlmondInput();au.value="g";at.value="";renderAlmond(1);am.textContent="基础配方：20 个鸡蛋；每个按 35 g 蛋白 + 25 g 蛋黄计算。";});

syncAlmondInput();renderFocaccia(1);renderAlmond(1);
