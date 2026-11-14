export const site = {
  name: 'Raman Lamba',
  tagline: 'Software for financial decisions',
  location: 'Hyderabad',
  availability: 'Open for freelance & full-time roles',
  volume: 'Vol. I, No. 1',
  // The strip under the nameplate, left to right. Light-hearted, but every line points at something real on the page.
  edition: ['Late edition', 'Forecast: probabilistic, uncertainty shown', 'Price: one email'],
  email: 'ramanlamba2022@gmail.com',
  linkedin: 'https://www.linkedin.com/in/raman-lamba/',
  github: 'https://github.com/Raman-Lamba',
  photo: '/images/raman.jpg',
  // Halftone version of the portrait, generated from the photo for the printed look.
  portrait: { src: '/images/raman-engraved.png', width: 600, height: 857 },
  resumePdf: '/resume/RamanLamba_Resume_Fintech.pdf',
} as const;
