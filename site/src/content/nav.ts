// Section ids shared by the index box and the sections themselves, in page order. Page labels are decorative (A3 is reserved for "Continued on A3").
export const navItems = [
  { id: 'intro', label: 'About', page: 'A2' },
  { id: 'files', label: 'Case files', page: 'A4' },
  { id: 'bureaus', label: 'Bureaus', page: 'A5' },
  { id: 'classifieds', label: 'Classifieds', page: 'B1' },
  { id: 'contact', label: 'Letters', page: 'B2' },
] as const;
