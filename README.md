# Young Bull Research Starter

A barebones stock research platform with:

- Next.js App Router frontend for Vercel
- FastAPI backend for Railway
- Yahoo Finance data through `yfinance`
- Stock search
- Quote and company snapshot
- Historical price chart
- Dark charcoal and gold Young Bull visual system

## Repository structure

```text
youngbull-research-starter/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
└── backend/
    ├── app/
    └── requirements.txt
```

## 1. Prerequisites

Install:

- Git
- Node.js 20.9 or newer
- Python 3.11 or 3.12
- VS Code

Create accounts for:

- GitHub
- Vercel
- Railway

## 2. Open locally in VS Code

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd youngbull-research-starter
code .
```

Open two VS Code terminals.

### Backend terminal

```bash
cd backend
python -m venv .venv
```

Activate the environment:

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS or Linux:

```bash
source .venv/bin/activate
```

Install and run:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Test:

```text
http://localhost:8000/health
http://localhost:8000/docs
```

### Frontend terminal

```bash
cd frontend
npm install
```

Copy the example environment file:

Windows PowerShell:

```powershell
Copy-Item .env.local.example .env.local
```

macOS or Linux:

```bash
cp .env.local.example .env.local
```

Then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 3. Push to GitHub

From the repository root:

```bash
git init
git add .
git commit -m "Initial Young Bull research platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 4. Deploy the backend to Railway

1. In Railway, create a new project.
2. Choose **Deploy from GitHub repo**.
3. Select this repository.
4. Set the service root directory to `backend`.
5. Railway should detect the included `Dockerfile`.
6. Deploy the service.
7. In **Settings > Networking**, generate a public domain.
8. Test `https://YOUR-RAILWAY-DOMAIN/health`.

Set this Railway environment variable after the Vercel frontend exists:

```text
ALLOWED_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app
```

For multiple origins, use a comma-separated list.

## 5. Deploy the frontend to Vercel

1. In Vercel, choose **Add New > Project**.
2. Import the GitHub repository.
3. Set the root directory to `frontend`.
4. Vercel should detect Next.js automatically.
5. Add this environment variable:

```text
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-DOMAIN
```

6. Deploy.
7. Return to Railway and set `ALLOWED_ORIGINS` to the Vercel production URL.
8. Redeploy Railway after changing the environment variable.

## 6. Normal development workflow

```bash
git checkout -b feature/company-workbooks
# make changes
git add .
git commit -m "Add company workbook shell"
git push -u origin feature/company-workbooks
```

Open a pull request on GitHub. Vercel will create a preview deployment for the branch. Merging into `main` deploys production.

## Important Yahoo Finance note

`yfinance` is useful for prototyping and research, but it is not an official commercial market-data feed. Keep the data layer isolated inside `backend/app/services/market_data.py` so it can later be replaced with Financial Modeling Prep, Intrinio, Polygon, Nasdaq Data Link, or another licensed provider without rebuilding the frontend.

## Recommended next build order

1. Watchlist saved in a database
2. Research article and thesis pages
3. Portfolio holdings and change log
4. Company scorecards
5. Earnings calendar and estimate revisions
6. Authentication and paid-member access
