import type { Location } from "@shared/schema";

// todo: remove mock functionality
// Mock data for Pret A Manger locations across UK
export const mockLocations: Location[] = [
  {
    id: "1",
    name: "Shelton Street",
    address: "37 Shelton Street",
    city: "London",
    postcode: "WC2H 9HN",
    latitude: 51.5144,
    longitude: -0.1225,
    status: "open",
    openingHours: "07:30 - 20:00",
    phone: "020 7836 7574"
  },
  {
    id: "2",
    name: "Warren Street",
    address: "14 Warren Street",
    city: "London",
    postcode: "W1T 5LL",
    latitude: 51.5246,
    longitude: -0.1374,
    status: "open",
    openingHours: "07:00 - 16:30"
  },
  {
    id: "3",
    name: "Tottenham Court Road",
    address: "67 Tottenham Court Road",
    city: "London",
    postcode: "W1T 2EY",
    latitude: 51.5188,
    longitude: -0.1313,
    status: "closed",
    openingHours: "Opens at 06:30 Mon"
  },
  {
    id: "4",
    name: "York Way",
    address: "York Way",
    city: "London",
    postcode: "N1C 9AP",
    latitude: 51.5354,
    longitude: -0.1235,
    status: "open",
    openingHours: "05:00 - 00:00"
  },
  {
    id: "5",
    name: "Lothian Road",
    address: "116 Lothian Road",
    city: "Edinburgh",
    postcode: "EH3 9BE",
    latitude: 55.9445,
    longitude: -3.2041,
    status: "open",
    openingHours: "08:30 - 16:00"
  },
  {
    id: "6",
    name: "Edgware Road",
    address: "26 Edgware Road",
    city: "London",
    postcode: "W2 2EH",
    latitude: 51.5150,
    longitude: -0.1635,
    status: "open",
    openingHours: "07:30 - 21:00"
  },
  {
    id: "7",
    name: "Strand",
    address: "217 Strand",
    city: "London",
    postcode: "WC2R 1AT",
    latitude: 51.5115,
    longitude: -0.1180,
    status: "open",
    openingHours: "07:00 - 19:00"
  },
  {
    id: "8",
    name: "King's Road",
    address: "35-37 King's Road",
    city: "London",
    postcode: "SW3 4NB",
    latitude: 51.4879,
    longitude: -0.1630,
    status: "open",
    openingHours: "06:30 - 20:00"
  },
  {
    id: "9",
    name: "Parkfield Street",
    address: "12 Parkfield Street",
    city: "London",
    postcode: "N1 0PS",
    latitude: 51.5427,
    longitude: -0.1004,
    status: "open",
    openingHours: "07:00 - 20:30"
  },
  {
    id: "10",
    name: "Edinburgh Airport",
    address: "Eastfield Avenue",
    city: "Edinburgh",
    postcode: "EH12 9DN",
    latitude: 55.9500,
    longitude: -3.3725,
    status: "open",
    openingHours: "04:00 - 22:00"
  },
  {
    id: "11",
    name: "Waterloo Station",
    address: "Unit GO1A Waterloo Station, Main Concourse",
    city: "London",
    postcode: "SE1 7NQ",
    latitude: 51.5036,
    longitude: -0.1143,
    status: "open",
    openingHours: "05:30 - 23:00"
  },
  {
    id: "12",
    name: "Paddington Station",
    address: "Paddington Subway Sta",
    city: "London",
    postcode: "W2 1HB",
    latitude: 51.5154,
    longitude: -0.1755,
    status: "open",
    openingHours: "05:00 - 22:00"
  },
  {
    id: "13",
    name: "St Thomas Street",
    address: "St Thomas St",
    city: "London",
    postcode: "SE1 9SP",
    latitude: 51.5040,
    longitude: -0.0857,
    status: "open",
    openingHours: "05:30 - 23:30"
  },
  {
    id: "14",
    name: "Stratford",
    address: "21 Station Street",
    city: "London",
    postcode: "E15 1DA",
    latitude: 51.5416,
    longitude: 0.0042,
    status: "open",
    openingHours: "05:00 - 22:00"
  },
  {
    id: "15",
    name: "Trafford Centre",
    address: "60 The Trafford Centre",
    city: "Manchester",
    postcode: "M17 8DA",
    latitude: 53.4667,
    longitude: -2.3481,
    status: "open",
    openingHours: "09:00 - 20:30"
  },
  {
    id: "16",
    name: "Deansgate",
    address: "85 Deansgate",
    city: "Manchester",
    postcode: "M3 2BW",
    latitude: 53.4808,
    longitude: -2.2426,
    status: "open",
    openingHours: "07:00 - 19:00"
  },
  {
    id: "17",
    name: "Birmingham New Street",
    address: "New Street Station",
    city: "Birmingham",
    postcode: "B2 4QA",
    latitude: 52.4774,
    longitude: -1.8988,
    status: "open",
    openingHours: "06:00 - 22:00"
  },
  {
    id: "18",
    name: "Bull Street",
    address: "45 Bull Street",
    city: "Birmingham",
    postcode: "B4 6AF",
    latitude: 52.4811,
    longitude: -1.8986,
    status: "open",
    openingHours: "07:30 - 18:00"
  },
  {
    id: "19",
    name: "Park Street",
    address: "12 Park Street",
    city: "Bristol",
    postcode: "BS1 5HH",
    latitude: 51.4545,
    longitude: -2.6010,
    status: "closing_soon",
    openingHours: "Closes at 19:00"
  },
  {
    id: "20",
    name: "Princes Street",
    address: "85 Princes Street",
    city: "Edinburgh",
    postcode: "EH2 2ER",
    latitude: 55.9533,
    longitude: -3.1975,
    status: "open",
    openingHours: "07:00 - 20:00"
  }
];
