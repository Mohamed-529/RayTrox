import sys
import os
import json
import uuid
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.grid_pulse import app, MOCK_TIMESTREAM_DATA_STORE

client = TestClient(app)

@pytest.fixture(autouse=True)
def purge_in_memory_registers():
    """Programmatically flushes backend time-series registers between testing iterations."""
    MOCK_TIMESTREAM_DATA_STORE.clear()

def test_infrastructure_liveness_route():
    """Asserts that runtime infrastructure validation checks respond cleanly with active streams & actuators."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "SATELLITE_AOD" in data["streams"]
    assert "5V_RELAY_SUBMERSIBLE_PUMP" in data["actuators"]

def test_nominal_solar_yield_processing():
    """Asserts that arrays running under clear sunshine are logged without triggering actuators."""
    nominal_payload = {
        "device_id": "NODE-OKHLA-01",
        "neighborhood_id": "ZONE-07",
        "actual_output_kw": 5.6,
        "irradiance_w_m2": 850.0,
        "panel_area_m2": 8.0,
        "voltage_v": 232.0,
        "current_a": 24.1,
        "module_temp_c": 28.0
    }
    response = client.post("/api/v1/grid/telemetry", json=nominal_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "PROCESSED"
    assert data["consensus_action_verdict"] == "HOLD_ACTION"
    assert data["automation_trigger_wash_relay"] is False
    assert data["relay_pin_state"] == "GPIO_LOW_STANDBY"

def test_real_time_5v_relay_actuation_on_widespread_smog():
    """EDGE CASE 2: Asserts widespread smog trips 5V relay pin ('GPIO_HIGH_5V_TRIPPED') to power water pump."""
    for idx in range(3):
        MOCK_TIMESTREAM_DATA_STORE.append({
            "record_id": f"mock-id-smog-{idx}",
            "device_id": f"NODE-OKHLA-0{idx+2}",
            "neighborhood_id": "ZONE-07",
            "efficiency_loss_pct": 78.50,
            "actual_output_kw": 1.2,
            "irradiance_w_m2": 850.0,
            "panel_area_m2": 8.0
        })

    smog_layer_payload = {
        "device_id": "NODE-OKHLA-01",
        "neighborhood_id": "ZONE-07",
        "actual_output_kw": 1.2,
        "irradiance_w_m2": 850.0,
        "panel_area_m2": 8.0,
        "voltage_v": 160.0,
        "current_a": 7.5,
        "module_temp_c": 32.0
    }
    
    response = client.post("/api/v1/grid/telemetry", json=smog_layer_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["consensus_action_verdict"] == "AUTHORIZE_SPRINKLER_WASH"
    # Hardware Relay Actuation Verification
    assert data["automation_trigger_wash_relay"] is True
    assert data["relay_pin_state"] == "GPIO_HIGH_5V_TRIPPED"
    # JEV Decision Model Optimization Assertion
    assert "jev_decision_model" in data
    assert data["jev_decision_model"]["optimal_action_selected"] == "A_wash_sprinkler"
    assert data["jev_decision_model"]["max_net_expected_value_inr"] > 0

def test_emergency_voice_dispatch_engine_on_hardware_fault():
    """EDGE CASE 3: Asserts isolated hardware fault initiates outbound voice dispatch worker & exact bot token."""
    for idx in range(3):
        MOCK_TIMESTREAM_DATA_STORE.append({
            "record_id": str(uuid.uuid4()),
            "device_id": f"NODE-OKHLA-0{idx+2}",
            "neighborhood_id": "ZONE-07",
            "efficiency_loss_pct": 5.40,
            "actual_output_kw": 5.4,
            "irradiance_w_m2": 850.0,
            "panel_area_m2": 8.0
        })

    faulty_inverter_payload = {
        "device_id": "NODE-OKHLA-01",
        "neighborhood_id": "ZONE-07",
        "actual_output_kw": 1.1,
        "irradiance_w_m2": 850.0,
        "panel_area_m2": 8.0,
        "voltage_v": 110.0,
        "current_a": 10.0,
        "module_temp_c": 30.0
    }
    
    response = client.post("/api/v1/grid/telemetry", json=faulty_inverter_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["consensus_action_verdict"] == "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE"
    assert data["automation_trigger_wash_relay"] is False
    assert data["relay_pin_state"] == "GPIO_LOW_STANDBY"
    
    # Twilio / SNS Emergency Voice Pipeline Verification
    voice_pipe = data["voice_dispatch_pipeline"]
    assert voice_pipe is not None
    assert voice_pipe["status"] == "INITIATED"
    assert voice_pipe["priority_tier"] == "P1_CRITICAL"
    assert voice_pipe["voice_bot_token_payload"] == "CRITICAL COMPONENT BREAKDOWN PINPOINTED AT SECTOR 04 / INVERTER-01. PLEASE DEPLOY EMERGENCY TECHNICIAN IMMEDIATELY."

def test_cold_start_isolated_node_satellite_fallback():
    """EDGE CASE 1: Asserts that zero neighbors in 1.0 km radius triggers Satellite AOD / Visibility fallback."""
    # Ensure database has ZERO records for this neighborhood (isolated rural / industrial outpost)
    assert len(MOCK_TIMESTREAM_DATA_STORE) == 0

    isolated_node_smog_payload = {
        "device_id": "ISOLATED-DESERT-NODE-01",
        "neighborhood_id": "ZONE-REMOTE-99",
        "actual_output_kw": 1.1,
        "irradiance_w_m2": 850.0,
        "panel_area_m2": 8.0,
        "satellite_aod": 0.85, # Heavy regional aerosol dust confirmed by satellite
        "satellite_visibility_km": 2.8
    }

    response = client.post("/api/v1/grid/telemetry", json=isolated_node_smog_payload)
    assert response.status_code == 201
    data = response.json()
    # Pierced topology hole: Verified via satellite fallback rather than blind guesswork
    assert data["satellite_fallback"]["active"] is True
    assert data["satellite_fallback"]["confidence_pct"] >= 90.0
    assert data["consensus_action_verdict"] == "AUTHORIZE_SPRINKLER_WASH"
    assert data["automation_trigger_wash_relay"] is True

def test_solid_surface_obstruction_hotspot_resolution():
    """EDGE CASE 4: Asserts persistent drop post-wash flags SURFACE_OBSTRUCTION_DETECTED and prevents pump loop."""
    bird_poop_payload = {
        "device_id": "NODE-OKHLA-03",
        "neighborhood_id": "ZONE-07",
        "actual_output_kw": 1.3,
        "irradiance_w_m2": 850.0,
        "panel_area_m2": 8.0,
        "consecutive_post_wash_loss": True # Panel was already washed but degradation persists!
    }

    response = client.post("/api/v1/grid/telemetry", json=bird_poop_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["consensus_action_verdict"] == "SURFACE_OBSTRUCTION_DETECTED"
    assert data["anomaly_mode"] == "SOLID_SURFACE_OBSTRUCTION_HOTSPOT"
    assert data["surface_obstruction_warning"] is True
    # Crucial safety check: Water pump relay must NOT run repeatedly for stuck bird poop
    assert data["automation_trigger_wash_relay"] is False
    assert data["relay_pin_state"] == "GPIO_LOW_STANDBY"

def test_peak_summer_thermal_degradation_gradient():
    """EDGE CASE 5: Asserts temperature decay math executes correctly and classifies ENGAGE_COOLING_BYPASS."""
    thermal_payload = {
        "device_id": "NODE-OKHLA-04",
        "neighborhood_id": "ZONE-07",
        "actual_output_kw": 3.4,
        "irradiance_w_m2": 950.0,
        "panel_area_m2": 8.0,
        "voltage_v": 178.0,
        "current_a": 22.0,
        "module_temp_c": 56.0,
        "temperature_coefficient": -0.38
    }

    response = client.post("/api/v1/grid/telemetry", json=thermal_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["consensus_action_verdict"] == "ENGAGE_COOLING_BYPASS"
    assert data["anomaly_mode"] == "THERMAL_ISLAND_LOSS"
    assert data["automation_trigger_wash_relay"] is False
    
    # Verify exact thermal degradation decay math
    thermal_analytics = data["thermal_gradient_analytics"]
    assert thermal_analytics is not None
    assert thermal_analytics["delta_temp_c"] == 31.0 # 56°C - 25°C STC
    assert thermal_analytics["calculated_thermal_decay_pct"] == 11.78 # 31 * 0.38%
