🌍 Multi-Modal Cross-Border Route Selector 🚛✈️🚢
An AI-powered logistics optimization tool that determines the most efficient cross-border shipping routes using multiple transport modes (air, sea, land, or hybrid combinations). It optimizes key constraints like cost, transit time, regulatory feasibility, and carbon footprint.

Developed during LogiThon 2025 (IIT Bombay), this project leverages AI and geospatial data to enhance decision-making in logistics and supply chain management.

🚀 Features
✅ AI-powered Route Optimization using A* Algorithm with dynamic heuristics
✅ Multi-Modal Transport Support (Air, Sea, Land & Hybrid combinations)
✅ Optimized for Cost 💰, Time ⏳ & CO₂ Footprint 🌍
✅ Real-time Interactive Map to visualize top 3-5 optimal routes dynamically
✅ AI-driven Insights powered by Google Gemini AI
✅ Custom API integrating real-time logistics data sources

⚙️ Tech Stack
🔹 Frontend: Next.js + TypeScript
🔹 Backend: Python + FastAPI
🔹 Algorithm: A* Search with heuristics for cost, time, and CO₂ optimization
🔹 Data Sources: Global logistics datasets & real-time APIs
🔹 AI Integration: Google Gemini for intelligent suggestions
🔹 Mapping: Leaflet.js & geospatial data processing

🛠️ Installation & Setup
Frontend (Next.js + TypeScript)
bash
Copy
Edit
cd frontend
npm install
npm run dev
Backend (FastAPI + Python)
bash
Copy
Edit
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
🔗 API Endpoints
Method	Endpoint	Description
GET	/routes?source={}&destination={}&mode={}	Get optimal routes based on transport mode
POST	/calculate	Compute best route with cost & time estimates
GET	/suggestions	AI-powered recommendations for route selection

📸 Screenshots & Output


🙌 Acknowledgments
A big thanks to Softlink Global, IOER IIT Bombay, and All Masters for organizing LogiThon 2025, fostering innovation, and bridging the gap between academia and industry!

👥 Contributors
Aditya Rathod
Joshua D’Mello
Joshua D’Silva
