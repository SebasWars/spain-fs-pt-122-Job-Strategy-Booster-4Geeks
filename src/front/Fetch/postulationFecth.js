export async function createNewPostulation(formData, token) {
  const response = await fetch(
    "https://orange-train-g45vq67vgj6w29g5v-3001.app.github.dev/api/postulations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
}
