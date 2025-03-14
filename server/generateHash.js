// generateHash.js
import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'tt12345'; // The plaintext password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

generateHash();
