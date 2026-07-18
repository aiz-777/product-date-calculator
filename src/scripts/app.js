const MS_PER_DAY = 24 * 60 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const expiryForm = document.querySelector("#expiry-form");
const dateDiffForm = document.querySelector("#date-diff-form");
const remainingForm = document.querySelector("#remaining-form");
const correctionForm = document.querySelector("#correction-form");
const productForm = document.querySelector("#product-form");
const productList = document.querySelector("#product-list");

const initialResults = {
  "#expiry-result": "Заповніть дані, щоб побачити результат.",
  "#date-diff-result": "Вкажіть початкову та кінцеву дату.",
  "#remaining-result": "Вкажіть кінцеву дату, щоб перевірити залишок.",
  "#correction-result": "Можна вводити додатні та від'ємні значення днів.",
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatDate = (date) => dateFormatter.format(date);

const addDuration = (date, value, unit) => {
  const result = new Date(date);

  if (unit === "days") {
    result.setDate(result.getDate() + value);
  }

  if (unit === "months") {
    result.setMonth(result.getMonth() + value);
  }

  if (unit === "years") {
    result.setFullYear(result.getFullYear() + value);
  }

  return result;
};

const today = () => {
  const currentDate = new Date();

  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
};

const getDaysLeft = (targetDate) =>
  Math.ceil((targetDate.getTime() - today().getTime()) / MS_PER_DAY);

const getStatusText = (daysLeft) => {
  if (daysLeft < 0) {
    return {
      className: "expired",
      title: "Строк придатності минув",
      text: `Продукт прострочений на ${Math.abs(daysLeft)} дн.`,
    };
  }

  if (daysLeft === 0) {
    return {
      className: "warning",
      title: "Останній день використання",
      text: "Строк придатності закінчується сьогодні.",
    };
  }

  if (daysLeft <= 3) {
    return {
      className: "warning",
      title: "Скоро закінчується",
      text: `Залишилось ${daysLeft} дн.`,
    };
  }

  return {
    className: "ok",
    title: "Продукт ще придатний",
    text: `Залишилось ${daysLeft} дн.`,
  };
};

const setResult = (elementId, status, details) => {
  const element = document.querySelector(elementId);

  element.className = `result result--${status.className}`;
  element.innerHTML = `<strong>${status.title}</strong>${details}`;
};

const resetResult = (elementId) => {
  const element = document.querySelector(elementId);

  element.className = "result";
  element.textContent = initialResults[elementId];
};

const bindFormReset = (form, elementId) => {
  form.addEventListener("reset", () => {
    resetResult(elementId);
  });
};

expiryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const productionDate = parseDate(document.querySelector("#production-date").value);
  const value = Number(document.querySelector("#shelf-life-value").value);
  const unit = document.querySelector("#shelf-life-unit").value;
  const expiryDate = addDuration(productionDate, value, unit);
  const status = getStatusText(getDaysLeft(expiryDate));

  setResult(
    "#expiry-result",
    status,
    `Кінцева дата придатності: <strong>${formatDate(expiryDate)}</strong>${status.text}`,
  );
});

bindFormReset(expiryForm, "#expiry-result");

dateDiffForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const startDate = parseDate(document.querySelector("#date-diff-start").value);
  const endDate = parseDate(document.querySelector("#date-diff-end").value);
  const daysDifference = Math.round(
    (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
  );
  const status =
    daysDifference < 0
      ? {
          className: "expired",
          title: "Кінцева дата раніше початкової",
        }
      : {
          className: "ok",
          title: "Різницю пораховано",
        };

  setResult(
    "#date-diff-result",
    status,
    `Початкова дата: <strong>${formatDate(startDate)}</strong>Кінцева дата: <strong>${formatDate(endDate)}</strong>Різниця: <strong>${daysDifference} дн.</strong>`,
  );
});

bindFormReset(dateDiffForm, "#date-diff-result");

remainingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bestBeforeDate = parseDate(document.querySelector("#best-before-date").value);
  const daysLeft = getDaysLeft(bestBeforeDate);
  const status = getStatusText(daysLeft);

  setResult(
    "#remaining-result",
    status,
    `Дата придатності: <strong>${formatDate(bestBeforeDate)}</strong>${status.text}`,
  );
});

bindFormReset(remainingForm, "#remaining-result");

correctionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const dbTotalDays = Number(document.querySelector("#correction-db-total").value);
  const dbCurrentDays = Number(document.querySelector("#correction-db-current").value);
  const actualCurrentDays = Number(
    document.querySelector("#correction-actual-current").value,
  );
  const correction = actualCurrentDays - dbCurrentDays;
  const correctedTotalDays = dbTotalDays + correction;
  const action =
    correction === 0
      ? "залишити без змін"
      : correction > 0
        ? `збільшити на ${correction} дн.`
        : `зменшити на ${Math.abs(correction)} дн.`;
  const status =
    correction === 0
      ? {
          className: "ok",
          title: "Коригування не потрібне",
        }
      : {
          className: "warning",
          title: "Потрібно відкоригувати картку",
        };

  setResult(
    "#correction-result",
    status,
    `У картці товару потрібно вказати: <strong>${correctedTotalDays} дн.</strong>Дія: ${action}. Формула: ${dbTotalDays} + (${actualCurrentDays} - ${dbCurrentDays}) = ${correctedTotalDays}.`,
  );
});

bindFormReset(correctionForm, "#correction-result");

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = document.querySelector("#product-name");
  const daysInput = document.querySelector("#product-days");
  const daysLeft = Number(daysInput.value);
  const status = getStatusText(daysLeft);

  const item = document.createElement("li");
  const content = document.createElement("div");
  const productName = document.createElement("p");
  const productMeta = document.createElement("p");
  const itemActions = document.createElement("div");
  const productStatus = document.createElement("span");
  const deleteButton = document.createElement("button");

  item.className = "product-item";
  productName.className = "product-item__name";
  productMeta.className = "product-item__meta";
  itemActions.className = "product-item__actions";
  productStatus.className = `product-item__status product-item__status--${status.className}`;
  deleteButton.className = "button button--danger product-item__delete";
  deleteButton.type = "button";

  productName.textContent = nameInput.value;
  productMeta.textContent = `Залишок придатності: ${daysLeft} дн.`;
  productStatus.textContent = status.text;
  deleteButton.textContent = "Видалити";

  deleteButton.addEventListener("click", () => {
    item.remove();
  });

  content.append(productName, productMeta);
  itemActions.append(productStatus, deleteButton);
  item.append(content, itemActions);
  productList.prepend(item);
  productForm.reset();
});