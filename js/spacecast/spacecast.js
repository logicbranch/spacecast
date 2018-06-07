var Spacecast3D = Spacecast3D || {}

// constants
Spacecast3D.EARTH_DIAMETER = 1, // earth diameter
Spacecast3D.SPACECAST3D_MILE = Spacecast3D.EARTH_DIAMETER / 7917, // 1 mile
Spacecast3D.SPACECAST3D_AU = Spacecast3D.EARTH_DIAMETER * 11740,   // 1 astronomical unit
Spacecast3D.SPACECAST3D_LY = Spacecast3D.SPACECAST3D_AU * 63241,   // 1 light year
Spacecast3D.UNIVERSE_RADIUS = Spacecast3D.SPACECAST3D_LY * 100000, // 100k light year

Spacecast3D.Utils = {
  // conver light year to spacecast base unit (earth diameter)
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
}

Spacecast3D.Setup = {
  cameraSettings: [
    70,   // field of view
    document.getElementById("explorer-view-content").offsetWidth/document.getElementById("explorer-view-content").offsetHeight, // aspect ratio
    Spacecast3D.EARTH_DIAMETER/10, // near plane
    Spacecast3D.UNIVERSE_RADIUS*2, // far plane
  ],
  cameraPosition: [
    // Spacecast3D.EARTH_DIAMETER*10,  // distance from the origin
    Spacecast3D.SPACECAST3D_LY*20,
    1.6, // polar angle from the y (up) axis
    4.6,   // equator angle around the y (up)
  ],
  controls: {
    minDistance: Spacecast3D.EARTH_DIAMETER,
    maxDistance: Spacecast3D.UNIVERSE_RADIUS/10,
    enablePan: false,
    enableZoom: true,
  },
  earthRadius: Spacecast3D.EARTH_DIAMETER/2,
  milkyWayRadius: Spacecast3D.UNIVERSE_RADIUS,
  renderer: {
    width: document.getElementById("explorer-view-content").offsetWidth,
    height: document.getElementById("explorer-view-content").offsetHeight,
    containerId: 'spacecast3d',
  },
  starfield: {
    quantity: 10000,
    nearPlane: Spacecast3D.SPACECAST3D_LY*100,
    farPlane: Spacecast3D.UNIVERSE_RADIUS,
  },
  nearestStars: {
    aCentauri: {
      name: 'Alpha Centauri',
      dis: Spacecast3D.Utils.dis(4.2421), // distance: 4.2421 light-years
      asc: Spacecast3D.Utils.asc(14, 29, 43), // right ascension: 14h 29m 43.0s
      dec: Spacecast3D.Utils.dec(62, 40, 46, true), // declination: −62° 40′ 46″
    },
    barnard: {
      name: 'Barnard',
      dis: Spacecast3D.Utils.dis(5.9630), // distance: 5.9630 light-years
      asc: Spacecast3D.Utils.asc(17, 29, 43), // right ascension: 17h 57m 48.5s
      dec: Spacecast3D.Utils.dec(4, 41, 36), // declination: +04° 41′ 36″
    },
    luhman16: {
      name: 'Luhman 16',
      dis: Spacecast3D.Utils.dis(6.59), // distance: 6.59 light-years
      asc: Spacecast3D.Utils.asc(10, 49, 15.57), // right ascension: 10h 49m 15.57s
      dec: Spacecast3D.Utils.dec(53, 29, 06), // declination: 10h 49m 15.57s
    },
    wolf359: {
      name: 'Wolf 359',
      dis: Spacecast3D.Utils.dis(7.7825), // distance: 7.7825 light-years
      asc: Spacecast3D.Utils.asc(10, 56, 29.2), // right ascension: 10h 56m 29.2s
      dec: Spacecast3D.Utils.dec(7, 0, 53), // declination: +07° 00′ 53″
    },
    lalande21185: {
      name: 'Lalande 21185',
      dis: Spacecast3D.Utils.dis(8.2905), // distance: 8.2905 light-years
      asc: Spacecast3D.Utils.asc(11, 3, 20.2), // right ascension: 11h 03m 20.2s
      dec: Spacecast3D.Utils.dec(35, 58, 12), // declination: +35° 58′ 12″
    },
    sirius: {
      name: 'Sirius',
      dis: Spacecast3D.Utils.dis(8.5828), // distance: 8.5828 light-years
      asc: Spacecast3D.Utils.asc(6, 45, 8.9), // right ascension: 06h 45m 08.9s
      dec: Spacecast3D.Utils.dec(16, 42, 58, true), // declination: −16° 42′ 58″
    },
    luyten7268: {
      name: 'Luyten 726-8',
      dis: Spacecast3D.Utils.dis(8.7280), // distance: 8.7280 light-years
      asc: Spacecast3D.Utils.asc(1, 39, 1.3), // right ascension: 01h 39m 01.3s
      dec: Spacecast3D.Utils.dec(17, 57, 01, true), // declination: −17° 57′ 01″
    },
    ross154: {
      name: 'Ross 154',
      dis: Spacecast3D.Utils.dis(9.6813), // distance: 9.6813 light-years
      asc: Spacecast3D.Utils.asc(18, 49, 49.4), // right ascension: 18h 49m 49.4s
      dec: Spacecast3D.Utils.dec(23, 50, 10, true) // declination: −23° 50′ 10″
    },
    ross248: {
      name: 'Ross 248',
      dis: Spacecast3D.Utils.dis(10.322), // distance: 10.322 light-years
      asc: Spacecast3D.Utils.asc(23, 41, 54.7), // right ascension: 23h 41m 54.7s
      dec: Spacecast3D.Utils.dec(44, 10, 30) // declination: +44° 10′ 30″
    },
    epsilonEridani: {
      name: 'Epsilon Eridani',
      dis: Spacecast3D.Utils.dis(10.522), // distance: 10.522 light-years
      asc: Spacecast3D.Utils.asc(3, 32, 55.8), // right ascension: 03h 32m 55.8s
      dec: Spacecast3D.Utils.dec(9, 27, 30, true) // declination: −09° 27′ 30″
    },
    lacaille9352: {
      name: 'Lacaille 9352',
      dis: Spacecast3D.Utils.dis(10.742), // distance: 10.742 light-years
      asc: Spacecast3D.Utils.asc(23, 5, 52), // right ascension: 23h 05m 52.0s
      dec: Spacecast3D.Utils.dec(35, 51, 11, true) // declination: −35° 51′ 11″
    },
    ross128: {
      name: 'Ross 128',
      dis: Spacecast3D.Utils.dis(10.919), // distance: 10.919 light-years
      asc: Spacecast3D.Utils.asc(11, 47, 44.4), // right ascension: 11h 47m 44.4s
      dec: Spacecast3D.Utils.dec(0, 48, 16) // declination: +00° 48′ 16″
    },
    wise15067027: {
      name: 'Wise 1506 7027',
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

Spacecast3D.Helper = {
  createRenderer: function() {
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(Spacecast3D.Setup.renderer.width, Spacecast3D.Setup.renderer.height)
    renderer.domElement.id = 'canvas-spacecast3d'
    return renderer
  },

  createLight: function() {
    var ambientLight = new THREE.AmbientLight(0xffffff)
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(100,100,100)
    var lights = new THREE.Group()
  	lights.add(ambientLight)
    lights.add(directionalLight)
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
    return controls
  },

  createUniverse: function() {
    var light = Spacecast3D.Helper.createLight()
    var camera = Spacecast3D.Helper.createCamera()
    var renderer = Spacecast3D.Helper.createRenderer()
    var controls = Spacecast3D.Helper.createControls(camera, renderer.domElement)
    document.getElementById(Spacecast3D.Setup.renderer.containerId).appendChild(renderer.domElement)
    var scene = new THREE.Scene()
    scene.add(light)
    scene.add(camera)
    return {
      scene: scene,
      camera: camera,
      controls: controls,
      renderer: renderer,
    }
  },

  createPlanet: function(radius, material) {
    var geometry	= new THREE.SphereGeometry(radius, 32, 32)
  	return new THREE.Mesh(geometry, material)
  },

  createAtmosphere: function(radius, material) {
    var geometry	= new THREE.SphereGeometry(radius, 128, 128)
  	return new THREE.Mesh(geometry, material)
  },

  createCloud: function() {
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

  	var geometry	= new THREE.SphereGeometry(Spacecast3D.Setup.earthRadius*1.02, 128, 128)
  	var material	= new THREE.MeshPhongMaterial({
  		map: new THREE.Texture(canvasResult),
  		side: THREE.DoubleSide,
  		transparent: true,
  		opacity: 0.8,
  	})
  	var mesh	= new THREE.Mesh(geometry, material)
  	return mesh
  },

  createEarth: function(radius) {
    var earthMaterial	= new THREE.MeshPhongMaterial({
  		map		: new THREE.TextureLoader().load('/images/earthmap.jpg'),
  		bumpMap		: new THREE.TextureLoader().load('/images/earthbump.jpg'),
  		bumpScale	: 0.1,
  	})
    var atmosphereMaterial	= Spacecast3D.Atmosphere.createMaterial(0x00b3ff)

    var earthCloud	= this.createCloud()
  	earthCloud.receiveShadow	= true
  	earthCloud.castShadow	= true
  	// onRenderFcts.push(function(delta, now){
  	// 	earthCloud.rotation.y += 1/8 * delta
  	// })

    var earth = this.createPlanet(radius, earthMaterial)
  	var atmosphere	= this.createAtmosphere(radius*1.04, atmosphereMaterial)

    var group = new THREE.Group()
    group.add(earth)
    group.add(atmosphere)
  	group.add(earthCloud)
    return group
  },

  createMilkyWay: function(radius) {
  	var material	= new THREE.MeshBasicMaterial({
  		map	: new THREE.TextureLoader().load('/images/galaxy.jpg'),
  		side	: THREE.BackSide
  	})
  	var geometry	= new THREE.SphereGeometry(radius, 32, 32)
  	return new THREE.Mesh(geometry, material)
  },

  getNearestStars: function (starsData, font) {
    var nearestStars = new THREE.Group()
    for (var key in starsData) {
      if (!starsData.hasOwnProperty(key)) continue
      var starData = starsData[key]

      var geometry = new THREE.SphereGeometry(3000*Spacecast3D.SPACECAST3D_AU, 16, 16)
      var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255,255,0)'
      })
      var mesh = new THREE.Mesh(geometry, material)
      var s_position = new THREE.Spherical(starData.dis, starData.dec, starData.asc)
      mesh.position.setFromSpherical(s_position)

      nearestStars.add(mesh)
    }
    return nearestStars
  },

  circleLine: function(r, color) {
    var geometry = new THREE.CircleGeometry(r, 1024, 0, 2 * 3.1415)
    var material = new THREE.MeshPhongMaterial({color: color})
    var circle = new THREE.Line(geometry, material)
    // circle.computeLineDistances()
    circle.geometry.vertices.shift()
    circle.rotateOnAxis(new THREE.Vector3( 1, 0, 0 ), -Math.PI/2)
    return circle
  },

  getNearestStarsPlane: function() {
    var group = new THREE.Group()
    group.add(this.circleLine(4 * Spacecast3D.SPACECAST3D_LY, 0xffff00)) // 4 light years ring
    group.add(this.circleLine(8 * Spacecast3D.SPACECAST3D_LY, 0xffff00)) // 8 light years ring
    group.add(this.circleLine(12 * Spacecast3D.SPACECAST3D_LY, 0xffff00)) // 12 light years ring
    group.add(this.circleLine(16 * Spacecast3D.SPACECAST3D_LY, 0xffff00)) // 16 light years ring
    return group
  },

  getSolarSystemPlane: function() {
    var solarSystemPlane = new THREE.Group()
    solarSystemPlane.add(
      this.circleLine(0.387 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // mercury
      this.circleLine(0.723 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // venus
      this.circleLine(Spacecast3D.SPACECAST3D_AU, 0xffffff),         // earth
      this.circleLine(1.524 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // mars
      this.circleLine(5.203 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // jupiter
      this.circleLine(9.539 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // saturn
      this.circleLine(19.18 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // uranus
      this.circleLine(30.06 * Spacecast3D.SPACECAST3D_AU, 0xffffff), // neptune
    )
    solarSystemPlane.translateX(Spacecast3D.SPACECAST3D_AU)
    return solarSystemPlane
  },

  displayInfo: function(camera) {
    var div = document.createElement('div')
    div.setAttribute("id", "spacecast3d-info")
    div.style.position = 'absolute'
    div.style.padding = '16px'
    div.style.backgroundColor = 'white'
    div.style.top = '16px'
    div.style.right = '16px'
    document.getElementById('spacecast3d').appendChild(div)
    this.updateInfo(camera)
    document.getElementById('canvas-spacecast3d').addEventListener( 'mousedown', () => {return this.updateInfo(camera) })
  	document.getElementById('canvas-spacecast3d').addEventListener( 'wheel', () => {return this.updateInfo(camera) })
  	document.getElementById('canvas-spacecast3d').addEventListener( 'touchstart', () => {return this.updateInfo(camera) })
  	document.getElementById('canvas-spacecast3d').addEventListener( 'touchend', () => {return this.updateInfo(camera) })
  	document.getElementById('canvas-spacecast3d').addEventListener( 'touchmove', () => {return this.updateInfo(camera) })
  },

  addUIController: function() {
    var text = {
      'Date': '12/26/2012',
      'Distance (miles)': 7917,
      'Distance (light-year)': 0.01,
      'Show Milky Way': true,
      'Reference': 'Earth'
    }
    var gui = new dat.GUI({autoPlace: false, closeOnTop: true})
    gui.add(text, 'Date')
    gui.add(text, 'Distance (miles)', 7917, 5000000000).onChange(function(distanceMiles) {
      // var cameraSphericalPosition = new THREE.Spherical().setFromVector3(Spacecast3D.Core.state.universe.camera.position)
      // cameraSphericalPosition.radius = distanceMiles * Spacecast3D.SPACECAST3D_MILE
      // Spacecast3D.Core.state.universe.camera.position.setFromSpherical(cameraSphericalPosition)
    })
    gui.add(text, 'Distance (light-year)', 0.001, 10000).onChange(function(distanceLightYear) {
      // var cameraSphericalPosition = new THREE.Spherical().setFromVector3(Spacecast3D.Core.state.universe.camera.position)
      // cameraSphericalPosition.radius = distanceLightYear * Spacecast3D.SPACECAST3D_LY
      // Spacecast3D.Core.state.universe.camera.position.setFromSpherical(cameraSphericalPosition)
    })
    gui.add(text, 'Show Milky Way').onChange(function(value) {
      if (value) {
        Spacecast3D.Core.state.universe.scene.add(Spacecast3D.Core.state.milkyWay)
      } else {
        Spacecast3D.Core.state.universe.scene.remove(Spacecast3D.Core.state.milkyWay)
      }
    })
    gui.add(text, 'Reference', ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'])
    gui.width = 400
    Spacecast3D.Core.state.datGUI = gui

    var customContainer = document.getElementById('spacecast-controls')
    customContainer.appendChild(gui.domElement)
  },

  updateInfo: function(camera) {
    var x = camera.position.x
    var y = camera.position.y
    var z = camera.position.z
    var distance = Math.sqrt(x*x + y*y + z*z)
    if (distance < Spacecast3D.SPACECAST3D_LY*0.001) {
      document.getElementById('spacecast3d-info').innerHTML = 'Distance from Earth: ' + Math.trunc(distance*7917).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' miles'
      Spacecast3D.Core.state.datGUI.__controllers.find((controller) => {return controller.property === 'Distance (miles)'}).setValue(Math.trunc(distance*7917))
    } else {
      document.getElementById('spacecast3d-info').innerHTML = 'Distance from Earth: ' + Math.trunc(distance/Spacecast3D.SPACECAST3D_LY).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' light-years'
      Spacecast3D.Core.state.datGUI.__controllers.find((controller) => {return controller.property === 'Distance (light-year)'}).setValue(distance/Spacecast3D.SPACECAST3D_LY)
    }

  },
}

Spacecast3D.Core = {
  state: {
    universe: null,
    planets: {
      earth: null,
    },
    lights: null,
    camera: null,
    milkyWay: null,
    nearestStarsPlane: null,
    nearestStars: null,
    datGUI: null,
  },

  init: function() {
    this.state.milkyWay = Spacecast3D.Helper.createMilkyWay(Spacecast3D.Setup.milkyWayRadius)
    this.state.planets.earth = Spacecast3D.Helper.createEarth(Spacecast3D.Setup.earthRadius)
    this.state.nearestStarsPlane = Spacecast3D.Helper.getNearestStarsPlane()
    this.state.nearestStars = Spacecast3D.Helper.getNearestStars(Spacecast3D.Setup.nearestStars)
    this.state.solarSystemPlane = Spacecast3D.Helper.getSolarSystemPlane()
    this.state.universe = Spacecast3D.Helper.createUniverse()

    var universe = this.state.universe
    universe.scene.add(this.state.milkyWay)
    universe.scene.add(this.state.planets.earth)
    universe.scene.add(this.state.nearestStarsPlane)
    universe.scene.add(this.state.nearestStars)
    universe.scene.add(this.state.solarSystemPlane)

    Spacecast3D.Helper.addUIController()

    this.update(universe)
    Spacecast3D.Helper.displayInfo(universe.camera)
    return universe.scene
  },

  update: function(universe) {
    universe.controls.update()
    universe.renderer.render(universe.scene, universe.camera)
    requestAnimationFrame(function() {
      this.update(universe)
    }.bind(this))
  },
}

window.onload = function() {Spacecast3D.Core.init()}
