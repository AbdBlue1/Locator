import LocationCard from '../LocationCard';

export default function LocationCardExample() {
  return (
    <div className="w-96">
      <LocationCard
        location={{
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
        }}
        onClick={() => console.log('Location card clicked')}
      />
    </div>
  );
}
