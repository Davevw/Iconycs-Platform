export const GEO_DATA: Record<string, {cities: {name:string;props:number;avg:number}[];zips:{zip:string;city:string;props:number;avg:number}[]}> = {
  "AK": {
    cities: [
    {name:"Anchorage",props:67786,avg:298105},
    {name:"Wasilla",props:27815,avg:214054},
    {name:"Fairbanks",props:21488,avg:201206},
    {name:"Palmer",props:11068,avg:215527},
    {name:"Juneau",props:9294,avg:340034},
    {name:"Eagle River",props:9013,avg:325773},
    {name:"North Pole",props:7951,avg:199180},
    {name:"Soldotna",props:7166,avg:218582},
    {name:"Kenai",props:6619,avg:184659},
    {name:"Homer",props:4478,avg:245489}
    ],
    zips: [
    {zip:"99623",city:"Wasilla",props:14053,avg:193898},
    {zip:"99654",city:"Wasilla",props:13751,avg:227605},
    {zip:"99507",city:"Anchorage",props:11553,avg:301245},
    {zip:"99504",city:"Anchorage",props:11161,avg:263733},
    {zip:"99645",city:"Palmer",props:11068,avg:215527},
    {zip:"99709",city:"Fairbanks",props:10299,avg:215253},
    {zip:"99801",city:"Juneau",props:9292,avg:339967},
    {zip:"99577",city:"Eagle River",props:9013,avg:325773}
    ],
  },
  "AL": {
    cities: [
    {name:"Birmingham",props:114618,avg:165682},
    {name:"Mobile",props:98342,avg:130130},
    {name:"Huntsville",props:73414,avg:143591},
    {name:"Montgomery",props:71832,avg:134327},
    {name:"Tuscaloosa",props:33932,avg:174207},
    {name:"Dothan",props:29145,avg:159631},
    {name:"Gadsden",props:29138,avg:114791},
    {name:"Madison",props:28921,avg:204606},
    {name:"Bessemer",props:26162,avg:140966},
    {name:"Florence",props:24734,avg:155693}
    ],
    zips: [
    {zip:"36542",city:"Gulf Shores",props:16880,avg:299768},
    {zip:"36117",city:"Montgomery",props:16747,avg:181725},
    {zip:"36695",city:"Mobile",props:16441,avg:189591},
    {zip:"36532",city:"Fairhope",props:15115,avg:299997},
    {zip:"35758",city:"Madison",props:15080,avg:197121},
    {zip:"36561",city:"Orange Beach",props:14983,avg:440407},
    {zip:"35242",city:"Birmingham",props:14712,avg:332549},
    {zip:"36830",city:"Auburn",props:14438,avg:249864}
    ],
  },
  "AR": {
    cities: [
    {name:"Little Rock",props:76535,avg:154338},
    {name:"Hot Springs National Park",props:34518,avg:150634},
    {name:"Fayetteville",props:30856,avg:213248},
    {name:"Fort Smith",props:29912,avg:128691},
    {name:"Jonesboro",props:28355,avg:149207},
    {name:"North Little Rock",props:27098,avg:103864},
    {name:"Conway",props:26363,avg:156131},
    {name:"Rogers",props:25941,avg:189654},
    {name:"Springdale",props:25764,avg:182292},
    {name:"Pine Bluff",props:21850,avg:65437}
    ],
    zips: [
    {zip:"71913",city:"Hot Springs National Park",props:22627,avg:163867},
    {zip:"72450",city:"Paragould",props:15060,avg:120072},
    {zip:"71730",city:"El Dorado",props:14809,avg:93165},
    {zip:"72401",city:"Jonesboro",props:14639,avg:123751},
    {zip:"72034",city:"Conway",props:14239,avg:176578},
    {zip:"71603",city:"Pine Bluff",props:13984,avg:72984},
    {zip:"72653",city:"Mountain Home",props:13919,avg:132820},
    {zip:"72756",city:"Rogers",props:13636,avg:154446}
    ],
  },
  "AZ": {
    cities: [
    {name:"Phoenix",props:383413,avg:223534},
    {name:"Tucson",props:276750,avg:175320},
    {name:"Mesa",props:169321,avg:201894},
    {name:"Scottsdale",props:130330,avg:364768},
    {name:"Chandler",props:85555,avg:244419},
    {name:"Gilbert",props:84491,avg:266613},
    {name:"Glendale",props:81519,avg:188934},
    {name:"Peoria",props:66458,avg:213726},
    {name:"Surprise",props:56816,avg:191845},
    {name:"Yuma",props:50924,avg:136330}
    ],
    zips: [
    {zip:"85142",city:"Queen Creek",props:26218,avg:277495},
    {zip:"85383",city:"Peoria",props:25531,avg:331867},
    {zip:"85326",city:"Buckeye",props:22510,avg:160898},
    {zip:"85308",city:"Glendale",props:22288,avg:223404},
    {zip:"85032",city:"Phoenix",props:21625,avg:208919},
    {zip:"85338",city:"Goodyear",props:20882,avg:206227},
    {zip:"85351",city:"Sun City",props:20614,avg:134564},
    {zip:"85225",city:"Chandler",props:20566,avg:199575}
    ],
  },
  "CA": {
    cities: [
    {name:"Los Angeles",props:339665,avg:451859},
    {name:"San Diego",props:313214,avg:375244},
    {name:"San Jose",props:230164,avg:438496},
    {name:"Sacramento",props:217446,avg:239335},
    {name:"San Francisco",props:172192,avg:641556},
    {name:"Bakersfield",props:151718,avg:204435},
    {name:"Fresno",props:143180,avg:197373},
    {name:"Long Beach",props:94314,avg:365881},
    {name:"Stockton",props:91286,avg:208559},
    {name:"Oakland",props:89062,avg:360313}
    ],
    zips: [
    {zip:"95747",city:"Roseville",props:25936,avg:416670},
    {zip:"92336",city:"Fontana",props:25370,avg:320943},
    {zip:"95630",city:"Folsom",props:23316,avg:389208},
    {zip:"92592",city:"Temecula",props:23299,avg:372470},
    {zip:"91709",city:"Chino Hills",props:22386,avg:423705},
    {zip:"92345",city:"Hesperia",props:22368,avg:189493},
    {zip:"92677",city:"Laguna Niguel",props:22106,avg:518973},
    {zip:"90650",city:"Norwalk",props:21560,avg:286299}
    ],
  },
  "CO": {
    cities: [
    {name:"Denver",props:233608,avg:389864},
    {name:"Colorado Springs",props:180703,avg:267328},
    {name:"Aurora",props:124183,avg:321599},
    {name:"Littleton",props:63158,avg:401857},
    {name:"Fort Collins",props:62821,avg:378525},
    {name:"Pueblo",props:56030,avg:177122},
    {name:"Arvada",props:48580,avg:365562},
    {name:"Lakewood",props:47101,avg:339878},
    {name:"Grand Junction",props:42345,avg:233276},
    {name:"Thornton",props:42078,avg:326337}
    ],
    zips: [
    {zip:"80134",city:"Parker",props:25061,avg:414304},
    {zip:"80013",city:"Aurora",props:23895,avg:320242},
    {zip:"80634",city:"Greeley",props:20351,avg:276988},
    {zip:"80016",city:"Aurora",props:18369,avg:467779},
    {zip:"80525",city:"Fort Collins",props:18002,avg:387895},
    {zip:"80538",city:"Loveland",props:17992,avg:345289},
    {zip:"80022",city:"Commerce City",props:16998,avg:320543},
    {zip:"80127",city:"Littleton",props:16222,avg:426551}
    ],
  },
  "CT": {
    cities: [
    {name:"Stamford",props:33952,avg:317058},
    {name:"Bridgeport",props:28851,avg:107302},
    {name:"Waterbury",props:27575,avg:74746},
    {name:"Norwalk",props:26148,avg:283535},
    {name:"Danbury",props:23709,avg:191704},
    {name:"Hartford",props:23149,avg:60698},
    {name:"New Haven",props:21552,avg:133490},
    {name:"West Hartford",props:21118,avg:182713},
    {name:"Milford",props:20019,avg:209588},
    {name:"Bristol",props:19304,avg:114550}
    ],
    zips: [
    {zip:"06010",city:"Bristol",props:19304,avg:114550},
    {zip:"06492",city:"Wallingford",props:15022,avg:171300},
    {zip:"06516",city:"West Haven",props:14955,avg:121538},
    {zip:"06484",city:"Shelton",props:14552,avg:194901},
    {zip:"06902",city:"Stamford",props:14387,avg:308306},
    {zip:"06460",city:"Milford",props:14324,avg:209606},
    {zip:"06082",city:"Enfield",props:14124,avg:125406},
    {zip:"06810",city:"Danbury",props:12983,avg:180895}
    ],
  },
  "DC": {
    cities: [
    {name:"Washington",props:157143,avg:568056},
    {name:"Bolling Afb",props:1,avg:740280}
    ],
    zips: [
    {zip:"20011",city:"Washington",props:15937,avg:537639},
    {zip:"20002",city:"Washington",props:15580,avg:573847},
    {zip:"20009",city:"Washington",props:12259,avg:714282},
    {zip:"20019",city:"Washington",props:11960,avg:251626},
    {zip:"20016",city:"Washington",props:10813,avg:843615},
    {zip:"20001",city:"Washington",props:10560,avg:659471},
    {zip:"20020",city:"Washington",props:9556,avg:285726},
    {zip:"20007",city:"Washington",props:9268,avg:1024466}
    ],
  },
  "DE": {
    cities: [
    {name:"Wilmington",props:74266,avg:61081},
    {name:"Newark",props:39729,avg:66820},
    {name:"Dover",props:22338,avg:43265},
    {name:"New Castle",props:18342,avg:51115},
    {name:"Middletown",props:15994,avg:81229},
    {name:"Lewes",props:15933,avg:56456},
    {name:"Bear",props:14059,avg:74052},
    {name:"Millsboro",props:13211,avg:47496},
    {name:"Rehoboth Beach",props:12679,avg:58891},
    {name:"Seaford",props:8481,avg:35686}
    ],
    zips: [
    {zip:"19720",city:"New Castle",props:18342,avg:51115},
    {zip:"19709",city:"Middletown",props:15994,avg:81229},
    {zip:"19958",city:"Lewes",props:15933,avg:56456},
    {zip:"19702",city:"Newark",props:15856,avg:63521},
    {zip:"19808",city:"Wilmington",props:14651,avg:72734},
    {zip:"19711",city:"Newark",props:14640,avg:79085},
    {zip:"19701",city:"Bear",props:14059,avg:74052},
    {zip:"19966",city:"Millsboro",props:13211,avg:47496}
    ],
  },
  "FL": {
    cities: [
    {name:"Miami",props:419230,avg:315977},
    {name:"Jacksonville",props:294823,avg:165621},
    {name:"Orlando",props:279973,avg:203777},
    {name:"Tampa",props:217616,avg:213577},
    {name:"Naples",props:175450,avg:382657},
    {name:"Sarasota",props:120583,avg:257127},
    {name:"Fort Myers",props:117524,avg:193209},
    {name:"Saint Petersburg",props:112029,avg:227057},
    {name:"Kissimmee",props:107963,avg:178983},
    {name:"Pensacola",props:100897,avg:157197}
    ],
    zips: [
    {zip:"32162",city:"The Villages",props:34566,avg:249196},
    {zip:"34787",city:"Winter Garden",props:28504,avg:247689},
    {zip:"34953",city:"Port Saint Lucie",props:26794,avg:203608},
    {zip:"34293",city:"Venice",props:26499,avg:192217},
    {zip:"33139",city:"Miami Beach",props:25510,avg:1378122},
    {zip:"33908",city:"Fort Myers",props:25383,avg:238704},
    {zip:"32137",city:"Palm Coast",props:24110,avg:232644},
    {zip:"34711",city:"Clermont",props:23602,avg:212289}
    ],
  },
  "GA": {
    cities: [
    {name:"Atlanta",props:269757,avg:305471},
    {name:"Marietta",props:99928,avg:248657},
    {name:"Savannah",props:75214,avg:203727},
    {name:"Lawrenceville",props:72206,avg:222238},
    {name:"Augusta",props:70518,avg:139667},
    {name:"Cumming",props:66791,avg:304027},
    {name:"Macon",props:64074,avg:137201},
    {name:"Decatur",props:57832,avg:219036},
    {name:"Columbus",props:57365,avg:143261},
    {name:"Alpharetta",props:57255,avg:378230}
    ],
    zips: [
    {zip:"30040",city:"Cumming",props:28188,avg:302513},
    {zip:"30041",city:"Cumming",props:26723,avg:318033},
    {zip:"30024",city:"Suwanee",props:25518,avg:355539},
    {zip:"30135",city:"Douglasville",props:25171,avg:210841},
    {zip:"30188",city:"Woodstock",props:24986,avg:261801},
    {zip:"30043",city:"Lawrenceville",props:24788,avg:245030},
    {zip:"30349",city:"Atlanta",props:24319,avg:154007},
    {zip:"30052",city:"Loganville",props:24310,avg:229019}
    ],
  },
  "HI": {
    cities: [
    {name:"Honolulu",props:133810,avg:877198},
    {name:"Ewa Beach",props:19480,avg:591999},
    {name:"Mililani",props:18364,avg:565863},
    {name:"Hilo",props:17039,avg:300152},
    {name:"Waipahu",props:16792,avg:778894},
    {name:"Kaneohe",props:16122,avg:842750},
    {name:"Kihei",props:15985,avg:820447},
    {name:"Lahaina",props:15492,avg:861630},
    {name:"Kailua Kona",props:15351,avg:1577924},
    {name:"Kailua",props:13561,avg:985125}
    ],
    zips: [
    {zip:"96815",city:"Honolulu",props:24680,avg:859826},
    {zip:"96706",city:"Ewa Beach",props:19480,avg:591999},
    {zip:"96789",city:"Mililani",props:18364,avg:565863},
    {zip:"96720",city:"Hilo",props:17039,avg:300152},
    {zip:"96797",city:"Waipahu",props:16792,avg:778894},
    {zip:"96744",city:"Kaneohe",props:16122,avg:842750},
    {zip:"96753",city:"Kihei",props:15985,avg:820447},
    {zip:"96761",city:"Lahaina",props:15492,avg:861630}
    ],
  },
  "IA": {
    cities: [
    {name:"Des Moines",props:70921,avg:158517},
    {name:"Cedar Rapids",props:55384,avg:161677},
    {name:"Davenport",props:36373,avg:147529},
    {name:"Sioux City",props:30509,avg:143184},
    {name:"Iowa City",props:27899,avg:235188},
    {name:"Waterloo",props:27729,avg:121667},
    {name:"Ankeny",props:25343,avg:224008},
    {name:"Council Bluffs",props:23789,avg:165248},
    {name:"Dubuque",props:23552,avg:163580},
    {name:"West Des Moines",props:23295,avg:228146}
    ],
    zips: [
    {zip:"52404",city:"Cedar Rapids",props:16036,avg:150090},
    {zip:"52402",city:"Cedar Rapids",props:15289,avg:153586},
    {zip:"50023",city:"Ankeny",props:15084,avg:220627},
    {zip:"52302",city:"Marion",props:14976,avg:187787},
    {zip:"50613",city:"Cedar Falls",props:14910,avg:194507},
    {zip:"52001",city:"Dubuque",props:14398,avg:138182},
    {zip:"52722",city:"Bettendorf",props:14266,avg:207699},
    {zip:"50317",city:"Des Moines",props:13759,avg:131123}
    ],
  },
  "ID": {
    cities: [
    {name:"Boise",props:94676,avg:326318},
    {name:"Nampa",props:43292,avg:251350},
    {name:"Meridian",props:41059,avg:329588},
    {name:"Idaho Falls",props:30817,avg:221177},
    {name:"Caldwell",props:25381,avg:235369},
    {name:"Coeur D Alene",props:22812,avg:335557},
    {name:"Pocatello",props:22085,avg:184032},
    {name:"Twin Falls",props:20087,avg:204708},
    {name:"Post Falls",props:15362,avg:288619},
    {name:"Eagle",props:12954,avg:485868}
    ],
    zips: [
    {zip:"83646",city:"Meridian",props:23395,avg:335644},
    {zip:"83709",city:"Boise",props:21031,avg:302006},
    {zip:"83301",city:"Twin Falls",props:20085,avg:204708},
    {zip:"83686",city:"Nampa",props:19285,avg:263330},
    {zip:"83642",city:"Meridian",props:17663,avg:327021},
    {zip:"83854",city:"Post Falls",props:15353,avg:288626},
    {zip:"83607",city:"Caldwell",props:13141,avg:261603},
    {zip:"83616",city:"Eagle",props:12952,avg:485869}
    ],
  },
  "IL": {
    cities: [
    {name:"Chicago",props:596580,avg:25399},
    {name:"Rockford",props:62011,avg:33594},
    {name:"Springfield",props:54852,avg:46474},
    {name:"Naperville",props:51937,avg:106399},
    {name:"Aurora",props:51482,avg:62517},
    {name:"Joliet",props:44349,avg:48940},
    {name:"Peoria",props:42049,avg:40677},
    {name:"Elgin",props:34608,avg:53244},
    {name:"Plainfield",props:33836,avg:79711},
    {name:"Decatur",props:32934,avg:33744}
    ],
    zips: [
    {zip:"60611",city:"Chicago",props:25782,avg:60511},
    {zip:"60453",city:"Oak Lawn",props:23403,avg:14346},
    {zip:"60614",city:"Chicago",props:23095,avg:72292},
    {zip:"60016",city:"Des Plaines",props:21363,avg:18473},
    {zip:"60657",city:"Chicago",props:20190,avg:52233},
    {zip:"60610",city:"Chicago",props:19417,avg:57779},
    {zip:"60634",city:"Chicago",props:19258,avg:23212},
    {zip:"60629",city:"Chicago",props:19027,avg:13902}
    ],
  },
  "IN": {
    cities: [
    {name:"Indianapolis",props:299028,avg:151175},
    {name:"Fort Wayne",props:106116,avg:143688},
    {name:"Evansville",props:64362,avg:132146},
    {name:"South Bend",props:55861,avg:134432},
    {name:"Bloomington",props:36222,avg:199135},
    {name:"Terre Haute",props:32483,avg:134951},
    {name:"Gary",props:32205,avg:79147},
    {name:"Muncie",props:32183,avg:98027},
    {name:"Lafayette",props:31940,avg:139383},
    {name:"Anderson",props:31185,avg:96915}
    ],
    zips: [
    {zip:"46307",city:"Crown Point",props:24641,avg:219432},
    {zip:"46143",city:"Greenwood",props:18518,avg:203965},
    {zip:"47130",city:"Jeffersonville",props:16911,avg:157441},
    {zip:"47150",city:"New Albany",props:16810,avg:139992},
    {zip:"46350",city:"La Porte",props:16535,avg:140069},
    {zip:"47374",city:"Richmond",props:16331,avg:102381},
    {zip:"46385",city:"Valparaiso",props:15485,avg:222892},
    {zip:"47201",city:"Columbus",props:15128,avg:193592}
    ],
  },
  "KS": {
    cities: [
    {name:"Wichita",props:132912,avg:139063},
    {name:"Topeka",props:57425,avg:131912},
    {name:"Overland Park",props:55027,avg:264199},
    {name:"Kansas City",props:48878,avg:117905},
    {name:"Olathe",props:44443,avg:248498},
    {name:"Lawrence",props:27082,avg:222690},
    {name:"Shawnee",props:24857,avg:234578},
    {name:"Hutchinson",props:18007,avg:117259},
    {name:"Salina",props:17711,avg:159762},
    {name:"Lenexa",props:15534,avg:270959}
    ],
    zips: [
    {zip:"66062",city:"Olathe",props:22917,avg:261557},
    {zip:"66061",city:"Olathe",props:19907,avg:243038},
    {zip:"67401",city:"Salina",props:17711,avg:159762},
    {zip:"67212",city:"Wichita",props:14803,avg:147013},
    {zip:"66614",city:"Topeka",props:10872,avg:146304},
    {zip:"66048",city:"Leavenworth",props:10753,avg:151670},
    {zip:"66104",city:"Kansas City",props:10013,avg:75087},
    {zip:"67203",city:"Wichita",props:9971,avg:102469}
    ],
  },
  "KY": {
    cities: [
    {name:"Louisville",props:255279,avg:164773},
    {name:"Lexington",props:97635,avg:174946},
    {name:"Bowling Green",props:33420,avg:184849},
    {name:"Owensboro",props:30511,avg:148938},
    {name:"Paducah",props:24772,avg:145697},
    {name:"Somerset",props:21701,avg:121370},
    {name:"Frankfort",props:19492,avg:151455},
    {name:"Elizabethtown",props:19479,avg:162270},
    {name:"Richmond",props:19254,avg:181907},
    {name:"Ashland",props:16607,avg:117025}
    ],
    zips: [
    {zip:"42701",city:"Elizabethtown",props:19478,avg:162270},
    {zip:"40601",city:"Frankfort",props:19464,avg:151458},
    {zip:"40475",city:"Richmond",props:19253,avg:181907},
    {zip:"40324",city:"Georgetown",props:16583,avg:197413},
    {zip:"42240",city:"Hopkinsville",props:16030,avg:115458},
    {zip:"42101",city:"Bowling Green",props:15930,avg:140833},
    {zip:"41042",city:"Florence",props:15820,avg:147789},
    {zip:"42301",city:"Owensboro",props:15790,avg:138609}
    ],
  },
  "LA": {
    cities: [
    {name:"New Orleans",props:132173,avg:23504},
    {name:"Baton Rouge",props:126817,avg:15121},
    {name:"Shreveport",props:81776,avg:13534},
    {name:"Lafayette",props:53973,avg:18167},
    {name:"Metairie",props:47902,avg:19275},
    {name:"Lake Charles",props:45391,avg:12219},
    {name:"Slidell",props:31881,avg:13799},
    {name:"Monroe",props:30641,avg:13225},
    {name:"Denham Springs",props:28304,avg:12922},
    {name:"Houma",props:27894,avg:14920}
    ],
    zips: [
    {zip:"70726",city:"Denham Springs",props:20267,avg:12458},
    {zip:"70072",city:"Marrero",props:19698,avg:13602},
    {zip:"70769",city:"Prairieville",props:16494,avg:18379},
    {zip:"70737",city:"Gonzales",props:16441,avg:15037},
    {zip:"70301",city:"Thibodaux",props:15850,avg:15711},
    {zip:"70810",city:"Baton Rouge",props:15405,avg:21438},
    {zip:"70570",city:"Opelousas",props:15299,avg:10067},
    {zip:"70065",city:"Kenner",props:15248,avg:16835}
    ],
  },
  "MA": {
    cities: [
    {name:"Worcester",props:39686,avg:232609},
    {name:"Springfield",props:34249,avg:167620},
    {name:"Boston",props:30331,avg:1640636},
    {name:"Quincy",props:24498,avg:500950},
    {name:"Plymouth",props:24042,avg:352621},
    {name:"Lowell",props:22787,avg:291989},
    {name:"Brockton",props:22718,avg:289498},
    {name:"Cambridge",props:22659,avg:1287630},
    {name:"New Bedford",props:21145,avg:220815},
    {name:"Lynn",props:19460,avg:362643}
    ],
    zips: [
    {zip:"02360",city:"Plymouth",props:24042,avg:352621},
    {zip:"02155",city:"Medford",props:15736,avg:614029},
    {zip:"01844",city:"Methuen",props:14811,avg:333312},
    {zip:"01201",city:"Pittsfield",props:14558,avg:191942},
    {zip:"01960",city:"Peabody",props:14505,avg:402750},
    {zip:"02169",city:"Quincy",props:13967,avg:474035},
    {zip:"02780",city:"Taunton",props:13589,avg:257540},
    {zip:"02301",city:"Brockton",props:13207,avg:295281}
    ],
  },
  "MD": {
    cities: [
    {name:"Baltimore",props:219917,avg:171351},
    {name:"Silver Spring",props:75146,avg:330560},
    {name:"Frederick",props:45229,avg:256488},
    {name:"Rockville",props:39573,avg:412459},
    {name:"Annapolis",props:36332,avg:392552},
    {name:"Upper Marlboro",props:35799,avg:272333},
    {name:"Bowie",props:34859,avg:308253},
    {name:"Ocean City",props:34193,avg:289207},
    {name:"Gaithersburg",props:32762,avg:329072},
    {name:"Bethesda",props:30323,avg:709757}
    ],
    zips: [
    {zip:"21842",city:"Ocean City",props:33608,avg:289473},
    {zip:"21122",city:"Pasadena",props:24196,avg:296943},
    {zip:"20906",city:"Silver Spring",props:21424,avg:313357},
    {zip:"21224",city:"Baltimore",props:20713,avg:202106},
    {zip:"21234",city:"Parkville",props:20175,avg:186735},
    {zip:"21740",city:"Hagerstown",props:18957,avg:160492},
    {zip:"20772",city:"Upper Marlboro",props:18520,avg:278653},
    {zip:"21222",city:"Dundalk",props:18450,avg:142278}
    ],
  },
  "ME": {
    cities: [
    {name:"Portland",props:18111,avg:241725},
    {name:"Wells",props:12276,avg:311982},
    {name:"Lewiston",props:9139,avg:110478},
    {name:"South Portland",props:8666,avg:221458},
    {name:"Bangor",props:8664,avg:140881},
    {name:"Scarborough",props:8368,avg:401066},
    {name:"York",props:7898,avg:417257},
    {name:"Brunswick",props:7780,avg:234488},
    {name:"Windham",props:7420,avg:255119},
    {name:"Saco",props:7235,avg:229236}
    ],
    zips: [
    {zip:"04090",city:"Wells",props:12276,avg:311982},
    {zip:"04103",city:"Portland",props:9266,avg:232727},
    {zip:"04240",city:"Lewiston",props:9139,avg:110478},
    {zip:"04106",city:"South Portland",props:8666,avg:221458},
    {zip:"04401",city:"Bangor",props:8664,avg:140881},
    {zip:"04074",city:"Scarborough",props:8368,avg:401066},
    {zip:"03909",city:"York",props:7898,avg:417257},
    {zip:"04011",city:"Brunswick",props:7780,avg:234488}
    ],
  },
  "MI": {
    cities: [
    {name:"Detroit",props:257549,avg:37714},
    {name:"Grand Rapids",props:106258,avg:109589},
    {name:"Flint",props:61836,avg:38923},
    {name:"Lansing",props:53300,avg:64034},
    {name:"Warren",props:49809,avg:64421},
    {name:"Kalamazoo",props:49282,avg:90742},
    {name:"Saginaw",props:46224,avg:60750},
    {name:"Ann Arbor",props:43294,avg:181344},
    {name:"Sterling Heights",props:41750,avg:105788},
    {name:"Livonia",props:37448,avg:108311}
    ],
    zips: [
    {zip:"48228",city:"Detroit",props:21630,avg:13717},
    {zip:"48180",city:"Taylor",props:20796,avg:56504},
    {zip:"48219",city:"Detroit",props:18966,avg:20748},
    {zip:"48227",city:"Detroit",props:18439,avg:19264},
    {zip:"48235",city:"Detroit",props:18384,avg:19997},
    {zip:"48103",city:"Ann Arbor",props:18368,avg:179081},
    {zip:"48205",city:"Detroit",props:18353,avg:12578},
    {zip:"48224",city:"Detroit",props:17955,avg:17760}
    ],
  },
  "MN": {
    cities: [
    {name:"Minneapolis",props:319213,avg:266294},
    {name:"Saint Paul",props:228945,avg:235713},
    {name:"Rochester",props:44737,avg:219076},
    {name:"Duluth",props:37945,avg:188179},
    {name:"Maple Grove",props:24936,avg:283009},
    {name:"Eden Prairie",props:20380,avg:315935},
    {name:"Lakeville",props:19502,avg:345094},
    {name:"Saint Cloud",props:18437,avg:171346},
    {name:"Burnsville",props:17553,avg:235867},
    {name:"Andover",props:16359,avg:295474}
    ],
    zips: [
    {zip:"55044",city:"Lakeville",props:19502,avg:345094},
    {zip:"55901",city:"Rochester",props:18571,avg:204375},
    {zip:"55124",city:"Saint Paul",props:17547,avg:256933},
    {zip:"55304",city:"Andover",props:16094,avg:295753},
    {zip:"55303",city:"Anoka",props:15612,avg:244863},
    {zip:"55125",city:"Saint Paul",props:14532,avg:271174},
    {zip:"55330",city:"Elk River",props:14407,avg:235646},
    {zip:"55379",city:"Shakopee",props:13729,avg:243978}
    ],
  },
  "MO": {
    cities: [
    {name:"Saint Louis",props:321820,avg:121251},
    {name:"Kansas City",props:182731,avg:64546},
    {name:"Springfield",props:75915,avg:29152},
    {name:"Saint Charles",props:43480,avg:202531},
    {name:"Independence",props:43179,avg:22895},
    {name:"Columbia",props:42891,avg:155060},
    {name:"Florissant",props:37034,avg:115956},
    {name:"Lees Summit",props:34748,avg:44635},
    {name:"O Fallon",props:30533,avg:209954},
    {name:"Saint Peters",props:29571,avg:183066}
    ],
    zips: [
    {zip:"63376",city:"Saint Peters",props:27090,avg:184489},
    {zip:"65203",city:"Columbia",props:19956,avg:176504},
    {zip:"63123",city:"Saint Louis",props:19041,avg:148115},
    {zip:"63129",city:"Saint Louis",props:18674,avg:198485},
    {zip:"63031",city:"Florissant",props:17711,avg:108351},
    {zip:"63301",city:"Saint Charles",props:17098,avg:189300},
    {zip:"63385",city:"Wentzville",props:17063,avg:217199},
    {zip:"63136",city:"Saint Louis",props:16733,avg:53502}
    ],
  },
  "MS": {
    cities: [
    {name:"Jackson",props:54997,avg:106848},
    {name:"Gulfport",props:34951,avg:111199},
    {name:"Brandon",props:27760,avg:161165},
    {name:"Hattiesburg",props:26779,avg:116463},
    {name:"Meridian",props:22078,avg:102887},
    {name:"Biloxi",props:20988,avg:125530},
    {name:"Olive Branch",props:19217,avg:157829},
    {name:"Madison",props:18552,avg:237478},
    {name:"Vicksburg",props:17632,avg:100220},
    {name:"Columbus",props:17257,avg:107864}
    ],
    zips: [
    {zip:"38654",city:"Olive Branch",props:19212,avg:157829},
    {zip:"39110",city:"Madison",props:18543,avg:237488},
    {zip:"39503",city:"Gulfport",props:18423,avg:122798},
    {zip:"39564",city:"Ocean Springs",props:15710,avg:139797},
    {zip:"38655",city:"Oxford",props:15457,avg:195500},
    {zip:"39047",city:"Brandon",props:14741,avg:179737},
    {zip:"39401",city:"Hattiesburg",props:13630,avg:71471},
    {zip:"39120",city:"Natchez",props:13313,avg:75132}
    ],
  },
  "MT": {
    cities: [
    {name:"Billings",props:47412,avg:240737},
    {name:"Missoula",props:29017,avg:297936},
    {name:"Bozeman",props:26582,avg:429094},
    {name:"Great Falls",props:23485,avg:202303},
    {name:"Helena",props:20092,avg:244922},
    {name:"Kalispell",props:20059,avg:247290},
    {name:"Butte",props:13471,avg:165400},
    {name:"Whitefish",props:8385,avg:440576},
    {name:"Belgrade",props:7497,avg:302324},
    {name:"Columbia Falls",props:5838,avg:245275}
    ],
    zips: [
    {zip:"59901",city:"Kalispell",props:20059,avg:247290},
    {zip:"59102",city:"Billings",props:16227,avg:238254},
    {zip:"59718",city:"Bozeman",props:14804,avg:397144},
    {zip:"59701",city:"Butte",props:13387,avg:165386},
    {zip:"59101",city:"Billings",props:12969,avg:199660},
    {zip:"59715",city:"Bozeman",props:11776,avg:460376},
    {zip:"59105",city:"Billings",props:10860,avg:230659},
    {zip:"59404",city:"Great Falls",props:10514,avg:221301}
    ],
  },
  "NC": {
    cities: [
    {name:"Charlotte",props:279369,avg:233123},
    {name:"Raleigh",props:159616,avg:279204},
    {name:"Greensboro",props:106044,avg:139646},
    {name:"Winston Salem",props:89737,avg:129563},
    {name:"Durham",props:89189,avg:223131},
    {name:"Fayetteville",props:84160,avg:117584},
    {name:"Wilmington",props:74874,avg:206960},
    {name:"Cary",props:49877,avg:335232},
    {name:"Concord",props:46118,avg:203134},
    {name:"Asheville",props:44078,avg:261014}
    ],
    zips: [
    {zip:"28269",city:"Charlotte",props:27415,avg:192280},
    {zip:"27587",city:"Wake Forest",props:25759,avg:299051},
    {zip:"28078",city:"Huntersville",props:25222,avg:291711},
    {zip:"28645",city:"Lenoir",props:25178,avg:103871},
    {zip:"28027",city:"Concord",props:24070,avg:228224},
    {zip:"28277",city:"Charlotte",props:23793,avg:327591},
    {zip:"28025",city:"Concord",props:22047,avg:182586},
    {zip:"28655",city:"Morganton",props:21831,avg:148891}
    ],
  },
  "ND": {
    cities: [
    {name:"Fargo",props:28523,avg:201931},
    {name:"Bismarck",props:26111,avg:117468},
    {name:"Minot",props:15747,avg:199425},
    {name:"Grand Forks",props:14224,avg:193556},
    {name:"West Fargo",props:11714,avg:216306},
    {name:"Williston",props:8450,avg:247564},
    {name:"Mandan",props:8253,avg:225405},
    {name:"Dickinson",props:7358,avg:208841},
    {name:"Jamestown",props:6219,avg:168395},
    {name:"Valley City",props:2692,avg:69763}
    ],
    zips: [
    {zip:"58078",city:"West Fargo",props:11714,avg:216306},
    {zip:"58104",city:"Fargo",props:10718,avg:266568},
    {zip:"58503",city:"Bismarck",props:10612,avg:133465},
    {zip:"58201",city:"Grand Forks",props:10415,avg:205855},
    {zip:"58103",city:"Fargo",props:10028,avg:182515},
    {zip:"58701",city:"Minot",props:8715,avg:208586},
    {zip:"58501",city:"Bismarck",props:8600,avg:99531},
    {zip:"58801",city:"Williston",props:8449,avg:247564}
    ],
  },
  "NE": {
    cities: [
    {name:"Omaha",props:174139,avg:181777},
    {name:"Lincoln",props:86170,avg:186528},
    {name:"Bellevue",props:19243,avg:166462},
    {name:"Grand Island",props:16260,avg:150075},
    {name:"Papillion",props:14979,avg:237540},
    {name:"Kearney",props:11824,avg:215556},
    {name:"Elkhorn",props:11551,avg:309396},
    {name:"Fremont",props:11338,avg:179687},
    {name:"Columbus",props:11107,avg:185479},
    {name:"North Platte",props:10978,avg:144702}
    ],
    zips: [
    {zip:"68516",city:"Lincoln",props:15085,avg:244931},
    {zip:"68104",city:"Omaha",props:11876,avg:115263},
    {zip:"68022",city:"Elkhorn",props:11551,avg:309396},
    {zip:"68025",city:"Fremont",props:11328,avg:179689},
    {zip:"68601",city:"Columbus",props:11107,avg:185479},
    {zip:"68116",city:"Omaha",props:10999,avg:227382},
    {zip:"69101",city:"North Platte",props:10978,avg:144702},
    {zip:"68701",city:"Norfolk",props:10739,avg:168781}
    ],
  },
  "NH": {
    cities: [
    {name:"Manchester",props:29196,avg:205438},
    {name:"Nashua",props:25484,avg:262238},
    {name:"Concord",props:11766,avg:222289},
    {name:"Derry",props:11091,avg:245829},
    {name:"Rochester",props:10959,avg:183138},
    {name:"Salem",props:10897,avg:275032},
    {name:"Keene",props:9649,avg:183221},
    {name:"Merrimack",props:9377,avg:240125},
    {name:"Dover",props:9177,avg:283669},
    {name:"Londonderry",props:8771,avg:317988}
    ],
    zips: [
    {zip:"03038",city:"Derry",props:11091,avg:245829},
    {zip:"03079",city:"Salem",props:10897,avg:275032},
    {zip:"03431",city:"Keene",props:9648,avg:183221},
    {zip:"03062",city:"Nashua",props:9555,avg:272562},
    {zip:"03054",city:"Merrimack",props:9377,avg:240125},
    {zip:"03820",city:"Dover",props:9177,avg:283669},
    {zip:"03103",city:"Manchester",props:8986,avg:191124},
    {zip:"03104",city:"Manchester",props:8841,avg:219645}
    ],
  },
  "NJ": {
    cities: [
    {name:"Trenton",props:54948,avg:179877},
    {name:"Toms River",props:50254,avg:212802},
    {name:"Jersey City",props:45393,avg:389002},
    {name:"Newark",props:30925,avg:142751},
    {name:"Brick",props:29113,avg:250302},
    {name:"Edison",props:25633,avg:159671},
    {name:"Cherry Hill",props:24015,avg:198843},
    {name:"Lakewood",props:22986,avg:307745},
    {name:"Clifton",props:21197,avg:171644},
    {name:"Monroe Township",props:20507,avg:304757}
    ],
    zips: [
    {zip:"08753",city:"Toms River",props:23704,avg:229813},
    {zip:"08701",city:"Lakewood",props:22986,avg:307745},
    {zip:"08831",city:"Monroe Township",props:20507,avg:304757},
    {zip:"08260",city:"Wildwood",props:19459,avg:326925},
    {zip:"08226",city:"Ocean City",props:19070,avg:617441},
    {zip:"08527",city:"Jackson",props:17993,avg:295515},
    {zip:"07728",city:"Freehold",props:17884,avg:353119},
    {zip:"08757",city:"Toms River",props:17843,avg:165046}
    ],
  },
  "NM": {
    cities: [
    {name:"Albuquerque",props:195906,avg:175093},
    {name:"Santa Fe",props:51063,avg:288640},
    {name:"Las Cruces",props:46821,avg:54659},
    {name:"Rio Rancho",props:36074,avg:153489},
    {name:"Roswell",props:19564,avg:128043},
    {name:"Clovis",props:19013,avg:125189},
    {name:"Farmington",props:16438,avg:172107},
    {name:"Los Lunas",props:16334,avg:148824},
    {name:"Carlsbad",props:16190,avg:129980},
    {name:"Hobbs",props:14732,avg:35313}
    ],
    zips: [
    {zip:"87120",city:"Albuquerque",props:23440,avg:190150},
    {zip:"87114",city:"Albuquerque",props:20816,avg:194049},
    {zip:"87124",city:"Rio Rancho",props:20594,avg:150744},
    {zip:"87121",city:"Albuquerque",props:20394,avg:114174},
    {zip:"88101",city:"Clovis",props:19013,avg:125189},
    {zip:"87111",city:"Albuquerque",props:18515,avg:230814},
    {zip:"87105",city:"Albuquerque",props:16965,avg:131086},
    {zip:"87031",city:"Los Lunas",props:16334,avg:148824}
    ],
  },
  "NV": {
    cities: [
    {name:"Las Vegas",props:485026,avg:231301},
    {name:"Henderson",props:114979,avg:243332},
    {name:"Reno",props:96119,avg:192086},
    {name:"North Las Vegas",props:72035,avg:203273},
    {name:"Sparks",props:39904,avg:183795},
    {name:"Pahrump",props:20369,avg:49900},
    {name:"Carson City",props:18770,avg:80234},
    {name:"Mesquite",props:10468,avg:209663},
    {name:"Gardnerville",props:9293,avg:307890},
    {name:"Fallon",props:8028,avg:55104}
    ],
    zips: [
    {zip:"89031",city:"North Las Vegas",props:23569,avg:229153},
    {zip:"89052",city:"Henderson",props:21849,avg:324294},
    {zip:"89123",city:"Las Vegas",props:21176,avg:238480},
    {zip:"89148",city:"Las Vegas",props:20855,avg:296841},
    {zip:"89117",city:"Las Vegas",props:19075,avg:262565},
    {zip:"89108",city:"Las Vegas",props:18852,avg:147573},
    {zip:"89129",city:"Las Vegas",props:18424,avg:249995},
    {zip:"89074",city:"Henderson",props:18028,avg:227598}
    ],
  },
  "NY": {
    cities: [
    {name:"Brooklyn",props:296424,avg:888512},
    {name:"New York",props:238758,avg:241502},
    {name:"Buffalo",props:162951,avg:94020},
    {name:"Rochester",props:139749,avg:104504},
    {name:"Staten Island",props:119959,avg:536708},
    {name:"Bronx",props:99261,avg:515869},
    {name:"Syracuse",props:61756,avg:90308},
    {name:"Schenectady",props:52101,avg:151613},
    {name:"Flushing",props:43262,avg:60150},
    {name:"Albany",props:39208,avg:143278}
    ],
    zips: [
    {zip:"10314",city:"Staten Island",props:24137,avg:559361},
    {zip:"11234",city:"Brooklyn",props:19652,avg:658090},
    {zip:"10023",city:"New York",props:18780,avg:305778},
    {zip:"10312",city:"Staten Island",props:18110,avg:611967},
    {zip:"11375",city:"Forest Hills",props:17640,avg:77887},
    {zip:"14580",city:"Webster",props:17518,avg:173302},
    {zip:"11758",city:"Massapequa",props:17432,avg:535},
    {zip:"14221",city:"Buffalo",props:17043,avg:201559}
    ],
  },
  "OH": {
    cities: [
    {name:"Cincinnati",props:255134,avg:142439},
    {name:"Cleveland",props:239233,avg:98405},
    {name:"Columbus",props:231096,avg:140588},
    {name:"Dayton",props:156118,avg:102320},
    {name:"Toledo",props:106647,avg:81924},
    {name:"Akron",props:85355,avg:103038},
    {name:"Youngstown",props:61892,avg:81233},
    {name:"Canton",props:54009,avg:170437},
    {name:"Springfield",props:35664,avg:105980},
    {name:"Westerville",props:31497,avg:208177}
    ],
    zips: [
    {zip:"43701",city:"Zanesville",props:23064,avg:121826},
    {zip:"43055",city:"Newark",props:22502,avg:112295},
    {zip:"44256",city:"Medina",props:22409,avg:192035},
    {zip:"43123",city:"Grove City",props:22132,avg:168494},
    {zip:"44060",city:"Mentor",props:22072,avg:169154},
    {zip:"44035",city:"Elyria",props:20927,avg:102498},
    {zip:"43081",city:"Westerville",props:20474,avg:175328},
    {zip:"43026",city:"Hilliard",props:20264,avg:185583}
    ],
  },
  "OK": {
    cities: [
    {name:"Oklahoma City",props:197323,avg:139559},
    {name:"Tulsa",props:138533,avg:145705},
    {name:"Edmond",props:63004,avg:227738},
    {name:"Broken Arrow",props:46644,avg:175234},
    {name:"Norman",props:40267,avg:151125},
    {name:"Lawton",props:32024,avg:13782},
    {name:"Yukon",props:31041,avg:177047},
    {name:"Enid",props:21438,avg:125058},
    {name:"Moore",props:20183,avg:140901},
    {name:"Muskogee",props:17563,avg:98374}
    ],
    zips: [
    {zip:"73099",city:"Yukon",props:31039,avg:177047},
    {zip:"74012",city:"Broken Arrow",props:20622,avg:151317},
    {zip:"73013",city:"Edmond",props:19929,avg:223310},
    {zip:"73160",city:"Moore",props:19261,avg:140413},
    {zip:"73505",city:"Lawton",props:17151,avg:14623},
    {zip:"74055",city:"Owasso",props:15854,avg:200811},
    {zip:"73034",city:"Edmond",props:15613,avg:239173},
    {zip:"73012",city:"Edmond",props:14407,avg:250904}
    ],
  },
  "OR": {
    cities: [
    {name:"Portland",props:273986,avg:444559},
    {name:"Eugene",props:63724,avg:319595},
    {name:"Salem",props:60542,avg:270725},
    {name:"Beaverton",props:54024,avg:348896},
    {name:"Bend",props:47640,avg:430529},
    {name:"Medford",props:28567,avg:291461},
    {name:"Hillsboro",props:26615,avg:358760},
    {name:"Grants Pass",props:25945,avg:294858},
    {name:"Springfield",props:24988,avg:272761},
    {name:"Klamath Falls",props:21474,avg:180247}
    ],
    zips: [
    {zip:"97229",city:"Portland",props:22328,avg:471068},
    {zip:"97702",city:"Bend",props:19059,avg:408527},
    {zip:"97045",city:"Oregon City",props:18149,avg:384364},
    {zip:"97405",city:"Eugene",props:17987,avg:340884},
    {zip:"97206",city:"Portland",props:17593,avg:392558},
    {zip:"97402",city:"Eugene",props:16605,avg:259854},
    {zip:"97504",city:"Medford",props:16016,avg:315319},
    {zip:"97007",city:"Beaverton",props:15218,avg:391759}
    ],
  },
  "PA": {
    cities: [
    {name:"Philadelphia",props:468763,avg:227435},
    {name:"Pittsburgh",props:237054,avg:129851},
    {name:"Reading",props:64652,avg:100351},
    {name:"Erie",props:59523,avg:114003},
    {name:"York",props:58702,avg:125924},
    {name:"Harrisburg",props:51737,avg:112361},
    {name:"Lancaster",props:50330,avg:164232},
    {name:"Allentown",props:48010,avg:159204},
    {name:"Bethlehem",props:34947,avg:89881},
    {name:"West Chester",props:32267,avg:160540}
    ],
    zips: [
    {zip:"19143",city:"Philadelphia",props:21124,avg:156333},
    {zip:"19134",city:"Philadelphia",props:20706,avg:92545},
    {zip:"15601",city:"Greensburg",props:20120,avg:27436},
    {zip:"17603",city:"Lancaster",props:19750,avg:147590},
    {zip:"17331",city:"Hanover",props:19466,avg:143203},
    {zip:"19124",city:"Philadelphia",props:19103,avg:99723},
    {zip:"19120",city:"Philadelphia",props:18630,avg:102302},
    {zip:"19148",city:"Philadelphia",props:18378,avg:202824}
    ],
  },
  "RI": {
    cities: [
    {name:"Providence",props:33334,avg:267181},
    {name:"Warwick",props:28998,avg:232297},
    {name:"Cranston",props:25797,avg:229617},
    {name:"Pawtucket",props:17220,avg:185678},
    {name:"Cumberland",props:12009,avg:277998},
    {name:"Coventry",props:11615,avg:252641},
    {name:"North Providence",props:10806,avg:216776},
    {name:"Westerly",props:10367,avg:377040},
    {name:"Johnston",props:9710,avg:178815},
    {name:"Wakefield",props:9682,avg:355547}
    ],
    zips: [
    {zip:"02864",city:"Cumberland",props:12009,avg:277998},
    {zip:"02816",city:"Coventry",props:11603,avg:252632},
    {zip:"02920",city:"Cranston",props:11085,avg:213450},
    {zip:"02889",city:"Warwick",props:10826,avg:246769},
    {zip:"02886",city:"Warwick",props:10500,avg:242923},
    {zip:"02891",city:"Westerly",props:10367,avg:377040},
    {zip:"02919",city:"Johnston",props:9710,avg:178815},
    {zip:"02879",city:"Wakefield",props:9682,avg:355547}
    ],
  },
  "SC": {
    cities: [
    {name:"Columbia",props:108080,avg:134373},
    {name:"Myrtle Beach",props:72538,avg:199996},
    {name:"Greenville",props:71190,avg:168344},
    {name:"Charleston",props:57992,avg:267738},
    {name:"Summerville",props:51059,avg:173664},
    {name:"Sumter",props:42765,avg:119461},
    {name:"Anderson",props:42096,avg:135106},
    {name:"Lexington",props:39109,avg:179070},
    {name:"Spartanburg",props:38737,avg:149988},
    {name:"Fort Mill",props:37854,avg:289335}
    ],
    zips: [
    {zip:"29681",city:"Simpsonville",props:22651,avg:205026},
    {zip:"29072",city:"Lexington",props:21918,avg:203870},
    {zip:"29582",city:"North Myrtle Beach",props:20499,avg:284450},
    {zip:"29483",city:"Summerville",props:20179,avg:166336},
    {zip:"29732",city:"Rock Hill",props:19716,avg:199373},
    {zip:"29579",city:"Myrtle Beach",props:19621,avg:213380},
    {zip:"29928",city:"Hilton Head Island",props:19557,avg:554495},
    {zip:"29720",city:"Lancaster",props:19356,avg:160128}
    ],
  },
  "SD": {
    cities: [
    {name:"Sioux Falls",props:56591,avg:200323},
    {name:"Rapid City",props:30763,avg:228478},
    {name:"Aberdeen",props:10792,avg:165830},
    {name:"Watertown",props:9096,avg:200788},
    {name:"Brookings",props:7087,avg:198098},
    {name:"Yankton",props:6689,avg:178664},
    {name:"Mitchell",props:6150,avg:184895},
    {name:"Pierre",props:6092,avg:173246},
    {name:"Spearfish",props:5566,avg:216833},
    {name:"Huron",props:5463,avg:128610}
    ],
    zips: [
    {zip:"57701",city:"Rapid City",props:12830,avg:195330},
    {zip:"57106",city:"Sioux Falls",props:12732,avg:179474},
    {zip:"57702",city:"Rapid City",props:12092,avg:260877},
    {zip:"57401",city:"Aberdeen",props:10792,avg:165830},
    {zip:"57103",city:"Sioux Falls",props:10755,avg:179496},
    {zip:"57108",city:"Sioux Falls",props:9360,avg:289184},
    {zip:"57201",city:"Watertown",props:9096,avg:200788},
    {zip:"57105",city:"Sioux Falls",props:8162,avg:194808}
    ],
  },
  "TN": {
    cities: [
    {name:"Memphis",props:213870,avg:120207},
    {name:"Nashville",props:154605,avg:270567},
    {name:"Knoxville",props:144520,avg:194188},
    {name:"Chattanooga",props:68342,avg:157997},
    {name:"Clarksville",props:63612,avg:173522},
    {name:"Murfreesboro",props:62663,avg:211930},
    {name:"Crossville",props:48190,avg:116236},
    {name:"Sevierville",props:41409,avg:144727},
    {name:"Kingsport",props:41070,avg:144950},
    {name:"Franklin",props:36967,avg:360926}
    ],
    zips: [
    {zip:"37876",city:"Sevierville",props:26010,avg:129946},
    {zip:"37042",city:"Clarksville",props:25942,avg:138128},
    {zip:"37013",city:"Antioch",props:24605,avg:167659},
    {zip:"37075",city:"Hendersonville",props:23814,avg:275094},
    {zip:"38401",city:"Columbia",props:23398,avg:157933},
    {zip:"37122",city:"Mount Juliet",props:22974,avg:242068},
    {zip:"37064",city:"Franklin",props:21696,avg:310211},
    {zip:"37027",city:"Brentwood",props:20958,avg:447079}
    ],
  },
  "TX": {
    cities: [
    {name:"Houston",props:766808,avg:236811},
    {name:"San Antonio",props:513542,avg:214295},
    {name:"Dallas",props:314997,avg:283592},
    {name:"Austin",props:289368,avg:362288},
    {name:"Fort Worth",props:259098,avg:200079},
    {name:"El Paso",props:207358,avg:145739},
    {name:"Spring",props:126718,avg:236775},
    {name:"Katy",props:107569,avg:242956},
    {name:"Arlington",props:103266,avg:201171},
    {name:"Corpus Christi",props:100017,avg:173801}
    ],
    zips: [
    {zip:"77449",city:"Katy",props:35969,avg:173400},
    {zip:"77494",city:"Katy",props:34436,avg:332722},
    {zip:"78660",city:"Pflugerville",props:32509,avg:238990},
    {zip:"77433",city:"Cypress",props:30985,avg:274195},
    {zip:"79936",city:"El Paso",props:30420,avg:138593},
    {zip:"78130",city:"New Braunfels",props:29637,avg:230274},
    {zip:"77479",city:"Sugar Land",props:28918,avg:342094},
    {zip:"77573",city:"League City",props:28797,avg:257642}
    ],
  },
  "UT": {
    cities: [
    {name:"Salt Lake City",props:123248,avg:349093},
    {name:"Ogden",props:53811,avg:285800},
    {name:"Saint George",props:33991,avg:330320},
    {name:"Sandy",props:33240,avg:383894},
    {name:"West Jordan",props:30245,avg:303205},
    {name:"West Valley City",props:28768,avg:251900},
    {name:"South Jordan",props:22928,avg:387921},
    {name:"Provo",props:22650,avg:317542},
    {name:"Orem",props:22218,avg:320431},
    {name:"Layton",props:20363,avg:309550}
    ],
    zips: [
    {zip:"84043",city:"Lehi",props:19801,avg:355586},
    {zip:"84015",city:"Clearfield",props:17705,avg:259421},
    {zip:"84790",city:"Saint George",props:17691,avg:346176},
    {zip:"84404",city:"Ogden",props:17406,avg:262050},
    {zip:"84770",city:"Saint George",props:16300,avg:314845},
    {zip:"84074",city:"Tooele",props:14962,avg:264063},
    {zip:"84121",city:"Salt Lake City",props:14163,avg:416620},
    {zip:"84096",city:"Herriman",props:14052,avg:364133}
    ],
  },
  "VA": {
    cities: [
    {name:"Virginia Beach",props:147522,avg:294942},
    {name:"Alexandria",props:98102,avg:443581},
    {name:"Richmond",props:86333,avg:254817},
    {name:"Chesapeake",props:76150,avg:246467},
    {name:"Arlington",props:62349,avg:619278},
    {name:"Norfolk",props:59270,avg:230922},
    {name:"Woodbridge",props:57603,avg:326553},
    {name:"Fredericksburg",props:57547,avg:267460},
    {name:"Henrico",props:57248,avg:240260},
    {name:"Roanoke",props:55828,avg:180656}
    ],
    zips: [
    {zip:"23464",city:"Virginia Beach",props:23848,avg:228980},
    {zip:"22193",city:"Woodbridge",props:22675,avg:326136},
    {zip:"23456",city:"Virginia Beach",props:20886,avg:323307},
    {zip:"23322",city:"Chesapeake",props:20870,avg:320198},
    {zip:"22407",city:"Fredericksburg",props:20334,avg:260454},
    {zip:"23112",city:"Midlothian",props:19760,avg:270827},
    {zip:"23462",city:"Virginia Beach",props:19754,avg:201759},
    {zip:"23188",city:"Williamsburg",props:19184,avg:277877}
    ],
  },
  "VT": {
    cities: [
    {name:"Burlington",props:9570,avg:259793},
    {name:"Essex Junction",props:7229,avg:278171},
    {name:"South Burlington",props:6769,avg:283562},
    {name:"Rutland",props:6574,avg:179333},
    {name:"Colchester",props:5888,avg:335102},
    {name:"Barre",props:5501,avg:171137},
    {name:"Saint Albans",props:5281,avg:201002},
    {name:"Bennington",props:4896,avg:173713},
    {name:"Milton",props:4494,avg:229346},
    {name:"Stowe",props:4105,avg:447956}
    ],
    zips: [
    {zip:"05452",city:"Essex Junction",props:7229,avg:278171},
    {zip:"05403",city:"South Burlington",props:6769,avg:283562},
    {zip:"05701",city:"Rutland",props:6574,avg:179333},
    {zip:"05401",city:"Burlington",props:6045,avg:284993},
    {zip:"05446",city:"Colchester",props:5820,avg:339341},
    {zip:"05641",city:"Barre",props:5501,avg:171137},
    {zip:"05478",city:"Saint Albans",props:5281,avg:201002},
    {zip:"05201",city:"Bennington",props:4896,avg:173713}
    ],
  },
  "WA": {
    cities: [
    {name:"Seattle",props:213461,avg:673500},
    {name:"Vancouver",props:101933,avg:345676},
    {name:"Spokane",props:93135,avg:225274},
    {name:"Tacoma",props:88188,avg:355561},
    {name:"Olympia",props:52905,avg:320960},
    {name:"Bellingham",props:45023,avg:359729},
    {name:"Everett",props:44294,avg:408360},
    {name:"Puyallup",props:42990,avg:346245},
    {name:"Bellevue",props:42856,avg:843543},
    {name:"Renton",props:41039,avg:410566}
    ],
    zips: [
    {zip:"99301",city:"Pasco",props:21702,avg:222892},
    {zip:"98682",city:"Vancouver",props:19720,avg:323169},
    {zip:"98052",city:"Redmond",props:17738,avg:716854},
    {zip:"99208",city:"Spokane",props:17626,avg:239192},
    {zip:"98115",city:"Seattle",props:17602,avg:709016},
    {zip:"98258",city:"Lake Stevens",props:17095,avg:421194},
    {zip:"98226",city:"Bellingham",props:16969,avg:344120},
    {zip:"98208",city:"Everett",props:16793,avg:441485}
    ],
  },
  "WI": {
    cities: [
    {name:"Milwaukee",props:203940,avg:145668},
    {name:"Madison",props:69980,avg:229225},
    {name:"Green Bay",props:53815,avg:158526},
    {name:"Appleton",props:38022,avg:175838},
    {name:"Kenosha",props:33207,avg:150707},
    {name:"Racine",props:33060,avg:137872},
    {name:"Waukesha",props:28541,avg:228437},
    {name:"Janesville",props:26670,avg:177044},
    {name:"Oshkosh",props:25808,avg:141683},
    {name:"Eau Claire",props:25596,avg:177581}
    ],
    zips: [
    {zip:"53511",city:"Beloit",props:16892,avg:113034},
    {zip:"54956",city:"Neenah",props:15467,avg:180511},
    {zip:"53704",city:"Madison",props:14949,avg:215576},
    {zip:"54220",city:"Manitowoc",props:14676,avg:130265},
    {zip:"54703",city:"Eau Claire",props:14644,avg:162426},
    {zip:"54115",city:"De Pere",props:14393,avg:218957},
    {zip:"54915",city:"Appleton",props:13695,avg:181782},
    {zip:"53081",city:"Sheboygan",props:13457,avg:101560}
    ],
  },
  "WV": {
    cities: [
    {name:"Charleston",props:45298,avg:83690},
    {name:"Morgantown",props:30307,avg:106534},
    {name:"Huntington",props:26915,avg:61021},
    {name:"Martinsburg",props:20713,avg:106815},
    {name:"Parkersburg",props:18380,avg:72779},
    {name:"Wheeling",props:17233,avg:84758},
    {name:"Fairmont",props:16929,avg:88184},
    {name:"Beckley",props:14225,avg:69083},
    {name:"Saint Albans",props:12653,avg:60771},
    {name:"Clarksburg",props:11727,avg:56412}
    ],
    zips: [
    {zip:"26003",city:"Wheeling",props:17233,avg:84758},
    {zip:"26554",city:"Fairmont",props:16756,avg:88190},
    {zip:"25801",city:"Beckley",props:14223,avg:69083},
    {zip:"26508",city:"Morgantown",props:13188,avg:127792},
    {zip:"25177",city:"Saint Albans",props:12653,avg:60771},
    {zip:"26301",city:"Clarksburg",props:11637,avg:56394},
    {zip:"26101",city:"Parkersburg",props:11496,avg:60872},
    {zip:"26505",city:"Morgantown",props:9032,avg:96584}
    ],
  },
  "WY": {
    cities: [
    {name:"Cheyenne",props:31254,avg:242012},
    {name:"Casper",props:24242,avg:200154},
    {name:"Gillette",props:13144,avg:190440},
    {name:"Laramie",props:10535,avg:230555},
    {name:"Sheridan",props:9578,avg:272719},
    {name:"Rock Springs",props:8195,avg:19550},
    {name:"Cody",props:6751,avg:293715},
    {name:"Jackson",props:6725,avg:1258477},
    {name:"Riverton",props:6324,avg:180864},
    {name:"Evanston",props:4725,avg:172935}
    ],
    zips: [
    {zip:"82009",city:"Cheyenne",props:13396,avg:285276},
    {zip:"82001",city:"Cheyenne",props:12113,avg:218631},
    {zip:"82801",city:"Sheridan",props:9577,avg:272718},
    {zip:"82604",city:"Casper",props:9467,avg:200338},
    {zip:"82601",city:"Casper",props:9200,avg:189867},
    {zip:"82901",city:"Rock Springs",props:8195,avg:19550},
    {zip:"82718",city:"Gillette",props:8106,avg:209778},
    {zip:"82414",city:"Cody",props:6751,avg:293715}
    ],
  },
};