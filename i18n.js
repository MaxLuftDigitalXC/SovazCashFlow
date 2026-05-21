/**
 * SOVAZ Cash Flow & Inventory Forecasting - i18n Module
 */

export const translations = {
  en: {
    // Header & Brand
    app_title: "SOVAZ",
    app_subtitle: "Cash Flow & Inventory Forecasting",
    select_scenario: "Scenario",
    btn_clone: "Clone",
    btn_new: "New",
    btn_delete: "Delete",
    btn_reset: "Reset",
    btn_export: "Export",
    btn_import: "Import",
    language_label: "Language",

    // KPI Cards
    kpi_ending_cash_title: "Ending Cash Balance",
    kpi_ending_cash_sub_ok: "Month 12 cash on hand",
    kpi_ending_cash_sub_deficit: "Cash deficit in Month 12",
    kpi_peak_cap_title: "Peak Capital Required",
    kpi_peak_cap_sub: "Maximum cash deficit",
    kpi_revenue_title: "Total Revenue (12M)",
    kpi_gross_margin: "GP Margin",
    kpi_stockouts_title: "Stockout Incidents",
    kpi_stockouts_sub: "units unmet demand",
    kpi_ending_inv_title: "Ending Inventory Value",
    kpi_ending_inv_sub: "At cost in Month 12",

    // Sidebar
    param_header: "Parameters & Assumptions",
    tab_global: "Global Settings",
    tab_products: "Product Settings",
    
    sec_scen_props: "Scenario Properties",
    lbl_scen_name: "Scenario Name",
    lbl_scen_desc: "Description",
    ph_scen_name: "Scenario Name",
    ph_scen_desc: "Scenario description and key assumptions...",

    sec_finance: "Finance & Cash Flow",
    lbl_starting_cash: "Starting Cash Balance ($)",
    lbl_fixed_overhead: "Monthly Fixed Overhead ($)",
    lbl_pay_terms_cust: "Customer Payment Terms (Days)",
    opt_terms_0: "0 Days (Instant Cash Sales)",
    opt_terms_30: "30 Days (Net 30)",
    opt_terms_60: "60 Days (Net 60)",
    lbl_marketing_pct: "Marketing Spend (% of Revenue)",

    sec_demand: "Demand Modeling",
    lbl_demand_model: "Demand Calculation Model",
    opt_model_sealer: "Machine-Driven Consumption (Recommended)",
    opt_model_independent: "Independent Growth Rates (Table Values)",
    help_sealer_only: "Cans & Lids demand is dynamically calculated based on actual sealer machines sold.",
    help_independent_only: "Cans grow at 100% MoM independently, leading to massive exponential demand by Month 12.",
    lbl_cans_per_sealer: "Cans/Lids Consumed per Sealer / Month",
    lbl_can_ratio: "Can Demand Allocation Ratio",
    lbl_ratio_err: "Ratios must sum to 100%!",

    sec_replenish: "Supply Chain Replenishment",
    lbl_strategy: "Reordering Strategy",
    opt_strat_jit: "Just-In-Time (Order for Month N+2 Demand)",
    opt_strat_ss: "Safety Stock (Days of Coverage)",
    opt_strat_manual: "Manual Order Planning",
    lbl_ss_days: "Safety Stock Days of Coverage",

    sec_prod_edit: "Product Settings",
    lbl_select_prod: "Select Product to Edit",
    lbl_unit_cost: "Unit Cost ($)",
    lbl_retail_price: "Retail Price ($)",
    lbl_initial_sales: "Initial Monthly Sales (Month 1)",
    lbl_growth_rate: "MoM Growth Rate (%)",
    lbl_initial_stock: "Initial Starting Stock (Units)",
    lbl_lead_time: "Delivery Lead Time (Days)",
    lbl_moq: "Minimum Order Quantity (MOQ)",
    lbl_deposit: "Supplier Deposit Payment (%)",

    // Charts
    chart_title: "Visual Projections",
    tab_chart_cash: "Cash Flow",
    tab_chart_inv: "Inventory Levels",
    tab_chart_rev: "Revenue vs Costs",
    
    chart_ending_cash_label: "Ending Cash Balance ($)",
    chart_net_cash_label: "Net Cash Flow ($)",
    chart_ending_cash_axis: "Ending Cash",
    chart_monthly_net_axis: "Monthly Net Cash Flow",
    
    chart_ending_stock_label: "Ending Inventory (Units)",
    chart_actual_sales_label: "Actual Sales (Units)",
    chart_stockout_label: "Stockouts (Unmet Demand)",
    chart_safety_stock_label: "Safety Stock Target",
    chart_units_axis: "Units",

    chart_revenue_label: "Sales Revenue Generated ($)",
    chart_supplier_paid_label: "Supplier Cash Paid ($)",
    chart_cogs_label: "Accrued COGS ($)",
    chart_value_axis: "Value ($)",

    // Detailed Grid Sheet
    grid_title: "Detailed 12-Month Sheet",
    grid_subtitle: "Configure parameters and examine month-by-month cash and inventory flows",
    tab_grid_all: "Aggregated View",
    grid_metric_header: "Metric (12 Months)",

    // Aggregated grid rows
    row_hdr_demand: "DEMAND & SALES PROJECTIONS",
    row_total_sales: "Total Units Sold",
    row_total_stockouts: "Total Stockout Units",
    row_hdr_inv_val: "INVENTORY VALUATION (AT COST)",
    row_beg_inv_val: "Beginning Inventory Value",
    row_po_placed_val: "Purchase Orders Placed",
    row_rcv_inv_val: "Received Inventory Value",
    row_end_inv_val: "Ending Inventory Value",
    row_hdr_cash_flow: "CASH FLOW SHEET",
    row_sales_rev: "Sales Revenue Generated",
    row_cust_receipts: "Customer Cash Receipts",
    row_supp_payments: "Supplier Order Payments",
    row_fixed_overhead: "Fixed Overhead Expenses",
    row_mkt_spend: "Marketing Discretionary Spend",
    row_net_cash: "Net Monthly Cash Flow",
    row_ending_cash: "Ending Cash Balance",

    // Product grid rows
    row_hdr_demand_units: "DEMAND & SALES (UNITS)",
    row_sales_plan: "Projected Sales Plan",
    row_sales_achieved: "Actual Sales Achieved",
    row_unmet_demand: "Unmet Demand (Stockouts)",
    row_hdr_inv_units: "INVENTORY CONTROL (UNITS)",
    row_starting_stock: "Starting Stock",
    row_received_inflows: "Received Inflows (Lead Time)",
    row_ending_stock: "Ending Stock",
    row_hdr_financials: "FINANCIAL PERFORMANCE ($)",
    row_prod_revenue: "Sales Revenue",
    row_prod_cogs: "Cost of Goods Sold (COGS)",
    row_prod_gross_profit: "Gross Profit Generated",
    row_hdr_cash_timing: "CASH TIMING IMPACT ($)",
    row_supp_cash_paid: "Supplier Cash Paid (Orders)"
  },
  de: {
    // Header & Brand
    app_title: "SOVAZ",
    app_subtitle: "Cashflow- & Bestandsprognose",
    select_scenario: "Szenario",
    btn_clone: "Klonen",
    btn_new: "Neu",
    btn_delete: "Löschen",
    btn_reset: "Zurücksetzen",
    btn_export: "Exportieren",
    btn_import: "Importieren",
    language_label: "Sprache",

    // KPI Cards
    kpi_ending_cash_title: "Endgültiger Kassenbestand",
    kpi_ending_cash_sub_ok: "Kassenbestand im 12. Monat",
    kpi_ending_cash_sub_deficit: "Kassendefizit im 12. Monat",
    kpi_peak_cap_title: "Maximal benötigtes Kapital",
    kpi_peak_cap_sub: "Maximales Cash-Defizit",
    kpi_revenue_title: "Gesamtumsatz (12M)",
    kpi_gross_margin: "Bruttomarge",
    kpi_stockouts_title: "Lieferengpässe",
    kpi_stockouts_sub: "Einheiten ungedeckte Nachfrage",
    kpi_ending_inv_title: "Endgültiger Lagerwert",
    kpi_ending_inv_sub: "Zu Anschaffungskosten im 12. Monat",

    // Sidebar
    param_header: "Parameter & Annahmen",
    tab_global: "Globale Einstellungen",
    tab_products: "Produkteinstellungen",
    
    sec_scen_props: "Szenario-Eigenschaften",
    lbl_scen_name: "Szenarioname",
    lbl_scen_desc: "Beschreibung",
    ph_scen_name: "Szenarioname",
    ph_scen_desc: "Szenariobeschreibung und wichtige Annahmen...",

    sec_finance: "Finanzen & Cashflow",
    lbl_starting_cash: "Anfangskassenbestand ($)",
    lbl_fixed_overhead: "Monatliche Fixkosten ($)",
    lbl_pay_terms_cust: "Zahlungsbedingungen für Kunden (Tage)",
    opt_terms_0: "0 Tage (Sofortige Barverkäufe)",
    opt_terms_30: "30 Tage (Netto 30)",
    opt_terms_60: "60 Tage (Netto 60)",
    lbl_marketing_pct: "Marketingausgaben (% des Umsatzes)",

    sec_demand: "Nachfragemodellierung",
    lbl_demand_model: "Berechnungsmodell für die Nachfrage",
    opt_model_sealer: "Maschinengesteuerter Verbrauch (Empfohlen)",
    opt_model_independent: "Unabhängige Wachstumsraten (Tabellenwerte)",
    help_sealer_only: "Die Nachfrage nach Dosen & Deckeln wird dynamisch basierend auf den tatsächlich verkauften Versiegelern berechnet.",
    help_independent_only: "Dosen wachsen unabhängig um 100% MoM, was bis Monat 12 zu einer massiven exponentiellen Nachfrage führt.",
    lbl_cans_per_sealer: "Verbrauchte Dosen/Deckel pro Versiegeler / Monat",
    lbl_can_ratio: "Verteilungsverhältnis der Dosennachfrage",
    lbl_ratio_err: "Die Verhältnisse müssen sich auf 100% summieren!",

    sec_replenish: "Nachschubplanung der Lieferkette",
    lbl_strategy: "Nachbestellstrategie",
    opt_strat_jit: "Just-In-Time (Bestellung für Nachfrage in Monat N+2)",
    opt_strat_ss: "Sicherheitsbestand (Tage der Abdeckung)",
    opt_strat_manual: "Manuelle Bestellplanung",
    lbl_ss_days: "Sicherheitsbestand Tage der Abdeckung",

    sec_prod_edit: "Produkteinstellungen",
    lbl_select_prod: "Produkt zum Bearbeiten auswählen",
    lbl_unit_cost: "Stückkosten ($)",
    lbl_retail_price: "Verkaufspreis ($)",
    lbl_initial_sales: "Anfänglicher monatlicher Absatz (Monat 1)",
    lbl_growth_rate: "Monatliches Wachstum (%)",
    lbl_initial_stock: "Anfänglicher Lagerbestand (Einheiten)",
    lbl_lead_time: "Lieferzeit (Tage)",
    lbl_moq: "Mindestbestellmenge (MOQ)",
    lbl_deposit: "Anzahlung an Lieferanten (%)",

    // Charts
    chart_title: "Visuelle Prognosen",
    tab_chart_cash: "Cashflow",
    tab_chart_inv: "Lagerbestände",
    tab_chart_rev: "Umsatz vs. Kosten",
    
    chart_ending_cash_label: "Endgültiger Kassenbestand ($)",
    chart_net_cash_label: "Netto-Cashflow ($)",
    chart_ending_cash_axis: "Endgültiger Kassenbestand",
    chart_monthly_net_axis: "Monatlicher Netto-Cashflow",
    
    chart_ending_stock_label: "Endbestand (Einheiten)",
    chart_actual_sales_label: "Tatsächlicher Absatz (Einheiten)",
    chart_stockout_label: "Lieferengpässe (Ungedeckte Nachfrage)",
    chart_safety_stock_label: "Sicherheitsbestand Ziel",
    chart_units_axis: "Einheiten",

    chart_revenue_label: "Erzielter Umsatz ($)",
    chart_supplier_paid_label: "Gezahltes Lieferantencash ($)",
    chart_cogs_label: "Herstellungskosten (COGS) ($)",
    chart_value_axis: "Wert ($)",

    // Detailed Grid Sheet
    grid_title: "Detailliertes 12-Monats-Blatt",
    grid_subtitle: "Parameter konfigurieren und monatliche Cashflow- und Lagerbestandsflüsse analysieren",
    tab_grid_all: "Aggregierte Ansicht",
    grid_metric_header: "Kennzahl (12 Monate)",

    // Aggregated grid rows
    row_hdr_demand: "NACHFRAGE- & ABSATZPROGNOSEN",
    row_total_sales: "Verkaufte Einheiten Gesamt",
    row_total_stockouts: "Lieferengpässe Gesamt (Einheiten)",
    row_hdr_inv_val: "LAGERBEWERTUNG (ZU ANSCHAFFUNGSKOSTEN)",
    row_beg_inv_val: "Anfangslagerwert",
    row_po_placed_val: "Abgegebene Bestellungen",
    row_rcv_inv_val: "Erhaltener Lagerwert",
    row_end_inv_val: "Endgültiger Lagerwert",
    row_hdr_cash_flow: "CASHFLOW-BLATT",
    row_sales_rev: "Erzielter Umsatz",
    row_cust_receipts: "Zahlungseingänge von Kunden",
    row_supp_payments: "Zahlungen an Lieferanten",
    row_fixed_overhead: "Gemeinkosten (Fix)",
    row_mkt_spend: "Marketingausgaben",
    row_net_cash: "Netto-Monatscashflow",
    row_ending_cash: "Endgültiger Kassenbestand",

    // Product grid rows
    row_hdr_demand_units: "NACHFRAGE & ABSATZ (EINHEITEN)",
    row_sales_plan: "Prognostizierter Absatzplan",
    row_sales_achieved: "Tatsächlich erzielter Absatz",
    row_unmet_demand: "Ungedeckte Nachfrage (Lieferengpässe)",
    row_hdr_inv_units: "LAGERKONTROLLE (EINHEITEN)",
    row_starting_stock: "Anfangslagerbestand",
    row_received_inflows: "Erhaltener Lagerzugang (Lieferzeit)",
    row_ending_stock: "Endlagerbestand",
    row_hdr_financials: "FINANZIELLE LEISTUNG ($)",
    row_prod_revenue: "Umsatz",
    row_prod_cogs: "Herstellungskosten (COGS)",
    row_prod_gross_profit: "Erzielter Rohgewinn",
    row_hdr_cash_timing: "ZEITLICHE CASH-EFFEKTE ($)",
    row_supp_cash_paid: "Gezahltes Lieferantencash (Bestellungen)"
  }
};

export const productTranslations = {
  en: {
    'prod-1': "Product 1 (Sealer)",
    'prod-2': "Product 2 (250ml)",
    'prod-3': "Product 3 (300ml)",
    'prod-4': "Product 4 (500ml)",
    'prod-5': "Product 5 (Lids)"
  },
  de: {
    'prod-1': "Produkt 1 (Versiegeler)",
    'prod-2': "Produkt 2 (250ml)",
    'prod-3': "Produkt 3 (300ml)",
    'prod-4': "Produkt 4 (500ml)",
    'prod-5': "Produkt 5 (Deckel)"
  }
};

export function translateProduct(id, lang) {
  const currentLang = translations[lang] ? lang : 'en';
  return productTranslations[currentLang][id] || id;
}

export function translateMonth(mIdx, lang) {
  if (lang === 'de') {
    return `Monat ${mIdx + 1}`;
  }
  return `Month ${mIdx + 1}`;
}
