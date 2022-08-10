const currentEnergyEfficiencyE = document.querySelector(
  "#current-energy-efficiency"
);
const potentialEnergyEfficiencyE = document.querySelector(
  "#potential-energy-efficiency"
);
const lightingCostCurrentE = document.querySelector("#lighting-cost-current");
const lightingCostPotentialE = document.querySelector(
  "#lighting-cost-potential"
);
const co2EmissionsCurrentE = document.querySelector("#co2-emissions-current");
const co2EmissionsPotentialE = document.querySelector(
  "#co2-emissions-potential"
);
const heatingCostCurrentE = document.querySelector("#heating-cost-current");
const heatingCostPotentialE = document.querySelector("#heating-cost-potential");
const environmentImpactCurrentE = document.querySelector(
  "#environment-impact-current"
);
const environmentImpactPotentialE = document.querySelector(
  "#environment-impact-potential"
);
const energyConsumptionCurrentE = document.querySelector(
  "#energy-consumption-current"
);
const energyConsumptionPotentialE = document.querySelector(
  "#energy-consumption-potential"
);
const lowEnergyLightingE = document.querySelector("#low-energy-lighting");
const hotWaterCostPotentialE = document.querySelector(
  "#hot-water-cost-potential"
);

const form = document.querySelector("#edit-epc-form");

form.addEventListener("submit", function (e) {
  // validate fields
  const isCurrentEnergyEfficiency = checkCurrentEnergyEfficiency();
  const isPotentialEnergyEfficiency = checkPotentialEnergyEfficiency();
  const isLightingCostCurrent = checkLightingCostCurrent();
  const isLightingCostPotential = checkLightingCostPotential();
  const isCo2EmissionsCurrent = checkCo2EmissionsCurrent();
  const isCo2EmissionsPotential = checkCo2EmissionsPotential();
  const isHeatingCostCurrent = checkHeatingCostCurrent();
  const isHeatingCostPotential = checkHeatingCostPotential();
  const isEnvironmentImpactCurrent = checkEnvironmentImpactCurrent();
  const isEnvironmentImpactPotential = checkEnvironmentImpactPotential();
  const isEnergyConsumptionCurrent = checkEnergyConsumptionCurrent();
  const isEnergyConsumptionPotential = checkEnergyConsumptionPotential();
  const isLowEnergyLighting = checkLowEnergyLighting();
  const isHotWaterCostPotential = checkHotWaterCostPotential();

  const isValid =
    isCurrentEnergyEfficiency &&
    isPotentialEnergyEfficiency &&
    isLightingCostCurrent &&
    isLightingCostPotential &&
    isCo2EmissionsCurrent &&
    isCo2EmissionsPotential &&
    isHeatingCostCurrent &&
    isHeatingCostPotential &&
    isEnvironmentImpactCurrent &&
    isEnvironmentImpactPotential &&
    isEnergyConsumptionCurrent &&
    isEnergyConsumptionPotential &&
    isLowEnergyLighting &&
    isHotWaterCostPotential;

  if (!isValid) {
    // Prevent form from being sent by cancelling the event
    e.preventDefault();
  }
});

/* Utility functions */
const isRequired = (value) => (value === "" ? false : true);

const isLengthBetween = (length, min, max) =>
  length < min || length > max ? false : true;

const isValueBetween = (value, min, max) =>
  Number(value) < Number(min) || Number(value) > Number(max) ? false : true;

const isMoreThanPotential = (value, potential) =>
  Number(value) < Number(potential) ? false : true;

/* Functions to show error/success */
const showError = (input, message) => {
  // get the form-field element
  const formField = input.parentElement;
  // add the error class
  formField.classList.remove("success");
  formField.classList.add("error");

  // show the error message
  const error = formField.querySelector("small");
  error.textContent = message;
};

const showSuccess = (input) => {
  // get the form-field element
  const formField = input.parentElement;

  // remove the error class
  formField.classList.remove("error");
  formField.classList.add("success");

  // hide the error message
  const error = formField.querySelector("small");
  error.textContent = "";
};

/* Input field validating functions */
const checkCurrentEnergyEfficiency = () => {
  var valid = false;
  const min = "1",
    max = "100";

  const currentEnergyEfficiency = currentEnergyEfficiencyE.value.trim();

  if (!isRequired(currentEnergyEfficiency)) {
    showError(
      currentEnergyEfficiencyE,
      "Current energy efficiency cannot be blank."
    );
  } else if (!isValueBetween(currentEnergyEfficiency, min, max)) {
    showError(
      currentEnergyEfficiencyE,
      `Current energy efficiency must be between ${min} and ${max}`
    );
  } else {
    showSuccess(currentEnergyEfficiencyE);
    valid = true;
  }
  return valid;
};

const checkPotentialEnergyEfficiency = () => {
  var valid = false;
  const min = "1",
    max = "100";

  const potentialEnergyEfficiency = potentialEnergyEfficiencyE.value.trim();

  if (!isRequired(potentialEnergyEfficiency)) {
    showError(
      potentialEnergyEfficiencyE,
      "Potential energy efficiency cannot be blank."
    );
  } else if (!isValueBetween(potentialEnergyEfficiency, min, max)) {
    showError(
      potentialEnergyEfficiencyE,
      `Potential energy efficiency must be between ${min} and ${max}`
    );
  } else {
    showSuccess(potentialEnergyEfficiencyE);
    valid = true;
  }
  return valid;
};

const checkLightingCostCurrent = () => {
  var valid = false;
  const min = "1",
    max = "1000";

  const lightingCostCurrent = lightingCostCurrentE.value.trim();

  if (!isRequired(lightingCostCurrent)) {
    showError(lightingCostCurrentE, "Lighting cost current cannot be blank.");
  } else if (!isValueBetween(lightingCostCurrent, min, max)) {
    showError(
      lightingCostCurrentE,
      `Lighting cost current must be between ${min} and ${max}`
    );
  } else {
    showSuccess(lightingCostCurrentE);
    valid = true;
  }
  return valid;
};

const checkLightingCostPotential = () => {
  var valid = false;
  const min = "1",
    max = "1000";

  const lightingCostPotential = lightingCostPotentialE.value.trim();

  if (!isRequired(lightingCostPotential)) {
    showError(
      lightingCostPotentialE,
      "Lighting cost potential cannot be blank."
    );
  } else if (!isValueBetween(lightingCostPotential, min, max)) {
    showError(
      lightingCostPotentialE,
      `Lighting cost potential must be between ${min} and ${max}`
    );
  } else {
    showSuccess(lightingCostPotentialE);
    valid = true;
  }
  return valid;
};

const checkCo2EmissionsCurrent = () => {
  var valid = false;
  const min = "1",
    max = "100";

  const co2EmissionsCurrent = co2EmissionsCurrentE.value.trim();

  if (!isRequired(co2EmissionsCurrent)) {
    showError(co2EmissionsCurrentE, "CO2 emissions current cannot be blank.");
  } else if (!isValueBetween(co2EmissionsCurrent, min, max)) {
    showError(
      co2EmissionsCurrentE,
      `CO2 emissions current must be between ${min} and ${max}`
    );
  } else {
    showSuccess(co2EmissionsCurrentE);
    valid = true;
  }
  return valid;
};

const checkCo2EmissionsPotential = () => {
  var valid = false;
  const min = "1",
    max = "100";

  const co2EmissionsPotential = co2EmissionsPotentialE.value.trim();

  if (!isRequired(co2EmissionsPotential)) {
    showError(
      co2EmissionsPotentialE,
      "CO2 emissions potential cannot be blank."
    );
  } else if (!isValueBetween(co2EmissionsPotential, min, max)) {
    showError(
      co2EmissionsPotentialE,
      `CO2 emissions potential must be between ${min} and ${max}`
    );
  } else {
    showSuccess(co2EmissionsPotentialE);
    valid = true;
  }
  return valid;
};

const checkHeatingCostCurrent = () => {
  var valid = false;
  const min = "1",
    max = "1000";

  const heatingCostCurrent = heatingCostCurrentE.value.trim();

  if (!isRequired(heatingCostCurrent)) {
    showError(heatingCostCurrentE, "Heating cost current cannot be blank.");
  } else if (!isValueBetween(heatingCostCurrent, min, max)) {
    showError(
      heatingCostCurrentE,
      `Heating cost current must be between ${min} and ${max}`
    );
  } else {
    showSuccess(heatingCostCurrentE);
    valid = true;
  }
  return valid;
};

const checkHeatingCostPotential = () => {
  var valid = false;
  const min = "1",
    max = "1000";

  const heatingCostPotential = heatingCostPotentialE.value.trim();

  if (!isRequired(heatingCostPotential)) {
    showError(heatingCostPotentialE, "Heating cost potential cannot be blank.");
  } else if (!isValueBetween(heatingCostPotential, min, max)) {
    showError(
      heatingCostPotentialE,
      `Heating cost potential must be between ${min} and ${max}`
    );
  } else {
    showSuccess(heatingCostPotentialE);
    valid = true;
  }
  return valid;
};

const checkEnvironmentImpactCurrent = () => {
  var valid = false;
  const min = "1",
    max = "100";

  const environmentImpactCurrent = environmentImpactCurrentE.value.trim();

  if (!isRequired(environmentImpactCurrent)) {
    showError(
      environmentImpactCurrentE,
      "Environment impact current cannot be blank."
    );
  } else if (!isValueBetween(environmentImpactCurrent, min, max)) {
    showError(
      environmentImpactCurrentE,
      `Environment impact current must be between ${min} and ${max}`
    );
  } else {
    showSuccess(environmentImpactCurrentE);
    valid = true;
  }
  return valid;
};

const checkEnergyConsumptionCurrent = () => {
  var valid = false;
  const min = "1",
    max = "1000";

  const energyConsumptionCurrent = energyConsumptionCurrentE.value.trim();
  const energyConsumptionPotential = energyConsumptionPotentialE.value.trim();

  if (!isRequired(energyConsumptionCurrent)) {
    showError(
      energyConsumptionCurrentE,
      "Energy consumption current cannot be blank."
    );
  } else if (!isValueBetween(energyConsumptionCurrent, min, max)) {
    showError(
      energyConsumptionCurrentE,
      `Energy consumption current must be between ${min} and ${max}`
    );
  } else if (
    !isMoreThanPotential(energyConsumptionCurrent, energyConsumptionPotential)
  ) {
    showError(
      energyConsumptionCurrentE,
      `Energy consumption current cannot be less than its potential`
    );
  } else {
    showSuccess(energyConsumptionCurrentE);
    valid = true;
  }
  return valid;
};

const checkLowEnergyLighting = () => {
  var valid = false;
  const min = "1",
    max = "100";

  const lowEnergyLighting = lowEnergyLightingE.value.trim();

  if (!isRequired(lowEnergyLighting)) {
    showError(lowEnergyLightingE, "Low energy lighting cannot be blank.");
  } else if (!isValueBetween(lowEnergyLighting, min, max)) {
    showError(
      lowEnergyLightingE,
      `Low energy lighting must be between ${min} and ${max}`
    );
  } else {
    showSuccess(lowEnergyLightingE);
    valid = true;
  }
  return valid;
};

const checkHotWaterCostPotential = () => {
  var valid = false;
  const min = "1",
    max = "1000";

  const hotWaterCostPotential = hotWaterCostPotentialE.value.trim();

  if (!isRequired(hotWaterCostPotential)) {
    showError(
      hotWaterCostPotentialE,
      "Hot water cost potential cannot be blank."
    );
  } else if (!isValueBetween(hotWaterCostPotential, min, max)) {
    showError(
      hotWaterCostPotentialE,
      `Hot water cost potential must be between ${min} and ${max}`
    );
  } else {
    showSuccess(hotWaterCostPotentialE);
    valid = true;
  }
  return valid;
};

/* Instant feedback feature */
const debounce = (fn, delay = 500) => {
  var timeoutId;
  return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // setup a new timer
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

form.addEventListener("input", (e) => {
  switch (e.target.id) {
    case "current-energy-efficiency":
      checkCurrentEnergyEfficiency();
      break;
    case "potential-energy-efficiency":
      checkPotentialEnergyEfficiency();
      break;
    case "lighting-cost-current":
      checkLightingCostCurrent();
      break;
    case "lighting-cost-potential":
      checkLightingCostPotential();
      break;
    case "co2-emissions-current":
      checkCo2EmissionsCurrent();
      break;
    case "co2-emissions-potential":
      checkCo2EmissionsPotential();
      break;
    case "heating-cost-current":
      checkHeatingCostCurrent();
      break;
    case "heating-cost-potential":
      checkHeatingCostPotential();
      break;
    case "environment-impact-current":
      checkEnvironmentImpactCurrent();
      break;
    case "environment-impact-potential":
      checkEnvironmentImpactPotential();
      break;
    case "energy-consumption-current":
      checkEnergyConsumptionCurrent();
      break;
    case "energy-consumption-potential":
      checkEnergyConsumptionPotential();
      break;
    case "low-energy-lighting":
      checkLowEnergyLighting();
      break;
    case "hot-water-cost-potential":
      checkHotWaterCostPotential();
      break;
  }
});
