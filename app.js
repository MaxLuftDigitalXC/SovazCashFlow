/**
 * SOVAZ App Controller
 */

import { runProjection, DEFAULT_PRODUCTS, DEFAULT_SCENARIOS } from './engine.js';
import { updateChart } from './charts.js';
import { translations, translateProduct, translateMonth } from './i18n.js';

// State Management
let scenarios = [];
let currentScenario = null;
let projectionResults = null;
let activeChartTab = 'cash';
let activeGridTab = 'all'; // 'all' or product IDs: 'prod-1', 'prod-2', etc.
let selectedProductIdToEdit = 'prod-1';
let currentLanguage = localStorage.getItem('sovaz_lang') || 'en';

// Elements
const selectScenario = document.getElementById('scenario-select');
const btnClone = document.getElementById('btn-clone-scenario');
const btnNew = document.getElementById('btn-new-scenario');
const btnDelete = document.getElementById('btn-delete-scenario');
const btnReset = document.getElementById('btn-reset-defaults');
const btnExport = document.getElementById('btn-export');
const btnImportTrigger = document.getElementById('btn-import-trigger');
const fileImport = document.getElementById('file-import');
const selectLang = document.getElementById('lang-select');

// Scenario Metadata Inputs
const inputScenarioName = document.getElementById('input-scenario-name');
const inputScenarioDesc = document.getElementById('input-scenario-desc');

// Finance & Cash Inputs
const sliderStartingCash = document.getElementById('slider-starting-cash');
const inputStartingCash = document.getElementById('input-starting-cash');
const sliderFixedOverhead = document.getElementById('slider-fixed-overhead');
const inputFixedOverhead = document.getElementById('input-fixed-overhead');
const selectPaymentTermsCust = document.getElementById('input-payment-terms-cust');
const sliderMarketingPct = document.getElementById('slider-marketing-pct');
const inputMarketingPct = document.getElementById('input-marketing-pct');

// Demand Inputs
const selectDemandModel = document.getElementById('input-demand-model');
const inputCansPerSealer = document.getElementById('input-cans-per-sealer');
const inputRatio250 = document.getElementById('input-ratio-250');
const inputRatio300 = document.getElementById('input-ratio-300');
const inputRatio500 = document.getElementById('input-ratio-500');

// Replenishment Inputs
const selectReplenishStrategy = document.getElementById('input-replenish-strategy');
const sliderSafetyStockDays = document.getElementById('slider-safety-stock-days');
const inputSafetyStockDays = document.getElementById('input-safety-stock-days');

// Product Settings Inputs
const selectProductEdit = document.getElementById('product-settings-select');
const inputProdUnitCost = document.getElementById('prod-unit-cost');
const inputProdRetailPrice = document.getElementById('prod-retail-price');
const inputProdInitialSales = document.getElementById('prod-initial-sales');
const inputProdGrowthRate = document.getElementById('prod-growth-rate');
const inputProdInitialStock = document.getElementById('prod-initial-stock');
const inputProdLeadTime = document.getElementById('prod-lead-time');
const inputProdMoq = document.getElementById('prod-moq');
const inputProdDeposit = document.getElementById('prod-deposit');

// Initialize App
function init() {
  loadScenarios();
  setupEventListeners();
  renderScenarioSelect();
  selectScenario.value = currentScenario.id;
  
  // Set initial language selector state and translate
  selectLang.value = currentLanguage;
  translateUI();
  
  syncUIWithScenario();
  runModel();
  
  // Initialize Lucide Icons
  lucide.createIcons();
}

// Load Scenarios from local storage or load defaults
function loadScenarios() {
  const stored = localStorage.getItem('sovaz_scenarios');
  if (stored) {
    try {
      scenarios = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored scenarios, loading defaults", e);
      scenarios = JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));
    }
  } else {
    scenarios = JSON.parse(JSON.stringify(DEFAULT_SCENARIOS));
    saveScenariosToStorage();
  }

  // Active Scenario tracking
  const lastActiveId = localStorage.getItem('sovaz_active_scenario_id');
  currentScenario = scenarios.find(s => s.id === lastActiveId) || scenarios[0];
}

function saveScenariosToStorage() {
  localStorage.setItem('sovaz_scenarios', JSON.stringify(scenarios));
  if (currentScenario) {
    localStorage.setItem('sovaz_active_scenario_id', currentScenario.id);
  }
}

// Event Listeners setup
function setupEventListeners() {
  // Scenario Management
  selectScenario.addEventListener('change', (e) => {
    const selected = scenarios.find(s => s.id === e.target.value);
    if (selected) {
      currentScenario = selected;
      saveScenariosToStorage();
      syncUIWithScenario();
      runModel();
    }
  });

  // Language Selection
  selectLang.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('sovaz_lang', currentLanguage);
    translateUI();
    runModel();
  });

  // Scenario Metadata edits
  inputScenarioName.addEventListener('input', (e) => {
    currentScenario.name = e.target.value.trim() || 'Untitled Scenario';
    saveScenariosToStorage();
    renderScenarioSelect();
    selectScenario.value = currentScenario.id;
  });

  inputScenarioDesc.addEventListener('input', (e) => {
    currentScenario.description = e.target.value;
    saveScenariosToStorage();
  });
  
  btnClone.addEventListener('click', cloneCurrentScenario);
  btnNew.addEventListener('click', createNewScenario);
  btnDelete.addEventListener('click', deleteCurrentScenario);
  btnReset.addEventListener('click', resetToDefaults);
  
  btnExport.addEventListener('click', exportScenarios);
  btnImportTrigger.addEventListener('click', () => fileImport.click());
  fileImport.addEventListener('change', importScenarios);

  // Sync Input pairs (Slider + Numeric Input)
  setupSliderInputSync(sliderStartingCash, inputStartingCash, 'startingCash');
  setupSliderInputSync(sliderFixedOverhead, inputFixedOverhead, 'monthlyFixedCosts');
  setupSliderInputSync(sliderMarketingPct, inputMarketingPct, 'marketingSpendPctOfRevenue');
  setupSliderInputSync(sliderSafetyStockDays, inputSafetyStockDays, 'safetyStockDays');

  // Customer terms change
  selectPaymentTermsCust.addEventListener('change', (e) => {
    currentScenario.paymentTermsCustomerDays = parseInt(e.target.value, 10);
    saveAndRun();
  });

  // Demand model change
  selectDemandModel.addEventListener('change', (e) => {
    currentScenario.demandModel = e.target.value;
    toggleDemandModelInputs();
    saveAndRun();
  });

  // Cans consumption inputs
  inputCansPerSealer.addEventListener('change', (e) => {
    currentScenario.cansPerSealerLimit = Math.max(1, parseInt(e.target.value, 10) || 1000);
    saveAndRun();
  });

  // Cans ratio distribution inputs
  [inputRatio250, inputRatio300, inputRatio500].forEach(input => {
    input.addEventListener('change', validateAndApplyCansRatios);
  });

  // Replenishment Strategy
  selectReplenishStrategy.addEventListener('change', (e) => {
    currentScenario.replenishmentStrategy = e.target.value;
    toggleReplenishInputs();
    saveAndRun();
  });

  // Product Settings select change
  selectProductEdit.addEventListener('change', (e) => {
    selectedProductIdToEdit = e.target.value;
    loadProductToEditForm();
  });

  // Bind product setting inputs to update on change
  const prodInputs = [
    { el: inputProdUnitCost, key: 'unitCost', isFloat: true },
    { el: inputProdRetailPrice, key: 'retailPrice', isFloat: true },
    { el: inputProdInitialSales, key: 'initialSalesVolume', isFloat: false },
    { el: inputProdGrowthRate, key: 'growthRateMoM', isFloat: true },
    { el: inputProdInitialStock, key: 'initialStock', isFloat: false },
    { el: inputProdLeadTime, key: 'leadTimeDays', isFloat: false },
    { el: inputProdMoq, key: 'moq', isFloat: false },
    { el: inputProdDeposit, key: 'supplierDepositPct', isFloat: false }
  ];

  prodInputs.forEach(item => {
    item.el.addEventListener('change', (e) => {
      let val = item.isFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
      if (isNaN(val)) return;

      // Restrict percentages to 0-100
      if (item.key === 'supplierDepositPct') {
        val = Math.max(0, Math.min(100, val));
        e.target.value = val;
        // Keep balance matching deposit
        if (!currentScenario.productSettings[selectedProductIdToEdit]) {
          currentScenario.productSettings[selectedProductIdToEdit] = {};
        }
        currentScenario.productSettings[selectedProductIdToEdit].balancePaymentPct = 100 - val;
      }

      if (!currentScenario.productSettings[selectedProductIdToEdit]) {
        currentScenario.productSettings[selectedProductIdToEdit] = {};
      }
      
      currentScenario.productSettings[selectedProductIdToEdit][item.key] = val;
      saveAndRun();
    });
  });

  // Charts Navigation Tab buttons
  document.querySelectorAll('.chart-tab-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.chart-tab-header').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeChartTab = e.target.dataset.chart;
      renderChartSection();
    });
  });

  // Sidebar Tab buttons
  document.querySelectorAll('.tab-header').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-header').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      e.target.classList.add('active');
      const tabId = e.target.dataset.tab;
      const tabEl = document.getElementById(tabId);
      if (tabEl) {
        tabEl.classList.add('active');
      }
    });
  });
}

// Translate UI labels based on active language
function translateUI() {
  const t = translations[currentLanguage] || translations.en;

  // Process data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t[key];

    if (val) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        // Safe replacement to preserve Lucide icons inside labels/buttons
        const icon = el.querySelector('i[data-lucide]');
        if (icon) {
          el.innerHTML = '';
          el.appendChild(icon);
          el.appendChild(document.createTextNode(' ' + val));
        } else {
          el.textContent = val;
        }
      }
    }
  });

  // Render product dropdown with localized product names
  renderProductSelect();
  // Render grid sheet tabs dynamically with localized product names
  renderGridTabHeaders();
}

// Utility slider + input numeric sync helper
function setupSliderInputSync(sliderEl, inputEl, scenarioKey) {
  const updateVal = (val) => {
    currentScenario[scenarioKey] = val;
    saveAndRun();
  };

  sliderEl.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    inputEl.value = val;
    updateVal(val);
  });

  inputEl.addEventListener('change', (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    
    // Clamp to slider min/max
    const min = parseInt(sliderEl.min, 10);
    const max = parseInt(sliderEl.max, 10);
    val = Math.max(min, Math.min(max, val));
    
    inputEl.value = val;
    sliderEl.value = val;
    updateVal(val);
  });
}

// Validate Cans ratios and set them
function validateAndApplyCansRatios() {
  const r250 = parseInt(inputRatio250.value, 10) || 0;
  const r300 = parseInt(inputRatio300.value, 10) || 0;
  const r500 = parseInt(inputRatio500.value, 10) || 0;
  const total = r250 + r300 + r500;

  const errorEl = document.getElementById('ratio-error');

  if (total !== 100) {
    errorEl.classList.remove('hide');
    inputRatio250.classList.add('text-danger');
    inputRatio300.classList.add('text-danger');
    inputRatio500.classList.add('text-danger');
  } else {
    errorEl.classList.add('hide');
    inputRatio250.classList.remove('text-danger');
    inputRatio300.classList.remove('text-danger');
    inputRatio500.classList.remove('text-danger');

    currentScenario.cansRatio = {
      'prod-2': r250,
      'prod-3': r300,
      'prod-4': r500
    };
    saveAndRun();
  }
}

// Hide or show parameters based on toggled configuration settings
function toggleDemandModelInputs() {
  const model = currentScenario.demandModel;
  const sOnly = document.querySelectorAll('.sealerDriven-only');
  const iOnly = document.querySelectorAll('.independent-only');

  if (model === 'sealerDriven') {
    sOnly.forEach(el => el.classList.remove('hide'));
    iOnly.forEach(el => el.classList.add('hide'));
  } else {
    sOnly.forEach(el => el.classList.add('hide'));
    iOnly.forEach(el => el.classList.remove('hide'));
  }
}

function toggleReplenishInputs() {
  const strategy = currentScenario.replenishmentStrategy;
  const ssOnly = document.querySelectorAll('.ss-only');

  if (strategy === 'SafetyStock') {
    ssOnly.forEach(el => el.classList.remove('hide'));
  } else {
    ssOnly.forEach(el => el.classList.add('hide'));
  }
}

// Synchronizes the entire UI control panel with the active scenario object values
function syncUIWithScenario() {
  // Scenario Details
  inputScenarioName.value = currentScenario.name;
  inputScenarioDesc.value = currentScenario.description || '';

  // Global Settings Panel
  sliderStartingCash.value = currentScenario.startingCash;
  inputStartingCash.value = currentScenario.startingCash;
  sliderFixedOverhead.value = currentScenario.monthlyFixedCosts;
  inputFixedOverhead.value = currentScenario.monthlyFixedCosts;
  selectPaymentTermsCust.value = currentScenario.paymentTermsCustomerDays;
  sliderMarketingPct.value = currentScenario.marketingSpendPctOfRevenue;
  inputMarketingPct.value = currentScenario.marketingSpendPctOfRevenue;
  
  selectDemandModel.value = currentScenario.demandModel;
  inputCansPerSealer.value = currentScenario.cansPerSealerLimit;
  inputRatio250.value = currentScenario.cansRatio['prod-2'] || 25;
  inputRatio300.value = currentScenario.cansRatio['prod-3'] || 25;
  inputRatio500.value = currentScenario.cansRatio['prod-4'] || 50;

  selectReplenishStrategy.value = currentScenario.replenishmentStrategy;
  sliderSafetyStockDays.value = currentScenario.safetyStockDays || 30;
  inputSafetyStockDays.value = currentScenario.safetyStockDays || 30;

  toggleDemandModelInputs();
  toggleReplenishInputs();

  // Populate product editor list dropdown
  renderProductSelect();
  loadProductToEditForm();
  
  // Localize tabs list
  renderGridTabHeaders();
}

function renderScenarioSelect() {
  selectScenario.innerHTML = '';
  scenarios.forEach(scen => {
    const opt = document.createElement('option');
    opt.value = scen.id;
    opt.textContent = scen.name;
    selectScenario.appendChild(opt);
  });
}

function renderProductSelect() {
  if (!selectProductEdit) return;
  selectProductEdit.innerHTML = '';
  for (const pid in DEFAULT_PRODUCTS) {
    const opt = document.createElement('option');
    opt.value = pid;
    opt.textContent = translateProduct(pid, currentLanguage);
    selectProductEdit.appendChild(opt);
  }
  selectProductEdit.value = selectedProductIdToEdit;
}

function renderGridTabHeaders() {
  const container = document.getElementById('grid-tab-headers-container');
  if (!container) return;
  container.innerHTML = '';

  const t = translations[currentLanguage] || translations.en;

  const tabs = [
    { id: 'all', label: t.tab_grid_all },
    { id: 'prod-1', label: translateProduct('prod-1', currentLanguage) },
    { id: 'prod-2', label: translateProduct('prod-2', currentLanguage) },
    { id: 'prod-3', label: translateProduct('prod-3', currentLanguage) },
    { id: 'prod-4', label: translateProduct('prod-4', currentLanguage) },
    { id: 'prod-5', label: translateProduct('prod-5', currentLanguage) }
  ];

  tabs.forEach(tab => {
    const btn = document.createElement('button');
    btn.className = 'grid-tab-header' + (activeGridTab === tab.id ? ' active' : '');
    btn.dataset.gridTab = tab.id;
    btn.textContent = tab.label;
    
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.grid-tab-header').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeGridTab = e.target.dataset.gridTab;
      renderGridTable();
      renderChartSection(); // Update chart in case inventory level product focus changed
    });

    container.appendChild(btn);
  });
}

// Injects the selected product attributes into the sidebar editor form
function loadProductToEditForm() {
  // Get active scenario product configuration overlay
  const base = DEFAULT_PRODUCTS[selectedProductIdToEdit];
  const overlay = currentScenario.productSettings[selectedProductIdToEdit] || {};
  const prod = { ...base, ...overlay };

  inputProdUnitCost.value = prod.unitCost.toFixed(2);
  inputProdRetailPrice.value = prod.retailPrice.toFixed(2);
  inputProdInitialSales.value = prod.initialSalesVolume;
  inputProdGrowthRate.value = prod.growthRateMoM;
  inputProdInitialStock.value = prod.initialStock;
  inputProdLeadTime.value = prod.leadTimeDays;
  inputProdMoq.value = prod.moq;
  inputProdDeposit.value = prod.supplierDepositPct;
}

// Helper to save scenario state and run simulation recalculations
function saveAndRun() {
  saveScenariosToStorage();
  runModel();
}

// Simulates calculations and updates dashboard
function runModel() {
  projectionResults = runProjection(currentScenario);
  renderKPICards();
  renderChartSection();
  renderGridTable();
}

// Format values to Currency/Numeric styles
const formatUSD = (val, dec = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: dec,
    minimumFractionDigits: dec
  }).format(val);
};

const formatNum = (val) => {
  return new Intl.NumberFormat('en-US').format(val);
};

// Render KPI dashboards cards
function renderKPICards() {
  const sum = projectionResults.summary;
  const t = translations[currentLanguage] || translations.en;

  // Ending Cash card styling
  const endingCashEl = document.getElementById('val-ending-cash');
  endingCashEl.textContent = formatUSD(sum.endingCash, 2);
  const cardCash = document.getElementById('kpi-ending-cash');
  const subEndingCash = document.getElementById('sub-ending-cash');
  
  if (sum.endingCash < 0) {
    cardCash.classList.add('cell-stockout');
    endingCashEl.className = 'value text-danger';
    subEndingCash.textContent = t.kpi_ending_cash_sub_deficit;
  } else {
    cardCash.classList.remove('cell-stockout');
    endingCashEl.className = 'value cell-positive';
    subEndingCash.textContent = t.kpi_ending_cash_sub_ok;
  }

  // Peak Capital Card
  const peakEl = document.getElementById('val-peak-capital');
  peakEl.textContent = formatUSD(sum.peakCapitalRequired, 2);
  const cardPeak = document.getElementById('kpi-peak-capital');
  if (sum.peakCapitalRequired > 0) {
    cardPeak.classList.add('cell-stockout');
  } else {
    cardPeak.classList.remove('cell-stockout');
  }

  // Revenue card
  document.getElementById('val-total-rev').textContent = formatUSD(sum.totalRevenue);
  document.getElementById('val-gross-margin').textContent = `${t.kpi_gross_margin}: ${sum.grossMarginPct.toFixed(1)}% (${formatUSD(sum.grossProfit)})`;

  // Stockout Card
  const stockoutEl = document.getElementById('val-stockouts');
  stockoutEl.textContent = sum.stockoutIncidents;
  const unmetEl = document.getElementById('val-unmet-demand');
  unmetEl.textContent = `${formatNum(sum.totalUnmetUnits)} ${t.kpi_stockouts_sub}`;
  const cardStockout = document.getElementById('kpi-stockouts');
  if (sum.stockoutIncidents > 0) {
    cardStockout.classList.add('cell-stockout');
    stockoutEl.className = 'value text-danger';
  } else {
    cardStockout.classList.remove('cell-stockout');
    stockoutEl.className = 'value cell-positive';
  }

  // Inventory value Card
  document.getElementById('val-ending-inv-val').textContent = formatUSD(sum.endingInventoryValue);
}

// Chart section rendering
function renderChartSection() {
  // Determine inventory product filter: if table grid is on a specific product, chart tracks that product
  const prodFilter = (activeGridTab !== 'all') ? activeGridTab : 'prod-1';
  updateChart(activeChartTab, projectionResults, prodFilter);
}

// Renders the 12-Month Table Grid
function renderGridTable() {
  const table = document.getElementById('forecast-table');
  table.innerHTML = '';

  const t = translations[currentLanguage] || translations.en;

  const months = [
    t.grid_metric_header,
    ...Array.from({ length: 12 }, (_, i) => translateMonth(i, currentLanguage))
  ];
  
  // Header row
  const headerTr = document.createElement('tr');
  months.forEach(mName => {
    const th = document.createElement('th');
    th.textContent = mName;
    headerTr.appendChild(th);
  });
  table.appendChild(headerTr);

  if (activeGridTab === 'all') {
    renderAggregatedTableData(table);
  } else {
    renderProductTableData(table, activeGridTab);
  }
}

// Render Aggregated Financial Sheet
function renderAggregatedTableData(table) {
  const cash = projectionResults.cashFlow;
  const pResults = projectionResults.productResults;
  const t = translations[currentLanguage] || translations.en;
  
  // Compute aggregate demand & sales units
  const totalSalesUnits = new Array(12).fill(0);
  const totalUnmetUnits = new Array(12).fill(0);
  const totalStartInvVal = new Array(12).fill(0);
  const totalOrdersPlacedVal = new Array(12).fill(0);
  const totalReceivedVal = new Array(12).fill(0);
  const totalEndingInvVal = new Array(12).fill(0);

  for (let m = 0; m < 12; m++) {
    for (const pid in pResults) {
      const pr = pResults[pid];
      const prod = projectionResults.products[pid];
      
      totalSalesUnits[m] += pr.sales[m];
      totalUnmetUnits[m] += pr.stockout[m];
      
      // Values at Cost
      totalStartInvVal[m] += pr.startingStock[m] * prod.unitCost;
      totalOrdersPlacedVal[m] += pr.ordered[m] * prod.unitCost;
      totalReceivedVal[m] += pr.received[m] * prod.unitCost;
      totalEndingInvVal[m] += pr.endingStock[m] * prod.unitCost;
    }
  }

  // Helper row inserter
  const addRow = (label, data, formatter, isHeader = false, isTotal = false, customClass = '') => {
    const tr = document.createElement('tr');
    if (isHeader) tr.className = 'row-section-header';
    if (isTotal) tr.className = 'row-total';
    if (customClass) tr.className += ' ' + customClass;

    const tdLabel = document.createElement('td');
    tdLabel.textContent = label;
    tr.appendChild(tdLabel);

    data.forEach(val => {
      const td = document.createElement('td');
      td.textContent = formatter ? formatter(val) : val;
      
      // Formatting checks
      if (formatter === formatUSD && val < 0) {
        td.className = 'cell-negative';
      }
      if (label === t.row_ending_cash && val < 0) {
        td.className = 'cell-negative cell-stockout';
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  };

  // 1. Demand section
  addRow(t.row_hdr_demand, new Array(12).fill(''), null, true);
  addRow(t.row_total_sales, totalSalesUnits, formatNum);
  addRow(t.row_total_stockouts, totalUnmetUnits, formatNum, false, false, 'text-warning');

  // 2. Inventory section
  addRow(t.row_hdr_inv_val, new Array(12).fill(''), null, true);
  addRow(t.row_beg_inv_val, totalStartInvVal, formatUSD);
  addRow(t.row_po_placed_val, totalOrdersPlacedVal, formatUSD);
  addRow(t.row_rcv_inv_val, totalReceivedVal, formatUSD);
  addRow(t.row_end_inv_val, totalEndingInvVal, formatUSD, false, true);

  // 3. Cash Flow section
  addRow(t.row_hdr_cash_flow, new Array(12).fill(''), null, true);
  addRow(t.row_sales_rev, cash.revenueGenerated, formatUSD);
  addRow(t.row_cust_receipts, cash.cashCollections, formatUSD, false, false, 'cell-positive');
  addRow(t.row_supp_payments, cash.supplierPayments, formatUSD, false, false, 'text-warning');
  addRow(t.row_fixed_overhead, cash.fixedOverhead, formatUSD);
  addRow(t.row_mkt_spend, cash.marketingSpend, formatUSD);
  addRow(t.row_net_cash, cash.netCashFlow, formatUSD, false, false, 'row-total');
  addRow(t.row_ending_cash, cash.endingCash, formatUSD, false, true);
}

// Render Product Specific Spreadsheet Sheet
function renderProductTableData(table, pid) {
  const pr = projectionResults.productResults[pid];
  const prod = projectionResults.products[pid];
  const t = translations[currentLanguage] || translations.en;
  
  // Projected demand list
  const demandList = [];
  for (let m = 0; m < 12; m++) {
    demandList.push(pr.sales[m] + pr.stockout[m]); // total demand
  }

  // Dynamic order cells that can be inputs if reordering is Manual
  const insertOrdersRow = (label, data) => {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = label;
    tr.appendChild(tdLabel);

    data.forEach((val, monthIdx) => {
      const td = document.createElement('td');
      
      if (currentScenario.replenishmentStrategy === 'Manual') {
        td.className = 'cell-editable-grid';
        const input = document.createElement('input');
        input.type = 'number';
        input.value = val;
        input.min = 0;
        input.step = prod.moq;
        
        input.addEventListener('change', (e) => {
          let editVal = parseInt(e.target.value, 10);
          if (isNaN(editVal) || editVal < 0) editVal = 0;
          
          // Enforce MOQ rounding if > 0
          if (editVal > 0) {
            editVal = Math.ceil(editVal / prod.moq) * prod.moq;
          }
          input.value = editVal;

          if (!currentScenario.manualOrders[pid]) {
            currentScenario.manualOrders[pid] = {};
          }
          currentScenario.manualOrders[pid][monthIdx] = editVal;
          saveAndRun();
        });
        td.appendChild(input);
      } else {
        td.textContent = formatNum(val);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  };

  // Dynamic demand cells that can be inputs if the demand model allows custom overrides
  const insertDemandRow = (label, data) => {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    tdLabel.textContent = label;
    tr.appendChild(tdLabel);

    // Is it editable?
    const isIndependentModel = currentScenario.demandModel === 'independent';
    const isSealerInSealerDriven = currentScenario.demandModel === 'sealerDriven' && pid === 'prod-1';
    const isEditable = isIndependentModel || isSealerInSealerDriven;

    data.forEach((val, monthIdx) => {
      const td = document.createElement('td');
      
      if (isEditable) {
        td.className = 'cell-editable-demand-grid';
        const input = document.createElement('input');
        input.type = 'number';
        input.value = val;
        input.min = 0;
        
        input.addEventListener('change', (e) => {
          let editVal = parseInt(e.target.value, 10);
          if (isNaN(editVal) || editVal < 0) editVal = 0;
          input.value = editVal;

          if (!currentScenario.customDemand) {
            currentScenario.customDemand = {};
          }
          if (!currentScenario.customDemand[pid]) {
            currentScenario.customDemand[pid] = {};
          }
          currentScenario.customDemand[pid][monthIdx] = editVal;
          saveAndRun();
        });
        td.appendChild(input);
      } else {
        td.textContent = formatNum(val);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  };

  const addRow = (label, data, formatter, isHeader = false, isTotal = false, customClass = '') => {
    const tr = document.createElement('tr');
    if (isHeader) tr.className = 'row-section-header';
    if (isTotal) tr.className = 'row-total';
    if (customClass) tr.className += ' ' + customClass;

    const tdLabel = document.createElement('td');
    tdLabel.textContent = label;
    tr.appendChild(tdLabel);

    data.forEach((val, mIdx) => {
      const td = document.createElement('td');
      td.textContent = formatter ? formatter(val) : val;
      
      // Formatting checks
      if (label === t.row_unmet_demand && val > 0) {
        td.className = 'cell-warning cell-stockout';
      }
      if (formatter === formatUSD && val < 0) {
        td.className = 'cell-negative';
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  };

  // 1. Demand
  addRow(t.row_hdr_demand_units, new Array(12).fill(''), null, true);
  insertDemandRow(t.row_sales_plan, demandList);
  addRow(t.row_sales_achieved, pr.sales, formatNum);
  addRow(t.row_unmet_demand, pr.stockout, formatNum);

  // 2. Inventory
  addRow(t.row_hdr_inv_units, new Array(12).fill(''), null, true);
  addRow(t.row_starting_stock, pr.startingStock, formatNum);
  insertOrdersRow(t.row_po_placed_val, pr.ordered);
  addRow(t.row_received_inflows, pr.received, formatNum);
  addRow(t.row_ending_stock, pr.endingStock, formatNum, false, true);

  // 3. Profitability
  addRow(t.row_hdr_financials, new Array(12).fill(''), null, true);
  addRow(t.row_prod_revenue, pr.revenue, formatUSD, false, false, 'cell-positive');
  addRow(t.row_prod_cogs, pr.cogs, formatUSD);
  addRow(t.row_prod_gross_profit, pr.grossProfit, formatUSD, false, true);
  
  // 4. Working Capital Outflows
  addRow(t.row_hdr_cash_timing, new Array(12).fill(''), null, true);
  addRow(t.row_supp_cash_paid, pr.supplierPayments, formatUSD, false, false, 'text-warning');
}

// SCENARIO ACTION FUNCTIONS
function cloneCurrentScenario() {
  const isDe = currentLanguage === 'de';
  const promptMsg = isDe ? "Namen für das geklonte Szenario eingeben:" : "Enter name for cloned scenario:";
  const suffix = isDe ? "(Kopie)" : "(Copy)";
  
  const newName = prompt(promptMsg, `${currentScenario.name} ${suffix}`);
  if (!newName) return;

  const newId = 'scen-' + Date.now();
  const cloned = JSON.parse(JSON.stringify(currentScenario));
  cloned.id = newId;
  cloned.name = newName;

  scenarios.push(cloned);
  currentScenario = cloned;
  
  renderScenarioSelect();
  selectScenario.value = newId;
  saveAndRun();
}

function createNewScenario() {
  const isDe = currentLanguage === 'de';
  const promptMsg = isDe ? "Namen für das neue Szenario eingeben:" : "Enter name for new scenario:";
  const defaultName = isDe ? "Neues Szenario" : "New Scenario";
  const defaultDesc = isDe ? "Benutzerdefiniertes leeres Szenario" : "Custom empty scenario configuration";
  
  const newName = prompt(promptMsg, defaultName);
  if (!newName) return;

  const newId = 'scen-' + Date.now();
  const newScen = {
    id: newId,
    name: newName,
    description: defaultDesc,
    startingCash: 50000,
    monthlyFixedCosts: 5000,
    paymentTermsCustomerDays: 0,
    marketingSpendPctOfRevenue: 0,
    productSettings: {},
    manualOrders: {},
    demandModel: 'sealerDriven',
    cansRatio: {
      'prod-2': 25,
      'prod-3': 25,
      'prod-4': 50
    },
    cansPerSealerLimit: 1000,
    replenishmentStrategy: 'JIT',
    safetyStockDays: 30
  };

  scenarios.push(newScen);
  currentScenario = newScen;

  renderScenarioSelect();
  selectScenario.value = newId;
  syncUIWithScenario();
  saveAndRun();
}

function deleteCurrentScenario() {
  const isDe = currentLanguage === 'de';
  const alertOnlyOne = isDe ? "Das einzige verbleibende Szenario kann nicht gelöscht werden!" : "Cannot delete the only remaining scenario!";
  const confirmDelete = isDe ? `Sind Sie sicher, dass Sie "${currentScenario.name}" löschen möchten?` : `Are you sure you want to delete "${currentScenario.name}"?`;
  
  if (scenarios.length <= 1) {
    alert(alertOnlyOne);
    return;
  }
  
  if (!confirm(confirmDelete)) return;

  scenarios = scenarios.filter(s => s.id !== currentScenario.id);
  currentScenario = scenarios[0];

  renderScenarioSelect();
  selectScenario.value = currentScenario.id;
  syncUIWithScenario();
  saveAndRun();
}

function resetToDefaults() {
  const isDe = currentLanguage === 'de';
  const confirmReset = isDe 
    ? "Sind Sie sicher, dass Sie alle Szenarien auf die Standardwerte zurücksetzen möchten? Dadurch werden benutzerdefinierte Szenarien gelöscht!" 
    : "Are you sure you want to reset all scenarios to defaults? This will erase custom scenarios!";

  if (!confirm(confirmReset)) return;

  localStorage.removeItem('sovaz_scenarios');
  localStorage.removeItem('sovaz_active_scenario_id');
  loadScenarios();
  renderScenarioSelect();
  selectScenario.value = currentScenario.id;
  syncUIWithScenario();
  runModel();
}

// JSON EXPORT & IMPORT
function exportScenarios() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenarios, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `sovaz_scenarios_${new Date().toISOString().slice(0,10)}.json`);
  dlAnchorElem.click();
}

function importScenarios(e) {
  const isDe = currentLanguage === 'de';
  const successMsg = isDe ? "Szenarien erfolgreich importiert!" : "Scenarios imported successfully!";
  const formatError = isDe ? "Ungültiges Dateiformat. Muss ein Array von Szenario-Objekten sein." : "Invalid file format. Must be an array of Scenario objects.";
  const parseError = isDe ? "Fehler beim Parsen der JSON-Datei." : "Failed to parse JSON file.";

  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported) && imported.length > 0 && imported[0].id) {
        scenarios = imported;
        currentScenario = scenarios[0];
        renderScenarioSelect();
        selectScenario.value = currentScenario.id;
        syncUIWithScenario();
        saveAndRun();
        alert(successMsg);
      } else {
        alert(formatError);
      }
    } catch (err) {
      alert(parseError);
    }
  };
  if (e.target.files.length > 0) {
    fileReader.readAsText(e.target.files[0]);
  }
}

// Start the application when DOM is loaded
window.addEventListener('DOMContentLoaded', init);
