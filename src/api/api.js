import credentials from "../credentials.json";

export async function addEntity(entity) {
  const request = await fetch(credentials.database, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entity),
  });

  if (!request.ok) {
    throw new Error("Error submitting data");
  }

  return await request.json();
}
