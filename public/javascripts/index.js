const elToggle = document.querySelector("#toggleSuggestions");
const elContent = document.querySelectorAll(".editSuggestions");
const saveSuggestionsBtn = document.querySelector("#saveSuggestionsBtn");

// Toggle visibility of elements upon clicking of "Edit Suggestions" button
elToggle.addEventListener("click", function () {
  elContent.forEach((element) => {
    element.classList.toggle("editSuggestions");
  });
});

// Send post request to remove completed suggestions
saveSuggestionsBtn.addEventListener("click", async (_) => {
  const lmkKey = saveSuggestionsBtn.value;
  const checkedBoxes = document.querySelectorAll(
    "input[name=recommendationCheckBoxes]:checked"
  );
  // console.log(checkedBoxes);
  for (const checkBox of checkedBoxes) {
    improvementIds.push(checkBox.value);
    const improvementId = checkBox.value;
    // Delete the recommendation from the epc-recommendations table
    // await deleteRecommendationByLmkKeyAndImprovementId(lmkKey, improvementId);
    // console.log(
    //   "Completed retrofitting suggestion with Improvement ID: ",
    //   improvementId
    // );
  }
});
