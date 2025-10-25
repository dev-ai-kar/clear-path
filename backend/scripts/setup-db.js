const { execSync } = require('child_process');

const dbName = 'form_submissions';
const tableName = 'submissions';
const containerName = 'some-postgres';
const user = 'postgres';

console.log('Setting up the database...');

try {
  // Check if the database already exists
  const dbExists = execSync(`docker exec ${containerName} psql -U ${user} -lqt | cut -d \\| -f 1 | grep -qw ${dbName}`, { encoding: 'utf-8' });
  if (dbExists.trim() === dbName) {
    console.log(`Database "${dbName}" already exists. Skipping creation.`);
  }
} catch (error) {
  // If grep returns a non-zero exit code, the database doesn't exist, so we create it.
  console.log(`Database "${dbName}" not found. Creating...`);
  execSync(`docker exec ${containerName} createdb -U ${user} ${dbName}`);
  console.log(`Database "${dbName}" created successfully.`);
}

console.log(`Creating table "${tableName}"...`);
const createTableCommand = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

execSync(`docker exec ${containerName} psql -U ${user} -d ${dbName} -c "${createTableCommand}"`);

console.log(`Table "${tableName}" created successfully.`);
console.log('Database setup complete.');
