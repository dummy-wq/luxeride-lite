export const cars = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  model: "2024",
  image: "",
  mileage: `${10 + (i % 5)} units`,
  seats: 5,
  price: 100 + (i * 50),
  pricePerHour: 100 + (i * 50),
  fuel: i % 3 === 0 ? "Electric" : "Standard",
  category: i % 2 === 0 ? "Category A" : "Category B",
  transmission: "Automatic",
}));

export const carsDatabase = cars.reduce((acc, car) => {
  acc[car.id.toString()] = {
    ...car,
    id: car.id.toString(),
    engine: "Standard Spec",
    power: "N/A",
    torque: "N/A",
    acceleration: "N/A",
    topSpeed: "N/A",
    features: [
      "Luxury Upholstery",
      "Advanced Infotainment",
      "Safety Package"
    ],
    insurance: "Comprehensive Coverage Included",
    cancellation: "Free Cancellation up to 24 hours",
  };
  return acc;
}, {} as Record<string, any>);
