"""
Maintenance tasks database and seasonal preferences.
Ported from home_maintenance.py.
"""

# Each task: (category, name, frequency_months, description, estimated_time)
TASKS = [
    # --- Electrical ---
    ("Electrical", "Test GFCI Outlets", 1,
     "Press the TEST button on each GFCI outlet, then RESET. "
     "Check kitchen, bathrooms, garage, and outdoor outlets. "
     "If any don't trip or reset, call an electrician.",
     "15 min"),

    ("Electrical", "Test Smoke Detectors", 1,
     "Press and hold the test button on each smoke detector until it beeps. "
     "Check all floors including basement/attic. Replace any that don't respond.",
     "10 min"),

    ("Electrical", "Replace Smoke Detector Batteries", 6,
     "Replace batteries in all smoke detectors, even if they seem fine. "
     "Use name-brand 9V or AA batteries (check your model). "
     "Pro tip: Write the install date on the battery with a marker.",
     "20 min"),

    ("Electrical", "Test CO Detectors", 1,
     "Press the test button on each carbon monoxide detector. "
     "Ensure you have one on every floor and near sleeping areas. "
     "CO detectors expire after 5-7 years — check the manufacture date.",
     "10 min"),

    ("Electrical", "Check Surge Protectors", 24,
     "Inspect all surge protectors / power strips. "
     "If the protection indicator light is off, the surge protection is spent — replace it. "
     "Surge protectors degrade over time even without a surge event.",
     "15 min"),

    ("Electrical", "Inspect Electrical Panel", 12,
     "Open the electrical panel and visually inspect for: "
     "corrosion, burn marks, loose wires, or signs of moisture. "
     "DO NOT touch anything inside. If you see issues, call a licensed electrician. "
     "Also check that all breakers are labeled correctly.",
     "15 min"),

    # --- HVAC ---
    ("HVAC", "Replace Air Filters", 3,
     "Replace HVAC air filters (furnace and/or AC). "
     "Check your filter size (printed on the side of current filter). "
     "Use MERV 8-11 for most homes. Higher MERV = better filtration but more airflow resistance. "
     "Pro tip: Buy a year's supply at once to save money.",
     "10 min"),

    ("HVAC", "Professional HVAC Tune-Up", 6,
     "Schedule a professional HVAC service visit. "
     "Spring: AC tune-up before summer. Fall: heating tune-up before winter. "
     "They'll check refrigerant levels, clean coils, inspect electrical connections, "
     "and test safety controls. Budget $75-150 per visit.",
     "2-3 hours (tech visit)"),

    ("HVAC", "Clean Air Vents & Registers", 6,
     "Remove vent covers and wash with soap and water. "
     "Vacuum inside the duct opening as far as you can reach. "
     "Check that no vents are blocked by furniture. "
     "This improves airflow efficiency and air quality.",
     "30 min"),

    ("HVAC", "Check Thermostat Calibration", 12,
     "Place a separate thermometer next to your thermostat for 15 minutes. "
     "Compare readings — they should be within 1-2 degrees. "
     "If off, recalibrate or replace. Also check that the schedule/programming is correct. "
     "Consider upgrading to a smart thermostat if you haven't.",
     "15 min"),

    # --- Plumbing ---
    ("Plumbing", "Flush Water Heater", 12,
     "Attach a garden hose to the drain valve at the bottom of the water heater. "
     "Run the other end to a drain or outside. Open the valve and let water flow "
     "until it runs clear (5-10 min). This removes sediment buildup that "
     "reduces efficiency and shortens the heater's life. Turn off power/gas first.",
     "30 min"),

    ("Plumbing", "Check Water Heater Anode Rod", 36,
     "The anode rod protects your tank from corrosion. "
     "Turn off power/gas and water supply. Unscrew the hex head on top of the heater. "
     "If the rod is less than 1/2 inch thick or coated with calcium, replace it (~$20-30). "
     "This can extend your water heater's life by years. "
     "If uncomfortable, have a plumber check during a service call.",
     "30 min"),

    ("Plumbing", "Inspect Under Sinks for Leaks", 3,
     "Check under every sink (kitchen, bathrooms, utility). "
     "Look for: drips, water stains, mold, musty smell, warped wood. "
     "Run the faucet and disposal while checking. "
     "Catching a small leak early prevents major water damage.",
     "15 min"),

    ("Plumbing", "Test Water Shut-Off Valves", 12,
     "Locate and turn each shut-off valve (main, toilets, sinks, washing machine). "
     "Turn off, then back on. They should turn smoothly. "
     "Stiff valves may need replacement before an emergency. "
     "Make sure everyone in the household knows where the main shut-off is.",
     "20 min"),

    ("Plumbing", "Clean Faucet Aerators", 6,
     "Unscrew the aerator from each faucet tip. "
     "Soak in white vinegar for 30 minutes to dissolve mineral deposits. "
     "Scrub with an old toothbrush, rinse, and reinstall. "
     "This restores water pressure and flow consistency.",
     "20 min"),

    # --- Appliances ---
    ("Appliances", "Clean Refrigerator Coils", 6,
     "Pull the refrigerator away from the wall. "
     "Vacuum the coils on the back or underneath (check your model). "
     "Dusty coils make the compressor work harder, increasing energy bills "
     "and shortening the fridge's lifespan. Unplug first for safety.",
     "20 min"),

    ("Appliances", "Clean Dishwasher Filter", 1,
     "Remove the bottom rack and twist out the cylindrical filter. "
     "Rinse under hot water and scrub with a soft brush. "
     "A clogged filter leads to dirty dishes and bad odors. "
     "Also wipe down the door gasket and spray arms.",
     "10 min"),

    ("Appliances", "Clean Dryer Vent", 6,
     "Disconnect the dryer duct from the back of the dryer. "
     "Use a dryer vent brush or vacuum to clean the full length of the duct to the outside. "
     "Check the exterior vent flap opens freely. "
     "IMPORTANT: Clogged dryer vents are a leading cause of house fires.",
     "30 min"),

    ("Appliances", "Run Washing Machine Clean Cycle", 1,
     "Run an empty hot water cycle with 2 cups of white vinegar or a machine cleaner tablet. "
     "Wipe down the rubber gasket (front-loaders) and detergent dispenser. "
     "Leave the door open after use to prevent mold and mildew.",
     "10 min (+ cycle time)"),

    ("Appliances", "Clean Range Hood Filter", 3,
     "Remove the metal mesh filter from the range hood. "
     "Soak in hot water with dish soap and baking soda for 15 minutes. "
     "Scrub, rinse, and dry completely before reinstalling. "
     "A clean filter improves ventilation and reduces grease buildup.",
     "20 min"),

    # --- Exterior / Roof ---
    ("Exterior", "Inspect Roof for Damage", 12,
     "Visually inspect the roof from the ground with binoculars (spring is ideal). "
     "Look for: missing/damaged shingles, sagging areas, damaged flashing. "
     "Check attic for daylight coming through or water stains. "
     "Schedule a professional inspection every 3-5 years.",
     "20 min"),

    ("Exterior", "Clean Gutters", 6,
     "Remove leaves and debris from all gutters and downspouts. "
     "Best times: late spring (after pollen/seeds) and late fall (after leaves drop). "
     "Check that downspouts direct water at least 3 feet away from the foundation. "
     "Use a ladder safely — have someone spot you.",
     "1-2 hours"),

    ("Exterior", "Check Caulking Around Windows & Doors", 12,
     "Inspect the caulk/sealant around all exterior windows and doors. "
     "Look for cracks, gaps, or peeling. Re-caulk any failed areas with "
     "exterior-grade silicone caulk. This prevents water infiltration and improves energy efficiency.",
     "30 min - 1 hour"),

    ("Exterior", "Inspect Siding & Exterior Paint", 12,
     "Walk around the house and check for: peeling paint, cracked siding, "
     "gaps, rot, or pest damage. Pay attention to areas near the ground "
     "and around windows where moisture collects. Address small issues before they grow.",
     "20 min"),

    # --- Safety ---
    ("Safety", "Check Fire Extinguisher Pressure", 12,
     "Check the pressure gauge on each fire extinguisher — the needle should be in the green zone. "
     "Ensure the pin and tamper seal are intact. "
     "Flip the extinguisher upside down and shake to prevent powder from settling. "
     "Replace if expired or discharged. You should have one per floor, plus kitchen and garage.",
     "10 min"),

    ("Safety", "Review Emergency Shutoff Locations", 12,
     "Walk through and verify you know the location of: "
     "main water shut-off, gas shut-off, electrical main breaker, "
     "and individual circuit breakers. Test that they work. "
     "Make sure your spouse/partner also knows these locations. "
     "Label any that aren't clearly marked.",
     "15 min"),

    # --- Seasonal ---
    ("Seasonal", "Winterize Outdoor Faucets", 12,
     "Before the first freeze: disconnect all garden hoses. "
     "Turn off the interior shut-off valve for outdoor faucets (if you have one). "
     "Open the outdoor faucet to drain remaining water. "
     "Consider installing frost-proof hose bibs if you don't have them. "
     "Frozen pipes can burst and cause major damage.",
     "15 min"),

    ("Seasonal", "Check Weather Stripping", 12,
     "Inspect weather stripping around all exterior doors and windows. "
     "Close the door on a piece of paper — if it slides out easily, the seal is worn. "
     "Replace worn stripping with adhesive-backed foam or V-strip. "
     "Good seals reduce energy bills and keep pests out.",
     "30 min"),

    ("Seasonal", "Inspect Attic Insulation", 24,
     "Check attic insulation depth and condition. "
     "Most homes need R-38 to R-60 (10-16 inches of fiberglass). "
     "Look for: compressed areas, moisture damage, pest activity, gaps around fixtures. "
     "Adding insulation is one of the best ROI home improvements for energy savings.",
     "20 min"),
]

# Preferred months for seasonal tasks
SEASONAL_PREFERENCES = {
    "Inspect Roof for Damage": [4],
    "Clean Gutters": [4, 11],
    "Winterize Outdoor Faucets": [10],
    "Check Weather Stripping": [10],
    "Inspect Attic Insulation": [3],
    "Professional HVAC Tune-Up": [4, 10],
    "Check Caulking Around Windows & Doors": [5],
    "Inspect Siding & Exterior Paint": [5],
}
