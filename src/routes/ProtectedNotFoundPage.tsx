import { useNavigate } from "react-router-dom";

export const ProtectedNotFoundPage = () => {
  const navigate = useNavigate();

  //   TODO: refactor

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1 style={{ fontSize: "70px", margin: 0 }}>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <p>Halaman ini tidak tersedia di sistem.</p>

      <button
        onClick={() => navigate("/dashboard", { replace: true })}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Kembali ke Dashboard
      </button>
    </div>
  );
};
