const wrapperPrefix = "virtual_keyboard_input_wrapper_";
const uppercaseLetters = ["Ă", "Â", "Î", "Ș", "Ț"];
const lowercaseLetters = ["ă", "â", "î", "ș", "ț"];

let virtualKeyboardIsOpen = false;
let shiftIsPressed = false;

function renderLetters(virtualKeyboard, input, uppercase) {
  letters = uppercase ? uppercaseLetters : lowercaseLetters;

  letters.forEach((letter) => {
    let letterButton = document.createElement("button");
    letterButton.innerText = letter;
    letterButton.className = "virtual_keyboard_letter_button";

    letterButton.addEventListener("click", () => {
      input.value += letter;
      closeVirtualKeyboard();
      input.focus();
    });

    virtualKeyboard.appendChild(letterButton);
  });

  let shiftbutton = document.createElement("button");
  shiftbutton.className = "virtual_keyboard_shift_button";
  shiftbutton.innerText = shiftIsPressed ? "SHIFT" : "Shift";

  shiftbutton.addEventListener("click", () => {
    onShiftPressed(virtualKeyboard, input);
  });

  virtualKeyboard.appendChild(shiftbutton);
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

  let toggle = document.createElement("button");
  toggle.className = "virtual_keyboard_toggle";
  toggle.innerText = "ă…";

  toggleAnchor.appendChild(toggle);
  toggle.addEventListener("click", () => {
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

let inputs = document.getElementsByTagName("input");

for (let input of inputs) {
  let toggle = createVirtualKeyboardToggle(input);

  input.parentElement.addEventListener("mouseenter", () => {
    toggle.style.visibility = "visible";
  });

  input.parentElement.addEventListener("mouseleave", () => {
    if (virtualKeyboardIsOpen) {
      closeVirtualKeyboard();
    }
    toggle.style.visibility = "hidden";
  });
}
