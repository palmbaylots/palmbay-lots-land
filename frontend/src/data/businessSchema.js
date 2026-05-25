// Shared business identity for all JSON-LD schemas
// Update once here when business info changes.

export const BUSINESS = {
  name: 'Palm Bay Lots-Land',
  legalName: 'M. David Moallem, Inc.',
  agent: 'Vahid Reza Rajabian',
  url: 'https://palmbaylots-land.com',
  telephone: '321-333-7230',
  email: 'vahid@palmbayland.com',
  license: 'BK3454072',
  founded: '2003',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1663 Georgia St NE Suite 700',
    addressLocality: 'Palm Bay',
    addressRegion: 'FL',
    postalCode: '32907',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.0345,
    longitude: -80.5887,
  },
  logo: 'https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png',
  image: 'https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png',
  sameAs: [
    'https://www.crexi.com/properties?searchBrokerId=fca17317-df0a-4445-9f8e-f6e05efc6cb8',
  ],
};

// Today's date in YYYY-MM-DD for dateModified fields.
// Recomputed on every render so AI crawlers always see fresh data.
export const todayISO = () => new Date().toISOString().split('T')[0];

// Common Organization + LocalBusiness + RealEstateAgent triple for the homepage.
export const homepageSchemaGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BUSINESS.url}/#organization`,
      name: BUSINESS.name,
      legalName: BUSINESS.legalName,
      url: BUSINESS.url,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      logo: BUSINESS.logo,
      foundingDate: BUSINESS.founded,
      address: BUSINESS.address,
      sameAs: BUSINESS.sameAs,
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS.url}/#localbusiness`,
      name: BUSINESS.name,
      url: BUSINESS.url,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      image: BUSINESS.image,
      address: BUSINESS.address,
      geo: BUSINESS.geo,
      priceRange: '$$',
      areaServed: ['Palm Bay, FL', 'Brevard County, FL', 'Melbourne, FL'],
      openingHours: 'Mo-Sa 09:00-18:00',
    },
    {
      '@type': 'RealEstateAgent',
      '@id': `${BUSINESS.url}/#agent`,
      name: BUSINESS.agent,
      worksFor: { '@id': `${BUSINESS.url}/#organization` },
      url: BUSINESS.url,
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      image: BUSINESS.image,
      address: BUSINESS.address,
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'license',
        recognizedBy: { '@type': 'GovernmentOrganization', name: 'Florida Department of Business and Professional Regulation' },
        identifier: BUSINESS.license,
      },
      knowsAbout: [
        'Palm Bay residential lots',
        'Palm Bay commercial real estate',
        'Owner financing land Florida',
        'Brevard County land brokerage',
      ],
    },
  ],
});
