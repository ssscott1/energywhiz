import { useState, useEffect, createContext, useContext } from "react";
import { supabase, fetchLeads, createLead, updateLeadStage, addLeadNote, signIn } from "./lib/supabase.js";

const LOGO = "data:image/png;base64,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";

// ═══════════════════════════════════════════════════════════
// THEME — MoneySmart-inspired clean institutional design
// ═══════════════════════════════════════════════════════════
const THEMES = {
  light: {
    bg: "#f4f6fa", surface: "#ffffff", card: "#ffffff", inputBg: "#eef1f7",
    border: "#d4dae4", borderLight: "#e4e8f0", text: "#1a1a2e", textMuted: "#44465a", textDim: "#7c7f94",
    primary: "#3348F4", primaryDark: "#2438d4", primaryLight: "#e8ecfe", primaryBg: "#3348F40a",
    accent: "#3348F4", accentBg: "#3348F410",
    green: "#0a8a5c", greenBg: "#e6f5ee", amber: "#c75300", amberBg: "#fff3e0",
    red: "#c62828", redBg: "#ffebee", blue: "#3348F4", purple: "#6A1B9A",
    shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)",
    shadowLg: "0 4px 12px rgba(0,0,0,0.06)",
    heroBg: "linear-gradient(135deg, #3348F4 0%, #2b3fd6 50%, #1e2faa 100%)",
    heroText: "#ffffff", heroMuted: "#c8d4ff",
  },
  dark: {
    bg: "#0c0e1a", surface: "#13162a", card: "#191d34", inputBg: "#1e2240",
    border: "#2a2f4e", borderLight: "#1e2240", text: "#e4e6f0", textMuted: "#8e90a8", textDim: "#5c5f78",
    primary: "#5b6ef7", primaryDark: "#4a5ce6", primaryLight: "#1e2250", primaryBg: "#5b6ef712",
    accent: "#5b6ef7", accentBg: "#5b6ef712",
    green: "#3fb68b", greenBg: "#1a3a2e", amber: "#d29922", amberBg: "#3d2e00",
    red: "#f85149", redBg: "#3d1418", blue: "#5b6ef7", purple: "#bc8cff",
    shadow: "0 1px 3px rgba(0,0,0,0.3)", shadowLg: "0 4px 12px rgba(0,0,0,0.3)",
    heroBg: "linear-gradient(135deg, #1e2250 0%, #171a3a 50%, #0c0e1a 100%)",
    heroText: "#e4e6f0", heroMuted: "#8e90a8",
  },
};
const TC = createContext(THEMES.light);
const useT = () => useContext(TC);

// ═══════════════════════════════════════════════════════════
// PRODUCT DATA
// ═══════════════════════════════════════════════════════════
const LAST_UPDATED = "12 May 2026";
const PRODUCTS = [
  { id: "solar", icon: "☀️", label: "Solar Panels", tagline: "Turn sunlight into savings on your electricity bill",
    definition: "Solar panels are rooftop photovoltaic systems that convert sunlight into electricity for Australian homes, typically saving $1,000–$2,200 per year on energy bills. A standard 6.6kW system costs $4,000–$8,000 after the federal STC rebate in 2026.",
    heroStat: "25 yrs", heroLabel: "expected lifespan", avgCost: { low: 4000, high: 8000, typical: 5500 }, annualSavings: { low: 1000, high: 2200 }, payback: "3–5 years", greenLoanEligible: true,
    metaTitle: "Solar Panels Australia — Costs, Rebates & Savings Guide 2026",
    howItWorks: "Solar panels convert sunlight into DC electricity using photovoltaic cells. An inverter converts this to AC power your home can use. A typical 6.6kW system installed on an Australian roof generates 25–30kWh of electricity per day, depending on location and season. Excess energy that is not used by the household feeds into the electricity grid and earns a feed-in tariff from your energy retailer. Alternatively, excess energy can charge a home battery for use at night. Australia has over 4.3 million homes with rooftop solar, making it the world leader in residential solar adoption per capita.",
    keyConsiderations: [
      "North-facing roof orientation is ideal in Australia, but east/west split systems work well for households with morning and evening energy usage patterns.",
      "A 6.6kW system is the most popular residential size in Australia, generating roughly 25–30kWh per day. This size maximises the inverter capacity allowed under most network connection agreements.",
      "Inverter quality is as important as panel quality for long-term performance. Fronius, Enphase, and SolarEdge are the three premium inverter brands recommended by most Australian installers.",
      "Federal STC rebates reduce the upfront cost of a 6.6kW system by approximately $2,500–$3,000 in 2026. These rebates step down every six months until the scheme ends in 2030, meaning earlier installation locks in higher savings.",
      "Self-consumption of solar energy saves 3–4 times more money than exporting to the grid. Using your own solar electricity avoids paying 30–40 cents per kWh in grid import costs, compared to receiving only 5–10 cents per kWh in feed-in tariffs.",
    ],
    rebateSnapshot: "The federal STC rebate is worth approximately $2,900 on a 6.6kW solar system in 2026. Victoria offers an additional $1,400 Solar Homes rebate for eligible households. The ACT provides $2,500 for concession card holders. Queensland offers $3,500 for landlords installing solar on rental properties. All STC rebates are applied automatically at point of sale by your accredited installer.",
    faq: [
      { q: "How much do solar panels cost in Australia in 2026?", a: "A quality 6.6kW solar panel system in Australia costs $4,000–$8,000 after the federal STC rebate in 2026. The price varies by state, installer, and equipment quality. Premium systems using Enphase microinverters or SolarEdge optimisers sit at the higher end of this range. Budget systems using string inverters sit at the lower end." },
      { q: "What government rebates are available for solar panels in Australia?", a: "The main federal rebate is the Small-scale Technology Certificate (STC) scheme, worth approximately $2,900 on a 6.6kW system in 2026. Additional state rebates include Victoria's Solar Homes rebate ($1,400), the ACT Home Energy Support rebate ($2,500 for concession holders), and Queensland's Solar for Rentals program ($3,500 for landlords). Federal STCs are applied automatically by your installer at point of sale." },
      { q: "How long do solar panels take to pay for themselves in Australia?", a: "Most Australian solar panel systems pay for themselves in 3–5 years through electricity bill savings. After the payback period, the system generates effectively free electricity for the remaining 20–25 years of its lifespan. Payback periods are shorter in states with higher electricity prices and more sunshine hours." },
      { q: "What size solar system do I need for my home?", a: "A 6.6kW solar system is the most popular residential size in Australia and suits most 3–4 bedroom homes. It generates 25–30kWh per day, which covers typical daytime usage and provides surplus energy to export or store in a battery. Larger homes or those with pools, electric vehicles, or high consumption may benefit from 10kW or larger systems." },
      { q: "Are solar panels worth it in Australia in 2026?", a: "Solar panels remain one of the best investments available to Australian homeowners in 2026. A typical 6.6kW system saves $1,000–$2,200 per year on electricity bills, delivers a 3–5 year payback period, and continues generating free electricity for 20+ years. Government rebates cover 30–50% of the upfront cost. Rising electricity prices and declining feed-in tariffs make self-consumption increasingly valuable." },
      { q: "Do solar panels work on cloudy days in Australia?", a: "Solar panels generate electricity on cloudy days, though at reduced output — typically 10–30% of full capacity depending on cloud density. Australia's high average solar irradiance means that even southern cities like Melbourne and Hobart receive enough sunlight for solar to be financially worthwhile. System output is calculated on annual averages, which account for seasonal and weather variations." },
    ],
  },
  { id: "battery", icon: "🔋", label: "Home Battery", tagline: "Store your solar energy and use it at night",
    definition: "A home battery is an energy storage system that stores excess solar electricity generated during the day for use at night, reducing reliance on the grid by 70–80%. Home batteries in Australia cost $7,000–$16,000 before rebates, with the federal Cheaper Home Batteries Program covering approximately 30% of the cost in 2026.",
    heroStat: "70-80%", heroLabel: "grid independence", avgCost: { low: 7000, high: 16000, typical: 9500 }, annualSavings: { low: 800, high: 1800 }, payback: "5–8 years", greenLoanEligible: true,
    metaTitle: "Home Battery Storage Australia — Rebates, Costs & VPP Guide 2026",
    howItWorks: "A home battery stores excess solar energy produced during the day for use at night or during expensive peak tariff periods. Most modern home batteries sold in Australia use lithium iron phosphate (LFP) chemistry, which is safe, long-lasting, and recyclable. A typical 10–13kWh battery provides enough stored energy to power an average Australian household through the evening and overnight. Many home batteries also provide backup power during grid blackouts and can participate in Virtual Power Plant (VPP) programs that earn the homeowner $300–$800 per year in additional income. The federal government's Cheaper Home Batteries Program, backed by $7.2 billion in funding, provides rebates of approximately 30% on eligible battery installations until 2030. Over 180,000 home batteries were installed in Australia in 2025 alone.",
    keyConsiderations: [
      "A 10kWh battery suits most Australian households, covering typical evening and overnight electricity usage. Homes with higher consumption or electric vehicle charging may benefit from 13–16kWh systems.",
      "Virtual Power Plant (VPP) participation allows your battery to support the electricity grid during peak demand periods. In return, homeowners earn $300–$800 per year in credits or payments. Most state battery rebates require VPP capability at installation.",
      "The federal Cheaper Home Batteries Program uses a tiered rebate structure from May 2026: the full STC rate applies to the first 14kWh of battery capacity, 60% applies to capacity between 14–28kWh, and 15% applies to capacity between 28–50kWh.",
      "Federal and state battery rebates can be stacked for maximum savings. For example, a Western Australian homeowner with a Synergy account can combine the federal rebate with $1,300 in state rebates, while Horizon Power customers receive $3,800 in state rebates on top of the federal scheme.",
      "Battery warranties typically run 10–15 years. Look for a warranty that guarantees at least 70% capacity retention at end of warranty. Leading brands include Tesla Powerwall 3, BYD, Sungrow, and Enphase.",
    ],
    rebateSnapshot: "The federal Cheaper Home Batteries Program provides approximately $2,520–$3,528 in rebates on a 10–14kWh battery in 2026. Western Australia adds $1,300 (Synergy customers) or $3,800 (Horizon Power customers). NSW provides up to $2,400 through the PDRS scheme. South Australia offers $1,200 through the VPP Battery Bonus. All rebates are applied at point of sale by your accredited installer.",
    faq: [
      { q: "How much does a home battery cost in Australia in 2026?", a: "Home batteries in Australia cost $7,000–$16,000 before rebates in 2026, depending on capacity and brand. A popular 10kWh system costs approximately $9,000–$11,000 before rebates. After stacking federal and state rebates, the out-of-pocket cost typically drops to $4,000–$7,000. The federal Cheaper Home Batteries Program covers approximately 30% of the cost." },
      { q: "Is the federal battery rebate still available in 2026?", a: "Yes. The federal Cheaper Home Batteries Program is backed by $7.2 billion in funding and will continue until 2030. From 1 May 2026, the rebate uses a tiered structure: full rate on the first 14kWh, 60% rate on 14–28kWh, and 15% on 28–50kWh. Rebate values step down every six months, so earlier installation secures higher savings." },
      { q: "What is a Virtual Power Plant and how does it work?", a: "A Virtual Power Plant (VPP) is a network of home batteries that collectively support the electricity grid during periods of high demand. When the grid needs extra power, your battery exports stored energy and you receive payments or credits — typically $300–$800 per year. VPP participation is required for most state battery rebate programs and is voluntary under the federal scheme." },
      { q: "What size home battery do I need in Australia?", a: "Most Australian homes need a 10–13kWh battery to cover evening and overnight electricity usage. A 10kWh battery suits a typical 3–4 person household. Homes with electric vehicle charging, pool pumps, or high consumption should consider 13–16kWh. The federal rebate provides the strongest per-kWh discount on the first 14kWh, making this the optimal size range for value." },
      { q: "Can I get a home battery without existing solar panels?", a: "Yes. The federal Cheaper Home Batteries Program does not require existing solar panels. However, batteries save the most money when paired with solar, because you store free solar energy instead of buying electricity from the grid. Most battery installers recommend installing solar and battery together or adding a battery to an existing solar system." },
      { q: "How long does a home battery last?", a: "Modern home batteries using lithium iron phosphate (LFP) chemistry last 10–15 years. Most manufacturers offer 10-year warranties guaranteeing at least 70% capacity retention. After the warranty period, the battery continues to function but with gradually reduced storage capacity. At current electricity prices, most batteries pay for themselves in 5–8 years." },
    ],
  },
  { id: "heat_pump", icon: "🌡️", label: "Heat Pump Hot Water", tagline: "3x more efficient than electric — the smart hot water switch",
    definition: "A heat pump hot water system is an energy-efficient water heater that extracts warmth from the surrounding air to heat water, using approximately one-third of the electricity of a standard electric hot water system. Heat pump hot water systems cost $2,800–$5,000 installed in Australia, with federal STC rebates of $330–$640 available in 2026.",
    heroStat: "65-75%", heroLabel: "energy cost reduction", avgCost: { low: 2800, high: 5000, typical: 3800 }, annualSavings: { low: 400, high: 900 }, payback: "3–5 years", greenLoanEligible: true,
    metaTitle: "Heat Pump Hot Water Australia — Rebates, Costs & Efficiency Guide 2026",
    howItWorks: "A heat pump hot water system works like a reverse refrigerator. It extracts thermal energy from the surrounding air and transfers it to heat water stored in an insulated tank. For every 1kW of electricity consumed, a heat pump produces 3–4kW of heat energy, making it roughly three times more efficient than a conventional electric hot water system. When connected to a solar PV system and scheduled to run during daylight hours, a heat pump can heat water using free solar electricity, reducing running costs to near zero. Heat pump hot water systems are the most common replacement when upgrading from gas or electric storage systems as part of home electrification. Popular brands in Australia include Reclaim Energy (Australian-made), Sanden (Japanese-made), iStore, Rheem, and Stiebel Eltron.",
    keyConsiderations: [
      "Replacing an electric hot water system with a heat pump earns approximately $640 in federal STC rebates. Replacing a gas system earns approximately $330. The difference reflects the higher energy savings from switching off resistive electric heating.",
      "Heat pumps can be scheduled to run during solar production hours, using your rooftop solar panels to power the heating cycle at zero cost. This effectively turns your hot water tank into a thermal battery, storing solar energy as heat.",
      "Noise output varies between brands and models. Premium CO2 refrigerant models from Reclaim Energy and Sanden operate at 37–44 dB — quieter than a normal conversation. Check the dB rating and consider placement away from bedroom windows.",
      "Modern heat pumps work effectively in temperatures as low as -7°C, though efficiency reduces below 5°C. CO2 refrigerant models (Reclaim, Sanden) perform best in cold climates. All models sold in Australia are tested for Australian conditions.",
      "Tank sizing: 250L suits 2–3 people, 315L suits 4–5 people. Slightly oversizing the tank is better than undersizing, as a larger tank provides a buffer for high-demand periods like consecutive morning showers.",
    ],
    rebateSnapshot: "The federal STC rebate provides approximately $640 when replacing an electric hot water system, or $330 when replacing gas. Victoria's VEU scheme provides approximately $1,000 in point-of-sale discounts. South Australia's REPS scheme provides approximately $600. The ACT offers $2,500 for concession card holders. All rebates are applied at point of sale by your installer.",
    faq: [
      { q: "How much does a heat pump hot water system cost in Australia?", a: "A heat pump hot water system in Australia costs $2,800–$5,000 fully installed in 2026. After the federal STC rebate ($330–$640) and any state incentives, the out-of-pocket cost is typically $1,800–$4,200. Premium CO2 models from Reclaim and Sanden sit at the higher end. Budget-friendly integrated models from iStore and Rheem sit at the lower end." },
      { q: "Are heat pump hot water systems noisy?", a: "Modern heat pump hot water systems produce 37–55 dB of noise during operation, which is similar to a quiet conversation or a household refrigerator. Premium CO2 models from Reclaim Energy and Sanden are the quietest at 37–44 dB. Placement 2–3 metres from bedroom windows is recommended for any model." },
      { q: "Do heat pump hot water systems work in cold weather?", a: "Yes. Modern heat pump hot water systems sold in Australia work in temperatures as low as -7°C. CO2 refrigerant models from Reclaim and Sanden maintain high efficiency in cold conditions and are recommended for southern Australian climates including Victoria, Tasmania, and the ACT. Some budget models use backup electric elements that activate below 5°C." },
      { q: "What government rebates are available for heat pump hot water?", a: "Federal STC rebates provide $330–$640 depending on the fuel type being replaced. Victoria's VEU scheme offers approximately $1,000. South Australia's REPS scheme offers approximately $600. The ACT's Home Energy Support program offers $2,500 for concession holders. These rebates can be stacked for total savings of $1,000–$3,100 depending on your state." },
      { q: "What size heat pump hot water system do I need?", a: "A 250L tank suits 1–3 people, a 315L tank suits 3–5 people, and a 400L+ tank suits 5 or more people. Most Australian families of 3–4 people choose a 315L system. Oversizing slightly is recommended to ensure hot water availability during peak usage periods." },
    ],
  },
  { id: "ac", icon: "❄️", label: "Efficient Air Conditioning", tagline: "Smart climate control that cuts energy bills",
    definition: "Energy-efficient air conditioning in Australia refers to modern reverse-cycle systems with high energy star ratings that heat and cool homes using 30–50% less electricity than older units. A new efficient air conditioning system costs $1,800–$6,000 installed, with green loan financing available for qualifying models in 2026.",
    heroStat: "30-50%", heroLabel: "savings vs old units", avgCost: { low: 1800, high: 6000, typical: 3500 }, annualSavings: { low: 300, high: 700 }, payback: "4–7 years", greenLoanEligible: true,
    metaTitle: "Energy Efficient Air Conditioning Australia — Costs, Rebates & Green Loan Guide 2026",
    howItWorks: "Modern reverse-cycle air conditioners use heat pump technology to both heat and cool a home. In winter, they extract warmth from outdoor air and transfer it inside. In summer, they reverse the process to remove heat. A high-efficiency unit with a 5-star or higher energy rating can be 3–6 times more efficient than resistive electric heating and significantly more efficient than gas ducted systems. Inverter technology, which adjusts the compressor speed continuously rather than cycling on and off, reduces electricity consumption by 30–50% compared to non-inverter models. When paired with rooftop solar panels, running air conditioning during daylight hours is effectively free.",
    keyConsiderations: [
      "Each additional energy star rating on an air conditioning unit represents approximately 20% less electricity consumption. A 5-star unit uses roughly 40% less energy than a 3-star unit of the same capacity.",
      "Inverter technology adjusts the compressor speed continuously instead of cycling between full power and off. This saves 30–50% on running costs compared to non-inverter units and provides more stable room temperatures.",
      "Zoning capability in ducted systems allows you to heat or cool only the rooms being used, avoiding the waste of conditioning empty rooms. This can reduce running costs by an additional 20–40%.",
      "Only air conditioning models that meet specific energy efficiency standards qualify for green loan financing. Confirm your chosen model's eligibility with your installer and lender before purchasing.",
      "Running air conditioning during solar production hours uses free electricity from your rooftop panels. Smart thermostats can automate this scheduling to maximise solar self-consumption.",
    ],
    rebateSnapshot: "Energy-efficient air conditioning may qualify for state energy efficiency certificate discounts through Victoria's VEU scheme or NSW's ESS scheme. Green loan financing at reduced interest rates is available for models meeting efficiency criteria. Check your specific model's eligibility with your installer.",
    faq: [
      { q: "Can I finance air conditioning with a green loan in Australia?", a: "Yes. Energy-efficient air conditioning units that meet strict efficiency standards are eligible for green loan financing at reduced interest rates in Australia. Not all models qualify — only those meeting specific energy performance criteria. Confirm eligibility with your installer and lender before purchasing. Green loan terms range from 3–10 years with no early repayment fees." },
      { q: "How much does energy efficient air conditioning cost in Australia?", a: "Energy-efficient split system air conditioning in Australia costs $1,800–$4,000 installed for a single room unit. Ducted systems with zoning cost $4,000–$6,000 or more depending on the size of the home. Operating costs for a high-efficiency system are typically $300–$700 per year less than an older or less efficient unit." },
      { q: "What is the most efficient type of air conditioning in Australia?", a: "Reverse-cycle inverter split systems with 5-star or higher energy ratings are the most efficient air conditioning option for Australian homes. They provide both heating and cooling from one unit and use heat pump technology that is 3–6 times more efficient than resistive electric heating. Leading brands include Daikin, Mitsubishi Electric, Fujitsu, and Samsung." },
    ],
  },
  { id: "lighting", icon: "💡", label: "LED Lighting Upgrade", tagline: "80% less energy — the easiest home upgrade",
    definition: "An LED lighting upgrade replaces old halogen downlights and fluorescent tubes with energy-efficient LED alternatives, reducing lighting electricity consumption by 75–80%. LED upgrades are available free of charge in Victoria and NSW through government energy efficiency schemes, or can be financed through a green loan in other states.",
    heroStat: "80%", heroLabel: "less energy than halogen", avgCost: { low: 500, high: 3000, typical: 1500 }, annualSavings: { low: 150, high: 500 }, payback: "1–3 years", greenLoanEligible: true,
    metaTitle: "LED Lighting Upgrade Australia — Free Schemes, Costs & Energy Savings 2026",
    howItWorks: "Replacing halogen downlights and fluorescent tubes with modern LED alternatives reduces lighting electricity consumption by 75–80%. A typical Australian home with 20 halogen downlights consumes approximately $400–$600 per year in lighting electricity. After upgrading to LEDs, that cost drops to $80–$120 per year. Modern LEDs last 25,000–50,000 hours (equivalent to 15–25 years at average household use) and produce significantly less heat than halogen bulbs, which also reduces summer cooling costs. In Victoria and NSW, free LED upgrade programs funded by government energy efficiency certificate schemes allow homeowners to replace old lighting at no cost. In other states, LED upgrades can be financed through green loan programs.",
    keyConsiderations: [
      "Whole-home LED replacement is the fastest payback energy upgrade available to Australian homeowners, with most households recouping the investment in 1–3 years through reduced electricity bills.",
      "Victoria's Victorian Energy Upgrades (VEU) scheme and NSW's Energy Savings Scheme (ESS) fund free or near-free LED upgrades through accredited providers. The upgrade is paid for by energy retailers purchasing efficiency certificates, not by the homeowner.",
      "Colour temperature affects the mood and function of lighting. 3000K (warm white) is recommended for living areas and bedrooms. 4000–5000K (cool white) is recommended for kitchens, bathrooms, and workspaces.",
      "Smart LED systems add scheduling, dimming, and occupancy sensing features that provide additional energy savings beyond the basic efficiency improvement of switching from halogen to LED.",
      "LED lighting must meet specific energy efficiency standards to qualify for green loan financing. Standard decorative LED bulbs may not meet the threshold — check eligibility with your lender for larger upgrade projects.",
    ],
    rebateSnapshot: "LED lighting upgrades are often available free or near-free in Victoria through the VEU scheme and in NSW through the ESS scheme. Accredited providers handle all paperwork and installation. In other states, green loan financing is available for larger residential and commercial lighting upgrade projects.",
    faq: [
      { q: "Can I get free LED lights in Australia?", a: "In Victoria and NSW, yes. The Victorian Energy Upgrades (VEU) scheme and NSW Energy Savings Scheme (ESS) fund free LED lighting upgrades for eligible homes and businesses. Accredited providers replace old halogen and fluorescent fittings with LEDs at no cost to the homeowner. The program is funded by energy retailers purchasing energy efficiency certificates." },
      { q: "How much can I save by switching to LED lights?", a: "A typical Australian home with 20 halogen downlights saves $300–$480 per year by switching to LEDs. LED bulbs use 75–80% less electricity than halogen equivalents. Additional savings come from reduced cooling costs, since LEDs produce far less heat than halogen bulbs." },
      { q: "How long do LED lights last compared to halogen?", a: "LED lights last 25,000–50,000 hours, compared to 2,000–5,000 hours for halogen bulbs. At average household usage of 4–5 hours per day, an LED bulb lasts 15–25 years before needing replacement. This eliminates the ongoing cost of replacing halogen bulbs multiple times per year." },
    ],
  },
  { id: "ev", icon: "⚡", label: "Electric & Hybrid Vehicles", tagline: "Lower running costs, government incentives, and green loan financing",
    definition: "Electric vehicles (EVs) and plug-in hybrid vehicles (PHEVs) are cars powered fully or partially by electricity, offering running costs of approximately $2–3 per 100km compared to $12–15 per 100km for petrol vehicles. In Australia in 2026, EVs are eligible for a federal Fringe Benefits Tax exemption, state-level registration and stamp duty concessions, and green loan financing.",
    heroStat: "$2-3", heroLabel: "per 100km running cost", avgCost: { low: 35000, high: 75000, typical: 50000 }, annualSavings: { low: 1500, high: 4000 }, payback: "Ongoing fuel savings", greenLoanEligible: true, greenLoanNote: "Eligible for green loan financing. Electric and hybrid vehicles must meet lender eligibility criteria.",
    metaTitle: "Electric Vehicles Australia — Incentives, Running Costs & Green Loan Guide 2026",
    howItWorks: "Electric vehicles (BEVs) run entirely on battery power charged from the electricity grid or home solar panels. Plug-in hybrid electric vehicles (PHEVs) combine an electric motor with a petrol engine, allowing short trips on electric power and longer trips using petrol. Home charging from a standard 7kW Level 2 charger adds approximately 40km of driving range per hour, meaning overnight charging covers most daily commutes. When charged using rooftop solar panels, the running cost of an EV drops to approximately 2–3 cents per kilometre — a fraction of the 12–15 cents per kilometre typical of petrol vehicles. Most EV manufacturers offer 8-year or 160,000km battery warranties. Australia's public charging network has expanded significantly, with fast chargers now available along most major highways and in urban centres across all states.",
    keyConsiderations: [
      "Running costs for an EV are approximately $2–3 per 100km on electricity, compared to $12–15 per 100km for a petrol vehicle. Charging from home solar reduces this cost further, to as low as $0.50 per 100km.",
      "The federal Fringe Benefits Tax (FBT) exemption removes FBT on eligible electric vehicles under the luxury car tax threshold ($91,387 in 2025-26). This benefit applies through employer salary packaging arrangements.",
      "Home charging using a 7kW Level 2 charger adds approximately 40km of range per hour. Overnight charging from a standard home power point at 2.3kW adds approximately 12km per hour. A dedicated home charger is recommended for daily convenience.",
      "Most EV manufacturers provide 8-year or 160,000km battery warranties. Modern EV batteries retain 80–90% of their original capacity after 200,000km of driving. Battery degradation is slower in moderate climates like most of Australia.",
      "Green loan financing is available for eligible electric and hybrid vehicles at reduced interest rates compared to standard car loans. This can be combined with other incentives where applicable.",
      "EV maintenance costs are significantly lower than petrol vehicles — no oil changes, fewer brake replacements (due to regenerative braking), and fewer moving parts overall. Annual servicing costs are typically 30–50% lower.",
    ],
    rebateSnapshot: "The main federal incentive is the FBT exemption for eligible EVs under $91,387, available through employer salary packaging. The ACT offers low-interest loans ($2,000–$15,000 at 3% via the Sustainable Household Scheme) for zero-emission vehicle purchases. The Northern Territory waives registration fees for BEVs and PHEVs until June 2027. Queensland and Victoria offer concessional registration rates for EVs. Most state-level EV purchase rebates (WA $3,500, SA $3,000, NSW $3,000) closed in 2024–2025, though registration and stamp duty concessions remain in several states.",
    faq: [
      { q: "What government incentives are available for electric vehicles in Australia in 2026?", a: "The primary federal incentive is the Fringe Benefits Tax (FBT) exemption for eligible electric vehicles under the luxury car tax threshold, available through employer salary packaging. The ACT offers 3% interest loans up to $15,000 for zero-emission vehicles through the Sustainable Household Scheme. The Northern Territory waives registration fees for EVs until June 2027. Queensland and Victoria offer concessional registration and stamp duty rates. Most state-level purchase rebates have now closed." },
      { q: "How much does it cost to charge an electric car in Australia?", a: "Charging an electric car at home in Australia costs approximately $2–3 per 100km using grid electricity at average tariff rates. If you charge using rooftop solar panels during the day, the cost drops to approximately $0.50 per 100km. Public fast charging costs approximately $4–8 per 100km depending on the network and speed. In comparison, a petrol car costs approximately $12–15 per 100km at current fuel prices." },
      { q: "Can I finance an electric vehicle with a green loan?", a: "Yes. Electric and hybrid vehicles are eligible for green loan financing at reduced interest rates compared to standard car loans. Green loans for vehicles typically range from $5,000 to $45,000 with terms of 3–10 years and no early repayment fees. The vehicle must meet the lender's eligibility criteria for clean energy products." },
      { q: "How far can an electric car drive on a single charge?", a: "Modern electric vehicles sold in Australia typically offer 350–600km of driving range on a single charge, depending on the model. Popular models like the Tesla Model 3 offer approximately 500km, the BYD Atto 3 offers approximately 420km, and the Hyundai Ioniq 5 offers approximately 450km. Real-world range depends on driving conditions, speed, climate control use, and terrain." },
      { q: "Are electric cars cheaper to run than petrol cars in Australia?", a: "Yes. Electric vehicles cost approximately $500–$900 per year in electricity for average Australian driving (15,000km per year), compared to $2,000–$3,500 per year in petrol for equivalent driving. EV maintenance costs are also 30–50% lower due to fewer moving parts, no oil changes, and reduced brake wear from regenerative braking. Over a 10-year ownership period, total running cost savings typically range from $15,000–$30,000." },
      { q: "What is the ACT Sustainable Household Scheme for EVs?", a: "The ACT Sustainable Household Scheme provides low-interest loans of $2,000–$15,000 at 3% interest for the purchase of zero-emission vehicles by ACT residents. The loan is repayable over up to 10 years. The vehicle must be a zero-emission vehicle priced below the luxury car tax threshold of $91,387. This scheme also covers home EV charger installation." },
    ],
  },
];

const GREEN_LOAN_INELIGIBLE = [
  { item: "Standard insulation", reason: "Not classified as clean energy product" }, { item: "Double glazing / windows", reason: "Building upgrade, not energy appliance" },
  { item: "General renovations", reason: "Restricted to approved clean energy products" }, { item: "Non-energy-rated appliances", reason: "Must meet efficiency standards" },
  { item: "Standalone EV chargers", reason: "Charger alone typically not eligible" }, { item: "Solar pool heating", reason: "Eligibility varies by lender" },
];

const POSTCODE_TO_STATE = (pc) => { const n = parseInt(pc); if (n >= 2000 && n <= 2599) return "NSW"; if (n >= 2619 && n <= 2899) return "NSW"; if (n >= 2921 && n <= 2999) return "NSW"; if (n >= 2600 && n <= 2618) return "ACT"; if (n >= 2900 && n <= 2920) return "ACT"; if (n >= 3000 && n <= 3999) return "VIC"; if (n >= 4000 && n <= 4999) return "QLD"; if (n >= 5000 && n <= 5799) return "SA"; if (n >= 6000 && n <= 6797) return "WA"; if (n >= 7000 && n <= 7799) return "TAS"; if (n >= 800 && n <= 899) return "NT"; return null; };
const STATE_REBATES = { WA: [{ name: "WA Battery Rebate (Synergy)", value: 1300, product: "battery", note: "VPP required" }, { name: "WA Battery Rebate (Horizon)", value: 3800, product: "battery", note: "Horizon Power only" }], VIC: [{ name: "Solar Victoria Rebate", value: 1400, product: "solar", note: "Income < $210k" }, { name: "VEU Heat Pump Discount", value: 1000, product: "heat_pump" }], NSW: [{ name: "PDRS Battery Incentive", value: 2400, product: "battery", note: "6yr upfront" }, { name: "ESS Heat Pump Discount", value: 800, product: "heat_pump" }], QLD: [{ name: "Solar for Rentals", value: 3500, product: "solar", note: "Landlords only" }], SA: [{ name: "REPS Heat Pump Discount", value: 600, product: "heat_pump" }, { name: "SA VPP Battery Bonus", value: 1200, product: "battery" }], ACT: [{ name: "Home Energy Support A", value: 2500, product: "solar", note: "Concession holders" }, { name: "Home Energy Support B", value: 2500, product: "heat_pump", note: "Concession holders" }, { name: "Sustainable Household Loan", value: 15000, product: "multi", type: "loan", note: "3% interest up to $15k" }], TAS: [{ name: "Energy Saver Loan", value: 10000, product: "battery", type: "loan" }], NT: [{ name: "NT Battery Grant", value: 5000, product: "battery" }], };
function calcRebates(st, prods) { let r = []; if (prods.includes("solar")) r.push({ source: "Federal", name: "Solar STC Rebate", value: 2904 }); if (prods.includes("battery")) r.push({ source: "Federal", name: "Cheaper Home Batteries Rebate", value: 3276 }); if (prods.includes("heat_pump")) r.push({ source: "Federal", name: "Heat Pump STC Rebate", value: 640 }); if (st && STATE_REBATES[st]) STATE_REBATES[st].forEach(s => { if (prods.includes(s.product) || s.product === "multi") r.push({ source: st, ...s }); }); return r; }

const STAGES = ["New Lead", "Assessment Sent", "Finance Booked", "Finance Applied", "Approved", "Installer Matched", "Complete"];
const STAGE_COLORS = ["#6366f1", "#8b5cf6", "#0B6E4F", "#E65100", "#1565C0", "#2E7D32", "#1B5E20"];
const SAMPLE_LEADS = [
  { id: 1, name: "Sarah Mitchell", postcode: "6010", state: "WA", phone: "0412 345 678", email: "sarah.m@email.com", products: ["solar", "battery"], totalRebate: 7480, stage: 0, created: "2026-05-09", financeStatus: "Not started", source: "Calculator" },
  { id: 2, name: "James Chen", postcode: "3121", state: "VIC", phone: "0423 456 789", email: "jchen@email.com", products: ["battery", "heat_pump"], totalRebate: 4916, stage: 2, created: "2026-05-07", financeStatus: "Pre-approved", source: "AI Assessment" },
  { id: 3, name: "Emma Rodriguez", postcode: "2060", state: "NSW", phone: "0434 567 890", email: "emma.r@email.com", products: ["solar", "battery", "heat_pump"], totalRebate: 9220, stage: 3, created: "2026-05-05", financeStatus: "Application sent", source: "Calculator" },
  { id: 4, name: "Michael Okafor", postcode: "6027", state: "WA", phone: "0445 678 901", email: "m.okafor@email.com", products: ["solar", "battery"], totalRebate: 7480, stage: 1, created: "2026-05-08", financeStatus: "Not started", source: "Referral" },
  { id: 5, name: "Lisa Nguyen", postcode: "4122", state: "QLD", phone: "0456 789 012", email: "lisa.n@email.com", products: ["solar", "heat_pump"], totalRebate: 3544, stage: 4, created: "2026-05-01", financeStatus: "Approved", source: "AI Assessment" },
];

function dbLeadToLocal(row) {
  return {
    id: row.id, name: row.name, email: row.email, phone: row.phone,
    postcode: row.postcode, state: row.state, products: row.products || [],
    totalRebate: Number(row.total_rebate) || 0, stage: row.stage ?? 0,
    created: (row.created_at || '').slice(0, 10),
    financeStatus: row.finance_status || 'Not started', source: row.source || '',
    notes: (row.lead_notes || [])
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map(n => ({ text: n.content, time: n.created_at })),
  };
}

// ═══════════════════════════════════════════════════════════
// SHARED
// ═══════════════════════════════════════════════════════════
const Card = ({ children, style, onClick }) => { const t = useT(); return <div onClick={onClick} style={{ background: t.card, borderRadius: 12, border: `1px solid ${t.border}`, boxShadow: t.shadow, ...style }}>{children}</div>; };
const Badge = ({ children, color }) => { const t = useT(); const c = t[color] || color || t.primary; return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: `${c}15`, color: c, display: "inline-block" }}>{children}</span>; };
const Btn = ({ children, onClick, variant = "primary", disabled, full, style: sx }) => { const t = useT(); const bg = variant === "primary" ? t.primary : variant === "accent" ? t.accent : "transparent"; const clr = variant === "outline" ? t.primary : "#fff"; const bdr = variant === "outline" ? `1px solid ${t.primary}` : "none"; return <button onClick={onClick} disabled={disabled} style={{ padding: "12px 20px", borderRadius: 8, border: bdr, background: disabled ? t.borderLight : bg, color: disabled ? t.textDim : clr, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", width: full ? "100%" : "auto", transition: "all 0.15s", ...sx }}>{children}</button>; };

// ═══════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════
function Nav({ view, setView, theme, toggleTheme }) {
  const t = useT();
  return (<>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src={LOGO} alt="EnergyWhiz" style={{ height: 32 }} />
      </div>
      <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: t.inputBg, border: `1px solid ${t.borderLight}`, borderRadius: 8, padding: "5px 10px", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>{theme === "dark" ? "☀️" : "🌙"}</button>
    </header>
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", background: t.surface, borderTop: `1px solid ${t.border}`, zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {[["learn", "📚", "Learn"], ["rebates", "🧮", "Rebates"], ["finance", "💰", "Finance"]].map(([k, ic, l]) => (
        <button key={k} onClick={() => setView(k)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 0 6px", border: "none", cursor: "pointer", background: "transparent" }}>
          <span style={{ fontSize: 18 }}>{ic}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: view === k ? t.primary : t.textDim }}>{l}</span>
        </button>
      ))}
    </nav>
  </>);
}

// ═══════════════════════════════════════════════════════════
// LEARN VIEW — MoneySmart-inspired
// ═══════════════════════════════════════════════════════════
function LearnView({ setView }) {
  const t = useT();
  const [sel, setSel] = useState(null);
  const p = sel ? PRODUCTS.find(x => x.id === sel) : null;

  if (p) return (
    <main style={{ padding: "0 0 80px", maxWidth: 540, margin: "0 auto" }}>
      <div style={{ padding: "12px 16px" }}><button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: t.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>← Back to all products</button></div>

      <article itemScope itemType="https://schema.org/Article">
        {/* Definition-first hero — optimised for AI extraction */}
        <Card style={{ margin: "0 16px 12px", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div><span style={{ fontSize: 32 }}>{p.icon}</span><h1 itemProp="headline" style={{ fontSize: 21, fontWeight: 700, color: t.text, margin: "6px 0 2px" }}>{p.metaTitle.split("—")[0].trim()}</h1></div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}><div style={{ fontSize: 24, fontWeight: 700, color: t.primary }}>{p.heroStat}</div><div style={{ fontSize: 10, color: t.textDim }}>{p.heroLabel}</div></div>
          </div>
          {/* Definition paragraph — the first thing AI crawlers extract */}
          <p itemProp="description" style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.65, margin: "10px 0 0", paddingTop: 10, borderTop: `1px solid ${t.borderLight}` }}>{p.definition}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 11, color: t.textDim }}>Last updated: <time itemProp="dateModified" dateTime="2026-05-12">{LAST_UPDATED}</time></span>
            <Badge color="primary">Green loan eligible</Badge>
          </div>
        </Card>

        {/* Quick stats — citable data points */}
        <Card style={{ margin: "0 16px 12px", padding: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: "0 0 10px" }}>Key figures at a glance</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ l: "Typical cost in 2026", v: `$${p.avgCost.low.toLocaleString()}–${p.avgCost.high.toLocaleString()}` }, { l: "Annual energy savings", v: `$${p.annualSavings.low.toLocaleString()}–${p.annualSavings.high.toLocaleString()}` }, { l: "Payback period", v: p.payback }, { l: "Green loan finance", v: "✅ Eligible" }].map(s => (
              <div key={s.l} style={{ background: t.inputBg, borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 10, fontWeight: 600, color: t.textDim, textTransform: "uppercase" }}>{s.l}</div><div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginTop: 2 }}>{s.v}</div></div>
            ))}
          </div>
        </Card>

        {/* How it works — self-contained paragraphs for AI extraction */}
        <Card style={{ margin: "0 16px 12px", padding: 18 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 8px" }}>How {p.label.toLowerCase()} work in Australia</h2>
          <div itemProp="articleBody"><p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.65, margin: 0 }}>{p.howItWorks}</p></div>
        </Card>

        {/* Key considerations — each self-contained for extraction */}
        <Card style={{ margin: "0 16px 12px", padding: 18 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 12px" }}>What to consider before buying</h2>
          {p.keyConsiderations.map((c, i) => (<div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}><div style={{ width: 24, height: 24, borderRadius: 12, background: t.primaryLight, color: t.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div><p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.55, margin: 0 }}>{c}</p></div>))}
        </Card>

        {/* Rebate snapshot — self-contained, citable */}
        <Card style={{ margin: "0 16px 12px", padding: 18, borderColor: `${t.green}30` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: t.green, margin: "0 0 8px" }}>Government rebates available in 2026</h2>
          <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, margin: "0 0 12px" }}>{p.rebateSnapshot}</p>
          <Btn onClick={() => setView("rebates")} full>Calculate your exact rebates →</Btn>
        </Card>

        {/* FAQ — Schema.org FAQPage markup for AI and Google */}
        {p.faq?.length > 0 && (
          <Card style={{ margin: "0 16px 12px", padding: 18 }} itemScope itemType="https://schema.org/FAQPage">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 12px" }}>Frequently asked questions</h2>
            {p.faq.map((f, i) => (<div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ marginBottom: i < p.faq.length - 1 ? 14 : 0, paddingBottom: i < p.faq.length - 1 ? 14 : 0, borderBottom: i < p.faq.length - 1 ? `1px solid ${t.borderLight}` : "none" }}><h3 itemProp="name" style={{ fontSize: 14, fontWeight: 600, color: t.text, margin: "0 0 4px" }}>{f.q}</h3><div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text" style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, margin: 0 }}>{f.a}</p></div></div>))}
          </Card>
        )}

        {/* Green loan CTA */}
        <Card style={{ margin: "0 16px 12px", padding: 18, borderColor: `${t.primary}30` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: t.primary, margin: "0 0 8px" }}>Finance with a green loan</h2>
          <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.55, margin: "0 0 12px" }}>{p.label} qualifies for green loan financing at reduced interest rates in Australia. Options are available for no upfront out-of-pocket expenses, with loan terms from 3 to 10 years and no early exit fees.</p>
          <Btn onClick={() => setView("finance")} variant="accent" full>Calculate repayments →</Btn>
        </Card>

        <p style={{ padding: "0 16px", fontSize: 11, color: t.textDim }}>Source: EnergyWhiz research based on Australian Government rebate data, Clean Energy Regulator publications, and installer pricing as at {LAST_UPDATED}. Rebate values are subject to change.</p>
      </article>
    </main>
  );

  // ── Homepage ──
  return (
    <main style={{ padding: "0 0 80px" }}>
      {/* Hero — MoneySmart-style gradient banner */}
      <section style={{ background: t.heroBg, padding: "32px 20px 28px", color: t.heroText }}>
        <div style={{ maxWidth: 540, margin: "0 auto" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: "0 0 12px", color: t.heroText }}>Your trusted home to maximise energy rebates in Australia</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 16px", color: t.heroMuted }}>
            We've sourced the very best suppliers and provide competitive finance with options available for no upfront out-of-pocket expenses — meaning you can take full advantage of the rebates available in your area and maximise your energy savings.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 20px", color: t.heroMuted }}>
            With EnergyWhiz you can bundle the energy-saving products you want, arrange the funding, and be connected with our hand-picked network of installers — all from one place.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setView("rebates")} variant="outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", background: "rgba(255,255,255,0.1)" }}>Calculate rebates</Btn>
            <Btn onClick={() => setView("finance")} variant="outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff", background: "rgba(255,255,255,0.1)" }}>Finance calculator</Btn>
          </div>
        </div>
      </section>


      {/* Product cards */}
      <section style={{ maxWidth: 540, margin: "0 auto", padding: "24px 16px 0" }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: t.text, margin: "0 0 4px" }}>Energy-saving products</h2>
        <p style={{ fontSize: 14, color: t.textMuted, margin: "0 0 14px" }}>Understand your options, costs, and available government rebates.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PRODUCTS.map(pr => (
            <Card key={pr.id} onClick={() => setSel(pr.id)} style={{ padding: 14, cursor: "pointer" }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>{pr.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, margin: "0 0 2px" }}>{pr.label}</h3>
              <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 8px", lineHeight: 1.4 }}>{pr.tagline}</p>
              <div style={{ fontSize: 12, color: t.textDim }}>From ${pr.avgCost.low.toLocaleString()}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.green, marginTop: 2 }}>Payback {pr.payback}</div>
              <div style={{ marginTop: 8 }}><Badge color="primary">Green loan eligible</Badge></div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section style={{ maxWidth: 540, margin: "0 auto", padding: "20px 16px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card onClick={() => setView("rebates")} style={{ padding: 16, cursor: "pointer", borderLeft: `4px solid ${t.green}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: t.green, margin: 0 }}>🧮 Rebate calculator</h3>
            <p style={{ fontSize: 13, color: t.textMuted, margin: "4px 0 0" }}>See every government incentive you're eligible for based on your postcode.</p>
          </Card>
          <Card onClick={() => setView("finance")} style={{ padding: 16, cursor: "pointer", borderLeft: `4px solid ${t.accent}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: t.accent, margin: 0 }}>💰 Green loan calculator</h3>
            <p style={{ fontSize: 13, color: t.textMuted, margin: "4px 0 0" }}>Monthly repayments, total costs, and what can be financed with no upfront expense.</p>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 540, margin: "0 auto", padding: "24px 16px 0" }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>How EnergyWhiz works</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { num: "1", title: "Choose your products", desc: "Browse our guides to understand solar, batteries, heat pumps, and more. See costs, rebates, and savings." },
            { num: "2", title: "Calculate your rebates", desc: "Enter your postcode to see every federal and state government incentive available in your area." },
            { num: "3", title: "Arrange your finance", desc: "Green loans with no upfront costs. We arrange competitive finance under our Australian Credit Licence." },
            { num: "4", title: "Get installed", desc: "We connect you with a hand-picked, CEC-accredited installer. Rebates are applied automatically." },
          ].map(s => (
            <Card key={s.num} style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "start" }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: t.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{s.num}</div>
              <div><div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{s.title}</div><div style={{ fontSize: 13, color: t.textMuted, marginTop: 2, lineHeight: 1.5 }}>{s.desc}</div></div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 540, margin: "0 auto", padding: "24px 16px 0", borderTop: `1px solid ${t.borderLight}`, marginTop: 24 }}>
        <p style={{ fontSize: 12, color: t.textDim, lineHeight: 1.6, margin: "0 0 8px" }}>EnergyWhiz is an Australian-owned energy education and comparison platform. We help homeowners understand their options, access government rebates, arrange competitive green finance, and connect with accredited installers.</p>
        <p style={{ fontSize: 11, color: t.textDim, margin: 0 }}>Australian Credit Licence Holder · Independent · CEC-Accredited Installer Network · CEFC-Supported Green Loans</p>
      </footer>
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// REBATES VIEW
// ═══════════════════════════════════════════════════════════
function RebatesView({ onCaptureLead }) {
  const t = useT();
  const [pc, setPC] = useState(""); const [state, setState] = useState(null);
  const [sel, setSel] = useState([]); const [results, setResults] = useState(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const [captured, setCaptured] = useState(false);
  const totalR = results ? results.reduce((s, r) => s + (r.type === "loan" ? 0 : r.value), 0) : 0;
  const totalC = sel.reduce((s, id) => s + (PRODUCTS.find(p => p.id === id)?.avgCost.typical || 0), 0);
  const inp = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 15, outline: "none" };
  const lbl = { fontSize: 13, fontWeight: 600, color: t.text, display: "block", marginBottom: 6 };

  return (
    <main style={{ padding: "20px 16px 80px", maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: "0 0 4px" }}>Energy rebate calculator</h1>
      <p style={{ fontSize: 14, color: t.textMuted, margin: "0 0 16px" }}>Find every federal and state government rebate you're eligible for.</p>
      {!results ? (
        <Card style={{ padding: 20 }}>
          <label style={lbl}>Your postcode</label>
          <input value={pc} onChange={e => { setPC(e.target.value.replace(/\D/g, "").slice(0, 4)); const s = POSTCODE_TO_STATE(e.target.value); setState(s || null); }} placeholder="e.g. 6010" style={{ ...inp, fontSize: 18, fontWeight: 600, marginBottom: 4 }} />
          {state && <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, marginBottom: 10 }}>📍 {state} detected</div>}
          <label style={{ ...lbl, marginTop: 14 }}>What are you considering?</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {PRODUCTS.map(p => { const on = sel.includes(p.id); return (<button key={p.id} onClick={() => setSel(prev => on ? prev.filter(x => x !== p.id) : [...prev, p.id])} style={{ padding: "12px", borderRadius: 10, border: `2px solid ${on ? t.primary : t.border}`, background: on ? t.primaryBg : "transparent", cursor: "pointer", textAlign: "center" }}><div style={{ fontSize: 22 }}>{p.icon}</div><div style={{ fontSize: 12, fontWeight: 600, color: on ? t.primary : t.textMuted, marginTop: 2 }}>{p.label}</div></button>); })}
          </div>
          <Btn onClick={() => setResults(calcRebates(state, sel))} disabled={!state || !sel.length} full>Calculate my rebates →</Btn>
        </Card>
      ) : (
        <div>
          <Card style={{ padding: 24, textAlign: "center", marginBottom: 12, borderColor: `${t.primary}30` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.primary, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your total rebate stack</div>
            <div style={{ fontSize: 42, fontWeight: 700, color: t.text, letterSpacing: "-0.03em" }}>${totalR.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>{state} · {sel.length} product{sel.length > 1 ? "s" : ""}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
              <div><div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>${totalC.toLocaleString()}</div><div style={{ fontSize: 10, color: t.textDim }}>Est. cost</div></div>
              <div><div style={{ fontSize: 16, fontWeight: 600, color: t.green }}>${Math.max(0, totalC - totalR).toLocaleString()}</div><div style={{ fontSize: 10, color: t.textDim }}>After rebates</div></div>
              <div><div style={{ fontSize: 16, fontWeight: 600, color: t.amber }}>{totalC > 0 ? Math.round((totalR / totalC) * 100) : 0}%</div><div style={{ fontSize: 10, color: t.textDim }}>Covered</div></div>
            </div>
          </Card>
          <Card style={{ padding: 16, marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text, margin: "0 0 10px" }}>Rebate breakdown</h2>
            {results.map((r, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < results.length - 1 ? `1px solid ${t.borderLight}` : "none" }}><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{r.name}</div><div style={{ fontSize: 11, color: t.textDim, marginTop: 1 }}><Badge color={r.source === "Federal" ? "blue" : "purple"}>{r.source}</Badge> {r.note || ""}</div></div><div style={{ fontSize: 16, fontWeight: 600, color: r.type === "loan" ? t.amber : t.green, flexShrink: 0, marginLeft: 8 }}>{r.type === "loan" ? "Loan" : `$${r.value.toLocaleString()}`}</div></div>))}
          </Card>
          {!captured ? (
            <Card style={{ padding: 18, borderColor: `${t.primary}25` }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text, margin: "0 0 4px" }}>Get your personalised assessment</h2>
              <p style={{ fontSize: 13, color: t.textMuted, margin: "0 0 12px" }}>We'll email your full rebate breakdown, finance scenarios, and connect you with accredited installers.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={inp} />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={inp} />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" style={inp} />
                <Btn onClick={() => { if (name && email) { onCaptureLead({ id: Date.now(), name, email, phone, postcode: pc, state, products: sel, totalRebate: totalR, stage: 0, created: new Date().toISOString().split("T")[0], financeStatus: "Not started", source: "Calculator" }); setCaptured(true); }}} disabled={!name || !email} full>Get my free assessment →</Btn>
              </div>
            </Card>
          ) : (<Card style={{ padding: 20, textAlign: "center", borderColor: `${t.green}30` }}><span style={{ fontSize: 20 }}>✅</span><div style={{ fontSize: 15, fontWeight: 600, color: t.green, marginTop: 4 }}>Assessment on the way — check your inbox.</div></Card>)}
          <button onClick={() => { setResults(null); setSel([]); setCaptured(false); setPC(""); setState(null); }} style={{ width: "100%", marginTop: 10, padding: 10, borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, fontSize: 13, cursor: "pointer" }}>Start over</button>
        </div>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// FINANCE VIEW
// ═══════════════════════════════════════════════════════════
function FinanceView({ onCaptureLead, setView }) {
  const t = useT();
  const [lp, setLP] = useState(["solar"]); const [custom, setCustom] = useState(""); const [deposit, setDeposit] = useState("");
  const [term, setTerm] = useState(5); const [rate, setRate] = useState(9.49); const [showInelig, setShowInelig] = useState(false);
  const [fname, setFname] = useState(""); const [femail, setFemail] = useState(""); const [fphone, setFphone] = useState(""); const [fcaptured, setFcaptured] = useState(false);
  const FEE = 8.99;
  const prodT = lp.reduce((s, id) => s + (PRODUCTS.find(p => p.id === id)?.avgCost.typical || 0), 0);
  const base = custom ? parseFloat(custom) || 0 : prodT;
  const dep = parseFloat(deposit) || 0;
  const principal = Math.max(0, base - dep);
  const mr = rate / 100 / 12; const mo = term * 12;
  const mp = principal > 0 ? (principal * mr * Math.pow(1 + mr, mo)) / (Math.pow(1 + mr, mo) - 1) : 0;
  const totInt = mp * mo - principal; const totFee = FEE * mo;
  const inp = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 15, outline: "none" };
  const lbl = { fontSize: 13, fontWeight: 600, color: t.text, display: "block", marginBottom: 6 };

  return (
    <main style={{ padding: "20px 16px 80px", maxWidth: 540, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: "0 0 4px" }}>Green loan calculator</h1>
      <p style={{ fontSize: 13, color: t.textMuted, margin: "0 0 16px" }}>Rates from 9.49% p.a. · 3–10 year terms · $2,000–$45,000 · No early exit fees · CEFC-supported.</p>
      <Card style={{ padding: 16, marginBottom: 10 }}>
        <label style={lbl}>Eligible products — select what you're financing</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PRODUCTS.filter(p => p.greenLoanEligible).map(p => { const on = lp.includes(p.id); return (<button key={p.id} onClick={() => setLP(prev => on ? prev.filter(x => x !== p.id) : [...prev, p.id])} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1px solid ${on ? t.primary : t.border}`, background: on ? t.primaryBg : "transparent", cursor: "pointer", textAlign: "left" }}><span style={{ fontSize: 20 }}>{p.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: on ? t.primary : t.textMuted }}>{p.label}</div></div><span style={{ fontSize: 13, fontWeight: 600, color: t.textDim }}>~${p.avgCost.typical.toLocaleString()}</span></button>); })}
        </div>
      </Card>
      <Card style={{ marginBottom: 10, overflow: "hidden", borderColor: `${t.red}20` }}>
        <button onClick={() => setShowInelig(!showInelig)} style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer" }}><span style={{ fontSize: 13, fontWeight: 600, color: t.red }}>❌ Not eligible for green loans</span><span style={{ color: t.textDim }}>{showInelig ? "▲" : "▼"}</span></button>
        {showInelig && <div style={{ padding: "0 16px 14px" }}>{GREEN_LOAN_INELIGIBLE.map((item, i) => (<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}><span style={{ color: t.red, fontSize: 10, marginTop: 2, flexShrink: 0 }}>✗</span><div><div style={{ fontSize: 13, fontWeight: 500, color: t.textMuted }}>{item.item}</div><div style={{ fontSize: 11, color: t.textDim }}>{item.reason}</div></div></div>))}<p style={{ fontSize: 11, color: t.textDim, margin: "8px 0 0", padding: "6px 8px", background: t.amberBg, borderRadius: 6 }}>These may be financed via a standard personal loan at higher rates.</p></div>}
      </Card>
      <Card style={{ padding: 16, marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><label style={{ ...lbl, margin: 0 }}>Loan amount</label><span style={{ fontSize: 16, fontWeight: 600, color: t.text }}>${prodT.toLocaleString()}</span></div>
        <input value={custom} onChange={e => setCustom(e.target.value.replace(/[^\d]/g, ""))} placeholder="Or enter custom amount" style={{ ...inp, marginBottom: 12 }} />
        <label style={lbl}>Your contribution (deposit)</label>
        <input value={deposit} onChange={e => setDeposit(e.target.value.replace(/[^\d]/g, ""))} placeholder="$0 — optional, no upfront cost required" style={{ ...inp, marginBottom: 12 }} />
        <label style={lbl}>Loan term</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>{[3, 5, 7, 10].map(y => (<button key={y} onClick={() => setTerm(y)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${term === y ? t.primary : t.border}`, background: term === y ? t.primaryBg : "transparent", color: term === y ? t.primary : t.textDim, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{y} yr</button>))}</div>
        <label style={lbl}>Interest rate (p.a.)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="range" min="7" max="16" step="0.25" value={rate} onChange={e => setRate(parseFloat(e.target.value))} style={{ flex: 1, accentColor: t.primary }} /><span style={{ fontSize: 18, fontWeight: 600, color: t.primary, minWidth: 55 }}>{rate.toFixed(2)}%</span></div>
        <p style={{ fontSize: 11, color: t.textDim, margin: "4px 0 0" }}>Personalised rate based on your credit profile.</p>
      </Card>
      <Card style={{ padding: 20, borderColor: `${t.primary}25` }}>
        {principal < 2000 ? (<p style={{ textAlign: "center", color: t.amber, fontSize: 14, margin: 0 }}>Minimum green loan is $2,000</p>
        ) : principal > 45000 ? (<div style={{ textAlign: "center" }}><p style={{ color: t.amber, fontSize: 14, margin: "0 0 4px" }}>Maximum green loan is $45,000</p><p style={{ fontSize: 12, color: t.textDim, margin: 0 }}>Increase your deposit or reduce products</p></div>
        ) : (<>
          <div style={{ textAlign: "center", marginBottom: 14 }}><div style={{ fontSize: 11, fontWeight: 600, color: t.primary, textTransform: "uppercase" }}>Monthly repayment</div><div style={{ fontSize: 40, fontWeight: 700, color: t.text, letterSpacing: "-0.03em" }}>${(mp + FEE).toFixed(0)}</div><div style={{ fontSize: 12, color: t.textDim }}>incl. $8.99/mo fee · ${Math.round((mp + FEE) * 12 / 52)}/week</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{[{ l: "Loan amount", v: `$${principal.toLocaleString()}`, c: t.text }, { l: "Your deposit", v: dep > 0 ? `$${dep.toLocaleString()}` : "$0 — no upfront cost", c: dep > 0 ? t.green : t.textDim }, { l: "Total interest", v: `$${Math.round(totInt).toLocaleString()}`, c: t.amber }, { l: "Total fees", v: `$${Math.round(totFee).toLocaleString()}`, c: t.textMuted }, { l: "Total repaid", v: `$${Math.round(mp * mo + totFee).toLocaleString()}`, c: t.text }, { l: "Early exit fees", v: "None ✓", c: t.green }].map(r => (<div key={r.l} style={{ padding: "8px 10px", background: t.inputBg, borderRadius: 8 }}><div style={{ fontSize: 10, color: t.textDim }}>{r.l}</div><div style={{ fontSize: 14, fontWeight: 600, color: r.c }}>{r.v}</div></div>))}</div>
          {lp.length > 0 && (() => { const sL = lp.reduce((s, id) => s + (PRODUCTS.find(p => p.id === id)?.annualSavings.low || 0), 0); const sH = lp.reduce((s, id) => s + (PRODUCTS.find(p => p.id === id)?.annualSavings.high || 0), 0); const a = (mp + FEE) * 12; return (<div style={{ marginTop: 10, padding: "10px 12px", background: t.primaryLight, borderRadius: 8 }}><div style={{ fontSize: 12, fontWeight: 600, color: t.primary }}>Energy savings offset</div><p style={{ fontSize: 13, color: t.textMuted, margin: "2px 0 0" }}>Projected savings of ${sL.toLocaleString()}–${sH.toLocaleString()}/yr could cover {Math.round(sL / a * 100)}–{Math.min(100, Math.round(sH / a * 100))}% of your repayments.</p></div>); })()}
        </>)}
      </Card>
      <p style={{ fontSize: 10, color: t.textDim, marginTop: 12, lineHeight: 1.5 }}><strong>Disclaimer:</strong> Estimates only — not a loan offer or financial advice. Actual rates personalised to your circumstances. Green loan rates from 9.49% p.a. (comparison rate 10.60% p.a. on $30,000/60 months). Monthly fee $8.99. No early repayment fees. EnergyWhiz operates under Australian Credit Licence [number]. <span onClick={() => setView("crm")} style={{ color: t.accent, cursor: "pointer", textDecoration: "underline" }}>Admin</span></p>

      {/* Enquiry form */}
      {!fcaptured ? (
        <Card style={{ padding: 18, marginTop: 12, borderColor: `${t.primary}25` }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.text, margin: "0 0 4px" }}>Get a personalised finance quote</h2>
          <p style={{ fontSize: 12, color: t.textMuted, margin: "0 0 12px" }}>We'll review your situation and provide a personalised rate under our Australian Credit Licence. No obligation.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input value={fname} onChange={e => setFname(e.target.value)} placeholder="Full name" style={inp} />
            <input value={femail} onChange={e => setFemail(e.target.value)} placeholder="Email" style={inp} />
            <input value={fphone} onChange={e => setFphone(e.target.value)} placeholder="Phone (optional)" style={inp} />
            <Btn onClick={() => { if (fname && femail) { onCaptureLead({ id: Date.now(), name: fname, email: femail, phone: fphone, postcode: "", state: "", products: lp, totalRebate: 0, stage: 0, created: new Date().toISOString().split("T")[0], financeStatus: "Not started", source: "Finance Calculator", notes: [{ text: `Finance enquiry: ${lp.map(id => PRODUCTS.find(p=>p.id===id)?.label).join(", ")}. Loan amount: $${principal.toLocaleString()}, term: ${term}yr, rate: ${rate}%`, time: new Date().toISOString() }] }); setFcaptured(true); }}} disabled={!fname || !femail} full>Request my personalised quote →</Btn>
          </div>
        </Card>
      ) : (
        <Card style={{ padding: 18, marginTop: 12, textAlign: "center", borderColor: `${t.green}30` }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.green, marginTop: 4 }}>Thanks! We'll be in touch with your personalised quote.</div>
        </Card>
      )}
    </main>
  );
}

// ═══════════════════════════════════════════════════════════
// CRM VIEW
// ═══════════════════════════════════════════════════════════
function LoginView() {
  const t = useT();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError("");
    try { await signIn(email, password); } catch (err) { setError(err.message); setLoading(false); }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.bg, padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <h2 style={{ textAlign: "center", marginBottom: 24, color: t.text, fontSize: 22, fontWeight: 700 }}>EnergyWhiz Admin</h2>
        <form onSubmit={handleSubmit} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, boxShadow: t.shadow }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: t.text }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <Btn full disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Btn>
        </form>
      </div>
    </div>
  );
}

function CRMView({ leads, setLeads, setView, user }) {
  const t = useT();
  const [selId, setSelId] = useState(null);
  const [stageTab, setStageTab] = useState("all");
  const [noteText, setNoteText] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const leadsToday = leads.filter(l => l.created === today).length;
  const leadsWeek = leads.filter(l => l.created >= weekAgo).length;
  const pv = leads.reduce((s, l) => s + l.totalRebate, 0);
  const wip = leads.filter(l => l.stage > 0 && l.stage < STAGES.length - 1).length;
  const filtered = stageTab === "all" ? leads : leads.filter(l => l.stage === parseInt(stageTab));
  const sel = leads.find(l => l.id === selId);

  const addNote = async () => {
    if (!noteText.trim() || !selId) return;
    const text = noteText.trim(); const time = new Date().toISOString();
    setLeads(prev => prev.map(l => l.id === selId ? { ...l, notes: [...(l.notes || []), { text, time }] } : l));
    setNoteText("");
    if (supabase && user) { try { await addLeadNote(selId, text, user.id); } catch (err) { console.error("note save failed:", err); } }
  };
  const moveStage = async (id, s) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: s } : l));
    if (supabase) { try { await updateLeadStage(id, s); } catch (err) { console.error("stage update failed:", err); } }
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Source Sans 3', -apple-system, sans-serif" }}>
      {/* CRM Header */}
      <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO} alt="EnergyWhiz" style={{ height: 28 }} />
          <span style={{ fontSize: 14, color: t.textDim, fontWeight: 500 }}>CRM</span>
        </div>
        <button onClick={() => setView("learn")} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 6, padding: "6px 14px", color: t.textMuted, fontSize: 12, cursor: "pointer" }}>← Back to site</button>
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Dashboard KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Total Leads", value: leads.length, color: t.primary },
            { label: "Work in Progress", value: wip, color: t.amber },
            { label: "Leads Today", value: leadsToday, color: t.green },
            { label: "Leads This Week", value: leadsWeek, color: t.blue || t.accent },
          ].map(k => (
            <Card key={k.label} style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textDim, textTransform: "uppercase", letterSpacing: "0.03em" }}>{k.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: k.color, marginTop: 4 }}>{k.value}</div>
            </Card>
          ))}
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {/* Left — Lead list */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Stage tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
              <button onClick={() => setStageTab("all")} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${stageTab === "all" ? t.primary : t.border}`, background: stageTab === "all" ? t.primaryBg : "transparent", color: stageTab === "all" ? t.primary : t.textDim, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>All ({leads.length})</button>
              {STAGES.map((s, i) => { const c = leads.filter(l => l.stage === i).length; return (
                <button key={s} onClick={() => setStageTab(String(i))} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${stageTab === String(i) ? STAGE_COLORS[i] : t.border}`, background: stageTab === String(i) ? `${STAGE_COLORS[i]}12` : "transparent", color: stageTab === String(i) ? STAGE_COLORS[i] : t.textDim, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{s} ({c})</button>
              ); })}
            </div>

            {/* Lead table */}
            <Card style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: t.inputBg }}>
                  {["Name", "State", "Products", "Rebate", "Stage", "Finance", "Source", "Date"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: t.textDim, textAlign: "left", borderBottom: `1px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} onClick={() => setSelId(l.id)} style={{ cursor: "pointer", background: selId === l.id ? t.primaryBg : "transparent", borderBottom: `1px solid ${t.borderLight}` }}>
                      <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: t.text }}>{l.name}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: t.textMuted }}>{l.state || "—"}</td>
                      <td style={{ padding: "10px 12px", fontSize: 15 }}>{l.products.map(p => PRODUCTS.find(pr => pr.id === p)?.icon || "").join(" ")}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: t.primary }}>{l.totalRebate ? `$${l.totalRebate.toLocaleString()}` : "—"}</td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: `${STAGE_COLORS[l.stage]}15`, color: STAGE_COLORS[l.stage], fontWeight: 600 }}>{STAGES[l.stage]}</span></td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: l.financeStatus === "Approved" || l.financeStatus === "Settled" ? t.green : t.textDim }}>{l.financeStatus}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: t.textDim }}>{l.source}</td>
                      <td style={{ padding: "10px 12px", fontSize: 11, color: t.textDim }}>{l.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div style={{ padding: 24, textAlign: "center", color: t.textDim }}>No leads in this stage</div>}
            </Card>
          </div>

          {/* Right — Lead detail */}
          {sel && (
            <div style={{ width: 360, flexShrink: 0 }}>
              <Card style={{ padding: 18, position: "sticky", top: 60 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, margin: 0 }}>{sel.name}</h3>
                  <button onClick={() => setSelId(null)} style={{ background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div style={{ background: t.inputBg, borderRadius: 8, padding: 10 }}><div style={{ fontSize: 10, color: t.textDim }}>Rebate</div><div style={{ fontSize: 18, fontWeight: 700, color: t.primary }}>${sel.totalRebate ? sel.totalRebate.toLocaleString() : "—"}</div></div>
                  <div style={{ background: t.inputBg, borderRadius: 8, padding: 10 }}><div style={{ fontSize: 10, color: t.textDim }}>Finance</div><div style={{ fontSize: 13, fontWeight: 600, color: sel.financeStatus === "Approved" ? t.green : t.amber, marginTop: 3 }}>{sel.financeStatus}</div></div>
                </div>

                <div style={{ fontSize: 13, color: t.text, lineHeight: 1.7, marginBottom: 12 }}>
                  {sel.email && <>📧 {sel.email}<br /></>}
                  {sel.phone && <>📱 {sel.phone}<br /></>}
                  {sel.postcode && <>📍 {sel.postcode}{sel.state ? `, ${sel.state}` : ""}</>}
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textDim, marginBottom: 4 }}>PRODUCTS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{sel.products.map(p => <Badge key={p} color="primary">{PRODUCTS.find(pr => pr.id === p)?.icon} {PRODUCTS.find(pr => pr.id === p)?.label}</Badge>)}</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textDim, marginBottom: 4 }}>STAGE</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {STAGES.map((s, i) => (<button key={s} onClick={() => moveStage(sel.id, i)} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 5, border: `1px solid ${sel.stage === i ? STAGE_COLORS[i] : t.border}`, background: sel.stage === i ? `${STAGE_COLORS[i]}15` : "transparent", color: sel.stage === i ? STAGE_COLORS[i] : t.textDim, cursor: "pointer", fontWeight: 600 }}>{s}</button>))}
                  </div>
                </div>

                {/* Notes */}
                <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textDim, marginBottom: 8 }}>NOTES</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    <input value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()} placeholder="Add a note..." style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, outline: "none" }} />
                    <button onClick={addNote} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: t.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
                  </div>
                  <div style={{ maxHeight: 240, overflowY: "auto" }}>
                    {(sel.notes || []).slice().reverse().map((n, i) => (
                      <div key={i} style={{ marginBottom: 8, padding: "8px 10px", background: t.inputBg, borderRadius: 6 }}>
                        <div style={{ fontSize: 10, color: t.textDim, marginBottom: 2 }}>{new Date(n.time).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} at {new Date(n.time).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}</div>
                        <div style={{ fontSize: 13, color: t.text, lineHeight: 1.4 }}>{n.text}</div>
                      </div>
                    ))}
                    {(!sel.notes || sel.notes.length === 0) && <div style={{ fontSize: 12, color: t.textDim, fontStyle: "italic" }}>No notes yet</div>}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <Btn onClick={() => {}} full style={{ fontSize: 12, padding: "10px" }}>📧 Send Assessment</Btn>
                  <Btn onClick={() => {}} full style={{ fontSize: 12, padding: "10px", background: t.amber }}>💰 Start Finance</Btn>
                </div>
                <div style={{ fontSize: 10, color: t.textDim, textAlign: "center", marginTop: 8 }}>Created {sel.created} · {sel.source}</div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("learn");
  const [theme, setTheme] = useState("light");
  const [leads, setLeads] = useState(supabase ? [] : SAMPLE_LEADS.map(l => ({ ...l, notes: l.notes || [{ text: "Lead created via " + l.source, time: new Date(l.created + "T09:00:00").toISOString() }] })));
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const t = THEMES[theme];
  const isCRM = view === "crm";

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setAuthReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    fetchLeads().then(data => setLeads(data.map(dbLeadToLocal))).catch(console.error);
  }, [user]);

  const handleCaptureLead = async (lead, noteText) => {
    const newLead = { ...lead, notes: [{ text: noteText, time: new Date().toISOString() }] };
    setLeads(prev => [newLead, ...prev]);
    if (!supabase || !user) return;
    try {
      const row = await createLead({ name: lead.name, email: lead.email, phone: lead.phone || null, postcode: lead.postcode || null, state: lead.state || null, products: lead.products || [], total_rebate: lead.totalRebate || 0, stage: lead.stage ?? 0, finance_status: lead.financeStatus || null, source: lead.source || null, owner_id: user.id });
      if (row) {
        await addLeadNote(row.id, noteText, user.id);
        setLeads(prev => prev.map(l => l.id === newLead.id ? { ...dbLeadToLocal(row), notes: [{ text: noteText, time: new Date().toISOString() }] } : l));
      }
    } catch (err) { console.error("lead capture failed:", err); }
  };

  if (!authReady) return null;

  if (isCRM && !user && supabase) return <TC.Provider value={t}><LoginView /></TC.Provider>;

  return (
    <TC.Provider value={t}>
      <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Source Sans 3', 'Segoe UI', -apple-system, sans-serif", paddingBottom: isCRM ? 0 : 56 }}>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {!isCRM && <Nav view={view} setView={setView} theme={theme} toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />}
        {view === "learn" && <LearnView setView={setView} />}
        {view === "rebates" && <RebatesView onCaptureLead={l => handleCaptureLead(l, "Lead created via Rebate Calculator")} />}
        {view === "finance" && <FinanceView onCaptureLead={l => handleCaptureLead(l, l.notes?.[0]?.text || "Lead created via Finance Calculator")} setView={setView} />}
        {isCRM && <CRMView leads={leads} setLeads={setLeads} setView={setView} user={user} />}
      </div>
    </TC.Provider>
  );
}
