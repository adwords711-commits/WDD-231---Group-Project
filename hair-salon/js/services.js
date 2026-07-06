// Services data
let services = [];
const url = "./data/services.json";

// DOM elements
const serviceContainer = document.querySelector("#service-container");
const categoryDropdown = document.querySelector("#category");

// ── Local Storage Helper Functions ─────────────────────────

// Save data to localStorage
function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get data from localStorage
function getLocalStorage(key) {
  const storedValue = localStorage.getItem(key);

  if (storedValue) {
    return JSON.parse(storedValue);
  }

  return null;
}


// Fetch services from JSON
export async function loadServices() {
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();

    services = data;
    renderServices(services);

  } else {
    throw new Error("Response not OK");
  }
}


// Render service cards
function renderServices(serviceList) {
  if (!serviceContainer) return;

  serviceContainer.innerHTML = "";

  serviceList.forEach(service => {
    serviceContainer.innerHTML += serviceTemplate(service);
  });
}


// Create service card HTML
function serviceTemplate(service) {

  const webpImage = service.image.replace(/\.(jpg|png)$/i, ".webp");

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
          ${service.category.map(cat => `<span>${cat}</span>`).join("")}
        </div>

        <h2>${service.name}</h2>

        <p class="service-description">
          ${service.description}
        </p>

        <label for="length-${service.name.replace(/\s/g, "")}">
          Select hair length:
        </label>

        <select class="hair-length" id="length-${service.name.replace(/\s/g, "")}">
          <option value="">--Choose--</option>
          <option value="short">Short Hair</option>
          <option value="mid">Mid Length</option>
          <option value="long">Long Hair</option>
        </select>

        <p class="service-duration hidden">
          <strong>Duration:</strong> ${service.duration}
        </p>

        <p class="service-price hidden">
          <strong>Price:</strong> $0
        </p>

        <button class="select-service-btn btn hidden">
          Select
        </button>

      </div>
    </section>
  `;
}


// Calculate dynamic price
function getPrice(service, length) {
  return service.price[length] || 0;
}


// Category filter
if (categoryDropdown) {

  categoryDropdown.addEventListener("change", function () {

    const selectedCategory = categoryDropdown.value;

    let filteredServices =
      selectedCategory === "All"
        ? services
        : services.filter(service =>
            service.category.includes(selectedCategory)
          );

    filteredServices.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    renderServices(filteredServices);

  });

}

// Hair length and price selection
if (serviceContainer) {

  serviceContainer.addEventListener("change", function(e) {

    if (!e.target.classList.contains("hair-length")) return;


    const select = e.target;
    const serviceCard = select.closest(".service-card");

    const priceElement = serviceCard.querySelector(".service-price");
    const durationElement = serviceCard.querySelector(".service-duration");
    const selectBtn = serviceCard.querySelector(".select-service-btn");


    const selectedLength = select.value;

    if (!selectedLength) return;


    const serviceObj = services.find(
      service => service.name === serviceCard.querySelector("h2").textContent
    );


    const dynamicPrice = getPrice(serviceObj, selectedLength);


    priceElement.innerHTML = `<strong>Price:</strong> $${dynamicPrice}`;

    durationElement.classList.remove("hidden");
    priceElement.classList.remove("hidden");
    selectBtn.classList.remove("hidden");


    selectBtn.onclick = () => {

  const servicePreference = {
    service: serviceObj.name,
    length: selectedLength,
    price: dynamicPrice,
    timestamp: new Date().toLocaleString()
  };


  localStorage.setItem(
    "servicePreference",
    JSON.stringify(servicePreference)
  );
  alert("Your service preference has been saved!");
  };

  });

}