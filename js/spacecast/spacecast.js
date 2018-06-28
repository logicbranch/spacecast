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
    aCentauri: {
      name: 'Alpha Centauri',
      // see: https://en.wikipedia.org/wiki/Alpha_Centauri
      description: 'Alpha Centauri is the nearest star to the Solar System. It is actually three stars locked in orbit, called Alpha Centauri A, B, and C. Alpha Centauri C is a red dwarf, much dimmer than the other two. A and B make Alpha Centauri the brightest star in the Centaurus constellation.',
      dis: Spacecast3D.Utils.dis(4.2421), // distance: 4.2421 light-years
      asc: Spacecast3D.Utils.asc(14, 29, 43), // right ascension: 14h 29m 43.0s
      dec: Spacecast3D.Utils.dec(62, 40, 46, true), // declination: −62° 40′ 46″
    },
    barnard: {
      name: 'Barnard',
      // see: https://en.wikipedia.org/wiki/Barnard%27s_Star
      description: 'Barnard is a small red dwarf star in the constellation Ophiuchus. It is too dim to be seen with the naked eye.',
      dis: Spacecast3D.Utils.dis(5.9630), // distance: 5.9630 light-years
      asc: Spacecast3D.Utils.asc(17, 29, 43), // right ascension: 17h 57m 48.5s
      dec: Spacecast3D.Utils.dec(4, 41, 36), // declination: +04° 41′ 36″
    },
    luhman16: {
      name: 'Luhman 16',
      // see: https://en.wikipedia.org/wiki/Luhman_16
      description: 'Luhman 16 is not really a star at all, but a pair of orbiting brown dwarfs. These bodies are too small to be stars, but each one is still about thirty times the mass of Jupiter.',
      dis: Spacecast3D.Utils.dis(6.59), // distance: 6.59 light-years
      asc: Spacecast3D.Utils.asc(10, 49, 15.57), // right ascension: 10h 49m 15.57s
      dec: Spacecast3D.Utils.dec(53, 29, 06), // declination: 10h 49m 15.57s
    },
    wolf359: {
      name: 'Wolf 359',
      // see: https://en.wikipedia.org/wiki/Wolf_359
      description: 'Wolf 359 is a red dwarf in the constellation Leo. It is invisible to the naked eye, being one of the faintest stars known along with one of the smallest.',
      dis: Spacecast3D.Utils.dis(7.7825), // distance: 7.7825 light-years
      asc: Spacecast3D.Utils.asc(10, 56, 29.2), // right ascension: 10h 56m 29.2s
      dec: Spacecast3D.Utils.dec(7, 0, 53), // declination: +07° 00′ 53″
    },
    lalande21185: {
      name: 'Lalande 21185',
      // see: https://en.wikipedia.org/wiki/Lalande_21185
      description: 'Lalande 21185 is a red dwarf in the constellation Ursa Major. It is the brightest red dwarf in the northern hemisphere. However, one still needs at least binoculars or a small telescope to observe this star.',
      dis: Spacecast3D.Utils.dis(8.2905), // distance: 8.2905 light-years
      asc: Spacecast3D.Utils.asc(11, 3, 20.2), // right ascension: 11h 03m 20.2s
      dec: Spacecast3D.Utils.dec(35, 58, 12), // declination: +35° 58′ 12″
    },
    sirius: {
      name: 'Sirius',
      // see: https://en.wikipedia.org/wiki/Sirius
      description: 'Sirius is the brightest star in our sky. It is a binary system consisting of Sirius A and Sirius B. Sirius A, which creates most of the light, is twice the mass of our sun. Sirius B, on the other hand, is a white dwarf, the faded core left after a supernova.',
      dis: Spacecast3D.Utils.dis(8.5828), // distance: 8.5828 light-years
      asc: Spacecast3D.Utils.asc(6, 45, 8.9), // right ascension: 06h 45m 08.9s
      dec: Spacecast3D.Utils.dec(16, 42, 58, true), // declination: −16° 42′ 58″
    },
    luyten7268: {
      name: 'Luyten 726-8',
      // see: https://en.wikipedia.org/wiki/Luyten_726-8
      description: 'Star system Luyten 726-8 consists of two stars of very similar brightness. Both are flare stars, occasionally increasing in brightness for a few minutes. Luyten 726-8B is especially remarkable in this respect.',
      dis: Spacecast3D.Utils.dis(8.7280), // distance: 8.7280 light-years
      asc: Spacecast3D.Utils.asc(1, 39, 1.3), // right ascension: 01h 39m 01.3s
      dec: Spacecast3D.Utils.dec(17, 57, 01, true), // declination: −17° 57′ 01″
    },
    ross154: {
      name: 'Ross 154',
      // see: https://en.wikipedia.org/wiki/Ross_154
      description: 'Ross 154 is a red dwarf in the constellation Sagittarius. Although it is the closest star to the sun in its constellation, it is completely invisible to the unaided eye.',
      dis: Spacecast3D.Utils.dis(9.6813), // distance: 9.6813 light-years
      asc: Spacecast3D.Utils.asc(18, 49, 49.4), // right ascension: 18h 49m 49.4s
      dec: Spacecast3D.Utils.dec(23, 50, 10, true) // declination: −23° 50′ 10″
    },
    ross248: {
      name: 'Ross 248',
      // see: https://en.wikipedia.org/wiki/Ross_248
      description: 'Ross 248 is a red dwarf too dim to be seen without visual assistance. It slightly fluctuates in brightness, which is attributed to spots on its photosphere.',
      dis: Spacecast3D.Utils.dis(10.322), // distance: 10.322 light-years
      asc: Spacecast3D.Utils.asc(23, 41, 54.7), // right ascension: 23h 41m 54.7s
      dec: Spacecast3D.Utils.dec(44, 10, 30) // declination: +44° 10′ 30″
    },
    epsilonEridani: {
      name: 'Epsilon Eridani',
      // see: https://en.wikipedia.org/wiki/Epsilon_Eridani
      description: 'Epsilon Eridani is a star residing in the constellation Eridanus. It is somewhat smaller than the sun, and is less than one billion years old. Being still young, its solar wind is thirty times stronger than that of the sun.',
      dis: Spacecast3D.Utils.dis(10.522), // distance: 10.522 light-years
      asc: Spacecast3D.Utils.asc(3, 32, 55.8), // right ascension: 03h 32m 55.8s
      dec: Spacecast3D.Utils.dec(9, 27, 30, true) // declination: −09° 27′ 30″
    },
    lacaille9352: {
      name: 'Lacaille 9352',
      // see: https://en.wikipedia.org/wiki/Lacaille_9352
      description: 'Lacaille 9352 is the closest star in the constellation Piscis Austrinus. However, it is still imperceptible to the naked eye.',
      dis: Spacecast3D.Utils.dis(10.742), // distance: 10.742 light-years
      asc: Spacecast3D.Utils.asc(23, 5, 52), // right ascension: 23h 05m 52.0s
      dec: Spacecast3D.Utils.dec(35, 51, 11, true) // declination: −35° 51′ 11″
    },
    ross128: {
      name: 'Ross 128',
      // see: https://en.wikipedia.org/wiki/Ross_128
      description: 'Ross 128 is a faint red dwarf in the constellation Virgo. It harbors a planet called Ross 128 b, which was the second exoplanet discovered. The roughly Earth-sized planet lies in the habitable zone of the star, and is a prime candidate for life.',
      dis: Spacecast3D.Utils.dis(10.919), // distance: 10.919 light-years
      asc: Spacecast3D.Utils.asc(11, 47, 44.4), // right ascension: 11h 47m 44.4s
      dec: Spacecast3D.Utils.dec(0, 48, 16) // declination: +00° 48′ 16″
    },
    wise15067027: {
      name: 'Wise 1506 7027',
      // see: https://en.wikipedia.org/wiki/WISE_1506%2B7027
      description: 'Wise 1506 7027 is a sub-stellar brown dwarf in the constellation Ursa Minor.',
      dis: Spacecast3D.Utils.dis(11.089), // distance: 11.089 light-years
      asc: Spacecast3D.Utils.asc(15, 6, 49.9), // right ascension: 15h 06m 49.9s
      dec: Spacecast3D.Utils.dec(70, 27, 36) // declination: +70° 27′ 36″
    },
    ezAquarii: {
      name: 'Ez Aquarii',
      dis: Spacecast3D.Utils.dis(11.266), // distance: 11.266 light-years
      asc: Spacecast3D.Utils.asc(22, 38, 33.4), // right ascension: 22h 38m 33.4s
      dec: Spacecast3D.Utils.dec(15, 17, 57, true) // declination: −15° 17′ 57″
    },
    procyon: {
      name: 'Procyon',
      dis: Spacecast3D.Utils.dis(11.402), // distance: 11.402 light-years
      asc: Spacecast3D.Utils.asc(7, 39, 18.1), // right ascension: 07h 39m 18.1s
      dec: Spacecast3D.Utils.dec(5, 13, 30) // declination: +05° 13′ 30″
    },
    _61cyngi: {
      name: '61 Cyngi',
      dis: Spacecast3D.Utils.dis(11.403), // distance: 11.403 light-years
      asc: Spacecast3D.Utils.asc(21, 6, 53.9), // right ascension: 21h 06m 53.9s
      dec: Spacecast3D.Utils.dec(38, 44, 58) // declination: +38° 44′ 58″
    },
    struve2398: {
      name: 'Struve 2398',
      dis: Spacecast3D.Utils.dis(11.525), // distance: 11.525 light-years
      asc: Spacecast3D.Utils.asc(18, 42, 46.7), // right ascension: 18h 42m 46.7s
      dec: Spacecast3D.Utils.dec(59, 37, 49) // declination: +59° 37′ 49″
    },
    groombridge34: {
      name: 'Groombridge 34',
      dis: Spacecast3D.Utils.dis(11.624), // distance: 11.624 light-years
      asc: Spacecast3D.Utils.asc(0, 18, 22.9), // right ascension: 0h 18m 22.9s
      dec: Spacecast3D.Utils.dec(44, 1, 23) // declination: +44° 01′ 23″
    },
    epsilonIndi: {
      name: 'Epsilon Indi',
      dis: Spacecast3D.Utils.dis(11.824), // distance: 11.824 light-years
      asc: Spacecast3D.Utils.asc(22, 03, 21.7), // right ascension: 22h 03m 21.7s
      dec: Spacecast3D.Utils.dec(56, 47, 10) // declination: −56° 47′ 10″
    },
    dxCancri: {
      name: 'Dx Cancri',
      dis: Spacecast3D.Utils.dis(11.826), // distance: 11.826 light-years
      asc: Spacecast3D.Utils.asc(8, 29, 49.5), // right ascension: 08h 29m 49.5s
      dec: Spacecast3D.Utils.dec(26, 46, 37) // declination: +26° 46′ 37″
    },
    tauCeti: {
      name: 'Tau Ceti',
      dis: Spacecast3D.Utils.dis(11.887), // distance: 11.887 light-years
      asc: Spacecast3D.Utils.asc(1, 44, 4.1), // right ascension: 01h 44m 04.1s
      dec: Spacecast3D.Utils.dec(15, 56, 15, true) // declination: −15° 56′ 15″
    },
    gj1061: {
      name: 'GJ 1061',
      dis: Spacecast3D.Utils.dis(11.991), // distance: 11.991 light-years
      asc: Spacecast3D.Utils.asc(3, 35, 59.7), // right ascension: 03h 35m 59.7s
      dec: Spacecast3D.Utils.dec(44, 30, 45, true) // declination: −44° 30′ 45″
    },
    wise03505658: {
      name: 'Wise 0350-5658',
      dis: Spacecast3D.Utils.dis(12.068), // distance: 12.068 light-years
      asc: Spacecast3D.Utils.asc(3, 50, .32), // right ascension: 03h 50m 00.32s
      dec: Spacecast3D.Utils.dec(56, 58, 30.2, true) // declination: −56° 58′ 30.2″
    },
    yzCeti: {
      name: 'YZ Ceti',
      dis: Spacecast3D.Utils.dis(12.132), // distance: 12.132 light-years
      asc: Spacecast3D.Utils.asc(1, 12, 30.6), // right ascension: 01h 12m 30.6s
      dec: Spacecast3D.Utils.dec(16, 59, 56, true) // declination: −16° 59′ 56″
    },
    luytensStar: {
      name: 'Luytens Star',
      dis: Spacecast3D.Utils.dis(12.366), // distance: 12.366 light-years
      asc: Spacecast3D.Utils.asc(7, 27, 24.5), // right ascension: 07h 27m 24.5s
      dec: Spacecast3D.Utils.dec(5, 13, 33) // declination: +05° 13′ 33″
    },
    teegardensStar: {
      name: 'Teegardens Star',
      dis: Spacecast3D.Utils.dis(12.514), // distance: 12.514 light-years
      asc: Spacecast3D.Utils.asc(2, 53, .9), // right ascension: 02h 53m 00.9s
      dec: Spacecast3D.Utils.dec(16, 52, 53) // declination: +16° 52′ 53″
    },
    scr18456357: {
      name: 'SCR 1845-6357',
      dis: Spacecast3D.Utils.dis(12.571), // distance: 12.571 light-years
      asc: Spacecast3D.Utils.asc(18, 45, 5.3), // right ascension: 18h 45m 05.3s
      dec: Spacecast3D.Utils.dec(63, 57, 48, true) // declination: −63° 57′ 48″
    },
    kapteynsStar: {
      name: 'Kapteyns Star',
      dis: Spacecast3D.Utils.dis(12.777), // distance: 12.777 light-years
      asc: Spacecast3D.Utils.asc(5, 11, 40.6), // right ascension: 05h 11m 40.6s
      dec: Spacecast3D.Utils.dec(45, 1, 6, true) // declination: −45° 01′ 06″
    },
    lacaille8760: {
      name: 'Lacaille 8760',
      dis: Spacecast3D.Utils.dis(12.870), // distance: 12.870 light-years
      asc: Spacecast3D.Utils.asc(21, 17, 15.3), // right ascension: 21h 17m 15.3s
      dec: Spacecast3D.Utils.dec(38, 52, 3, true) // declination: −38° 52′ 03″
    },
    wise05357500: {
      name: 'Wise 0535-7500',
      dis: Spacecast3D.Utils.dis(13.0), // distance: 13.0 light-years
      asc: Spacecast3D.Utils.asc(5, 35, 16.8), // right ascension: 05h 35m 16.8s
      dec: Spacecast3D.Utils.dec(75, 0, 24.9, true) // declination: −75° 00′ 24.9″
    },
    kruger60: {
      name: 'Kruger 60',
      dis: Spacecast3D.Utils.dis(13.149), // distance: 13.149 light-years
      asc: Spacecast3D.Utils.asc(22, 27, 59.5), // right ascension: 22h 27m 59.5s
      dec: Spacecast3D.Utils.dec(57, 41, 45) // declination: +57° 41′ 45″
    },
    den10483956: {
      name: 'DEN 1048 3956',
      dis: Spacecast3D.Utils.dis(13.167), // distance: 13.167 light-years
      asc: Spacecast3D.Utils.asc(10, 48, 14.7), // right ascension: 10h 48m 14.7s
      dec: Spacecast3D.Utils.dec(39, 56, 6, true) // declination: −39° 56′ 06″
    },
    ugps072205: {
      name: 'UGPS 0722-05',
      dis: Spacecast3D.Utils.dis(13.259), // distance: 13.259 light-years
      asc: Spacecast3D.Utils.asc(7, 22, 27.3), // right ascension: 07h 22m 27.3s
      dec: Spacecast3D.Utils.dec(5, 40, 30, true) // declination: –05° 40′ 30″
    },
    ross614: {
      name: 'Ross 614',
      dis: Spacecast3D.Utils.dis(13.349), // distance: 13.349 light-years
      asc: Spacecast3D.Utils.asc(6, 29, 23.4), // right ascension: 06h 29m 23.4s
      dec: Spacecast3D.Utils.dec(2, 48, 50, true) // declination: −02° 48′ 50″
    },
    wolf1061: {
      name: 'Wolf 1061',
      dis: Spacecast3D.Utils.dis(13.820), // distance: 13.820 light-years
      asc: Spacecast3D.Utils.asc(16, 30, 18.1), // right ascension: 16h 30m 18.1s
      dec: Spacecast3D.Utils.dec(12, 39, 45, true) // declination: −12° 39′ 45″
    },
    vanMaanensStar: {
      name: 'Van Maanens Star',
      dis: Spacecast3D.Utils.dis(14.066), // distance: 14.066 light-years
      asc: Spacecast3D.Utils.asc(0, 49, 9.9), // right ascension: 00h 49m 09.9s
      dec: Spacecast3D.Utils.dec(5, 23, 19) // declination: +05° 23′ 19″
    },
    gliese1: {
      name: 'Gliese 1',
      dis: Spacecast3D.Utils.dis(14.231), // distance: 14.231 light-years
      asc: Spacecast3D.Utils.asc(0, 5, 24.4), // right ascension: 00h 05m 24.4s
      dec: Spacecast3D.Utils.dec(37, 21, 27, true) // declination: −37° 21′ 27″
    },
    wolf424: {
      name: 'Wolf 424',
      dis: Spacecast3D.Utils.dis(14.312), // distance: 14.312 light-years
      asc: Spacecast3D.Utils.asc(12, 33, 17.2), // right ascension: 12h 33m 17.2s
      dec: Spacecast3D.Utils.dec(9, 1, 15) // declination: +09° 01′ 15″
    },
    _2massJ154043: {
      name: '2MASS J154043',
      dis: Spacecast3D.Utils.dis(14.4), // distance: 14.4 light-years
      asc: Spacecast3D.Utils.asc(15, 40, 43.42), // right ascension: 15h 40m 43.42s
      dec: Spacecast3D.Utils.dec(51, 1, 35.7, true) // declination: −51° 01′ 35.7″
    },
    l115916: {
      name: 'L 1159-16',
      dis: Spacecast3D.Utils.dis(14.509), // distance: 14.509 light-years
      asc: Spacecast3D.Utils.asc(2, 0, 13.2), // right ascension: 02h 00m 13.2s
      dec: Spacecast3D.Utils.dec(13, 3, 8) // declination: +13° 03′ 08″
    },
    gliese687: {
      name: 'Gliese 687',
      dis: Spacecast3D.Utils.dis(14.793), // distance: 14.793 light-years
      asc: Spacecast3D.Utils.asc(17, 36, 25.9), // right ascension: 17h 36m 25.9s
      dec: Spacecast3D.Utils.dec(68, 20, 21) // declination: +68° 20′ 21″
    },
    lhs292: {
      name: 'LHS 292',
      dis: Spacecast3D.Utils.dis(14.805), // distance: 14.805 light-years
      asc: Spacecast3D.Utils.asc(10, 48, 12.6), // right ascension: 10h 48m 12.6s
      dec: Spacecast3D.Utils.dec(11, 20, 14, true) // declination: −11° 20′ 14″
    },
    gliese674: {
      name: 'Gliese 674',
      dis: Spacecast3D.Utils.dis(14.809), // distance: 14.809 light-years
      asc: Spacecast3D.Utils.asc(17, 28, 39.9), // right ascension: 17h 28m 39.9s
      dec: Spacecast3D.Utils.dec(46, 53, 43, true) // declination: −46° 53′ 43″
    },
    g20844: {
      name: 'G 208-44',
      dis: Spacecast3D.Utils.dis(14.812), // distance: 14.812 light-years
      asc: Spacecast3D.Utils.asc(19, 53, 54.2), // right ascension: 19h 53m 54.2s
      dec: Spacecast3D.Utils.dec(44, 24, 55) // declination: +44° 24′ 55″
    },
    lp145141: {
      name: 'LP 145-141',
      dis: Spacecast3D.Utils.dis(15.060), // distance: 15.060 light-years
      asc: Spacecast3D.Utils.asc(11, 45, 42.9), // right ascension: 11h 45m 42.9s
      dec: Spacecast3D.Utils.dec(64, 50, 29, true) // declination: −64° 50′ 29″
    },
    gj1002: {
      name: 'GJ 1002',
      dis: Spacecast3D.Utils.dis(15.313), // distance: 15.313 light-years
      asc: Spacecast3D.Utils.asc(0, 6, 43.8), // right ascension: 00h 06m 43.8s
      dec: Spacecast3D.Utils.dec(7, 32, 22, true) // declination: −07° 32′ 22″
    },
    gliese876: {
      name: 'Gliese 876',
      dis: Spacecast3D.Utils.dis(15.342), // distance: 15.342 light-years
      asc: Spacecast3D.Utils.asc(22, 53, 16.7), // right ascension: 22h 53m 16.7s
      dec: Spacecast3D.Utils.dec(14, 15, 49, true) // declination: −14° 15′ 49″
    },
    lhs288: {
      name: 'LHS 288',
      dis: Spacecast3D.Utils.dis(15.610), // distance: 15.610 light-years
      asc: Spacecast3D.Utils.asc(10, 44, 21.2), // right ascension: 10h 44m 21.2s
      dec: Spacecast3D.Utils.dec(61, 12, 36, true) // declination: −61° 12′ 36″
    },
    gliese412: {
      name: 'Gliese 412',
      dis: Spacecast3D.Utils.dis(15.832), // distance: 15.832 light-years
      asc: Spacecast3D.Utils.asc(11, 5, 28.6), // right ascension: 11h 05m 28.6s
      dec: Spacecast3D.Utils.dec(43, 31, 36) // declination: +43° 31′ 36″
    },
    groombridge1618: {
      name: 'Groombridge 1618',
      dis: Spacecast3D.Utils.dis(15.848), // distance: 15.848 light-years
      asc: Spacecast3D.Utils.asc(10, 11, 22.1), // right ascension: 10h 11m 22.1s
      dec: Spacecast3D.Utils.dec(49, 27, 15) // declination: +49° 27′ 15″
    },
    adLeonis: {
      name: 'AD Leonis',
      dis: Spacecast3D.Utils.dis(15.942), // distance: 15.942 light-years
      asc: Spacecast3D.Utils.asc(10, 19, 36.4), // right ascension: 10h 19m 36.4s
      dec: Spacecast3D.Utils.dec(19, 52, 10) // declination: +19° 52′ 10″
    },
    denisJ081730: {
      name: 'Denis J081730',
      dis: Spacecast3D.Utils.dis(16.067), // distance: 16.067 light-years
      asc: Spacecast3D.Utils.asc(8, 17, 30.1), // right ascension: 08h 17m 30.1s
      dec: Spacecast3D.Utils.dec(61, 55, 16, true) // declination: −61° 55′ 16″
    },
    gliese832: {
      name: 'Gliese 832',
      dis: Spacecast3D.Utils.dis(16.085), // distance: 16.085 light-years
      asc: Spacecast3D.Utils.asc(21, 33, 34), // right ascension: 21h 33m 34.0s
      dec: Spacecast3D.Utils.dec(49, 0, 32, true) // declination: −49° 00′ 32″
    },
    den02554700: {
      name: 'DEN 0255-4700',
      dis: Spacecast3D.Utils.dis(16.197), // distance: 16.197 light-years
      asc: Spacecast3D.Utils.asc(2, 55, 3.7), // right ascension: 02h 55m 03.7s
      dec: Spacecast3D.Utils.dec(47, 0, 52, true) // declination: −47° 00′ 52″
    },
    gj1005: {
      name: 'GJ 1005',
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
      var starLabel = intersects[0].object;
      Spacecast3D.Helper.resetCameraPositionForStar(starLabel.position)

      // load star information
      var starInfo = Spacecast3D.Setup.nearestStars[starLabel.name]
      // show star information
      Spacecast3D.Helper.setStarInfo(starInfo)
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
  		imageTrans.src	= '/images/earthcloudmaptrans.jpg'
  	}, false)
  	imageMap.src	= '/images/earthcloudmap.jpg'

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
    var sunMaterial	= new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('/images/sunmap.jpg'),})
    var sun = this.createSphere(radius, sunMaterial)
    sun.name = 'star'

    var sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('/images/sunsprite.png'),
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
  		map	: new THREE.TextureLoader().load('/images/mercurymap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('/images/mercurybump.jpg'),
  		bumpScale	: 0.1,
  	})
    return this.createPlanet(mercuryMaterial, radius, orbitRadius)
  },

  createVenus: function(radius, orbitRadius) {
    var venusMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('/images/venusmap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('/images/venusbump.jpg'),
  		bumpScale	: 0.1,
  	})
    return this.createPlanet(venusMaterial, radius, orbitRadius)
  },

  createEarth: function(radius, orbitRadius) {
    var earthMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('/images/earthmap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('/images/earthbump.jpg'),
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
  		map	: new THREE.TextureLoader().load('/images/marsmap.jpg'),
  		bumpMap	: new THREE.TextureLoader().load('/images/marsbump.jpg'),
  		bumpScale	: 0.1,
  	})
    return this.createPlanet(marsMaterial, radius, orbitRadius)
  },

  createJupiter: function(radius, orbitRadius) {
    var jupiterMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('/images/jupitermap.jpg'),
  	})
    return this.createPlanet(jupiterMaterial, radius, orbitRadius)
  },

  createSaturn: function(radius, orbitRadius) {
    var saturnMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('/images/saturnmap.jpg'),
  	})
    return this.createPlanet(saturnMaterial, radius, orbitRadius)
  },

  createUranus: function(radius, orbitRadius) {
    var uranusMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('/images/uranusmap.jpg'),
  	})
    return this.createPlanet(uranusMaterial, radius, orbitRadius)
  },

  createNeptune: function(radius, orbitRadius) {
    var neptuneMaterial	= new THREE.MeshPhongMaterial({
  		map	: new THREE.TextureLoader().load('/images/neptunemap.jpg'),
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
  		map	: new THREE.TextureLoader().load('/images/galaxy.jpg'),
  		side	: THREE.BackSide
  	})
  	var geometry	= new THREE.SphereGeometry(radius, 32, 32)
  	return new THREE.Mesh(geometry, material)
  },

  createStar: function(position) {
    var star = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('/images/starsprite.png'),
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
      label = this.createStarLabel(starData.name)
      label.name = key
      label.scale.x = 55000*Spacecast3D.SPACECAST3D_AU
      label.scale.y = 55000*Spacecast3D.SPACECAST3D_AU
      label.scale.z = 1
      label.position.setFromSpherical(position)
      nearestStars.add(star)
      nearestStars.add(label)
      Spacecast3D.State.nearestStarsLabels.push(label)
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
    var sunInfo = {
      name: 'Sun',
      description: 'Our home star.',
    }
    this.setStarInfo(sunInfo)
    this.updateInfo(camera)
    document.getElementById('canvas-spacecast3d').addEventListener('mousedown', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('wheel', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchstart', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchend', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchmove', () => {return this.updateInfo(camera)})
  },

  setStarInfo: function(info) {
    document.getElementById("spacecast3d-info-name").innerHTML = info.name
    document.getElementById("spacecast3d-info-description").innerHTML =
      info.description != null ? info.description : "None."
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
