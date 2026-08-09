// Central place for owner facts referenced across pages/components.
// Fields marked TODO are intentionally unfilled — see README.md.

export const site = {
  name: 'Aayush Shrestha',
  role: 'Security Consultant — Penetration Testing & GRC',
  location: 'Kathmandu, Nepal', // TODO: confirm — inferred from education, not explicitly supplied
  status: 'BSc (Hons) Ethical Hacking and Cybersecurity — Final Year',
  email: 'www.aayushng@gmail.com',
  github: 'https://github.com/potatoaimer44',
  linkedin: 'https://www.linkedin.com/in/aayush-shrestha-3379aa165/',
  cvPath: '/cv.pdf',
  pgpFingerprint: '', // TODO: add PGP key fingerprint if you publish one
  pgpKeyPath: '/pgp-key.txt', // TODO: drop your public key export here if used
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'Experience', href: '/experience/' },
  { label: 'About', href: '/about/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'Contact', href: '/contact/' },
] as const;
