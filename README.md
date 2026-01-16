
# 🏛️ EquityEcho: PROPHET v3.8
### *High-Fidelity Market Intelligence via AI-Orchestrated Tribunal Deliberation*

[![Creator](https://img.shields.io/badge/Creator-Sobi-blueviolet?style=for-the-badge)](https://github.com/sobiswriter)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![Intelligence](https://img.shields.io/badge/Intelligence-Gemini_3_Flash-blue?style=for-the-badge)](https://ai.google.dev/)

---

## 💎 The Vision
**EquityEcho** is a sophisticated financial intelligence dashboard designed to cut through market noise. Unlike standard stock trackers, EquityEcho simulates a high-stakes boardroom deliberation between three distinct AI personas. By pitting quantitative rigor against real-time sentiment, it provides a unified "Decree" that balances hard numbers with the unpredictability of the news cycle.

---

## 🧠 The Tribunal Members

| Agents | Specialization | Focus |
| :--- | :--- | :--- |
| **MARK** | Chief Quantitative Strategist | Mathematical rigor, P/E ratios, RSI, Debt-to-Equity, and technical indicators. |
| **ANNA** | Market Intelligence Analyst | Real-time news scouring, social sentiment, global catalysts, and geopolitical impact. |
| **BOSE** | Tribunal Presiding Judge | The ultimate adjudicator. Weighs conflicting reports to issue the final Risk Profile. |

---

## 🚀 Core Features

*   **Evidence Scour Protocol:** Leverages Google Search Grounding to ensure recommendations are based on real-time news, not just training data.
*   **Dual-Path Projections:** 
    *   *Tactical Path:* A 7-day high-precision daily forecast for short-term catalyst modeling.
    *   *Strategic Forecast:* A 30-day weekly outlook for structural trend analysis.
*   **Synthesis Engine:** A sidebar intelligence module that breaks down confidence indices (Data Robustness, Sentiment Signal, Forecast Reliability).
*   **Document Injection:** Upload balance sheets, 10-K filings, or analyst PDFs to give the Tribunal proprietary context for their deliberation.
*   **Cyber-Dark Aesthetic:** A high-end, responsive UI built for modern financial professionals.

---

## 🛠 Tech Stack

- **Frontend:** React 19 (ESM-ready)
- **Intelligence:** Google Gemini API (Gemini 3 Flash Preview)
- **Visuals:** Recharts (Custom vector-path rendering)
- **Styling:** Tailwind CSS (Glassmorphism & Cyber-Dark themes)
- **Icons:** Lucide-React
- **Search Tooling:** Google Search Grounding

---

## 🏁 Getting Started Locally

Setting up EquityEcho for local development is simple and straightforward.

### Prerequisites
- A modern web browser (Chrome, Edge, or Brave).
- A valid **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### Installation & Configuration

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/sobiswriter/equityecho-tribunal.git
    cd equityecho-tribunal
    ```

2.  **Set up Environment Variables:**
    Create a file named `.env` in the root directory and add your API key:
    ```env
    API_KEY=your_gemini_api_key_here
    ```
    *Note: The application expects the key specifically as `API_KEY` to initialize the Google GenAI SDK.*

3.  **Launch the Dashboard:**
    Since the project uses ES6 modules directly and requires an environment variable to be available in the browser context, you can use a dev server like [Vite](https://vitejs.dev/) or any server that supports `.env` injection.

    If you are using a standard static server (like `serve` or `http-server`), ensure your environment variables are correctly mapped or hardcoded into the build/execution context.

---

## 🛡 Disclaimer
EquityEcho is an experimental AI synthesis platform. Financial projections are algorithmic simulations based on scoured data. Market volatility is inherently unpredictable. This tool is provided for informational and educational purposes and does **not** constitute professional financial advice.

---

## 👤 About the Creator
**Sobi** is a senior-level engineer and designer focused on the intersection of generative AI and intuitive UI/UX. 

🔗 **GitHub:** [@sobiswriter](https://github.com/sobiswriter)  
📧 **Contact:** [Reach out via GitHub](https://github.com/sobiswriter)

---
*Built with precision. Adjudicated by intelligence.*
