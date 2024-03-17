const wrapperPrefix = "virtual_keyboard_input_wrapper_";
const uppercaseLetters = ["Ă", "Â", "Î", "Ș", "Ț"];
const lowercaseLetters = ["ă", "â", "î", "ș", "ț"];

let virtualKeyboardIsOpen = false;
let shiftIsPressed = false;

function renderLetters(virtualKeyboard, input, uppercase) {
  letters = uppercase ? uppercaseLetters : lowercaseLetters;

  letters.forEach((letter) => {
    let letterButton = document.createElement("div");
    letterButton.innerText = letter;
    letterButton.className = "button virtual_keyboard_letter_button";

    letterButton.addEventListener("click", () => {
      input.value += letter;
      closeVirtualKeyboard();
      input.focus();
    });

    virtualKeyboard.appendChild(letterButton);
  });

  let shiftButton = document.createElement("div");
  shiftButton.className = "button virtual_keyboard_shift_button";
  shiftButton.innerText = shiftIsPressed ? "SHIFT" : "Shift";

  shiftButton.addEventListener("click", () => {
    onShiftPressed(virtualKeyboard, input);
  });

  virtualKeyboard.appendChild(shiftButton);
}

function onShiftPressed(virtualKeyboard, input) {
  virtualKeyboard.replaceChildren();
  shiftIsPressed = !shiftIsPressed;
  renderLetters(virtualKeyboard, input, shiftIsPressed);
}

function openVirtualKeyboard(anchor, input) {
  let virtualKeyboard = document.createElement("div");

  virtualKeyboard.id = "virtualKeyboard";
  virtualKeyboard.className = "virtual_keyboard";

  renderLetters(virtualKeyboard, input);

  anchor.appendChild(virtualKeyboard);
  virtualKeyboardIsOpen = true;
}

function closeVirtualKeyboard() {
  document.getElementById("virtualKeyboard").remove();

  virtualKeyboardIsOpen = false;
  shiftIsPressed = false;
}

function createVirtualKeyboardToggle(inputElement) {
  if (inputElement.parentNode.id.startsWith(wrapperPrefix)) {
    return;
  }

  let inputWrapper = document.createElement("span");
  inputWrapper.id = wrapperPrefix + Math.round(Math.random() * 1000);
  inputWrapper.className = "virtual_keyboard_input_wrapper";

  inputElement.parentNode.insertBefore(inputWrapper, inputElement);
  inputWrapper.appendChild(inputElement);

  let toggleAnchor = document.createElement("div");
  toggleAnchor.className = "virtual_keyboard_toggle_anchor";

  let toggle = document.createElement("span");
  toggle.className = "button virtual_keyboard_toggle";
  toggle.innerText = "ă…";

  toggleAnchor.appendChild(toggle);
  toggle.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    console.log("click");
    onVirtualKeyboardToggleClick(toggleAnchor, inputElement);
  });

  inputWrapper.appendChild(toggleAnchor);

  return toggle;
}

function onVirtualKeyboardToggleClick(toggleAnchor, element) {
  if (virtualKeyboardIsOpen) {
    closeVirtualKeyboard();
  } else {
    openVirtualKeyboard(toggleAnchor, element);
  }
}

let inputs = document.querySelectorAll("input,textarea");

for (let input of inputs) {
  // Circuit-breakers extracted from: https://stackoverflow.com/questions/50628101/use-extension-to-add-button-to-text-field-not-clickable

  if (input.type === "button" || input.type === "submit") {
    continue;
  }

  if (!input.contentEditable || !input.type.match(/email|search|text/)) {
    continue;
  }

  console.log("created virtual keyboard toggle for input", input);
  let toggle = createVirtualKeyboardToggle(input);

  input.parentElement.addEventListener("mouseenter", (event) => {
    toggle.style.visibility = "visible";
    event.stopImmediatePropagation();
  });

  input.parentElement.addEventListener("mouseleave", (event) => {
    if (virtualKeyboardIsOpen) {
      closeVirtualKeyboard();
    }
    toggle.style.visibility = "hidden";
    event.stopImmediatePropagation();
  });

  input.addEventListener("submit", (event) => {
    console.log("submit fired", input);
  });
}
