/**
 * SOVAZ Chart Controller using Chart.js
 */

import { translations, translateProduct } from './i18n.js';

let chartInstance = null;

// Helper to get CSS variable values
function getCssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

/**
 * Initializes or updates the projection charts.
 * 
 * @param {string} chartType 'cash' | 'inventory' | 'revenue'
 * @param {Object} projectionData The data object returned by runProjection
 * @param {string} selectedProductId Product ID filter for inventory view (e.g. 'prod-1')
 */
export function updateChart(chartType, projectionData, selectedProductId = 'prod-1') {
  const ctx = document.getElementById('projectionChart').getContext('2d');
  
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Get active language
  const lang = localStorage.getItem('sovaz_lang') || 'en';
  const t = translations[lang] || translations.en;

  const months = Array.from({ length: 12 }, (_, i) => lang === 'de' ? `Monat ${i + 1}` : `Month ${i + 1}`);
  
  // Theme Colors
  const primaryColor = getCssVar('--color-primary') || '#9b66ff';
  const successColor = getCssVar('--color-success') || '#10b981';
  const dangerColor = getCssVar('--color-danger') || '#ef4444';
  const warningColor = getCssVar('--color-warning') || '#f59e0b';
  const infoColor = getCssVar('--color-info') || '#06b6d4';
  const textMuted = getCssVar('--color-text-muted') || '#94a3b8';
  const borderGlass = getCssVar('--border-glass') || 'rgba(255, 255, 255, 0.08)';

  let config = {};

  if (chartType === 'cash') {
    // --- CASH FLOW CHART ---
    const cashFlow = projectionData.cashFlow;
    
    // Creating gradient fill for Cash Balance
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(155, 102, 255, 0.25)');
    gradient.addColorStop(1, 'rgba(155, 102, 255, 0.02)');

    config = {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            type: 'line',
            label: t.chart_ending_cash_label,
            data: cashFlow.endingCash,
            borderColor: primaryColor,
            borderWidth: 3,
            fill: true,
            backgroundColor: gradient,
            tension: 0.3,
            yAxisID: 'y-cash',
            order: 1
          },
          {
            type: 'bar',
            label: t.chart_net_cash_label,
            data: cashFlow.netCashFlow,
            backgroundColor: cashFlow.netCashFlow.map(val => val >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'),
            borderColor: cashFlow.netCashFlow.map(val => val >= 0 ? successColor : dangerColor),
            borderWidth: 1.5,
            borderRadius: 4,
            yAxisID: 'y-net',
            order: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textMuted, font: { family: 'Plus Jakarta Sans' } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.raw !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: borderGlass },
            ticks: { color: textMuted }
          },
          'y-cash': {
            position: 'left',
            grid: { color: borderGlass },
            ticks: { 
              color: textMuted,
              callback: val => '$' + Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)
            },
            title: { display: true, text: t.chart_ending_cash_axis, color: textMuted }
          },
          'y-net': {
            position: 'right',
            grid: { display: false },
            ticks: { 
              color: textMuted,
              callback: val => '$' + Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)
            },
            title: { display: true, text: t.chart_monthly_net_axis, color: textMuted }
          }
        }
      }
    };
  } 
  
  else if (chartType === 'inventory') {
    // --- INVENTORY LEVELS CHART (Individual Product View) ---
    const results = projectionData.productResults[selectedProductId];
    const scenario = projectionData.scenario;

    const safetyStock = results.sales.map((salesVal, idx) => {
      // Calculate safety stock target for each month
      if (scenario.replenishmentStrategy !== 'SafetyStock') return null;
      const ssDays = scenario.safetyStockDays || 30;
      return Math.round((ssDays / 30) * salesVal);
    });

    config = {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            type: 'line',
            label: t.chart_ending_stock_label,
            data: results.endingStock,
            borderColor: infoColor,
            borderWidth: 3,
            fill: false,
            tension: 0.1,
            order: 1
          },
          {
            type: 'bar',
            label: t.chart_actual_sales_label,
            data: results.sales,
            backgroundColor: 'rgba(155, 102, 255, 0.2)',
            borderColor: primaryColor,
            borderWidth: 1.5,
            borderRadius: 4,
            order: 3
          },
          {
            type: 'bar',
            label: t.chart_stockout_label,
            data: results.stockout,
            backgroundColor: 'rgba(239, 68, 68, 0.4)',
            borderColor: dangerColor,
            borderWidth: 1,
            borderRadius: 4,
            order: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textMuted, font: { family: 'Plus Jakarta Sans' } }
          }
        },
        scales: {
          x: {
            grid: { color: borderGlass },
            ticks: { color: textMuted }
          },
          y: {
            grid: { color: borderGlass },
            ticks: { 
              color: textMuted,
              callback: val => Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)
            },
            title: { display: true, text: `${t.chart_units_axis} (${translateProduct(selectedProductId, lang)})`, color: textMuted }
          }
        }
      }
    };

    // Add Safety Stock line if the strategy is enabled
    if (scenario.replenishmentStrategy === 'SafetyStock') {
      config.data.datasets.push({
        type: 'line',
        label: t.chart_safety_stock_label,
        data: safetyStock,
        borderColor: warningColor,
        borderWidth: 2,
        borderDash: [6, 4],
        fill: false,
        order: 2
      });
    }
  } 
  
  else if (chartType === 'revenue') {
    // --- REVENUE VS COSTS CHART (Timing Mismatch) ---
    const cashFlow = projectionData.cashFlow;
    
    // Total COGS from products
    const cogsData = new Array(12).fill(0);
    for (let m = 0; m < 12; m++) {
      for (const pid in projectionData.productResults) {
        cogsData[m] += projectionData.productResults[pid].cogs[m];
      }
    }

    config = {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: t.chart_revenue_label,
            data: cashFlow.revenueGenerated,
            backgroundColor: 'rgba(16, 185, 129, 0.3)',
            borderColor: successColor,
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: t.chart_supplier_paid_label,
            data: cashFlow.supplierPayments,
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            borderColor: dangerColor,
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: t.chart_cogs_label,
            data: cogsData,
            backgroundColor: 'rgba(6, 182, 212, 0.25)',
            borderColor: infoColor,
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: textMuted, font: { family: 'Plus Jakarta Sans' } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.raw !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: borderGlass },
            ticks: { color: textMuted }
          },
          y: {
            grid: { color: borderGlass },
            ticks: { 
              color: textMuted,
              callback: val => '$' + Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)
            },
            title: { display: true, text: t.chart_value_axis, color: textMuted }
          }
        }
      }
    };
  }

  chartInstance = new Chart(ctx, config);
}
