const recipe = [
  { key: "flour", name: "Bread Flour", zh: "面包粉", base: 6000 },
  { key: "sugar", name: "Sugar", zh: "糖", base: 290 },
  { key: "salt", name: "Salt", zh: "盐", base: 136 },
  { key: "yeast", name: "Yeast", zh: "酵母", base: 60 },
  { key: "water", name: "Warm Water", zh: "温水", base: 3700, split: true },
  { key: "oil", name: "Oil", zh: "油", base: 360 },
  { key: "potato", name: "Hash Potato", zh: "土豆", base: 2600 },
];

const ingredientSelect = document.getElementById("ingredientSelect");
const amountInput = document.getElementById("amountInput");
const unitSelect = document.getElementById("unitSelect");
const results = document.getElementById("results");
const scaleValue = document.getElementById("scaleValue");
const totalValue = document.getElementById("totalValue");
const resetBtn = document.getElementById("resetBtn");

recipe.forEach(item => {
  const option = document.createElement("option");
  option.value = item.key;
  option.textContent = `${item.name} / ${item.zh}`;
  ingredientSelect.appendChild(option);
});

ingredientSelect.value = "potato";

function toGrams(value, unit) {
  return unit === "kg" ? value * 1000 : value;
}

function formatWeight(grams, displayUnit) {
  if (!Number.isFinite(grams)) return "—";
  if (displayUnit === "kg") {
    return `${(grams / 1000).toFixed(3).replace(/\.000$/, "")} kg`;
  }
  return `${Math.round(grams)} g`;
}

function calculate() {
  const selected = recipe.find(x => x.key === ingredientSelect.value);
  const raw = parseFloat(amountInput.value);
  const inputGrams = toGrams(raw, unitSelect.value);
  const scale = raw > 0 ? inputGrams / selected.base : 1;

  scaleValue.textContent = `×${scale.toFixed(3)}`;

  let total = 0;
  results.innerHTML = "";

  recipe.forEach(item => {
    const grams = item.base * scale;
    total += grams;

    if (item.split) {
      const wrapper = document.createElement("div");
      wrapper.className = "water-group";
      wrapper.innerHTML = `
        <div class="result-row">
          <div>
            <div class="result-name">${item.name} / ${item.zh}</div>
            <div class="result-sub">总加水量</div>
          </div>
          <div class="result-value">${formatWeight(grams, unitSelect.value)}</div>
        </div>
        <div class="water-split">
          <span>第一次加水 80%</span>
          <strong>${formatWeight(grams * 0.8, unitSelect.value)}</strong>
        </div>
        <div class="water-split">
          <span>第二次加水 20%</span>
          <strong>${formatWeight(grams * 0.2, unitSelect.value)}</strong>
        </div>`;
      results.appendChild(wrapper);
      return;
    }

    const row = document.createElement("div");
    row.className = "result-row";
    row.innerHTML = `
      <div>
        <div class="result-name">${item.name} / ${item.zh}</div>
        <div class="result-sub">基础 ${item.base} g</div>
      </div>
      <div class="result-value">${formatWeight(grams, unitSelect.value)}</div>`;
    results.appendChild(row);
  });

  totalValue.textContent = formatWeight(total, unitSelect.value);
}

function reset() {
  ingredientSelect.value = "potato";
  amountInput.value = "";
  unitSelect.value = "g";
  calculate();
  amountInput.focus();
}

ingredientSelect.addEventListener("change", calculate);
amountInput.addEventListener("input", calculate);
unitSelect.addEventListener("change", calculate);
resetBtn.addEventListener("click", reset);

calculate();
