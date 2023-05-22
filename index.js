const pinkColor = "#E70064";
const greenColor = "#38C745";
const greyColor = "#3c3c3b";

const nameInputField = document.querySelector(".form--name-input");
const emailInputField = document.querySelector(".form--email-input");
const cardInputField = document.querySelector(".form--card-input");

const errorMessage = (x, y, z) => {
  if (x.trim() === "") {
    z.style.backgroundColor = "white";
    z.style.borderRadius = "1px";
    z.style.border = "none";
  } else if (y.test(x)) {
    z.style.backgroundColor = greenColor;
    z.style.borderRadius = "4px";
    z.style.border = `3px solid ${greyColor}`;
    z.setCustomValidity("");
  } else {
    z.style.backgroundColor = pinkColor;
    z.style.borderRadius = "4px";
    z.style.border = `3px solid ${greyColor}`;
    z.reportValidity();
  }
};

let amexFlag = false;

const cardProvider = () => {
  amexFlag = false;
  if (cardInputField.value[0] == 3) {
    amexFlag = true;
  }
};

let cardInputFlag = false;
const cardInputFilter = (input) => {
  cardInputFlag =
    input.key == "Backspace" ||
    input.key == "Delete" ||
    input.key == "Enter" ||
    input.key == "Tab" ||
    input.key == "ArrowUp" ||
    input.key == "ArrowDown" ||
    input.key == "ArrowRight" ||
    input.key == "ArrowLeft";
};

const cardLuhnChecker = () => {
  const cardInputNumbers = cardInputField.value.replaceAll(" ", "");
  let cardInputArray = cardInputNumbers.split("");
  let mappedArray = cardInputArray.reverse().map((element, index) => {
    if (index % 2 === 1) {
      if (element * 2 > 9) {
        return Number(String(element * 2)[0]) + Number(String(element * 2)[1]);
      } else {
        return element * 2;
      }
    }
    return element;
  });
  return (
    mappedArray.reduce((current, next) => Number(current) + Number(next)) %
      10 ===
    0
  );
};

const validateName = () => {
  const nameInputValue = nameInputField.value;
  nameInputField.setCustomValidity(
    "Only standard upper and lower case letters are allowed"
  );
  errorMessage(nameInputValue, /^[A-Za-z ]+$/, nameInputField);
};

const validateEmail = () => {
  const emailInputValue = emailInputField.value;
  emailInputField.setCustomValidity(
    "Please enter a valid email. Only standard upper / lower case letters and printable characters: ! # $ % & ' * + - / = ? ^ _ ` { | } ~ are allowed."
  );
  errorMessage(
    emailInputValue,
    /^[^@ ()\[\]\\"\t\r\n\d]+@[^@ ()\[\]\\"\t\r\n\d]+\.[^@ ()\[\]\\"\t\r\n\d]+$/,
    emailInputField
  );
};

const validateCard = () => {
  const cardValue = cardInputField.value;
  cardFieldStyle = cardInputField.style;
  if (cardValue.trim() === "") {
    cardFieldStyle.backgroundColor = "white";
    cardFieldStyle.borderRadius = "1px";
    cardFieldStyle.border = "none";
  } else if (
    (amexFlag &&
      cardLuhnChecker() &&
      cardValue.match(/[0-9]/g).join("").length === 15) ||
    (!amexFlag &&
      (cardValue[0] == 2 || cardValue[0] == 4 || cardValue[0] == 5)  &&
      cardLuhnChecker() &&
      cardValue.match(/[0-9]/g).join("").length === 16)
  ) {
    cardFieldStyle.backgroundColor = greenColor;
    cardFieldStyle.borderRadius = "4px";
    cardFieldStyle.border = `3px solid ${greyColor}`;
    cardInputField.setCustomValidity("");
  } else {
    cardFieldStyle.backgroundColor = pinkColor;
    cardFieldStyle.borderRadius = "4px";
    cardFieldStyle.border = `3px solid ${greyColor}`;
    cardInputField.setCustomValidity("Please enter a valid card number");
    cardInputField.reportValidity();
  }
};

let numberFlag = true;
const forceNumbers = (input) => {
  console.log("step1");
  console.log(`Input field length is 19 ${cardInputField.value.length === 19}`);

  if (
    ((input.ctrlKey || input.metaKey) && input.key === "a") ||
    ((input.ctrlKey || input.metaKey) && input.key === "c") ||
    ((input.ctrlKey || input.metaKey) && input.key === "v")
  ) {
    return;
  }

  let isTextSelected =
    cardInputField.selectionStart !== cardInputField.selectionEnd;
  if (!(input.key >= "0" && input.key <= "9") && !cardInputFlag) {
    console.log("step1.1");
    input.preventDefault();
  } else if (
    !amexFlag &&
    cardInputField.value.length === 19 &&
    !cardInputFlag &&
    !isTextSelected
  ) {
    console.log("working");
    numberFlag = false;
    input.preventDefault();
  } else if (
    amexFlag &&
    cardInputField.value.length === 17 &&
    !cardInputFlag &&
    !isTextSelected
  ) {
    console.log("working");
    numberFlag = false;
    input.preventDefault();
  }
  console.log(numberFlag);
};

const insertSpace = (input) => {
  // Exit if Backspace or Delete key is pressed.
  if (input.key === "Backspace" || input.key === "Delete") {
    return;
  }
  //   console.log('step2');

  // Ensure that the input is a number.
  if (!(input.key >= "0" && input.key <= "9")) {
    return;
  }

  // Insert space for Amex cards.
  if (
    numberFlag &&
    amexFlag &&
    (cardInputField.value.length === 4 || cardInputField.value.length === 11)
  ) {
    cardInputField.value += " ";
    numberFlag = false;
    return;
  }

  // Insert space for Visa/MasterCard cards.
  if (
    numberFlag &&
    !amexFlag &&
    //  cardInputField.value.length % 5 === 4) {
    (cardInputField.value.length === 4 ||
      cardInputField.value.length === 9 ||
      cardInputField.value.length === 14)
  ) {
    cardInputField.value += " ";
    numberFlag = false;
    return;
  }

  numberFlag = true;
};

cardInputField.addEventListener("keydown", cardProvider);
cardInputField.addEventListener("keydown", cardInputFilter);
nameInputField.addEventListener("blur", validateName);
emailInputField.addEventListener("blur", validateEmail);
cardInputField.addEventListener("keydown", forceNumbers);
cardInputField.addEventListener("keydown", insertSpace);
cardInputField.addEventListener("blur", validateCard);

// const insertSpace = (input) => {
//   if (input.key === "Backspace" || input.key === "Delete") {
//     return;
//   } else if (
//     /[0-9]{4}$/.test(cardInputField.value) &&
//     input.key >= "0" &&
//     input.key <= "9" &&
//     numberFlag
//   ) {
//     cardInputField.value += " ";
//   } else {
//     numberFlag = true;
//   }
// };

// const cardProvider = () => {
//     amexFlag = false;
//     visaMasterFlag = false;
//     if (
//       cardInputField.value[0] == 2 ||
//       cardInputField.value[0] == 4 ||
//       cardInputField.value[0] == 5
//     ) {
//       visaMasterFlag = true;
//     } else if (cardInputField.value[0] == 3) {
//       amexFlag = true;
//     }
//   };
