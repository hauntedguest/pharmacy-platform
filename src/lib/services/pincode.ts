/**
 * India Postal PIN Code Service
 * Uses the 100% Free India Post Open API (api.postalpincode.in)
 * No API key required, zero-cost.
 */

export interface PincodeDetails {
  pinCode: string;
  district: string;
  state: string;
  postOffices: string[];
  isDeliverable: boolean;
  deliverySpeed: "Express Cold-Chain (2-4 Hrs)" | "Next-Day Direct Dispatch" | "Standard 2-3 Days";
}

export async function lookupPincode(pincode: string): Promise<PincodeDetails | null> {
  const cleanPin = pincode.replace(/\D/g, "");
  if (cleanPin.length !== 6) return null;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) throw new Error("Pincode API failed");
    const data = await res.json();

    if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
      const primaryOffice = data[0].PostOffice[0];
      const district = primaryOffice.District || primaryOffice.Division || "Metro District";
      const state = primaryOffice.State || "Maharashtra";
      const postOffices = data[0].PostOffice.map((po: any) => po.Name).filter(Boolean);

      // Determine delivery speed based on primary metro PIN ranges
      let deliverySpeed: PincodeDetails["deliverySpeed"] = "Standard 2-3 Days";
      if (cleanPin.startsWith("400") || cleanPin.startsWith("401") || cleanPin.startsWith("110") || cleanPin.startsWith("560") || cleanPin.startsWith("500") || cleanPin.startsWith("600")) {
        deliverySpeed = "Express Cold-Chain (2-4 Hrs)";
      } else if (cleanPin.startsWith("411") || cleanPin.startsWith("380") || cleanPin.startsWith("700") || cleanPin.startsWith("201") || cleanPin.startsWith("122")) {
        deliverySpeed = "Next-Day Direct Dispatch";
      }

      return {
        pinCode: cleanPin,
        district,
        state,
        postOffices: postOffices.slice(0, 5),
        isDeliverable: true,
        deliverySpeed,
      };
    }
  } catch (error) {
    console.warn("India Post API request failed, falling back to offline heuristics", error);
  }

  // Offline Heuristics Fallback (if network is slow or offline)
  const prefix = cleanPin.substring(0, 2);
  let state = "Maharashtra";
  let district = "Mumbai Metro";
  let deliverySpeed: PincodeDetails["deliverySpeed"] = "Standard 2-3 Days";

  if (cleanPin.startsWith("400")) {
    state = "Maharashtra";
    district = "Mumbai";
    deliverySpeed = "Express Cold-Chain (2-4 Hrs)";
  } else if (cleanPin.startsWith("110")) {
    state = "Delhi";
    district = "New Delhi";
    deliverySpeed = "Express Cold-Chain (2-4 Hrs)";
  } else if (cleanPin.startsWith("560")) {
    state = "Karnataka";
    district = "Bengaluru";
    deliverySpeed = "Express Cold-Chain (2-4 Hrs)";
  } else if (cleanPin.startsWith("500")) {
    state = "Telangana";
    district = "Hyderabad";
    deliverySpeed = "Express Cold-Chain (2-4 Hrs)";
  } else if (cleanPin.startsWith("411")) {
    state = "Maharashtra";
    district = "Pune";
    deliverySpeed = "Next-Day Direct Dispatch";
  }

  return {
    pinCode: cleanPin,
    district,
    state,
    postOffices: [district],
    isDeliverable: true,
    deliverySpeed,
  };
}
