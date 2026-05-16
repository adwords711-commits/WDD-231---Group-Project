console.log("JS is connected");

// Services data
const services = [
  {
    name: "Women's Haircut",
    category: ["Cut"],
    description: "Professional women's haircut tailored to your style.",
    duration: "45 min",
    image: "./images/Untitled.jpg",
    rating: 5,
    price: { short: 45, mid: 60, long: 75 }
  },
  {
    name: "Women's Curly Hair",
    category: ["Curly"],
    description: "Designed for curly and natural curly hair.",
    duration: "120 min",
    image: "./images/Untitled-7.jpg",
    rating: 5,
    price: { short: 65, mid: 95, long: 125 }
  },
  {
    name: "Men's Haircut",
    category: ["Cut"],
    description: "Clean and modern men's haircut.",
    duration: "30 min",
    image: "./images/Untitled-5.jpg",
    rating: 4,
    price: { short: 25, mid: 40, long: 55 }
  },
  {
    name: "Men's Curly Hair",
    category: ["Curly"],
    description: "Men's curly haircut tailored to your style.",
    duration: "45 min",
    image: "./images/Untitled-4.jpg",
    rating: 5,
    price: { short: 65, mid: 85, long: 105 }
  },
  {
    name: "Hair Colour",
    category: ["Color"],
    description: "Full hair coloring with professional products.",
    duration: "1.5 hr",
    image: "./images/Untitled-3.jpg",
    rating: 5,
    price: { short: 80, mid: 95, long: 110 }
  },
  {
    name: "Balayage",
    category: ["Color"],
    description: "Natural-looking highlights with the balayage technique.",
    duration: "2 hr",
    image: "./images/Untitled-8.jpg",
    rating: 5,
    price: { short: 150, mid: 225, long: 350 }
  },
  {
    name: "Keratin Treatment",
    category: ["Treatment"],
    description: "Smooth and frizz-free hair with professional keratin treatment.",
    duration: "3.5 hr",
    image: "./images/hero-image.jpg",
    rating: 5,
    price: { short: 150, mid: 170, long: 190 }
  }
];

// Utility function to get dynamic price
function getPrice(service, length) {
  return service.price[length] || 0;
}

// DOM elements
const serviceContainer = document.querySelector("#service-container");
const categoryDropdown = document.querySelector("#category");

// Render service cards
function renderServices(serviceList) {
  serviceContainer.innerHTML = "";
  serviceList.forEach(service => {
    serviceContainer.innerHTML += serviceTemplate(service);
  });
}

// Service card template
function serviceTemplate(service) {
  return `
    <section class="service-card">
      <div class="service-image">
        <img src="${service.image}" alt="${service.name}">
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
        <button class="select-service-btn hidden">Select</button>
      </div>
    </section>
  `;
}

// Category filter listener
categoryDropdown.addEventListener('change', function() {
  const selectedCategory = categoryDropdown.value;

  let filteredServices = selectedCategory === "All" 
    ? services 
    : services.filter(s => s.category.includes(selectedCategory));

  // Sort alphabetically
  filteredServices.sort((a, b) => a.name.localeCompare(b.name));

  renderServices(filteredServices);
});

// Initial render
renderServices(services);

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