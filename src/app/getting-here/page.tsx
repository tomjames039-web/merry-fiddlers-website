import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight, Train, Bus, Navigation, TreePine, History, Car, ExternalLink, Calendar, Info } from 'lucide-react';
import Header from '@/components/Header';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Getting Here', href: '/getting-here' },
  { name: 'Contact Us', href: '/contact' },
];

export default function GettingHerePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Steam Train Image */}
      <section className="relative h-[500px] bg-gradient-to-b from-[#2d4a4a] to-[#1a2f2f]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75"
          style={{
            backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/6233_Duchess_of_Sutherland_at_Ais_Gill.jpg/1200px-6233_Duchess_of_Sutherland_at_Ais_Gill.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <div className="flex items-center justify-center gap-2 text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Getting Here</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
            Journey to The Merry Fiddlers
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8">
            Arrive by Heritage Railway, Bus, Car, or Essex Way Trail
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#transport-links"
              className="px-6 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Info className="w-5 h-5" />
              Live Transport Info
            </a>
            <a
              href="#interactive-map"
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-[#2d4a4a] text-white rounded-lg transition-all flex items-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Live Transport Updates Section */}
      <section id="transport-links" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Live Transport Information
            </h2>
            <div className="section-divider" />
            <p className="text-gray-600 mt-6 text-lg">
              Click below for real-time timetables, delays, and service updates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Epping Ongar Railway */}
            <a
              href="https://www.eorailway.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-[#2d4a4a] to-[#1a2f2f] text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <Train className="w-12 h-12 text-[#c9a55c]" />
                <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Epping Ongar Railway
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Heritage steam trains • Operating days & timetables • Plan your visit
              </p>
              <div className="inline-flex items-center gap-2 text-[#c9a55c] font-semibold text-sm">
                View Timetable <ChevronRight className="w-4 h-4" />
              </div>
            </a>

            {/* TfL Central Line */}
            <a
              href="https://tfl.gov.uk/tube/route/central/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-[#DC241F] to-[#b01d17] text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Train className="w-7 h-7 text-[#DC241F]" />
                </div>
                <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                TfL Central Line
              </h3>
              <p className="text-white/80 text-sm mb-4">
                To Epping Station • Live departure times • Service status • Journey planner
              </p>
              <div className="inline-flex items-center gap-2 text-white font-semibold text-sm">
                Check Live Departures <ChevronRight className="w-4 h-4" />
              </div>
            </a>

            {/* Local Bus Services */}
            <a
              href="https://www.essexbus.info"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <Bus className="w-12 h-12 text-white" />
                <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Local Bus Services
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Routes 31, 339, 13, 18, 20 • Real-time arrivals • Stops at our door
              </p>
              <div className="inline-flex items-center gap-2 text-white font-semibold text-sm">
                View Bus Times <ChevronRight className="w-4 h-4" />
              </div>
            </a>
          </div>

          {/* Additional Transport Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="https://www.ldwa.org.uk/ldp/members/show_path.php?path_name=Essex+Way"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#f8f6f1] border-2 border-[#c9a55c] p-6 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#2d4a4a] rounded-full flex items-center justify-center flex-shrink-0">
                  <TreePine className="w-7 h-7 text-[#c9a55c]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2d4a4a] mb-1 flex items-center gap-2">
                    Essex Way Trail
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#c9a55c]" />
                  </h3>
                  <p className="text-gray-600 text-sm">
                    81-mile walking route • Trail maps • GPX downloads • Pub sits on the route!
                  </p>
                </div>
              </div>
            </a>

            <a
              href="https://www.romfordrecorder.co.uk/news/heritage-railway-epping-ongar-9383341"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#f8f6f1] border-2 border-[#2d4a4a] p-6 rounded-lg hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#c9a55c] rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#2d4a4a] mb-1 flex items-center gap-2">
                    Special Events & Steam Days
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#2d4a4a]" />
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Santa Specials • Murder Mystery trains • 1940s weekends • Combined pub visits
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Pub History */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <History className="w-10 h-10 text-[#c9a55c]" />
            <h2 className="text-4xl text-[#2d4a4a]">Pub History & Origins</h2>
          </div>
          <div className="section-divider" />
          <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              The Merry Fiddlers inn is <strong className="text-[#2d4a4a]">extremely old</strong> – sources identify it as a
              <strong className="text-[#2d4a4a]"> 16th-century establishment</strong>. This lovely family-run pub has been serving
              the community for over 400 years, making it one of Essex&apos;s most historic watering holes.
            </p>
            <p>
              Through the 1800s and 1900s the pub remained the focal point of the tiny hamlet. The hamlet itself was historically
              known as part of Theydon Garnon parish and later the Epping Union. Its very name recalls the pub&apos;s signboard –
              <em className="text-[#c9a55c]">local lore says fiddlers&apos; gatherings once featured here</em>, giving rise to the name.
            </p>
            <div className="bg-[#f8f6f1] p-8 rounded-lg border-l-4 border-[#c9a55c]">
              <h3 className="text-2xl text-[#2d4a4a] mb-4 font-semibold">Heritage Treasures Discovered</h3>
              <p className="mb-4">Guests have uncovered fascinating relics that tell our pub&apos;s story:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>A Victorian gunpowder flask</li>
                <li>Original W.D. & H.O. Wills &quot;Wild Woodbine&quot; cigarette packs (introduced 1888)</li>
                <li>16th-century clay pipes found in our garden</li>
                <li>Old coins from various eras</li>
              </ul>
              <p className="mt-4 text-sm italic">These finds underscore the pub&apos;s remarkable age and rich history.</p>
            </div>
            <p>
              As noted by one 1887 source, The Merry Fiddlers&apos; traditional sign showed <strong>three fiddlers</strong>.
              Legend has it that annual local fiddling contests – a now-lost tradition – gave the pub its distinctive name.
            </p>
          </div>
        </div>
      </section>

      {/* Transport Links */}
      <section className="py-20 bg-[#f8f6f1]">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl text-[#2d4a4a] text-center mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            How to Get Here
          </h2>
          <div className="section-divider" />
          <p className="text-center text-gray-600 text-lg mt-6 mb-8">
            The Merry Fiddlers is unusually well-connected for a rural pub.
            Whether you&apos;re arriving by car, train, bus, or on foot, we&apos;re easy to find!
          </p>

          {/* Steam Train Feature Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://ichef.bbci.co.uk/images/ic/480xn/p0lf7jmk.jpg"
              alt="Heritage steam train running through the Essex countryside"
              className="w-full h-[400px] object-cover"
            />
            <div className="bg-gradient-to-r from-[#2d4a4a] to-[#1a2f2f] text-white p-6 text-center">
              <p className="text-lg font-semibold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                Arrive in Style on the Epping Ongar Heritage Railway
              </p>
              <p className="text-white/80 text-sm">
                Experience the romance of steam travel through the beautiful Essex countryside
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* By Train */}
            <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#c9a55c]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2d4a4a] to-[#1a2f2f] rounded-full flex items-center justify-center shadow-lg">
                  <Train className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl text-[#2d4a4a] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  By Heritage Railway
                </h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  We&apos;re accessible from{' '}
                  <a
                    href="https://www.eorailway.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c9a55c] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    North Weald Station <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  on the Epping Ongar Railway – a heritage railway running vintage steam trains through the Essex countryside.
                </p>
                <div className="bg-gradient-to-br from-[#f8f6f1] to-[#ebe9e0] p-6 rounded-lg border-l-4 border-[#c9a55c]">
                  <p className="font-bold text-[#2d4a4a] mb-3 flex items-center gap-2">
                    <span className="text-2xl">🚂</span>
                    Perfect Day Trip Itinerary:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Take the <strong>Central Line</strong> to Epping station</li>
                    <li>Hop on <strong>London Bus route 339</strong> (free with EOR rover ticket!)</li>
                    <li>Ride to North Weald station</li>
                    <li>Travel to The Merry Fiddlers in Fiddlers Hamlet</li>
                    <li>Enjoy steam trains & historic pub lunch! 🍺</li>
                  </ol>
                </div>
                <div className="flex items-center gap-2 text-sm bg-[#2d4a4a] text-white p-3 rounded">
                  <MapPin className="w-5 h-5 text-[#c9a55c]" />
                  <span><strong>Location:</strong> Fiddlers Hamlet, near North Weald Station</span>
                </div>
              </div>
            </div>

            {/* By Bus */}
            <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#4CAF50]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] rounded-full flex items-center justify-center shadow-lg">
                  <Bus className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl text-[#2d4a4a] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  By Local Bus
                </h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  Local bus services stop <strong className="text-[#2d4a4a]">right at the pub</strong>.{' '}
                  <a
                    href="https://www.essexbus.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4CAF50] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    View live timetables <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                <div className="bg-gradient-to-br from-[#f8f6f1] to-[#ebe9e0] p-6 rounded-lg space-y-3">
                  <p className="font-bold text-[#2d4a4a] mb-3">Bus Routes Serving Us:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#4CAF50] text-white px-2 py-1 rounded font-bold text-xs">31</span>
                      <span>Harlow ↔ Coopersale ↔ Epping (hourly)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#DC241F] text-white px-2 py-1 rounded font-bold text-xs">339</span>
                      <span>Epping Central ↔ North Weald (EOR heritage bus)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-600 text-white px-2 py-1 rounded font-bold text-xs">13/18/20</span>
                      <span>Additional local connections</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm bg-[#4CAF50] text-white p-3 rounded">
                  <Info className="w-5 h-5" />
                  <span><strong>Stop Name:</strong> &quot;The Merry Fiddlers&quot; – we&apos;re that famous!</span>
                </div>
              </div>
            </div>

            {/* By Car */}
            <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#2d4a4a]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2d4a4a] to-[#1a2f2f] rounded-full flex items-center justify-center shadow-lg">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl text-[#2d4a4a] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  By Car
                </h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <div className="bg-[#2d4a4a] text-white p-5 rounded-lg">
                  <p className="font-bold mb-2 text-[#c9a55c]">Our Address:</p>
                  <p className="text-lg">
                    4 Fiddlers Hamlet<br />
                    Epping CM16 7PY<br />
                    United Kingdom
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#f8f6f1] to-[#ebe9e0] p-5 rounded-lg">
                  <p className="font-bold text-[#2d4a4a] mb-2 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-[#c9a55c]" />
                    Directions:
                  </p>
                  <p className="text-sm">
                    Fiddlers Hamlet sits at the junction of <strong>Mount Road</strong> (toward Theydon Mount)
                    and <strong>Coopersale Street</strong> (north toward Ongar). These historic carriageways have
                    served travelers since the 18th century.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white border-2 border-[#c9a55c] p-3 rounded text-center">
                    <p className="font-bold text-[#2d4a4a]">Parking</p>
                    <p className="text-gray-600">Ample & Free</p>
                  </div>
                  <div className="bg-white border-2 border-[#c9a55c] p-3 rounded text-center">
                    <p className="font-bold text-[#2d4a4a]">Sat Nav</p>
                    <p className="text-gray-600">CM16 7PY</p>
                  </div>
                </div>
                <a
                  href="#interactive-map"
                  className="block w-full text-center bg-[#c9a55c] hover:bg-[#b8944b] text-white py-3 rounded-lg transition-all font-semibold"
                >
                  Get Directions on Map ↓
                </a>
              </div>
            </div>

            {/* On Foot - Essex Way */}
            <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-[#388E3C]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#388E3C] to-[#2E7D32] rounded-full flex items-center justify-center shadow-lg">
                  <TreePine className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl text-[#2d4a4a] font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                  Essex Way Walking Trail
                </h3>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  The{' '}
                  <a
                    href="https://www.ldwa.org.uk/ldp/members/show_path.php?path_name=Essex+Way"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#388E3C] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    Essex Way <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  long-distance footpath (81 miles) runs right through our area! Perfect refreshment stop for ramblers.
                </p>
                <div className="bg-gradient-to-br from-[#f8f6f1] to-[#ebe9e0] p-6 rounded-lg border-l-4 border-[#388E3C]">
                  <p className="font-bold text-[#2d4a4a] mb-3 flex items-center gap-2">
                    <span className="text-2xl">🥾</span>
                    Perfect for Ramblers:
                  </p>
                  <p className="text-sm mb-3">
                    Walk the Essex Way from Epping to Coopersale, then through Fiddlers Hamlet en route to Ongar.
                    The Merry Fiddlers sits steps off the trail!
                  </p>
                  <div className="bg-white p-3 rounded border border-[#388E3C]">
                    <p className="text-xs text-gray-600 italic">
                      <strong className="text-[#2d4a4a] not-italic">Walkers Welcome:</strong> Muddy boots are perfectly fine in our bar area.
                      Many walkers mention us as an essential stopping point on this historic trail!
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.ldwa.org.uk/ldp/members/show_path.php?path_name=Essex+Way"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#388E3C] hover:bg-[#2E7D32] text-white py-3 rounded-lg transition-all font-semibold"
                >
                  View Trail Maps & GPX Downloads
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Area & Nearby Attractions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl text-[#2d4a4a] text-center mb-4">Local Roads & Historical Trails</h2>
          <div className="section-divider" />
          <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Fiddlers Hamlet sits where old routes converged. The village lies at the junction of Mount Road
              (toward Theydon Mount) and Coopersale Street, which historically led north into Coopersale and on toward Ongar.
            </p>
            <p>
              Old maps show these roads as the main carriageways in the 18th–19th centuries. A 1777 Chapman & André map
              plots Coopersale Street running straight into Fiddlers Hamlet. Before modern bypasses, the A414 through
              Coopersale Street and this junction was the old route from Epping to Ongar.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#f8f6f1] p-6 rounded-lg">
                <h3 className="text-xl text-[#2d4a4a] font-semibold mb-3">Did You Know?</h3>
                <p className="text-sm">
                  Winston Churchill was vice-president of the old Epping Golf Club, whose original course lay nearby.
                  Imagine – Churchill may have had a pint near here!
                </p>
              </div>
              <div className="bg-[#f8f6f1] p-6 rounded-lg">
                <h3 className="text-xl text-[#2d4a4a] font-semibold mb-3">War Stories & Legends</h3>
                <p className="text-sm">
                  Local lore claims German soldiers once hid in our chimney during WW2. While unverified,
                  it speaks to the building&apos;s age and the tales these walls could tell!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="interactive-map" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl mb-8">
          <h2 className="text-4xl text-[#2d4a4a] text-center mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Interactive Map & Directions
          </h2>
          <div className="section-divider" />
          <p className="text-center text-gray-600 text-lg mt-6 mb-8">
            Click &quot;Directions&quot; in the map to get turn-by-turn navigation from your location
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=The+Merry+Fiddlers,4+Fiddlers+Hamlet,Epping+CM16+7PY"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#4285F4] text-white p-4 rounded-lg text-center hover:bg-[#3367D6] transition-all group"
            >
              <Navigation className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold">Get Directions</p>
              <p className="text-xs text-white/80">From your location</p>
            </a>
            <a
              href="https://www.google.com/maps/place/The+Merry+Fiddlers/@51.7153,0.0834,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c9a55c] text-white p-4 rounded-lg text-center hover:bg-[#b8944b] transition-all group"
            >
              <MapPin className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold">View in Google Maps</p>
              <p className="text-xs text-white/80">Street view available</p>
            </a>
            <a
              href="https://www.google.com/maps/search/parking+near+The+Merry+Fiddlers,Fiddlers+Hamlet,Epping"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2d4a4a] text-white p-4 rounded-lg text-center hover:bg-[#1a2f2f] transition-all group"
            >
              <Car className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition" />
              <p className="font-semibold">Parking Info</p>
              <p className="text-xs text-white/80">Free on-site parking</p>
            </a>
          </div>
        </div>
        <div className="h-[600px] shadow-2xl rounded-lg overflow-hidden max-w-7xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2471.860756683993!2d0.08157231571914784!3d51.71530097967267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a6d8a1234567%3A0x1234567890abcdef!2sThe%20Merry%20Fiddlers!5e0!3m2!1sen!2suk!4v1234567890&zoom=15"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="The Merry Fiddlers Location - Interactive Map"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 teal-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">Ready to Visit?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re arriving by heritage railway, local bus, car, or on foot along the Essex Way,
            we can&apos;t wait to welcome you to one of Essex&apos;s oldest and most beloved pubs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.sevenrooms.com/reservations/themerryfiddlers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Book A Table
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#2d4a4a] transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="teal-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <img src="/logo.png" alt="The Merry Fiddlers" className="h-16 w-auto mb-4" />
              <p className="text-white/70 text-sm">Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.</p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                <Clock className="w-5 h-5 text-[#c9a55c]" />
                Opening Hours
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex justify-between"><span>Monday - Tuesday</span><span className="text-red-400">Closed</span></li>
                <li className="flex justify-between"><span>Wednesday - Saturday</span><span className="text-white">12:00 - 00:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="text-white">12:00 - 20:00</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Contact Us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-white/70">
                  <Phone className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="tel:+441992572142" className="hover:text-white">+44 1992 572142</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <Mail className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="mailto:info@themerryfiddlers.co.uk" className="hover:text-white">info@themerryfiddlers.co.uk</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">{item.name}</a>
                    ) : (
                      <Link href={item.href} className="text-white/70 hover:text-white">{item.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} The Merry Fiddlers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
