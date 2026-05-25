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
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        bestRating: '5',
        worstRating: '1',
        reviewCount: '6',
      },
      review: [
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Verified Client (Land Seller)' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'When I first decided that I wanted to sell my land, other realtors were encouraging me to list for less than half the price of what my lot was worth. After I met Vahid he told me he would be able to sell my land at the real market value. He was patient, thorough and helpful. I highly recommend Vahid because he is honest and reliable.',
          publisher: { '@type': 'Organization', name: 'RateMyAgent' },
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Verified Client (Lot Buyer)' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Vahid is phenomenal. He is accessible and extremely patient. My experience overall is top rated. Vahid is an absolute pleasure to work with.',
          publisher: { '@type': 'Organization', name: 'RateMyAgent' },
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Verified Client (Lot Buyer)' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Exceptional customer service and precise, detailed information. Vahid offered us plot plans precisely laid out and manually numbered each to maximize our time. We purchased our lot the exact same day.',
          publisher: { '@type': 'Organization', name: 'RateMyAgent' },
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Verified Client (Veteran Homebuyer)' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Very professional and very honest. Thank you for an amazing experience. My family and friends now have the space to gather and participate in outdoor activities for generations to come.',
          publisher: { '@type': 'Organization', name: 'RateMyAgent' },
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Verified Client (Buyer)' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Vahid was extremely professional and always available to answer any questions. His many years of experience in Palm Bay were evident — he knows the market exceptionally well and has strong connections throughout the area.',
          publisher: { '@type': 'Organization', name: 'RateMyAgent' },
        },
        {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Verified Client (Buyer)' },
          reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
          reviewBody: 'Very transparent and professional.',
          publisher: { '@type': 'Organization', name: 'RateMyAgent' },
        },
      ],
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
