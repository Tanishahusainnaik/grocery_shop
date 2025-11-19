const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const subscribers = new Set();

const siteContent = {
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

app.get("/api/content", (_req, res) => {
    res.json(siteContent);
});

app.post("/api/subscribe", (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Please provide a valid email address." });
    }

    const alreadySubscribed = subscribers.has(email);
    subscribers.add(email);

    res.json({
        message: alreadySubscribed
            ? "You're already on the FreshBasket list. Weekly harvest updates are headed your way!"
            : "Thanks for joining FreshBasket! Check your inbox for a welcome gift.",
    });
});

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
});

app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`FreshBasket server running on http://localhost:${PORT}`);
});

