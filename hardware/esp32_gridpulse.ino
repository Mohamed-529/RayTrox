/*
 * GridPulse ESP32 / Arduino Live Hardware Telemetry Streamer
 * Reads real-time Voltage (V), Current (mA), and Power (mW) from INA219
 * and streams HTTP POST packets to the GridPulse backend / AWS IoT Core.
 *
 * Hardware Required:
 * 1. 12V / 5W Solar Panel
 * 2. ESP32 NodeMCU (or Arduino Uno)
 * 3. INA219 I2C Current/Voltage Sensor Module
 * 4. 100-ohm / 10W load resistor or 12V DC bulb
 */

#include <Wire.h>
#include <Adafruit_INA219.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Wi-Fi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// GridPulse Server Endpoint (Local IP or Cloud API Gateway)
// Example local: "http://192.168.1.50:8000/api/v1/grid/telemetry"
const char* serverEndpoint = "http://YOUR_LAPTOP_IP:8000/api/v1/grid/telemetry";

Adafruit_INA219 ina219;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("==========================================");
  Serial.println("   GridPulse Hardware Telemetry Node 01   ");
  Serial.println("==========================================");

  // Initialize INA219 I2C sensor (Default address: 0x40)
  if (!ina219.begin()) {
    Serial.println("[-] Failed to find INA219 chip. Check wiring!");
    while (1) { delay(10); }
  }
  Serial.println("[+] INA219 sensor initialized successfully.");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("[*] Connecting to Wi-Fi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[+] Wi-Fi Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[!] Wi-Fi connection timed out. Falling back to USB Serial mode.");
  }
}

void loop() {
  // 1. Read real electrical telemetry from INA219
  float busVoltage_V = ina219.getBusVoltage_V();
  float current_mA = ina219.getCurrent_mA();
  float power_mW = ina219.getPower_mW();

  // Protect against negative drift noise
  if (current_mA < 0) current_mA = 0.0;
  if (power_mW < 0) power_mW = 0.0;

  // Convert to Watts (W) and scaled kW for digital twin math
  float wattage_W = power_mW / 1000.0;
  // Scaled for municipal grid demo (1W lab panel scaled to 1kW representation)
  float simulated_kW = wattage_W * 1.1; 

  // Estimate light irradiance from voltage (or default to 850 W/m² under lamp)
  float estimated_irradiance = map(constrain(busVoltage_V, 0.0, 18.0) * 100, 0, 1800, 100, 1000);

  // 2. Output structured JSON to USB Serial (Works offline without Wi-Fi!)
  StaticJsonDocument<256> doc;
  doc["device_id"] = "PHYSICAL-PANEL-01";
  doc["neighborhood_id"] = "ZONE-07";
  doc["actual_output_kw"] = serialized(String(simulated_kW, 2));
  doc["voltage_v"] = serialized(String(busVoltage_V, 1));
  doc["current_a"] = serialized(String(current_mA / 100.0, 2));
  doc["irradiance_w_m2"] = serialized(String(estimated_irradiance, 0));
  doc["module_temp_c"] = 28.5;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // Print to Serial Monitor for USB bridge
  Serial.println(jsonPayload);

  // 3. If Wi-Fi is active, send direct HTTP POST to GridPulse backend
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("[HTTP ");
      Serial.print(httpResponseCode);
      Serial.print("] Verdict: ");
      Serial.println(response);
    }
    http.end();
  }

  // Stream every 1.5 seconds for instant reactive feedback
  delay(1500);
}
