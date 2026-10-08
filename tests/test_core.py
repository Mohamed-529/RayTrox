import unittest
import json
from app.core_engine import EcoArbitrageEngine, lambda_handler

class TestEcoArbitrageEngine(unittest.TestCase):
    """Zero-dependency unit tests running natively with standard Python library."""
    
    def setUp(self):
        self.engine = EcoArbitrageEngine(variance_tolerance=12.0, baseline_efficiency=0.85)

    def test_nominal_solar_operation(self):
        """Verifies clean panels operating under bright sunshine are logged without triggering alerts."""
        loss = self.engine.calculate_efficiency_loss(actual_kw=5.5, irradiance_w_m2=850.0, panel_area_m2=8.0)
        self.assertLess(loss, 10.0)
        
        mock_cluster = [{"id": "INVERTER-01", "loss_pct": loss}, {"id": "INVERTER-02", "loss_pct": 4.5}]
        verdict = self.engine.evaluate_spatial_consensus("INVERTER-01", loss, mock_cluster)
        self.assertEqual(verdict["verdict"], "HOLD_ACTION")

    def test_hardware_fault_interception(self):
        """Verifies isolated array failures are flagged as hardware faults to prevent water waste."""
        fault_loss = 34.2 
        mock_healthy_cluster = [
            {"id": "INVERTER-OKHLA-01", "loss_pct": fault_loss},
            {"id": "INVERTER-OKHLA-02", "loss_pct": 5.1},
            {"id": "INVERTER-OKHLA-03", "loss_pct": 4.8}
        ]
        
        verdict = self.engine.evaluate_spatial_consensus("INVERTER-OKHLA-01", fault_loss, mock_healthy_cluster)
        self.assertEqual(verdict["verdict"], "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE")
        self.assertIn("Hardware fault suspected", verdict["reason"])

    def test_lambda_ingress_api_routing(self):
        """Verifies HTTP serverless gateway maps and converts JSON inputs accurately."""
        mock_payload = {
            "body": json.dumps({
                "device_id": "INVERTER-OKHLA-01",
                "actual_kw": 3.8,
                "irradiance_w_m2": 850.0,
                "panel_area_m2": 8.0
            })
        }
        response = lambda_handler(mock_payload, None)
        self.assertEqual(response["statusCode"], 200)
        data = json.loads(response["body"])
        self.assertEqual(data["status"], "PROCESSED")

if __name__ == "__main__":
    unittest.main()
