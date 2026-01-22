const mockLocations = [
  {
    uid: "1",
    title: "Vondelpark Camping",
    address: "Vondelpark, Amsterdam",
    latitude: 52.3579,
    longitude: 4.8686,
    description: "Beautiful camping spot in the heart of Amsterdam's famous park",
    imageUrl: "https://example.com/vondelpark.jpg",
    rating: 4.5,
    reviewCount: 128,
  },
  {
    uid: "2",
    title: "Amsterdam Forest Camp",
    address: "Amsterdamse Bos, Amstelveen",
    latitude: 52.3089,
    longitude: 4.8367,
    description: "Peaceful forest camping experience just outside the city",
    imageUrl: "https://example.com/amsterdamse-bos.jpg",
    rating: 4.7,
    reviewCount: 256,
  },
  {
    uid: "3",
    title: "Waterland Campsite",
    address: "Waterland, Noord-Holland",
    latitude: 52.4321,
    longitude: 4.9876,
    description: "Rural camping with stunning views of Dutch waterways",
    imageUrl: "https://example.com/waterland.jpg",
    rating: 4.3,
    reviewCount: 89,
  },
  {
    uid: "4",
    title: "IJburg Beach Camp",
    address: "IJburg, Amsterdam",
    latitude: 52.3545,
    longitude: 5.0123,
    description: "Urban beach camping on Amsterdam's artificial islands",
    imageUrl: "https://example.com/ijburg.jpg",
    rating: 4.1,
    reviewCount: 67,
  },
  {
    uid: "5",
    title: "Haarlem Woods Retreat",
    address: "Haarlemmermeerpolder, Noord-Holland",
    latitude: 52.3456,
    longitude: 4.7234,
    description: "Quiet woodland camping near historic Haarlem",
    imageUrl: "https://example.com/haarlem.jpg",
    rating: 4.6,
    reviewCount: 143,
  },
  {
    uid: "6",
    title: "Zaanse Schans Camp",
    address: "Zaandam, Noord-Holland",
    latitude: 52.4731,
    longitude: 4.8189,
    description: "Camp near the famous Dutch windmills",
    imageUrl: "https://example.com/zaanse-schans.jpg",
    rating: 4.8,
    reviewCount: 312,
  },
  {
    uid: "7",
    title: "Muiden Castle Grounds",
    address: "Muiden, Noord-Holland",
    latitude: 52.3342,
    longitude: 5.0678,
    description: "Historic camping near the medieval Muiderslot castle",
    imageUrl: "https://example.com/muiden.jpg",
    rating: 4.4,
    reviewCount: 98,
  },
  {
    uid: "8",
    title: "Aalsmeer Lake Camp",
    address: "Aalsmeer, Noord-Holland",
    latitude: 52.2654,
    longitude: 4.7612,
    description: "Lakeside camping in the flower capital of the world",
    imageUrl: "https://example.com/aalsmeer.jpg",
    rating: 4.2,
    reviewCount: 76,
  },
];

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Mock user for authentication
const mockUser = {
  uid: "user-123",
  email: "test@campy.app",
  password: "campy",
  displayName: "Test User",
};

export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    locationsNearby: (
      _: unknown,
      {
        latitude,
        longitude,
        radiusKm = 50,
      }: { latitude: number; longitude: number; radiusKm?: number }
    ) => {
      return mockLocations.filter((location) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude
        );
        return distance <= radiusKm;
      });
    },
  },
  Mutation: {
    login: (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      if (email === mockUser.email && password === mockUser.password) {
        return {
          token: "mock-jwt-token-" + Date.now(),
          user: {
            uid: mockUser.uid,
            email: mockUser.email,
            displayName: mockUser.displayName,
          },
        };
      }
      throw new Error("Invalid email or password");
    },
  },
};
