import re

with open('engine.js', 'r') as f:
    content = f.read()

# 1. Update DEFAULT_SCENARIOS
lease_models_str = """
    leaseModels: {
      'lease-1': { id: 'lease-1', fee: 49, commitment: 1000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-2': { id: 'lease-2', fee: 39, commitment: 1500, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-3': { id: 'lease-3', fee: 29, commitment: 2000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-4': { id: 'lease-4', fee: 19, commitment: 3000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 },
      'lease-5': { id: 'lease-5', fee: 0, commitment: 4000, initialSalesVolume: 0, growthRateMoM: 5.0, downpayment: 200 }
    },"""

# Add to scen-baseline
content = re.sub(
    r"(demandModel: 'sealerDriven',)",
    r"\1" + lease_models_str,
    content,
    count=1
)

# Add to scen-independent
content = re.sub(
    r"(demandModel: 'independent',)",
    r"\1" + lease_models_str,
    content,
    count=1
)

# Add to scen-conservative
content = re.sub(
    r"(demandModel: 'sealerDriven',)",
    r"\1" + lease_models_str,
    content,
    count=0 # wait, it will replace both 'sealerDriven'. Let's replace all instances.
)

# Actually, let's do it safer:
content = f.read() # wait file is closed
