/**
 * SOVAZ Cash Flow & Inventory Forecasting Engine
 */

export const DEFAULT_PRODUCTS = {
  'prod-1': {
    id: 'prod-1',
    name: 'Product 1 Sealer',
    unitCost: 350.00,
    retailPrice: 700.00,
    initialSalesVolume: 40,
    growthRateMoM: 5.0, // in %
    initialStock: 50,
    leadTimeDays: 40,
    supplierDepositPct: 100, // in %
    balancePaymentPct: 0, // in %
    moq: 10
  },
  'prod-2': {
    id: 'prod-2',
    name: 'Product 2 - 250ml',
    unitCost: 0.27,
    retailPrice: 0.62,
    initialSalesVolume: 10000,
    growthRateMoM: 100.0, // in %
    initialStock: 20000,
    leadTimeDays: 40,
    supplierDepositPct: 100,
    balancePaymentPct: 0,
    moq: 5000
  },
  'prod-3': {
    id: 'prod-3',
    name: 'Product 3 - 300ml',
    unitCost: 0.29,
    retailPrice: 0.63,
    initialSalesVolume: 10000,
    growthRateMoM: 100.0, // in %
    initialStock: 24000,
    leadTimeDays: 40,
    supplierDepositPct: 100,
    balancePaymentPct: 0,
    moq: 5000
  },
  'prod-4': {
    id: 'prod-4',
    name: 'Product 4 - 500ml',
    unitCost: 0.34,
    retailPrice: 0.68,
    initialSalesVolume: 20000,
    growthRateMoM: 100.0, // in %
    initialStock: 59000,
    leadTimeDays: 40,
    supplierDepositPct: 100,
    balancePaymentPct: 0,
    moq: 5000
  },
  'prod-5': {
    id: 'prod-5',
    name: 'Product 5 - cover',
    unitCost: 0.04,
    retailPrice: 0.10,
    initialSalesVolume: 40000,
    growthRateMoM: 100.0, // in %
    initialStock: 100000,
    leadTimeDays: 40,
    supplierDepositPct: 100,
    balancePaymentPct: 0,
    moq: 5000
  }
};

export const DEFAULT_SCENARIOS = [
  {
    id: 'scen-baseline',
    name: 'Baseline (Machine-Driven)',
    description: 'Demand for cans/lids is driven by active sealer machines sold. $50,000 starting cash.',
    startingCash: 50000,
    monthlyFixedCosts: 5000,
    paymentTermsCustomerDays: 0,
    marketingSpendPctOfRevenue: 0,
    productSettings: {},
    manualOrders: {}, // { productId: { monthIndex: qty } }
    customDemand: {}, // { productId: { monthIndex: qty } }
    demandModel: 'sealerDriven',
    cansRatio: {
      'prod-2': 25,
      'prod-3': 25,
      'prod-4': 50
    },
    cansPerSealerLimit: 1000,
    replenishmentStrategy: 'JIT',
    safetyStockDays: 30
  },
  {
    id: 'scen-independent',
    name: 'Table Assumptions (Independent Growth)',
    description: 'Cans and lids grow at 100% MoM independently of sealer sales. Warning: leads to extreme volumes.',
    startingCash: 50000,
    monthlyFixedCosts: 5000,
    paymentTermsCustomerDays: 0,
    marketingSpendPctOfRevenue: 0,
    productSettings: {},
    manualOrders: {},
    customDemand: {},
    demandModel: 'independent',
    cansRatio: {
      'prod-2': 25,
      'prod-3': 25,
      'prod-4': 50
    },
    cansPerSealerLimit: 1000,
    replenishmentStrategy: 'JIT',
    safetyStockDays: 30
  },
  {
    id: 'scen-conservative',
    name: 'Conservative Machine Sales (3% growth)',
    description: 'Sealer grows at 3% instead of 5%. $100,000 starting cash for safer growth buffer.',
    startingCash: 100000,
    monthlyFixedCosts: 5000,
    paymentTermsCustomerDays: 0,
    marketingSpendPctOfRevenue: 5,
    productSettings: {
      'prod-1': { growthRateMoM: 3.0 }
    },
    manualOrders: {},
    customDemand: {},
    demandModel: 'sealerDriven',
    cansRatio: {
      'prod-2': 25,
      'prod-3': 25,
      'prod-4': 50
    },
    cansPerSealerLimit: 1000,
    replenishmentStrategy: 'SafetyStock',
    safetyStockDays: 30
  }
];

/**
 * Calculates a 12-month projection based on active scenario configurations.
 * 
 * @param {Object} scenario Current scenario object
 * @param {Object} baseProducts Base product configurations
 * @returns {Object} Full projection calculations
 */
export function runProjection(scenario, baseProducts = DEFAULT_PRODUCTS) {
  const monthsCount = 12;
  
  // Merge scenario-specific product settings with base products
  const products = {};
  for (const id in baseProducts) {
    products[id] = {
      ...baseProducts[id],
      ...(scenario.productSettings[id] || {})
    };
  }

  // Pre-calculate unconstrained demand forecasts for ALL 14 months (months 1 to 14)
  // This is required to determine lead-time ordering in months 11 and 12 (arriving in months 13 and 14).
  const projectedDemand = {}; // { productId: [month0, month1, ... month13] }
  
  for (const pid in products) {
    projectedDemand[pid] = new Array(monthsCount + 2).fill(0);
  }

  // Fill in demand based on selected demand model
  if (scenario.demandModel === 'independent') {
    // Standard growth rate formula: InitialSales * (1 + rate)^(monthIndex)
    for (const pid in products) {
      const p = products[pid];
      const rate = p.growthRateMoM / 100;
      for (let m = 0; m < monthsCount + 2; m++) {
        let val = Math.round(p.initialSalesVolume * Math.pow(1 + rate, m));
        // Apply custom demand override if defined for this product and month
        if (scenario.customDemand && scenario.customDemand[pid] && scenario.customDemand[pid][m] !== undefined) {
          val = scenario.customDemand[pid][m];
        }
        projectedDemand[pid][m] = val;
      }
    }
  } else {
    // Sealer-Driven Consumption Model
    // Step 1: Sealer demand grows by its own rate (can also be overridden manually)
    const sealer = products['prod-1'];
    const sRate = sealer.growthRateMoM / 100;
    for (let m = 0; m < monthsCount + 2; m++) {
      let val = Math.round(sealer.initialSalesVolume * Math.pow(1 + sRate, m));
      // Apply custom demand override if defined for sealer machine
      if (scenario.customDemand && scenario.customDemand['prod-1'] && scenario.customDemand['prod-1'][m] !== undefined) {
        val = scenario.customDemand['prod-1'][m];
      }
      projectedDemand['prod-1'][m] = val;
    }
    
    // Step 2: Cans & Lids demand is computed dynamically in the main loop since it depends on ACTUAL cumulative sealer sales!
    // However, for future ordering predictions, we also pre-calculate standard demand assuming no stockouts.
    // Let's create an ideal sealer path for months 1 to 14 to estimate future demand.
    const idealCumulativeSealers = [];
    let cumulative = 0;
    for (let m = 0; m < monthsCount + 2; m++) {
      cumulative += projectedDemand['prod-1'][m];
      idealCumulativeSealers.push(cumulative);
    }

    // Set approximate future demands for reorder logic estimates
    for (let m = 0; m < monthsCount + 2; m++) {
      const totalCansDemand = idealCumulativeSealers[m] * scenario.cansPerSealerLimit;
      
      projectedDemand['prod-2'][m] = Math.round(totalCansDemand * (scenario.cansRatio['prod-2'] / 100));
      projectedDemand['prod-3'][m] = Math.round(totalCansDemand * (scenario.cansRatio['prod-3'] / 100));
      projectedDemand['prod-4'][m] = Math.round(totalCansDemand * (scenario.cansRatio['prod-4'] / 100));
      projectedDemand['prod-5'][m] = totalCansDemand; // lids match total cans
    }
  }

  // Initialize output structures for each product
  const pResults = {}; // { productId: { startingStock: [], received: [], sales: [], stockout: [], endingStock: [], ordered: [] } }
  for (const pid in products) {
    pResults[pid] = {
      startingStock: new Array(monthsCount).fill(0),
      received: new Array(monthsCount).fill(0),
      sales: new Array(monthsCount).fill(0),
      stockout: new Array(monthsCount).fill(0),
      endingStock: new Array(monthsCount).fill(0),
      ordered: new Array(monthsCount).fill(0),
      cogs: new Array(monthsCount).fill(0),
      revenue: new Array(monthsCount).fill(0),
      grossProfit: new Array(monthsCount).fill(0),
      supplierPayments: new Array(monthsCount).fill(0)
    };
  }

  // Track global month-over-month cash flows
  const cashFlow = {
    startingCash: new Array(monthsCount).fill(0),
    revenueGenerated: new Array(monthsCount).fill(0),
    cashCollections: new Array(monthsCount).fill(0),
    supplierPayments: new Array(monthsCount).fill(0),
    fixedOverhead: new Array(monthsCount).fill(0),
    marketingSpend: new Array(monthsCount).fill(0),
    netCashFlow: new Array(monthsCount).fill(0),
    endingCash: new Array(monthsCount).fill(0)
  };

  // Run the month-by-month projection simulation
  let cumulativeActualSealersSold = 0;

  for (let m = 0; m < monthsCount; m++) {
    // 1. Starting Cash
    cashFlow.startingCash[m] = m === 0 ? scenario.startingCash : cashFlow.endingCash[m - 1];

    // 2. Process Arrivals (Received Stock) in Month M
    // Delivery takes 40 days. In a monthly bucket model, orders placed in month M-2 arrive in month M.
    for (const pid in products) {
      const results = pResults[pid];
      results.startingStock[m] = m === 0 ? products[pid].initialStock : results.endingStock[m - 1];
      
      if (m >= 2) {
        results.received[m] = results.ordered[m - 2];
      } else {
        results.received[m] = 0; // No historical order arrivals modeled before Month 3
      }
    }

    // 3. Determine Dynamic Demand for Month M (Sealer-Driven)
    if (scenario.demandModel === 'sealerDriven') {
      // First, calculate Sealer (Product 1) actual sales in Month M since we need it for can demand
      const sealerResults = pResults['prod-1'];
      const sealerDemand = projectedDemand['prod-1'][m];
      const sealerAvailable = sealerResults.startingStock[m] + sealerResults.received[m];
      
      sealerResults.sales[m] = Math.min(sealerDemand, sealerAvailable);
      sealerResults.stockout[m] = sealerDemand - sealerResults.sales[m];
      sealerResults.endingStock[m] = sealerAvailable - sealerResults.sales[m];

      // Accumulate sealers sold to date
      cumulativeActualSealersSold += sealerResults.sales[m];

      // Dynamically calculate demand for Cans & Lids in Month M
      const totalCanDemand = cumulativeActualSealersSold * scenario.cansPerSealerLimit;
      
      projectedDemand['prod-2'][m] = Math.round(totalCanDemand * (scenario.cansRatio['prod-2'] / 100));
      projectedDemand['prod-3'][m] = Math.round(totalCanDemand * (scenario.cansRatio['prod-3'] / 100));
      projectedDemand['prod-4'][m] = Math.round(totalCanDemand * (scenario.cansRatio['prod-4'] / 100));
      projectedDemand['prod-5'][m] = totalCanDemand;

      // Now compute sales and inventory for Cans & Lids in Month M
      for (const pid in products) {
        if (pid === 'prod-1') continue; // Sealer is already computed
        
        const results = pResults[pid];
        const demand = projectedDemand[pid][m];
        const available = results.startingStock[m] + results.received[m];
        
        results.sales[m] = Math.min(demand, available);
        results.stockout[m] = demand - results.sales[m];
        results.endingStock[m] = available - results.sales[m];
      }
    } else {
      // Independent growth model
      for (const pid in products) {
        const results = pResults[pid];
        const demand = projectedDemand[pid][m];
        const available = results.startingStock[m] + results.received[m];
        
        results.sales[m] = Math.min(demand, available);
        results.stockout[m] = demand - results.sales[m];
        results.endingStock[m] = available - results.sales[m];
      }
    }

    // 4. Financial Calculations for each product in Month M
    let totalSalesRev = 0;
    for (const pid in products) {
      const p = products[pid];
      const results = pResults[pid];
      
      results.revenue[m] = results.sales[m] * p.retailPrice;
      results.cogs[m] = results.sales[m] * p.unitCost;
      results.grossProfit[m] = results.revenue[m] - results.cogs[m];
      
      totalSalesRev += results.revenue[m];
    }
    cashFlow.revenueGenerated[m] = totalSalesRev;

    // 5. Customer Payments Collected (Cash Receipts)
    // Dynamic collections delay: Terms of 0 (instant), 30 days (Month M-1), or 60 days (Month M-2)
    const terms = parseInt(scenario.paymentTermsCustomerDays, 10);
    if (terms === 0) {
      cashFlow.cashCollections[m] = cashFlow.revenueGenerated[m];
    } else if (terms === 30) {
      cashFlow.cashCollections[m] = m >= 1 ? cashFlow.revenueGenerated[m - 1] : 0;
    } else if (terms === 60) {
      cashFlow.cashCollections[m] = m >= 2 ? cashFlow.revenueGenerated[m - 2] : 0;
    }

    // 6. Replenishment Orders Decided in Month M (to arrive in Month M+2)
    for (const pid in products) {
      const p = products[pid];
      const results = pResults[pid];
      
      if (scenario.replenishmentStrategy === 'Manual') {
        const manualQty = (scenario.manualOrders[pid] && scenario.manualOrders[pid][m] !== undefined)
          ? scenario.manualOrders[pid][m]
          : 0;
        results.ordered[m] = manualQty;
      } else {
        // JIT or Safety Stock strategies (Calculates required order for Month M+2)
        const nextNextMonth = m + 2; // Order placed in m arrives in m+2
        
        // Step 1: Project demand for Month M+2
        let targetDemand = 0;
        if (scenario.demandModel === 'sealerDriven' && pid !== 'prod-1') {
          // If sealer-driven, we estimate the cumulative sealer sold up to month M+2
          // Assume Month M+1 and M+2 sealer sales meet their target demands
          const estSealerSalesM1 = projectedDemand['prod-1'][m + 1] || 0;
          const estSealerSalesM2 = projectedDemand['prod-1'][m + 2] || 0;
          const estCumulativeSealers = cumulativeActualSealersSold + estSealerSalesM1 + estSealerSalesM2;
          
          const estTotalCans = estCumulativeSealers * scenario.cansPerSealerLimit;
          if (pid === 'prod-5') {
            targetDemand = estTotalCans;
          } else {
            targetDemand = Math.round(estTotalCans * (scenario.cansRatio[pid] / 100));
          }
        } else {
          // Independent or Sealer itself
          targetDemand = projectedDemand[pid][nextNextMonth] || 0;
        }

        // Step 2: Estimate ending stock of Month M+1 (which is start stock of Month M+2)
        // Ending stock of Month M is results.endingStock[m] (already computed)
        // Arrivals in Month M+1 will be results.ordered[m-1] (placed in Month M-1)
        // Estimated Sales in Month M+1 is the Projected Demand of Month M+1
        const endingStockM = results.endingStock[m];
        const arrivalsM1 = m >= 1 ? results.ordered[m - 1] : 0;
        const demandM1 = projectedDemand[pid][m + 1] || 0;
        
        const estEndingStockM1 = Math.max(0, endingStockM + arrivalsM1 - demandM1);
        
        // Step 3: Determine target inventory level based on strategy
        let targetUnits = targetDemand;
        if (scenario.replenishmentStrategy === 'SafetyStock') {
          const ssDays = scenario.safetyStockDays || 30;
          const ssUnits = Math.round((ssDays / 30) * targetDemand);
          targetUnits = targetDemand + ssUnits;
        }

        // Step 4: Calculate Net Requirement
        const netRequirement = targetUnits - estEndingStockM1;
        
        if (netRequirement > 0) {
          // Round up to nearest MOQ
          const roundedQty = Math.ceil(netRequirement / p.moq) * p.moq;
          results.ordered[m] = roundedQty;
        } else {
          results.ordered[m] = 0;
        }
      }
    }

    // 7. Calculate Supplier Cash Payments in Month M
    // Paid 100% deposit on order placement in Month M (or deposit/balance mix)
    let totalSupplierPayM = 0;
    for (const pid in products) {
      const p = products[pid];
      const results = pResults[pid];
      
      const depositPct = p.supplierDepositPct / 100;
      const balancePct = p.balancePaymentPct / 100;
      
      // Current Month's order deposit
      const depositPaid = results.ordered[m] * p.unitCost * depositPct;
      
      // Balance on order arriving in Month M (ordered in Month M-2)
      let balancePaid = 0;
      if (m >= 2) {
        balancePaid = results.ordered[m - 2] * p.unitCost * balancePct;
      }
      
      results.supplierPayments[m] = depositPaid + balancePaid;
      totalSupplierPayM += results.supplierPayments[m];
    }
    cashFlow.supplierPayments[m] = totalSupplierPayM;

    // 8. Opex & Marketing Spend Outflows
    cashFlow.fixedOverhead[m] = scenario.monthlyFixedCosts;
    cashFlow.marketingSpend[m] = cashFlow.revenueGenerated[m] * (scenario.marketingSpendPctOfRevenue / 100);
    
    // 9. Ending Cash Balance
    cashFlow.netCashFlow[m] = cashFlow.cashCollections[m] - cashFlow.supplierPayments[m] - cashFlow.fixedOverhead[m] - cashFlow.marketingSpend[m];
    cashFlow.endingCash[m] = cashFlow.startingCash[m] + cashFlow.netCashFlow[m];
  }

  // Calculate aggregated values for summary metrics
  let totalRev = 0;
  let totalCOGS = 0;
  let totalStockouts = 0;
  let totalUnmetUnits = 0;
  let minCash = scenario.startingCash;
  let maxCashDeficit = 0;
  
  for (let m = 0; m < monthsCount; m++) {
    totalRev += cashFlow.revenueGenerated[m];
    
    if (cashFlow.endingCash[m] < 0) {
      const deficit = -cashFlow.endingCash[m];
      if (deficit > maxCashDeficit) maxCashDeficit = deficit;
    }
    if (cashFlow.endingCash[m] < minCash) {
      minCash = cashFlow.endingCash[m];
    }
  }

  let finalInventoryValue = 0;
  for (const pid in products) {
    const p = products[pid];
    const results = pResults[pid];
    
    totalCOGS += results.cogs.reduce((a, b) => a + b, 0);
    
    for (let m = 0; m < monthsCount; m++) {
      if (results.stockout[m] > 0) {
        totalStockouts++;
        totalUnmetUnits += results.stockout[m];
      }
    }
    
    // Inventory value at cost in month 12
    finalInventoryValue += results.endingStock[monthsCount - 1] * p.unitCost;
  }

  const grossProfit = totalRev - totalCOGS;
  const grossMarginPct = totalRev > 0 ? (grossProfit / totalRev) * 100 : 0;

  return {
    scenario,
    products,
    productResults: pResults,
    cashFlow,
    summary: {
      endingCash: cashFlow.endingCash[monthsCount - 1],
      peakCapitalRequired: maxCashDeficit,
      totalRevenue: totalRev,
      grossProfit,
      grossMarginPct,
      stockoutIncidents: totalStockouts,
      totalUnmetUnits,
      endingInventoryValue: finalInventoryValue
    }
  };
}
