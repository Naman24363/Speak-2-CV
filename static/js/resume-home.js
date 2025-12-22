/**
 * Resume Home - Resume Management
 * Handles resume deletion with checkbox selection
 */

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".resume-checkbox");
  const deleteBtn = document.getElementById("delete-btn");

  function updateDeleteButton() {
    const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
    if (deleteBtn) deleteBtn.style.display = anyChecked ? "inline-block" : "none";
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateDeleteButton);
  });

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function () {
      const checked = Array.from(checkboxes).filter((cb) => cb.checked);
      if (checked.length === 0) return;

      const count = checked.length;
      const message =
        count === 1
          ? "Are you sure you want to delete this resume?"
          : `Are you sure you want to delete ${count} resumes?`;

      if (!confirm(message)) return;

      const csrftoken = getCookie("csrftoken");
      let done = 0;
      const total = checked.length;

      checked.forEach((checkbox) => {
        const resumeId = checkbox.dataset.resumeId;

        fetch(`/r/${resumeId}/delete/`, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
        })
          .catch(() => {})
          .finally(() => {
            done++;
            if (done === total) window.location.href = "/";
          });
      });
    });
  }
});
