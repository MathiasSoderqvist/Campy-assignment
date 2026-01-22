// Types for subscriptions
type SubscriptionPlan = "MONTHLY" | "YEARLY" | "LIFETIME";
type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "NONE";

interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  transactionId: string;
}

interface User {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  isCampyPlus: boolean;
  subscription: Subscription | null;
}

// Mock user database (in-memory for demo)
const users: Map<string, User> = new Map();

// Helper to calculate subscription end date
function calculateEndDate(plan: SubscriptionPlan, startDate: Date): string | null {
  if (plan === "LIFETIME") return null;

  const endDate = new Date(startDate);
  if (plan === "MONTHLY") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan === "YEARLY") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  return endDate.toISOString();
}

// Helper to check if subscription is active
function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== "ACTIVE") return false;
  if (subscription.plan === "LIFETIME") return true;
  if (subscription.endDate && new Date(subscription.endDate) < new Date()) return false;
  return true;
}

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

// Initialize mock user
const mockUser: User = {
  uid: "user-123",
  email: "test@campy.app",
  password: "campy",
  displayName: "Test User",
  isCampyPlus: false,
  subscription: null,
};

// Add mock user to database
users.set(mockUser.uid, mockUser);

// Simulated current user (would normally come from JWT token)
let currentUserId: string | null = null;

// Helper to get user response object (without password)
function getUserResponse(user: User) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    isCampyPlus: isSubscriptionActive(user.subscription),
    subscription: user.subscription,
  };
}

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
    me: () => {
      if (!currentUserId) {
        throw new Error("Not authenticated");
      }
      const user = users.get(currentUserId);
      if (!user) {
        throw new Error("User not found");
      }
      return getUserResponse(user);
    },
  },
  Mutation: {
    login: (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      if (email === mockUser.email && password === mockUser.password) {
        // Set current user for session
        currentUserId = mockUser.uid;
        const user = users.get(mockUser.uid)!;
        return {
          token: "mock-jwt-token-" + Date.now(),
          user: getUserResponse(user),
        };
      }
      throw new Error("Invalid email or password");
    },

    purchaseSubscription: (
      _: unknown,
      { plan, receipt }: { plan: SubscriptionPlan; receipt: string }
    ) => {
      if (!currentUserId) {
        throw new Error("Not authenticated");
      }

      const user = users.get(currentUserId);
      if (!user) {
        throw new Error("User not found");
      }

      // Validate receipt (mock validation - in production, verify with App Store/Play Store)
      if (!receipt || receipt.length < 10) {
        return {
          success: false,
          user: getUserResponse(user),
          message: "Invalid purchase receipt",
        };
      }

      // Create subscription
      const startDate = new Date();
      const subscription: Subscription = {
        plan,
        status: "ACTIVE",
        startDate: startDate.toISOString(),
        endDate: calculateEndDate(plan, startDate),
        autoRenew: plan !== "LIFETIME",
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Update user
      user.subscription = subscription;
      user.isCampyPlus = true;
      users.set(currentUserId, user);

      return {
        success: true,
        user: getUserResponse(user),
        message: `Successfully subscribed to Campy Plus (${plan.toLowerCase()})`,
      };
    },

    cancelSubscription: () => {
      if (!currentUserId) {
        throw new Error("Not authenticated");
      }

      const user = users.get(currentUserId);
      if (!user) {
        throw new Error("User not found");
      }

      if (!user.subscription || user.subscription.status !== "ACTIVE") {
        return {
          success: false,
          user: getUserResponse(user),
          message: "No active subscription to cancel",
        };
      }

      // Cancel subscription (keeps active until end date for non-lifetime)
      user.subscription.status = "CANCELLED";
      user.subscription.autoRenew = false;

      // For lifetime, immediately revoke
      if (user.subscription.plan === "LIFETIME") {
        user.subscription.status = "EXPIRED";
        user.isCampyPlus = false;
      }

      users.set(currentUserId, user);

      return {
        success: true,
        user: getUserResponse(user),
        message: user.subscription.plan === "LIFETIME"
          ? "Lifetime subscription has been cancelled"
          : "Subscription cancelled. Access continues until the end of the billing period.",
      };
    },

    restorePurchases: (
      _: unknown,
      { receipt }: { receipt: string }
    ) => {
      if (!currentUserId) {
        throw new Error("Not authenticated");
      }

      const user = users.get(currentUserId);
      if (!user) {
        throw new Error("User not found");
      }

      // Mock restore logic - in production, verify receipt with App Store/Play Store
      // and restore any valid purchases
      if (!receipt || receipt.length < 10) {
        return {
          success: false,
          user: getUserResponse(user),
          message: "Invalid receipt for restoration",
        };
      }

      // For demo: if user had a cancelled subscription, restore it
      if (user.subscription && user.subscription.status === "CANCELLED") {
        user.subscription.status = "ACTIVE";
        user.subscription.autoRenew = user.subscription.plan !== "LIFETIME";
        user.isCampyPlus = true;
        users.set(currentUserId, user);

        return {
          success: true,
          user: getUserResponse(user),
          message: "Previous subscription restored successfully",
        };
      }

      return {
        success: false,
        user: getUserResponse(user),
        message: "No previous purchases found to restore",
      };
    },
  },
};
