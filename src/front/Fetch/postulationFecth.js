 const backendUrl = import.meta.env.VITE_BACKEND_URL
export async function createNewPostulation(formData, token) {
  const response = await fetch(`${backendUrl}/postulation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
}
