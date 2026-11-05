// North Yorkshire Tuning: details unke flyer aur live site se. Kuch badle to sirf yeh file
const shopInfo = {
  name: "North Yorkshire Tuning",
  phone: "07533 761889",
  phoneLink: "+447533761889",
  whatsapp: "447533761889",
  email: "Northyorkshiretuning@gmail.com",
  address: "Mobile across North Yorkshire & Leeds",
  currency: "£",
  socials: [
    { label: "Facebook", icon: "ph:facebook-logo-duotone", url: "https://www.facebook.com/Northyorkshiretuning" },
    { label: "Instagram", icon: "ph:instagram-logo-duotone", url: "https://www.instagram.com/northyorkshiretuning/" },
    { label: "TikTok", icon: "ph:tiktok-logo-duotone", url: "https://www.tiktok.com/@northyorkshiretuning" },
    { label: "YouTube", icon: "ph:youtube-logo-duotone", url: "https://youtube.com/@northyorkshiretuning" },
    { label: "Google", icon: "ph:google-logo-duotone", url: "https://share.google/MzNDLVQzTp25ivE5z" },
  ],
};

// unki site ke schema mein jo areas likhe hain, wahi
const serviceAreas = [
  "York", "Leeds", "Harrogate", "Selby", "Wetherby", "Thirsk", "Garforth", "Knaresborough",
  "Tadcaster", "Castleford", "Pontefract", "Goole", "Easingwold", "Hambleton", "Monk Fryston",
  "South Milford", "Church Fenton", "Sherburn in Elmet", "Great Preston", "Little Preston", "Kippax",
];

// price null = "ask" (flyer pe price nahi likha). featured = client ki "main services to push"
const services = [
  {
    id: "stage-1", slug: "stage-1-remapping", featured: true, icon: "ph:gauge-duotone", group: "Remapping", name: "Stage 1 remapping", price: 200,
    media: "assets/video/visit-laptop.mp4", poster: "assets/video/visit-laptop.jpg",
    text: "More power and torque on a standard car, sharper throttle response and often better economy.",
    long: "Stage 1 is a software remap for a standard car with no hardware changes. We read your ECU, save the original file, then adjust fuel, boost and timing within safe limits for your exact engine.",
    points: ["Typical diesel gains of 25–35% power", "Smoother, stronger mid-range for towing and overtaking", "Original file saved and can be restored", "Usually done through the OBD port in 1–2 hours"],
  },
  {
    id: "stage-2", slug: "stage-2-remapping", featured: true, icon: "ph:lightning-duotone", group: "Remapping", name: "Stage 2 remapping", price: null,
    media: "assets/video/visit-gauges.mp4", poster: "assets/video/visit-gauges.jpg",
    text: "For cars with supporting hardware like an uprated intercooler, intake or exhaust. Builds on Stage 1.",
    long: "Stage 2 is tuned around the parts you have fitted, such as an uprated intercooler, intake, downpipe or exhaust. We check what's on the car first, then write a map that matches it.",
    points: ["Tuned to your exact hardware list", "Bigger gains than Stage 1", "Gearbox (TCU) tuning available to match", "Priced per car once we know the setup"],
  },
  {
    id: "egr", slug: "egr-solutions", featured: true, icon: "ph:arrows-clockwise-duotone", group: "Emissions", name: "EGR solutions", price: 150,
    media: "assets/video/visit-obd.mp4", poster: "assets/video/visit-obd.jpg",
    text: "Sticking or faulty EGR valves causing smoke, rough idle, warning lights or limp mode.",
    long: "A clogged or faulty EGR valve is one of the most common causes of rough running, black smoke and limp mode on diesels. We diagnose the fault properly and sort the cause.",
    points: ["Full diagnostic before any work", "EGR fault codes and limp mode", "Rough idle, smoke and flat spots", "Cleared and road tested before we leave"],
  },
  {
    id: "dpf", slug: "dpf-solutions", featured: true, icon: "ph:wind-duotone", group: "Emissions", name: "DPF solutions", price: 150,
    media: "assets/video/visit-tech.mp4", poster: "assets/video/visit-tech.jpg",
    text: "DPF warning light, blocked filter, failed regens and the limp mode that comes with them.",
    long: "Short trips stop a DPF from regenerating, so soot builds up until the light comes on and the car loses power. We check soot load, sensors and the reason it isn't regenerating, then sort it.",
    points: ["DPF light and blocked filter faults", "Forced regeneration where suitable", "Pressure sensor and fault diagnosis", "Advice to stop it coming back"],
  },
  {
    id: "adblue", slug: "adblue-solutions", featured: true, icon: "ph:drop-duotone", group: "Emissions", name: "AdBlue solutions", price: 150,
    media: "assets/video/visit-bench.mp4", poster: "assets/video/visit-bench.jpg",
    text: "AdBlue and SCR warnings, countdown-to-no-start messages, pump and heater faults.",
    long: "An AdBlue fault can put a countdown on the dash that ends with the car refusing to start. We diagnose the SCR system, from the pump and heater to sensors and software, and get you moving again.",
    points: ["'No start in X miles' countdown warnings", "AdBlue pump, heater and level faults", "SCR system fault codes", "Mobile, so we come to the car where it's stuck"],
  },
  {
    id: "nox", slug: "nox-solutions", featured: true, icon: "ph:flask-duotone", group: "Emissions", name: "NOx solutions", price: null,
    media: "assets/video/visit-arrive.mp4", poster: "assets/video/visit-arrive.jpg",
    text: "NOx sensor faults and emissions warnings that bring on lights, limp mode or AdBlue errors.",
    long: "NOx sensors watch your exhaust emissions and feed the AdBlue system. When one fails it can trigger warning lights, limp mode and AdBlue countdowns. We find the faulty part and sort it.",
    points: ["NOx sensor fault codes", "Linked AdBlue and SCR warnings", "Live data checks to confirm the fault", "Priced once we've diagnosed the car"],
  },
  { id: "tcu", slug: "tcu-tuning", icon: "ph:gear-six-duotone", group: "Other", name: "TCU tuning", price: null, text: "Gearbox software tuned to match the remap: quicker shifts, firmer launches, higher torque limits." },
  { id: "limiter", slug: "speed-limiter-removal", icon: "ph:speedometer-duotone", group: "Other", name: "Speed limiter removal", price: null, text: "Factory or fleet speed limiter adjusted or removed in the software." },
  { id: "diagnostics", slug: "advanced-diagnostics", icon: "ph:magnifying-glass-duotone", group: "Other", name: "Advanced diagnostics", price: 40, text: "Full scan of every module with dealer-level tools. We read the codes and live data and tell you what's actually wrong." },
  { id: "coding", slug: "ecu-coding", icon: "ph:code-duotone", group: "Other", name: "ECU coding", price: 40, text: "Unlock hidden features, code in new parts and set up retrofits so the car recognises them." },
  { id: "programming", slug: "ecu-programming", icon: "ph:cpu-duotone", group: "Other", name: "ECU programming", price: null, text: "Software updates and programming for replacement or second-hand ECUs." },
  { id: "cloning", slug: "ecu-tcu-cloning", icon: "ph:copy-duotone", group: "Other", name: "ECU & TCU cloning", price: null, text: "Data moved from a faulty unit to a replacement so the car starts and drives as before." },
  { id: "mileage", slug: "mileage-correction", icon: "ph:hash-duotone", group: "Other", name: "Mileage correction", price: 50, text: "Mileage matched to the vehicle's true reading when an instrument cluster or ECU is replaced." },
];

function findServiceById(serviceId) {
  return services.find((item) => item.id === serviceId);
}

function formatPrice(amount) {
  return amount === null ? "Ask" : `${shopInfo.currency}${Math.round(amount)}`;
}

// gain estimator: "typical" range, asli figure reg dekh ke confirm hota hai
const gainProfiles = {
  diesel: { label: "Turbo diesel", stage1: { power: [0.25, 0.35], torque: [0.25, 0.35] }, stage2: { power: [0.35, 0.45], torque: [0.35, 0.45] } },
  petrol: { label: "Turbo petrol", stage1: { power: [0.15, 0.25], torque: [0.2, 0.3] }, stage2: { power: [0.25, 0.4], torque: [0.3, 0.45] } },
};

// "why prices can vary" (flyer wala hissa)
const tuningMethods = [
  { id: "obd", icon: "ph:plugs-connected-duotone", title: "OBD tuning", text: "Done through the car's diagnostic port, usually in under two hours, without touching the ECU." },
  { id: "bench", icon: "ph:circuitry-duotone", title: "Bench tuning", text: "The ECU comes out and is read on a specialist setup in the van. Needed for some newer and protected ECUs." },
  { id: "boot", icon: "ph:lightning-duotone", title: "Boot tuning", text: "Direct connection to the ECU's processor for cars that can't be tuned through the standard OBD port." },
];

const workSteps = [
  { title: "Send your reg", icon: "ph:identification-card-duotone", text: "WhatsApp, text or use the form. We check what your ECU supports." },
  { title: "Fixed price, confirmed", icon: "ph:receipt-duotone", text: "You get the method and the price for your car before we book." },
  { title: "We come to you", icon: "ph:van-duotone", text: "Home or workplace. The van carries everything we need." },
  { title: "Original file saved", icon: "ph:floppy-disk-duotone", text: "Your factory software is backed up before anything is changed." },
];

const shopPromises = [
  { icon: "ph:map-pin-duotone", title: "Mobile service", text: "Across North Yorkshire" },
  { icon: "ph:shield-check-duotone", title: "Professional", text: "& reliable" },
  { icon: "ph:trend-up-duotone", title: "Better performance", text: "A cleaner tomorrow" },
];

// chatbot isi se jawab deta hai
const carProblems = [
  { id: "limp", label: "Car in limp mode", fix: "Limp mode is the ECU protecting the engine. A full diagnostic finds the reason first, often boost, DPF or EGR related.", service: "diagnostics", keywords: ["limp", "no power", "power loss", "lost power"] },
  { id: "dpf-light", label: "DPF light on", fix: "We check soot load, sensors and why it isn't regenerating, then sort the cause.", service: "dpf", keywords: ["dpf", "particulate", "regen"] },
  { id: "adblue", label: "AdBlue warning", fix: "AdBlue and SCR faults (countdown to no-start, pump, heater) are diagnosed and fixed on site.", service: "adblue", keywords: ["adblue", "scr", "countdown"] },
  { id: "nox", label: "NOx sensor fault", fix: "A failed NOx sensor can trigger warning lights, limp mode and AdBlue errors. We confirm it with live data and sort it.", service: "nox", keywords: ["nox"] },
  { id: "egr", label: "EGR fault", fix: "Sticking or faulty EGR valves cause smoke, rough idle and limp mode. We diagnose and sort it.", service: "egr", keywords: ["egr", "smoke", "rough idle"] },
  { id: "warning", label: "Warning light on", fix: "We plug in, read every module and explain the fault in plain English.", service: "diagnostics", keywords: ["warning", "light", "engine light", "fault", "code"] },
  { id: "power", label: "Want more power", fix: "A Stage 1 remap is the usual starting point. Stage 2 is for cars with supporting hardware like an intake or exhaust.", service: "stage-1", keywords: ["power", "remap", "stage", "bhp", "faster", "tune", "tuning", "torque"] },
  { id: "features", label: "Unlock features", fix: "ECU coding can enable features the car already has hardware for, and code in retrofits.", service: "coding", keywords: ["coding", "unlock", "feature", "retrofit", "code in"] },
];

const shopFaqs = [
  { q: "Will a remap damage my engine?", a: "A good remap stays within the safe limits of the engine, gearbox and turbo. We tune for your exact car and save the original file first, so it can be put back at any time." },
  { q: "Do I need to tell my insurer?", a: "Yes. A remap is a modification, so let your insurer know. Many insurers will cover it, sometimes with a small change in premium." },
  { q: "How long does it take?", a: "Most OBD remaps and coding jobs take one to two hours on your driveway. Bench tuning takes longer because the ECU comes out." },
  { q: "Can it be put back to standard?", a: "Yes. We keep a copy of your original software and can reload it if you sell the car or need a dealer visit." },
  { q: "Why does the price vary?", a: "It depends on your car's make, model, engine and ECU type, and whether it can be done by OBD or needs bench or boot tuning. Send your reg and we'll confirm the method and price." },
  { q: "Which areas do you cover?", a: "York, Leeds, Harrogate, Selby, Wetherby, Thirsk, Tadcaster and the villages between. Check your town on this page or just message us." },
];

// SAMPLE: sirf demo ke liye. Live se pehle inke asli Google Business reviews lagane hain
const sampleReviews = [
  { name: "James R.", car: "Audi A4 2.0 TDI", service: "Stage 1", text: "Came to my house on a Saturday, done in under two hours. The car pulls so much better on the A64." },
  { name: "Sarah M.", car: "Ford Transit Custom", service: "AdBlue", text: "Had the AdBlue countdown on the van. Sorted on my drive the next morning, no garage needed." },
  { name: "Dan K.", car: "BMW 320d", service: "Stage 1", text: "Showed me the original file being saved before anything changed. Very professional." },
  { name: "Mark T.", car: "VW Golf GTD", service: "DPF", text: "DPF light kept coming back. Diagnosed properly and explained what was causing it." },
  { name: "Amy L.", car: "Skoda Octavia vRS", service: "Stage 2", text: "Went Stage 2 with my intake and exhaust. Clear about what the car needed first." },
  { name: "Chris P.", car: "Land Rover Discovery", service: "EGR", text: "Limp mode on the way to work. He came to the office car park and fixed the EGR fault." },
  { name: "Tom H.", car: "Mercedes Sprinter", service: "NOx", text: "NOx sensor fault confirmed with live data, not guessed. Fair price, quick job." },
  { name: "Lucy W.", car: "Seat Leon FR", service: "Coding", text: "Coded in the features I wanted and checked everything worked before leaving." },
];

const bookingSlots = ["Morning", "Afternoon", "Evening"];

// area page ka naam: "Sherburn in Elmet" -> "sherburn-in-elmet"
function townSlug(town) {
  return town.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");
}

// "Inside a mobile visit" gallery: har card ek chhoti loop video
const visitSteps = [
  { video: "visit-arrive", minute: 0, title: "We pull up outside", text: "The van parks by your car. Nothing to bring, nothing to move." },
  { video: "visit-tech", minute: 10, title: "Laptop out, cable in", text: "Battery support on, laptop connected at the driver's door." },
  { video: "visit-obd", minute: 20, title: "ECU read and backed up", text: "Read through the OBD port. Your original file is saved first." },
  { video: "visit-laptop", minute: 40, title: "Mapped for your engine", text: "Fuel, boost and timing adjusted for your exact car." },
  { video: "visit-bench", minute: 65, title: "Bench tuning if needed", text: "Some ECUs come out and are tuned on the bench in the van." },
  { video: "visit-gauges", minute: 90, title: "Checked and fault-free", text: "Codes cleared and live data checked with the engine running." },
  { video: "visit-drive", minute: 110, title: "Road tested", text: "A test drive together before we pack up." },
];
