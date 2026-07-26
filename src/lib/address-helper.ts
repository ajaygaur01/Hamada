export type ParsedAddress = {
  address_line1: string;
  address_line2?: string | null;
  landmark?: string | null;
  delivery_city: string;
  delivery_state: string;
  pincode: string;
  country: string;
};

/**
 * Extracts the full shipping address for a sample order.
 * If the structured fields (address_line1, etc.) exist, it returns them.
 * Otherwise, it attempts to parse them from the concatenated notes string.
 */
export function getSampleOrderShippingAddress(order: {
  address_line1?: string | null;
  address_line2?: string | null;
  landmark?: string | null;
  delivery_city: string;
  delivery_state?: string | null;
  pincode: string;
  country?: string | null;
  notes?: string | null;
}): ParsedAddress {
  if (order.address_line1) {
    return {
      address_line1: order.address_line1,
      address_line2: order.address_line2,
      landmark: order.landmark,
      delivery_city: order.delivery_city,
      delivery_state: order.delivery_state || "",
      pincode: order.pincode,
      country: order.country || "India",
    };
  }

  // Fallback to parsing from notes
  const notes = order.notes || "";
  const address: ParsedAddress = {
    address_line1: "",
    address_line2: null,
    landmark: null,
    delivery_city: order.delivery_city,
    delivery_state: "",
    pincode: order.pincode,
    country: "India",
  };

  if (notes.includes("Address Line 1:")) {
    const parts = notes.split(" | ");
    for (const part of parts) {
      const colonIndex = part.indexOf(":");
      if (colonIndex === -1) continue;
      const key = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();
      
      if (key === "Address Line 1") address.address_line1 = value;
      else if (key === "Address Line 2") address.address_line2 = value;
      else if (key === "Landmark") address.landmark = value;
      else if (key === "City") address.delivery_city = value;
      else if (key === "State") address.delivery_state = value;
      else if (key === "Country") address.country = value;
      else if (key === "Pincode") address.pincode = value;
    }
  }

  // If address_line1 is still empty (e.g. truly old orders without any notes or other formats),
  // we fallback to at least showing the city as address_line1, or just keep it empty.
  if (!address.address_line1) {
    address.address_line1 = order.delivery_city;
  }

  return address;
}

/**
 * Extracts only the user/admin notes from the stored notes field,
 * excluding the concatenated address details for older format orders.
 */
export function parseInternalNotes(notes: string | null): string {
  if (!notes) return "";
  if (!notes.includes("Address Line 1:")) return notes;

  const parts = notes.split(" | ");
  const customerNotePart = parts.find((p) => p.startsWith("Customer Note:"));
  if (customerNotePart) {
    return customerNotePart.replace("Customer Note:", "").trim();
  }
  return "";
}
