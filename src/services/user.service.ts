import apiPolines from "./apiPolines";
export async function getProfile() {
  try {
    const res = await apiPolines.get("mahasiswa", {
      headers: {
        // Ambil token terbaru dari localStorage
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Berdasarkan JSON kamu: res.data adalah body, res.data.data adalah isinya
    // Kita return res.data.data agar mendapatkan object { user: { id, email, ... } }
    return res.data.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}
