// Every business fact used on the site lives here. Change it here only.
export const SITE = {
  name: 'Sunshine Built',
  legalName: 'M.J. Croft Pty Ltd ATF The Croft Trust',
  licence: 'QBCC Licence 15205110',
  licenceNumber: '15205110',
  licenceClass: 'Builder – Low Rise',
  abn: '40 270 427 080',
  phone: '0401 744 844',
  phoneHref: 'tel:0401744844',
  phoneIntl: '+61401744844',
  email: 'info@sunshinebuilt.com.au',
  locality: 'Noosaville',
  region: 'QLD',
  serviceArea: 'Noosa and the Sunshine Coast',
  url: 'https://www.sunshinebuilt.com.au',
  // Wording rules (CLAUDE.md): only strengthen once Mitch confirms.
  experience: 'On the tools since 2004',
  insurance: 'QBCC licensed and insured',
} as const;

export const SERVICES = [
  { slug: 'renovations-extensions', name: 'Renovations & extensions', short: 'Kitchens, bathrooms, room additions and extensions.' },
  { slug: 'insurance-repairs', name: 'Insurance repairs', short: 'Storm, water and fire damage, from making safe to handover.' },
  { slug: 'shop-fit-outs', name: 'Shop fit-outs', short: 'Retail and commercial fit-outs.' },
  { slug: 'carpentry-decks', name: 'Carpentry & decks', short: 'Decks, stairs, pergolas, screens and finish carpentry.' },
  { slug: 'saunas', name: 'Saunas', short: 'Custom cedar saunas we design and build.' },
  { slug: 'new-homes', name: 'New homes', short: 'New home builds.', stub: true },
] as const;
