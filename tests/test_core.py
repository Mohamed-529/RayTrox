import pytest
import json
from app.core_engine import EcoArbitrageEngine, lambda_handler

@pytest.fixture
def engine_instance():
    return EcoArbitrageEngine(variance_tolerance=12.0, baseline_efficiency=0.85)

def test_nominal_solar_operation(engine_instance):
    """Verifies that clean panels operating under bright sunshine are logged without triggering alerts."""
    loss = engine_instance.calculate_efficiency_loss(actual_kw=5.5, irradiance_w_m2=850.0, panel_area_m2=8.0)
    assert loss < 10.0
    
    mock_cluster = [{"id": "INVERTER-01", "loss_pct": loss}, {"id": "INVERTER-02", "loss_pct": 4.5}]
    verdict = engine_instance.evaluate_spatial_consensus("INVERTER-01", loss, mock_cluster)
    assert verdict["verdict"] == "HOLD_ACTION"
    print("\n✨ [TEST PASS] Nominal solar production cycles validated successfully.")

def test_hardware_fault_interception(engine_instance):
    """Verifies that isolated array failures are isolated to prevent water waste."""
    # Target inverter reports low power, but surrounding arrays are running optimally
    fault_loss = 34.2 
    mock_healthy_cluster = [
        {"id": "INVERTER-OKHLA-01", "loss_pct": fault_loss},
        {"id": "INVERTER-OKHLA-02", "loss_pct": 5.1},
        {"id": "INVERTER-OKHLA-03", "loss_pct": 4.8}
    ]
    
    verdict = engine_instance.evaluate_spatial_consensus("INVERTER-OKHLA-01", fault_loss, mock_healthy_cluster)
    assert verdict["verdict"] == "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE"
    assert "Hardware fault suspected" in verdict["reason"]
    print("✨ [TEST PASS] Hardware inverter fault successfully isolated from environmental smog inputs.")

def test_lambda_ingress_api_routing():
    """Verifies the HTTP production gateway maps and converts JSON inputs accurately."""
    mock_payload = {
        "body": json.dumps({
            "device_id": "INVERTER-OKHLA-01",
            "actual_kw": 3.8,
            "irradiance_w_m2": 850.0,
            "panel_area_m2": 8.0
        })
    }
    response = lambda_handler(mock_payload, None)
    assert response["statusCode"] == 200
    data = json.loads(response["body"])
    assert data["status"] == "PROCESSED"
    print("✨ [TEST PASS] AWS Lambda Ingress API controller execution loop completed smoothly.")
