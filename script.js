const state = {
    content: null,
};

const fallbackContent = {
    hero: {
        title: "Groceries delivered fresh to your door in under 2 hours.",
        subtitle: "Order local produce, pantry staples, and household essentials with transparent pricing and zero hidden fees.",
        primaryCta: { label: "Browse Weekly Deals" },
        secondaryCta: { label: "Schedule Delivery" },
        stats: [
            { value: "250+", label: "Local suppliers" },
            { value: "98%", label: "On-time deliveries" },
            { value: "4.9/5", label: "Customer rating" },
        ],
        delivery: {
            slot: "Today · 4:30 PM",
            ctaLabel: "Track Delivery",
            items: [
                { name: "Organic Kale Bunch", price: "$4.99" },
                { name: "Heirloom Tomatoes", price: "$5.49" },
                { name: "Oat Milk 1L", price: "$3.79" },
            ],
        },
    },
    categories: [
        { title: "Fresh Produce", description: "Seasonal fruits and vegetables from nearby farms." },
        { title: "Dairy & Eggs", description: "Creamy dairy, plant-based alternatives, and free-range eggs." },
        { title: "Bakery & Snacks", description: "Daily baked breads, pastries, and wholesome snacks." },
        { title: "Pantry Staples", description: "Grains, spices, sauces, and global flavors for every recipe." },
        { title: "Frozen & Ready", description: "Chef-prepared meals, frozen fruits, and quick heat bites." },
        { title: "Household Care", description: "Eco cleaners, paper goods, and personal care essentials." },
    ],
    featured: {
        products: [
            {
                tag: "New",
                title: "Mango Passion Kombucha",
                description: "Probiotic sparkling tea brewed in small batches.",
                price: "$3.49",
                size: "12 fl oz",
                ctaLabel: "Add to cart",
            },
            {
                tag: "Local",
                title: "Farmer's Market Salad Kit",
                description: "Mixed greens, edible flowers, and citrus dressing.",
                price: "$8.99",
                size: "for 2 servings",
                ctaLabel: "Add to cart",
            },
            {
                tag: "Limited",
                title: "Wildflower Honey",
                description: "Raw, unfiltered honey harvested from mountain apiaries.",
                price: "$11.50",
                size: "8 oz jar",
                ctaLabel: "Add to cart",
            },
            {
                tag: "Deal",
                title: "Cold Brew Concentrate",
                description: "Bold, smooth, and ready for iced lattes or nitro drinks.",
                price: "$14.00",
                size: "32 fl oz",
                ctaLabel: "Add to cart",
            },
        ],
    },
    services: [
        { title: "Flexible delivery windows", description: "Choose 2-hour windows, same-day, or express delivery." },
        { title: "Real-time order tracking", description: "Live driver location, delivery notes, and doorstep photo proof." },
        { title: "Zero plastic promise", description: "Compostable bags and reusable crates for subscription members." },
        { title: "Chef-curated bundles", description: "Dinner kits and weekly staples curated by local chefs." },
    ],
    testimonials: [
        {
            quote: "The produce quality rivals our weekend farmers market. Deliveries are always thoughtful and on time.",
            name: "Sara L.",
            role: "Chef & food blogger",
        },
        {
            quote: "I save at least 4 hours every week. The pantry bundles mean I never run out of essentials.",
            name: "David P.",
            role: "Busy parent",
        },
        {
            quote: "Their zero-waste packaging and local sourcing make it the guilt-free way to stock my kitchen.",
            name: "Priya N.",
            role: "Sustainability coach",
        },
    ],
};

document.addEventListener("DOMContentLoaded", async () => {
    setYear();
    await loadContent();
    wireNewsletterForm();
});

function setYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

async function loadContent() {
    try {
        const response = await fetch("/api/content", { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Unable to load site content");
        }
        const data = await response.json();
        state.content = data;
        renderAllContent(data);
    } catch (error) {
        console.error(error);
        if (!state.content) {
            state.content = fallbackContent;
            renderAllContent(fallbackContent);
            showLoadWarning();
        } else {
            showLoadError();
        }
    }
}

function renderAllContent(content) {
    renderHero(content.hero);
    renderCategories(content.categories);
    renderProducts(content.featured?.products || []);
    renderServices(content.services);
    renderTestimonials(content.testimonials);
}

function renderHero(hero) {
    if (!hero) return;
    setText("hero-title", hero.title);
    setText("hero-subtitle", hero.subtitle);
    setText("primary-cta", hero.primaryCta?.label);
    setText("secondary-cta", hero.secondaryCta?.label);
    renderCollection("hero-stats", hero.stats, (stat) => `
        <div>
            <strong>${stat.value}</strong>
            <span>${stat.label}</span>
        </div>
    `);
    setText("delivery-slot", hero.delivery?.slot);
    renderCollection("delivery-items", hero.delivery?.items, (item) => `
        <li>
            <span>${item.name}</span>
            <strong>${item.price}</strong>
        </li>
    `);
    setText("delivery-cta", hero.delivery?.ctaLabel);
}

function renderCategories(categories = []) {
    renderCollection("category-grid", categories, (category) => `
        <article>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
        </article>
    `);
}

function renderProducts(products = []) {
    renderCollection("product-grid", products, (product) => `
        <article>
            ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <div class="price">
                <strong>${product.price}</strong>
                <span>${product.size}</span>
            </div>
            <button class="btn secondary full">${product.ctaLabel || "Add to cart"}</button>
        </article>
    `);
}

function renderServices(services = []) {
    renderCollection("service-grid", services, (service) => `
        <article>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </article>
    `);
}

function renderTestimonials(testimonials = []) {
    renderCollection("testimonial-grid", testimonials, (testimonial) => `
        <article>
            <p>“${testimonial.quote}”</p>
            <h3>${testimonial.name}</h3>
            <span>${testimonial.role}</span>
        </article>
    `);
}

function renderCollection(elementId, items = [], templateFn) {
    const container = document.getElementById(elementId);
    if (!container) return;
    if (!items.length) {
        container.innerHTML = `<p class="empty-state">Content coming soon.</p>`;
        return;
    }
    container.innerHTML = items.map(templateFn).join("");
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && typeof text === "string") {
        el.textContent = text;
    }
}

function showLoadError() {
    const sections = document.querySelectorAll(".category-grid, .product-grid, .service-grid, .testimonial-grid");
    sections.forEach((section) => {
        section.innerHTML = `<p class="empty-state">We couldn't load the latest inventory. Please refresh.</p>`;
    });
}

function showLoadWarning() {
    if (document.querySelector(".status-banner")) return;
    const banner = document.createElement("div");
    banner.className = "status-banner";
    banner.textContent = "Showing cached inventory. Refresh once you're back online to see the latest stock.";
    document.body.insertBefore(banner, document.body.firstChild);
}

function wireNewsletterForm() {
    const form = document.querySelector(".cta-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const input = form.querySelector("input[type='email']");
        if (!input) return;

        const email = input.value.trim();
        if (!email) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Subscription failed");
            }

            const result = await response.json();
            alert(result.message || "Thanks for subscribing!");
            form.reset();
        } catch (error) {
            console.error(error);
            alert("We couldn't process your subscription. Please try again.");
        }
    });
}

