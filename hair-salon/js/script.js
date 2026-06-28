console.log("JS is connected");

// Services data
const services = [
  {
    name: "Women's Haircut",
    category: ["Cut"],
    description: "Women's haircut tailored to your style.",
    duration: "45 min",
    image: "./images/womens-layered-haircut-style.jpg",
    rating: 5,
    price: { short: 45, mid: 60, long: 75 }
  },
  {
    name: "Women's Curly Hair",
    category: ["Curly"],
    description: "Designed for curly and natural curly hair.",
    duration: "120 min",
    image: "./images/womens-natural-curly-hair-styling.jpg",
    rating: 5,
    price: { short: 65, mid: 95, long: 125 }
  },
  {
    name: "Men's Haircut",
    category: ["Cut"],
    description: "Clean and modern men's haircut.",
    duration: "30 min",
    image: "./images/mens-modern-professional-haircut.jpg",
    rating: 4,
    price: { short: 25, mid: 40, long: 55 }
  },
  {
    name: "Men's Curly Hair",
    category: ["Curly"],
    description: "Men's curly haircut tailored to your style and curl type.",
    duration: "45 min",
    image: "./images/mens-curly-hair-taper-fade.jpg",
    rating: 5,
    price: { short: 65, mid: 85, long: 105 }
  },
  {
    name: "Hair Colour",
    category: ["Color"],
    description: "Full hair coloring with professional products.",
    duration: "1.5 hr",
    image: "./images/full-hair-coloring-dye-service.jpg",
    rating: 5,
    price: { short: 80, mid: 95, long: 110 }
  },
  {
    name: "Balayage",
    category: ["Color"],
    description: "Natural-looking highlights with the balayage technique.",
    duration: "2 hr",
    image: "./images/blonde-balayage-highlights-service.jpg",
    rating: 5,
    price: { short: 150, mid: 225, long: 350 }
  },
  {
    name: "Keratin Treatment",
    category: ["Treatment"],
    description: "Smooth and frizz-free hair with professional keratin treatment.",
    duration: "3.5 hr",
    image: "./images/hair-salon-ashburn-hero-welcome.jpg",
    rating: 5,
    price: { short: 150, mid: 170, long: 190 }
  }
];

// Utility function to get dynamic price
function getPrice(service, length) {
  return service.price[length] || 0;
}

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

// DOM elements
const serviceContainer = document.querySelector("#service-container");
const categoryDropdown = document.querySelector("#category");
const feedbackElement = document.getElementById("feedback");
const formElement = document.querySelector(".contact-form-1 form");

if (formElement && feedbackElement) {
  formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const msg = document.querySelector("#msg").value.trim();

    // Get existing messages from local storage, or start an empty array
    let existingMessages = JSON.parse(localStorage.getItem("userMessages")) || [];

    const userMessage = {
      name: name,
      email: email,
      message: msg,
      timestamp: new Date().toLocaleString()
    };

    // Add the new message to the array and save it
    existingMessages.push(userMessage);
    localStorage.setItem("userMessages", JSON.stringify(existingMessages));

    feedbackElement.innerHTML =
      "Hello " + name + "! Thank you for your message. We will get back with you as soon as possible!";
    feedbackElement.style.display = "block";
    document.body.classList.toggle("moveDown");

    // Clear the form safely AFTER data is saved
    formElement.reset();
  });

}

// Render service cards
function renderServices(serviceList) {
  if (!serviceContainer) return;

  serviceContainer.innerHTML = "";
  serviceList.forEach(service => {
    serviceContainer.innerHTML += serviceTemplate(service);
  });
}

// Service card template
function serviceTemplate(service) {
const webpImage = service.image.replace(/\.(jpg|png)$/i, '.webp');

  return `
    <section class="service-card">
      <div class="service-image">
        <picture style="display: contents;">
          <source srcset="${webpImage}" type="image/webp">
          <img src="${service.image}" alt="${service.name}">
        </picture>
      </div>
      <div class="service-info">
        <div class="service-category">
          ${service.category.map(cat => `<span>${cat}</span>`).join('')}
        </div>
        <h2>${service.name}</h2>
        <p class="service-description">${service.description}</p>
        <label for="length-${service.name.replace(/\s/g, '')}">Select hair length:</label>
        <select class="hair-length" id="length-${service.name.replace(/\s/g, '')}">
          <option value="">--Choose--</option>
          <option value="short">Short Hair</option>
          <option value="mid">Mid Length</option>
          <option value="long">Long Hair</option>
        </select>
        <p class="service-duration hidden"><strong>Duration:</strong> ${service.duration}</p>
        <p class="service-price hidden"><strong>Price:</strong> $0</p>
        <button class="select-service-btn btn hidden">Select</button>
      </div>
    </section>
  `;
}

// Category filter listener
if (categoryDropdown) {

  categoryDropdown.addEventListener("change", function () {
    const selectedCategory = categoryDropdown.value;
    let filteredServices =
      selectedCategory === "All"
        ? services
        : services.filter(s => s.category.includes(selectedCategory));
    filteredServices.sort((a, b) => a.name.localeCompare(b.name));
    renderServices(filteredServices);
  });

}

// Initial render
if (serviceContainer) {
  renderServices(services);
}

if (serviceContainer) {
  serviceContainer.addEventListener('change', function(e) {
    if (!e.target.classList.contains('hair-length')) return;

    const select = e.target;
    const serviceCard = select.closest('.service-card');
    const priceElement = serviceCard.querySelector('.service-price');
    const durationElement = serviceCard.querySelector('.service-duration');
    const selectBtn = serviceCard.querySelector('.select-service-btn');

    const selectedLength = select.value;
    if (!selectedLength) return;

    const serviceObj = services.find(s => s.name === serviceCard.querySelector('h2').textContent);
    const dynamicPrice = getPrice(serviceObj, selectedLength);

    priceElement.innerHTML = `<strong>Price:</strong> $${dynamicPrice}`;
      durationElement.classList.remove('hidden');
    priceElement.classList.remove('hidden');
    selectBtn.classList.remove('hidden');

    selectBtn.onclick = () => {
      alert("Thank you for your selection!");
    };
  });
}