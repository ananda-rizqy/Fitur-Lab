import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  //   TODO:refactor code shadcn tailwind
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "80px", margin: 0 }}>404</h1>
      <h2>Halaman Tidak Ditemukan</h2>
      <p>URL yang kamu akses tidak tersedia.</p>

      <button
        onClick={() => navigate("/", { replace: true })}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Kembali ke Home
      </button>
    </div>
  );
};
