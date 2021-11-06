require('../src/db/mongoose')
const User = require('../src/models/user')

User.create([
    { name: 'test', email: 'test@google.com', password: 'teajgdsagghhrfhe' },
    { name: 'test', email: 'test@google.com', password: 'teajgdsagghhrfhe' }
  ]);
  
  const doc = new User({ name: 'test2', email: 'test@google.com', password: 'teajgddsge' });
  // Throws `MongoError: E11000 duplicate key error collection...`
doc.save();
