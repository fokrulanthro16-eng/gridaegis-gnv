const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.join(__dirname, '..', 'docs', 'screenshots');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log('Launching headless browser via Edge...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Capture GIS Map View
  console.log('Capturing GIS Map view...');
  // Click on "Spatial GIS Energy Burden" tab
  const tabs = await page.$$('nav button');
  if (tabs.length >= 2) {
    await tabs[1].click(); // Tab 1: GIS Map
    await new Promise((r) => setTimeout(r, 1500));
    // Click on NASA ECOSTRESS LST button if present
    const layerButtons = await page.$$('button');
    for (const b of layerButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('NASA ECOSTRESS LST')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, 'gis-map.png') });
    console.log('Saved gis-map.png');
  }

  // 2. Capture Karst-Grid DAG Failure Simulator View
  console.log('Capturing DAG Simulator view...');
  if (tabs.length >= 3) {
    await tabs[2].click(); // Tab 2: Karst DAG
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'dag-simulator.png') });
    console.log('Saved dag-simulator.png');
  }

  // 3. Capture Gemini Utility Auditor View
  console.log('Capturing Gemini Auditor view...');
  if (tabs.length >= 4) {
    await tabs[3].click(); // Tab 3: Gemini
    await new Promise((r) => setTimeout(r, 1500));
    // Click "Run Multimodal Utility Audit" button
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && (text.includes('Run Multimodal') || text.includes('Ejecutar'))) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(outDir, 'gemini-auditor.png') });
    console.log('Saved gemini-auditor.png');
  }

  // 4. Capture 72h Shelter Microgrid Solver View
  console.log('Capturing Microgrid Solver view...');
  if (tabs.length >= 5) {
    await tabs[4].click(); // Tab 4: Microgrid
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outDir, 'microgrid-solver.png') });
    console.log('Saved microgrid-solver.png');
  }

  // 5. Capture Offline Emergency Shelter Pass Modal
  console.log('Capturing Offline Shelter Pass modal...');
  // Find the "Offline Shelter Pass" button in header
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Offline Shelter Pass')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, 'offline-shelter-pass.png') });
  console.log('Saved offline-shelter-pass.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
