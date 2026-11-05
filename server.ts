import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // Setup Gemini AI Client if API Key is configured
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }

  // API Route: AI Decision Engine Explanation
  app.post('/api/ai/explain-decision', async (req: Request, res: Response) => {
    const { scenarioName, vehicles, intersection, decision, priorityFramework } = req.body;

    const fallbackExplanation = `[Deterministic Rule Engine Output]:
Intersection: ${intersection?.name || 'MG Road & Brigade Rd Junction'}
Granted Corridor: ${decision?.grantedVehicleId || 'Primary Emergency Unit'} (${decision?.grantedCategory || 'Ambulance'})
Reasoning: Prioritized based on authorized severity policy [${decision?.grantedSeverity || 'Critical'}] with shortest ETA (${decision?.grantedEta || '2.4'} min). Secondary vehicles (${vehicles?.map((v: any) => v.callSign || v.id).join(', ') || 'Fire Engine, Police Patrol'}) routed through dynamic staggered green window (phase shift +45s) to prevent gridlock.
Traffic Queue Impact: Estimated spillover 140m dissipated within 3 signal cycles. Emergency corridor transit authorized under Smart City Mobility Standard Protocol.`;

    if (!ai) {
      return res.json({
        explanation: fallbackExplanation,
        source: 'deterministic-fallback',
        timestamp: new Date().toISOString(),
      });
    }

    try {
      const prompt = `You are the AI Emergency Decision Engine for EMERGENX Smart City Mobility in Bangalore.
Evaluate this emergency intersection priority conflict:
- Scenario: ${scenarioName || 'Multi-emergency intersection convergence'}
- Location: ${intersection?.name || 'Central Urban Junction'} (Simulated Road Network)
- Primary Decision: Prioritize ${decision?.grantedVehicleId} (${decision?.grantedCategory})
- Other Vehicles in conflict: ${JSON.stringify(vehicles || [])}
- Priority Framework: ${priorityFramework || 'Statutory Emergency Priority (Human Life > Active Fire Structure > High-Risk Pursuit)'}

Generate a concise, authoritative, professional 3-paragraph Smart City Traffic Command Center briefing:
1. Primary Priority Reasoning (why this vehicle takes the green corridor first).
2. Deconfliction & Staggering Strategy (how the secondary emergency vehicles are held/rerouted safely).
3. Traffic Impact Mitigation (how cross-traffic queues and normal transit are recovered without cascading urban gridlock).
Keep tone professional, analytical, and transparent. Do not invent arbitrary percentages.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const explanation = response.text || fallbackExplanation;
      return res.json({
        explanation,
        source: 'gemini-3.8-flash',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Gemini API call failed in /api/ai/explain-decision:', error?.message);
      return res.json({
        explanation: fallbackExplanation,
        source: 'deterministic-engine',
        note: 'AI assistant generated deterministic response due to upstream latency/key status.',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // API Route: AI Incident Dispatch Briefing
  app.post('/api/ai/incident-briefing', async (req: Request, res: Response) => {
    const { vehicle, incident, route, hospital } = req.body;

    const fallbackBriefing = `EMERGENCY DISPATCH BRIEFING - ${incident?.id || 'INC-2026-092'}
Category: ${incident?.category || 'Cardiac Emergency'} | Severity: ${incident?.severity || 'CRITICAL'}
Assigned Unit: ${vehicle?.callSign || 'MEDIC-101'} (${vehicle?.registration || 'KA-01-EA-1001'})
Destination: ${hospital?.name || 'Manipal Hospital, Old Airport Road'}
Simulated Route: via ${route?.name || 'Cubbon Road - Old Airport Rd Corridor'} | Distance: ${route?.distanceKm || 6.8} km | ETA: ${route?.etaMinutes || 9.4} min
Corridor Advisory: Dynamic traffic signal priority requested across 5 intersections. Traffic police notified for manual clearance at Domlur flyover choke point. Emergency Department alerted for triage team mobilization.`;

    if (!ai) {
      return res.json({ briefing: fallbackBriefing, source: 'standard-dispatch' });
    }

    try {
      const prompt = `Generate a concise Emergency Mobility Coordination Briefing for EMERGENX Command Center:
- Vehicle: ${vehicle?.callSign} (${vehicle?.type})
- Incident: ${incident?.title} - ${incident?.description}
- Severity: ${incident?.severity}
- Route: ${route?.name} (${route?.distanceKm} km, ETA: ${route?.etaMinutes} mins)
- Destination: ${hospital?.name || 'Designated Trauma Facility'}

Provide a clean structured dispatch dispatch briefing with sections:
[1] TACTICAL ROUTE ASSESSMENT
[2] INTERSECTION CLEARANCE PROTOCOL
[3] HOSPITAL / RECEPTION COORDINATION
Keep it under 180 words, crisp and professional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        briefing: response.text || fallbackBriefing,
        source: 'gemini-3.8-flash',
      });
    } catch (err) {
      return res.json({ briefing: fallbackBriefing, source: 'standard-dispatch' });
    }
  });

  // API Route: Predictive Traffic Intelligence
  app.post('/api/ai/traffic-prediction', async (req: Request, res: Response) => {
    const { corridor, weather, currentCongestion, activeIncidents } = req.body;

    const fallbackAnalysis = `CORRIDOR PREDICTIVE INTELLIGENCE:
Corridor: ${corridor || 'Outer Ring Road - Silk Board to Marathahalli'}
Current Congestion Index: ${currentCongestion || '74% (Heavy)'}
Predicted 15-Min Trend: Deteriorating (+12% delay) due to evening peak flow and bottleneck at Bellandur junction.
Corridor Optimization: Recommend diverting secondary non-critical emergency units via Wind Tunnel Road bypass to save 4.2 minutes. Pre-clear signal cycle at Iblur junction 90 seconds prior to unit arrival.`;

    if (!ai) {
      return res.json({ analysis: fallbackAnalysis, source: 'predictive-algorithm' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze urban traffic corridor conditions for emergency mobility in Bangalore:
Corridor: ${corridor}
Current Congestion: ${currentCongestion}
Weather: ${weather || 'Clear, 28°C'}
Active Emergency Movements: ${activeIncidents || 3}

Provide a 2-paragraph predictive recommendation for traffic controllers on signal hold timing and alternative bypass routes.`,
      });

      return res.json({
        analysis: response.text || fallbackAnalysis,
        source: 'gemini-3.8-flash',
      });
    } catch (err) {
      return res.json({ analysis: fallbackAnalysis, source: 'predictive-algorithm' });
    }
  });

  // Google Maps Platform API Config
  app.get('/api/config/maps-key', (_req: Request, res: Response) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '';
    res.json({ apiKey });
  });

  // Google Maps Platform Geocoding API Proxy
  app.post('/api/maps/geocode', async (req: Request, res: Response) => {
    const { address } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    // Bangalore default landmarks dictionary
    const bangaloreLandmarks: Record<string, { lat: number; lng: number; formattedAddress: string }> = {
      'manipal': { lat: 12.9592, lng: 77.6486, formattedAddress: 'Manipal Hospital, HAL Old Airport Rd, Kodihalli, Bengaluru' },
      'victoria': { lat: 12.9634, lng: 77.5750, formattedAddress: 'Victoria Hospital & BMCRI Trauma Centre, Fort Rd, Bengaluru' },
      'bowring': { lat: 12.9818, lng: 77.6045, formattedAddress: 'Bowring & Lady Curzon Hospital, Shivaji Nagar, Bengaluru' },
      'apollo': { lat: 12.9664, lng: 77.6189, formattedAddress: 'Apollo Emergency Trauma Care, Ulsoor, Bengaluru' },
      'mayo': { lat: 12.9728, lng: 77.6111, formattedAddress: 'Mayo Hall Fire & Emergency Station, MG Road, Bengaluru' },
      'cubbon': { lat: 12.9760, lng: 77.5930, formattedAddress: 'Cubbon Park Police & Emergency Outpost, Bengaluru' },
      'ashok': { lat: 12.9735, lng: 77.6060, formattedAddress: 'Ashok Nagar Traffic Police Station, Brigade Rd, Bengaluru' },
      'domlur': { lat: 12.9610, lng: 77.6387, formattedAddress: 'Domlur Flyover Traffic Hub, Old Airport Rd, Bengaluru' },
      'indiranagar': { lat: 12.9784, lng: 77.6408, formattedAddress: 'Indiranagar 100ft Road Emergency Station, Bengaluru' },
      'mg road': { lat: 12.9738, lng: 77.6074, formattedAddress: 'Mahatma Gandhi Road & Brigade Road Junction, Bengaluru' },
      'koramangala': { lat: 12.9352, lng: 77.6245, formattedAddress: 'Sony World Junction, 80ft Rd, Koramangala, Bengaluru' },
    };

    if (apiKey) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address || 'Bengaluru'
          )}&region=in&key=${apiKey}`
        );
        const data: any = await response.json();
        if (data.status === 'OK' && data.results?.length > 0) {
          const loc = data.results[0].geometry.location;
          return res.json({
            lat: loc.lat,
            lng: loc.lng,
            formattedAddress: data.results[0].formatted_address,
            source: 'google-geocoding-api',
          });
        }
      } catch (err) {
        console.warn('Geocoding API call error, falling back to local lookup:', err);
      }
    }

    // Fallback matching
    const query = (address || '').toLowerCase();
    for (const [key, value] of Object.entries(bangaloreLandmarks)) {
      if (query.includes(key)) {
        return res.json({ ...value, source: 'bangalore-regional-database' });
      }
    }

    return res.json({
      lat: 12.9716,
      lng: 77.5946,
      formattedAddress: address ? `${address}, Bengaluru, Karnataka` : 'Central Bangalore Hub, Bengaluru',
      source: 'bangalore-regional-database',
    });
  });

  // Google Places API (New) Search Proxy
  app.post('/api/maps/places-search', async (req: Request, res: Response) => {
    const { query, category } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    const demoEmergencyPlaces = [
      { id: 'p1', name: 'Manipal Hospital (Old Airport Road)', type: 'hospital', address: '98, HAL Old Airport Rd, Kodihalli', lat: 12.9592, lng: 77.6486, phone: '+91 80 2502 4444' },
      { id: 'p2', name: 'Victoria Hospital Trauma Centre', type: 'hospital', address: 'Near City Market, Fort Rd', lat: 12.9634, lng: 77.5750, phone: '+91 80 2670 1150' },
      { id: 'p3', name: 'Bowring and Lady Curzon Hospital', type: 'hospital', address: 'Hospital Rd, Tasker Town, Shivajinagar', lat: 12.9818, lng: 77.6045, phone: '+91 80 2559 1362' },
      { id: 'p4', name: 'Mayo Hall Fire & Emergency HQ', type: 'fire_station', address: 'Residency Rd, Ashok Nagar', lat: 12.9720, lng: 77.6150, phone: '101' },
      { id: 'p5', name: 'Indiranagar Fire Station', type: 'fire_station', address: '100ft Road, HAL 2nd Stage', lat: 12.9780, lng: 77.6430, phone: '101' },
      { id: 'p6', name: 'High Grounds Fire Station', type: 'fire_station', address: 'Millers Rd, Vasanth Nagar', lat: 12.9880, lng: 77.5910, phone: '101' },
      { id: 'p7', name: 'Ashok Nagar Traffic Police Station', type: 'police_station', address: 'Museum Rd / Brigade Rd Cross', lat: 12.9735, lng: 77.6060, phone: '103' },
      { id: 'p8', name: 'Cubbon Park Police Station', type: 'police_station', address: 'Kasturba Rd, Sampangi Rama Nagar', lat: 12.9760, lng: 77.5930, phone: '100' },
      { id: 'p9', name: 'Halasuru Traffic Police Station', type: 'police_station', address: 'Old Madras Rd, Halasuru', lat: 12.9740, lng: 77.6240, phone: '103' },
    ];

    if (apiKey) {
      try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.nationalPhoneNumber',
          },
          body: JSON.stringify({
            textQuery: `${query || 'emergency'} in Bangalore`,
            locationBias: {
              circle: {
                center: { latitude: 12.9716, longitude: 77.5946 },
                radius: 15000.0,
              },
            },
          }),
        });
        const data: any = await response.json();
        if (data.places?.length > 0) {
          const formatted = data.places.map((p: any) => ({
            id: p.id,
            name: p.displayName?.text || 'Emergency Location',
            address: p.formattedAddress,
            lat: p.location?.latitude,
            lng: p.location?.longitude,
            phone: p.nationalPhoneNumber || '+91 80 2294 2222',
            type: category || 'emergency',
          }));
          return res.json({ places: formatted, source: 'google-places-api-new' });
        }
      } catch (err) {
        console.warn('Places API search error:', err);
      }
    }

    // Filter fallback
    const filtered = demoEmergencyPlaces.filter((p) => {
      if (category && p.type !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
      }
      return true;
    });

    res.json({ places: filtered, source: 'bangalore-emergency-infrastructure' });
  });

  // Google Routes API Proxy with Traffic Awareness
  app.post('/api/maps/compute-routes', async (req: Request, res: Response) => {
    const { origin, destination, travelMode = 'DRIVE' } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

    if (apiKey && origin?.lat && destination?.lat) {
      try {
        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description,routes.routeLabels',
          },
          body: JSON.stringify({
            origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
            destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
            travelMode,
            routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
            computeAlternativeRoutes: true,
          }),
        });
        const data: any = await response.json();
        if (data.routes?.length > 0) {
          return res.json({ routes: data.routes, source: 'google-routes-api' });
        }
      } catch (err) {
        console.warn('Routes API compute error:', err);
      }
    }

    // High quality simulated Bangalore route alternatives
    res.json({
      routes: [
        {
          name: 'Route A: Direct MG Road Arterial',
          duration: '870s',
          distanceMeters: 6200,
          reliabilityScore: 68,
          trafficCondition: 'Heavy Peak Congestion (Domlur bottleneck)',
          recommended: false,
        },
        {
          name: 'Route B: Cubbon Green Wave Corridor',
          duration: '528s',
          distanceMeters: 7100,
          reliabilityScore: 94,
          trafficCondition: 'Preempted Signal Wave Synchronization',
          recommended: true,
        },
        {
          name: 'Route C: Outer Perimeter Ring Road',
          duration: '960s',
          distanceMeters: 9400,
          reliabilityScore: 91,
          trafficCondition: 'Moderate Flow Bypass',
          recommended: false,
        },
      ],
      source: 'emergenx-route-engine',
    });
  });

  // Health route
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'online',
      service: 'EMERGENX Coordination Engine',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      mapsConfigured: Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EMERGENX Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EMERGENX server:', err);
  process.exit(1);
});
