const { initFromSeed } = require('./store');
const { buildSeedData } = require('./seedData');

async function seed() {
  const seedData = buildSeedData();
  await initFromSeed(seedData);

  console.log('Seeded data/clinic-data.json with 16 collections.');
  console.log('Demo accounts (all share password: "Clinic#2026"):');
  seedData.users.forEach(u => console.log(`  ${u.username.padEnd(12)} (${u.role})`));
  if (require.main === module) {
    process.exit(0);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
