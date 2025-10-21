let State = {
  bill: 0,
  people: 0,
  tipRate: 15,
};

init(document, State);

function init(document, State) {
  let form = document.querySelector(".tip-calculator");
  let inputs = form.querySelectorAll(".bill, .people, .custom");
  let reset = form.querySelector(".reset");
  let tipRates = form.querySelectorAll(".tip-btn");
  let tipAmountWrapper = document.querySelector(".tip-amount-wrapper");
  let totalSplitWrapper = document.querySelector(".total-split-wrapper");
  let billError = document.querySelector(".error-bill");
  let peopleError = document.querySelector(".error-people");
  let tipRateError = document.querySelector(".error-tiprate");
  let tipAmount = document.querySelector(".tip-amount");
  let totalSplitAmount = document.querySelector(".total-split-amount");

  let eventObjects = {
    form,
    inputs,
    reset,
    tipRates,
  };

  let errorObject = {
    billError,
    peopleError,
    tipRateError,
  };

  let displayObjects = {
    tipAmount,
    totalSplitAmount,
    tipAmountWrapper,
    totalSplitWrapper,
  };

  updateSelected(State.tipRate, tipRates);
  registerEvents(State.tipRate, eventObjects, errorObject, displayObjects);
}

function registerEvents(
  tipRate = 15,
  { form, inputs, tipRates } = eventObjects,
  errorObject,
  displayObjects
) {
  form.addEventListener("submit", handleOnSubmit);

  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculateTip(displayObjects);
      }
    });
  });

  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      reset.classList.remove("disabled");

      if (e.target.name === "tipRate") {
        removeSelected(tipRates);
      } else {
        formatLiveInputNumber(e);
      }

      if (validateInput(e, errorObject) === 1) {
        State[e.target.name] = parseFloat(e.target.value.replace(/,/g, ""));
        calculateTip(displayObjects);
      } else {
        State[e.target.name] = 0;
        resetDisplay(displayObjects);
      }
    });
  });

  tipRates.forEach((tipRateBtn) => {
    tipRateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (tipRate !== e.target.dataset.tipRate) {
        tipRate = parseFloat(e.target.dataset.tipRate);
        State.tipRate = tipRate;
        reset.classList.remove("disabled");
        resetCustom(inputs[1]);
        resetCustomIfError(inputs[1], errorObject.tipRateError);
        updateSelected(tipRate, tipRates);
        calculateTip(displayObjects);
      }
    });
  });

  reset.addEventListener("click", () => {
    updateSelected((tipRate = 15), tipRates);
    resetDisplay(displayObjects);
    resetErrors(errorObject, inputs);
    reset.classList.add("disabled");
    State = {
      bill: 0,
      people: 0,
      tipRate: 15,
    };
  });
}

function handleOnSubmit(e) {
  e.preventDefault();
}

function updateSelected(tipRate = 15, tipRates) {
  tipRates.forEach((btn) => {
    if (btn.classList.contains("selected")) {
      if (parseFloat(btn.dataset.tipRate) !== tipRate)
        btn.classList.remove("selected");
    } else {
      if (parseFloat(btn.dataset.tipRate) === tipRate)
        btn.classList.add("selected");
    }
  });
}

function removeSelected(tipRates) {
  tipRates.forEach((btn) => btn.classList.remove("selected"));
}

function formatLiveInputNumber(e) {
  let cursorPos = e.target.selectionStart;
  let value = e.target.value;
  let digits = value.replace(/,/g, "");

  if (!/^\d*\.?\d*$/.test(digits)) return;

  let [integer, decimal] = digits.split(".");

  let formattedInt = integer ? Number(integer).toLocaleString() : "";
  let formatted =
    decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt;

  let diff = formatted.length - value.length;

  e.target.value = formatted;
  e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
}

function validateInput(event, errorObject) {
  let data = {
    name: event.target.name,
    value:
      event.target.name === "tipRate"
        ? event.target.value.replace("%", "")
        : event.target.value.replace(/,/g, ""),
  };

  if (/^0+(?:\.0+)?$/.test(data.value)) {
    return showError(data.name, "Can't be Zero", errorObject, event.target);
  } else if (
    (data.name === "bill" || data.name === "tipRate") &&
    !/^(?:\d*\.\d+|\d+\.?\d*)$/.test(data.value)
  ) {
    return showError(
      data.name,
      "Valid input required",
      errorObject,
      event.target
    );
  } else if (data.name === "bill" && data.value > 10_000_000) {
    return showError(
      data.name,
      "bill <= 10 million",
      errorObject,
      event.target
    );
  } else if (data.name === "tipRate" && data.value > 100) {
    return showError(data.name, "tip % <= 100", errorObject, event.target);
  } else if (data.name === "people" && !/^\d+\.?0*$/.test(data.value)) {
    return showError(
      data.name,
      "Valid input required",
      errorObject,
      event.target
    );
  } else {
    return removeError(data.name, errorObject, event.target);
  }
}

function showError(
  name,
  errorMsg,
  { billError, peopleError, tipRateError } = errorObject,
  input
) {
  // console.log(`error-${name}: ${errorMsg}`);

  if (name === "bill") {
    billError.classList.remove("hidden");
    billError.textContent = errorMsg;
    input.classList.add("invalid");
  } else if (name === "people") {
    peopleError.classList.remove("hidden");
    peopleError.textContent = errorMsg;
    input.classList.add("invalid");
  } else {
    tipRateError.classList.remove("hidden");
    tipRateError.textContent = errorMsg;
    input.classList.add("invalid");
  }

  return 0;
}

function removeError(
  name,
  { billError, peopleError, tipRateError } = errorObject,
  input
) {
  if (name === "bill") billError.classList.add("hidden");

  if (name === "people") peopleError.classList.add("hidden");

  if (name === "tipRate") tipRateError.classList.add("hidden");

  input.classList.remove("invalid");

  return 1;
}

function resetCustom(customInput) {
  customInput.value = "";
}

function resetCustomIfError(customInput, tipRateError) {
  if (customInput.classList.contains("invalid")) {
    tipRateError.classList.add("hidden");
    customInput.classList.remove("invalid");
    customInput.value = "";
  }
}

function calculateTip(displayObjects) {
  let { bill, people, tipRate } = State;

  if (bill === 0 || people === 0) {
    return updateUI(0, 0, displayObjects);
  }

  let tipAmountPerPerson = (bill * (tipRate / 100)) / people;
  let totalSplitPerPerson = (bill * (1 + tipRate / 100)) / people;

  if (!isNaN(tipAmountPerPerson) && !isNaN(totalSplitPerPerson)) {
    updateUI(tipAmountPerPerson, totalSplitPerPerson, displayObjects);
  }
}

function updateUI(
  tipAmountPerPerson,
  totalSplitPerPerson,
  {
    tipAmount,
    totalSplitAmount,
    tipAmountWrapper,
    totalSplitWrapper,
  } = displayObjects
) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  tipAmountPerPerson = formatter.format(tipAmountPerPerson);
  totalSplitPerPerson = formatter.format(totalSplitPerPerson);

  console.log(
    `${countDigits(tipAmountPerPerson)}: ${countDigits(totalSplitPerPerson)}`
  );

  if (
    countDigits(totalSplitPerPerson) >= 10 ||
    countDigits(tipAmountPerPerson) >= 10
  ) {
    tipAmountWrapper.classList.add("flex-column");
    totalSplitWrapper.classList.add("flex-column");
  } else {
    [tipAmountWrapper, totalSplitWrapper].forEach((wrapper) => {
      if (wrapper.classList.contains("flex-column"))
        wrapper.classList.remove("flex-column");
    });
  }

  tipAmount.textContent = tipAmountPerPerson;
  totalSplitAmount.textContent = totalSplitPerPerson;
}

function resetDisplay({ tipAmount, totalSplitAmount } = displayObjects) {
  tipAmount.textContent = `$0.00`;
  totalSplitAmount.textContent = `$0.00`;
}

function resetErrors(errorObject, inputs) {
  for (const error in errorObject) {
    if (!Object.hasOwn(errorObject, error)) continue;
    const element = errorObject[error];
    element.classList.add("hidden");
  }

  inputs.forEach((input) => {
    input.classList.remove("invalid");
  });
}

function countDigits(num) {
  let matches = num.toString().match(/[$\d.?,?]/g);
  return matches ? matches.length : 0;
}
