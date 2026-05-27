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
    leaseModels: {
      'lease-1': { id: 'lease-1', fee: 49, commitment: 1000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-2': { id: 'lease-2', fee: 39, commitment: 1500, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-3': { id: 'lease-3', fee: 29, commitment: 2000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-4': { id: 'lease-4', fee: 19, commitment: 3000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-5': { id: 'lease-5', fee: 0, commitment: 4000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 }
    },
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
    leaseModels: {
      'lease-1': { id: 'lease-1', fee: 49, commitment: 1000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-2': { id: 'lease-2', fee: 39, commitment: 1500, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-3': { id: 'lease-3', fee: 29, commitment: 2000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-4': { id: 'lease-4', fee: 19, commitment: 3000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-5': { id: 'lease-5', fee: 0, commitment: 4000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 }
    },
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
    leaseModels: {
      'lease-1': { id: 'lease-1', fee: 49, commitment: 1000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-2': { id: 'lease-2', fee: 39, commitment: 1500, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-3': { id: 'lease-3', fee: 29, commitment: 2000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-4': { id: 'lease-4', fee: 19, commitment: 3000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-5': { id: 'lease-5', fee: 0, commitment: 4000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 }
    },
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
  const projectedLeaseDemand = {}; // { leaseId: [month0, month1, ... month13] }
  
  if (scenario.leaseModels) {
    for (const lId in scenario.leaseModels) {
      projectedLeaseDemand[lId] = new Array(monthsCount + 2).fill(0);
    }
  }
  
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
      if (scenario.customDemand && scenario.customDemand['prod-1'] && scenario.customDemand['prod-1'][m] !== undefined) {
        val = scenario.customDemand['prod-1'][m];
      }
      projectedDemand['prod-1'][m] = val;
      
      // Calculate lease demand
      if (scenario.leaseModels) {
        for (const [lId, lModel] of Object.entries(scenario.leaseModels)) {
          const lRate = lModel.growthRateMoM / 100;
          let lVal = Math.round(lModel.initialSalesVolume * Math.pow(1 + lRate, m));
          // customDemand for leases could be added here if needed in the future
          projectedLeaseDemand[lId][m] = lVal;
        }
      }
    }
    
    // Step 2: Cans & Lids demand is computed dynamically in the main loop since it depends on ACTUAL cumulative sealer sales!
    // However, for future ordering predictions, we also pre-calculate standard demand assuming no stockouts.
    // Let's create an ideal sealer path for months 1 to 14 to estimate future demand.
    const idealCumulativeSealers = [];
    const idealCumulativeLeaseCans = [];
    let cumulative = 0;
    let activeLeasesFuture = { 'lease-1': 0, 'lease-2': 0, 'lease-3': 0, 'lease-4': 0, 'lease-5': 0 };
    for (let m = 0; m < monthsCount + 2; m++) {
      cumulative += projectedDemand['prod-1'][m];
      idealCumulativeSealers.push(cumulative);
      
      let leaseCansThisMonth = 0;
      if (scenario.leaseModels) {
        for (const [lId, lModel] of Object.entries(scenario.leaseModels)) {
          activeLeasesFuture[lId] += projectedLeaseDemand[lId][m] || 0;
          leaseCansThisMonth += activeLeasesFuture[lId] * lModel.commitment;
        }
      }
      idealCumulativeLeaseCans.push(leaseCansThisMonth);
    }

    // Set approximate future demands for reorder logic estimates
    for (let m = 0; m < monthsCount + 2; m++) {
      const totalCansDemand = (idealCumulativeSealers[m] * scenario.cansPerSealerLimit) + idealCumulativeLeaseCans[m];
      
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

  const leaseResults = {
    activeLeases: {},
    newLeases: {},
    stockoutLeases: {},
    revenue: new Array(monthsCount).fill(0),
    cumulativeCanCommitment: new Array(monthsCount).fill(0)
  };
  if (scenario.leaseModels) {
    for (const lId in scenario.leaseModels) {
      leaseResults.activeLeases[lId] = new Array(monthsCount).fill(0);
      leaseResults.newLeases[lId] = new Array(monthsCount).fill(0);
      leaseResults.stockoutLeases[lId] = new Array(monthsCount).fill(0);
    }
  }

  // Track global month-over-month cash flows
  const cashFlow = {
    startingCash: new Array(monthsCount).fill(0),
    revenueGenerated: new Array(monthsCount).fill(0),
    cashCollections: new Array(monthsCount).fill(0),
    supplierPayments: new Array(monthsCount).fill(0),
    leaseCollections: new Array(monthsCount).fill(0),
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
      const sealerResults = pResults['prod-1'];
      const outrightDemand = projectedDemand['prod-1'][m];
      
      let totalLeaseDemand = 0;
      if (scenario.leaseModels) {
        for (const lId in scenario.leaseModels) {
          totalLeaseDemand += projectedLeaseDemand[lId][m] || 0;
        }
      }
      
      const totalSealerDemand = outrightDemand + totalLeaseDemand;
      const sealerAvailable = sealerResults.startingStock[m] + sealerResults.received[m];
      
      const totalSealerActual = Math.min(totalSealerDemand, sealerAvailable);
      const totalSealerStockout = totalSealerDemand - totalSealerActual;
      
      let actualOutright = 0;
      if (totalSealerDemand > 0) {
        const outrightRatio = outrightDemand / totalSealerDemand;
        actualOutright = Math.round(totalSealerActual * outrightRatio);
        
        let allocatedLeases = 0;
        if (scenario.leaseModels) {
          for (const lId in scenario.leaseModels) {
            const lRatio = (projectedLeaseDemand[lId][m] || 0) / totalSealerDemand;
            const lActual = Math.round(totalSealerActual * lRatio);
            leaseResults.newLeases[lId][m] = lActual;
            leaseResults.stockoutLeases[lId][m] = (projectedLeaseDemand[lId][m] || 0) - lActual;
            allocatedLeases += lActual;
            
            // update active leases
            leaseResults.activeLeases[lId][m] = (m > 0 ? leaseResults.activeLeases[lId][m-1] : 0) + lActual;
          }
        }
        
        // fix rounding errors
        const diff = totalSealerActual - (actualOutright + allocatedLeases);
        actualOutright += diff;
      } else {
        // If demand is 0, active leases still carry over
        if (scenario.leaseModels) {
          for (const lId in scenario.leaseModels) {
            leaseResults.activeLeases[lId][m] = (m > 0 ? leaseResults.activeLeases[lId][m-1] : 0);
          }
        }
      }

      sealerResults.sales[m] = actualOutright;
      sealerResults.stockout[m] = outrightDemand - actualOutright;
      // All shipped sealers (outright + leased) deplete inventory and accrue COGS!
      sealerResults.endingStock[m] = sealerAvailable - totalSealerActual;
      
      // Since leased machines deplete inventory, their COGS is handled differently.
      // We will set a custom COGS property on the sealer results later, 
      // but for now, we just need to ensure `sales` for COGS purposes includes leases.
      // ACTUALLY, it's easier to add leases to sealerResults.sales for COGS, but then revenue is wrong.
      // Let's keep `sales` as outright sales, and compute leased COGS manually.
      // Wait, let's store total units shipped for COGS.
      sealerResults._totalShippedThisMonth = totalSealerActual;

      // Accumulate outright sealers sold to date
      cumulativeActualSealersSold += sealerResults.sales[m];
      
      // Calculate active lease can commitments
      let currentLeaseCanCommitment = 0;
      let leaseRevenueThisMonth = 0;
      if (scenario.leaseModels) {
        for (const [lId, lModel] of Object.entries(scenario.leaseModels)) {
          currentLeaseCanCommitment += leaseResults.activeLeases[lId][m] * lModel.commitment;
          leaseRevenueThisMonth += (leaseResults.newLeases[lId][m] * lModel.downpayment);
          leaseRevenueThisMonth += (leaseResults.activeLeases[lId][m] * lModel.fee);
        }
      }
      leaseResults.cumulativeCanCommitment[m] = currentLeaseCanCommitment;
      leaseResults.revenue[m] = leaseRevenueThisMonth;

      // Dynamically calculate demand for Cans & Lids in Month M
      const totalCanDemand = (cumulativeActualSealersSold * scenario.cansPerSealerLimit) + currentLeaseCanCommitment;
      
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
      // COGS needs to include leased machines if it's the sealer
      if (pid === 'prod-1' && results._totalShippedThisMonth !== undefined) {
        results.cogs[m] = results._totalShippedThisMonth * p.unitCost;
      } else {
        results.cogs[m] = results.sales[m] * p.unitCost;
      }
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
    
    // Lease collections are instant
    cashFlow.leaseCollections[m] = leaseResults.revenue[m] || 0;
    cashFlow.cashCollections[m] += cashFlow.leaseCollections[m];
    // Also add lease revenue to total revenue so it reflects on KPIs
    cashFlow.revenueGenerated[m] += cashFlow.leaseCollections[m];

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
          
          // Add estimated lease demands
          let estCumulativeLeaseCans = (leaseResults.cumulativeCanCommitment[m] || 0);
          if (scenario.leaseModels) {
             let activeLeasesCopy = {...leaseResults.activeLeases};
             for (const [lId, lModel] of Object.entries(scenario.leaseModels)) {
                const activeM = activeLeasesCopy[lId][m] || 0;
                const newM1 = projectedLeaseDemand[lId][m + 1] || 0;
                const newM2 = projectedLeaseDemand[lId][m + 2] || 0;
                
                const activeM1 = activeM + newM1;
                const activeM2 = activeM1 + newM2;
                // Add the commitment for M+2
                estCumulativeLeaseCans = 0; // recalculate for M+2 completely below
             }
             
             let estCommitmentM2 = 0;
             for (const [lId, lModel] of Object.entries(scenario.leaseModels)) {
                const activeM = leaseResults.activeLeases[lId][m] || 0;
                const newM1 = projectedLeaseDemand[lId][m + 1] || 0;
                const newM2 = projectedLeaseDemand[lId][m + 2] || 0;
                const activeM2 = activeM + newM1 + newM2;
                estCommitmentM2 += activeM2 * lModel.commitment;
             }
             estCumulativeLeaseCans = estCommitmentM2;
          }
          
          const estTotalCans = (estCumulativeSealers * scenario.cansPerSealerLimit) + estCumulativeLeaseCans;
          if (pid === 'prod-5') {
            targetDemand = estTotalCans;
          } else {
            targetDemand = Math.round(estTotalCans * (scenario.cansRatio[pid] / 100));
          }
        } else {
          // Independent or Sealer itself
          targetDemand = projectedDemand[pid][nextNextMonth] || 0;
          if (pid === 'prod-1' && scenario.demandModel === 'sealerDriven') {
             // Add lease demand to sealer demand target
             if (scenario.leaseModels) {
               for (const lId in scenario.leaseModels) {
                 targetDemand += projectedLeaseDemand[lId][nextNextMonth] || 0;
               }
             }
          }
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
    leaseResults,
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
