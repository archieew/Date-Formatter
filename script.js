const currentDateParagraph = document.getElementById("current-date");
const customDropdown = document.getElementById("custom-dropdown");
const dropdownList = document.getElementById("dropdown-list");
const dropdownOptions = dropdownList.querySelectorAll(".dropdown-option");
const selectedValueSpan = document.getElementById("selected-value");

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const hours = date.getHours();
const minutes = date.getMinutes();

const formattedDate = `${day}-${month}-${year}`;
currentDateParagraph.textContent = formattedDate;

// Custom dropdown logic
function setDateFormat(format, label) {
  switch (format) {
    case "yyyy-mm-dd":
      currentDateParagraph.innerHTML = formattedDate
        .split("-")
        .reverse()
        .join("-");
      break;
    case "mm-dd-yyyy-h-mm":
      currentDateParagraph.innerHTML = `<span class="date-part">${month}-${day}-${year}</span><br><span class="time-part">${hours} Hours ${minutes} Minutes</span>`;
      break;
    default:
      currentDateParagraph.innerHTML = formattedDate;
  }
  selectedValueSpan.textContent = label;
  dropdownOptions.forEach(opt => opt.setAttribute("aria-selected", "false"));
  const selected = Array.from(dropdownOptions).find(opt => opt.dataset.value === format);
  if (selected) selected.setAttribute("aria-selected", "true");
}

customDropdown.addEventListener("click", (e) => {
  // Only toggle if clicking the dropdown or arrow, not an option
  if (
    e.target === customDropdown ||
    e.target.classList.contains("selected-value") ||
    e.target.classList.contains("dropdown-arrow")
  ) {
    const expanded = customDropdown.getAttribute("aria-expanded") === "true";
    customDropdown.setAttribute("aria-expanded", String(!expanded));
    dropdownList.hidden = expanded;
    if (!expanded) {
      // Focus first selected or first option
      const selected = dropdownList.querySelector('[aria-selected="true"]') || dropdownOptions[0];
      selected.focus();
    }
  }
});

// Option click
[...dropdownOptions].forEach(option => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();
    setDateFormat(option.dataset.value, option.textContent);
    customDropdown.setAttribute("aria-expanded", "false");
    dropdownList.hidden = true;
    customDropdown.blur();
  });
  option.setAttribute("tabindex", "0");
});

// Keyboard navigation
customDropdown.addEventListener("keydown", (e) => {
  const expanded = customDropdown.getAttribute("aria-expanded") === "true";
  if (e.key === "ArrowDown" && !expanded) {
    customDropdown.setAttribute("aria-expanded", "true");
    dropdownList.hidden = false;
    const selected = dropdownList.querySelector('[aria-selected="true"]') || dropdownOptions[0];
    selected.focus();
    e.preventDefault();
  } else if (e.key === "Escape" && expanded) {
    customDropdown.setAttribute("aria-expanded", "false");
    dropdownList.hidden = true;
    customDropdown.focus();
  }
});

dropdownList.addEventListener("keydown", (e) => {
  const options = Array.from(dropdownOptions);
  let idx = options.indexOf(document.activeElement);
  if (e.key === "ArrowDown") {
    idx = (idx + 1) % options.length;
    options[idx].focus();
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    idx = (idx - 1 + options.length) % options.length;
    options[idx].focus();
    e.preventDefault();
  } else if (e.key === "Enter" || e.key === " ") {
    document.activeElement.click();
    customDropdown.setAttribute("aria-expanded", "false");
    dropdownList.hidden = true;
    customDropdown.blur();
    e.preventDefault();
  } else if (e.key === "Escape") {
    customDropdown.setAttribute("aria-expanded", "false");
    dropdownList.hidden = true;
    customDropdown.focus();
  }
});

// Close dropdown when clicking outside
window.addEventListener("mousedown", (e) => {
  if (!customDropdown.contains(e.target)) {
    customDropdown.setAttribute("aria-expanded", "false");
    dropdownList.hidden = true;
  }
});
