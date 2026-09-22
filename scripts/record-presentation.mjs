import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recordPresentation() {
  const rootDir = path.resolve(__dirname, '..');
  const screenshotsDir = path.join(rootDir, 'public', 'screenshots');
  const presentationDir = path.join(rootDir, 'public', 'presentation');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  if (!fs.existsSync(presentationDir)) {
    fs.mkdirSync(presentationDir, { recursive: true });
  }

  // Clean any old webm in presentation dir before recording
  const existingFiles = fs.readdirSync(presentationDir);
  for (const file of existingFiles) {
    if (file.endsWith('.webm')) {
      try {
        fs.unlinkSync(path.join(presentationDir, file));
      } catch (e) {
        console.warn(`Could not delete old file ${file}:`, e.message);
      }
    }
  }

  console.log('🚀 Launching Playwright Chromium with 1080p recording...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: presentationDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  // Prevent window.print from freezing headless browser
  await page.addInitScript(() => {
    window.print = () => {
      console.log('window.print() invoked (prevented modal block)');
    };
  });

  console.log('🌐 Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 45000 });

  // [0:00 - 0:25] Overview & Telemetry
  console.log('📸 [Step 1] Overview & Telemetry (14.8% energy burden)...');
  await page.waitForTimeout(4000);
  const screenshot1 = path.join(screenshotsDir, '01-overview-telemetry.png');
  await page.screenshot({ path: screenshot1 });
  console.log(`Saved: ${screenshot1}`);

  // [0:25 - 0:55] Spatial GIS & Policy Simulator
  console.log('📸 [Step 2] Spatial GIS & Policy Simulator...');
  const gisTab = page.locator('button:has-text("Spatial GIS Energy Burden")');
  await gisTab.click();
  await page.waitForTimeout(1500);

  // Hover over 32641
  try {
    const zip32641Text = page.locator('svg text:has-text("32641")').first();
    await zip32641Text.hover({ timeout: 3000 });
  } catch (err) {
    console.log('SVG hover bypassed, proceeding to policy simulator toggle.');
  }

  // Toggle "+15% Tree Canopy & Solar Policy Simulator"
  const policyToggle = page.locator('button:has-text("Engage Policy Simulation"), button:has-text("Policy Active")').first();
  await policyToggle.click();
  await page.waitForTimeout(4000); // Display dynamic savings (~$42/mo)
  const screenshot2 = path.join(screenshotsDir, '02-gis-policy-simulator.png');
  await page.screenshot({ path: screenshot2 });
  console.log(`Saved: ${screenshot2}`);

  // [0:55 - 1:25] Karst-Grid DAG Simulator & Microgrid
  console.log('📸 [Step 3] Karst-Grid DAG Failure Simulator...');
  const karstTab = page.locator('button:has-text("Karst-Grid DAG Simulator")');
  await karstTab.click();
  await page.waitForTimeout(1500);

  // Adjust Hurricane slider to Category 4
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"][max="4"]');
    if (slider) {
      slider.value = '4';
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(1000);

  // Click "Trigger Cat 4 Karst Cascading Blackout"
  const cat4Btn = page.locator('button:has-text("Trigger Cat 4 Karst Cascading Blackout")');
  await cat4Btn.click();
  await page.waitForTimeout(2000); // Stabilize BFS cascade animation
  const screenshot3 = path.join(screenshotsDir, '03-karst-dag-cascade.png');
  await page.screenshot({ path: screenshot3 });
  console.log(`Saved: ${screenshot3}`);

  // Microgrid Solver
  console.log('📸 [Step 4] 72h Shelter Islanding Solver...');
  const microgridTab = page.locator('button:has-text("72h Shelter Islanding")');
  await microgridTab.click();
  await page.waitForTimeout(3000);
  const screenshot4 = path.join(screenshotsDir, '04-microgrid-72h-dispatch.png');
  await page.screenshot({ path: screenshot4 });
  console.log(`Saved: ${screenshot4}`);

  // [1:25 - 2:05] Multimodal Gemini & Voice Triage
  console.log('📸 [Step 5] Multimodal Gemini & LIHEAP Auditor with Voice Triage...');
  const geminiTab = page.locator('button:has-text("Gemini Utility & LIHEAP Auditor")');
  await geminiTab.click();
  await page.waitForTimeout(1500);

  // Run the audit first so $850 LIHEAP grant preview and audio options appear
  const auditBtn = page.locator('button:has-text("Run Multimodal Audit"), button:has-text("Run Edge Resilience Audit")').first();
  await auditBtn.click();
  await page.waitForTimeout(2500);

  // Click Spanish translation toggle ("ES (Español)")
  const spanishBtn = page.locator('button:has-text("ES (Español)")');
  await spanishBtn.click();
  await page.waitForTimeout(1000);

  // Trigger "Escuchar Resumen" / speech action
  try {
    const speechBtn = page.locator('button:has-text("Escuchar Resumen"), button:has-text("Listen to Summary")').first();
    await speechBtn.click({ timeout: 3000 });
  } catch (err) {
    console.log('Speech button triggered or bypassed.');
  }

  await page.waitForTimeout(4000); // Pause on the $850 LIHEAP grant preview
  const screenshot5 = path.join(screenshotsDir, '05-gemini-liheap-auditor.png');
  await page.screenshot({ path: screenshot5 });
  console.log(`Saved: ${screenshot5}`);

  // [2:05 - 2:20] Offline Pass & Outro
  console.log('📸 [Step 6] Offline Shelter Pass Modal...');
  const shelterPassBtn = page.locator('header button:has-text("Offline Shelter Pass")');
  await shelterPassBtn.click();
  await page.waitForTimeout(3000);
  const screenshot6 = path.join(screenshotsDir, '06-offline-shelter-pass.png');
  await page.screenshot({ path: screenshot6 });
  console.log(`Saved: ${screenshot6}`);

  // Finish video writing
  console.log('🎬 Finalizing video capture and closing context...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video and rename to gridaegis-presentation-walkthrough.webm
  const finalVideoName = 'gridaegis-presentation-walkthrough.webm';
  const finalVideoPath = path.join(presentationDir, finalVideoName);

  const videoFiles = fs.readdirSync(presentationDir).filter(f => f.endsWith('.webm') && f !== finalVideoName);
  if (videoFiles.length > 0) {
    const rawVideoPath = path.join(presentationDir, videoFiles[0]);
    if (fs.existsSync(finalVideoPath)) {
      fs.unlinkSync(finalVideoPath);
    }
    fs.renameSync(rawVideoPath, finalVideoPath);
    console.log(`✅ Video saved & renamed to: ${finalVideoPath}`);
  } else if (fs.existsSync(finalVideoPath)) {
    console.log(`✅ Video already present at: ${finalVideoPath}`);
  } else {
    console.warn('⚠️ No webm video file found in presentation directory.');
  }

  console.log('🎉 Automation script execution completed successfully!');
}

recordPresentation().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
