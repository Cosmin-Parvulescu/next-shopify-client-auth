import Cryptool from './cryptool';

test('Decrypting encrypted string works', () => {
  const cryptool = new Cryptool('ENCRYPTION KEY 🚀');

  const plaintext = 'The cake is a lie';
  const encrypted = cryptool.encrypt(plaintext);
  const decrypted = cryptool.decrypt(encrypted);

  expect(decrypted).toBe(plaintext);
});

test('Encrypting at least changes form', () => {
  const cryptool = new Cryptool('ENCRYPTION KEY 🚀');

  const plaintext = 'The cake is a lie';
  const encrypted = cryptool.encrypt(plaintext);

  expect(encrypted).not.toBe(plaintext);
});

test('Throws exception if IV is not present in key', () => {
  const cryptool = new Cryptool('ENCRYPTION KEY 🚀');

  const plaintext = 'The cake is a lie';
  const encrypted = cryptool.encrypt(plaintext);

  const noIV = encrypted.split('|')[0];

  expect(() => cryptool.decrypt(noIV)).toThrow();
});
