var Spacecast3D = Spacecast3D || {}

// constants
Spacecast3D.EARTH_DIAMETER = 1, // earth diameter
Spacecast3D.SPACECAST3D_MILE = Spacecast3D.EARTH_DIAMETER / 7917, // 1 mile
Spacecast3D.SPACECAST3D_AU = Spacecast3D.EARTH_DIAMETER * 11740,   // 1 astronomical unit
Spacecast3D.SPACECAST3D_LY = Spacecast3D.SPACECAST3D_AU * 63241,   // 1 light year
Spacecast3D.MILKY_WAY_RADIUS = Spacecast3D.SPACECAST3D_LY * 100000, // 100k light year

Spacecast3D.Utils = {
  // convert light year to earth diameter (spacecast basic unit of distance)
  dis: function(n) {
    return n * Spacecast3D.SPACECAST3D_LY
  },

  // calculate ascention in radians
  asc: function(h, m, s) {
    var hDeg = h * 360 / 24
    var mDeg = m * 30 / 60
    var sDeg = s * .5 / 60
    var degrees = hDeg + mDeg + sDeg
    return degrees * (Math.PI/180) // convert degrees to radians
  },

  // calculate declination in radians
  dec: function(d, m, s, isNegative) {
    var degrees = d + (m / 60) + (s / 3600)
    if (isNegative) {
      degrees = 90 + degrees
    } else {
      degrees = 90 - degrees
    }
    return degrees * (Math.PI/180) // convert degrees to radians
  },

  // find next closest power of 2 of a number
  nearestPow2: function(number){
    return Math.pow(2, Math.ceil(Math.log(number) / Math.log(2)))
  },

}

Spacecast3D.Setup = {
  cameraSettings: [
    70,   // field of view
    document.getElementById("explorer-view-content").offsetWidth/document.getElementById("explorer-view-content").offsetHeight, // aspect ratio
    Spacecast3D.EARTH_DIAMETER/10, // near plane
    Spacecast3D.MILKY_WAY_RADIUS*2, // far plane
  ],
  cameraPosition: [
    Spacecast3D.SPACECAST3D_AU*50, // distance from the origin
    1.3, // polar angle from the y (up) axis
    4.6, // equator angle around the y (up)
  ],
  controls: {
    enablePan: false,
    enableZoom: true,
    minDistance: Spacecast3D.EARTH_DIAMETER, // closest that the camera can zoom in
    maxDistance: Spacecast3D.MILKY_WAY_RADIUS/10, // farthest that the camera can zoom out
  },
  solarSystem: {
    sun: {
      radius: 432169 * Spacecast3D.SPACECAST3D_MILE,
    },
    mercury: {
      radius: 1516 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 0.387 * Spacecast3D.SPACECAST3D_AU,
    },
    venus: {
      radius: 1516 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 0.723 * Spacecast3D.SPACECAST3D_AU,
    },
    earth: {
      radius: Spacecast3D.EARTH_DIAMETER/2,
      orbitRadius: Spacecast3D.SPACECAST3D_AU,
    },
    mars: {
      radius: 2106 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 1.524 * Spacecast3D.SPACECAST3D_AU,
    },
    jupiter: {
      radius: 43441 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 5.203 * Spacecast3D.SPACECAST3D_AU,
    },
    saturn: {
      radius: 36184 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 9.539 * Spacecast3D.SPACECAST3D_AU,
    },
    uranus: {
      radius: 15759 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 19.18 * Spacecast3D.SPACECAST3D_AU,
    },
    neptune: {
      radius: 15299 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 30.06 * Spacecast3D.SPACECAST3D_AU,
    },
  },
  milkyWayRadius: Spacecast3D.MILKY_WAY_RADIUS,
  renderer: {
    width: document.getElementById("explorer-view-content").offsetWidth,
    height: document.getElementById("explorer-view-content").offsetHeight,
    containerId: 'spacecast3d',
  },
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  starsLabel: {
    fontFace: 'Arial',
    fontSize: 128,
    baseColor: 'rgba(255,255,0,1)',
    activeColor: 'rgba(0,255,255,1)',
  },
  // see: https://en.wikipedia.org/wiki/List_of_nearest_stars_and_brown_dwarfs
  nearestStars: {
    'Alpha Centauri': {
      descriptionSource: "https://en.wikipedia.org/wiki/Alpha_Centauri",
      description: 'Alpha Centauri is the nearest star to the Solar System. It is actually three stars locked in orbit, called Alpha Centauri A, B, and C. Alpha Centauri C is a red dwarf, much dimmer than the other two. A and B make Alpha Centauri the brightest star in the Centaurus constellation.',
      dis: Spacecast3D.Utils.dis(4.2421), // distance: 4.2421 light-years
      asc: Spacecast3D.Utils.asc(14, 29, 43), // right ascension: 14h 29m 43.0s
      dec: Spacecast3D.Utils.dec(62, 40, 46, true), // declination: −62° 40′ 46″
    },
    'Barnard': {
      descriptionSource: "https://en.wikipedia.org/wiki/Barnard%27s_Star",
      description: 'Barnard is a small red dwarf star in the constellation Ophiuchus. It is too dim to be seen with the naked eye.',
      dis: Spacecast3D.Utils.dis(5.9630), // distance: 5.9630 light-years
      asc: Spacecast3D.Utils.asc(17, 29, 43), // right ascension: 17h 57m 48.5s
      dec: Spacecast3D.Utils.dec(4, 41, 36), // declination: +04° 41′ 36″
    },
    'Luhman 16': {
      descriptionSource: "https://en.wikipedia.org/wiki/Luhman_16",
      description: 'Luhman 16 is not really a star at all, but a pair of orbiting brown dwarfs. These bodies are too small to be stars, but each one is still about thirty times the mass of Jupiter.',
      dis: Spacecast3D.Utils.dis(6.59), // distance: 6.59 light-years
      asc: Spacecast3D.Utils.asc(10, 49, 15.57), // right ascension: 10h 49m 15.57s
      dec: Spacecast3D.Utils.dec(53, 29, 06), // declination: 10h 49m 15.57s
    },
    'Wolf 359': {
      descriptionSource: "https://en.wikipedia.org/wiki/Wolf_359",
      description: 'Wolf 359 is a red dwarf in the constellation Leo. It is invisible to the naked eye, being one of the faintest stars known along with one of the smallest.',
      dis: Spacecast3D.Utils.dis(7.7825), // distance: 7.7825 light-years
      asc: Spacecast3D.Utils.asc(10, 56, 29.2), // right ascension: 10h 56m 29.2s
      dec: Spacecast3D.Utils.dec(7, 0, 53), // declination: +07° 00′ 53″
    },
    'Lalande 21185': {
      descriptionSource: "https://en.wikipedia.org/wiki/Lalande_21185",
      description: 'Lalande 21185 is a red dwarf in the constellation Ursa Major. It is the brightest red dwarf in the northern hemisphere. However, one still needs at least binoculars or a small telescope to observe this star.',
      dis: Spacecast3D.Utils.dis(8.2905), // distance: 8.2905 light-years
      asc: Spacecast3D.Utils.asc(11, 3, 20.2), // right ascension: 11h 03m 20.2s
      dec: Spacecast3D.Utils.dec(35, 58, 12), // declination: +35° 58′ 12″
    },
    'Sirius': {
      descriptionSource: "https://en.wikipedia.org/wiki/Sirius",
      description: 'Sirius is the brightest star in our sky. It is a binary system consisting of Sirius A and Sirius B. Sirius A, which creates most of the light, is twice the mass of our sun. Sirius B, on the other hand, is a white dwarf, the faded core left after a supernova.',
      dis: Spacecast3D.Utils.dis(8.5828), // distance: 8.5828 light-years
      asc: Spacecast3D.Utils.asc(6, 45, 8.9), // right ascension: 06h 45m 08.9s
      dec: Spacecast3D.Utils.dec(16, 42, 58, true), // declination: −16° 42′ 58″
    },
    'Luyten 726-8': {
      descriptionSource: "https://en.wikipedia.org/wiki/Luyten_726-8",
      description: 'Star system Luyten 726-8 consists of two stars of very similar brightness. Both are flare stars, occasionally increasing in brightness for a few minutes. Luyten 726-8B is especially remarkable in this respect.',
      dis: Spacecast3D.Utils.dis(8.7280), // distance: 8.7280 light-years
      asc: Spacecast3D.Utils.asc(1, 39, 1.3), // right ascension: 01h 39m 01.3s
      dec: Spacecast3D.Utils.dec(17, 57, 01, true), // declination: −17° 57′ 01″
    },
    'Ross 154': {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_154",
      description: 'Ross 154 is a red dwarf in the constellation Sagittarius. Although it is the closest star to the sun in its constellation, it is completely invisible to the unaided eye.',
      dis: Spacecast3D.Utils.dis(9.6813), // distance: 9.6813 light-years
      asc: Spacecast3D.Utils.asc(18, 49, 49.4), // right ascension: 18h 49m 49.4s
      dec: Spacecast3D.Utils.dec(23, 50, 10, true) // declination: −23° 50′ 10″
    },
    'Ross 248': {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_248",
      description: 'Ross 248 is a red dwarf too dim to be seen without visual assistance. It slightly fluctuates in brightness, which is attributed to spots on its photosphere.',
      dis: Spacecast3D.Utils.dis(10.322), // distance: 10.322 light-years
      asc: Spacecast3D.Utils.asc(23, 41, 54.7), // right ascension: 23h 41m 54.7s
      dec: Spacecast3D.Utils.dec(44, 10, 30) // declination: +44° 10′ 30″
    },
    'Epsilon Eridani': {
      descriptionSource: "https://en.wikipedia.org/wiki/Epsilon_Eridani",
      description: 'Epsilon Eridani is a star residing in the constellation Eridanus. It is somewhat smaller than the sun, and is less than one billion years old. Being still young, its solar wind is thirty times stronger than that of the sun.',
      dis: Spacecast3D.Utils.dis(10.522), // distance: 10.522 light-years
      asc: Spacecast3D.Utils.asc(3, 32, 55.8), // right ascension: 03h 32m 55.8s
      dec: Spacecast3D.Utils.dec(9, 27, 30, true) // declination: −09° 27′ 30″
    },
    'Lacaille 9352': {
      descriptionSource: "https://en.wikipedia.org/wiki/Lacaille_9352",
      description: 'Lacaille 9352 is the closest star in the constellation Piscis Austrinus. However, it is still imperceptible to the naked eye.',
      dis: Spacecast3D.Utils.dis(10.742), // distance: 10.742 light-years
      asc: Spacecast3D.Utils.asc(23, 5, 52), // right ascension: 23h 05m 52.0s
      dec: Spacecast3D.Utils.dec(35, 51, 11, true) // declination: −35° 51′ 11″
    },
    'Ross 128': {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_128",
      description: 'Ross 128 is a faint red dwarf in the constellation Virgo. It harbors a planet called Ross 128 b, which was the second exoplanet discovered. The roughly Earth-sized planet lies in the habitable zone of the star, and is a prime candidate for life.',
      dis: Spacecast3D.Utils.dis(10.919), // distance: 10.919 light-years
      asc: Spacecast3D.Utils.asc(11, 47, 44.4), // right ascension: 11h 47m 44.4s
      dec: Spacecast3D.Utils.dec(0, 48, 16) // declination: +00° 48′ 16″
    },
    'Wise 1506 7027': {
      descriptionSource: "https://en.wikipedia.org/wiki/WISE_1506%2B7027",
      description: 'Wise 1506 7027 is a sub-stellar brown dwarf in the constellation Ursa Minor.',
      dis: Spacecast3D.Utils.dis(11.089), // distance: 11.089 light-years
      asc: Spacecast3D.Utils.asc(15, 6, 49.9), // right ascension: 15h 06m 49.9s
      dec: Spacecast3D.Utils.dec(70, 27, 36) // declination: +70° 27′ 36″
    },
    'Ez Aquarii': {
      descriptionSource: "https://en.wikipedia.org/wiki/EZ_Aquarii",
      description: 'Ez Aquarii is a system of three red dwarfs. Two orbit each other and the third orbits them. All three reside in the constellation Aquarius.',
      dis: Spacecast3D.Utils.dis(11.266), // distance: 11.266 light-years
      asc: Spacecast3D.Utils.asc(22, 38, 33.4), // right ascension: 22h 38m 33.4s
      dec: Spacecast3D.Utils.dec(15, 17, 57, true) // declination: −15° 17′ 57″
    },
    'Procyon': {
      descriptionSource: "https://en.wikipedia.org/wiki/Procyon",
      description: 'Procyon is the brightest star in the constellation Canis Minor and the eighth brightest in the sky. It consists of two white stars, one of which is a faint white dwarf.',
      dis: Spacecast3D.Utils.dis(11.402), // distance: 11.402 light-years
      asc: Spacecast3D.Utils.asc(7, 39, 18.1), // right ascension: 07h 39m 18.1s
      dec: Spacecast3D.Utils.dec(5, 13, 30) // declination: +05° 13′ 30″
    },
    '61 Cyngi': {
      descriptionSource: "https://en.wikipedia.org/wiki/61_Cygni",
      description: '61 Cyngi is a pair of orange-colored dwarfs in the Cygnus constellation. In areas with little light polution, the system can be seen with the naked eye.',
      dis: Spacecast3D.Utils.dis(11.403), // distance: 11.403 light-years
      asc: Spacecast3D.Utils.asc(21, 6, 53.9), // right ascension: 21h 06m 53.9s
      dec: Spacecast3D.Utils.dec(38, 44, 58) // declination: +38° 44′ 58″
    },
    'Struve 2398': {
      descriptionSource: "https://en.wikipedia.org/wiki/Struve_2398",
      description: 'Struve 2398 is a binary dwarf star in the constellation Draco. It is invisible without viewing equipment.',
      dis: Spacecast3D.Utils.dis(11.525), // distance: 11.525 light-years
      asc: Spacecast3D.Utils.asc(18, 42, 46.7), // right ascension: 18h 42m 46.7s
      dec: Spacecast3D.Utils.dec(59, 37, 49) // declination: +59° 37′ 49″
    },
    'Groombridge 34': {
      descriptionSource: "https://en.wikipedia.org/wiki/Groombridge_34",
      description: 'Groombridge 34 is a binary system of red dwarf stars of the Andromeda constellation. It is moving away from the Solar System relatively fast at 11.6 km/s.',
      dis: Spacecast3D.Utils.dis(11.624), // distance: 11.624 light-years
      asc: Spacecast3D.Utils.asc(0, 18, 22.9), // right ascension: 0h 18m 22.9s
      dec: Spacecast3D.Utils.dec(44, 1, 23) // declination: +44° 01′ 23″
    },
    'Epsilon Indi': {
      descriptionSource: "https://en.wikipedia.org/wiki/Epsilon_Indi",
      description: 'Epsilon Indi is a triple star system in the constellation of Indus. It contains one orange dwarf and two brown dwarfs. The orange star harbors a gas giant, the closest known outside the Solar System, with 2.7 times the mass of Jupiter.',
      dis: Spacecast3D.Utils.dis(11.824), // distance: 11.824 light-years
      asc: Spacecast3D.Utils.asc(22, 03, 21.7), // right ascension: 22h 03m 21.7s
      dec: Spacecast3D.Utils.dec(56, 47, 10) // declination: −56° 47′ 10″
    },
    'Dx Cancri': {
      descriptionSource: "https://en.wikipedia.org/wiki/DX_Cancri",
      description: 'Dx Cancri is a faint red dwarf in the constellation Cancer. It is a flare star, meaning its brightness can increase fivefold for short times.',
      dis: Spacecast3D.Utils.dis(11.826), // distance: 11.826 light-years
      asc: Spacecast3D.Utils.asc(8, 29, 49.5), // right ascension: 08h 29m 49.5s
      dec: Spacecast3D.Utils.dec(26, 46, 37) // declination: +26° 46′ 37″
    },
    'Tau Ceti': {
      descriptionSource: "https://en.wikipedia.org/wiki/Tau_Ceti",
      description: 'Tau Ceti is a single star in the constellation Cetus with 78% of the sun\'s mass. There is evidence that five planets orbit the star, of which two are in the habitable zone. Because of this, Tau Ceti is a candidate for life. However, it is also orbited by a disk of debris, and the resulting higher frequency of impacts would be a barrier for such life.',
      dis: Spacecast3D.Utils.dis(11.887), // distance: 11.887 light-years
      asc: Spacecast3D.Utils.asc(1, 44, 4.1), // right ascension: 01h 44m 04.1s
      dec: Spacecast3D.Utils.dec(15, 56, 15, true) // declination: −15° 56′ 15″
    },
    'GJ 1061': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_1061",
      description: 'GJ 1061 is a red dwarf in the Horologium constellation. It is only 0.1% as luminous as the sun.',
      dis: Spacecast3D.Utils.dis(11.991), // distance: 11.991 light-years
      asc: Spacecast3D.Utils.asc(3, 35, 59.7), // right ascension: 03h 35m 59.7s
      dec: Spacecast3D.Utils.dec(44, 30, 45, true) // declination: −44° 30′ 45″
    },
    'Wise 0350-5658': {
      descriptionSource: "https://en.wikipedia.org/wiki/WISE_0350%E2%88%925658",
      description: 'Wise 0350-5658, a brown dwarf, is the closest system in the constellation Reticulum.',
      dis: Spacecast3D.Utils.dis(12.068), // distance: 12.068 light-years
      asc: Spacecast3D.Utils.asc(3, 50, .32), // right ascension: 03h 50m 00.32s
      dec: Spacecast3D.Utils.dec(56, 58, 30.2, true) // declination: −56° 58′ 30.2″
    },
    'YZ Ceti': {
      descriptionSource: "https://en.wikipedia.org/wiki/YZ_Ceti",
      description: 'YZ Ceti is a red dwarf in the Cetus constellation. It is unusually close to its nearest neighbor Tau Ceti at mere 1.6 light years away.',
      dis: Spacecast3D.Utils.dis(12.132), // distance: 12.132 light-years
      asc: Spacecast3D.Utils.asc(1, 12, 30.6), // right ascension: 01h 12m 30.6s
      dec: Spacecast3D.Utils.dec(16, 59, 56, true) // declination: −16° 59′ 56″
    },
    'Luytens Star': {
      descriptionSource: "https://en.wikipedia.org/wiki/Luyten%27s_Star",
      description: 'Luyten\'s Star is a red dwarf in the Canis Minor constellation. Orbiting it are two planets. One of these, called GJ 273b, is a rocky planet larger than Earth. GJ 273b is within the habitable zone, so it could be home to extraterrestrial life.',
      dis: Spacecast3D.Utils.dis(12.366), // distance: 12.366 light-years
      asc: Spacecast3D.Utils.asc(7, 27, 24.5), // right ascension: 07h 27m 24.5s
      dec: Spacecast3D.Utils.dec(5, 13, 33) // declination: +05° 13′ 33″
    },
    'Teegardens Star': {
      descriptionSource: "https://en.wikipedia.org/wiki/Teegarden%27s_Star",
      description: 'Teegarden\'s Star is an invisible red dwarf in the constellation of Aries. The star is moving across the sky at about 1.4E-3 degrees per year, which is extraordinarily fast.',
      dis: Spacecast3D.Utils.dis(12.514), // distance: 12.514 light-years
      asc: Spacecast3D.Utils.asc(2, 53, .9), // right ascension: 02h 53m 00.9s
      dec: Spacecast3D.Utils.dec(16, 52, 53) // declination: +16° 52′ 53″
    },
    'SCR 1845-6357': {
      descriptionSource: "https://en.wikipedia.org/wiki/SCR_1845-6357",
      description: 'SCR 1845-6357 is a binary system of the Pavo constellation. One star is a red dwarf. The other is a sub-stellar brown dwarf 40-50 times the mass of Jupiter. Being about 50 times fainter than its companion, the brown dwarf was discovered years later.',
      dis: Spacecast3D.Utils.dis(12.571), // distance: 12.571 light-years
      asc: Spacecast3D.Utils.asc(18, 45, 5.3), // right ascension: 18h 45m 05.3s
      dec: Spacecast3D.Utils.dec(63, 57, 48, true) // declination: −63° 57′ 48″
    },
    'Kapteyns Star': {
      descriptionSource: "https://en.wikipedia.org/wiki/Kapteyn%27s_Star",
      description: 'Kapteyn\'s Star is a red subdwarf in the constellation Pictor. It harbors two planets. One of them, Kapteyn b, is potentially habitable. This would make the planet the oldest habitable planet known, with an age of about 11 billion years. Kapteyn\'s Star is visible through binoculars.',
      dis: Spacecast3D.Utils.dis(12.777), // distance: 12.777 light-years
      asc: Spacecast3D.Utils.asc(5, 11, 40.6), // right ascension: 05h 11m 40.6s
      dec: Spacecast3D.Utils.dec(45, 1, 6, true) // declination: −45° 01′ 06″
    },
    'Lacaille 8760': {
      descriptionSource: "https://en.wikipedia.org/wiki/Lacaille_8760",
      description: 'Lacaille 8760 is a red dwarf in the Microscopium constellation. The star is one of the brightest red dwarfs known, but is still only visible to the naked eye under exceptional viewing conditions.',
      dis: Spacecast3D.Utils.dis(12.870), // distance: 12.870 light-years
      asc: Spacecast3D.Utils.asc(21, 17, 15.3), // right ascension: 21h 17m 15.3s
      dec: Spacecast3D.Utils.dec(38, 52, 3, true) // declination: −38° 52′ 03″
    },
    'Wise 0535-7500': {
      descriptionSource: "https://en.wikipedia.org/wiki/WISE_0535%E2%88%927500",
      description: 'Wise 0535-7500 is a pair of bodies in the constellation Mensa. Both are too small for any fusion to occur within them, so they are essentially free-floating planets.',
      dis: Spacecast3D.Utils.dis(13.0), // distance: 13.0 light-years
      asc: Spacecast3D.Utils.asc(5, 35, 16.8), // right ascension: 05h 35m 16.8s
      dec: Spacecast3D.Utils.dec(75, 0, 24.9, true) // declination: −75° 00′ 24.9″
    },
    'Kruger 60': {
      descriptionSource: "https://en.wikipedia.org/wiki/Kruger_60",
      description: 'Kruger 60 is a pair of red dwarfs in the Cepheus constellation. The average distance between the two is about the same as the distance between the sun and Saturn. the stars complete one orbit every 44.6 years.',
      dis: Spacecast3D.Utils.dis(13.149), // distance: 13.149 light-years
      asc: Spacecast3D.Utils.asc(22, 27, 59.5), // right ascension: 22h 27m 59.5s
      dec: Spacecast3D.Utils.dec(57, 41, 45) // declination: +57° 41′ 45″
    },
    'DEN 1048 3956': {
      descriptionSource: "https://en.wikipedia.org/wiki/DEN_1048%E2%88%923956",
      description: 'DEN 1048-3956 is a brown dwarf in the Antlia constellation. It was first detected when it emitted a powerful radio flare.',
      dis: Spacecast3D.Utils.dis(13.167), // distance: 13.167 light-years
      asc: Spacecast3D.Utils.asc(10, 48, 14.7), // right ascension: 10h 48m 14.7s
      dec: Spacecast3D.Utils.dec(39, 56, 6, true) // declination: −39° 56′ 06″
    },
    'UGPS 0722-05': {
      descriptionSource: "https://en.wikipedia.org/wiki/UGPS_J0722-0540",
      description: 'UGPS 0722-05 is a brown dwarf in the constellation Monoceros about Jupiter\'s volume.',
      dis: Spacecast3D.Utils.dis(13.259), // distance: 13.259 light-years
      asc: Spacecast3D.Utils.asc(7, 22, 27.3), // right ascension: 07h 22m 27.3s
      dec: Spacecast3D.Utils.dec(5, 40, 30, true) // declination: –05° 40′ 30″
    },
    'Ross 614': {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_614",
      description: 'Ross 614 is a binary red dwarf system in the constellation Monoceros. The system is too dim to be seen without the aid of a telescope.',
      dis: Spacecast3D.Utils.dis(13.349), // distance: 13.349 light-years
      asc: Spacecast3D.Utils.asc(6, 29, 23.4), // right ascension: 06h 29m 23.4s
      dec: Spacecast3D.Utils.dec(2, 48, 50, true) // declination: −02° 48′ 50″
    },
    'Wolf 1061': {
      descriptionSource: "https://en.wikipedia.org/wiki/Wolf_1061",
      description: 'Wolf 1061 is a red dwarf of the constellation Ophiuchus. It harbors three planets, two of which might be home to life.',
      dis: Spacecast3D.Utils.dis(13.820), // distance: 13.820 light-years
      asc: Spacecast3D.Utils.asc(16, 30, 18.1), // right ascension: 16h 30m 18.1s
      dec: Spacecast3D.Utils.dec(12, 39, 45, true) // declination: −12° 39′ 45″
    },
    'Van Maanens Star': {
      descriptionSource: "https://en.wikipedia.org/wiki/Van_Maanen_2",
      description: 'van Maanen\'s Star resides in the constellation Pisces. It is a dense white dwarf, a remnant left over by a much larger star. It is the closest known white dwarf lacking a companion star.',
      dis: Spacecast3D.Utils.dis(14.066), // distance: 14.066 light-years
      asc: Spacecast3D.Utils.asc(0, 49, 9.9), // right ascension: 00h 49m 09.9s
      dec: Spacecast3D.Utils.dec(5, 23, 19) // declination: +05° 23′ 19″
    },
    'Gliese 1': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_1",
      description: 'Gliese 1 is a red dwarf in the constellation of Sculptor. Its faintness makes it impossible to see with the unaided eye.',
      dis: Spacecast3D.Utils.dis(14.231), // distance: 14.231 light-years
      asc: Spacecast3D.Utils.asc(0, 5, 24.4), // right ascension: 00h 05m 24.4s
      dec: Spacecast3D.Utils.dec(37, 21, 27, true) // declination: −37° 21′ 27″
    },
    'Wolf 424': {
      descriptionSource: "https://en.wikipedia.org/wiki/Wolf_424",
      description: 'Wolf 424 is a binary red dwarf system in the Virgo constellation. The stars are two of the dimmest known nearby stars in the sky.',
      dis: Spacecast3D.Utils.dis(14.312), // distance: 14.312 light-years
      asc: Spacecast3D.Utils.asc(12, 33, 17.2), // right ascension: 12h 33m 17.2s
      dec: Spacecast3D.Utils.dec(9, 1, 15) // declination: +09° 01′ 15″
    },
    '2MASS J154043': {
      descriptionSource: "https://en.wikipedia.org/wiki/2MASS_J154043.42-510135.7",
      description: '2MASS J154043 is a dim red dwarf in the Norma constellation.',
      dis: Spacecast3D.Utils.dis(14.4), // distance: 14.4 light-years
      asc: Spacecast3D.Utils.asc(15, 40, 43.42), // right ascension: 15h 40m 43.42s
      dec: Spacecast3D.Utils.dec(51, 1, 35.7, true) // declination: −51° 01′ 35.7″
    },
    'L 1159-16': {
      descriptionSource: "https://en.wikipedia.org/wiki/L_1159-16",
      description: 'L 1159-16 is a red dwarf in the Aries constellation. It is too faint to be visible without a telescope.',
      dis: Spacecast3D.Utils.dis(14.509), // distance: 14.509 light-years
      asc: Spacecast3D.Utils.asc(2, 0, 13.2), // right ascension: 02h 00m 13.2s
      dec: Spacecast3D.Utils.dec(13, 3, 8) // declination: +13° 03′ 08″
    },
    'Gliese 687': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_687",
      description: 'Gliese 687 is a red dwarf in the constellation of Draco. A moderately sized telescope is required to spot it. Gliese 687 is orbited by a planet about the mass of Neptune.',
      dis: Spacecast3D.Utils.dis(14.793), // distance: 14.793 light-years
      asc: Spacecast3D.Utils.asc(17, 36, 25.9), // right ascension: 17h 36m 25.9s
      dec: Spacecast3D.Utils.dec(68, 20, 21) // declination: +68° 20′ 21″
    },
    'LHS 292': {
      descriptionSource: "https://en.wikipedia.org/wiki/LHS_292",
      description: 'LHS 292 resides in the Sextans constellation. Being a faint red dwarf, it can only be seen through a large telescope.',
      dis: Spacecast3D.Utils.dis(14.805), // distance: 14.805 light-years
      asc: Spacecast3D.Utils.asc(10, 48, 12.6), // right ascension: 10h 48m 12.6s
      dec: Spacecast3D.Utils.dec(11, 20, 14, true) // declination: −11° 20′ 14″
    },
    'Gliese 674': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_674",
      description: 'Gliese 674 is a red dwarf in the constellation Ara. A planet about twelve times the mass of Earth orbits the star.',
      dis: Spacecast3D.Utils.dis(14.809), // distance: 14.809 light-years
      asc: Spacecast3D.Utils.asc(17, 28, 39.9), // right ascension: 17h 28m 39.9s
      dec: Spacecast3D.Utils.dec(46, 53, 43, true) // declination: −46° 53′ 43″
    },
    'GJ 1245': {
      descriptionSource: "https://en.wikipedia.org/wiki/GJ_1245",
      description: 'GJ 1245 is a system in the Cygnus constellation. It is made of three red dwarfs. Two orbit each other and this binary system orbits another red dwarf.',
      dis: Spacecast3D.Utils.dis(14.812), // distance: 14.812 light-years
      asc: Spacecast3D.Utils.asc(19, 53, 54.2), // right ascension: 19h 53m 54.2s
      dec: Spacecast3D.Utils.dec(44, 24, 55) // declination: +44° 24′ 55″
    },
    'LP 145-141': {
      descriptionSource: "https://en.wikipedia.org/wiki/LP_145-141",
      description: 'LP 145-141 is a white dwarf in the Musca constellation. It is thought to follow a highly eccentric orbit around the galaxy.',
      dis: Spacecast3D.Utils.dis(15.060), // distance: 15.060 light-years
      asc: Spacecast3D.Utils.asc(11, 45, 42.9), // right ascension: 11h 45m 42.9s
      dec: Spacecast3D.Utils.dec(64, 50, 29, true) // declination: −64° 50′ 29″
    },
    'GJ 1002': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_1002",
      description: 'GJ 1002 is a red dwarf in the Cetus constellation. Unlike many red dwarfs, it does not emit any flares.',
      dis: Spacecast3D.Utils.dis(15.313), // distance: 15.313 light-years
      asc: Spacecast3D.Utils.asc(0, 6, 43.8), // right ascension: 00h 06m 43.8s
      dec: Spacecast3D.Utils.dec(7, 32, 22, true) // declination: −07° 32′ 22″
    },
    'Gliese 876': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_876#Planetary_system",
      // TODO: Talk about inclination of planets?
      description: 'Gliese 876 is a red dwarf in the Aquarius constellation. It is orbited by four planets. The middle two of these are in the habitable zone of the star, although they are both gas giants. Three of the planets are also in a 1:2:4 resonance. They are the only known example of this phenomenon other than Jupiter\'s inner three Galilean moons.',
      dis: Spacecast3D.Utils.dis(15.342), // distance: 15.342 light-years
      asc: Spacecast3D.Utils.asc(22, 53, 16.7), // right ascension: 22h 53m 16.7s
      dec: Spacecast3D.Utils.dec(14, 15, 49, true) // declination: −14° 15′ 49″
    },
    'LHS 288': {
      descriptionSource: "https://en.wikipedia.org/wiki/LHS_288",
      description: 'LHS 288 is normally invisible red dwarf in the constellation Carina. It might have a gaseous planet orbiting it, but this is not confirmed.',
      dis: Spacecast3D.Utils.dis(15.610), // distance: 15.610 light-years
      asc: Spacecast3D.Utils.asc(10, 44, 21.2), // right ascension: 10h 44m 21.2s
      dec: Spacecast3D.Utils.dec(61, 12, 36, true) // declination: −61° 12′ 36″
    },
    'Gliese 412': {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_412",
      description: 'Gliese 412 is a dim red dwarf duo thought to form a binary system. The two are part of the constellation Ursa Major.',
      dis: Spacecast3D.Utils.dis(15.832), // distance: 15.832 light-years
      asc: Spacecast3D.Utils.asc(11, 5, 28.6), // right ascension: 11h 05m 28.6s
      dec: Spacecast3D.Utils.dec(43, 31, 36) // declination: +43° 31′ 36″
    },
    'Groombridge 1618': {
      descriptionSource: "https://en.wikipedia.org/wiki/Groombridge_1618",
      description: 'Groombridge 1618 is a star in the constellation Ursa Major. It is theorized that it has a planetary companion at least four times the mass of Jupiter. If this companion exists, then it is in the habitable zone.',
      dis: Spacecast3D.Utils.dis(15.848), // distance: 15.848 light-years
      asc: Spacecast3D.Utils.asc(10, 11, 22.1), // right ascension: 10h 11m 22.1s
      dec: Spacecast3D.Utils.dec(49, 27, 15) // declination: +49° 27′ 15″
    },
    'AD Leonis': {
      descriptionSource: "https://en.wikipedia.org/wiki/AD_Leonis",
      description: 'AD Leonis is a red dwarf in the constellation Leo. While red dwarfs can be much older than the sun, AD Leonis is thought to be relatively young, at only 25–300 million years of age.',
      dis: Spacecast3D.Utils.dis(15.942), // distance: 15.942 light-years
      asc: Spacecast3D.Utils.asc(10, 19, 36.4), // right ascension: 10h 19m 36.4s
      dec: Spacecast3D.Utils.dec(19, 52, 10) // declination: +19° 52′ 10″
    },
    'Denis J081730': {
      descriptionSource: "https://en.wikipedia.org/wiki/DENIS_J081730.0-615520",
      description: 'Denis J081730 is a sub-stellar brown dwarf in the Carina constellation. It has a mass fifteen times that of Jupiter.',
      dis: Spacecast3D.Utils.dis(16.067), // distance: 16.067 light-years
      asc: Spacecast3D.Utils.asc(8, 17, 30.1), // right ascension: 08h 17m 30.1s
      dec: Spacecast3D.Utils.dec(61, 55, 16, true) // declination: −61° 55′ 16″
    },
    'Gliese 832': {
      dis: Spacecast3D.Utils.dis(16.085), // distance: 16.085 light-years
      asc: Spacecast3D.Utils.asc(21, 33, 34), // right ascension: 21h 33m 34.0s
      dec: Spacecast3D.Utils.dec(49, 0, 32, true) // declination: −49° 00′ 32″
    },
    'DEN 0255-4700': {
      dis: Spacecast3D.Utils.dis(16.197), // distance: 16.197 light-years
      asc: Spacecast3D.Utils.asc(2, 55, 3.7), // right ascension: 02h 55m 03.7s
      dec: Spacecast3D.Utils.dec(47, 0, 52, true) // declination: −47° 00′ 52″
    },
    'GJ 1005': {
      dis: Spacecast3D.Utils.dis(16.265), // distance: 16.265 light-years
      asc: Spacecast3D.Utils.asc(0, 15, 28.11), // right ascension: 00h 15m 28.11s
      dec: Spacecast3D.Utils.dec(16, 8, 1.6, true) // declination: −16° 08′ 01.6″
    },
  },
}

Spacecast3D.State = {
  universe: null,
  solarSystem: {
    sun: null,
    mercury: null,
    venus: null,
    earth: null,
    mars: null,
    jupiter: null,
    saturn: null,
    neptune: null,
    uranus: null,
  },
  lights: null,
  milkyWay: null,
  centralPlane: null,
  nearestStars: null,
  nearestStarsLabels: [],
  activeNearestStarLabel: null,
  datGUI: null,
  orbitControls: null,
  defaultControlMinDistance: null,
  onRenderFunctions: [],
  lastTimeMilliSec: 0,
}

Spacecast3D.Helper = {
  createRenderer: function() {
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(Spacecast3D.Setup.renderer.width, Spacecast3D.Setup.renderer.height)
    renderer.domElement.id = 'canvas-spacecast3d'
    return renderer
  },

  createLight: function() {
    var ambientLight = new THREE.AmbientLight(0xffffff)
    var pointLight = new THREE.PointLight(0xffffff, 1)
    var lights = new THREE.Group()
  	lights.add(ambientLight)
    lights.add(pointLight)
    return lights
  },

  createCamera: function() {
    var camera = new THREE.PerspectiveCamera(...Spacecast3D.Setup.cameraSettings)
    camera.position.setFromSpherical(new THREE.Spherical(...Spacecast3D.Setup.cameraPosition))
    return camera
  },

  createControls: function(camera, domElement) {
    var controls = new THREE.OrbitControls(camera, domElement)
    controls.minDistance = Spacecast3D.Setup.controls.minDistance
    controls.maxDistance = Spacecast3D.Setup.controls.maxDistance
    controls.enablePan = Spacecast3D.Setup.controls.enablePan
    controls.enableZoom = Spacecast3D.Setup.controls.enableZoom
    Spacecast3D.State.orbitControls = controls
    return controls
  },

  createUniverse: function() {
    var light = Spacecast3D.Helper.createLight()
    var camera = Spacecast3D.Helper.createCamera()
    var renderer = Spacecast3D.Helper.createRenderer()
    renderer.domElement.addEventListener('mousemove', this.onMouseMove, false)
    renderer.domElement.addEventListener('mousedown', this.onMouseDown, false)
    var controls = Spacecast3D.Helper.createControls(camera, renderer.domElement)
    document.getElementById(Spacecast3D.Setup.renderer.containerId).appendChild(renderer.domElement)
    var scene = new THREE.Scene()
    scene.add(light)
    scene.add(camera)

    var starNameField = document.getElementById('spacecast3d-info-name')
    starNameField.addEventListener("keypress", function(event) {
      const KEYCODE_ENTER = 13;
      if (event.keyCode !== KEYCODE_ENTER)
        return;

      var starLabel = Spacecast3D.Helper.searchForStar(starNameField.value)
      if (starLabel != null) {
        Spacecast3D.Helper.focusOnStar(starLabel)
        Spacecast3D.Helper.updateInfo(Spacecast3D.State.universe.camera)
        starNameField.value = null
      }
    })

    var setup =   Spacecast3D.Setup
    var solarSetup = setup.solarSystem
    var state = Spacecast3D.State
    state.milkyWay = Spacecast3D.Helper.createMilkyWay(setup.milkyWayRadius)
    state.solarSystem.sun = Spacecast3D.Helper.createSun(solarSetup.sun.radius)
    state.solarSystem.mercury = Spacecast3D.Helper.createMercury(solarSetup.mercury.radius, solarSetup.mercury.orbitRadius)
    state.solarSystem.venus = Spacecast3D.Helper.createVenus(solarSetup.venus.radius, solarSetup.venus.orbitRadius)
    state.solarSystem.earth = Spacecast3D.Helper.createEarth(solarSetup.earth.radius, solarSetup.earth.orbitRadius)
    state.solarSystem.mars = Spacecast3D.Helper.createMars(solarSetup.mars.radius, solarSetup.mars.orbitRadius)
    state.solarSystem.jupiter = Spacecast3D.Helper.createJupiter(solarSetup.jupiter.radius, solarSetup.jupiter.orbitRadius)
    state.solarSystem.saturn = Spacecast3D.Helper.createSaturn(solarSetup.saturn.radius, solarSetup.saturn.orbitRadius)
    state.solarSystem.uranus = Spacecast3D.Helper.createUranus(solarSetup.uranus.radius, solarSetup.uranus.orbitRadius)
    state.solarSystem.neptune = Spacecast3D.Helper.createNeptune(solarSetup.neptune.radius, solarSetup.neptune.orbitRadius)
    state.centralPlane = Spacecast3D.Helper.createCentralPlane()
    state.nearestStars = Spacecast3D.Helper.getNearestStars(setup.nearestStars)
    // scene.add(state.milkyWay)
    scene.add(state.solarSystem.sun)
    scene.add(state.solarSystem.mercury)
    scene.add(state.solarSystem.venus)
    scene.add(state.solarSystem.earth)
    scene.add(state.solarSystem.mars)
    scene.add(state.solarSystem.jupiter)
    scene.add(state.solarSystem.saturn)
    scene.add(state.solarSystem.uranus)
    scene.add(state.solarSystem.neptune)
    // scene.add(state.centralPlane)
    scene.add(state.nearestStars)

    Spacecast3D.State.universe = {
      scene: scene,
      camera: camera,
      controls: controls,
      renderer: renderer,
    }
    return Spacecast3D.State.universe
  },

  onMouseMove: function(event) {
    var raycaster = Spacecast3D.Setup.raycaster
    var mouse = Spacecast3D.Setup.mouse
    var camera = Spacecast3D.State.universe.camera
  	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  	raycaster.setFromCamera(mouse, camera)

  	intersections = raycaster.intersectObjects(Spacecast3D.State.nearestStarsLabels)
  	if (intersections.length > 0) {
  		if (Spacecast3D.State.activeNearestStarLabel != intersections[0].object) {
  			if (Spacecast3D.State.activeNearestStarLabel) {
          Spacecast3D.State.activeNearestStarLabel.material.color.setStyle(Spacecast3D.Setup.starsLabel.baseColor)
        }
  			Spacecast3D.State.activeNearestStarLabel = intersections[0].object
  			Spacecast3D.State.activeNearestStarLabel.material.color.setStyle(Spacecast3D.Setup.starsLabel.activeColor)
  		}
  		document.body.style.cursor = 'pointer'
  	}
  	else if (Spacecast3D.State.activeNearestStarLabel) {
  		Spacecast3D.State.activeNearestStarLabel.material.color.setStyle(Spacecast3D.Setup.starsLabel.baseColor)
  		Spacecast3D.State.activeNearestStarLabel = null
  		document.body.style.cursor = 'auto'
  	}
  },

  onMouseDown: function(event) {
    var raycaster = Spacecast3D.Setup.raycaster
    var mouse = Spacecast3D.Setup.mouse
    var camera = Spacecast3D.State.universe.camera
  	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  	raycaster.setFromCamera(mouse, camera)

  	var intersects = raycaster.intersectObjects(Spacecast3D.State.nearestStarsLabels)
  	if (intersects.length > 0) {
      Spacecast3D.Helper.focusOnStar(intersects[0].object)
  	}
  },

  createSphere: function(radius, material, segments) {
    var segments = segments || 32
    var geometry	= new THREE.SphereGeometry(radius, segments, segments)
  	return new THREE.Mesh(geometry, material)
  },

  createCloud: function(radius) {
    // create destination canvas
  	var canvasResult	= document.createElement('canvas')
  	canvasResult.width	= 1024
  	canvasResult.height	= 512
  	var contextResult	= canvasResult.getContext('2d')

  	// load earthcloudmap
  	var imageMap	= new Image()
  	imageMap.addEventListener("load", function() {
  		// create dataMap ImageData for earthcloudmap
  		var canvasMap	= document.createElement('canvas')
  		canvasMap.width	= imageMap.width
  		canvasMap.height= imageMap.height
  		var contextMap	= canvasMap.getContext('2d')
  		contextMap.drawImage(imageMap, 0, 0)
  		var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

  		// load earthcloudmaptrans
  		var imageTrans	= new Image()
  		imageTrans.addEventListener("load", function(){
  			// create dataTrans ImageData for earthcloudmaptrans
  			var canvasTrans		= document.createElement('canvas')
  			canvasTrans.width	= imageTrans.width
  			canvasTrans.height	= imageTrans.height
  			var contextTrans	= canvasTrans.getContext('2d')
  			contextTrans.drawImage(imageTrans, 0, 0)
  			var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
  			// merge dataMap + dataTrans into dataResult
  			var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height)
  			for (var y = 0, offset = 0; y < imageMap.height; y++){
  				for (var x = 0; x < imageMap.width; x++, offset += 4){
  					dataResult.data[offset+0]	= dataMap.data[offset+0]
  					dataResult.data[offset+1]	= dataMap.data[offset+1]
  					dataResult.data[offset+2]	= dataMap.data[offset+2]
  					dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]
  				}
  			}
  			// update texture with result
  			contextResult.putImageData(dataResult,0,0)
  			material.map.needsUpdate = true
  		})
  		imageTrans.src	= './images/earthcloudmaptrans.jpg'
  	}, false)
  	imageMap.src	= './images/earthcloudmap.jpg'

  	var geometry	= new THREE.SphereGeometry(radius, 128, 128)
  	var material	= new THREE.MeshPhongMaterial({
  		map: new THREE.Texture(canvasResult),
  		side: THREE.DoubleSide,
  		transparent: true,
  		opacity: 0.8,
  	})
  	var mesh	= new THREE.Mesh(geometry, material)
  	return mesh
  },

  createSun: function(radius) {
    var sunMaterial	= new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('./images/sunmap.jpg'),})
    var sun = this.createSphere(radius, sunMaterial)
    sun.name = 'star'

    var sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('./images/sunsprite.png'),
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    }))
    sunSprite.scale.x = 2000 * Spacecast3D.EARTH_DIAMETER
    sunSprite.scale.y = 2000 * Spacecast3D.EARTH_DIAMETER
    sunSprite.scale.z = 1

    var group = new THREE.Group()
    group.add(sun)
    group.add(sunSprite)
    return group
  },

  createPlanet: function(material, radius, orbitRadius) {
    var planet = this.createSphere(radius, material)
    planet.name = 'planet'
    planet.translateZ(orbitRadius)
    var orbit = this.circleLine(orbitRadius, 0xffffff, .5)
    orbit.name = 'orbit'
    var group = new THREE.Group()
    group.add(planet)
    group.add(orbit)
    return group
  },

  createMercury: function(radius, orbitRadius) {
    var mercuryMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/mercurymap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('./images/mercurybump.jpg'),
  		bumpScale	: 0.1,
  	})
    return this.createPlanet(mercuryMaterial, radius, orbitRadius)
  },

  createVenus: function(radius, orbitRadius) {
    var venusMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/venusmap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('./images/venusbump.jpg'),
  		bumpScale	: 0.1,
  	})
    return this.createPlanet(venusMaterial, radius, orbitRadius)
  },

  createEarth: function(radius, orbitRadius) {
    var earthMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/earthmap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('./images/earthbump.jpg'),
  		bumpScale	: 0.1,
  	})
    var atmosphereMaterial	= Spacecast3D.Atmosphere.createMaterial(0x00b3ff)

    var earth = this.createSphere(radius, earthMaterial)
  	var atmosphere	= this.createSphere(radius*1.04, atmosphereMaterial, 128)
    var earthCloud	= this.createCloud(radius*1.02)
  	earthCloud.receiveShadow	= true
  	earthCloud.castShadow	= true

    var planetEarth = new THREE.Group()
    planetEarth.add(earth)
    planetEarth.add(atmosphere)
  	planetEarth.add(earthCloud)
    planetEarth.name = 'planet'
    planetEarth.translateZ(orbitRadius)

    var orbit = this.circleLine(orbitRadius, 0xffffff)
    orbit.name = 'orbit'

    var group = new THREE.Group()
    group.add(planetEarth)
    group.add(orbit)
    return group
  },

  createMars: function(radius, orbitRadius) {
    var marsMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/marsmap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('./images/marsbump.jpg'),
  		bumpScale	: 0.1,
  	})
    return this.createPlanet(marsMaterial, radius, orbitRadius)
  },

  createJupiter: function(radius, orbitRadius) {
    var jupiterMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/jupitermap.jpg'),
  	})
    return this.createPlanet(jupiterMaterial, radius, orbitRadius)
  },

  createSaturn: function(radius, orbitRadius) {
    var saturnMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/saturnmap.jpg'),
  	})
    return this.createPlanet(saturnMaterial, radius, orbitRadius)
  },

  createUranus: function(radius, orbitRadius) {
    var uranusMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/uranusmap.jpg'),
  	})
    return this.createPlanet(uranusMaterial, radius, orbitRadius)
  },

  createNeptune: function(radius, orbitRadius) {
    var neptuneMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('./images/neptunemap.jpg'),
  	})
    return this.createPlanet(neptuneMaterial, radius, orbitRadius)
  },

  resizePlanets: function(scale) {
    var state = Spacecast3D.State
    var solarState = state.solarSystem
    solarState.mercury.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.venus.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.earth.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.mars.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.jupiter.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.saturn.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.uranus.getObjectByName('planet').scale.set(scale,scale,scale)
    solarState.neptune.getObjectByName('planet').scale.set(scale,scale,scale)
    Spacecast3D.State.orbitControls.minDistance = state.defaultControlMinDistance * scale
  },

  createMilkyWay: function(radius) {
  	var material	= new THREE.MeshBasicMaterial({
  		map	: new THREE.TextureLoader().load('./images/galaxy.jpg'),
  		side	: THREE.BackSide
  	})
  	var geometry	= new THREE.SphereGeometry(radius, 32, 32)
  	return new THREE.Mesh(geometry, material)
  },

  createStar: function(position) {
    var star = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('./images/starsprite.png'),
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    }))
    star.scale.x = 25000*Spacecast3D.SPACECAST3D_AU
    star.scale.y = 25000*Spacecast3D.SPACECAST3D_AU
    star.scale.z = 1
    star.position.setFromSpherical(position)
    return star
  },

  getNearestStars: function (starsData, font) {
    var nearestStars = new THREE.Group()
    for (var key in starsData) {
      if (!starsData.hasOwnProperty(key)) continue
      var starData = starsData[key]
      var position = new THREE.Spherical(starData.dis, starData.dec, starData.asc)
      star = this.createStar(position)
      label = this.createStarLabel(key)
      label.name = key
      label.scale.x = 55000*Spacecast3D.SPACECAST3D_AU
      label.scale.y = 55000*Spacecast3D.SPACECAST3D_AU
      label.scale.z = 1
      label.position.setFromSpherical(position)
      nearestStars.add(star)
      nearestStars.add(label)
      Spacecast3D.State.nearestStarsLabels.push(label)

      starData.label = label
    }
    return nearestStars
  },

  circleLine: function(r, color, opacity) {
    var opacity = opacity || 1
    var geometry = new THREE.CircleGeometry(r, 1024, 0, 2 * 3.1415)
    var material = new THREE.LineBasicMaterial({color: color, transparent: true, opacity: opacity})
    var circle = new THREE.Line(geometry, material)
    circle.geometry.vertices.shift()
    circle.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2)
    return circle
  },

  createCentralPlane: function() {
    var group = new THREE.Group()
    group.add(this.circleLine(4 * Spacecast3D.SPACECAST3D_LY, 0xffff00, .5)) // 4 light years ring
    group.add(this.circleLine(8 * Spacecast3D.SPACECAST3D_LY, 0xffff00, .5)) // 8 light years ring
    group.add(this.circleLine(12 * Spacecast3D.SPACECAST3D_LY, 0xffff00, .5)) // 12 light years ring
    group.add(this.circleLine(16 * Spacecast3D.SPACECAST3D_LY, 0xffff00, .5)) // 16 light years ring

    // load star information
    var starsInfo = Spacecast3D.Setup.nearestStars

    // loop through each star information and add the vertical line segment to the central plane
    for (var key in starsInfo) {
      if (!starsInfo.hasOwnProperty(key)) continue
      // get the star information
      var starInfo = starsInfo[key]
      // get the star spherical position
      var starPosition = new THREE.Spherical(starInfo.dis, starInfo.dec, starInfo.asc)

      // end points of the vertical line segment
      var pointA = new THREE.Vector3()
      var pointB = new THREE.Vector3()
      pointB.setFromSpherical(starPosition)
      pointA.x = pointB.x
      pointA.y = 0
      pointA.z = pointB.z

      // define the geometry of the line segment
      var geometry = new THREE.Geometry()
      geometry.vertices.push(pointA, pointB)

      // define the material of the line segment
      var material = new THREE.LineBasicMaterial({color: 'white', transparent: true, opacity: .2})

      // create the vertical line segment
      var segment = new THREE.LineSegments(geometry, material)

      // add the line segment to the group
      group.add(segment)
    }

    return group
  },

  createStarLabel: function(text) {
  	var fontFace = Spacecast3D.Setup.starsLabel.fontFace
  	var fontSize = Spacecast3D.Setup.starsLabel.fontSize
    var textWidth = this.getTextWidth(text, fontSize, fontFace)
    var canvas = document.createElement('canvas')
    // round up canvas width to the nearest power of 2, otherwise THREE.js
    // will automatically round it up and will distort the text.
    canvas.width = Spacecast3D.Utils.nearestPow2(textWidth)
    canvas.height = canvas.width
  	var context = canvas.getContext('2d')
    // set text font
  	context.font = "Bold " + fontSize + "px " + fontFace
  	// set text color
  	context.fillStyle = "rgba(255, 255, 0, 1.0)"
    // write text
  	context.fillText(text, 0, fontSize)

  	// canvas content used as texture
  	var texture = new THREE.Texture(canvas)
  	texture.needsUpdate = true
  	var spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    })
  	return new THREE.Sprite(spriteMaterial)
  },

  searchForStar: function(name) {
    return Spacecast3D.Setup.nearestStars[name].label
  },

  fillStarList: function(labels) {
    var starList = document.getElementById("spacecast3d-star-list")
    var names = labels.map(label => label.name)
    names.sort()
    names.forEach(function(name) {
      var entry = document.createElement('option')
      entry.setAttribute('value', name)
      starList.appendChild(entry)
    })
  },

  focusOnStar: function(starLabel) {
    this.resetCameraPositionForStar(starLabel.position)
    this.setStarInfo(starLabel.name, Spacecast3D.Setup.nearestStars[starLabel.name])
  },

  getTextWidth: function(text, fontSize, fontFace) {
    var canvas = document.createElement('canvas')
  	var context = canvas.getContext('2d')
  	context.font = "Bold " + fontSize + "px " + fontFace
  	return Spacecast3D.Utils.nearestPow2(context.measureText(text).width)
  },

  resetCameraPositionForPlanet: function(point, defaultMinDistance, minDistance) {
    var camera = Spacecast3D.State.universe.camera
    var orbitControls = Spacecast3D.State.orbitControls
    orbitControls.target = point
    var cameraSphericalPosition = new THREE.Spherical().setFromVector3(point)
    if (cameraSphericalPosition.radius == 0) {
      cameraSphericalPosition.radius = 1
    }
    cameraSphericalPosition.phi = (Math.PI / 2) - (minDistance/cameraSphericalPosition.radius) * 2
    cameraSphericalPosition.theta = (minDistance/cameraSphericalPosition.radius) * 2
    cameraSphericalPosition.radius += minDistance * 5
    camera.position.setFromSpherical(cameraSphericalPosition)

    orbitControls.minDistance = minDistance * 2
    Spacecast3D.State.defaultControlMinDistance = defaultMinDistance * 2
  },

  resetCameraPositionForStar: function(point) {
    var camera = Spacecast3D.State.universe.camera
    var orbitControls = Spacecast3D.State.orbitControls
    orbitControls.target = point
    camera.position.setFromSpherical(new THREE.Spherical().setFromVector3(point))
    orbitControls.minDistance = Spacecast3D.SPACECAST3D_LY * 2
  },

  displayInfo: function(camera) {
    this.fillStarList(Spacecast3D.State.nearestStarsLabels)

    var sunInfo = {
      descriptionSource: "https://en.wikipedia.org/wiki/Sun",
      description: 'Our home star.',
    }
    this.setStarInfo('Sun', sunInfo)
    this.updateInfo(camera)
    document.getElementById('canvas-spacecast3d').addEventListener('mousedown', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('wheel', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchstart', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchend', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchmove', () => {return this.updateInfo(camera)})
  },

  setStarInfo: function(name, info) {
    document.getElementById("spacecast3d-info-name").setAttribute("placeholder", name)
    document.getElementById("spacecast3d-info-description").innerHTML =
      info.description != null ? info.description : "None."
    var link = document.getElementById("spacecast3d-info-link")
    if (info.descriptionSource != null) {
      link.innerHTML = "More information"
      link.setAttribute('href', info.descriptionSource)
    } else {
      link.innerHTML = null
    }
  },

  uiController: function(container) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var text = {
      'Date': '12/26/2012',
      'Distance (light-year)': 0.0001,
      'Reference': 'Sun',
      'Planets size': 1.00,
      'Show Milky Way': false,
      'Show central plane': false,
    }
    var gui = new dat.GUI({autoPlace: false, closeOnTop: true})
    gui.add(text, 'Date')
    gui.add(text, 'Distance (light-year)', 0.0001, 10000)
    .onChange(function(distanceLightYear) {
      var cameraSphericalPosition = new THREE.Spherical().setFromVector3(state.universe.camera.position)
      cameraSphericalPosition.radius = distanceLightYear * Spacecast3D.SPACECAST3D_LY
      state.universe.camera.position.setFromSpherical(cameraSphericalPosition)
    })
    gui.add(text, 'Reference', ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'])
    .onChange((planet) => {
      var camera = state.universe.camera
      var orbitControls = state.orbitControls
      switch (planet) {
        case 'Sun':
          var sun = state.solarSystem.sun.getObjectByName('star')
          var box = new THREE.Box3().setFromObject(sun)
          this.resetCameraPositionForPlanet(sun.position, setup.solarSystem.sun.radius, box.getSize().x/2)
          break
        case 'Mercury':
          var mercury = state.solarSystem.mercury.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(mercury)
          this.resetCameraPositionForPlanet(mercury.position, setup.solarSystem.mercury.radius, box.getSize().x/2)
          break
        case 'Venus':
          var venus = state.solarSystem.venus.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(venus)
          this.resetCameraPositionForPlanet(venus.position, setup.solarSystem.venus.radius, box.getSize().x/2)
          break
        case 'Earth':
          var earth = state.solarSystem.earth.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(earth)
          this.resetCameraPositionForPlanet(earth.position, setup.solarSystem.earth.radius, box.getSize().x/2)
          break
        case 'Mars':
          var mars = state.solarSystem.mars.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(mars)
          this.resetCameraPositionForPlanet(mars.position, setup.solarSystem.mars.radius, box.getSize().x/2)
          break
        case 'Jupiter':
          var jupiter = state.solarSystem.jupiter.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(jupiter)
          this.resetCameraPositionForPlanet(jupiter.position, setup.solarSystem.jupiter.radius, box.getSize().x/2)
          break
        case 'Saturn':
          var saturn = state.solarSystem.saturn.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(saturn)
          this.resetCameraPositionForPlanet(saturn.position, setup.solarSystem.saturn.radius, box.getSize().x/2)
          break
        case 'Uranus':
          var uranus = state.solarSystem.uranus.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(uranus)
          this.resetCameraPositionForPlanet(uranus.position, setup.solarSystem.uranus.radius, box.getSize().x/2)
          break
        case 'Neptune':
          var neptune = state.solarSystem.neptune.getObjectByName('planet')
          var box = new THREE.Box3().setFromObject(neptune)
          this.resetCameraPositionForPlanet(neptune.position, setup.solarSystem.neptune.radius, box.getSize().x/2)
          break
      }
    })
    gui.add(text, 'Planets size', 1, 4000)
    .onChange((scale) => {
      this.resizePlanets(scale)
    })
    gui.add(text, 'Show Milky Way').onChange(function(value) {
      if (value) {
        state.universe.scene.add(state.milkyWay)
      } else {
        state.universe.scene.remove(state.milkyWay)
      }
    })
    gui.add(text, 'Show central plane').onChange(function(value) {
      if (value) {
        state.universe.scene.add(state.centralPlane)
      } else {
        state.universe.scene.remove(state.centralPlane)
      }
    })
    gui.width = 400
    state.datGUI = gui
    return gui.domElement
  },

  updateInfo: function(camera) {
    var x = camera.position.x
    var y = camera.position.y
    var z = camera.position.z
    var distance = Math.sqrt(x*x + y*y + z*z)
    var distanceDisplay = document.getElementById("spacecast3d-info-distance")
    if (distance < Spacecast3D.SPACECAST3D_LY*0.001) {
      distanceDisplay.innerHTML = Math.trunc(distance*7917).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' miles'
    } else {
      distanceDisplay.innerHTML = Math.trunc(distance/Spacecast3D.SPACECAST3D_LY).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' light-years'
      Spacecast3D.State.datGUI.__controllers.find((controller) => {return controller.property === 'Distance (light-year)'}).setValue(distance/Spacecast3D.SPACECAST3D_LY)
    }
  },
}

Spacecast3D.Core = {
  init: function() {
    var state = Spacecast3D.State
    var universe = Spacecast3D.Helper.createUniverse()
    document.getElementById('spacecast-controls').appendChild(Spacecast3D.Helper.uiController())
    Spacecast3D.Helper.displayInfo(universe.camera)
    state.onRenderFunctions.push(() => { universe.renderer.render(universe.scene, universe.camera) })
    state.onRenderFunctions.push(() => { universe.controls.update() })
    this.update(universe)
  },

  update: function(universe) {
    requestAnimationFrame((nowMilliSec) => {
      var state = Spacecast3D.State
    	var deltaMilliSec	= Math.min(200, nowMilliSec - state.lastTimeMilliSec)
    	state.lastTimeMilliSec	= nowMilliSec
      Spacecast3D.State.onRenderFunctions.map((onRenderFunction) => {
        onRenderFunction(deltaMilliSec, nowMilliSec)
      })
      this.update(universe, nowMilliSec)
    })
  },
}

window.onload = function() {Spacecast3D.Core.init()}
