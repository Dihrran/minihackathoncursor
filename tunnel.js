const localtunnel = require('localtunnel');

const PORT = process.env.PORT || 3000;
const SUBDOMAIN = process.env.TUNNEL_SUBDOMAIN || undefined;
const TIMEOUT_MS = 30000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s — check your internet connection`)), ms);
    }),
  ]);
}

(async () => {
  try {
    const tunnel = await withTimeout(
      localtunnel({ port: Number(PORT), subdomain: SUBDOMAIN }),
      TIMEOUT_MS
    );

    console.log('\n✅ UniGuide is publicly accessible at:\n');
    console.log(`   ${tunnel.url}\n`);
    console.log('Share this link with anyone, on any network.');
    console.log('Keep this terminal open while sharing.');
    console.log('Press Ctrl+C to stop the tunnel.\n');
    console.log(`Forwarding to http://localhost:${PORT}`);
    console.log('\nNote: First-time visitors may see a loca.lt warning page — click "Click to Continue".\n');

    tunnel.on('close', () => {
      console.log('Tunnel closed.');
      process.exit(0);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err.message);
    console.error('\n1. Make sure the app is running:  npm start');
    console.error('2. Then in a second terminal run:  npm run tunnel');
    process.exit(1);
  }
})();
