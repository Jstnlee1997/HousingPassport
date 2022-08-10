const elToggle = document.querySelector("#toggleSuggestions");
const elContent = document.querySelectorAll(".editSuggestions");
const currentBtnColor = elToggle.style.backgroundColor;

// Toggle visibility of elements upon clicking of "Edit Suggestions" button
elToggle.addEventListener("click", function () {
  // Change html of elToggle
  elToggle.innerHTML === "Edit Suggestions"
    ? (elToggle.innerHTML = "Cancel Action")
    : (elToggle.innerHTML = "Edit Suggestions");
  // Change colour of elToggle

  elToggle.style.backgroundColor === "red"
    ? (elToggle.style.backgroundColor = currentBtnColor)
    : (elToggle.style.backgroundColor = "red");

  // Toggle display of other elements
  elContent.forEach((element) => {
    element.classList.toggle("editSuggestions");
  });
});
