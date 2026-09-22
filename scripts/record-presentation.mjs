import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recordPresentation() {
  const rootDir = path.resolve(__dirname, '..');
  const screenshotsDir = path.join(rootDir, 'public', 'screenshots');
  const presentationDir = path.join(rootDir, 'public', 'presentation');
  const voiceoverPath = path.join(presentationDir, 'presentation-voice.mp3');
  const finalVideoPath = path.join(presentationDir, 'gridaegis-presentation-walkthrough.webm');
  const finalMp4Path = path.join(presentationDir, 'gridaegis-final-presentation.mp4');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  if (!fs.existsSync(presentationDir)) {
    fs.mkdirSync(presentationDir, { recursive: true });
  }

  // Ensure voiceover is generated
  if (!fs.existsSync(voiceoverPath)) {
    console.log('🎙️ Generating AI voiceover with edge-tts ...');
    execSync('python scripts/generate_voiceover.py', { cwd: rootDir, stdio: 'inherit' });
  }

  // Clean old raw webm files
  const existingFiles = fs.readdirSync(presentationDir);
  for (const file of existingFiles) {
    if (file.endsWith('.webm') && file !== 'gridaegis-presentation-walkthrough.webm') {
      try {
        fs.unlinkSync(path.join(presentationDir, file));
      } catch (e) {}
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

  // [0:00 - 0:14.5] Overview & Telemetry (Narrating Sentence 1)
  console.log('📸 [Step 1] Overview & Telemetry (14.8% energy burden)...');
  await page.waitForTimeout(2000);
  const screenshot1 = path.join(screenshotsDir, '01-overview-telemetry.png');
  await page.screenshot({ path: screenshot1 });
  console.log(`Saved: ${screenshot1}`);
  await page.waitForTimeout(12500); // Complete sentence 1 timing (~14.5s)

  // [0:14.5 - 0:29.0] Spatial GIS & Policy Simulator (Narrating Sentence 2)
  console.log('📸 [Step 2] Spatial GIS & Policy Simulator...');
  const gisTab = page.locator('button:has-text("Spatial GIS Energy Burden")');
  await gisTab.click();
  await page.waitForTimeout(2000);

  // Toggle "+15% Tree Canopy & Solar Policy Simulator"
  const policyToggle = page.locator('button:has-text("Engage Policy Simulation"), button:has-text("Policy Active")').first();
  await policyToggle.click();
  await page.waitForTimeout(2000);
  const screenshot2 = path.join(screenshotsDir, '02-gis-policy-simulator.png');
  await page.screenshot({ path: screenshot2 });
  console.log(`Saved: ${screenshot2}`);
  await page.waitForTimeout(10500); // Complete sentence 2 timing (~14.5s)

  // [0:29.0 - 0:43.0] Karst-Grid DAG Simulator & Microgrid (Narrating Sentence 3)
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
  await page.waitForTimeout(2000);
  const screenshot3 = path.join(screenshotsDir, '03-karst-dag-cascade.png');
  await page.screenshot({ path: screenshot3 });
  console.log(`Saved: ${screenshot3}`);
  await page.waitForTimeout(2500);

  // Microgrid Solver
  console.log('📸 [Step 4] 72h Shelter Islanding Solver...');
  const microgridTab = page.locator('button:has-text("72h Shelter Islanding")');
  await microgridTab.click();
  await page.waitForTimeout(2000);
  const screenshot4 = path.join(screenshotsDir, '04-microgrid-72h-dispatch.png');
  await page.screenshot({ path: screenshot4 });
  console.log(`Saved: ${screenshot4}`);
  await page.waitForTimeout(5000); // Complete sentence 3 timing (~14s)

  // [0:43.0 - 0:58.5] Multimodal Gemini & Voice Triage (Narrating Sentence 4)
  console.log('📸 [Step 5] Multimodal Gemini & LIHEAP Auditor with Voice Triage...');
  const geminiTab = page.locator('button:has-text("Gemini Utility & LIHEAP Auditor")');
  await geminiTab.click();
  await page.waitForTimeout(1500);

  // Run audit
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
    await speechBtn.click({ timeout: 2000 });
  } catch (err) {}

  await page.waitForTimeout(2000);
  const screenshot5 = path.join(screenshotsDir, '05-gemini-liheap-auditor.png');
  await page.screenshot({ path: screenshot5 });
  console.log(`Saved: ${screenshot5}`);
  await page.waitForTimeout(8500); // Complete sentence 4 timing (~15.5s)

  // [0:58.5 - 0:72.5] Offline Pass & Outro (Narrating Sentence 5)
  console.log('📸 [Step 6] Offline Shelter Pass Modal...');
  const shelterPassBtn = page.locator('header button:has-text("Offline Shelter Pass")');
  await shelterPassBtn.click();
  await page.waitForTimeout(2000);
  const screenshot6 = path.join(screenshotsDir, '06-offline-shelter-pass.png');
  await page.screenshot({ path: screenshot6 });
  console.log(`Saved: ${screenshot6}`);
  await page.waitForTimeout(12000); // Complete sentence 5 timing (~14s)

  // Finish video writing
  console.log('🎬 Finalizing video capture and closing context...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video and rename to gridaegis-presentation-walkthrough.webm
  const videoFiles = fs.readdirSync(presentationDir).filter(f => f.endsWith('.webm') && f !== 'gridaegis-presentation-walkthrough.webm');
  if (videoFiles.length > 0) {
    const rawVideoPath = path.join(presentationDir, videoFiles[0]);
    if (fs.existsSync(finalVideoPath)) {
      fs.unlinkSync(finalVideoPath);
    }
    fs.renameSync(rawVideoPath, finalVideoPath);
    console.log(`✅ WebM walkthrough saved to: ${finalVideoPath}`);
  }

  // Merge with ffmpeg into gridaegis-final-presentation.mp4 with synchronized audio
  console.log('🎞️ Merging WebM video with AI Voiceover track using FFmpeg...');
  let ffmpegBin = 'ffmpeg';
  try {
    ffmpegBin = (await import('ffmpeg-static')).default;
  } catch (e) {
    console.log('Using global ffmpeg fallback');
  }

  const ffmpegCmd = `"${ffmpegBin}" -y -i "${finalVideoPath}" -i "${voiceoverPath}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p -c:a aac -b:a 192k "${finalMp4Path}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log(`🎉 Successfully created Final Presentation Video: ${finalMp4Path}`);
}

recordPresentation().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
