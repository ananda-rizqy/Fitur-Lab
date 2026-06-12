import urllib.request
import json
import random
import time

URL = "http://10.97.233.94:8000/api/device/update-rssi"

def random_rssi():
    return random.randint(-100, -20)

while True:
    data = {
        "devices": [
            {
                "mac_devices": "ff:ff:12:98:49:63",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF:FF:12:98:49:63",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF2",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF3",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF4",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF5",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF6",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF7",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF8",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF9",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
             {
                "mac_devices": "FF10",
                "rssi1": random_rssi(),
                "rssi2": random_rssi(),
                "rssi3": random_rssi()
            },
        ]
    }

    json_data = json.dumps(data).encode("utf-8")

    req = urllib.request.Request(
        URL,
        data=json_data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
            print("Response:", response.read().decode())
    except Exception as e:
        print("Error:", e)

    time.sleep(2)
