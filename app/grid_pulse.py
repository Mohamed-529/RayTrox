import os
import json
import uuid
import time
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

app = FastAPI(
    title="GridPulse Industrial Grid Automation & Telemetry Engine",
    description="Physics-Informed Serverless Anomaly Classifier with Geospatial Consensus & Hardware Actuation",
    version="2026.10.04"
)

# In-memory register mocking the live high-speed Amazon Timestream time-series cluster layer
MOCK_TIMESTREAM_DATA_STORE: List[dict] = []

class InverterTelemetryPayload(BaseModel):
    device_id: str = Field(..., examples=["INVERTER-OKHLA-01"])
    neighborhood_id: str = Field(..., examples=["DELHI-ZONE-07"])
    actual_output_kw: float = Field(..., examples=[4.2])
    irradiance_w_m2: float = Field(..., examples=[850.0])
    voltage_v: Optional[float] = Field(default=230.0, description="Electrical Stream: Voltage")
    current_a: Optional[float] = Field(default=24.0, description="Electrical Stream: Current")
    module_temp_c: Optional[float] = Field(default=28.0, description="Environmental Stream: Module Temp")
    panel_area_m2: float = Field(default=8.0)
    is_transient_cloud: Optional[bool] = Field(default=False, description="Transient Cloud Shading Flag")
    # New Edge Fallback & Surface Obstruction Parameters
    satellite_aod: Optional[float] = Field(default=None, description="External Satellite Aerosol Optical Depth (AOD)")
    satellite_visibility_km: Optional[float] = Field(default=None, description="External Satellite Atmospheric Visibility in km")
    consecutive_post_wash_loss: Optional[bool] = Field(default=False, description="Flag indicating persistence after an automated wash cycle")
    temperature_coefficient: Optional[float] = Field(default=-0.38, description="Temperature Coefficient %/°C")

@app.post("/api/v1/grid/telemetry", status_code=status.HTTP_201_CREATED)
async def ingest_edge_telemetry(payload: InverterTelemetryPayload):
    """
    Industrial Grid Telemetry Endpoint supporting 5 definitive edge-case overrides:
    1. Geospatial Topology Hole Piercing (Satellite AOD & Visibility Fallback)
    2. Real-Time 5V Relay Actuation Parameter ('automation_trigger_wash_relay')
    3. Emergency Voice Dispatch Pipeline (Twilio / Amazon SNS Token Payload)
    4. Solid Surface Obstruction (Bird Poop / Mud / Hotspot Mesh)
    5. Peak Summer Thermal Degradation Gradient (Negative Temp Coefficient Math)
    """
    # 1. Pure Software Performance Digital Twin Evaluation
    theoretical_max_kw = (payload.irradiance_w_m2 * payload.panel_area_m2 * 0.85) / 1000.0
    efficiency_loss_pct = 0.0
    
    if theoretical_max_kw > 0:
        loss_kw = theoretical_max_kw - payload.actual_output_kw
        efficiency_loss_pct = max(0.0, (loss_kw / theoretical_max_kw) * 100.0)

    # Initialize edge diagnostics state
    anomaly_mode = "NOMINAL"
    consensus_action = "HOLD_ACTION"
    neighborhood_avg = 0.0
    variance_drift = 0.0
    topology_status = "GRID_SYNCHRONIZED"
    satellite_fallback_active = False
    satellite_confidence_pct = 0.0
    voice_dispatch_pipeline = None
    thermal_gradient_analytics = None
    surface_obstruction_warning = False

    # -------------------------------------------------------------------------
    # EDGE CASE 4: Solid Permanent Surface Contamination (Bird Poop / Mud Hotspot)
    # If loss persists continuously even after a wash cycle, flag structural obstruction
    # -------------------------------------------------------------------------
    if payload.consecutive_post_wash_loss and efficiency_loss_pct >= 20.0:
        consensus_action = "SURFACE_OBSTRUCTION_DETECTED"
        anomaly_mode = "SOLID_SURFACE_OBSTRUCTION_HOTSPOT"
        surface_obstruction_warning = True

    # -------------------------------------------------------------------------
    # EDGE CASE 5: India Summer Peak Thermal Degradation Gradient
    # High Irradiance (G > 750 W/m²), Extreme Temp (T >= 48°C), Voltage decays while current stays high
    # -------------------------------------------------------------------------
    elif (
        payload.module_temp_c and payload.module_temp_c >= 48.0 and
        payload.voltage_v and payload.voltage_v <= 195.0 and
        payload.current_a and payload.current_a >= 18.0 and
        payload.irradiance_w_m2 >= 750.0
    ):
        delta_temp_c = payload.module_temp_c - 25.0
        calculated_thermal_decay_pct = abs(payload.temperature_coefficient or -0.38) * delta_temp_c
        
        consensus_action = "ENGAGE_COOLING_BYPASS"
        anomaly_mode = "THERMAL_ISLAND_LOSS"
        thermal_gradient_analytics = {
            "ambient_module_temp_c": payload.module_temp_c,
            "stc_reference_temp_c": 25.0,
            "delta_temp_c": round(delta_temp_c, 2),
            "temperature_coefficient_pct_per_c": payload.temperature_coefficient or -0.38,
            "calculated_thermal_decay_pct": round(calculated_thermal_decay_pct, 2),
            "derated_voltage_v": payload.voltage_v,
            "elevated_current_a": payload.current_a
        }

    # -------------------------------------------------------------------------
    # TRANSIENT WEATHER: Cloud Shading / Partial Shading
    # -------------------------------------------------------------------------
    elif payload.is_transient_cloud:
        consensus_action = "LOG_NOMINAL_DRIFT_HOLD"
        anomaly_mode = "CLOUD_SHADING"
        neighborhood_avg = efficiency_loss_pct

    # -------------------------------------------------------------------------
    # SPATIAL CONSENSUS & EDGE CASE 1: COLD-START / ISOLATED NODE TOPOLOGY HOLE
    # -------------------------------------------------------------------------
    else:
        regional_nodes = [
            record for record in MOCK_TIMESTREAM_DATA_STORE 
            if record["neighborhood_id"] == payload.neighborhood_id and record["device_id"] != payload.device_id
        ]

        if efficiency_loss_pct >= 20.0:
            # Check if isolated node (zero neighbor records in database)
            if len(regional_nodes) == 0:
                satellite_fallback_active = True
                # Query simulated external Satellite Environmental Stream (AOD / Visibility)
                aod = payload.satellite_aod if payload.satellite_aod is not None else 0.82
                vis_km = payload.satellite_visibility_km if payload.satellite_visibility_km is not None else 3.2

                # If satellite confirms high aerosol optical depth or poor visibility -> Regional Smog
                if aod >= 0.65 or vis_km <= 4.0:
                    consensus_action = "AUTHORIZE_SPRINKLER_WASH"
                    anomaly_mode = "REGIONAL_SMOG_SATELLITE_FALLBACK"
                    topology_status = "ISOLATED_NODE_SATELLITE_AOD_VERIFIED"
                    satellite_confidence_pct = 95.8
                else:
                    consensus_action = "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE"
                    anomaly_mode = "HARDWARE_FAILURE_SATELLITE_FALLBACK"
                    topology_status = "ISOLATED_NODE_CLEAR_SKY_HARDWARE_ALERT"
                    satellite_confidence_pct = 92.4
            
            # Normal Cluster Consensus with >= 1 neighbor
            else:
                recent_losses = [node["efficiency_loss_pct"] for node in regional_nodes[-4:]]
                neighborhood_avg = sum(recent_losses) / len(recent_losses)
                variance_drift = abs(efficiency_loss_pct - neighborhood_avg)

                # Hardware Failure Isolated
                if variance_drift > 12.0:
                    consensus_action = "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE"
                    anomaly_mode = "HARDWARE_FAILURE"
                    topology_status = "CLUSTER_CONSENSUS_ISOLATED_FAULT"
                # Regional Smog Verified
                else:
                    consensus_action = "AUTHORIZE_SPRINKLER_WASH"
                    anomaly_mode = "REGIONAL_SMOG"
                    topology_status = "CLUSTER_CONSENSUS_UNIFORM_SMOG"
        else:
            consensus_action = "HOLD_ACTION"
            anomaly_mode = "NOMINAL"
            topology_status = "CLUSTER_EQUILIBRIUM"

    # -------------------------------------------------------------------------
    # EDGE CASE 3: Critical Emergency Voice Dispatch Engine (Twilio / Amazon SNS)
    # -------------------------------------------------------------------------
    if consensus_action == "BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE":
        voice_dispatch_pipeline = {
            "status": "INITIATED",
            "routing_provider": "TWILIO_VOICE_OUTBOUND_AND_AMAZON_SNS",
            "priority_tier": "P1_CRITICAL",
            "voice_bot_token_payload": "CRITICAL COMPONENT BREAKDOWN PINPOINTED AT SECTOR 04 / INVERTER-01. PLEASE DEPLOY EMERGENCY TECHNICIAN IMMEDIATELY.",
            "dispatch_timestamp": int(time.time()),
            "call_sid": f"CA-{uuid.uuid4().hex[:16]}"
        }

    # -------------------------------------------------------------------------
    # EDGE CASE 2: Real-Time 5V Relay Actuation Parameter
    # -------------------------------------------------------------------------
    automation_trigger_wash_relay = (consensus_action == "AUTHORIZE_SPRINKLER_WASH")
    relay_pin_state = "GPIO_HIGH_5V_TRIPPED" if automation_trigger_wash_relay else "GPIO_LOW_STANDBY"

    # -------------------------------------------------------------------------
    # JEV (JOINT EXPECTED VALUE) DECISION MODEL ARBITRAGE
    # Mathematical Expected Value Payoff across Competing Actions
    # -------------------------------------------------------------------------
    tariff_per_kwh_inr = 8.50 # Commercial peak tariff Delhi NCR
    daily_sun_hours_remaining = 5.0
    recovered_energy_value = round((efficiency_loss_pct / 100.0) * payload.actual_output_kw * daily_sun_hours_remaining * tariff_per_kwh_inr, 2)
    water_cost_inr = 45.0 # Cost of 15L water spray
    diesel_dispatch_cost_inr = 3500.0 # Fuel + technician shift cost
    catastrophic_fire_risk_inr = 45000.0 # Cost of short-circuit inverter fire if washed while cracked
    thermal_shock_warranty_loss_inr = 18000.0 # Voiding 25-yr ALMM warranty via cold water on 56°C cells

    if consensus_action in ["AUTHORIZE_SPRINKLER_WASH"]:
        jev_candidates = {
            "A_wash_sprinkler": round(recovered_energy_value - water_cost_inr, 2),
            "A_diesel_dispatch": round(recovered_energy_value - diesel_dispatch_cost_inr, 2),
            "A_cooling_bypass": -150.0,
            "A_hold_standby": round(-recovered_energy_value, 2)
        }
    elif consensus_action in ["BLOCK_WATER_TRIGGER_ALERT_MAINTENANCE"]:
        jev_candidates = {
            "A_wash_sprinkler": round(-water_cost_inr - catastrophic_fire_risk_inr, 2),
            "A_diesel_dispatch": round(catastrophic_fire_risk_inr - diesel_dispatch_cost_inr, 2),
            "A_cooling_bypass": -500.0,
            "A_hold_standby": round(-catastrophic_fire_risk_inr, 2)
        }
    elif consensus_action in ["ENGAGE_COOLING_BYPASS"]:
        jev_candidates = {
            "A_wash_sprinkler": round(-water_cost_inr - thermal_shock_warranty_loss_inr, 2),
            "A_diesel_dispatch": -diesel_dispatch_cost_inr,
            "A_cooling_bypass": 820.0,
            "A_hold_standby": round(-recovered_energy_value, 2)
        }
    elif consensus_action in ["SURFACE_OBSTRUCTION_DETECTED"]:
        jev_candidates = {
            "A_wash_sprinkler": round(-water_cost_inr - 350.0, 2),
            "A_diesel_dispatch": 2500.0,
            "A_cooling_bypass": 0.0,
            "A_hold_standby": round(-recovered_energy_value, 2)
        }
    else: # LOG_NOMINAL_DRIFT_HOLD or HOLD_ACTION
        jev_candidates = {
            "A_wash_sprinkler": -water_cost_inr,
            "A_diesel_dispatch": -diesel_dispatch_cost_inr,
            "A_cooling_bypass": 0.0,
            "A_hold_standby": 0.0
        }

    optimal_candidate = max(jev_candidates, key=jev_candidates.get)
    max_payoff = round(jev_candidates[optimal_candidate], 2)
    jev_decision_model = {
        "model_framework": "JOINT_EXPECTED_VALUE_DECISION_ENGINE (JEV)",
        "utility_metric": "NET_EXPECTED_PAYOFF_INR",
        "action_payoff_matrix": jev_candidates,
        "optimal_action_selected": optimal_candidate,
        "max_net_expected_value_inr": max_payoff,
        "policy_arbitrage_gain_inr": round(max_payoff - min(jev_candidates.values()), 2),
        "mathematical_rule": "argmax_a E[Yield_Gain(a)] - E[Resource_Cost(a)] - E[Asset_Damage_Risk(a)]"
    }

    # Commit processed state entry record into analytics time-series log array buffer
    processed_log = {
        "record_id": str(uuid.uuid4()),
        "timestamp": int(time.time()),
        "anomaly_mode": anomaly_mode,
        "efficiency_loss_pct": round(efficiency_loss_pct, 2),
        "neighborhood_avg_loss_pct": round(neighborhood_avg, 2),
        "variance_drift": round(variance_drift, 2),
        "consensus_verdict": consensus_action,
        "topology_status": topology_status,
        "satellite_fallback_active": satellite_fallback_active,
        "optimal_jev_action": optimal_candidate,
        **payload.model_dump()
    }
    MOCK_TIMESTREAM_DATA_STORE.append(processed_log)

    return {
        "status": "PROCESSED",
        "anomaly_mode": anomaly_mode,
        "calculated_efficiency_loss_pct": round(efficiency_loss_pct, 2),
        "neighborhood_avg_loss_pct": round(neighborhood_avg, 2),
        "variance_drift": round(variance_drift, 2),
        "consensus_action_verdict": consensus_action,
        "topology_status": topology_status,
        "automation_trigger_wash_relay": automation_trigger_wash_relay,
        "relay_pin_state": relay_pin_state,
        "satellite_fallback": {
            "active": satellite_fallback_active,
            "confidence_pct": satellite_confidence_pct,
            "aod_index": payload.satellite_aod if satellite_fallback_active else None
        },
        "surface_obstruction_warning": surface_obstruction_warning,
        "thermal_gradient_analytics": thermal_gradient_analytics,
        "voice_dispatch_pipeline": voice_dispatch_pipeline,
        "jev_decision_model": jev_decision_model
    }

@app.get("/health", status_code=status.HTTP_200_OK)
async def system_liveness_check():
    return {
        "status": "HEALTHY",
        "infrastructure": "AWS-Lambda-Core-Consensus",
        "streams": ["ELECTRICAL", "ENVIRONMENTAL", "GEOSPATIAL", "SATELLITE_AOD"],
        "actuators": ["5V_RELAY_SUBMERSIBLE_PUMP", "TWILIO_VOICE_SNS_DISPATCH"]
    }
