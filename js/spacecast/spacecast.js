var Spacecast3D = Spacecast3D || {}

// constants
Spacecast3D.EARTH_DIAMETER = 1, // earth diameter
Spacecast3D.SPACECAST3D_MILE = Spacecast3D.EARTH_DIAMETER / 7917, // 1 mile
Spacecast3D.SPACECAST3D_AU = Spacecast3D.EARTH_DIAMETER * 11740,   // 1 astronomical unit
Spacecast3D.SPACECAST3D_LY = Spacecast3D.SPACECAST3D_AU * 63241,   // 1 light year
Spacecast3D.MILKY_WAY_RADIUS = Spacecast3D.SPACECAST3D_LY * 100000, // 100k light year
Spacecast3D.SPACECAST3D_MS = 1, // millisecond
Spacecast3D.SPACECAST3D_SEC = Spacecast3D.SPACECAST3D_MS * 1000 // 1 second
Spacecast3D.SPACECAST3D_MIN = Spacecast3D.SPACECAST3D_SEC * 60 // 1 minute
Spacecast3D.SPACECAST3D_HOUR = Spacecast3D.SPACECAST3D_MIN * 60 // 1 hour
Spacecast3D.SPACECAST3D_DAY = Spacecast3D.SPACECAST3D_HOUR * 24 // 1 earth day
Spacecast3D.SPACECAST3D_YEAR = Spacecast3D.SPACECAST3D_DAY * 365, // 1 earth year
Spacecast3D.KEYCODE_ENTER = 13
Spacecast3D.KEYCODE_SPACE = 32
Spacecast3D.IMAGES_DIR = './images/'

Spacecast3D.Utils = {
  // convert light year to earth diameter (spacecast basic unit of distance)
  dis: function(n) {
    return n * Spacecast3D.SPACECAST3D_LY
  },

  // Convert degrees to radians
  radians: function(d) {
    return d * (Math.PI/180)
  },

  // calculate ascention in radians
  asc: function(h, m, s) {
    var hDeg = h * 360 / 24
    var mDeg = m * 30 / 60
    var sDeg = s * .5 / 60
    var degrees = hDeg + mDeg + sDeg
    return this.radians(degrees)
  },

  // calculate declination in radians
  dec: function(d, m, s, isNegative) {
    var degrees = d + (m / 60) + (s / 3600)
    if (isNegative) {
      degrees = 90 + degrees
    } else {
      degrees = 90 - degrees
    }
    return this.radians(degrees) // convert degrees to radians
  },

  // Rotate an Object3D by a given right ascension and declination
  rotateObject: function(object, asc, dec) {
    var decAxis = new THREE.Vector3().setFromCylindrical(new THREE.Cylindrical(1, asc + Math.PI / 2, 0))
    object.rotateOnAxis(decAxis, dec)
    object.rotateY(asc)
  },

  // find next closest power of 2 of a number
  nearestPow2: function(number){
    return Math.pow(2, Math.ceil(Math.log(number) / Math.log(2)))
  },

  // Convert a date to a concise string representation
  dateToConciseString: function(date) {
    return date.toISOString().substr(0, 10);
  },

  timeBetween: function(beginning, after) {
    return after.getTime() - beginning.getTime();
  },

  // Fit an integer within the range [0, size)
  fit: function(n, size) {
    var fitted = n % size
    return fitted >= 0 ? fitted : size + fitted
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
    Sol: {
      radius: 432169 * Spacecast3D.SPACECAST3D_MILE,
      info: {
        description: "The sun is a white star around which Earth orbits. As such, it is hugely important in many aspects of our daily lives. Despite its color, the sun is often called a yellow dwarf. It has remained stable for over four billion years and will continue to do so for about five billion more. After this time, it will expand to become a red giant.",
        descriptionSource: "https://en.wikipedia.org/wiki/Sun",
      },
    },
    // Year lengths from https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html
    // TODO: higher precision year lengths
    Mercury: {
      radius: 1516 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 0.387 * Spacecast3D.SPACECAST3D_AU,
      year: 0.241 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"mercurymap.jpg",
      materialBumpMap: Spacecast3D.IMAGES_DIR+"mercurybump.jpg",
      info: {
        description: "Mercury is a rocky planet and the closest planet in the Solar System to our sun. Its year is only 88 earth days and it is tidally locked, always facing the sun. Its temperature varies 600°C celsius between night and day.",
        descriptionSource: "https://en.wikipedia.org/wiki/Mercury_(planet)",
      },
    },
    Venus: {
      radius: 1516 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 0.723 * Spacecast3D.SPACECAST3D_AU,
      year: 0.615 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"venusmap.jpg",
      materialBumpMap: Spacecast3D.IMAGES_DIR+"venusbump.jpg",
      info: {
        description: "While Venus is further from the sun than Mercury, its mean surface temperature of 462°C is much hotter. This is caused by its dense atmosphere, 92 times that of Earth, which has created a massive greenhouse effect. Many of its other characteristics, however, are similar to those of our homeworld.",
        descriptionSource: "https://en.wikipedia.org/wiki/Venus",
      },
    },
    Earth: {
      radius: Spacecast3D.EARTH_DIAMETER/2,
      orbitRadius: Spacecast3D.SPACECAST3D_AU,
      year: Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"earthmap.jpg",
      materialBumpMap: Spacecast3D.IMAGES_DIR+"earthbump.jpg",
      info: {
        description: "Earth is the home of humanity and the only place in the universe known to harbor life. This is allowed by a great number of factors, such as the right distance from the sun and plentiful liquid water. Life is theorized to have started 4.1 billion years ago when the planet was only 400 million years old. Over time, it diversified into countless species. Very recently, humans have risen to the top and have spread across the globe.",
        descriptionSource: "https://en.wikipedia.org/wiki/Earth",
      },
    },
    Mars: {
      radius: 2106 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 1.524 * Spacecast3D.SPACECAST3D_AU,
      year: 1.88 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"marsmap.jpg",
      materialBumpMap: Spacecast3D.IMAGES_DIR+"marsbump.jpg",
      info: {
        description: "Mars is a rocky planet smaller than Earth. Iron oxide gives it a red color. Its geology shows signs that it previously harbored liquid water on its surface before it lost most of its atmosphere, and therefore had potential for life. Because of this, there have been many missions to the red planet.",
        descriptionSource: "https://en.wikipedia.org/wiki/Mars",
      },
    },
    Jupiter: {
      radius: 43441 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 5.203 * Spacecast3D.SPACECAST3D_AU,
      year: 11.9 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"jupitermap.jpg",
      info: {
        description: "Jupiter is a gas giant with a mass 2.5 times that of all other planets in the solar system combined. Its turbulent atmosphere is filled with storms. One of these, the Great Red Spot, could fit Earth within it, and has been raging since at least 1831. Jupiter has many moons. One moon, Europa, is believed to hold a vast water ocean under its icy crust.",
        descriptionSource: "https://en.wikipedia.org/wiki/Jupiter",
      },
    },
    Saturn: {
      radius: 36184 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 9.539 * Spacecast3D.SPACECAST3D_AU,
      year: 29.4 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"saturnmap.jpg",
      info: {
        description: "Saturn is a gas giant further and smaller than Jupiter. Its huge rings are made of rocks and dust. Among its many moons are Enceladus, thought to have a deep subsurface water ocean, and Titan, the only moon in the Solar System with a substantial atmosphere.",
        descriptionSource: "https://en.wikipedia.org/wiki/Saturn",
      },
    },
    Uranus: {
      radius: 15759 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 19.18 * Spacecast3D.SPACECAST3D_AU,
      year: 83.7 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"uranusmap.jpg",
      info: {
        description: "Uranus is a frigid ice giant. Its atmospheric temperature drops as low as −224°C, making it the coldest in the Solar System. The poles of Uranus are tilted about 90° to where the equator is on other planets.",
        descriptionSource: "https://en.wikipedia.org/wiki/Uranus",
      },
    },
    Neptune: {
      radius: 15299 * Spacecast3D.SPACECAST3D_MILE,
      orbitRadius: 30.06 * Spacecast3D.SPACECAST3D_AU,
      year: 163.7 * Spacecast3D.SPACECAST3D_YEAR,
      materialMap: Spacecast3D.IMAGES_DIR+"neptunemap.jpg",
      info: {
        description: "Neptune, the most distant planet in the Solar System, is a cold ice giant slightly more massive than Uranus. It is invisible without visual aid, and was first observed in 1846. Neptune has the fastest winds of all the eight planets, reaching speeds up to 580 meters per second.",
        descriptionSource: "https://en.wikipedia.org/wiki/Neptune",
      },
    },
  },
  ellipticalOrbitMaterial: new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  }),
  ellipticalOrbiters: {
    // source: https://en.wikipedia.org/wiki/Pluto
    "Pluto": {
      aphelion: 49.305 * Spacecast3D.SPACECAST3D_AU,
      perihelion: 29.658 * Spacecast3D.SPACECAST3D_AU,
      perihelionArgument: Spacecast3D.Utils.radians(113.834),
      ascendingNode: Spacecast3D.Utils.radians(110.299),
      inclination: Spacecast3D.Utils.radians(17.16),
      eccentricity: 0.2488,
      period: 248.0 * Spacecast3D.SPACECAST3D_YEAR,
      lastPerihelion: new Date("September 5, 1989"),
    },
    // source: https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)
    "Ceres": {
      aphelion: 2.9773 * Spacecast3D.SPACECAST3D_AU,
      perihelion: 2.5577 * Spacecast3D.SPACECAST3D_AU,
      perihelionArgument: Spacecast3D.Utils.radians(72.5220),
      ascendingNode: Spacecast3D.Utils.radians(80.3293),
      inclination: Spacecast3D.Utils.radians(9.20),
      eccentricity: 0.075823,
      period: 4.60 * Spacecast3D.SPACECAST3D_YEAR,
      // source: https://in-the-sky.org/news.php?id=20180422_13_100
      lastPerihelion: new Date("April 22, 2018"),
    },
    // https://en.wikipedia.org/wiki/Halley%27s_Comet
    "Halley's Comet": {
      aphelion: 35.082 * Spacecast3D.SPACECAST3D_AU,
      perihelion: 0.586 * Spacecast3D.SPACECAST3D_AU,
      perihelionArgument: Spacecast3D.Utils.radians(111.33),
      ascendingNode: Spacecast3D.Utils.radians(58.42),
      inclination: Spacecast3D.Utils.radians(162.26),
      eccentricity: 0.96714,
      period: 75.32 * Spacecast3D.SPACECAST3D_YEAR,
      lastPerihelion: new Date("February 9, 1986"),
    },
    // source: https://en.wikipedia.org/wiki/3200_Phaethon
    "3200 Phaethon": {
      aphelion: 2.4025 * Spacecast3D.SPACECAST3D_AU,
      perihelion: 0.13991 * Spacecast3D.SPACECAST3D_AU,
      perihelionArgument: Spacecast3D.Utils.radians(322.17),
      ascendingNode: Spacecast3D.Utils.radians(58.42),
      inclination: Spacecast3D.Utils.radians(22.253),
      eccentricity: 0.88994,
      period: 1.433 * Spacecast3D.SPACECAST3D_YEAR,
      lastPerihelion: new Date("July 1, 2009"),
    },
    // source: https://en.wikipedia.org/wiki/Comet_Hale–Bopp
    "Comet Hale-Bopp": {
      aphelion: 370.8 * Spacecast3D.SPACECAST3D_AU,
      perihelion: 0.914 * Spacecast3D.SPACECAST3D_AU,
      // source: https://nssdc.gsfc.nasa.gov/planetary/halebopp.html
      perihelionArgument: Spacecast3D.Utils.radians(130.59),
      // source: https://nssdc.gsfc.nasa.gov/planetary/halebopp.html
      ascendingNode: Spacecast3D.Utils.radians(282.47),
      inclination: Spacecast3D.Utils.radians(89.4),
      eccentricity: 0.995086,
      period: 2526 * Spacecast3D.SPACECAST3D_YEAR,
      lastPerihelion: new Date("April 1, 1997"),
    },
    // source: https://en.wikipedia.org/wiki/Haumea
    "Haumea": {
      aphelion: 51.483 * Spacecast3D.SPACECAST3D_AU,
      perihelion: 34.952 * Spacecast3D.SPACECAST3D_AU,
      perihelionArgument: Spacecast3D.Utils.radians(240.20),
      ascendingNode: Spacecast3D.Utils.radians(121.79),
      inclination: Spacecast3D.Utils.radians(28.19),
      eccentricity: 0.19126,
      period: 284.12 * Spacecast3D.SPACECAST3D_YEAR,
      lastPerihelion: new Date("1850"),
    },
  },
  baseDate: new Date("1/1/2000"),
  beams: [
    {
      start: new Date("12/26/2012"),
      asc: Spacecast3D.Utils.asc(14, 29, 43), // right ascension: 14h 29m 43.0s
      dec: Spacecast3D.Utils.dec(62, 40, 46, true), // declination: −62° 40′ 46″
    },
    {
      start: new Date("8/7/2015"),
      asc: Spacecast3D.Utils.asc(17, 29, 43), // right ascension: 17h 57m 48.5s
      dec: Spacecast3D.Utils.dec(4, 41, 36), // declination: +04° 41′ 36″
    },
  ],
  milkyWayRadius: Spacecast3D.MILKY_WAY_RADIUS,
  renderer: {
    width: document.getElementById("explorer-view-content").offsetWidth,
    height: document.getElementById("explorer-view-content").offsetHeight,
    containerId: 'spacecast3d',
  },
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  bodiesLabel: {
    fontFace: 'Arial',
    fontSize: 128,
    baseColor: 'rgba(255,255,0,1)',
    activeColor: 'rgba(0,255,255,1)',
  },
  beamAngle: Spacecast3D.Utils.radians(30),
  beamCapMaterial: new THREE.MeshBasicMaterial({
    color: 'green',
    opacity: 0.24,
    side: THREE.DoubleSide,
    transparent: true,
  }),
  beamConeMaterial: new THREE.MeshBasicMaterial({
    color: 'green',
    opacity: 0.2,
    side: THREE.DoubleSide,
    transparent: true,
  }),
  beamDirection: {
    asc: Spacecast3D.Utils.asc(14, 29, 43), // right ascension: 14h 29m 43.0s
    dec: Spacecast3D.Utils.dec(62, 40, 46, true), // declination: −62° 40′ 46″
  },
  // see: https://en.wikipedia.org/wiki/List_of_nearest_stars_and_brown_dwarfs
  nearestStars: {
    "Alpha Centauri": {
      descriptionSource: "https://en.wikipedia.org/wiki/Alpha_Centauri",
      description: "Alpha Centauri is the nearest star to the Solar System. It is actually three stars locked in orbit, called Alpha Centauri A, B, and C. Alpha Centauri C is a red dwarf, much dimmer than the other two. A and B make Alpha Centauri the brightest star in the Centaurus constellation.",
      dis: Spacecast3D.Utils.dis(4.2421), // distance: 4.2421 light-years
      asc: Spacecast3D.Utils.asc(14, 29, 43), // right ascension: 14h 29m 43.0s
      dec: Spacecast3D.Utils.dec(62, 40, 46, true), // declination: −62° 40′ 46″
    },
    "Barnard": {
      descriptionSource: "https://en.wikipedia.org/wiki/Barnard%27s_Star",
      description: "Barnard is a small red dwarf star in the constellation Ophiuchus. It is too dim to be seen with the naked eye.",
      dis: Spacecast3D.Utils.dis(5.9630), // distance: 5.9630 light-years
      asc: Spacecast3D.Utils.asc(17, 29, 43), // right ascension: 17h 57m 48.5s
      dec: Spacecast3D.Utils.dec(4, 41, 36), // declination: +04° 41′ 36″
    },
    "Luhman 16": {
      descriptionSource: "https://en.wikipedia.org/wiki/Luhman_16",
      description: "Luhman 16 is not really a star at all, but a pair of orbiting brown dwarfs. These bodies are too small to be stars, but each one is still about thirty times the mass of Jupiter.",
      dis: Spacecast3D.Utils.dis(6.59), // distance: 6.59 light-years
      asc: Spacecast3D.Utils.asc(10, 49, 15.57), // right ascension: 10h 49m 15.57s
      dec: Spacecast3D.Utils.dec(53, 29, 06), // declination: 10h 49m 15.57s
    },
    "Wolf 359": {
      descriptionSource: "https://en.wikipedia.org/wiki/Wolf_359",
      description: "Wolf 359 is a red dwarf in the constellation Leo. It is invisible to the naked eye, being one of the faintest stars known along with one of the smallest.",
      dis: Spacecast3D.Utils.dis(7.7825), // distance: 7.7825 light-years
      asc: Spacecast3D.Utils.asc(10, 56, 29.2), // right ascension: 10h 56m 29.2s
      dec: Spacecast3D.Utils.dec(7, 0, 53), // declination: +07° 00′ 53″
    },
    "Lalande 21185": {
      descriptionSource: "https://en.wikipedia.org/wiki/Lalande_21185",
      description: "Lalande 21185 is a red dwarf in the constellation Ursa Major. It is the brightest red dwarf in the northern hemisphere. However, one still needs at least binoculars or a small telescope to observe this star.",
      dis: Spacecast3D.Utils.dis(8.2905), // distance: 8.2905 light-years
      asc: Spacecast3D.Utils.asc(11, 3, 20.2), // right ascension: 11h 03m 20.2s
      dec: Spacecast3D.Utils.dec(35, 58, 12), // declination: +35° 58′ 12″
    },
    "Sirius": {
      descriptionSource: "https://en.wikipedia.org/wiki/Sirius",
      description: "Sirius is the brightest star in our sky. It is a binary system consisting of Sirius A and Sirius B. Sirius A, which creates most of the light, is twice the mass of our sun. Sirius B, on the other hand, is a white dwarf, the faded core left after a supernova.",
      dis: Spacecast3D.Utils.dis(8.5828), // distance: 8.5828 light-years
      asc: Spacecast3D.Utils.asc(6, 45, 8.9), // right ascension: 06h 45m 08.9s
      dec: Spacecast3D.Utils.dec(16, 42, 58, true), // declination: −16° 42′ 58″
    },
    "Luyten 726-8": {
      descriptionSource: "https://en.wikipedia.org/wiki/Luyten_726-8",
      description: "Star system Luyten 726-8 consists of two stars of very similar brightness. Both are flare stars, occasionally increasing in brightness for a few minutes. Luyten 726-8B is especially remarkable in this respect.",
      dis: Spacecast3D.Utils.dis(8.7280), // distance: 8.7280 light-years
      asc: Spacecast3D.Utils.asc(1, 39, 1.3), // right ascension: 01h 39m 01.3s
      dec: Spacecast3D.Utils.dec(17, 57, 01, true), // declination: −17° 57′ 01″
    },
    "Ross 154": {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_154",
      description: "Ross 154 is a red dwarf in the constellation Sagittarius. Although it is the closest star to the sun in its constellation, it is completely invisible to the unaided eye.",
      dis: Spacecast3D.Utils.dis(9.6813), // distance: 9.6813 light-years
      asc: Spacecast3D.Utils.asc(18, 49, 49.4), // right ascension: 18h 49m 49.4s
      dec: Spacecast3D.Utils.dec(23, 50, 10, true) // declination: −23° 50′ 10″
    },
    "Ross 248": {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_248",
      description: "Ross 248 is a red dwarf too dim to be seen without visual assistance. It slightly fluctuates in brightness, which is attributed to spots on its photosphere.",
      dis: Spacecast3D.Utils.dis(10.322), // distance: 10.322 light-years
      asc: Spacecast3D.Utils.asc(23, 41, 54.7), // right ascension: 23h 41m 54.7s
      dec: Spacecast3D.Utils.dec(44, 10, 30) // declination: +44° 10′ 30″
    },
    "Epsilon Eridani": {
      descriptionSource: "https://en.wikipedia.org/wiki/Epsilon_Eridani",
      description: "Epsilon Eridani is a star residing in the constellation Eridanus. It is somewhat smaller than the sun, and is less than one billion years old. Being still young, its solar wind is thirty times stronger than that of the sun.",
      dis: Spacecast3D.Utils.dis(10.522), // distance: 10.522 light-years
      asc: Spacecast3D.Utils.asc(3, 32, 55.8), // right ascension: 03h 32m 55.8s
      dec: Spacecast3D.Utils.dec(9, 27, 30, true) // declination: −09° 27′ 30″
    },
    "Lacaille 9352": {
      descriptionSource: "https://en.wikipedia.org/wiki/Lacaille_9352",
      description: "Lacaille 9352 is the closest star in the constellation Piscis Austrinus. However, it is still imperceptible to the naked eye.",
      dis: Spacecast3D.Utils.dis(10.742), // distance: 10.742 light-years
      asc: Spacecast3D.Utils.asc(23, 5, 52), // right ascension: 23h 05m 52.0s
      dec: Spacecast3D.Utils.dec(35, 51, 11, true) // declination: −35° 51′ 11″
    },
    "Ross 128": {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_128",
      description: "Ross 128 is a faint red dwarf in the constellation Virgo. It harbors a planet called Ross 128 b, which was the second exoplanet discovered. The roughly Earth-sized planet lies in the habitable zone of the star, and is a prime candidate for life.",
      dis: Spacecast3D.Utils.dis(10.919), // distance: 10.919 light-years
      asc: Spacecast3D.Utils.asc(11, 47, 44.4), // right ascension: 11h 47m 44.4s
      dec: Spacecast3D.Utils.dec(0, 48, 16) // declination: +00° 48′ 16″
    },
    "Wise 1506 7027": {
      descriptionSource: "https://en.wikipedia.org/wiki/WISE_1506%2B7027",
      description: "Wise 1506 7027 is a sub-stellar brown dwarf in the constellation Ursa Minor.",
      dis: Spacecast3D.Utils.dis(11.089), // distance: 11.089 light-years
      asc: Spacecast3D.Utils.asc(15, 6, 49.9), // right ascension: 15h 06m 49.9s
      dec: Spacecast3D.Utils.dec(70, 27, 36) // declination: +70° 27′ 36″
    },
    "Ez Aquarii": {
      descriptionSource: "https://en.wikipedia.org/wiki/EZ_Aquarii",
      description: "Ez Aquarii is a system of three red dwarfs. Two orbit each other and the third orbits them. All three reside in the constellation Aquarius.",
      dis: Spacecast3D.Utils.dis(11.266), // distance: 11.266 light-years
      asc: Spacecast3D.Utils.asc(22, 38, 33.4), // right ascension: 22h 38m 33.4s
      dec: Spacecast3D.Utils.dec(15, 17, 57, true) // declination: −15° 17′ 57″
    },
    "Procyon": {
      descriptionSource: "https://en.wikipedia.org/wiki/Procyon",
      description: "Procyon is the brightest star in the constellation Canis Minor and the eighth brightest in the sky. It consists of two white stars, one of which is a faint white dwarf.",
      dis: Spacecast3D.Utils.dis(11.402), // distance: 11.402 light-years
      asc: Spacecast3D.Utils.asc(7, 39, 18.1), // right ascension: 07h 39m 18.1s
      dec: Spacecast3D.Utils.dec(5, 13, 30) // declination: +05° 13′ 30″
    },
    "61 Cyngi": {
      descriptionSource: "https://en.wikipedia.org/wiki/61_Cygni",
      description: "61 Cyngi is a pair of orange-colored dwarfs in the Cygnus constellation. In areas with little light polution, the system can be seen with the naked eye.",
      dis: Spacecast3D.Utils.dis(11.403), // distance: 11.403 light-years
      asc: Spacecast3D.Utils.asc(21, 6, 53.9), // right ascension: 21h 06m 53.9s
      dec: Spacecast3D.Utils.dec(38, 44, 58) // declination: +38° 44′ 58″
    },
    "Struve 2398": {
      descriptionSource: "https://en.wikipedia.org/wiki/Struve_2398",
      description: "Struve 2398 is a binary dwarf star in the constellation Draco. It is invisible without viewing equipment.",
      dis: Spacecast3D.Utils.dis(11.525), // distance: 11.525 light-years
      asc: Spacecast3D.Utils.asc(18, 42, 46.7), // right ascension: 18h 42m 46.7s
      dec: Spacecast3D.Utils.dec(59, 37, 49) // declination: +59° 37′ 49″
    },
    "Groombridge 34": {
      descriptionSource: "https://en.wikipedia.org/wiki/Groombridge_34",
      description: "Groombridge 34 is a binary system of red dwarf stars of the Andromeda constellation. It is moving away from the Solar System relatively fast at 11.6 km/s.",
      dis: Spacecast3D.Utils.dis(11.624), // distance: 11.624 light-years
      asc: Spacecast3D.Utils.asc(0, 18, 22.9), // right ascension: 0h 18m 22.9s
      dec: Spacecast3D.Utils.dec(44, 1, 23) // declination: +44° 01′ 23″
    },
    "Epsilon Indi": {
      descriptionSource: "https://en.wikipedia.org/wiki/Epsilon_Indi",
      description: "Epsilon Indi is a triple star system in the constellation of Indus. It contains one orange dwarf and two brown dwarfs. The orange star harbors a gas giant, the closest known outside the Solar System, with 2.7 times the mass of Jupiter.",
      dis: Spacecast3D.Utils.dis(11.824), // distance: 11.824 light-years
      asc: Spacecast3D.Utils.asc(22, 03, 21.7), // right ascension: 22h 03m 21.7s
      dec: Spacecast3D.Utils.dec(56, 47, 10) // declination: −56° 47′ 10″
    },
    "Dx Cancri": {
      descriptionSource: "https://en.wikipedia.org/wiki/DX_Cancri",
      description: "Dx Cancri is a faint red dwarf in the constellation Cancer. It is a flare star, meaning its brightness can increase fivefold for short times.",
      dis: Spacecast3D.Utils.dis(11.826), // distance: 11.826 light-years
      asc: Spacecast3D.Utils.asc(8, 29, 49.5), // right ascension: 08h 29m 49.5s
      dec: Spacecast3D.Utils.dec(26, 46, 37) // declination: +26° 46′ 37″
    },
    "Tau Ceti": {
      descriptionSource: "https://en.wikipedia.org/wiki/Tau_Ceti",
      description: "Tau Ceti is a single star in the constellation Cetus with 78% of the sun's mass. There is evidence that five planets orbit the star, of which two are in the habitable zone. Because of this, Tau Ceti is a candidate for life. However, it is also orbited by a disk of debris, and the resulting higher frequency of impacts would be a barrier for such life.",
      dis: Spacecast3D.Utils.dis(11.887), // distance: 11.887 light-years
      asc: Spacecast3D.Utils.asc(1, 44, 4.1), // right ascension: 01h 44m 04.1s
      dec: Spacecast3D.Utils.dec(15, 56, 15, true) // declination: −15° 56′ 15″
    },
    "GJ 1061": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_1061",
      description: "GJ 1061 is a red dwarf in the Horologium constellation. It is only 0.1% as luminous as the sun.",
      dis: Spacecast3D.Utils.dis(11.991), // distance: 11.991 light-years
      asc: Spacecast3D.Utils.asc(3, 35, 59.7), // right ascension: 03h 35m 59.7s
      dec: Spacecast3D.Utils.dec(44, 30, 45, true) // declination: −44° 30′ 45″
    },
    "Wise 0350-5658": {
      descriptionSource: "https://en.wikipedia.org/wiki/WISE_0350%E2%88%925658",
      description: "Wise 0350-5658, a brown dwarf, is the closest system in the constellation Reticulum.",
      dis: Spacecast3D.Utils.dis(12.068), // distance: 12.068 light-years
      asc: Spacecast3D.Utils.asc(3, 50, .32), // right ascension: 03h 50m 00.32s
      dec: Spacecast3D.Utils.dec(56, 58, 30.2, true) // declination: −56° 58′ 30.2″
    },
    "YZ Ceti": {
      descriptionSource: "https://en.wikipedia.org/wiki/YZ_Ceti",
      description: "YZ Ceti is a red dwarf in the Cetus constellation. It is unusually close to its nearest neighbor Tau Ceti at mere 1.6 light years away.",
      dis: Spacecast3D.Utils.dis(12.132), // distance: 12.132 light-years
      asc: Spacecast3D.Utils.asc(1, 12, 30.6), // right ascension: 01h 12m 30.6s
      dec: Spacecast3D.Utils.dec(16, 59, 56, true) // declination: −16° 59′ 56″
    },
    "Luyten's Star": {
      descriptionSource: "https://en.wikipedia.org/wiki/Luyten%27s_Star",
      description: "Luyten's Star is a red dwarf in the Canis Minor constellation. Orbiting it are two planets. One of these, called GJ 273b, is a rocky planet larger than Earth. GJ 273b is within the habitable zone, so it could be home to extraterrestrial life.",
      dis: Spacecast3D.Utils.dis(12.366), // distance: 12.366 light-years
      asc: Spacecast3D.Utils.asc(7, 27, 24.5), // right ascension: 07h 27m 24.5s
      dec: Spacecast3D.Utils.dec(5, 13, 33) // declination: +05° 13′ 33″
    },
    "Teegarden's Star": {
      descriptionSource: "https://en.wikipedia.org/wiki/Teegarden%27s_Star",
      description: "Teegarden's Star is an invisible red dwarf in the constellation of Aries. The star is moving across the sky at about 1.4E-3 degrees per year, which is extraordinarily fast.",
      dis: Spacecast3D.Utils.dis(12.514), // distance: 12.514 light-years
      asc: Spacecast3D.Utils.asc(2, 53, .9), // right ascension: 02h 53m 00.9s
      dec: Spacecast3D.Utils.dec(16, 52, 53) // declination: +16° 52′ 53″
    },
    "SCR 1845-6357": {
      descriptionSource: "https://en.wikipedia.org/wiki/SCR_1845-6357",
      description: "SCR 1845-6357 is a binary system of the Pavo constellation. One star is a red dwarf. The other is a sub-stellar brown dwarf 40-50 times the mass of Jupiter. Being about 50 times fainter than its companion, the brown dwarf was discovered years later.",
      dis: Spacecast3D.Utils.dis(12.571), // distance: 12.571 light-years
      asc: Spacecast3D.Utils.asc(18, 45, 5.3), // right ascension: 18h 45m 05.3s
      dec: Spacecast3D.Utils.dec(63, 57, 48, true) // declination: −63° 57′ 48″
    },
    "Kapteyn's Star": {
      descriptionSource: "https://en.wikipedia.org/wiki/Kapteyn%27s_Star",
      description: "Kapteyn's Star is a red subdwarf in the constellation Pictor. It harbors two planets. One of them, Kapteyn b, is potentially habitable. This would make the planet the oldest habitable planet known, with an age of about 11 billion years. Kapteyn's Star is visible through binoculars.",
      dis: Spacecast3D.Utils.dis(12.777), // distance: 12.777 light-years
      asc: Spacecast3D.Utils.asc(5, 11, 40.6), // right ascension: 05h 11m 40.6s
      dec: Spacecast3D.Utils.dec(45, 1, 6, true) // declination: −45° 01′ 06″
    },
    "Lacaille 8760": {
      descriptionSource: "https://en.wikipedia.org/wiki/Lacaille_8760",
      description: "Lacaille 8760 is a red dwarf in the Microscopium constellation. The star is one of the brightest red dwarfs known, but is still only visible to the naked eye under exceptional viewing conditions.",
      dis: Spacecast3D.Utils.dis(12.870), // distance: 12.870 light-years
      asc: Spacecast3D.Utils.asc(21, 17, 15.3), // right ascension: 21h 17m 15.3s
      dec: Spacecast3D.Utils.dec(38, 52, 3, true) // declination: −38° 52′ 03″
    },
    "Wise 0535-7500": {
      descriptionSource: "https://en.wikipedia.org/wiki/WISE_0535%E2%88%927500",
      description: "Wise 0535-7500 is a pair of bodies in the constellation Mensa. Both are too small for any fusion to occur within them, so they are essentially free-floating planets.",
      dis: Spacecast3D.Utils.dis(13.0), // distance: 13.0 light-years
      asc: Spacecast3D.Utils.asc(5, 35, 16.8), // right ascension: 05h 35m 16.8s
      dec: Spacecast3D.Utils.dec(75, 0, 24.9, true) // declination: −75° 00′ 24.9″
    },
    "Kruger 60": {
      descriptionSource: "https://en.wikipedia.org/wiki/Kruger_60",
      description: "Kruger 60 is a pair of red dwarfs in the Cepheus constellation. The average distance between the two is about the same as the distance between the sun and Saturn. the stars complete one orbit every 44.6 years.",
      dis: Spacecast3D.Utils.dis(13.149), // distance: 13.149 light-years
      asc: Spacecast3D.Utils.asc(22, 27, 59.5), // right ascension: 22h 27m 59.5s
      dec: Spacecast3D.Utils.dec(57, 41, 45) // declination: +57° 41′ 45″
    },
    "DEN 1048 3956": {
      descriptionSource: "https://en.wikipedia.org/wiki/DEN_1048%E2%88%923956",
      description: "DEN 1048-3956 is a brown dwarf in the Antlia constellation. It was first detected when it emitted a powerful radio flare.",
      dis: Spacecast3D.Utils.dis(13.167), // distance: 13.167 light-years
      asc: Spacecast3D.Utils.asc(10, 48, 14.7), // right ascension: 10h 48m 14.7s
      dec: Spacecast3D.Utils.dec(39, 56, 6, true) // declination: −39° 56′ 06″
    },
    "UGPS 0722-05": {
      descriptionSource: "https://en.wikipedia.org/wiki/UGPS_J0722-0540",
      description: "UGPS 0722-05 is a brown dwarf in the constellation Monoceros about Jupiter's volume.",
      dis: Spacecast3D.Utils.dis(13.259), // distance: 13.259 light-years
      asc: Spacecast3D.Utils.asc(7, 22, 27.3), // right ascension: 07h 22m 27.3s
      dec: Spacecast3D.Utils.dec(5, 40, 30, true) // declination: –05° 40′ 30″
    },
    "Ross 614": {
      descriptionSource: "https://en.wikipedia.org/wiki/Ross_614",
      description: "Ross 614 is a binary red dwarf system in the constellation Monoceros. The system is too dim to be seen without the aid of a telescope.",
      dis: Spacecast3D.Utils.dis(13.349), // distance: 13.349 light-years
      asc: Spacecast3D.Utils.asc(6, 29, 23.4), // right ascension: 06h 29m 23.4s
      dec: Spacecast3D.Utils.dec(2, 48, 50, true) // declination: −02° 48′ 50″
    },
    "Wolf 1061": {
      descriptionSource: "https://en.wikipedia.org/wiki/Wolf_1061",
      description: "Wolf 1061 is a red dwarf of the constellation Ophiuchus. It harbors three planets, two of which might be home to life.",
      dis: Spacecast3D.Utils.dis(13.820), // distance: 13.820 light-years
      asc: Spacecast3D.Utils.asc(16, 30, 18.1), // right ascension: 16h 30m 18.1s
      dec: Spacecast3D.Utils.dec(12, 39, 45, true) // declination: −12° 39′ 45″
    },
    "Van Maanen's Star": {
      descriptionSource: "https://en.wikipedia.org/wiki/Van_Maanen_2",
      description: "van Maanen's Star resides in the constellation Pisces. It is a dense white dwarf, a remnant left over by a much larger star. It is the closest known white dwarf lacking a companion star.",
      dis: Spacecast3D.Utils.dis(14.066), // distance: 14.066 light-years
      asc: Spacecast3D.Utils.asc(0, 49, 9.9), // right ascension: 00h 49m 09.9s
      dec: Spacecast3D.Utils.dec(5, 23, 19) // declination: +05° 23′ 19″
    },
    "Gliese 1": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_1",
      description: "Gliese 1 is a red dwarf in the constellation of Sculptor. Its faintness makes it impossible to see with the unaided eye.",
      dis: Spacecast3D.Utils.dis(14.231), // distance: 14.231 light-years
      asc: Spacecast3D.Utils.asc(0, 5, 24.4), // right ascension: 00h 05m 24.4s
      dec: Spacecast3D.Utils.dec(37, 21, 27, true) // declination: −37° 21′ 27″
    },
    "Wolf 424": {
      descriptionSource: "https://en.wikipedia.org/wiki/Wolf_424",
      description: "Wolf 424 is a binary red dwarf system in the Virgo constellation. The stars are two of the dimmest known nearby stars in the sky.",
      dis: Spacecast3D.Utils.dis(14.312), // distance: 14.312 light-years
      asc: Spacecast3D.Utils.asc(12, 33, 17.2), // right ascension: 12h 33m 17.2s
      dec: Spacecast3D.Utils.dec(9, 1, 15) // declination: +09° 01′ 15″
    },
    "2MASS J154043": {
      descriptionSource: "https://en.wikipedia.org/wiki/2MASS_J154043.42-510135.7",
      description: "2MASS J154043 is a dim red dwarf in the Norma constellation.",
      dis: Spacecast3D.Utils.dis(14.4), // distance: 14.4 light-years
      asc: Spacecast3D.Utils.asc(15, 40, 43.42), // right ascension: 15h 40m 43.42s
      dec: Spacecast3D.Utils.dec(51, 1, 35.7, true) // declination: −51° 01′ 35.7″
    },
    "L 1159-16": {
      descriptionSource: "https://en.wikipedia.org/wiki/L_1159-16",
      description: "L 1159-16 is a red dwarf in the Aries constellation. It is too faint to be visible without a telescope.",
      dis: Spacecast3D.Utils.dis(14.509), // distance: 14.509 light-years
      asc: Spacecast3D.Utils.asc(2, 0, 13.2), // right ascension: 02h 00m 13.2s
      dec: Spacecast3D.Utils.dec(13, 3, 8) // declination: +13° 03′ 08″
    },
    "Gliese 687": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_687",
      description: "Gliese 687 is a red dwarf in the constellation of Draco. A moderately sized telescope is required to spot it. Gliese 687 is orbited by a planet about the mass of Neptune.",
      dis: Spacecast3D.Utils.dis(14.793), // distance: 14.793 light-years
      asc: Spacecast3D.Utils.asc(17, 36, 25.9), // right ascension: 17h 36m 25.9s
      dec: Spacecast3D.Utils.dec(68, 20, 21) // declination: +68° 20′ 21″
    },
    "LHS 292": {
      descriptionSource: "https://en.wikipedia.org/wiki/LHS_292",
      description: "LHS 292 resides in the Sextans constellation. Being a faint red dwarf, it can only be seen through a large telescope.",
      dis: Spacecast3D.Utils.dis(14.805), // distance: 14.805 light-years
      asc: Spacecast3D.Utils.asc(10, 48, 12.6), // right ascension: 10h 48m 12.6s
      dec: Spacecast3D.Utils.dec(11, 20, 14, true) // declination: −11° 20′ 14″
    },
    "Gliese 674": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_674",
      description: "Gliese 674 is a red dwarf in the constellation Ara. A planet about twelve times the mass of Earth orbits the star.",
      dis: Spacecast3D.Utils.dis(14.809), // distance: 14.809 light-years
      asc: Spacecast3D.Utils.asc(17, 28, 39.9), // right ascension: 17h 28m 39.9s
      dec: Spacecast3D.Utils.dec(46, 53, 43, true) // declination: −46° 53′ 43″
    },
    "GJ 1245": {
      descriptionSource: "https://en.wikipedia.org/wiki/GJ_1245",
      description: "GJ 1245 is a system in the Cygnus constellation. It is made of three red dwarfs. Two orbit each other and this binary system orbits another red dwarf.",
      dis: Spacecast3D.Utils.dis(14.812), // distance: 14.812 light-years
      asc: Spacecast3D.Utils.asc(19, 53, 54.2), // right ascension: 19h 53m 54.2s
      dec: Spacecast3D.Utils.dec(44, 24, 55) // declination: +44° 24′ 55″
    },
    "LP 145-141": {
      descriptionSource: "https://en.wikipedia.org/wiki/LP_145-141",
      description: "LP 145-141 is a white dwarf in the Musca constellation. It is thought to follow a highly eccentric orbit around the galaxy.",
      dis: Spacecast3D.Utils.dis(15.060), // distance: 15.060 light-years
      asc: Spacecast3D.Utils.asc(11, 45, 42.9), // right ascension: 11h 45m 42.9s
      dec: Spacecast3D.Utils.dec(64, 50, 29, true) // declination: −64° 50′ 29″
    },
    "GJ 1002": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_1002",
      description: "GJ 1002 is a red dwarf in the Cetus constellation. Unlike many red dwarfs, it does not emit any flares.",
      dis: Spacecast3D.Utils.dis(15.313), // distance: 15.313 light-years
      asc: Spacecast3D.Utils.asc(0, 6, 43.8), // right ascension: 00h 06m 43.8s
      dec: Spacecast3D.Utils.dec(7, 32, 22, true) // declination: −07° 32′ 22″
    },
    "Gliese 876": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_876#Planetary_system",
      // TODO: Talk about inclination of planets?
      description: "Gliese 876 is a red dwarf in the Aquarius constellation. It is orbited by four planets. The middle two of these are in the habitable zone of the star, although they are both gas giants. Three of the planets are also in a 1:2:4 resonance. They are the only known example of this phenomenon other than Jupiter's inner three Galilean moons.",
      dis: Spacecast3D.Utils.dis(15.342), // distance: 15.342 light-years
      asc: Spacecast3D.Utils.asc(22, 53, 16.7), // right ascension: 22h 53m 16.7s
      dec: Spacecast3D.Utils.dec(14, 15, 49, true) // declination: −14° 15′ 49″
    },
    "LHS 288": {
      descriptionSource: "https://en.wikipedia.org/wiki/LHS_288",
      description: "LHS 288 is normally invisible red dwarf in the constellation Carina. It might have a gaseous planet orbiting it, but this is not confirmed.",
      dis: Spacecast3D.Utils.dis(15.610), // distance: 15.610 light-years
      asc: Spacecast3D.Utils.asc(10, 44, 21.2), // right ascension: 10h 44m 21.2s
      dec: Spacecast3D.Utils.dec(61, 12, 36, true) // declination: −61° 12′ 36″
    },
    "Gliese 412": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_412",
      description: "Gliese 412 is a dim red dwarf duo thought to form a binary system. The two are part of the constellation Ursa Major.",
      dis: Spacecast3D.Utils.dis(15.832), // distance: 15.832 light-years
      asc: Spacecast3D.Utils.asc(11, 5, 28.6), // right ascension: 11h 05m 28.6s
      dec: Spacecast3D.Utils.dec(43, 31, 36) // declination: +43° 31′ 36″
    },
    "Groombridge 1618": {
      descriptionSource: "https://en.wikipedia.org/wiki/Groombridge_1618",
      description: "Groombridge 1618 is a star in the constellation Ursa Major. It is theorized that it has a planetary companion at least four times the mass of Jupiter. If this companion exists, then it is in the habitable zone.",
      dis: Spacecast3D.Utils.dis(15.848), // distance: 15.848 light-years
      asc: Spacecast3D.Utils.asc(10, 11, 22.1), // right ascension: 10h 11m 22.1s
      dec: Spacecast3D.Utils.dec(49, 27, 15) // declination: +49° 27′ 15″
    },
    "AD Leonis": {
      descriptionSource: "https://en.wikipedia.org/wiki/AD_Leonis",
      description: "AD Leonis is a red dwarf in the constellation Leo. While red dwarfs can be much older than the sun, AD Leonis is thought to be relatively young, at only 25–300 million years of age.",
      dis: Spacecast3D.Utils.dis(15.942), // distance: 15.942 light-years
      asc: Spacecast3D.Utils.asc(10, 19, 36.4), // right ascension: 10h 19m 36.4s
      dec: Spacecast3D.Utils.dec(19, 52, 10) // declination: +19° 52′ 10″
    },
    "Denis J081730": {
      descriptionSource: "https://en.wikipedia.org/wiki/DENIS_J081730.0-615520",
      description: "Denis J081730 is a sub-stellar brown dwarf in the Carina constellation. It has a mass fifteen times that of Jupiter.",
      dis: Spacecast3D.Utils.dis(16.067), // distance: 16.067 light-years
      asc: Spacecast3D.Utils.asc(8, 17, 30.1), // right ascension: 08h 17m 30.1s
      dec: Spacecast3D.Utils.dec(61, 55, 16, true) // declination: −61° 55′ 16″
    },
    "Gliese 832": {
      descriptionSource: "https://en.wikipedia.org/wiki/Gliese_832",
      description: "Gliese 832 is a normally invisible red dwarf in the Grus constellation. It is home to two planets. One of these is a gas giant, while the other is rocky and potentially habitable.",
      dis: Spacecast3D.Utils.dis(16.085), // distance: 16.085 light-years
      asc: Spacecast3D.Utils.asc(21, 33, 34), // right ascension: 21h 33m 34.0s
      dec: Spacecast3D.Utils.dec(49, 0, 32, true) // declination: −49° 00′ 32″
    },
    "DEN 0255-4700": {
      descriptionSource: "https://en.wikipedia.org/wiki/DEN_0255-4700",
      description: "DEN 0255-4700 is a brown dwarf in the constellation of Eridanus. It is the faintest of any known brown dwarf.",
      dis: Spacecast3D.Utils.dis(16.197), // distance: 16.197 light-years
      asc: Spacecast3D.Utils.asc(2, 55, 3.7), // right ascension: 02h 55m 03.7s
      dec: Spacecast3D.Utils.dec(47, 0, 52, true) // declination: −47° 00′ 52″
    },
    "GJ 1005": {
      descriptionSource: "https://en.wikipedia.org/wiki/GJ_1005",
      description: "GJ 1005 is a binary system of two faint red dwarfs in the Cetus constellation.",
      dis: Spacecast3D.Utils.dis(16.265), // distance: 16.265 light-years
      asc: Spacecast3D.Utils.asc(0, 15, 28.11), // right ascension: 00h 15m 28.11s
      dec: Spacecast3D.Utils.dec(16, 8, 1.6, true) // declination: −16° 08′ 01.6″
    },
  },
}

Spacecast3D.State = {
  beam: null,
  universe: null,
  solarSystem: {
    Sol: null,
    Mercury: null,
    Venus: null,
    Earth: null,
    Mars: null,
    Jupiter: null,
    Saturn: null,
    Neptune: null,
    Uranus: null,
  },
  ellipticalOrbiters: {},
  lights: null,
  milkyWay: null,
  centralPlane: null,
  nearestBodies: null,
  nearestBodiesLabels: [],
  activeNearestStarLabel: null,
  datGUI: null,
  orbitControls: null,
  defaultControlMinDistance: null,
  onRenderFunctions: [],
  lastTimeMilliSec: 0,
}

Spacecast3D.Helper = {
  setBeam: function(start, dec, asc) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var origin = this.findPlanetPosition(setup.solarSystem.Earth, start)
    var millis = Spacecast3D.Utils.timeBetween(start, state.currentDate)
    if (millis < 0) {
      return;
    }
    var travelled = millis / Spacecast3D.SPACECAST3D_YEAR * Spacecast3D.SPACECAST3D_LY
    var beam = this.createBeam(travelled, dec, asc, origin)
    state.beamDec = dec
    state.beamAsc = asc
    state.beamPosition = origin
    state.beamStart = start
    if (state.beam) {
      state.universe.scene.remove(state.beam)
    }
    state.beam = beam
    state.universe.scene.add(beam)
  },

  removeBeam: function() {
    var state = Spacecast3D.State
    if (state.beam) {
      state.universe.scene.remove(state.beam)
      delete state.beam
    }
  },

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
      if (event.keyCode !== Spacecast3D.KEYCODE_ENTER)
        return;

      var starLabel = Spacecast3D.Helper.searchForStar(starNameField.value)
      if (starLabel !== undefined) {
        Spacecast3D.Helper.focusOnStar(starLabel)
        Spacecast3D.Helper.updateInfo(Spacecast3D.State.universe.camera)
      }
    })

    var dateField = document.getElementById('spacecast3d-info-date')
    dateField.value = Spacecast3D.Utils.dateToConciseString(new Date())
    dateField.onchange = function() {
      var date = new Date(dateField.value)
      if (!isNaN(date)) {
        Spacecast3D.State.currentDate = date
        Spacecast3D.Helper.updateObjectPositions()
      }
    }

    var setup =   Spacecast3D.Setup
    var solarSetup = setup.solarSystem
    var state = Spacecast3D.State
    state.nearestBodies = Spacecast3D.Helper.getNearestStars(setup.nearestStars)
    state.milkyWay = Spacecast3D.Helper.createMilkyWay(setup.milkyWayRadius)
    this.createSun(scene)
    this.createPlanets(scene)
    this.createEarth(scene)
    state.centralPlane = Spacecast3D.Helper.createCentralPlane()
    scene.add(state.milkyWay)
    scene.add(state.nearestBodies)

    Object.entries(setup.ellipticalOrbiters).forEach(([name, body]) => {
      state.ellipticalOrbiters[name] = this.orbit(body)
      state.ellipticalOrbiters[name].lastPerihelion = body.lastPerihelion
      scene.add(state.ellipticalOrbiters[name].shape)
    })

    Spacecast3D.State.universe = {
      scene: scene,
      camera: camera,
      controls: controls,
      renderer: renderer,
    }

    state.currentDate = new Date()
    this.updateObjectPositions()

    return Spacecast3D.State.universe
  },

  onMouseMove: function(event) {
    var raycaster = Spacecast3D.Setup.raycaster
    var mouse = Spacecast3D.Setup.mouse
    var camera = Spacecast3D.State.universe.camera
  	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

  	raycaster.setFromCamera(mouse, camera)

  	intersections = raycaster.intersectObjects(Spacecast3D.State.nearestBodiesLabels)
  	if (intersections.length > 0) {
  		if (Spacecast3D.State.activeNearestStarLabel != intersections[0].object) {
  			if (Spacecast3D.State.activeNearestStarLabel) {
          Spacecast3D.State.activeNearestStarLabel.material.color.setStyle(Spacecast3D.Setup.bodiesLabel.baseColor)
        }
  			Spacecast3D.State.activeNearestStarLabel = intersections[0].object
  			Spacecast3D.State.activeNearestStarLabel.material.color.setStyle(Spacecast3D.Setup.bodiesLabel.activeColor)
  		}
  		document.body.style.cursor = 'pointer'
  	}
  	else if (Spacecast3D.State.activeNearestStarLabel) {
  		Spacecast3D.State.activeNearestStarLabel.material.color.setStyle(Spacecast3D.Setup.bodiesLabel.baseColor)
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

  	var intersects = raycaster.intersectObjects(Spacecast3D.State.nearestBodiesLabels)
  	if (intersects.length > 0) {
      Spacecast3D.Helper.focusOnStar(intersects[0].object)
    }
  },

  // Calculate an elliptical orbit from the information given by Wikipedia.
  orbit: function(info) {
    var orbit = {}
    var majorAxis = (info.aphelion + info.perihelion) / 2;
    var focusOffset = majorAxis - info.perihelion
    var minorAxis = getMinorAxis(majorAxis, focusOffset, info.eccentricity)
    var shape = new THREE.EllipseCurve(0, 0, majorAxis, minorAxis)
    var geom = new THREE.Geometry()
    orbit.days = Math.ceil(info.period / Spacecast3D.SPACECAST3D_DAY)
    geom.setFromPoints(shape.getPoints(orbit.days))
    geom.translate(-focusOffset, 0, 0)
    var object = new THREE.Line(geom, Spacecast3D.Setup.ellipticalOrbitMaterial)
    setRotation(object, info.perihelionArgument, info.ascendingNode, info.inclination)
    object.updateMatrixWorld()
    object.geometry.applyMatrix(object.matrix)
    object.rotation.set(0, 0, 0)
    orbit.shape = object
    orbit.points = object.geometry.vertices
    return orbit;

    function getMinorAxis(major, focusOffset, eccentricity) {
      var hypot = focusOffset / eccentricity
      return Math.sqrt(hypot ** 2 - focusOffset ** 2)
    }

    function setRotation(orbit, periArg, ascNode, inc) {
      orbit.rotateX(Math.PI / 2)
      orbit.rotateZ(ascNode - Math.PI / 2)
      orbit.rotateY(-inc)
      orbit.rotateZ(periArg)
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
  		imageTrans.src	= Spacecast3D.IMAGES_DIR+'earthcloudmaptrans.jpg'
  	}, false)
  	imageMap.src	= Spacecast3D.IMAGES_DIR+'earthcloudmap.jpg'

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

  createSun: function(scene) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var sunMaterial	= new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(Spacecast3D.IMAGES_DIR+'sunmap.jpg'),})
    var sun = this.createSphere(setup.solarSystem.Sol.radius, sunMaterial)
    sun.name = 'star'

    var sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load(Spacecast3D.IMAGES_DIR+'sunsprite.png'),
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
    }))
    sunSprite.scale.x = 2000 * Spacecast3D.EARTH_DIAMETER
    sunSprite.scale.y = 2000 * Spacecast3D.EARTH_DIAMETER
    sunSprite.scale.z = 1

    var label = this.createStarLabel('Sol')
    label.minDistance = Spacecast3D.SPACECAST3D_AU
    label.translateY(Spacecast3D.SPACECAST3D_AU)
    label.name = 'Sol'

    var group = new THREE.Group()
    group.info = setup.solarSystem.Sol.info
    group.label = label
    group.add(label)
    group.add(sun)
    group.add(sunSprite)
    state.solarSystem.Sol = group
    scene.add(group)
    state.nearestBodies.add(group)
    state.nearestBodiesLabels.push(label)
    this.setSunLabelScale(0)
  },

  planetLabelScale: function(scale, radius) {
    return Math.min(scale * radius, Spacecast3D.SPACECAST3D_AU) * 2 + Spacecast3D.SPACECAST3D_AU;
  },

  planetLabelMinDist: function(scale, radius) {
    return radius * scale * 2
  },

  makePlanetOrbit: function(planet, name, info) {
    var radius = info.radius
    var orbitRadius = info.orbitRadius
    planet.radius = radius
    planet.name = 'planet'
    planet.translateZ(orbitRadius)
    var orbit = this.circleLine(orbitRadius, 0xffffff, .5)
    orbit.name = 'orbit'
    var group = new THREE.Group()
    group.add(planet)
    group.add(orbit)
    var label = this.createStarLabel(name)
    label.name = name
    var labelScale = this.planetLabelScale(1, radius)
    label.scale.x = labelScale
    label.scale.y = labelScale
    label.minDistance = this.planetLabelMinDist(1, radius)
    label.scale.z = 1
    label.translateZ(orbitRadius)
    group.label = label
    group.add(label)
    group.info = info.info
    Spacecast3D.State.nearestBodiesLabels.push(label)
    return group
  },

  createPlanet: function(name, material, info) {
    return this.makePlanetOrbit(this.createSphere(info.radius, material), name, info)
  },

  createPlanets: function(scene) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var planets = [
      'Mercury',
      'Venus',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune'
    ]
    planets.forEach((name) => {
      var planetInfo = setup.solarSystem[name]
      var materialInfo = {
        map: new THREE.TextureLoader().load(planetInfo.materialMap),
      }
      if (planetInfo.materialBumpMap) {
        materialInfo.bumpMap = new THREE.TextureLoader().load(planetInfo.materialBumpMap)
        materialInfo.bumpScale = 0.1
      }
      var material = new THREE.MeshPhongMaterial(materialInfo)
      var planet = this.createPlanet(name, material, planetInfo)
      state.nearestBodies.add(planet)
      scene.add(planet)
      state.solarSystem[name] = planet
    })
  },

  createEarth: function(scene) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var earth = setup.solarSystem.Earth
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(earth.materialMap),
      bumpMap: new THREE.TextureLoader().load(earth.materialBumpMap),
      bumpScale: 0.1,
    })
    var earthPlanet = new THREE.Group()
    earthPlanet.add(this.createSphere(earth.radius, material))
    var atmosphereMaterial = Spacecast3D.Atmosphere.createMaterial(0x00b3ff)
    var atmosphere = this.createSphere(earth.radius*1.04, atmosphereMaterial, 128)
    var earthCloud = this.createCloud(earth.radius*1.02)
    earthCloud.receiveShadow = true
    earthCloud.castShadow = true
    earthPlanet.add(atmosphere)
    earthPlanet.add(earthCloud)
    var earthGroup = this.makePlanetOrbit(earthPlanet, 'Earth', earth)
    state.nearestBodies.add(earthGroup)
    scene.add(earthGroup)
    state.solarSystem.Earth = earthGroup
  },

  createBeam(distance, declination, rightAcension, origin) {
    var beam = this.createBeamMesh(distance, Spacecast3D.Setup.beamAngle, 128)
    Spacecast3D.Utils.rotateObject(beam, rightAcension, declination)
    beam.position.copy(origin)
    return beam;
  },

  createBeamMesh(length, angle, radialSegments) {
    var capGeom = new THREE.SphereGeometry(length, radialSegments, 128, 0, Math.TAU, 0, angle)
    var cap = new THREE.Mesh(capGeom, Spacecast3D.Setup.beamCapMaterial)
    var coneRadius = Math.sin(angle) * length
    var coneLength = Math.cos(angle) * length
    var coneGeom = new THREE.ConeGeometry(coneRadius, coneLength, radialSegments, 1, true)
    var cone = new THREE.Mesh(coneGeom, Spacecast3D.Setup.beamConeMaterial)
    cone.rotation.x += Math.PI
    cone.position.y += coneLength / 2
    var beam = new THREE.Group()
    beam.add(cap)
    beam.add(cone)
    return beam;
  },

  resizePlanets: function(scale) {
    var state = Spacecast3D.State
    var solarState = state.solarSystem
    Object.entries(solarState).forEach(([name, info]) => {
      var planet = info.getObjectByName('planet')
      if (!planet) {
        return;
      }
      planet.scale.set(scale,scale,scale)
      var label = info.getObjectByName(name)
      if (!label) {
        return;
      }
      var radius = Spacecast3D.Setup.solarSystem[name].radius
      var labelScale = this.planetLabelScale(scale, radius)
      label.minDistance = this.planetLabelMinDist(scale, radius)
      label.scale.set(labelScale, labelScale, 1)

      if (planet.position.equals(state.orbitControls.target)) {
        state.orbitControls.minDistance = label.minDistance
      }
    })
  },

  createMilkyWay: function(radius) {
  	var material	= new THREE.MeshBasicMaterial({
  		map	: new THREE.TextureLoader().load(Spacecast3D.IMAGES_DIR+'galaxy.jpg'),
  		side	: THREE.BackSide
  	})
  	var geometry	= new THREE.SphereGeometry(radius, 32, 32)
  	return new THREE.Mesh(geometry, material)
  },

  createStar: function(position) {
    var star = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load(Spacecast3D.IMAGES_DIR+'starsprite.png'),
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
      label.minDistance = Spacecast3D.SPACECAST3D_LY
      label.scale.z = 1
      label.position.setFromSpherical(position)
      nearestStars.add(star)
      nearestStars.add(label)
      Spacecast3D.State.nearestBodiesLabels.push(label)

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
  	var fontFace = Spacecast3D.Setup.bodiesLabel.fontFace
  	var fontSize = Spacecast3D.Setup.bodiesLabel.fontSize
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
  	context.fillStyle = "#FFD667"
    // write text
  	context.fillText(text, 0, fontSize)

  	// canvas content used as texture
  	var texture = new THREE.Texture(canvas)
  	texture.needsUpdate = true
  	var spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
      depthTest: false,
    })
  	return new THREE.Sprite(spriteMaterial)
  },

  searchForStar: function(name) {
    var body = Spacecast3D.Setup.nearestStars[name] || Spacecast3D.State.solarSystem[name]
    if (body !== undefined)
      return body.label
  },

  fillStarList: function(labels) {
    var bodyList = document.getElementById("spacecast3d-body-list")
    var names = labels.map(label => label.name)
    names.sort()
    names.forEach(function(name) {
      var entry = document.createElement('option')
      entry.setAttribute('value', name)
      bodyList.appendChild(entry)
    })
  },

  focusOnStar: function(starLabel) {
    if (Spacecast3D.State.orbitControls.target !== starLabel.position) {
      Spacecast3D.State.orbitControls.minDistance = starLabel.minDistance
      this.resetCameraPositionForStar(starLabel.position)
    }
    var info = Spacecast3D.Setup.nearestStars[starLabel.name]
            || Spacecast3D.State.solarSystem[starLabel.name].info
    this.setStarInfo(starLabel.name, info)
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
    cameraSphericalPosition.phi -= minDistance / cameraSphericalPosition.radius
    cameraSphericalPosition.radius += minDistance
    camera.position.setFromSpherical(cameraSphericalPosition)

    orbitControls.minDistance = minDistance * 2
    Spacecast3D.State.defaultControlMinDistance = defaultMinDistance * 2
  },

  resetCameraPositionForStar: function(point) {
    var camera = Spacecast3D.State.universe.camera
    var orbitControls = Spacecast3D.State.orbitControls
    orbitControls.target = point
    camera.position.setFromSpherical(new THREE.Spherical().setFromVector3(point))
  },

  displayInfo: function(camera) {
    this.fillStarList(Spacecast3D.State.nearestBodiesLabels)

    this.focusOnStar(Spacecast3D.State.solarSystem.Sol.label)

    this.updateInfo(camera)
    document.getElementById('canvas-spacecast3d').addEventListener('mousedown', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('wheel', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchstart', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchend', () => {return this.updateInfo(camera)})
  	document.getElementById('canvas-spacecast3d').addEventListener('touchmove', () => {return this.updateInfo(camera)})
  },

  setStarInfo: function(name, info) {
    document.getElementById("spacecast3d-info").setAttribute("data-info-open", true)
    document.getElementById("spacecast3d-info-name").value = name
    document.getElementById("spacecast3d-info-description").innerHTML =
      info.description != null ? info.description : "None."
    var link = document.getElementById("spacecast3d-info-link")
    if (info.descriptionSource != null) {
      link.innerHTML = "More information on wikipedia"
      link.setAttribute('href', info.descriptionSource)
    } else {
      link.innerHTML = null
    }
  },

  uiController: function(container) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var text = {
      'Distance (light-year)': 0.0001,
      'Planets size': 1.00,
      'Show central plane': false,
    }
    var gui = new dat.GUI({autoPlace: false, closeOnTop: true})
    gui.add(text, 'Distance (light-year)', 0.0001, 40)
    .onChange(function(distanceLightYear) {
      var cameraSphericalPosition = new THREE.Spherical().setFromVector3(state.universe.camera.position)
      cameraSphericalPosition.radius = distanceLightYear * Spacecast3D.SPACECAST3D_LY
      state.universe.camera.position.setFromSpherical(cameraSphericalPosition)
    })
    gui.add(text, 'Planets size', 1, 4000)
    .onChange((scale) => {
      this.resizePlanets(scale)
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

  setSunLabelScale: function(distance) {
    var sun = Spacecast3D.State.solarSystem.Sol
    if (distance > Spacecast3D.SPACECAST3D_LY) {
      sun.label.scale.x = 55000*Spacecast3D.SPACECAST3D_AU
      sun.label.scale.y = 55000*Spacecast3D.SPACECAST3D_AU
      sun.label.scale.z = 1
    } else {
      sun.label.scale.x = Spacecast3D.SPACECAST3D_AU
      sun.label.scale.y = Spacecast3D.SPACECAST3D_AU
      sun.label.scale.z = 1
    }
  },

  updateInfo: function(camera) {
    var x = camera.position.x
    var y = camera.position.y
    var z = camera.position.z
    var distance = Math.sqrt(x*x + y*y + z*z)
    if (distance >= Spacecast3D.SPACECAST3D_LY*0.001) {
      Spacecast3D.State.datGUI.__controllers.find((controller) => {return controller.property === 'Distance (light-year)'}).setValue(distance/Spacecast3D.SPACECAST3D_LY)
    }
    this.setSunLabelScale(distance)
  },

  updateBeam: function(date) {
    var setup = Spacecast3D.Setup
    var state = Spacecast3D.State
    var scene = state.universe.scene

    if (!state.beam) {
      return;
    }

    var milliseconds = Spacecast3D.Utils.timeBetween(state.beamStart, date)
    if (milliseconds > 0) {
      var years = milliseconds / Spacecast3D.SPACECAST3D_YEAR
      state.beam = this.createBeam(
        years * Spacecast3D.SPACECAST3D_LY,
        state.beamDec, state.beamAsc,
        state.beamPosition)
      scene.add(state.beam)
    }
  },

  updateEllipticalOrbiterPositions: function(date) {
    var state = Spacecast3D.State
    var utils = Spacecast3D.Utils
    Object.entries(state.ellipticalOrbiters).forEach(([name, orbiter]) => {
      var sincePerihelion = utils.timeBetween(orbiter.lastPerihelion, date)
      var days = utils.fit(Math.floor(sincePerihelion / Spacecast3D.SPACECAST3D_DAY), orbiter.days)
      var position = orbiter.shape.geometry.vertices[days]
      var body = orbiter.body
      if (!body) {
        body = this.createSphere(Spacecast3D.SPACECAST3D_AU / 10, Spacecast3D.Setup.beamCapMaterial)
        orbiter.body = body
        state.universe.scene.add(orbiter.body)
      }
      body.position.copy(position)
    })
  },

  updateObjectPositions: function() {
    var date = Spacecast3D.State.currentDate
    this.updatePlanetPositions(date)
    this.updateEllipticalOrbiterPositions(date)
    this.updateBeam(date)
  },

  findPlanetPosition: function(planet, date) {
    var setup = Spacecast3D.Setup
    var timePassed = Spacecast3D.Utils.timeBetween(setup.baseDate, date)
    var rotation = timePassed / planet.year * Math.TAU
    var quaternion = new THREE.Quaternion()
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation)
    var vector = new THREE.Vector3(0, 0, planet.orbitRadius)
    vector.applyQuaternion(quaternion)
    return vector
  },

  updatePlanetPositions: function(date) {
    var planets = [
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune'
    ]
    planets.forEach((name) => {
      var planet = Spacecast3D.State.solarSystem[name].getObjectByName('planet')
      var newPosition = this.findPlanetPosition(Spacecast3D.Setup.solarSystem[name], date)
      planet.position.copy(newPosition)
      var label = Spacecast3D.State.solarSystem[name].label
      if (label) {
        label.position.x = newPosition.x
        label.position.z = newPosition.z
      }
    })
  },
}

Spacecast3D.Core = {
  init: function() {
    if (!Math.TAU) {
      Math.TAU = Math.PI * 2
    }
    document.addEventListener("keypress", function(ev) {
      if (event.keyCode === Spacecast3D.KEYCODE_SPACE) {
        var info = document.getElementById("spacecast3d-info")
        var opened = info.getAttribute("data-info-open") === "true"
        info.setAttribute("data-info-open", !opened)
      }
    })
    var controls = document.getElementById('spacecast-controls')
    var state = Spacecast3D.State
    var universe = Spacecast3D.Helper.createUniverse()
    controls.appendChild(Spacecast3D.Helper.uiController())
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
