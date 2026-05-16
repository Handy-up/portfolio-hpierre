const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const configPath = path.join(rootDir, 'config.js');

function parseEnv(content) {
  return content.split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return env;

    const separator = trimmed.indexOf('=');
    if (separator === -1) return env;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
    return env;
  }, {});
}

if (!fs.existsSync(envPath)) {
  console.error('Missing .env file. Copy .env.example to .env and fill EmailJS values.');
  process.exit(1);
}

const env = parseEnv(fs.readFileSync(envPath, 'utf8'));
const requiredKeys = ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY'];
const missingKeys = requiredKeys.filter(key => !env[key]);

if (missingKeys.length) {
  console.error(`Missing required env values: ${missingKeys.join(', ')}`);
  process.exit(1);
}

const config = `/* Generated from .env. Do not edit or commit this file. */
window.EMAILJS_CONFIG = ${JSON.stringify({
  serviceId: env.EMAILJS_SERVICE_ID,
  templateId: env.EMAILJS_TEMPLATE_ID,
  publicKey: env.EMAILJS_PUBLIC_KEY,
}, null, 2)};

window.SCHEDULING_CONFIG = ${JSON.stringify({
  bookingUrl: env.GOOGLE_CALENDAR_BOOKING_URL || '',
  availabilityFr: env.BOOKING_AVAILABILITY_FR || '',
  availabilityEn: env.BOOKING_AVAILABILITY_EN || '',
}, null, 2)};
`;

fs.writeFileSync(configPath, config);
console.log('Generated config.js from .env');
