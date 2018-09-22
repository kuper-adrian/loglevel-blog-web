
$(document).ready(() => {
  // show snackbar if there is one present in the dom
  const snackbar = document.getElementById('snackbar');

  if (snackbar) {
    // Add the "show" class to DIV
    snackbar.className = `${snackbar.className} show`;

    // After 5 seconds, remove the show class from DIV
    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '').trim();
    }, 5000);
  }
});
