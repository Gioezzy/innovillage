const dns = require('node:dns');

// 1. Force IPv4 First
try {
  dns.setDefaultResultOrder('ipv4first');
  console.log("✅ DNS Configured: IPv4 First");
} catch (e) {
  console.log("⚠️ Could not set DNS order:", e.message);
}

const URL = 'https://gioezzy-fast-api.hf.space';

async function testConnection() {
  console.log(`Testing connection to: ${URL} ...`);
  console.log("Node Version:", process.version);
  
  const start = Date.now();
  
  try {
    // Test GET (Connectivity Check)
    const res = await fetch(URL, {
        method: 'GET',
        headers: { 'User-Agent': 'Test-Script' },
        cache: 'no-store'
    });
    
    // 405 is expected for GET on this endpoint, identifying success
    console.log(`\n🎉 SUCCESS!`);
    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log(`Time: ${Date.now() - start}ms`);
    
  } catch (error) {
    console.error(`\n❌ FAILED!`);
    console.error(`Time: ${Date.now() - start}ms`);
    console.error(`Error:`, error.cause || error);
    
    if (error.cause?.code === 'ETIMEDOUT') {
      console.log("\n💡 DIAGNOSIS: Network Timeout.");
      console.log("Possible causes:");
      console.log("- Provider blocking non-standard traffic");
      console.log("- IPv6 High Priority failing (Happy Eyeballs)");
      console.log("- Firewall / VPN interference");
    }
  }
}

testConnection();
