import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  DollarSign,
  Droplets,
  Fuel,
  Globe,
  Leaf,
  Scale,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';

export const ImpactCalculatorView: React.FC = () => {
  const [installations, setInstallations] = useState<number>(250);
  const [smogDaysPerYear, setSmogDaysPerYear] = useState<number>(45);
  const [dieselPerTripLiters, setDieselPerTripLiters] = useState<number>(14.5);
  const [costPerDispatchUsd, setCostPerDispatchUsd] = useState<number>(240);
  const [waterPerSprinklerWashLiters, setWaterPerSprinklerWashLiters] = useState<number>(250);

  // Constants
  const kgCo2PerLiterDiesel = 2.68;
  const falseAlarmRateWithoutConsensus = 0.62; // 62% of winter degradation alerts are smog, not broken hardware
  const alertsPerNodePerSmogSeason = 3.5; // Average alerts triggered per installation during smog season

  // Calculations
  const totalRawAlerts = Math.round(installations * alertsPerNodePerSmogSeason);
  const falseDispatchesSuppressed = Math.round(totalRawAlerts * falseAlarmRateWithoutConsensus);

  const annualDieselSavedLiters = Math.round(falseDispatchesSuppressed * dieselPerTripLiters);
  const annualCo2AvoidedKg = Math.round(annualDieselSavedLiters * kgCo2PerLiterDiesel);
  const annualCo2AvoidedTons = Number((annualCo2AvoidedKg / 1000).toFixed(1));
  const annualOpExSavedUsd = Math.round(falseDispatchesSuppressed * costPerDispatchUsd);

  // Hardware failures prevented from false water washing (approx 8% of installations)
  const hardwareFaultsIsolated = Math.round(installations * 0.08);
  const annualWaterSavedLiters = Math.round(hardwareFaultsIsolated * waterPerSprinklerWashLiters * 6);

  // Equivalencies
  const carsRemovedEquivalent = Number((annualCo2AvoidedTons / 4.6).toFixed(1));
  const treesPlantedEquivalent = Math.round(annualCo2AvoidedTons * 45);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          <span>Quantitative ROI Modeler</span>
          <span aria-hidden="true">·</span>
          <span>Municipal Fleet Decarbonization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Municipal Scale &amp; Environmental Impact Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Model how Spatial Consensus scales from a single industrial cluster (e.g. Okhla) to a city-wide rooftop solar grid.
        </p>
      </div>

      {/* Main Grid: Left Controls, Right Output Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Grid &amp; Environmental Parameters
          </h2>

          {/* Slider 1: Total Rooftop Arrays */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Connected Solar Rooftops:</span>
              </span>
              <span className="font-mono font-bold text-slate-900">{installations} arrays</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={installations}
              onChange={(e) => setInstallations(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20 (Pilot Cluster)</span>
              <span>2,000 (Metropolitan)</span>
            </div>
          </div>

          {/* Slider 2: Annual Smog Days */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Annual High-PM2.5 Smog Days:</span>
              </span>
              <span className="font-mono font-bold text-slate-900">{smogDaysPerYear} days</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="5"
              value={smogDaysPerYear}
              onChange={(e) => setSmogDaysPerYear(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>15 days (Mild)</span>
              <span>90 days (Severe Winter)</span>
            </div>
          </div>

          {/* Slider 3: Cost per Truck Dispatch */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Cost per Technician Dispatch:</span>
              </span>
              <span className="font-mono font-bold text-slate-900">${costPerDispatchUsd}</span>
            </div>
            <input
              type="range"
              min="100"
              max="450"
              step="10"
              value={costPerDispatchUsd}
              onChange={(e) => setCostPerDispatchUsd(parseInt(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>$100 (In-house)</span>
              <span>$450 (Contractor)</span>
            </div>
          </div>

          {/* Slider 4: Diesel per Trip */}
          <div>
            <div className="flex justify-between text-xs text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Fuel className="w-3.5 h-3.5 text-slate-500" />
                <span>Round-Trip Diesel Consumption:</span>
              </span>
              <span className="font-mono font-bold text-slate-900">{dieselPerTripLiters} L</span>
            </div>
            <input
              type="range"
              min="8"
              max="25"
              step="0.5"
              value={dieselPerTripLiters}
              onChange={(e) => setDieselPerTripLiters(parseFloat(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>8 L (Short Urban)</span>
              <span>25 L (Outer District)</span>
            </div>
          </div>
        </div>

        {/* Output Metrics Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Impact Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OpEx Saved */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Annual OpEx Saved</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                ${annualOpExSavedUsd.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                From {falseDispatchesSuppressed.toLocaleString()} phantom diesel dispatches eliminated.
              </p>
            </div>

            {/* Carbon Avoided */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Carbon Prevented</span>
                <Leaf className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-700">
                {annualCo2AvoidedTons} tons CO₂e
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Equal to taking {carsRemovedEquivalent} gasoline cars off the road.
              </p>
            </div>

            {/* Diesel Saved */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Diesel Fuel Conserved</span>
                <Fuel className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {annualDieselSavedLiters.toLocaleString()} L
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Preventing localized particulate (PM2.5) tailpipe exhaust.
              </p>
            </div>

            {/* Clean Water Protected */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Water Waste Prevented</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-sky-800">
                {annualWaterSavedLiters.toLocaleString()} L
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Halting automated washes on damaged hardware arrays.
              </p>
            </div>
          </div>

          {/* Comparative Impact Callout */}
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-amber-400">
              The Pure Software ROI Multiplier
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an operator attempted to solve this with physical solar pyranometer and dust sensors, it would cost <strong>${(installations * 4500).toLocaleString()}</strong> in upfront hardware plus annual maintenance. GridPulse delivers the exact same diagnostic accuracy for <strong>$0 extra hardware capex</strong>, running natively on AWS serverless compute for pennies per day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
