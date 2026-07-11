// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     Pusher: any;
//     Echo: any;
//   }
// }

// // 1. Assign Pusher ke window (WAJIB agar Echo tidak error)
// window.Pusher = Pusher;

// // 2. Ambil port & TLS dari env
// const isTLS = import.meta.env.VITE_REVERB_SCHEME === "https";

// const echo = new Echo({
//   broadcaster: "reverb",
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",
//   wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
//   wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,
//   forceTLS: isTLS,
//   enabledTransports: ["ws", "wss"],
// });

// export default echo;