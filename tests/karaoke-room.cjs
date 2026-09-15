const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto('http://127.0.0.1:8085');

    // 1. Verify Entry Card exists on Home screen
    const entry = p.locator('.karaoke-room-entry');
    assert.equal(await entry.count(), 1, 'Karaoke entry card should exist on home screen');
    assert(await entry.isVisible(), 'Karaoke entry card should be visible on home screen');

    // 2. Click to open Karaoke Modal Room
    await p.locator('#openKaraokeRoom').click();
    const modal = p.locator('#karaokeModalRoom');
    assert(await modal.evaluate(e => e.open), 'Karaoke modal should be open');

    // 3. Verify song tabs count and initial song
    const songChips = p.locator('.karaoke-song-chip');
    assert.equal(await songChips.count(), 6, 'Should have 6 songs in karaoke room');

    // 4. Verify Lyrics track has syllables
    const syllables = p.locator('#karaokeRoomLyricsTrack .k-syllable');
    assert((await syllables.count()) > 0, 'Lyrics track should have syllables rendered');

    // 5. Test Song Switch (e.g. click song 3: 찔레꽃)
    await songChips.nth(3).click();
    assert.match(await p.locator('#karaokeRoomSongTitle').innerText(), /찔레꽃/);

    await p.evaluate(() => window.KaraokeEngine.stopKaraoke());
    // 6. Test Play Toggle
    await p.locator('#btnKaraokeRoomPlay').click();
    const isPlaying = await p.evaluate(() => window.KaraokeEngine.isPlaying);
    assert(isPlaying, 'Karaoke should be playing');

    // 7. Test Instrument buttons (Clap, Tambourine, Dance)
    await p.locator('#btnKaraokeRoomClap').click();
    await p.locator('#btnKaraokeRoomTambourine').click();
    await p.locator('#btnKaraokeRoomDance').click();

    // 8. Test Sing with AI
    await p.locator('#btnKaraokeRoomSingAi').click();

    // 9. Exit room and verify stopped
    await p.locator('#closeKaraokeRoom').click();
    assert.equal(await modal.evaluate(e => e.open), false, 'Modal should be closed');
    const stopped = await p.evaluate(() => !window.KaraokeEngine.isPlaying);
    assert(stopped, 'Karaoke should stop on modal exit');

    // 10. Check responsive mobile layout
    await p.locator('#openKaraokeRoom').click();
    await p.setViewportSize({ width: 390, height: 844 });
    const fitsMobile = await modal.evaluate(e => e.scrollWidth <= e.clientWidth + 5);
    assert(fitsMobile, 'Karaoke modal should fit mobile viewport width without overflow');

    // Capture screenshot for visual confirmation
    await p.screenshot({ path: 'tests/karaoke-room-mobile.png' });
    await p.setViewportSize({ width: 1280, height: 900 });
    await p.screenshot({ path: 'tests/karaoke-room-desktop.png' });

    console.log('PASS: Karaoke Room entry, dialog, 6 songs, audio play, instruments, AI singing, and responsive views verified successfully.');
  } finally {
    await b.close();
  }
})().catch(e => {
  console.error(e);
  process.exit(1);
});

