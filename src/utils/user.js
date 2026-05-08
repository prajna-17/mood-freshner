import { API } from "@/utils/api";

export async function saveAddress(addressData, token) {
	const res = await fetch(`${API}/users/address`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(addressData),
	});

	if (!res.ok) {
		throw new Error("Failed to save address");
	}

	return res.json();
}
