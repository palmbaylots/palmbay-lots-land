import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Inventory from "./pages/Inventory";
import Properties from "./pages/Properties";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PropertyAdminDemo from "./pages/PropertyAdminDemo";
import CrexiListings from "./pages/CrexiListings";
import FlagshipListing from "./pages/FlagshipListing";
import FlagshipScatteredLots from "./pages/FlagshipScatteredLots";
import FlagshipFlemingAve from "./pages/FlagshipFlemingAve";
import SellLand from "./pages/SellLand";
import ProtectedAdmin from "./components/ProtectedAdmin";
import ChatWidget from "./components/ChatWidget";
import { Toaster } from "./components/ui/sonner";
import LeadCaptureModal from "./components/LeadCaptureModal";
// Individual Property Pages
import PropertyDetail from "./pages/PropertyDetail";
// SEO Landing Pages
import PalmBayLandForSale from "./pages/seo/PalmBayLandForSale";
import OwnerFinancingLand from "./pages/seo/OwnerFinancingLand";
import QuarterAcreLots from "./pages/seo/QuarterAcreLots";
import BuildableLots from "./pages/seo/BuildableLots";
// Blog
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
// Authority Guide Pages
import BuildOnLandGuide from "./pages/guides/BuildOnLandGuide";
import SepticVsSewerGuide from "./pages/guides/SepticVsSewerGuide";
import OwnerFinancingWatchGuide from "./pages/guides/OwnerFinancingWatchGuide";
import BuyWithoutRealtorGuide from "./pages/guides/BuyWithoutRealtorGuide";
import FloodZonesGuide from "./pages/guides/FloodZonesGuide";
import NotFound from "./pages/NotFound";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Property Admin Demo - No Header/Footer */}
            <Route path="/property-admin-demo" element={<PropertyAdminDemo />} />
            
            {/* Regular pages with Header/Footer */}
            <Route path="/*" element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/price-guide" element={<Properties />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/listings" element={<CrexiListings />} />
                  <Route path="/listing/328-malabar-rd" element={<FlagshipListing />} />
                  <Route path="/listing/scattered-lots" element={<FlagshipScatteredLots />} />
                  <Route path="/listing/2418-fleming-ave" element={<FlagshipFlemingAve />} />
                  <Route path="/sell-land" element={<SellLand />} />
                  <Route path="/admin" element={<ProtectedAdmin />} />
                  {/* Individual Property Pages - SEO Gold */}
                  <Route path="/property/:slug" element={<PropertyDetail />} />
                  {/* SEO Landing Pages */}
                  <Route path="/palm-bay-land-for-sale" element={<PalmBayLandForSale />} />
                  <Route path="/owner-financing-land-florida" element={<OwnerFinancingLand />} />
                  <Route path="/quarter-acre-lots-palm-bay" element={<QuarterAcreLots />} />
                  <Route path="/buildable-lots-palm-bay" element={<BuildableLots />} />
                  {/* Blog */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  {/* Authority Guide Pages */}
                  <Route path="/guide/build-on-land-palm-bay" element={<BuildOnLandGuide />} />
                  <Route path="/guide/septic-vs-sewer-palm-bay" element={<SepticVsSewerGuide />} />
                  <Route path="/guide/owner-financing-what-to-watch" element={<OwnerFinancingWatchGuide />} />
                  <Route path="/guide/buy-land-without-realtor" element={<BuyWithoutRealtorGuide />} />
                  <Route path="/guide/flood-zones-palm-bay" element={<FloodZonesGuide />} />
                  {/* Catch-all 404 — must be the LAST route. Renders NotFound with noindex meta
                      so unknown URLs (mistyped, stale, hallucinated) never get indexed as duplicates. */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
                <LeadCaptureModal />
                <ChatWidget />
              </>
            } />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
