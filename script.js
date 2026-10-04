const WHATSAPP_NUMBER = "919081602391";

const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const defaultMessage =
  "નમસ્તે MD Car Accessories, મને મારી કાર માટે accessories / styling વિશે માહિતી અને quotation જોઈએ છે.";

document.getElementById("heroWhatsapp").href = whatsappLink(defaultMessage);
document.getElementById("mobileWhatsapp").href = whatsappLink(defaultMessage);

lucide.createIcons();

const carButtons = document.querySelectorAll(".car-options button");
const needButtons = document.querySelectorAll(".need-options button");
const estimate = document.getElementById("estimate");
let selectedCar = "";
let selectedNeeds = [];

carButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    carButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCar = btn.dataset.car;
  });
});

needButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const need = btn.dataset.need;
    btn.classList.toggle("active");

    if (btn.classList.contains("active")) {
      selectedNeeds.push({
        name: need,
        min: Number(btn.dataset.min),
        max: Number(btn.dataset.max)
      });
    } else {
      selectedNeeds = selectedNeeds.filter(item => item.name !== need);
    }
    updateEstimate();
  });
});

function formatINR(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(number);
}

function updateEstimate() {
  if (!selectedNeeds.length) {
    estimate.textContent = "₹8,000 — ₹15,000";
    return;
  }

  const min = selectedNeeds.reduce((sum, item) => sum + item.min, 0);
  const max = selectedNeeds.reduce((sum, item) => sum + item.max, 0);
  estimate.textContent = `${formatINR(min)} — ${formatINR(max)}`;
}

document.getElementById("quoteSubmit").addEventListener("click", () => {
  const name = document.getElementById("customerName").value.trim();

  if (!selectedCar) {
    alert("કૃપા કરીને તમારી કારનું model પસંદ કરો.");
    return;
  }

  if (!selectedNeeds.length) {
    alert("કૃપા કરીને ઓછામાં ઓછી એક service પસંદ કરો.");
    return;
  }

  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const needs = selectedNeeds.map(item => `• ${item.name}`).join("\n");

  const message = `નમસ્તે MD Car Accessories 👋

મારે મારી કાર માટે quotation જોઈએ છે.

👤 નામ: ${name || "Not provided"}
🚗 Car Model: ${selectedCar}

🔧 Required Services:
${needs}

💰 Estimated Range: ${estimate.textContent}

🕐 Inquiry Time: ${timestamp}

કૃપા કરીને availability, final pricing અને fitting time જણાવશો.`;

  window.open(whatsappLink(message), "_blank");
});

const filterButtons = document.querySelectorAll(".filter-tabs button");
const galleryCards = document.querySelectorAll(".gallery-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    galleryCards.forEach(card => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.style.display = visible ? "" : "none";
    });
  });
});

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = Number(el.dataset.target);
    let current = 0;
    const duration = 1000;
    const start = performance.now();

    function tick(time) {
      const progress = Math.min((time - start) / duration, 1);
      current = Math.floor(progress * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.35 });

counters.forEach(counter => counterObserver.observe(counter));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
