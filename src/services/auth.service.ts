export async function loginService(email: string, password: string) {
  const res = await fetch("https://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}
