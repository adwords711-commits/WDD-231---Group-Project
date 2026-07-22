// ── Hamburger menu toggle ──────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger'); //Referring to the HTML element
const mainNav = document.querySelector('header nav'); //Look for a <nav> tag that is a descendant of a <header> tag

if (hamburgerBtn && mainNav) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open'); // nav .open in css added to the HTML. const isOpen is for JS to track whether its open
    mainNav.classList.toggle('open'); //CSS uses "open" transition the menu into view
    hamburgerBtn.setAttribute('aria-expanded', isOpen); //Accesibility: This tells screen readers used by visually impaired users whether the menu is currently expanded or collapsed.
  });

  // Close nav when any nav link is clicked (navigating on mobile)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      mainNav.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking anywhere outside the header
  document.addEventListener('click', e => {
    if (!e.target.closest('header')) {
      hamburgerBtn.classList.remove('open');
      mainNav.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Contact Form
// DOM elements
const feedbackElement = document.getElementById("feedback");
const formElement = document.querySelector(".contact-form-1 form");

if (formElement && feedbackElement) {
  formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const msg = document.querySelector("#msg").value.trim();

    feedbackElement.innerHTML =
      "Thank you, your message has been received. We'll be in touch soon."
    feedbackElement.style.display = "block";
    document.body.classList.toggle("moveDown");

    // Clear the form safely AFTER data is saved
    formElement.reset();
  });

}