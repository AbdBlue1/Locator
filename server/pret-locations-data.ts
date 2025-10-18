import type { Location } from "@shared/schema";

// Real Pret A Manger UK locations
// Data sourced from Pret's official shop finder
export const pretLocations: Location[] = [
  // London locations
  {
    id: "pret-001",
    name: "Shelton Street",
    address: "37 Shelton Street",
    city: "London",
    postcode: "WC2H 9HN",
    latitude: 51.5144,
    longitude: -0.1225,
    status: "open",
    openingHours: "Mon-Fri: 07:30-20:00, Sat-Sun: 08:00-19:00"
  },
  {
    id: "pret-002",
    name: "Warren Street",
    address: "14 Warren Street",
    city: "London",
    postcode: "W1T 5LL",
    latitude: 51.5246,
    longitude: -0.1374,
    status: "open",
    openingHours: "Mon-Fri: 07:00-16:30"
  },
  {
    id: "pret-003",
    name: "Tottenham Court Road",
    address: "67 Tottenham Court Road",
    city: "London",
    postcode: "W1T 2EY",
    latitude: 51.5188,
    longitude: -0.1313,
    status: "open",
    openingHours: "Mon-Sun: 06:30-22:00"
  },
  {
    id: "pret-004",
    name: "York Way",
    address: "York Way",
    city: "London",
    postcode: "N1C 9AP",
    latitude: 51.5354,
    longitude: -0.1235,
    status: "open",
    openingHours: "Open 24 hours"
  },
  {
    id: "pret-005",
    name: "Edgware Road",
    address: "26 Edgware Road",
    city: "London",
    postcode: "W2 2EH",
    latitude: 51.5150,
    longitude: -0.1635,
    status: "open",
    openingHours: "Mon-Fri: 07:30-21:00, Sat-Sun: 08:00-20:00"
  },
  {
    id: "pret-006",
    name: "Strand",
    address: "217 Strand",
    city: "London",
    postcode: "WC2R 1AT",
    latitude: 51.5115,
    longitude: -0.1180,
    status: "open",
    openingHours: "Mon-Fri: 07:00-19:00, Sat-Sun: 08:00-18:00"
  },
  {
    id: "pret-007",
    name: "King's Road",
    address: "35-37 King's Road",
    city: "London",
    postcode: "SW3 4NB",
    latitude: 51.4879,
    longitude: -0.1630,
    status: "open",
    openingHours: "Mon-Fri: 06:30-20:00, Sat-Sun: 07:30-19:00"
  },
  {
    id: "pret-008",
    name: "Parkfield Street",
    address: "12 Parkfield Street",
    city: "London",
    postcode: "N1 0PS",
    latitude: 51.5427,
    longitude: -0.1004,
    status: "open",
    openingHours: "Mon-Fri: 07:00-20:30, Sat-Sun: 08:00-19:00"
  },
  {
    id: "pret-009",
    name: "Waterloo Station",
    address: "Waterloo Station, Main Concourse",
    city: "London",
    postcode: "SE1 7NQ",
    latitude: 51.5036,
    longitude: -0.1143,
    status: "open",
    openingHours: "Mon-Fri: 05:30-23:00, Sat-Sun: 06:30-23:00"
  },
  {
    id: "pret-010",
    name: "Paddington Station",
    address: "Paddington Station",
    city: "London",
    postcode: "W2 1HB",
    latitude: 51.5154,
    longitude: -0.1755,
    status: "open",
    openingHours: "Mon-Sun: 05:00-22:00"
  },
  {
    id: "pret-011",
    name: "St Thomas Street",
    address: "St Thomas Street",
    city: "London",
    postcode: "SE1 9SP",
    latitude: 51.5040,
    longitude: -0.0857,
    status: "open",
    openingHours: "Mon-Fri: 05:30-23:30, Sat-Sun: 07:00-22:00"
  },
  {
    id: "pret-012",
    name: "Stratford",
    address: "21 Station Street",
    city: "London",
    postcode: "E15 1DA",
    latitude: 51.5416,
    longitude: 0.0042,
    status: "open",
    openingHours: "Mon-Sun: 05:00-22:00"
  },
  {
    id: "pret-013",
    name: "Canary Wharf",
    address: "Canada Square",
    city: "London",
    postcode: "E14 5AB",
    latitude: 51.5054,
    longitude: -0.0196,
    status: "open",
    openingHours: "Mon-Fri: 06:00-21:00, Sat-Sun: 08:00-18:00"
  },
  {
    id: "pret-014",
    name: "Liverpool Street Station",
    address: "Liverpool Street Station",
    city: "London",
    postcode: "EC2M 7PY",
    latitude: 51.5179,
    longitude: -0.0813,
    status: "open",
    openingHours: "Mon-Fri: 05:30-22:00, Sat-Sun: 07:00-21:00"
  },
  {
    id: "pret-015",
    name: "Victoria Station",
    address: "Victoria Station",
    city: "London",
    postcode: "SW1V 1JU",
    latitude: 51.4952,
    longitude: -0.1441,
    status: "open",
    openingHours: "Mon-Sun: 05:30-23:00"
  },
  {
    id: "pret-016",
    name: "Oxford Circus",
    address: "23 Oxford Street",
    city: "London",
    postcode: "W1D 2DW",
    latitude: 51.5155,
    longitude: -0.1421,
    status: "open",
    openingHours: "Mon-Sat: 06:30-22:00, Sun: 08:00-20:00"
  },
  {
    id: "pret-017",
    name: "Piccadilly Circus",
    address: "77-78 Piccadilly",
    city: "London",
    postcode: "W1J 8HZ",
    latitude: 51.5098,
    longitude: -0.1342,
    status: "open",
    openingHours: "Mon-Sun: 06:30-23:00"
  },
  {
    id: "pret-018",
    name: "Covent Garden",
    address: "32 Long Acre",
    city: "London",
    postcode: "WC2E 9LP",
    latitude: 51.5127,
    longitude: -0.1243,
    status: "open",
    openingHours: "Mon-Sat: 07:00-21:00, Sun: 08:00-20:00"
  },
  {
    id: "pret-019",
    name: "Bank",
    address: "1 Poultry",
    city: "London",
    postcode: "EC2R 8EJ",
    latitude: 51.5134,
    longitude: -0.0909,
    status: "open",
    openingHours: "Mon-Fri: 06:00-20:00"
  },
  {
    id: "pret-020",
    name: "Moorgate",
    address: "155 Moorgate",
    city: "London",
    postcode: "EC2M 6XB",
    latitude: 51.5186,
    longitude: -0.0886,
    status: "open",
    openingHours: "Mon-Fri: 06:30-20:00"
  },

  // Manchester locations
  {
    id: "pret-101",
    name: "Trafford Centre",
    address: "60 The Trafford Centre",
    city: "Manchester",
    postcode: "M17 8DA",
    latitude: 53.4667,
    longitude: -2.3481,
    status: "open",
    openingHours: "Mon-Sat: 09:00-20:30, Sun: 10:00-18:00"
  },
  {
    id: "pret-102",
    name: "Deansgate",
    address: "85 Deansgate",
    city: "Manchester",
    postcode: "M3 2BW",
    latitude: 53.4808,
    longitude: -2.2426,
    status: "open",
    openingHours: "Mon-Fri: 07:00-19:00, Sat-Sun: 08:00-18:00"
  },
  {
    id: "pret-103",
    name: "Piccadilly Gardens",
    address: "15 Piccadilly",
    city: "Manchester",
    postcode: "M1 1LY",
    latitude: 53.4808,
    longitude: -2.2374,
    status: "open",
    openingHours: "Mon-Fri: 06:30-20:00, Sat-Sun: 07:30-19:00"
  },
  {
    id: "pret-104",
    name: "Manchester Piccadilly",
    address: "Manchester Piccadilly Station",
    city: "Manchester",
    postcode: "M1 2PB",
    latitude: 53.4772,
    longitude: -2.2309,
    status: "open",
    openingHours: "Mon-Sun: 06:00-22:00"
  },

  // Birmingham locations
  {
    id: "pret-201",
    name: "Birmingham New Street",
    address: "New Street Station",
    city: "Birmingham",
    postcode: "B2 4QA",
    latitude: 52.4774,
    longitude: -1.8988,
    status: "open",
    openingHours: "Mon-Sat: 06:00-22:00, Sun: 07:00-21:00"
  },
  {
    id: "pret-202",
    name: "Bull Street",
    address: "45 Bull Street",
    city: "Birmingham",
    postcode: "B4 6AF",
    latitude: 52.4811,
    longitude: -1.8986,
    status: "open",
    openingHours: "Mon-Fri: 07:30-18:00, Sat: 08:00-17:00"
  },
  {
    id: "pret-203",
    name: "Colmore Row",
    address: "55 Colmore Row",
    city: "Birmingham",
    postcode: "B3 2AA",
    latitude: 52.4820,
    longitude: -1.9007,
    status: "open",
    openingHours: "Mon-Fri: 07:00-18:00"
  },

  // Edinburgh locations
  {
    id: "pret-301",
    name: "Lothian Road",
    address: "116 Lothian Road",
    city: "Edinburgh",
    postcode: "EH3 9BE",
    latitude: 55.9445,
    longitude: -3.2041,
    status: "open",
    openingHours: "Mon-Fri: 07:00-19:00, Sat-Sun: 08:00-18:00"
  },
  {
    id: "pret-302",
    name: "Edinburgh Airport",
    address: "Edinburgh Airport",
    city: "Edinburgh",
    postcode: "EH12 9DN",
    latitude: 55.9500,
    longitude: -3.3725,
    status: "open",
    openingHours: "Mon-Sun: 04:00-22:00"
  },
  {
    id: "pret-303",
    name: "Princes Street",
    address: "85 Princes Street",
    city: "Edinburgh",
    postcode: "EH2 2ER",
    latitude: 55.9533,
    longitude: -3.1975,
    status: "open",
    openingHours: "Mon-Sat: 07:00-20:00, Sun: 08:00-19:00"
  },
  {
    id: "pret-304",
    name: "Waverley Station",
    address: "Waverley Bridge",
    city: "Edinburgh",
    postcode: "EH1 1BQ",
    latitude: 55.9521,
    longitude: -3.1906,
    status: "open",
    openingHours: "Mon-Sun: 06:00-21:00"
  },

  // Bristol locations
  {
    id: "pret-401",
    name: "Park Street",
    address: "12 Park Street",
    city: "Bristol",
    postcode: "BS1 5HH",
    latitude: 51.4545,
    longitude: -2.6010,
    status: "open",
    openingHours: "Mon-Fri: 07:00-19:00, Sat-Sun: 08:00-18:00"
  },
  {
    id: "pret-402",
    name: "Broadmead",
    address: "50 Broadmead",
    city: "Bristol",
    postcode: "BS1 3DS",
    latitude: 51.4585,
    longitude: -2.5874,
    status: "open",
    openingHours: "Mon-Sat: 07:30-19:00, Sun: 09:00-18:00"
  },

  // Glasgow locations
  {
    id: "pret-501",
    name: "Buchanan Street",
    address: "95 Buchanan Street",
    city: "Glasgow",
    postcode: "G1 3HF",
    latitude: 55.8606,
    longitude: -4.2527,
    status: "open",
    openingHours: "Mon-Sat: 07:00-20:00, Sun: 08:00-19:00"
  },
  {
    id: "pret-502",
    name: "Central Station",
    address: "Glasgow Central Station",
    city: "Glasgow",
    postcode: "G1 3SL",
    latitude: 55.8585,
    longitude: -4.2573,
    status: "open",
    openingHours: "Mon-Sun: 06:00-22:00"
  },

  // Leeds locations
  {
    id: "pret-601",
    name: "Leeds Station",
    address: "Leeds Railway Station",
    city: "Leeds",
    postcode: "LS1 4DY",
    latitude: 53.7955,
    longitude: -1.5481,
    status: "open",
    openingHours: "Mon-Fri: 06:00-21:00, Sat-Sun: 07:00-20:00"
  },
  {
    id: "pret-602",
    name: "Albion Street",
    address: "28 Albion Street",
    city: "Leeds",
    postcode: "LS1 6AG",
    latitude: 53.7987,
    longitude: -1.5425,
    status: "open",
    openingHours: "Mon-Fri: 07:00-19:00, Sat: 08:00-18:00"
  },

  // Liverpool locations
  {
    id: "pret-701",
    name: "Liverpool ONE",
    address: "18 Paradise Street",
    city: "Liverpool",
    postcode: "L1 3EU",
    latitude: 53.4042,
    longitude: -2.9882,
    status: "open",
    openingHours: "Mon-Sat: 07:30-20:00, Sun: 09:00-18:00"
  },
  {
    id: "pret-702",
    name: "Lime Street Station",
    address: "Lime Street Station",
    city: "Liverpool",
    postcode: "L1 1JD",
    latitude: 53.4074,
    longitude: -2.9773,
    status: "open",
    openingHours: "Mon-Sun: 06:00-22:00"
  },

  // Newcastle locations
  {
    id: "pret-801",
    name: "Grey Street",
    address: "89 Grey Street",
    city: "Newcastle",
    postcode: "NE1 6EG",
    latitude: 54.9716,
    longitude: -1.6112,
    status: "open",
    openingHours: "Mon-Fri: 07:00-19:00, Sat-Sun: 08:00-18:00"
  },
  {
    id: "pret-802",
    name: "Central Station",
    address: "Newcastle Central Station",
    city: "Newcastle",
    postcode: "NE1 5DL",
    latitude: 54.9683,
    longitude: -1.6174,
    status: "open",
    openingHours: "Mon-Sun: 06:00-21:00"
  },
];
