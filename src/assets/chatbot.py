import matplotlib.pyplot as plt
import numpy as np

class TrilaterationService:
    # State untuk Kalman Filter agar tetap tersimpan selama runtime
    # Dalam Python, kita bisa menggunakan dictionary class-level
    _states = {}

    def rssi_to_distance(self, rssi, tx_power=-58, n=3.0):
        """
        Konversi RSSI ke Jarak (Meter)
        Logika sama dengan pow(10, (txPower - rssi) / (10 * n))
        """
        return 10**((tx_power - rssi) / (10 * n))

    def kalman_filter(self, beacon_id, measurement):
        """
        Kalman Filter untuk menstabilkan sinyal RSSI yang fluktuatif
        """
        if beacon_id not in self._states:
            self._states[beacon_id] = {'est': -60, 'err': 1}

        q = 0.01  # Process noise
        r = 0.1   # Measurement noise
        state = self._states[beacon_id]

        kalman_gain = state['err'] / (state['err'] + r)
        state['est'] = state['est'] + kalman_gain * (measurement - state['est'])
        state['err'] = (1 - kalman_gain) * state['err'] + abs(state['est'] - measurement) * q

        return state['est']

    def calculate(self, beacons):
        """
        Fungsi Utama: Menghitung koordinat X dan Y
        beacons: list of dict [{'id': 1, 'x': 0, 'y': 0, 'rssi': -65}, ...]
        """
        count = len(beacons)
        
        # Validasi minimal 3 beacon
        if count < 3:
            if count == 0: return None
            # Fallback sederhana (Rata-rata)
            return {
                'x': round(sum(b['x'] for b in beacons) / count, 2),
                'y': round(sum(b['y'] for b in beacons) / count, 2)
            }

        # 1. Pre-processing: Filter RSSI dan Konversi ke Jarak
        for b in beacons:
            b_id = b.get('mac_devices') or b.get('id') or 'default'
            filtered_rssi = self.kalman_filter(b_id, b['rssi'])
            b['distance'] = self.rssi_to_distance(filtered_rssi)

        # 2. Persiapan Matrix (Menggunakan 3 beacon pertama)
        p1, p2, p3 = beacons[0], beacons[1], beacons[2]

        # 3. Implementasi Cramer's Rule
        A = 2 * (p2['x'] - p1['x'])
        B = 2 * (p2['y'] - p1['y'])
        C = (p1['distance']**2) - (p2['distance']**2) - (p1['x']**2) + (p2['x']**2) - (p1['y']**2) + (p2['y']**2)

        D = 2 * (p3['x'] - p2['x'])
        E = 2 * (p3['y'] - p2['y'])
        F = (p2['distance']**2) - (p3['distance']**2) - (p2['x']**2) + (p3['x']**2) - (p2['y']**2) + (p3['y']**2)

        # Hitung Determinan
        det = (A * E) - (B * D)

        # Cek jika posisi beacon segaris (Determinan mendekati 0)
        if abs(det) < 0.0001:
            return {
                'x': round((p1['x'] + p2['x'] + p3['x']) / 3, 2),
                'y': round((p1['y'] + p2['y'] + p3['y']) / 3, 2)
            }

        # Hasil akhir koordinat (X, Y)
        x = (C * E - F * B) / det
        y = (A * F - D * C) / det

        return {'x': round(x, 2), 'y': round(y, 2)}

# --- Visualisasi dengan Matplotlib (1600 x 764) ---

# Data Contoh (Gunakan koordinat sesuai area Anda)
data_beacons = [
    {'id': 'A1', 'x': 200,  'y': 150, 'rssi': -62},
    {'id': 'A2', 'x': 1400, 'y': 150, 'rssi': -70},
    {'id': 'A3', 'x': 800,  'y': 600, 'rssi': -65}
]

service = TrilaterationService()
result = service.calculate(data_beacons)

# Plotting
plt.figure(figsize=(16, 7.64)) # Sesuai permintaan ukuran
plt.xlim(0, 1600)
plt.ylim(0, 764)

for b in data_beacons:
    # Gambar Anchor
    plt.plot(b['x'], b['y'], 'ks', markersize=10)
    plt.text(b['x'], b['y']-30, f"{b['id']}\nDist: {b['distance']:.2f}m", ha='center')
    
    # Gambar Lingkaran Jangkauan (Berdasarkan estimasi jarak)
    circle = plt.Circle((b['x'], b['y']), b['distance'] * 50, color='blue', fill=False, linestyle='--', alpha=0.3)
    plt.gca().add_patch(circle)

# Gambar Titik Target Hasil Kalkulasi
if result:
    plt.plot(result['x'], result['y'], 'ro', markersize=12, label="Estimated Target")
    plt.annotate(f"Target ({result['x']}, {result['y']})", (result['x'], result['y']), 
                 textcoords="offset points", xytext=(0,10), ha='center', color='red', fontweight='bold')

plt.title("BLE Trilateration dengan Kalman Filter (Mapping Logic PHP)")
plt.grid(True, linestyle=':', alpha=0.5)
plt.legend()
plt.show()