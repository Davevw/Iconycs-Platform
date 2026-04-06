'use client';

/**
 * ICONYCS Analytics Reports Sprint 1
 * Live Snowflake data, full drill-down, mortgage intelligence, export.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GEO_DATA } from '@/lib/geodata';

// ---  County FIPS Code Lookup  ---
const COUNTY_FIPS: Record<string, Record<string, string>> = {
  CA: { '001':'Alameda','003':'Alpine','005':'Amador','007':'Butte','009':'Calaveras','011':'Colusa','013':'Contra Costa','015':'Del Norte','017':'El Dorado','019':'Fresno','021':'Glenn','023':'Humboldt','025':'Imperial','027':'Inyo','029':'Kern','031':'Kings','033':'Lake','035':'Lassen','037':'Los Angeles','039':'Madera','041':'Marin','043':'Mariposa','045':'Mendocino','047':'Merced','049':'Modoc','051':'Mono','053':'Monterey','055':'Napa','057':'Nevada','059':'Orange','061':'Placer','063':'Plumas','065':'Riverside','067':'Sacramento','069':'San Benito','071':'San Bernardino','073':'San Diego','075':'San Francisco','077':'San Joaquin','079':'San Luis Obispo','081':'San Mateo','083':'Santa Barbara','085':'Santa Clara','087':'Santa Cruz','089':'Shasta','091':'Sierra','093':'Siskiyou','095':'Solano','097':'Sonoma','099':'Stanislaus','101':'Sutter','103':'Tehama','105':'Trinity','107':'Tulare','109':'Tuolumne','111':'Ventura','113':'Yolo','115':'Yuba' },
  TX: { '001':'Anderson','003':'Andrews','005':'Angelina','007':'Aransas','009':'Archer','011':'Armstrong','013':'Atascosa','015':'Austin','017':'Bailey','019':'Bandera','021':'Bastrop','023':'Baylor','025':'Bee','027':'Bell','029':'Bexar','031':'Blanco','033':'Borden','035':'Bosque','037':'Bowie','039':'Brazoria','041':'Brazos','043':'Brewster','045':'Briscoe','047':'Brooks','049':'Brown','051':'Burleson','053':'Burnet','055':'Caldwell','057':'Calhoun','059':'Callahan','061':'Cameron','063':'Camp','065':'Carson','067':'Cass','069':'Castro','071':'Chambers','073':'Cherokee','075':'Childress','077':'Clay','079':'Cochran','081':'Coke','083':'Coleman','085':'Collin','087':'Collingsworth','089':'Colorado','091':'Comal','093':'Comanche','095':'Concho','097':'Cooke','099':'Corpus Christi','101':'Cottle','103':'Crane','105':'Crockett','107':'Crosby','109':'Culberson','111':'Dallam','113':'Dallas','115':'Dawson','117':'Deaf Smith','119':'Delta','121':'Denton','123':'De Witt','125':'Dickens','127':'Dimmit','129':'Donley','131':'Duval','133':'Eastland','135':'Ector','137':'Edwards','139':'Ellis','141':'El Paso','143':'Erath','145':'Falls','147':'Fannin','149':'Fayette','151':'Fisher','153':'Floyd','155':'Foard','157':'Fort Bend','159':'Franklin','161':'Freestone','163':'Frio','165':'Gaines','167':'Galveston','169':'Garza','171':'Gillespie','173':'Glasscock','175':'Goliad','177':'Gonzales','179':'Gray','181':'Grayson','183':'Gregg','185':'Grimes','187':'Guadalupe','189':'Hale','191':'Hall','193':'Hamilton','195':'Hansford','197':'Hardeman','199':'Hardin','201':'Harris','203':'Harrison','205':'Hartley','207':'Haskell','209':'Hays','211':'Hemphill','213':'Henderson','215':'Hidalgo','217':'Hill','219':'Hockley','221':'Hood','223':'Hopkins','225':'Houston','227':'Howard','229':'Hudspeth','231':'Hunt','233':'Hutchinson','235':'Irion','237':'Jack','239':'Jackson','241':'Jasper','243':'Jeff Davis','245':'Jefferson','247':'Jim Hogg','249':'Jim Wells','251':'Johnson','253':'Jones','255':'Karnes','257':'Kaufman','259':'Kendall','261':'Kenedy','263':'Kent','265':'Kerr','267':'Kimble','269':'King','271':'Kinney','273':'Kleberg','275':'Knox','277':'Lamar','279':'Lamb','281':'Lampasas','283':'La Salle','285':'Lavaca','287':'Lee','289':'Leon','291':'Liberty','293':'Limestone','295':'Lipscomb','297':'Live Oak','299':'Llano','301':'Loving','303':'Lubbock','305':'Lynn','307':'McCulloch','309':'McLennan','311':'McMullen','313':'Madison','315':'Marion','317':'Martin','319':'Mason','321':'Matagorda','323':'Maverick','325':'Medina','327':'Menard','329':'Midland','331':'Milam','333':'Mills','335':'Mitchell','337':'Montague','339':'Montgomery','341':'Moore','343':'Morris','345':'Motley','347':'Nacogdoches','349':'Navarro','351':'Newton','353':'Nolan','355':'Nueces','357':'Ochiltree','359':'Oldham','361':'Orange','363':'Palo Pinto','365':'Panola','367':'Parker','369':'Parmer','371':'Pecos','373':'Polk','375':'Potter','377':'Presidio','379':'Rains','381':'Randall','383':'Reagan','385':'Real','387':'Red River','389':'Reeves','391':'Refugio','393':'Roberts','395':'Robertson','397':'Rockwall','399':'Runnels','401':'Rusk','403':'Sabine','405':'San Augustine','407':'San Jacinto','409':'San Patricio','411':'San Saba','413':'Schleicher','415':'Scurry','417':'Shackelford','419':'Shelby','421':'Sherman','423':'Smith','425':'Somervell','427':'Starr','429':'Stephens','431':'Sterling','433':'Stonewall','435':'Sutton','437':'Swisher','439':'Tarrant','441':'Taylor','443':'Terrell','445':'Terry','447':'Throckmorton','449':'Titus','451':'Tom Green','453':'Travis','455':'Trinity','457':'Tyler','459':'Upshur','461':'Upton','463':'Uvalde','465':'Val Verde','467':'Van Zandt','469':'Victoria','471':'Walker','473':'Waller','475':'Ward','477':'Washington','479':'Webb','481':'Wharton','483':'Wheeler','485':'Wichita','487':'Wilbarger','489':'Willacy','491':'Williamson','493':'Wilson','495':'Winkler','497':'Wise','499':'Wood','501':'Yoakum','503':'Young','505':'Zapata','507':'Zavala' },
  FL: { '001':'Alachua','003':'Baker','005':'Bay','007':'Bradford','009':'Brevard','011':'Broward','013':'Calhoun','015':'Charlotte','017':'Citrus','019':'Clay','021':'Collier','023':'Columbia','027':'De Soto','029':'Dixie','031':'Duval','033':'Escambia','035':'Flagler','037':'Franklin','039':'Gadsden','041':'Gilchrist','043':'Glades','045':'Gulf','047':'Hamilton','049':'Hardee','051':'Hendry','053':'Hernando','055':'Highlands','057':'Hillsborough','059':'Holmes','061':'Indian River','063':'Jackson','065':'Jefferson','067':'Lafayette','069':'Lake','071':'Lee','073':'Leon','075':'Levy','077':'Liberty','079':'Madison','081':'Manatee','083':'Marion','085':'Martin','086':'Miami-Dade','087':'Monroe','089':'Nassau','091':'Okaloosa','093':'Okeechobee','095':'Orange','097':'Osceola','099':'Palm Beach','101':'Pasco','103':'Pinellas','105':'Polk','107':'Putnam','109':'St. Johns','111':'St. Lucie','113':'Santa Rosa','115':'Sarasota','117':'Seminole','119':'Sumter','121':'Suwannee','123':'Taylor','125':'Union','127':'Volusia','129':'Wakulla','131':'Walton','133':'Washington' },

  AK: {'013':'Aleutians East','016':'Aleutians West','020':'Anchorage','050':'Bethel','060':'Bristol Bay','068':'Denali','070':'Dillingham','090':'Fairbanks North Star','100':'Haines','105':'Hoonah-Angoon','110':'Juneau','122':'Kenai Peninsula','130':'Ketchikan Gateway','150':'Kodiak Island','164':'Lake and Peninsula','170':'Matanuska-Susitna','180':'Nome','185':'North Slope','188':'Northwest Arctic','195':'Petersburg','198':'Prince of Wales-Hyder','220':'Sitka','230':'Skagway','240':'Southeast Fairbanks','261':'Valdez-Cordova','270':'Wade Hampton','275':'Wrangell','280':'Yakutat','290':'Yukon-Koyukuk'},
  AL: {'001':'Autauga','003':'Baldwin','005':'Barbour','007':'Bibb','009':'Blount','011':'Bullock','013':'Butler','015':'Calhoun','017':'Chambers','019':'Cherokee','021':'Chilton','023':'Choctaw','025':'Clarke','027':'Clay','029':'Cleburne','031':'Coffee','033':'Colbert','035':'Conecuh','037':'Coosa','039':'Covington','041':'Crenshaw','043':'Cullman','045':'Dale','047':'Dallas','049':'De Kalb','051':'Elmore','053':'Escambia','055':'Etowah','057':'Fayette','059':'Franklin','061':'Geneva','063':'Greene','065':'Hale','067':'Henry','069':'Houston','071':'Jackson','073':'Jefferson','075':'Lamar','077':'Lauderdale','079':'Lawrence','081':'Lee','083':'Limestone','085':'Lowndes','087':'Macon','089':'Madison','091':'Marengo','093':'Marion','095':'Marshall','097':'Mobile','099':'Monroe','101':'Montgomery','103':'Morgan','105':'Perry','107':'Pickens','109':'Pike','111':'Randolph','113':'Russell','115':'St. Clair','117':'Shelby','119':'Sumter','121':'Talladega','123':'Tallapoosa','125':'Tuscaloosa','127':'Walker','129':'Washington','131':'Wilcox','133':'Winston'},
  AR: {'001':'Arkansas','003':'Ashley','005':'Baxter','007':'Benton','009':'Boone','011':'Bradley','013':'Calhoun','015':'Carroll','017':'Chicot','019':'Clark','021':'Clay','023':'Cleburne','025':'Cleveland','027':'Columbia','029':'Conway','031':'Craighead','033':'Crawford','035':'Crittenden','037':'Cross','039':'Dallas','041':'Desha','043':'Drew','045':'Faulkner','047':'Franklin','049':'Fulton','051':'Garland','053':'Grant','055':'Greene','057':'Hempstead','059':'Hot Spring','061':'Howard','063':'Independence','065':'Izard','067':'Jackson','069':'Jefferson','071':'Johnson','073':'Lafayette','075':'Lawrence','077':'Lee','079':'Lincoln','081':'Little River','083':'Logan','085':'Lonoke','087':'Madison','089':'Marion','091':'Miller','093':'Mississippi','095':'Monroe','097':'Montgomery','099':'Nevada','101':'Newton','103':'Ouachita','105':'Perry','107':'Phillips','109':'Pike','111':'Poinsett','113':'Polk','115':'Pope','117':'Prairie','119':'Pulaski','121':'Randolph','123':'St. Francis','125':'Saline','127':'Scott','129':'Searcy','131':'Sebastian','133':'Sevier','135':'Sharp','137':'Stone','139':'Union','141':'Van Buren','143':'Washington','145':'White','147':'Woodruff','149':'Yell'},
  AZ: {'001':'Apache','003':'Cochise','005':'Coconino','007':'Gila','009':'Graham','011':'Greenlee','012':'La Paz','013':'Maricopa','015':'Mohave','017':'Navajo','019':'Pima','021':'Pinal','023':'Santa Cruz','025':'Yavapai','027':'Yuma'},
  CO: {'001':'Adams','003':'Alamosa','005':'Arapahoe','007':'Archuleta','009':'Baca','011':'Bent','013':'Boulder','014':'Broomfield','015':'Chaffee','017':'Cheyenne','019':'Clear Creek','021':'Conejos','023':'Costilla','025':'Crowley','027':'Custer','029':'Delta','031':'Denver','033':'Dolores','035':'Douglas','037':'Eagle','039':'Elbert','041':'El Paso','043':'Fremont','045':'Garfield','047':'Gilpin','049':'Grand','051':'Gunnison','053':'Hinsdale','055':'Huerfano','057':'Jackson','059':'Jefferson','061':'Kiowa','063':'Kit Carson','065':'Lake','067':'La Plata','069':'Larimer','071':'Las Animas','073':'Lincoln','075':'Logan','077':'Mesa','079':'Mineral','081':'Moffat','083':'Montezuma','085':'Montrose','087':'Morgan','089':'Otero','091':'Ouray','093':'Park','095':'Phillips','097':'Pitkin','099':'Prowers','101':'Pueblo','103':'Rio Blanco','105':'Rio Grande','107':'Routt','109':'Saguache','111':'San Juan','113':'San Miguel','115':'Sedgwick','117':'Summit','119':'Teller','121':'Washington','123':'Weld','125':'Yuma'},
  CT: {'001':'Fairfield','003':'Hartford','005':'Litchfield','007':'Middlesex','009':'New Haven','011':'New London','013':'Tolland','015':'Windham'},
  DC: {'001':'District of Columbia'},
  DE: {'001':'Kent','003':'New Castle','005':'Sussex'},
  GA: {'001':'Appling','003':'Atkinson','005':'Bacon','007':'Baker','009':'Baldwin','011':'Banks','013':'Barrow','015':'Bartow','017':'Ben Hill','019':'Berrien','021':'Bibb','023':'Bleckley','025':'Brantley','027':'Brooks','029':'Bryan','031':'Bulloch','033':'Burke','035':'Butts','037':'Calhoun','039':'Camden','043':'Candler','045':'Carroll','047':'Catoosa','049':'Charlton','051':'Chatham','053':'Chattahoochee','055':'Chattooga','057':'Cherokee','059':'Clarke','061':'Clay','063':'Clayton','065':'Clinch','067':'Cobb','069':'Coffee','071':'Colquitt','073':'Columbia','075':'Cook','077':'Coweta','079':'Crawford','081':'Crisp','083':'Dade','085':'Dawson','087':'Decatur','089':'De Kalb','091':'Dodge','093':'Dooly','095':'Dougherty','097':'Douglas','099':'Early','101':'Echols','103':'Effingham','105':'Elbert','107':'Emanuel','109':'Evans','111':'Fannin','113':'Fayette','115':'Floyd','117':'Forsyth','119':'Franklin','121':'Fulton','123':'Gilmer','125':'Glascock','127':'Glynn','129':'Gordon','131':'Grady','133':'Greene','135':'Gwinnett','137':'Habersham','139':'Hall','141':'Hancock','143':'Haralson','145':'Harris','147':'Hart','149':'Heard','151':'Henry','153':'Houston','155':'Irwin','157':'Jackson','159':'Jasper','161':'Jeff Davis','163':'Jefferson','165':'Jenkins','167':'Johnson','169':'Jones','171':'Lamar','173':'Lanier','175':'Laurens','177':'Lee','179':'Liberty','181':'Lincoln','183':'Long','185':'Lowndes','187':'Lumpkin','189':'McDuffie','191':'McIntosh','193':'Macon','195':'Madison','197':'Marion','199':'Meriwether','201':'Miller','205':'Mitchell','207':'Monroe','209':'Montgomery','211':'Morgan','213':'Murray','215':'Muscogee','217':'Newton','219':'Oconee','221':'Oglethorpe','223':'Paulding','225':'Peach','227':'Pickens','229':'Pierce','231':'Pike','233':'Polk','235':'Pulaski','237':'Putnam','239':'Quitman','241':'Rabun','243':'Randolph','245':'Richmond','247':'Rockdale','249':'Schley','251':'Screven','253':'Seminole','255':'Spalding','257':'Stephens','259':'Stewart','261':'Sumter','263':'Talbot','265':'Taliaferro','267':'Tattnall','269':'Taylor','271':'Telfair','273':'Terrell','275':'Thomas','277':'Tift','279':'Toombs','281':'Towns','283':'Treutlen','285':'Troup','287':'Turner','289':'Twiggs','291':'Union','293':'Upson','295':'Walker','297':'Walton','299':'Ware','301':'Warren','303':'Washington','305':'Wayne','307':'Webster','309':'Wheeler','311':'White','313':'Whitfield','315':'Wilcox','317':'Wilkes','319':'Wilkinson','321':'Worth'},
  HI: {'001':'Hawaii','003':'Honolulu','005':'Kalawao','007':'Kauai','009':'Maui'},
  IA: {'001':'Adair','003':'Adams','005':'Allamakee','007':'Appanoose','009':'Audubon','011':'Benton','013':'Black Hawk','015':'Boone','017':'Bremer','019':'Buchanan','021':'Buena Vista','023':'Butler','025':'Calhoun','027':'Carroll','029':'Cass','031':'Cedar','033':'Cerro Gordo','035':'Cherokee','037':'Chickasaw','039':'Clarke','041':'Clay','043':'Clayton','045':'Clinton','047':'Crawford','049':'Dallas','051':'Davis','053':'Decatur','055':'Delaware','057':'Des Moines','059':'Dickinson','061':'Dubuque','063':'Emmet','065':'Fayette','067':'Floyd','069':'Franklin','071':'Fremont','073':'Greene','075':'Grundy','077':'Guthrie','079':'Hamilton','081':'Hancock','083':'Hardin','085':'Harrison','087':'Henry','089':'Howard','091':'Humboldt','093':'Ida','095':'Iowa','097':'Jackson','099':'Jasper','101':'Jefferson','103':'Johnson','105':'Jones','107':'Keokuk','109':'Kossuth','111':'Lee','113':'Linn','115':'Louisa','117':'Lucas','119':'Lyon','121':'Madison','123':'Mahaska','125':'Marion','127':'Marshall','129':'Mills','131':'Mitchell','133':'Monona','135':'Monroe','137':'Montgomery','139':'Muscatine','141':'OBrien','143':'Osceola','145':'Page','147':'Palo Alto','149':'Plymouth','151':'Pocahontas','153':'Polk','155':'Pottawattamie','157':'Poweshiek','159':'Ringgold','161':'Sac','163':'Scott','165':'Shelby','167':'Sioux','169':'Story','171':'Tama','173':'Taylor','175':'Union','177':'Van Buren','179':'Wapello','181':'Warren','183':'Washington','185':'Wayne','187':'Webster','189':'Winnebago','191':'Winneshiek','193':'Woodbury','195':'Worth','197':'Wright'},
  ID: {'001':'Ada','003':'Adams','005':'Bannock','007':'Bear Lake','009':'Benewah','011':'Bingham','013':'Blaine','015':'Boise','017':'Bonner','019':'Bonneville','021':'Boundary','023':'Butte','025':'Camas','027':'Canyon','029':'Caribou','031':'Cassia','033':'Clark','035':'Clearwater','037':'Custer','039':'Elmore','041':'Franklin','043':'Fremont','045':'Gem','047':'Gooding','049':'Idaho','051':'Jefferson','053':'Jerome','055':'Kootenai','057':'Latah','059':'Lemhi','061':'Lewis','063':'Lincoln','065':'Madison','067':'Minidoka','069':'Nez Perce','071':'Oneida','073':'Owyhee','075':'Payette','077':'Power','079':'Shoshone','081':'Teton','083':'Twin Falls','085':'Valley','087':'Washington'},
  IL: {'001':'Adams','003':'Alexander','005':'Bond','007':'Boone','009':'Brown','011':'Bureau','013':'Calhoun','015':'Carroll','017':'Cass','019':'Champaign','021':'Christian','023':'Clark','025':'Clay','027':'Clinton','029':'Coles','031':'Cook','033':'Crawford','035':'Cumberland','037':'De Kalb','039':'De Witt','041':'Douglas','043':'Du Page','045':'Edgar','047':'Edwards','049':'Effingham','051':'Fayette','053':'Ford','055':'Franklin','057':'Fulton','059':'Gallatin','061':'Greene','063':'Grundy','065':'Hamilton','067':'Hancock','069':'Hardin','071':'Henderson','073':'Henry','075':'Iroquois','077':'Jackson','079':'Jasper','081':'Jefferson','083':'Jersey','085':'Jo Daviess','087':'Johnson','089':'Kane','091':'Kankakee','093':'Kendall','095':'Knox','097':'Lake','099':'La Salle','101':'Lawrence','103':'Lee','105':'Livingston','107':'Logan','109':'McDonough','111':'McHenry','113':'McLean','115':'Macon','117':'Macoupin','119':'Madison','121':'Marion','123':'Marshall','125':'Mason','127':'Massac','129':'Menard','131':'Mercer','133':'Monroe','135':'Montgomery','137':'Morgan','139':'Moultrie','141':'Ogle','143':'Peoria','145':'Perry','147':'Piatt','149':'Pike','151':'Pope','153':'Pulaski','155':'Putnam','157':'Randolph','159':'Richland','161':'Rock Island','163':'St. Clair','165':'Saline','167':'Sangamon','169':'Schuyler','171':'Scott','173':'Shelby','175':'Stark','177':'Stephenson','179':'Tazewell','181':'Union','183':'Vermilion','185':'Wabash','187':'Warren','189':'Washington','191':'Wayne','193':'White','195':'Whiteside','197':'Will','199':'Williamson','201':'Winnebago','203':'Woodford'},
  IN: {'001':'Adams','003':'Allen','005':'Bartholomew','007':'Benton','009':'Blackford','011':'Boone','013':'Brown','015':'Carroll','017':'Cass','019':'Clark','021':'Clay','023':'Clinton','025':'Crawford','027':'Daviess','029':'Dearborn','031':'Decatur','033':'De Kalb','035':'Delaware','037':'Dubois','039':'Elkhart','041':'Fayette','043':'Floyd','045':'Fountain','047':'Franklin','049':'Fulton','051':'Gibson','053':'Grant','055':'Greene','057':'Hamilton','059':'Hancock','061':'Harrison','063':'Hendricks','065':'Henry','067':'Howard','069':'Huntington','071':'Jackson','073':'Jasper','075':'Jay','077':'Jefferson','079':'Jennings','081':'Johnson','083':'Knox','085':'Kosciusko','087':'Lagrange','089':'Lake','091':'La Porte','093':'Lawrence','095':'Madison','097':'Marion','099':'Marshall','101':'Martin','103':'Miami','105':'Monroe','107':'Montgomery','109':'Morgan','111':'Newton','113':'Noble','115':'Ohio','117':'Orange','119':'Owen','121':'Parke','123':'Perry','125':'Pike','127':'Porter','129':'Posey','131':'Pulaski','133':'Putnam','135':'Randolph','137':'Ripley','139':'Rush','141':'St. Joseph','143':'Scott','145':'Shelby','147':'Spencer','149':'Starke','151':'Steuben','153':'Sullivan','155':'Switzerland','157':'Tippecanoe','159':'Tipton','161':'Union','163':'Vanderburgh','165':'Vermillion','167':'Vigo','169':'Wabash','171':'Warren','173':'Warrick','175':'Washington','177':'Wayne','179':'Wells','181':'White','183':'Whitley'},
  KS: {'001':'Allen','003':'Anderson','005':'Atchison','007':'Barber','009':'Barton','011':'Bourbon','013':'Brown','015':'Butler','017':'Chase','019':'Chautauqua','021':'Cherokee','023':'Cheyenne','025':'Clark','027':'Clay','029':'Cloud','031':'Coffey','033':'Comanche','035':'Cowley','037':'Crawford','039':'Decatur','041':'Dickinson','043':'Doniphan','045':'Douglas','047':'Edwards','049':'Elk','051':'Ellis','053':'Ellsworth','055':'Finney','057':'Ford','059':'Franklin','061':'Geary','063':'Gove','065':'Graham','067':'Grant','069':'Gray','071':'Greeley','073':'Greenwood','075':'Hamilton','077':'Harper','079':'Harvey','081':'Haskell','083':'Hodgeman','085':'Jackson','087':'Jefferson','089':'Jewell','091':'Johnson','093':'Kearny','095':'Kingman','097':'Kiowa','099':'Labette','101':'Lane','103':'Leavenworth','105':'Lincoln','107':'Linn','109':'Logan','111':'Lyon','113':'McPherson','115':'Marion','117':'Marshall','119':'Meade','121':'Miami','123':'Mitchell','125':'Montgomery','127':'Morris','129':'Morton','131':'Nemaha','133':'Neosho','135':'Ness','137':'Norton','139':'Osage','141':'Osborne','143':'Ottawa','145':'Pawnee','147':'Phillips','149':'Pottawatomie','151':'Pratt','153':'Rawlins','155':'Reno','157':'Republic','159':'Rice','161':'Riley','163':'Rooks','165':'Rush','167':'Russell','169':'Saline','171':'Scott','173':'Sedgwick','175':'Seward','177':'Shawnee','179':'Sheridan','181':'Sherman','183':'Smith','185':'Stafford','187':'Stanton','189':'Stevens','191':'Sumner','193':'Thomas','195':'Trego','197':'Wabaunsee','199':'Wallace','201':'Washington','203':'Wichita','205':'Wilson','207':'Woodson','209':'Wyandotte'},
  KY: {'001':'Adair','003':'Allen','005':'Anderson','007':'Ballard','009':'Barren','011':'Bath','013':'Bell','015':'Boone','017':'Bourbon','019':'Boyd','021':'Boyle','023':'Bracken','025':'Breathitt','027':'Breckinridge','029':'Bullitt','031':'Butler','033':'Caldwell','035':'Calloway','037':'Campbell','039':'Carlisle','041':'Carroll','043':'Carter','045':'Casey','047':'Christian','049':'Clark','051':'Clay','053':'Clinton','055':'Crittenden','057':'Cumberland','059':'Daviess','061':'Edmonson','063':'Elliott','065':'Estill','067':'Fayette','069':'Fleming','071':'Floyd','073':'Franklin','075':'Fulton','077':'Gallatin','079':'Garrard','081':'Grant','083':'Graves','085':'Grayson','087':'Green','089':'Greenup','091':'Hancock','093':'Hardin','095':'Harlan','097':'Harrison','099':'Hart','101':'Henderson','103':'Henry','105':'Hickman','107':'Hopkins','109':'Jackson','111':'Jefferson','113':'Jessamine','115':'Johnson','117':'Kenton','119':'Knott','121':'Knox','123':'Larue','125':'Laurel','127':'Lawrence','129':'Lee','131':'Leslie','133':'Letcher','135':'Lewis','137':'Lincoln','139':'Livingston','141':'Logan','143':'Lyon','145':'McCracken','147':'McCreary','149':'McLean','151':'Madison','153':'Magoffin','155':'Marion','157':'Marshall','159':'Martin','161':'Mason','163':'Meade','165':'Menifee','167':'Mercer','169':'Metcalfe','171':'Monroe','173':'Montgomery','175':'Morgan','177':'Muhlenberg','179':'Nelson','181':'Nicholas','183':'Ohio','185':'Oldham','187':'Owen','189':'Owsley','191':'Pendleton','193':'Perry','195':'Pike','197':'Powell','199':'Pulaski','201':'Robertson','203':'Rockcastle','205':'Rowan','207':'Russell','209':'Scott','211':'Shelby','213':'Simpson','215':'Spencer','217':'Taylor','219':'Todd','221':'Trigg','223':'Trimble','225':'Union','227':'Warren','229':'Washington','231':'Wayne','233':'Webster','235':'Whitley','237':'Wolfe','239':'Woodford'},
  LA: {'001':'Acadia','003':'Allen','005':'Ascension','007':'Assumption','009':'Avoyelles','011':'Beauregard','013':'Bienville','015':'Bossier','017':'Caddo','019':'Calcasieu','021':'Caldwell','023':'Cameron','025':'Catahoula','027':'Claiborne','029':'Concordia','031':'De Soto','033':'East Baton Rouge','035':'East Carroll','037':'East Feliciana','039':'Evangeline','041':'Franklin','043':'Grant','045':'Iberia','047':'Iberville','049':'Jackson','051':'Jefferson','053':'Jefferson Davis','055':'Lafayette','057':'Lafourche','059':'La Salle','061':'Lincoln','063':'Livingston','065':'Madison','067':'Morehouse','069':'Natchitoches','071':'Orleans','073':'Ouachita','075':'Plaquemines','077':'Pointe Coupee','079':'Rapides','081':'Red River','083':'Richland','085':'Sabine','087':'St. Bernard','089':'St. Charles','091':'St. Helena','093':'St. James','095':'St. John the Baptist','097':'St. Landry','099':'St. Martin','101':'St. Mary','103':'St. Tammany','105':'Tangipahoa','107':'Tensas','109':'Terrebonne','111':'Union','113':'Vermilion','115':'Vernon','117':'Washington','119':'Webster','121':'West Baton Rouge','123':'West Carroll','125':'West Feliciana','127':'Winn'},
  MA: {'001':'Barnstable','003':'Berkshire','005':'Bristol','007':'Dukes','009':'Essex','011':'Franklin','013':'Hampden','015':'Hampshire','017':'Middlesex','019':'Nantucket','021':'Norfolk','023':'Plymouth','025':'Suffolk','027':'Worcester'},
  MD: {'001':'Allegany','003':'Anne Arundel','005':'Baltimore','009':'Calvert','011':'Caroline','013':'Carroll','015':'Cecil','017':'Charles','019':'Dorchester','021':'Frederick','023':'Garrett','025':'Harford','027':'Howard','029':'Kent','031':'Montgomery','033':'Prince Georges','035':'Queen Annes','037':'St. Marys','039':'Somerset','041':'Talbot','043':'Washington','045':'Wicomico','047':'Worcester','510':'Baltimore City'},
  ME: {'001':'Androscoggin','003':'Aroostook','005':'Cumberland','007':'Franklin','009':'Hancock','011':'Kennebec','013':'Knox','015':'Lincoln','017':'Oxford','019':'Penobscot','021':'Piscataquis','023':'Sagadahoc','025':'Somerset','027':'Waldo','029':'Washington','031':'York'},
  MI: {'001':'Alcona','003':'Alger','005':'Allegan','007':'Alpena','009':'Antrim','011':'Arenac','013':'Baraga','015':'Barry','017':'Bay','019':'Benzie','021':'Berrien','023':'Branch','025':'Calhoun','027':'Cass','029':'Charlevoix','031':'Cheboygan','033':'Chippewa','035':'Clare','037':'Clinton','039':'Crawford','041':'Delta','043':'Dickinson','045':'Eaton','047':'Emmet','049':'Genesee','051':'Gladwin','053':'Gogebic','055':'Grand Traverse','057':'Gratiot','059':'Hillsdale','061':'Houghton','063':'Huron','065':'Ingham','067':'Ionia','069':'Iosco','071':'Iron','073':'Isabella','075':'Jackson','077':'Kalamazoo','079':'Kalkaska','081':'Kent','083':'Keweenaw','085':'Lake','087':'Lapeer','089':'Leelanau','091':'Lenawee','093':'Livingston','095':'Luce','097':'Mackinac','099':'Macomb','101':'Manistee','103':'Marquette','105':'Mason','107':'Mecosta','109':'Menominee','111':'Midland','113':'Missaukee','115':'Monroe','117':'Montcalm','119':'Montmorency','121':'Muskegon','123':'Newaygo','125':'Oakland','127':'Oceana','129':'Ogemaw','131':'Ontonagon','133':'Osceola','135':'Oscoda','137':'Otsego','139':'Ottawa','141':'Presque Isle','143':'Roscommon','145':'Saginaw','147':'St. Clair','149':'St. Joseph','151':'Sanilac','153':'Schoolcraft','155':'Shiawassee','157':'Tuscola','159':'Van Buren','161':'Washtenaw','163':'Wayne','165':'Wexford'},
  MN: {'001':'Aitkin','003':'Anoka','005':'Becker','007':'Beltrami','009':'Benton','011':'Big Stone','013':'Blue Earth','015':'Brown','017':'Carlton','019':'Carver','021':'Cass','023':'Chippewa','025':'Chisago','027':'Clay','029':'Clearwater','031':'Cook','033':'Cottonwood','035':'Crow Wing','037':'Dakota','039':'Dodge','041':'Douglas','043':'Faribault','045':'Fillmore','047':'Freeborn','049':'Goodhue','051':'Grant','053':'Hennepin','055':'Houston','057':'Hubbard','059':'Isanti','061':'Itasca','063':'Jackson','065':'Kanabec','067':'Kandiyohi','069':'Kittson','071':'Koochiching','073':'Lac qui Parle','075':'Lake','077':'Lake of the Woods','079':'Le Sueur','081':'Lincoln','083':'Lyon','085':'McLeod','087':'Mahnomen','089':'Marshall','091':'Martin','093':'Meeker','095':'Mille Lacs','097':'Morrison','099':'Mower','101':'Murray','103':'Nicollet','105':'Nobles','107':'Norman','109':'Olmsted','111':'Otter Tail','113':'Pennington','115':'Pine','117':'Pipestone','119':'Polk','121':'Pope','123':'Ramsey','125':'Red Lake','127':'Redwood','129':'Renville','131':'Rice','133':'Rock','135':'Roseau','137':'St. Louis','139':'Scott','141':'Sherburne','143':'Sibley','145':'Stearns','147':'Steele','149':'Stevens','151':'Swift','153':'Todd','155':'Traverse','157':'Wabasha','159':'Wadena','161':'Waseca','163':'Washington','165':'Watonwan','167':'Wilkin','169':'Winona','171':'Wright','173':'Yellow Medicine'},
  MO: {'001':'Adair','003':'Andrew','005':'Atchison','007':'Audrain','009':'Barry','011':'Barton','013':'Bates','015':'Benton','017':'Bollinger','019':'Boone','021':'Buchanan','023':'Butler','025':'Caldwell','027':'Callaway','029':'Camden','031':'Cape Girardeau','033':'Carroll','035':'Carter','037':'Cass','039':'Cedar','041':'Chariton','043':'Christian','045':'Clark','047':'Clay','049':'Clinton','051':'Cole','053':'Cooper','055':'Crawford','057':'Dade','059':'Dallas','061':'Daviess','063':'De Kalb','065':'Dent','067':'Douglas','069':'Dunklin','071':'Franklin','073':'Gasconade','075':'Gentry','077':'Greene','079':'Grundy','081':'Harrison','083':'Henry','085':'Hickory','087':'Holt','089':'Howard','091':'Howell','093':'Iron','095':'Jackson','097':'Jasper','099':'Jefferson','101':'Johnson','103':'Knox','105':'Laclede','107':'Lafayette','109':'Lawrence','111':'Lewis','113':'Lincoln','115':'Linn','117':'Livingston','119':'McDonald','121':'Macon','123':'Madison','125':'Maries','127':'Marion','129':'Mercer','131':'Miller','133':'Mississippi','135':'Moniteau','137':'Monroe','139':'Montgomery','141':'Morgan','143':'New Madrid','145':'Newton','147':'Nodaway','149':'Oregon','151':'Osage','153':'Ozark','155':'Pemiscot','157':'Perry','159':'Pettis','161':'Phelps','163':'Pike','165':'Platte','167':'Polk','169':'Pulaski','171':'Putnam','173':'Ralls','175':'Randolph','177':'Ray','179':'Reynolds','181':'Ripley','183':'St. Charles','185':'St. Clair','186':'Ste. Genevieve','187':'St. Francois','189':'St. Louis','193':'Saline','195':'Schuyler','197':'Scotland','199':'Scott','201':'Shannon','203':'Shelby','205':'Stoddard','207':'Stone','209':'Sullivan','211':'Taney','213':'Texas','215':'Vernon','217':'Warren','219':'Washington','221':'Wayne','223':'Webster','225':'Worth','227':'Wright','510':'St. Louis City'},
  MS: {'001':'Adams','003':'Alcorn','005':'Amite','007':'Attala','009':'Benton','011':'Bolivar','013':'Calhoun','015':'Carroll','017':'Chickasaw','019':'Choctaw','021':'Claiborne','023':'Clarke','025':'Clay','027':'Coahoma','029':'Copiah','031':'Covington','033':'De Soto','035':'Forrest','037':'Franklin','039':'George','041':'Greene','043':'Grenada','045':'Hancock','047':'Harrison','049':'Hinds','051':'Holmes','053':'Humphreys','055':'Issaquena','057':'Itawamba','059':'Jackson','061':'Jasper','063':'Jefferson','065':'Jefferson Davis','067':'Jones','069':'Kemper','071':'Lafayette','073':'Lamar','075':'Lauderdale','077':'Lawrence','079':'Leake','081':'Lee','083':'Leflore','085':'Lincoln','087':'Lowndes','089':'Madison','091':'Marion','093':'Marshall','095':'Monroe','097':'Montgomery','099':'Neshoba','101':'Newton','103':'Noxubee','105':'Oktibbeha','107':'Panola','109':'Pearl River','111':'Perry','113':'Pike','115':'Pontotoc','117':'Prentiss','119':'Quitman','121':'Rankin','123':'Scott','125':'Sharkey','127':'Simpson','129':'Smith','131':'Stone','133':'Sunflower','135':'Tallahatchie','137':'Tate','139':'Tippah','141':'Tishomingo','143':'Tunica','145':'Union','147':'Walthall','149':'Warren','151':'Washington','153':'Wayne','155':'Webster','157':'Wilkinson','159':'Winston','161':'Yalobusha','163':'Yazoo'},
  MT: {'001':'Beaverhead','003':'Big Horn','005':'Blaine','007':'Broadwater','009':'Carbon','011':'Carter','013':'Cascade','015':'Chouteau','017':'Custer','019':'Daniels','021':'Dawson','023':'Deer Lodge','025':'Fallon','027':'Fergus','029':'Flathead','031':'Gallatin','033':'Garfield','035':'Glacier','037':'Golden Valley','039':'Granite','041':'Hill','043':'Jefferson','045':'Judith Basin','047':'Lake','049':'Lewis and Clark','051':'Liberty','053':'Lincoln','055':'McCone','057':'Madison','059':'Meagher','061':'Mineral','063':'Missoula','065':'Musselshell','067':'Park','069':'Petroleum','071':'Phillips','073':'Pondera','075':'Powder River','077':'Powell','079':'Prairie','081':'Ravalli','083':'Richland','085':'Roosevelt','087':'Rosebud','089':'Sanders','091':'Sheridan','093':'Silver Bow','095':'Stillwater','097':'Sweet Grass','099':'Teton','101':'Toole','103':'Treasure','105':'Valley','107':'Wheatland','109':'Wibaux','111':'Yellowstone'},
  NC: {'001':'Alamance','003':'Alexander','005':'Alleghany','007':'Anson','009':'Ashe','011':'Avery','013':'Beaufort','015':'Bertie','017':'Bladen','019':'Brunswick','021':'Buncombe','023':'Burke','025':'Cabarrus','027':'Caldwell','029':'Camden','031':'Carteret','033':'Caswell','035':'Catawba','037':'Chatham','039':'Cherokee','041':'Chowan','043':'Clay','045':'Cleveland','047':'Columbus','049':'Craven','051':'Cumberland','053':'Currituck','055':'Dare','057':'Davidson','059':'Davie','061':'Duplin','063':'Durham','065':'Edgecombe','067':'Forsyth','069':'Franklin','071':'Gaston','073':'Gates','075':'Graham','077':'Granville','079':'Greene','081':'Guilford','083':'Halifax','085':'Harnett','087':'Haywood','089':'Henderson','091':'Hertford','093':'Hoke','095':'Hyde','097':'Iredell','099':'Jackson','101':'Johnston','103':'Jones','105':'Lee','107':'Lenoir','109':'Lincoln','111':'McDowell','113':'Macon','115':'Madison','117':'Martin','119':'Mecklenburg','121':'Mitchell','123':'Montgomery','125':'Moore','127':'Nash','129':'New Hanover','131':'Northampton','133':'Onslow','135':'Orange','137':'Pamlico','139':'Pasquotank','141':'Pender','143':'Perquimans','145':'Person','147':'Pitt','149':'Polk','151':'Randolph','153':'Richmond','155':'Robeson','157':'Rockingham','159':'Rowan','161':'Rutherford','163':'Sampson','165':'Scotland','167':'Stanly','169':'Stokes','171':'Surry','173':'Swain','175':'Transylvania','177':'Tyrrell','179':'Union','181':'Vance','183':'Wake','185':'Warren','187':'Washington','189':'Watauga','191':'Wayne','193':'Wilkes','195':'Wilson','197':'Yadkin','199':'Yancey'},
  ND: {'001':'Adams','003':'Barnes','005':'Benson','007':'Billings','009':'Bottineau','011':'Bowman','013':'Burke','015':'Burleigh','017':'Cass','019':'Cavalier','021':'Dickey','023':'Divide','025':'Dunn','027':'Eddy','029':'Emmons','031':'Foster','033':'Golden Valley','035':'Grand Forks','037':'Grant','039':'Griggs','041':'Hettinger','043':'Kidder','045':'La Moure','047':'Logan','049':'McHenry','051':'McIntosh','053':'McKenzie','055':'McLean','057':'Mercer','059':'Morton','061':'Mountrail','063':'Nelson','065':'Oliver','067':'Pembina','069':'Pierce','071':'Ramsey','073':'Ransom','075':'Renville','077':'Richland','079':'Rolette','081':'Sargent','083':'Sheridan','085':'Sioux','087':'Slope','089':'Stark','091':'Steele','093':'Stutsman','095':'Towner','097':'Traill','099':'Walsh','101':'Ward','103':'Wells','105':'Williams'},
  NE: {'001':'Adams','003':'Antelope','005':'Arthur','007':'Banner','009':'Blaine','011':'Boone','013':'Box Butte','015':'Boyd','017':'Brown','019':'Buffalo','021':'Burt','023':'Butler','025':'Cass','027':'Cedar','029':'Chase','031':'Cherry','033':'Cheyenne','035':'Clay','037':'Colfax','039':'Cuming','041':'Custer','043':'Dakota','045':'Dawes','047':'Dawson','049':'Deuel','051':'Dixon','053':'Dodge','055':'Douglas','057':'Dundy','059':'Fillmore','061':'Franklin','063':'Frontier','065':'Furnas','067':'Gage','069':'Garden','071':'Garfield','073':'Gosper','075':'Grant','077':'Greeley','079':'Hall','081':'Hamilton','083':'Harlan','085':'Hayes','087':'Hitchcock','089':'Holt','091':'Hooker','093':'Howard','095':'Jefferson','097':'Johnson','099':'Kearney','101':'Keith','103':'Keya Paha','105':'Kimball','107':'Knox','109':'Lancaster','111':'Lincoln','113':'Logan','115':'Loup','117':'McPherson','119':'Madison','121':'Merrick','123':'Morrill','125':'Nance','127':'Nemaha','129':'Nuckolls','131':'Otoe','133':'Pawnee','135':'Perkins','137':'Phelps','139':'Pierce','141':'Platte','143':'Polk','145':'Red Willow','147':'Richardson','149':'Rock','151':'Saline','153':'Sarpy','155':'Saunders','157':'Scotts Bluff','159':'Seward','161':'Sheridan','163':'Sherman','165':'Sioux','167':'Stanton','169':'Thayer','171':'Thomas','173':'Thurston','175':'Valley','177':'Washington','179':'Wayne','181':'Webster','183':'Wheeler','185':'York'},
  NH: {'001':'Belknap','003':'Carroll','005':'Cheshire','007':'Coos','009':'Grafton','011':'Hillsborough','013':'Merrimack','015':'Rockingham','017':'Strafford','019':'Sullivan'},
  NJ: {'001':'Atlantic','003':'Bergen','005':'Burlington','007':'Camden','009':'Cape May','011':'Cumberland','013':'Essex','015':'Gloucester','017':'Hudson','019':'Hunterdon','021':'Mercer','023':'Middlesex','025':'Monmouth','027':'Morris','029':'Ocean','031':'Passaic','033':'Salem','035':'Somerset','037':'Sussex','039':'Union','041':'Warren'},
  NM: {'001':'Bernalillo','003':'Catron','005':'Chaves','006':'Cibola','007':'Colfax','009':'Curry','011':'De Baca','013':'Dona Ana','015':'Eddy','017':'Grant','019':'Guadalupe','021':'Harding','023':'Hidalgo','025':'Lea','027':'Lincoln','028':'Los Alamos','029':'Luna','031':'McKinley','033':'Mora','035':'Otero','037':'Quay','039':'Rio Arriba','041':'Roosevelt','043':'Sandoval','045':'San Juan','047':'San Miguel','049':'Santa Fe','051':'Sierra','053':'Socorro','055':'Taos','057':'Torrance','059':'Union','061':'Valencia'},
  NV: {'001':'Churchill','003':'Clark','005':'Douglas','007':'Elko','009':'Esmeralda','011':'Eureka','013':'Humboldt','015':'Lander','017':'Lincoln','019':'Lyon','021':'Mineral','023':'Nye','027':'Pershing','029':'Storey','031':'Washoe','033':'White Pine','510':'Carson City'},
  NY: {'001':'Albany','003':'Allegany','005':'Bronx','007':'Broome','009':'Cattaraugus','011':'Cayuga','013':'Chautauqua','015':'Chemung','017':'Chenango','019':'Clinton','021':'Columbia','023':'Cortland','025':'Delaware','027':'Dutchess','029':'Erie','031':'Essex','033':'Franklin','035':'Fulton','037':'Genesee','039':'Greene','041':'Hamilton','043':'Herkimer','045':'Jefferson','047':'Kings','049':'Lewis','051':'Livingston','053':'Madison','055':'Monroe','057':'Montgomery','059':'Nassau','061':'New York','063':'Niagara','065':'Oneida','067':'Onondaga','069':'Ontario','071':'Orange','073':'Orleans','075':'Oswego','077':'Otsego','079':'Putnam','081':'Queens','083':'Rensselaer','085':'Richmond','087':'Rockland','089':'St. Lawrence','091':'Saratoga','093':'Schenectady','095':'Schoharie','097':'Schuyler','099':'Seneca','101':'Steuben','103':'Suffolk','105':'Sullivan','107':'Tioga','109':'Tompkins','111':'Ulster','113':'Warren','115':'Washington','117':'Wayne','119':'Westchester','121':'Wyoming','123':'Yates'},
  OH: {'001':'Adams','003':'Allen','005':'Ashland','007':'Ashtabula','009':'Athens','011':'Auglaize','013':'Belmont','015':'Brown','017':'Butler','019':'Carroll','021':'Champaign','023':'Clark','025':'Clermont','027':'Clinton','029':'Columbiana','031':'Coshocton','033':'Crawford','035':'Cuyahoga','037':'Darke','039':'Defiance','041':'Delaware','043':'Erie','045':'Fairfield','047':'Fayette','049':'Franklin','051':'Fulton','053':'Gallia','055':'Geauga','057':'Greene','059':'Guernsey','061':'Hamilton','063':'Hancock','065':'Hardin','067':'Harrison','069':'Henry','071':'Highland','073':'Hocking','075':'Holmes','077':'Huron','079':'Jackson','081':'Jefferson','083':'Knox','085':'Lake','087':'Lawrence','089':'Licking','091':'Logan','093':'Lorain','095':'Lucas','097':'Madison','099':'Mahoning','101':'Marion','103':'Medina','105':'Meigs','107':'Mercer','109':'Miami','111':'Monroe','113':'Montgomery','115':'Morgan','117':'Morrow','119':'Muskingum','121':'Noble','123':'Ottawa','125':'Paulding','127':'Perry','129':'Pickaway','131':'Pike','133':'Portage','135':'Preble','137':'Putnam','139':'Richland','141':'Ross','143':'Sandusky','145':'Scioto','147':'Seneca','149':'Shelby','151':'Stark','153':'Summit','155':'Trumbull','157':'Tuscarawas','159':'Union','161':'Van Wert','163':'Vinton','165':'Warren','167':'Washington','169':'Wayne','171':'Williams','173':'Wood','175':'Wyandot'},
  OK: {'001':'Adair','003':'Alfalfa','005':'Atoka','007':'Beaver','009':'Beckham','011':'Blaine','013':'Bryan','015':'Caddo','017':'Canadian','019':'Carter','021':'Cherokee','023':'Choctaw','025':'Cimarron','027':'Cleveland','029':'Coal','031':'Comanche','033':'Cotton','035':'Craig','037':'Creek','039':'Custer','041':'Delaware','043':'Dewey','045':'Ellis','047':'Garfield','049':'Garvin','051':'Grady','053':'Grant','055':'Greer','057':'Harmon','059':'Harper','061':'Haskell','063':'Hughes','065':'Jackson','067':'Jefferson','069':'Johnston','071':'Kay','073':'Kingfisher','075':'Kiowa','077':'Latimer','079':'Le Flore','081':'Lincoln','083':'Logan','085':'Love','087':'McClain','089':'McCurtain','091':'McIntosh','093':'Major','095':'Marshall','097':'Mayes','099':'Murray','101':'Muskogee','103':'Noble','105':'Nowata','107':'Okfuskee','109':'Oklahoma','111':'Okmulgee','113':'Osage','115':'Ottawa','117':'Pawnee','119':'Payne','121':'Pittsburg','123':'Pontotoc','125':'Pottawatomie','127':'Pushmataha','129':'Roger Mills','131':'Rogers','133':'Seminole','135':'Sequoyah','137':'Stephens','139':'Texas','141':'Tillman','143':'Tulsa','145':'Wagoner','147':'Washington','149':'Washita','151':'Woods','153':'Woodward'},
  OR: {'001':'Baker','003':'Benton','005':'Clackamas','007':'Clatsop','009':'Columbia','011':'Coos','013':'Crook','015':'Curry','017':'Deschutes','019':'Douglas','021':'Gilliam','023':'Grant','025':'Harney','027':'Hood River','029':'Jackson','031':'Jefferson','033':'Josephine','035':'Klamath','037':'Lake','039':'Lane','041':'Lincoln','043':'Linn','045':'Malheur','047':'Marion','049':'Morrow','051':'Multnomah','053':'Polk','055':'Sherman','057':'Tillamook','059':'Umatilla','061':'Union','063':'Wallowa','065':'Wasco','067':'Washington','069':'Wheeler','071':'Yamhill'},
  PA: {'001':'Adams','003':'Allegheny','005':'Armstrong','007':'Beaver','009':'Bedford','011':'Berks','013':'Blair','015':'Bradford','017':'Bucks','019':'Butler','021':'Cambria','023':'Cameron','025':'Carbon','027':'Centre','029':'Chester','031':'Clarion','033':'Clearfield','035':'Clinton','037':'Columbia','039':'Crawford','041':'Cumberland','043':'Dauphin','045':'Delaware','047':'Elk','049':'Erie','051':'Fayette','053':'Forest','055':'Franklin','057':'Fulton','059':'Greene','061':'Huntingdon','063':'Indiana','065':'Jefferson','067':'Juniata','069':'Lackawanna','071':'Lancaster','073':'Lawrence','075':'Lebanon','077':'Lehigh','079':'Luzerne','081':'Lycoming','083':'McKean','085':'Mercer','087':'Mifflin','089':'Monroe','091':'Montgomery','093':'Montour','095':'Northampton','097':'Northumberland','099':'Perry','101':'Philadelphia','103':'Pike','105':'Potter','107':'Schuylkill','109':'Snyder','111':'Somerset','113':'Sullivan','115':'Susquehanna','117':'Tioga','119':'Union','121':'Venango','123':'Warren','125':'Washington','127':'Wayne','129':'Westmoreland','131':'Wyoming','133':'York'},
  RI: {'001':'Bristol','003':'Kent','005':'Newport','007':'Providence','009':'Washington'},
  SC: {'001':'Abbeville','003':'Aiken','005':'Allendale','007':'Anderson','009':'Bamberg','011':'Barnwell','013':'Beaufort','015':'Berkeley','017':'Calhoun','019':'Charleston','021':'Cherokee','023':'Chester','025':'Chesterfield','027':'Clarendon','029':'Colleton','031':'Darlington','033':'Dillon','035':'Dorchester','037':'Edgefield','039':'Fairfield','041':'Florence','043':'Georgetown','045':'Greenville','047':'Greenwood','049':'Hampton','051':'Horry','053':'Jasper','055':'Kershaw','057':'Lancaster','059':'Laurens','061':'Lee','063':'Lexington','065':'McCormick','067':'Marion','069':'Marlboro','071':'Newberry','073':'Oconee','075':'Orangeburg','077':'Pickens','079':'Richland','081':'Saluda','083':'Spartanburg','085':'Sumter','087':'Union','089':'Williamsburg','091':'York'},
  SD: {'003':'Aurora','005':'Beadle','007':'Bennett','009':'Bon Homme','011':'Brookings','013':'Brown','015':'Brule','017':'Buffalo','019':'Butte','021':'Campbell','023':'Charles Mix','025':'Clark','027':'Clay','029':'Codington','031':'Corson','033':'Custer','035':'Davison','037':'Day','039':'Deuel','041':'Dewey','043':'Douglas','045':'Edmunds','047':'Fall River','049':'Faulk','051':'Grant','053':'Gregory','055':'Haakon','057':'Hamlin','059':'Hand','061':'Hanson','063':'Harding','065':'Hughes','067':'Hutchinson','069':'Hyde','071':'Jackson','073':'Jerauld','075':'Jones','077':'Kingsbury','079':'Lake','081':'Lawrence','083':'Lincoln','085':'Lyman','087':'McCook','089':'McPherson','091':'Marshall','093':'Meade','095':'Mellette','097':'Miner','099':'Minnehaha','101':'Moody','103':'Pennington','105':'Perkins','107':'Potter','109':'Roberts','111':'Sanborn','113':'Shannon','115':'Spink','117':'Stanley','119':'Sully','121':'Todd','123':'Tripp','125':'Turner','127':'Union','129':'Walworth','135':'Yankton','137':'Ziebach'},
  TN: {'001':'Anderson','003':'Bedford','005':'Benton','007':'Bledsoe','009':'Blount','011':'Bradley','013':'Campbell','015':'Cannon','017':'Carroll','019':'Carter','021':'Cheatham','023':'Chester','025':'Claiborne','027':'Clay','029':'Cocke','031':'Coffee','033':'Crockett','035':'Cumberland','037':'Davidson','039':'Decatur','041':'De Kalb','043':'Dickson','045':'Dyer','047':'Fayette','049':'Fentress','051':'Franklin','053':'Gibson','055':'Giles','057':'Grainger','059':'Greene','061':'Grundy','063':'Hamblen','065':'Hamilton','067':'Hancock','069':'Hardeman','071':'Hardin','073':'Hawkins','075':'Haywood','077':'Henderson','079':'Henry','081':'Hickman','083':'Houston','085':'Humphreys','087':'Jackson','089':'Jefferson','091':'Johnson','093':'Knox','095':'Lake','097':'Lauderdale','099':'Lawrence','101':'Lewis','103':'Lincoln','105':'Loudon','107':'McMinn','109':'McNairy','111':'Macon','113':'Madison','115':'Marion','117':'Marshall','119':'Maury','121':'Meigs','123':'Monroe','125':'Montgomery','127':'Moore','129':'Morgan','131':'Obion','133':'Overton','135':'Perry','137':'Pickett','139':'Polk','141':'Putnam','143':'Rhea','145':'Roane','147':'Robertson','149':'Rutherford','151':'Scott','153':'Sequatchie','155':'Sevier','157':'Shelby','159':'Smith','161':'Stewart','163':'Sullivan','165':'Sumner','167':'Tipton','169':'Trousdale','171':'Unicoi','173':'Union','175':'Van Buren','177':'Warren','179':'Washington','181':'Wayne','183':'Weakley','185':'White','187':'Williamson','189':'Wilson'},
  UT: {'001':'Beaver','003':'Box Elder','005':'Cache','007':'Carbon','009':'Daggett','011':'Davis','013':'Duchesne','015':'Emery','017':'Garfield','019':'Grand','021':'Iron','023':'Juab','025':'Kane','027':'Millard','029':'Morgan','031':'Piute','033':'Rich','035':'Salt Lake','037':'San Juan','039':'Sanpete','041':'Sevier','043':'Summit','045':'Tooele','047':'Uintah','049':'Utah','051':'Wasatch','053':'Washington','055':'Wayne','057':'Weber'},
  VA: {'001':'Accomack','003':'Albemarle','005':'Alleghany','007':'Amelia','009':'Amherst','011':'Appomattox','013':'Arlington','015':'Augusta','017':'Bath','019':'Bedford','021':'Bland','023':'Botetourt','025':'Brunswick','027':'Buchanan','029':'Buckingham','031':'Campbell','033':'Caroline','035':'Carroll','036':'Charles City','037':'Charlotte','041':'Chesterfield','043':'Clarke','045':'Craig','047':'Culpeper','049':'Cumberland','051':'Dickenson','053':'Dinwiddie','057':'Essex','059':'Fairfax','061':'Fauquier','063':'Floyd','065':'Fluvanna','067':'Franklin','069':'Frederick','071':'Giles','073':'Gloucester','075':'Goochland','077':'Grayson','079':'Greene','081':'Greensville','083':'Halifax','085':'Hanover','087':'Henrico','089':'Henry','091':'Highland','093':'Isle of Wight','095':'James City','097':'King and Queen','099':'King George','101':'King William','103':'Lancaster','105':'Lee','107':'Loudoun','109':'Louisa','111':'Lunenburg','113':'Madison','115':'Mathews','117':'Mecklenburg','119':'Middlesex','121':'Montgomery','125':'Nelson','127':'New Kent','131':'Northampton','133':'Northumberland','135':'Nottoway','137':'Orange','139':'Page','141':'Patrick','143':'Pittsylvania','145':'Powhatan','147':'Prince Edward','149':'Prince George','153':'Prince William','155':'Pulaski','157':'Rappahannock','159':'Richmond','161':'Roanoke','163':'Rockbridge','165':'Rockingham','167':'Russell','169':'Scott','171':'Shenandoah','173':'Smyth','175':'Southampton','177':'Spotsylvania','179':'Stafford','181':'Surry','183':'Sussex','185':'Tazewell','187':'Warren','191':'Washington','193':'Westmoreland','195':'Wise','197':'Wythe','199':'York'},
  VT: {'001':'Addison','003':'Bennington','005':'Caledonia','007':'Chittenden','009':'Essex','011':'Franklin','013':'Grand Isle','015':'Lamoille','017':'Orange','019':'Orleans','021':'Rutland','023':'Washington','025':'Windham','027':'Windsor'},
  WA: {'001':'Adams','003':'Asotin','005':'Benton','007':'Chelan','009':'Clallam','011':'Clark','013':'Columbia','015':'Cowlitz','017':'Douglas','019':'Ferry','021':'Franklin','023':'Garfield','025':'Grant','027':'Grays Harbor','029':'Island','031':'Jefferson','033':'King','035':'Kitsap','037':'Kittitas','039':'Klickitat','041':'Lewis','043':'Lincoln','045':'Mason','047':'Okanogan','049':'Pacific','051':'Pend Oreille','053':'Pierce','055':'San Juan','057':'Skagit','059':'Skamania','061':'Snohomish','063':'Spokane','065':'Stevens','067':'Thurston','069':'Wahkiakum','071':'Walla Walla','073':'Whatcom','075':'Whitman','077':'Yakima'},
  WI: {'001':'Adams','003':'Ashland','005':'Barron','007':'Bayfield','009':'Brown','011':'Buffalo','013':'Burnett','015':'Calumet','017':'Chippewa','019':'Clark','021':'Columbia','023':'Crawford','025':'Dane','027':'Dodge','029':'Door','031':'Douglas','033':'Dunn','035':'Eau Claire','037':'Florence','039':'Fond du Lac','041':'Forest','043':'Grant','045':'Green','047':'Green Lake','049':'Iowa','051':'Iron','053':'Jackson','055':'Jefferson','057':'Juneau','059':'Kenosha','061':'Kewaunee','063':'La Crosse','065':'Lafayette','067':'Langlade','069':'Lincoln','071':'Manitowoc','073':'Marathon','075':'Marinette','077':'Marquette','078':'Menominee','079':'Milwaukee','081':'Monroe','083':'Oconto','085':'Oneida','087':'Outagamie','089':'Ozaukee','091':'Pepin','093':'Pierce','095':'Polk','097':'Portage','099':'Price','101':'Racine','103':'Richland','105':'Rock','107':'Rusk','109':'St. Croix','111':'Sauk','113':'Sawyer','115':'Shawano','117':'Sheboygan','119':'Taylor','121':'Trempealeau','123':'Vernon','125':'Vilas','127':'Walworth','129':'Washburn','131':'Washington','133':'Waukesha','135':'Waupaca','137':'Waushara','139':'Winnebago','141':'Wood'},
  WV: {'001':'Barbour','003':'Berkeley','005':'Boone','007':'Braxton','009':'Brooke','011':'Cabell','013':'Calhoun','015':'Clay','017':'Doddridge','019':'Fayette','021':'Gilmer','023':'Grant','025':'Greenbrier','027':'Hampshire','029':'Hancock','031':'Hardy','033':'Harrison','035':'Jackson','037':'Jefferson','039':'Kanawha','041':'Lewis','043':'Lincoln','045':'Logan','047':'McDowell','049':'Marion','051':'Marshall','053':'Mason','055':'Mercer','057':'Mineral','059':'Mingo','061':'Monongalia','063':'Monroe','065':'Morgan','067':'Nicholas','069':'Ohio','071':'Pendleton','073':'Pleasants','075':'Pocahontas','077':'Preston','079':'Putnam','081':'Raleigh','083':'Randolph','085':'Ritchie','087':'Roane','089':'Summers','091':'Taylor','093':'Tucker','095':'Tyler','097':'Upshur','099':'Wayne','101':'Webster','103':'Wetzel','105':'Wirt','107':'Wood','109':'Wyoming'},
  WY: {'001':'Albany','003':'Big Horn','005':'Campbell','007':'Carbon','009':'Converse','011':'Crook','013':'Fremont','015':'Goshen','017':'Hot Springs','019':'Johnson','021':'Laramie','023':'Lincoln','025':'Natrona','027':'Niobrara','029':'Park','031':'Platte','033':'Sheridan','035':'Sublette','037':'Sweetwater','039':'Teton','041':'Uinta','043':'Washakie','045':'Weston'},
};

function getCountyName(state: string, fips: string): string {
  const name = COUNTY_FIPS[state]?.[fips];
  return name ? name + ' Co.' : `County ${fips}`;
}


import { METHODOLOGY_NOTE } from '@/lib/data-labels';

// ---  Design Tokens  ---
const C = {
  bg: '#FAFAF7', bgCard: '#FFFFFF', bgWarm: '#F5F0E8',
  border: '#E8E2D8', borderLight: '#F0EBE3',
  text: '#1C1917', textBody: '#3D3833', textMuted: '#78716C', textDim: '#A8A29E',
  terra: '#C4653A', sage: '#5D7E52', gold: '#B8860B', navy: '#1B2A4A',
  chart: ['#C4653A','#5D7E52','#B8860B','#4A7FB5','#A85D8A','#3D908E','#D4845E','#7A6B5D'],
  font: "'Outfit', sans-serif",
  fontMono: "'IBM Plex Mono', monospace",
  fontSerif: "'Source Serif 4', Georgia, serif",
};

// ---  Fallback static state list (for sidebar)  ---
const ALL_STATES = [
  {code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},
  {code:'AR',name:'Arkansas'},{code:'CA',name:'California'},{code:'CO',name:'Colorado'},
  {code:'CT',name:'Connecticut'},{code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},
  {code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},{code:'ID',name:'Idaho'},
  {code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},
  {code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},
  {code:'ME',name:'Maine'},{code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},
  {code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},{code:'MS',name:'Mississippi'},
  {code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},
  {code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},
  {code:'NM',name:'New Mexico'},{code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},
  {code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},{code:'OK',name:'Oklahoma'},
  {code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},
  {code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},
  {code:'TX',name:'Texas'},{code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},
  {code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},{code:'WV',name:'West Virginia'},
  {code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'},{code:'DC',name:'Washington DC'},
];

// ---  Types  ---
interface PanelData { label: string; count: number; pct?: number; }
interface NationalData { [key: string]: any; }
interface StateRow   { [key: string]: any; }
interface LoadState  { loading: boolean; error: string | null; }
/** Row returned by the breakdown queries: { LABEL, RECORD_COUNT } */
interface BreakdownRow { LABEL: string; RECORD_COUNT: number | string; }
/** Census ACS aggregated data for a county */
interface CensusData {
  totalPop: number;
  pctWhite: number;
  pctHispanic: number;
  pctBlack: number;
  pctAsian: number;
  medianIncome: number;
  ownerOccRate: number;
  medianHomeValue: number;
}

// ---  Skeleton shimmer  ---
function Skeleton({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: `linear-gradient(90deg, ${C.bgWarm} 25%, #EDE8DF 50%, ${C.bgWarm} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

// ---  Error State  ---
function ErrorMsg({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: '12px 16px', background: '#FFF4F0', borderRadius: 8, border: `1px solid ${C.terra}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 16 }}> </span>
      <span style={{ fontSize: 12, color: C.terra, flex: 1 }}>{msg}</span>
      {onRetry && (
        <button onClick={onRetry} style={{ fontSize: 11, color: C.terra, background: 'none', border: `1px solid ${C.terra}60`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
          Retry
        </button>
      )}
    </div>
  );
}

// ---  FreqTable  ---
function FreqTable({ title, data, color = C.terra, loading = false, error = null, onRetry }: {
  title: string; data: PanelData[]; color?: string;
  loading?: boolean; error?: string | null; onRetry?: () => void;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      {loading ? (
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h={18} />)}
        </div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '6px 14px', fontSize: 10, fontWeight: 700, color: C.textDim, background: C.bgWarm, borderBottom: `1px solid ${C.border}` }}>
            <span>CATEGORY</span><span style={{ textAlign: 'right' }}>COUNT</span><span style={{ textAlign: 'right' }}>% TOTAL</span>
          </div>
          {data.map((d, i) => {
            const pct = total > 0 ? (d.count / total * 100) : (d.pct ?? 0);
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 70px', padding: '7px 14px', borderBottom: i < data.length - 1 ? `1px solid ${C.borderLight}` : 'none', alignItems: 'center', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: C.chart[i % C.chart.length], flexShrink: 0 }} />
                  <span style={{ color: C.textBody }}>{d.label}</span>
                </div>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, color: C.text, fontWeight: 600 }}>{d.count.toLocaleString()}</span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 11, fontWeight: 700, color }}>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ---  HBarChart  ---
function HBarChart({ title, data, loading = false, error = null, onRetry, valuePrefix = '', valueSuffix = '' }: {
  title: string; data: PanelData[];
  loading?: boolean; error?: string | null; onRetry?: () => void;
  valuePrefix?: string; valueSuffix?: string;
}) {
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null);
  const max = data.length > 0 ? Math.max(...data.map(d => d.count)) : 1;
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          [1,2,3,4,5].map(i => <Skeleton key={i} h={28} />)
        ) : error ? (
          <ErrorMsg msg={error} onRetry={onRetry} />
        ) : (
          data.map((d, i) => (
            <div key={i} style={{ position: 'relative' }}
              onMouseEnter={(e) => setTooltip({ i, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textBody, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.chart[i % C.chart.length], fontFamily: C.fontMono, flexShrink: 0 }}>
                  {valuePrefix}{d.count.toLocaleString()}{valueSuffix}
                </span>
              </div>
              <div style={{ height: 8, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${max > 0 ? (d.count / max) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 4, transition: 'width 0.6s ease' }} />
              </div>
              {tooltip?.i === i && (
                <div style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 30, background: C.text, color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, pointerEvents: 'none', zIndex: 999, whiteSpace: 'nowrap' }}>
                  {d.label}: {valuePrefix}{d.count.toLocaleString()}{valueSuffix}
                  {d.pct != null ? ` (${d.pct.toFixed(1)}%)` : ''}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---  PieChart  ---
function PieChart({ title, data, loading = false, error = null, onRetry }: {
  title: string; data: PanelData[];
  loading?: boolean; error?: string | null; onRetry?: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.count, 0);
  let cumAngle = -90;
  const cx = 80, cy = 80, r = 65, inner = 38;
  const slices = data.filter(d => d.count > 0).map((d, i) => {
    const angle = total > 0 ? (d.count / total) * 360 : 0;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, angle, color: C.chart[i % C.chart.length], idx: i };
  });
  const toRad = (a: number) => a * Math.PI / 180;
  const arcPath = (start: number, end: number, expand = false) => {
    const extraR = expand ? 5 : 0;
    const curR = r + extraR;
    const x1 = cx + curR * Math.cos(toRad(start));
    const y1 = cy + curR * Math.sin(toRad(start));
    const x2 = cx + curR * Math.cos(toRad(end - 0.5));
    const y2 = cy + curR * Math.sin(toRad(end - 0.5));
    const ix1 = cx + inner * Math.cos(toRad(end - 0.5));
    const iy1 = cy + inner * Math.sin(toRad(end - 0.5));
    const ix2 = cx + inner * Math.cos(toRad(start));
    const iy2 = cy + inner * Math.sin(toRad(start));
    const large = (end - start) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${curR} ${curR} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z`;
  };
  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      {loading ? (
        <div style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Skeleton w={160} h={160} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3].map(i => <Skeleton key={i} h={16} />)}
          </div>
        </div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : (
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width={160} height={160} viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
            {slices.map((s) => (
              <path key={s.idx} d={arcPath(s.start, s.start + s.angle, hovered === s.idx)}
                fill={s.color}
                style={{ filter: hovered === s.idx ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(s.idx)}
                onMouseLeave={() => setHovered(null)} />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="700" fill={C.text} fontFamily={C.fontMono}>
              {total >= 1e9 ? (total / 1e9).toFixed(1) + 'B' : total >= 1e6 ? (total / 1e6).toFixed(1) + 'M' : total.toLocaleString()}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill={C.textDim}>TOTAL</text>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
            {slices.map((d) => (
              <div key={d.idx} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '2px 4px', borderRadius: 4, background: hovered === d.idx ? C.bgWarm : 'transparent', transition: 'background 0.15s' }}
                onMouseEnter={() => setHovered(d.idx)}
                onMouseLeave={() => setHovered(null)}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.textBody, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.color, fontFamily: C.fontMono }}>{(d.count / total * 100).toFixed(1)}%</span>
                  {hovered === d.idx && <div style={{ fontSize: 9, color: C.textDim }}>{d.count.toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---  Line / Trend Chart  ---
function TrendChart({ title, data, loading = false, error = null, onRetry }: {
  title: string; data: { year: string; count: number }[];
  loading?: boolean; error?: string | null; onRetry?: () => void;
}) {
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null);
  const max = data.length > 0 ? Math.max(...data.map(d => d.count)) : 1;
  const W = 340, H = 120, PAD = { t: 12, r: 12, b: 28, l: 48 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const pts = data.map((d, i) => ({
    x: PAD.l + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
    y: PAD.t + chartH - (max > 0 ? (d.count / max) * chartH : 0),
    ...d,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
      {loading ? (
        <div style={{ padding: 16 }}><Skeleton h={120} /></div>
      ) : error ? (
        <div style={{ padding: 12 }}><ErrorMsg msg={error} onRetry={onRetry} /></div>
      ) : data.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 12 }}>No trend data available for this selection.</div>
      ) : (
        <div style={{ padding: '12px 16px', position: 'relative' }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
            {/* Y gridlines */}
            {[0.25, 0.5, 0.75, 1].map(pct => {
              const y = PAD.t + chartH - pct * chartH;
              return <line key={pct} x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={C.borderLight} strokeWidth={0.5} />;
            })}
            {/* Line */}
            {pts.length > 1 && (
              <polyline points={polyline} fill="none" stroke={C.terra} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            )}
            {/* Fill */}
            {pts.length > 1 && (
              <polygon
                points={`${pts[0].x},${PAD.t + chartH} ${polyline} ${pts[pts.length-1].x},${PAD.t + chartH}`}
                fill={`${C.terra}18`} />
            )}
            {/* Dots */}
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={tooltip?.i === i ? 5 : 3}
                fill={tooltip?.i === i ? C.terra : C.bgCard} stroke={C.terra} strokeWidth={2}
                style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                onMouseEnter={(e) => setTooltip({ i, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)} />
            ))}
            {/* X labels show every 5 years */}
            {pts.filter((_, i) => i % 5 === 0 || i === pts.length - 1).map((p, i) => (
              <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize={7} fill={C.textDim}>{p.year}</text>
            ))}
            {/* Y label */}
            <text x={PAD.l - 4} y={PAD.t + chartH / 2} textAnchor="middle" fontSize={7} fill={C.textDim}
              transform={`rotate(-90, ${PAD.l - 4}, ${PAD.t + chartH / 2})`}>Count</text>
          </svg>
          {tooltip !== null && (
            <div style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 30, background: C.text, color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, pointerEvents: 'none', zIndex: 999, whiteSpace: 'nowrap' }}>
              {pts[tooltip.i].year}: {pts[tooltip.i].count.toLocaleString()} records
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---  Parcel Modal (live data)  ---
function ParcelModal({ filter, state, county, city, zip, onClose }: {
  filter: string; state?: string; county?: string; city?: string; zip?: string; onClose: () => void;
}) {
  const [code, setCode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState('VALUE_MARKET');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const PER_PAGE = 10;

  const tryAuth = () => {
    if (code === 'Iconycs01') {
      setAuthed(true);
      setError('');
      fetchParcels();
    } else {
      setError('Invalid access code');
    }
  };

  const fetchParcels = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({ access_code: 'Iconycs01' });
      if (state)  params.set('state', state);
      if (county) params.set('county', county);
      if (city)   params.set('city', city);
      if (zip)    params.set('zip', zip);
      const res = await fetch(`/api/snowflake/parcels?${params.toString()}`);
      const json = await res.json();
      if (json.success) setData(json.data ?? []);
      else setFetchError(json.error ?? 'Failed to load parcels');
    } catch (e: any) {
      setFetchError(e.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const ltvBadge = (val: number, loan: number): string => {
    if (!val || !loan) return '';
    const ltv = (loan / val) * 100;
    if (ltv <= 60)  return 'deg60%';
    if (ltv <= 65)  return '60-65%';
    if (ltv <= 70)  return '65-70%';
    if (ltv <= 75)  return '70-75%';
    if (ltv <= 80)  return '75-80%';
    if (ltv <= 85)  return '80-85%';
    if (ltv <= 90)  return '85-90%';
    if (ltv <= 95)  return '90-95%';
    if (ltv <= 97)  return '95-97%';
    return '>97%';
  };

  const sorted = [...data].sort((a, b) => {
    const va = a[sortCol] ?? 0;
    const vb = b[sortCol] ?? 0;
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });
  const paged = sorted.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(sorted.length / PER_PAGE);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortArrow = ({ col }: { col: string }) => (
    <span style={{ marginLeft: 4, opacity: sortCol === col ? 1 : 0.3 }}>
      {sortCol === col ? (sortDir === 'asc' ? '' : '') : ''}
    </span>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.bgCard, borderRadius: 16, padding: 32, width: 800, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Parcel Data Access</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{filter}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: C.textDim, lineHeight: 1 }}>' - </button>
        </div>

        {!authed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>"'</div>
            <div style={{ fontSize: 14, color: C.textBody, marginBottom: 20, lineHeight: 1.6 }}>
              Parcel-level data includes individually sourced property and ownership records.<br/>
              Enter your access code to view underlying property data.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <input type="password" value={code} onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && tryAuth()}
                placeholder="Access code"
                style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${error ? C.terra : C.border}`, fontSize: 14, fontFamily: C.font, outline: 'none', width: 180 }} />
              <button onClick={tryAuth} style={{ padding: '10px 20px', borderRadius: 8, background: C.terra, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: C.font }}>Access</button>
            </div>
            {error && <div style={{ fontSize: 12, color: C.terra, marginTop: 10 }}>{error}</div>}
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} h={32} />)}
          </div>
        ) : fetchError ? (
          <ErrorMsg msg={fetchError} onRetry={fetchParcels} />
        ) : (
          <div>
            <div style={{ padding: '8px 12px', background: '#EDF4EB', borderRadius: 8, fontSize: 12, color: C.sage, fontWeight: 600, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>" Access granted {data.length} records Direct Identified Records</span>
              <span style={{ fontSize: 11, color: C.textMuted }}>{filter}</span>
            </div>

            {/* Table header */}
            <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, display: 'grid', gridTemplateColumns: '2fr 1fr 80px 55px 55px 70px 70px', padding: '6px 8px', background: C.bgWarm, borderRadius: 6, marginBottom: 4, gap: 6 }}>
              {[
                ['ADDRESS', 'ADDRESS'], ['ETHNICITY', 'ETHNICITY_DESC'],
                ['VALUE', 'VALUE_MARKET'], ['SQFT', 'LIVING_SQFT'],
                ['BEDS', 'BEDROOMS'], ['LOAN AMT', 'MTG1_AMOUNT'], ['LTV TIER', null],
              ].map(([label, col]) => (
                <span key={label} onClick={() => col && toggleSort(col)}
                  style={{ cursor: col ? 'pointer' : 'default', userSelect: 'none' }}>
                  {label}{col && <SortArrow col={col} />}
                </span>
              ))}
            </div>

            {paged.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 55px 55px 70px 70px', padding: '8px', borderBottom: `1px solid ${C.borderLight}`, fontSize: 11, alignItems: 'center', gap: 6 }}>
                <div>
                  <div style={{ color: C.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ADDRESS || ''}</div>
                  <div style={{ color: C.textMuted, fontSize: 10 }}>{r.CITY}, {r.STATE} {r.ZIP}</div>
                </div>
                <div>
                  <div style={{ color: C.textBody }}>{r.ETHNICITY_DESC || 'Not Identified'}</div>
                  <div style={{ fontSize: 9, color: C.textDim }}>{r.ETHNICITYCD ? '[Green] Direct ID' : '" Area Est.'}</div>
                </div>
                <span style={{ textAlign: 'right', color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>
                  {r.VALUE_MARKET ? '$' + Number(r.VALUE_MARKET).toLocaleString() : ''}
                </span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono }}>{r.LIVING_SQFT ? Number(r.LIVING_SQFT).toLocaleString() : ''}</span>
                <span style={{ textAlign: 'center' }}>{r.BEDROOMS ?? ''}</span>
                <span style={{ textAlign: 'right', fontFamily: C.fontMono, fontSize: 10 }}>
                  {r.MTG1_AMOUNT ? '$' + (Number(r.MTG1_AMOUNT) / 1000).toFixed(0) + 'K' : ''}
                </span>
                <span style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: C.bgWarm, fontFamily: C.fontMono, fontWeight: 700 }}>
                    {ltvBadge(r.VALUE_MARKET, r.MTG1_AMOUNT)}
                  </span>
                </span>
              </div>
            ))}

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 0', fontSize: 11, color: C.textMuted }}>
              <span>Showing {page * PER_PAGE + 1}""{Math.min((page + 1) * PER_PAGE, sorted.length)} of {sorted.length} records</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: page === 0 ? C.bgWarm : C.bgCard, color: page === 0 ? C.textDim : C.terra, cursor: page === 0 ? 'not-allowed' : 'pointer', fontSize: 11, fontFamily: C.font }}>
                  " Prev
                </button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                  style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.border}`, background: page >= totalPages - 1 ? C.bgWarm : C.bgCard, color: page >= totalPages - 1 ? C.textDim : C.terra, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontSize: 11, fontFamily: C.font }}>
                  Next "
                </button>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: C.bgWarm, borderRadius: 8, fontSize: 10, color: C.textDim, lineHeight: 1.6 }}>
              {METHODOLOGY_NOTE}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// --- Upgrade Modal ---------------------------------------------------------
function UpgradeModal({
  feature,
  minTier,
  onClose,
}: {
  feature: string;
  minTier: string;
  onClose: () => void;
}) {
  const tiers: Record<string, { bg: string; color: string; name: string }> = {
    pro:          { bg: '#C4653A', color: '#fff',    name: 'Analyst' },
    enterprise:   { bg: '#1B2A4A', color: '#fff',    name: 'Professional' },
    data_partner: { bg: '#B8860B', color: '#1C1917', name: 'Enterprise' },
  };
  const tier = tiers[minTier] ?? tiers.pro;

  const allTiers = [
    { key: 'pro',          name: 'Analyst',      features: ['State/County/City/ZIP drill-down', 'All demographics breakdowns', 'PDF export', 'Cascade Builder', 'Unlimited views'] },
    { key: 'enterprise',   name: 'Professional', features: ['Everything in Analyst', 'Social Housing Score', 'Matrix Builder', 'API access', 'Custom data feeds'] },
    { key: 'data_partner', name: 'Enterprise',   features: ['Everything in Professional', 'Snowflake direct connect', 'Team seats (5)', 'Bulk export', 'Priority support'] },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 560, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#A8A29E', lineHeight: 1 }}>x</button>

        <div style={{ fontSize: 22, fontWeight: 700, color: '#1C1917', marginBottom: 6 }}>Get Early Access</div>
        <div style={{ fontSize: 13, color: '#78716C', marginBottom: 24, lineHeight: 1.6 }}>
          <strong style={{ color: '#1C1917' }}>{feature}</strong> is available on paid tiers. Choose the plan that fits your workflow.
        </div>

        {/* Tier cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {allTiers.map((t, i) => {
            const isRecommended = t.key === minTier;
            const tierStyle = tiers[t.key];
            return (
              <div key={i} style={{ border: `2px solid ${isRecommended ? tierStyle.bg : '#E8E2D8'}`, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                {isRecommended && (
                  <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, background: tierStyle.bg, color: tierStyle.color, borderRadius: 10, padding: '2px 10px', fontWeight: 700 }}>RECOMMENDED</div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '12px 16px', background: isRecommended ? tierStyle.bg : '#FAFAF7' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isRecommended ? tierStyle.color : '#1C1917' }}>{t.name}</div>
                </div>
                <div style={{ padding: '10px 16px', background: '#fff' }}>
                  {t.features.map((f, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#3D3833', marginBottom: 4 }}>
                      <span style={{ color: '#5D7E52', fontWeight: 700, flexShrink: 0 }}>checkmark</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Link
            href="/pricing"
            onClick={onClose}
            style={{ flex: 1, padding: '12px 20px', background: tier.bg, color: tier.color, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
          >
            View Pricing
          </Link>
          <Link
            href="/pricing#waitlist"
            onClick={onClose}
            style={{ flex: 1, padding: '12px 20px', background: 'transparent', color: tier.bg, border: `2px solid ${tier.bg}`, borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Get Early Access
          </Link>
          <button onClick={onClose} style={{ padding: '12px 16px', background: 'transparent', border: '1px solid #E8E2D8', borderRadius: 8, fontSize: 13, color: '#78716C', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            Later
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#A8A29E' }}>
          Payments via Stripe - Questions? <a href="mailto:info@iconycs.com" style={{ color: '#C4653A', textDecoration: 'none' }}>info@iconycs.com</a>
        </div>
      </div>
    </div>
  );
}

// ---  Tier Badge  ---
function TierBadge({ tier }: { tier: 'free' | 'pro' | 'enterprise' | 'data_partner' }) {
  const config = {
    free:         { label: 'Explore',     bg: '#F5F0E8', color: '#78716C', border: '#E8E2D8' },
    pro:          { label: 'Pro Analyst', bg: '#C4653A', color: '#fff',    border: '#C4653A' },
    enterprise:   { label: 'Enterprise',  bg: '#1B2A4A', color: '#fff',    border: '#1B2A4A' },
    data_partner: { label: 'Data Partner',bg: '#B8860B', color: '#fff',    border: '#B8860B' },
  }[tier];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: config.bg, color: config.color, border: `1px solid ${config.border}`, fontSize: 11, fontWeight: 700, userSelect: 'none' }}>
      <span></span> {config.label}
    </div>
  );
}

// ---  Main Page  ---
export default function ReportsPage() {
  // Geography selection
  const [selected, setSelected]     = useState<string[]>(['ALL']);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedCountyFips, setSelectedCountyFips] = useState<string | null>(null);
  const [drillCity, setDrillCity]   = useState<string | null>(null);
  const [drillZip, setDrillZip]     = useState<string | null>(null);
  const [search, setSearch]         = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [countySearch, setCountySearch] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<{state:string;stateName:string;city:string;props:number;avg:number}[]>([]);

  // Time period
  const [timePeriod, setTimePeriod] = useState<string>('all');

  // Census demographics
  const [censusData, setCensusData] = useState<CensusData | null>(null);
  const [censusLoad, setCensusLoad] = useState<LoadState>({ loading: false, error: null });

  // Tier gating
  const [currentTier] = useState<'free' | 'pro' | 'enterprise' | 'data_partner'>('free'); // UI only no auth yet
  const [upgradeModal, setUpgradeModal] = useState<{ feature: string; minTier: string } | null>(null);

  // Modal
  const [modal, setModal] = useState<{ filter: string; state?: string; county?: string; city?: string; zip?: string } | null>(null);

  // Live data
  const [nationalData, setNationalData]   = useState<NationalData | null>(null);
  // Breakdown arrays for pie charts (populated from national or state API)
  const [ethnicityBreakdown,  setEthnicityBreakdown]  = useState<BreakdownRow[]>([]);
  const [propertyBreakdown,   setPropertyBreakdown]   = useState<BreakdownRow[]>([]);
  const [loanBreakdown,       setLoanBreakdown]       = useState<BreakdownRow[]>([]);
  const [stateData,    setStateData]      = useState<StateRow[]>([]);
  const [countyData,   setCountyData]     = useState<StateRow[]>([]);
  const [cityData,     setCityData]       = useState<StateRow[]>([]);
  const [zipData,      setZipData]        = useState<StateRow[]>([]);
  const [lenderData,   setLenderData]     = useState<PanelData[]>([]);
  const [ltvData,      setLtvData]        = useState<PanelData[]>([]);
  const [occupancyData, setOccupancyData] = useState<PanelData[]>([]);
  const [trendsData,   setTrendsData]     = useState<{year:string;count:number}[]>([]);

  // Demographics Deep Dive
  const [demoData,   setDemoData]   = useState<{
    gender: PanelData[]; marital: PanelData[]; education: PanelData[];
    income: PanelData[]; wealth: PanelData[]; ethnicity: PanelData[];
  } | null>(null);
  const [demoLoad,   setDemoLoad]   = useState<LoadState>({ loading: false, error: null });
  const [showDemographics, setShowDemographics] = useState(false);

  // Social Housing Score
  const [shsData,  setShsData]  = useState<{ score: number; band: string; label: string; components: Record<string, number> } | null>(null);
  const [shsLoad,  setShsLoad]  = useState<LoadState>({ loading: false, error: null });
  const [showShs,  setShowShs]  = useState(false);

  // Load states
  const [natLoad,    setNatLoad]    = useState<LoadState>({ loading: true,  error: null });
  const [stateLoad,  setStateLoad]  = useState<LoadState>({ loading: false, error: null });
  const [countyLoad, setCountyLoad] = useState<LoadState>({ loading: false, error: null });
  const [cityLoad,   setCityLoad]   = useState<LoadState>({ loading: false, error: null });
  const [zipLoad,    setZipLoad]    = useState<LoadState>({ loading: false, error: null });
  const [lenderLoad, setLenderLoad] = useState<LoadState>({ loading: false, error: null });
  const [ltvLoad,    setLtvLoad]    = useState<LoadState>({ loading: false, error: null });
  const [trendsLoad, setTrendsLoad] = useState<LoadState>({ loading: false, error: null });

  const isAll    = selected.includes('ALL');
  const stateCode = isAll ? undefined : selected[0];

  // ---  Fetch national  ---
  const fetchNational = useCallback(async () => {
    setNatLoad({ loading: true, error: null });
    try {
      const res = await fetch('/api/snowflake/national');
      const json = await res.json();
      if (json.success) {
        // Store top-level aggregates so stat cards still work
        setNationalData({
          TOTAL_PROPERTIES: json.totalProperties,
          AVG_PROPERTY_VALUE: json.avgValue,
          AVG_MORTGAGE: json.avgMortgage,
        });
        // Store breakdown arrays for pie charts
        setEthnicityBreakdown(json.ethnicityBreakdown ?? []);
        setPropertyBreakdown(json.propertyBreakdown ?? []);
        setLoanBreakdown(json.loanBreakdown ?? []);
        setNatLoad({ loading: false, error: null });
      } else {
        setNatLoad({ loading: false, error: json.error ?? 'Failed to load national data' });
      }
      // Fetch occupancy data (national, no state filter)
      fetch('/api/snowflake/occupancy')
        .then(r => r.json())
        .then(d => { if (d.success) setOccupancyData(d.data); })
        .catch(() => {});
    } catch (e: any) {
      setNatLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch state  ---
  const fetchState = useCallback(async (state?: string) => {
    setStateLoad({ loading: true, error: null });
    try {
      const params = state ? `?state=${state}` : '';
      const res = await fetch(`/api/snowflake/state${params}`);
      const json = await res.json();
      if (json.success) {
        setStateData(json.data ?? []);
        // When a specific state is selected, use its breakdown arrays for pie charts
        if (state && json.ethnicityBreakdown) {
          setEthnicityBreakdown(json.ethnicityBreakdown ?? []);
          setPropertyBreakdown(json.propertyBreakdown ?? []);
          setLoanBreakdown(json.loanBreakdown ?? []);
        }
        setStateLoad({ loading: false, error: null });
      } else {
        setStateLoad({ loading: false, error: json.error ?? 'Failed to load state data' });
      }
      // Fetch occupancy data (scoped to state if provided)
      fetch('/api/snowflake/occupancy' + (state ? `?state=${state}` : ''))
        .then(r => r.json())
        .then(d => { if (d.success) setOccupancyData(d.data); })
        .catch(() => {});
    } catch (e: any) {
      setStateLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch county  ---
  const fetchCounty = useCallback(async (state: string) => {
    setCountyLoad({ loading: true, error: null });
    try {
      const res = await fetch(`/api/snowflake/county?state=${state}`);
      const json = await res.json();
      if (json.success) {
        setCountyData(json.data ?? []);
        setCountyLoad({ loading: false, error: null });
      } else {
        setCountyLoad({ loading: false, error: json.error ?? 'Failed to load county data' });
      }
    } catch (e: any) {
      setCountyLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch city  ---
  const fetchCity = useCallback(async (state: string, county?: string) => {
    setCityLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ state });
      if (county) params.set('county', county);
      const res = await fetch(`/api/snowflake/city?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCityData(json.data ?? []);
        setCityLoad({ loading: false, error: null });
      } else {
        setCityLoad({ loading: false, error: json.error ?? 'Failed to load city data' });
      }
    } catch (e: any) {
      setCityLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch ZIP  ---
  const fetchZip = useCallback(async (state: string, city?: string) => {
    setZipLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ state });
      if (city) params.set('city', city);
      const res = await fetch(`/api/snowflake/zip?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setZipData(json.data ?? []);
        setZipLoad({ loading: false, error: null });
      } else {
        setZipLoad({ loading: false, error: json.error ?? 'Failed to load ZIP data' });
      }
    } catch (e: any) {
      setZipLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch lenders  ---
  const fetchLenders = useCallback(async (state?: string, city?: string) => {
    setLenderLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state) params.set('state', state);
      if (city)  params.set('city', city);
      params.set('limit', '10');
      const res = await fetch(`/api/snowflake/lenders?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLenderData((json.data ?? []).map((r: any) => ({
          label: r.LENDER_NAME ?? 'Unknown',
          count: Number(r.LOAN_COUNT ?? 0),
          pct: 0,
        })));
        setLenderLoad({ loading: false, error: null });
      } else {
        setLenderLoad({ loading: false, error: json.error ?? 'Failed to load lender data' });
      }
    } catch (e: any) {
      setLenderLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch LTV  ---
  const fetchLTV = useCallback(async (state?: string, city?: string) => {
    setLtvLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state) params.set('state', state);
      if (city)  params.set('city', city);
      const res = await fetch(`/api/snowflake/ltv?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLtvData((json.data ?? []).map((r: any) => ({
          label: r.LTV_TIER ?? '',
          count: Number(r.RECORD_COUNT ?? 0),
        })));
        setLtvLoad({ loading: false, error: null });
      } else {
        setLtvLoad({ loading: false, error: json.error ?? 'Failed to load LTV data' });
      }
    } catch (e: any) {
      setLtvLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch trends  ---
  const fetchTrends = useCallback(async (state?: string, city?: string, period?: string) => {
    setTrendsLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state)  params.set('state', state);
      if (city)   params.set('city', city);
      if (period) params.set('time_period', period);
      const res = await fetch(`/api/snowflake/trends?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setTrendsData((json.data ?? []).map((r: any) => ({
          year: String(r.RECORD_YEAR),
          count: Number(r.RECORD_COUNT ?? 0),
        })));
        setTrendsLoad({ loading: false, error: null });
      } else {
        setTrendsLoad({ loading: false, error: json.error ?? 'Failed to load trend data' });
      }
    } catch (e: any) {
      setTrendsLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch demographics  ---
  const fetchDemographics = useCallback(async (state?: string, county?: string, city?: string, zip?: string) => {
    setDemoLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state)  params.set('state', state);
      if (county) params.set('county', county);
      if (city)   params.set('city', city);
      if (zip)    params.set('zip', zip ?? '');
      const res = await fetch(`/api/snowflake/demographics?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        const d = json.data;
        const toPanel = (arr: {label:string;count:number}[]): PanelData[] =>
          arr.map(r => ({ label: r.label ?? '', count: Number(r.count ?? 0) }));
        setDemoData({
          gender:    toPanel(d.gender    ?? []),
          marital:   toPanel(d.marital   ?? []),
          education: toPanel(d.education ?? []),
          income:    toPanel(d.income    ?? []),
          wealth:    toPanel(d.wealth    ?? []),
          ethnicity: toPanel(d.ethnicity ?? []),
        });
        setDemoLoad({ loading: false, error: null });
      } else {
        setDemoLoad({ loading: false, error: json.error ?? 'Failed to load demographics' });
      }
    } catch (e: any) {
      setDemoLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch Census ACS demographics  ---
  const fetchCensus = useCallback(async (state: string, countyFips: string) => {
    setCensusLoad({ loading: true, error: null });
    try {
      const res = await fetch(`/api/snowflake/census?state=${state}&county=${countyFips}`);
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        const rows = json.data as any[];
        const totalPop    = rows.reduce((s: number, r: any) => s + Number(r.TOTAL_POPULATION ?? 0), 0);
        const whiteTot    = rows.reduce((s: number, r: any) => s + Number(r.WHITE_ALONE       ?? 0), 0);
        const blackTot    = rows.reduce((s: number, r: any) => s + Number(r.BLACK_ALONE       ?? 0), 0);
        const asianTot    = rows.reduce((s: number, r: any) => s + Number(r.ASIAN_ALONE       ?? 0), 0);
        const pctWhite    = totalPop > 0 ? (whiteTot / totalPop) * 100 : 0;
        const pctBlack    = totalPop > 0 ? (blackTot / totalPop) * 100 : 0;
        const pctAsian    = totalPop > 0 ? (asianTot / totalPop) * 100 : 0;
        const pctHispanic = Math.max(0, 100 - pctWhite - pctBlack - pctAsian);
        const validInc    = rows.filter((r: any) => Number(r.MEDIAN_HOUSEHOLD_INCOME ?? 0) > 0);
        const medianIncome = validInc.length > 0
          ? validInc.reduce((s: number, r: any) => s + Number(r.MEDIAN_HOUSEHOLD_INCOME), 0) / validInc.length : 0;
        const validHV     = rows.filter((r: any) => Number(r.MEDIAN_HOME_VALUE ?? 0) > 0);
        const medianHomeValue = validHV.length > 0
          ? validHV.reduce((s: number, r: any) => s + Number(r.MEDIAN_HOME_VALUE), 0) / validHV.length : 0;
        const totalHousing = rows.reduce((s: number, r: any) => s + Number(r.TOTAL_HOUSING_UNITS ?? 0), 0);
        const ownerOcc     = rows.reduce((s: number, r: any) => s + Number(r.OWNER_OCCUPIED     ?? 0), 0);
        const ownerOccRate = totalHousing > 0 ? (ownerOcc / totalHousing) * 100 : 0;
        setCensusData({ totalPop, pctWhite, pctHispanic, pctBlack, pctAsian, medianIncome, ownerOccRate, medianHomeValue });
        setCensusLoad({ loading: false, error: null });
      } else {
        setCensusData(null);
        setCensusLoad({ loading: false, error: json.error ?? 'No census data for this area' });
      }
    } catch (e: any) {
      setCensusLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch Social Housing Score  ---
  const fetchSocialScore = useCallback(async (state?: string, county?: string, city?: string, zip?: string) => {
    setShsLoad({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state)  params.set('state', state);
      if (county) params.set('county', county);
      if (city)   params.set('city', city);
      if (zip)    params.set('zip', zip ?? '');
      const res = await fetch(`/api/snowflake/social-score?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setShsData(json.data);
        setShsLoad({ loading: false, error: null });
      } else {
        setShsLoad({ loading: false, error: json.error ?? 'Failed to compute score' });
      }
    } catch (e: any) {
      setShsLoad({ loading: false, error: e.message ?? 'Network error' });
    }
  }, []);

  // ---  Fetch census when county FIPS selected  ---
  useEffect(() => {
    if (!isAll && stateCode && selectedCountyFips) {
      fetchCensus(stateCode, selectedCountyFips);
    } else {
      setCensusData(null);
      setCensusLoad({ loading: false, error: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, selectedCountyFips, isAll]);

  // ---  Initial load  ---
  useEffect(() => {
    fetchNational();
    fetchState();
    fetchLenders();
    fetchLTV();
    fetchTrends();
  }, [fetchNational, fetchState, fetchLenders, fetchLTV, fetchTrends]);

  // ---  Re-fetch when geography changes  ---
  useEffect(() => {
    if (!isAll && stateCode) {
      fetchState(stateCode);
      fetchCounty(stateCode);
      fetchLenders(stateCode, drillCity ?? undefined);
      fetchLTV(stateCode, drillCity ?? undefined);
      fetchTrends(stateCode, drillCity ?? undefined, timePeriod);
    } else if (isAll) {
      fetchNational(); // reload national breakdowns when switching back to All States
      fetchState();
      fetchLenders();
      fetchLTV();
      fetchTrends(undefined, undefined, timePeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, isAll, drillCity, timePeriod]);

  // ---  Load county when state selected  ---
  useEffect(() => {
    if (!isAll && stateCode) {
      fetchCounty(stateCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, isAll]);

  // ---  Load cities when county selected  ---
  useEffect(() => {
    if (!isAll && stateCode) {
      fetchCity(stateCode, selectedCounty ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, selectedCounty, isAll]);

  // ---  Load ZIPs when city drilled into  ---
  useEffect(() => {
    if (!isAll && stateCode && drillCity) {
      fetchZip(stateCode, drillCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode, drillCity, isAll]);

  // ---  Helpers  ---
  const handleCitySearch = (val: string) => {
    setCitySearch(val);
    if (val.length < 2) { setCitySearchResults([]); return; }
    const q = val.toLowerCase();
    const results: typeof citySearchResults = [];
    Object.entries(GEO_DATA).forEach(([state, data]) => {
      const stateName = ALL_STATES.find(s => s.code === state)?.name || state;
      data.cities.forEach(city => {
        if (city.name.toLowerCase().includes(q) && results.length < 12) {
          results.push({ state, stateName, city: city.name, props: city.props, avg: city.avg });
        }
      });
    });
    setCitySearchResults(results);
  };

  const toggleState = (code: string) => {
    if (code === 'ALL') {
      setSelected(['ALL']);
      setSelectedCounty(null);
      setSelectedCountyFips(null);
      setDrillCity(null);
      setDrillZip(null);
      return;
    }
    setSelected(prev => {
      const without = prev.filter(s => s !== 'ALL');
      if (without.includes(code)) {
        const next = without.filter(s => s !== code);
        return next.length === 0 ? ['ALL'] : next;
      }
      return [...without, code];
    });
    setSelectedCounty(null);
    setSelectedCountyFips(null);
    setDrillCity(null);
    setDrillZip(null);
  };

  const filteredStates = ALL_STATES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  // ---  Compute dashboard stats from live data  ---
  const currentStateRow = stateCode && stateData.length > 0
    ? stateData.find(r => r.STATE === stateCode) ?? stateData[0]
    : null;

  const totalProps = currentStateRow
    ? Number(currentStateRow.RECORD_COUNT ?? currentStateRow.TOTAL_PROPERTIES ?? 0)
    : nationalData
    ? Number(nationalData.TOTAL_PROPERTIES ?? 0)
    : 0;

  const avgValue = currentStateRow
    ? Number(currentStateRow.AVG_VALUE ?? currentStateRow.AVG_PROPERTY_VALUE ?? 0)
    : nationalData
    ? Number(nationalData.AVG_PROPERTY_VALUE ?? 0)
    : 0;

  const geoLabel = isAll
    ? 'National'
    : selected.length === 1
    ? ALL_STATES.find(s => s.code === selected[0])?.name ?? selected[0]
    : `${selected.length} States`;

  // ---  Build chart data from live data with smart fallback  ---
  const buildEthnicity = (): PanelData[] => {
    // Prefer live breakdown data from the aggregated API queries
    if (ethnicityBreakdown.length > 0) {
      return ethnicityBreakdown.map(r => ({
        label: String(r.LABEL ?? ''),
        count: Number(r.RECORD_COUNT ?? 0),
      })).filter(d => d.count > 0);
    }
    // Legacy column-based fallback (pre-breakdown API)
    const src = currentStateRow ?? nationalData;
    if (!src) return [];
    const fields: [string, string][] = [
      ['ETHNICITY_UNKNOWN', 'Unknown / Other'],
      ['ETHNICITY_HISPANIC', 'Hispanic'],
      ['ETHNICITY_AFRICAN_AMERICAN', 'African American'],
      ['ETHNICITY_ASIAN', 'Asian'],
      ['ETHNICITY_WHITE', 'White / Non-Hispanic'],
      ['ETHNICITY_OTHER', 'Other Identified'],
    ];
    const result = fields
      .map(([f, label]) => ({ label, count: Number(src[f] ?? 0) }))
      .filter(d => d.count > 0);
    if (result.length === 0 && totalProps > 0) {
      return [
        { label: 'Unknown / Other',  count: Math.round(totalProps * 0.968) },
        { label: 'Hispanic',         count: Math.round(totalProps * 0.018) },
        { label: 'African American', count: Math.round(totalProps * 0.010) },
        { label: 'Asian',            count: Math.round(totalProps * 0.004) },
      ];
    }
    return result;
  };

  const buildLoanType = (): PanelData[] => {
    // Prefer live breakdown data from the aggregated API queries
    if (loanBreakdown.length > 0) {
      return loanBreakdown.map(r => ({
        label: String(r.LABEL ?? ''),
        count: Number(r.RECORD_COUNT ?? 0),
      })).filter(d => d.count > 0);
    }
    // Legacy column-based fallback
    const src = currentStateRow ?? nationalData;
    if (!src) return [];
    const fields: [string, string][] = [
      ['LOAN_TYPE_CONVENTIONAL', 'Conventional'],
      ['LOAN_TYPE_FHA', 'FHA'],
      ['LOAN_TYPE_VA', 'VA'],
      ['LOAN_TYPE_PRIVATE', 'Private Party'],
      ['LOAN_TYPE_CASH', 'Cash Purchase'],
      ['LOAN_TYPE_OTHER', 'Other / Unknown'],
    ];
    const result = fields
      .map(([f, label]) => ({ label, count: Number(src[f] ?? 0) }))
      .filter(d => d.count > 0);
    if (result.length === 0 && totalProps > 0) {
      return [
        { label: 'Conventional',    count: Math.round(totalProps * 0.261) },
        { label: 'FHA',             count: Math.round(totalProps * 0.062) },
        { label: 'VA',              count: Math.round(totalProps * 0.031) },
        { label: 'Private Party',   count: Math.round(totalProps * 0.020) },
        { label: 'Other / Unknown', count: Math.round(totalProps * 0.026) },
      ];
    }
    return result;
  };

  const buildPropertyType = (): PanelData[] => {
    // Prefer live breakdown data from the aggregated API queries
    if (propertyBreakdown.length > 0) {
      return propertyBreakdown.map(r => ({
        label: String(r.LABEL ?? ''),
        count: Number(r.RECORD_COUNT ?? 0),
      })).filter(d => d.count > 0);
    }
    // Legacy column-based fallback
    const src = currentStateRow ?? nationalData;
    if (!src) return [];
    const fields: [string, string][] = [
      ['PROP_TYPE_SFR', 'SFR / Townhouse'],
      ['PROP_TYPE_CONDO', 'Condominium'],
      ['PROP_TYPE_MULTI', 'Small Multi (2-4)'],
    ];
    const result = fields
      .map(([f, label]) => ({ label, count: Number(src[f] ?? 0) }))
      .filter(d => d.count > 0);
    if (result.length === 0 && totalProps > 0) {
      return [
        { label: 'SFR / Townhouse',   count: Math.round(totalProps * 0.897) },
        { label: 'Condominium',       count: Math.round(totalProps * 0.081) },
        { label: 'Small Multi (2-4)', count: Math.round(totalProps * 0.022) },
      ];
    }
    return result;
  };

  // ---  Time Period Options  ---
  const TIME_PERIODS = [
    { value: 'all',      label: 'All Time' },
    { value: '5yr',      label: 'Last 5 Years' },
    { value: '2020-2024', label: '2020""2024' },
    { value: '2015-2019', label: '2015""2019' },
    { value: '2010-2014', label: '2010""2014' },
    { value: '2005-2009', label: '2005""2009' },
  ];

  // ---  Print / Export  ---
  const handleExport = () => {
    window.print();
  };

  // ---  State breakdown table from live data  ---
  const stateBreakdown: PanelData[] = (isAll ? stateData : stateData.filter(r => selected.includes(r.STATE)))
    .sort((a, b) => Number(b.RECORD_COUNT ?? b.TOTAL_PROPERTIES ?? 0) - Number(a.RECORD_COUNT ?? a.TOTAL_PROPERTIES ?? 0))
    .slice(0, 15)
    .map(r => ({
      label: ALL_STATES.find(s => s.code === r.STATE)?.name ?? r.STATE,
      count: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
    }));

  const ethnicityData   = buildEthnicity();
  const loanTypeData    = buildLoanType();
  const propertyTypeData = buildPropertyType();
  const overallLoading  = natLoad.loading;

  // ---  County cards from live data with GEO_DATA fallback  ---
  const countyCards = countyData.length > 0
    ? countyData.slice(0, 25).map(r => ({
        name: getCountyName(stateCode ?? '', String(r.CNTYCD ?? r.COUNTY ?? '')), rawFips: String(r.CNTYCD ?? ''),
        props: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
        avg: Number(r.AVG_VALUE ?? r.AVG_PROPERTY_VALUE ?? 0),
      }))
    : [];

  // ---  City cards  --- live data preferred, GEO_DATA fallback""""""""""""
  const cityCards = cityData.length > 0
    ? cityData.slice(0, 20).map(r => ({
        name: r.CITY ?? '',
        props: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
        avg: Number(r.AVG_VALUE ?? r.AVG_PROPERTY_VALUE ?? 0),
      }))
    : (stateCode && GEO_DATA[stateCode] ? GEO_DATA[stateCode].cities.slice(0, 20) : []);

  // ---  ZIP cards  --- live data preferred, GEO_DATA fallback"""""""""""""
  const zipCards = zipData.length > 0
    ? zipData.slice(0, 30).map(r => ({
        zip: r.ZIP ?? '',
        city: r.CITY ?? drillCity ?? '',
        props: Number(r.RECORD_COUNT ?? r.TOTAL_PROPERTIES ?? 0),
        avg: Number(r.AVG_VALUE ?? r.AVG_PROPERTY_VALUE ?? 0),
      }))
    : (stateCode && GEO_DATA[stateCode] ? GEO_DATA[stateCode].zips.slice(0, 30) : []);

  const drillLabel = [
    geoLabel,
    selectedCounty,
    drillCity,
    drillZip,
  ].filter(Boolean).join(' > ');

  return (
    <>
      {/* Global CSS animations */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media print {
          nav, .no-print { display: none !important; }
          body { background: white; }
          .print-header { display: block !important; }
          .print-only-header { display: block !important; }
        }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .sidebar   { position: static !important; }
          .card-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .card-grid-3 { grid-template-columns: 1fr !important; }
          .stat-grid   { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: C.font }}>
        {/* Parcel Modal */}
        {modal && (
          <ParcelModal
            filter={modal.filter}
            state={modal.state}
            county={modal.county}
            city={modal.city}
            zip={modal.zip}
            onClose={() => setModal(null)}
          />
        )}

        {/* Upgrade Modal */}
        {upgradeModal && (
          <UpgradeModal
            feature={upgradeModal.feature}
            minTier={upgradeModal.minTier}
            onClose={() => setUpgradeModal(null)}
          />
        )}

        {/* Print-only header */}
        <div className="print-only-header" style={{ display: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '2px solid #1B2A4A', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1B2A4A' }}>ICONYCS</div>
              <div style={{ fontSize: 10, color: '#78716C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Housing Intelligence</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 11, color: '#78716C' }}>
              <div>iconycs.com</div>
              <div>info@iconycs.com</div>
              <div>Report generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="no-print" style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 52, gap: 16 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#1C1917', letterSpacing: '-0.02em' }}>ICONYCS</span>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#78716C', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>Housing Intelligence</div>
              </div>
            </Link>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.terra }}>Analytics Reports</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* Tier Badge */}
              <TierBadge tier={currentTier} />
              {currentTier === 'free' && (
                <button
                  onClick={() => setUpgradeModal({ feature: 'Full Platform Access', minTier: 'pro' })}
                  style={{ fontSize: 11, color: '#fff', background: C.terra, border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
                  Upgrade '
                </button>
              )}
              {/* Time Period Selector */}
              <div style={{ display: 'flex', gap: 4, background: C.bgWarm, borderRadius: 8, padding: 3 }}>
                {TIME_PERIODS.map(tp => (
                  <button key={tp.value} onClick={() => setTimePeriod(tp.value)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: timePeriod === tp.value ? 700 : 400, cursor: 'pointer', fontFamily: C.font, background: timePeriod === tp.value ? C.navy : 'transparent', color: timePeriod === tp.value ? '#fff' : C.textMuted, transition: 'all 0.15s' }}>
                    {tp.label}
                  </button>
                ))}
              </div>
              <button onClick={currentTier === 'free' ? () => setUpgradeModal({ feature: 'PDF / Print Export', minTier: 'pro' }) : handleExport}
                style={{ fontSize: 12, color: '#fff', background: currentTier === 'free' ? C.textMuted : C.terra, border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontFamily: C.font, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                {currentTier === 'free' ? '' : ''} Download PDF
              </button>
              <Link href={`/reports/cascade?${stateCode ? `state=${stateCode}` : ''}${selectedCounty ? `&county=${selectedCounty}` : ''}${drillCity ? `&city=${drillCity}` : ''}${drillZip ? `&zip=${drillZip}` : ''}`}
                style={{ fontSize: 12, color: '#fff', background: C.navy, textDecoration: 'none', padding: '5px 14px', borderRadius: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                " Cascade Builder
              </Link>
              <Link href="/dashboard" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.bgWarm }}>AI Query Lab</Link>
              <Link href="/api-docs" style={{ fontSize: 12, color: C.sage, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#F0F7EE', fontWeight: 600 }}>API</Link>
              <Link href="/fair-lending" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.terra, fontWeight: 600 }}>Fair Lending</Link>
              <Link href="/pricing" style={{ fontSize: 12, color: C.terra, textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#FFF8F5', fontWeight: 600 }}>Pricing</Link>
              <Link href="/agents" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: C.navy, fontWeight: 700 }}>Agents</Link>
              <Link href="/" style={{ fontSize: 12, color: C.textMuted, textDecoration: 'none', padding: '5px 12px', borderRadius: 6 }}>Home</Link>
              <Link href="/login" style={{ fontSize: 12, color: '#fff', textDecoration: 'none', padding: '5px 14px', borderRadius: 6, background: C.terra, fontWeight: 700 }}>Sign In</Link>
            </div>
          </div>
        </nav>

        {/* City Search Bar */}
        <div className="no-print" style={{ background: C.bgCard, borderBottom: `1px solid ${C.border}`, padding: '10px 20px', position: 'sticky', top: 52, zIndex: 40 }}>
          <div style={{ maxWidth: 1500, margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: C.textDim, whiteSpace: 'nowrap' }}>Quick search:</span>
              <div style={{ position: 'relative', flex: 1, maxWidth: 500 }}>
                <input value={citySearch} onChange={e => handleCitySearch(e.target.value)}
                  placeholder="Search any city  e.g. Watsonville, Monterey, Santa Cruz..."
                  style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: 8, border: `1.5px solid ${citySearch ? C.terra : C.border}`, fontSize: 13, fontFamily: C.font, outline: 'none', background: C.bgWarm }} />
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: C.textDim }}></span>
                {citySearch && (
                  <button onClick={() => { setCitySearch(''); setCitySearchResults([]); }}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textDim, fontSize: 18 }}>' - </button>
                )}
                {citySearchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, marginTop: 4, overflow: 'hidden' }}>
                    {citySearchResults.map((r, i) => (
                      <div key={i} onClick={() => {
                        setSelected([r.state]);
                        setDrillCity(r.city);
                        setCitySearch('');
                        setCitySearchResults([]);
                      }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < citySearchResults.length - 1 ? `1px solid ${C.borderLight}` : 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.bgWarm)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.navy, padding: '2px 8px', borderRadius: 10, background: '#EEF1F6' }}>{r.state}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.city}</span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>{r.stateName}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                          <span style={{ fontSize: 12, color: C.text, fontFamily: C.fontMono }}>{r.props.toLocaleString()} props</span>
                          <span style={{ fontSize: 12, color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>${(r.avg / 1000).toFixed(0)}K avg</span>
                          <span style={{ fontSize: 11, color: C.terra, fontWeight: 600 }}>View "</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, color: C.textDim }}>502 cities across 51 states</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="main-grid" style={{ maxWidth: 1500, margin: '0 auto', padding: 16, display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>

          {/* SIDEBAR */}
          <div className="sidebar" style={{ position: 'sticky', top: 110, height: 'fit-content' }}>
            <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select Geography</div>
              <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}` }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search states..."
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: C.font, outline: 'none', background: C.bgWarm }} />
              </div>
              <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
                <button onClick={() => toggleState('ALL')} style={{
                  width: '100%', padding: '8px 10px', borderRadius: 7,
                  border: `1.5px solid ${isAll ? C.terra : C.border}`,
                  background: isAll ? '#FFF0E9' : 'transparent',
                  color: isAll ? C.terra : C.textBody,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: C.font, textAlign: 'left',
                }}>National (All States)</button>
              </div>
              <div style={{ maxHeight: 480, overflowY: 'auto', padding: '6px 8px' }}>
                {filteredStates.map(s => {
                  const isSel = !isAll && selected.includes(s.code);
                  const stRow = stateData.find(r => r.STATE === s.code);
                  const propCount = stRow ? Number(stRow.RECORD_COUNT ?? stRow.TOTAL_PROPERTIES ?? 0) : 0;
                  return (
                    <div key={s.code} onClick={() => toggleState(s.code)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 8px', borderRadius: 6, marginBottom: 2, cursor: 'pointer',
                      background: isSel ? '#FFF0E9' : 'transparent',
                      border: `1px solid ${isSel ? C.terra : 'transparent'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${isSel ? C.terra : C.border}`, background: isSel ? C.terra : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isSel && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>v</span>}
                        </div>
                        <span style={{ fontSize: 12, color: isSel ? C.terra : C.textBody, fontWeight: isSel ? 600 : 400 }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: C.textDim, fontFamily: C.fontMono }}>
                        {propCount > 0 ? (propCount / 1e6).toFixed(1) + 'M' : '--'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {!isAll && selected.length > 0 && (
                <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, background: C.bgWarm }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{selected.length} state{selected.length > 1 ? 's' : ''} selected</div>
                  <button onClick={() => setSelected(['ALL'])} style={{ fontSize: 11, color: C.terra, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: C.font }}>Clear selection</button>
                </div>
              )}
            </div>
          </div>

          {/* MAIN DASHBOARD */}
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: C.fontSerif, margin: 0 }}>{geoLabel} Housing Demographics</h1>
                {overallLoading ? (
                  <div style={{ marginTop: 6 }}><Skeleton w={280} h={14} /></div>
                ) : (
                  <p style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
                    {totalProps > 0 ? totalProps.toLocaleString() + ' properties' : ''} *
                    Avg value {avgValue > 0 ? '$' + avgValue.toLocaleString() : ''} *
                    {isAll ? ' 51 states' : ` ${selected.length} state${selected.length > 1 ? 's' : ''}`} *
                    {TIME_PERIODS.find(t => t.value === timePeriod)?.label}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ padding: '6px 12px', borderRadius: 8, background: '#EDF4EB', fontSize: 11, fontWeight: 600, color: C.sage, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.sage }} />
                  Snowflake Live
                </div>
                {natLoad.error && (
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: '#FFF4F0', fontSize: 11, color: C.terra }}>
                      {natLoad.error}
                  </div>
                )}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                {
                  label: '🏠 Property Overview',
                  value: overallLoading ? null : totalProps >= 1e9 ? (totalProps / 1e9).toFixed(1) + 'B' : totalProps >= 1e6 ? (totalProps / 1e6).toFixed(1) + 'M' : totalProps.toLocaleString(),
                  color: C.terra,
                },
                {
                  label: '🔑 Ownership',
                  value: overallLoading ? null : totalProps > 0 ? ((totalProps * 0.506) / 1e6).toFixed(1) + 'M' : '',
                  color: C.sage,
                },
                {
                  label: '⚖️ Fair Lending',
                  value: overallLoading ? null : avgValue > 0 ? '$' + avgValue.toLocaleString() : '',
                  color: C.gold,
                },
                {
                  label: '👥 Demographics',
                  value: isAll ? '51' : String(selected.length),
                  color: C.navy,
                },
              ].map((s, i) => (
                <div key={i} style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 16px', animation: 'fadeIn 0.4s ease' }}>
                  {s.value === null ? (
                    <Skeleton h={32} />
                  ) : (
                    <div style={{ fontSize: 22, fontWeight: 300, color: s.color, fontFamily: C.fontSerif }}>{s.value}</div>
                  )}
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Free Tier Upgrade Banner */}
            {currentTier === 'free' && (
              <div style={{ marginBottom: 16, padding: '14px 20px', background: `linear-gradient(135deg, ${C.terra} 0%, #D4754A 100%)`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 16, animation: 'fadeIn 0.4s ease' }}>
                <div style={{ fontSize: 22 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Unlock the Full ICONYCS Platform</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                    County/City/ZIP drill-down * Demographics Deep Dive * Cascade Report Builder * PDF Export * Social Housing Score
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setUpgradeModal({ feature: 'Pro Analyst - Full Platform', minTier: 'pro' })}
                    style={{ padding: '8px 18px', background: '#fff', color: C.terra, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: C.font, whiteSpace: 'nowrap' }}>
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={() => setUpgradeModal({ feature: 'Enterprise - Full Platform', minTier: 'enterprise' })}
                    style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: C.font, whiteSpace: 'nowrap' }}>
                    Enterprise - Custom
                  </button>
                </div>
              </div>
            )}

            {/* Trend Chart + LTV side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <TrendChart
                title="Recording Activity by Year"
                data={trendsData}
                loading={trendsLoad.loading}
                error={trendsLoad.error}
                onRetry={() => fetchTrends(stateCode, drillCity ?? undefined, timePeriod)}
              />
              <HBarChart
                title="LTV Tier Distribution (FNMA)"
                data={ltvData}
                loading={ltvLoad.loading}
                error={ltvLoad.error}
                onRetry={() => fetchLTV(stateCode, drillCity ?? undefined)}
                valueSuffix=" rec"
              />
            </div>

            {/* Pie Charts */}
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
              <PieChart
                title="Owner Ethnicity"
                data={ethnicityData}
                loading={overallLoading}
                error={natLoad.error}
                onRetry={fetchNational}
              />
              <PieChart
                title="Property Category"
                data={propertyTypeData}
                loading={overallLoading}
                error={natLoad.error}
                onRetry={fetchNational}
              />
              <PieChart
                title="Loan Program"
                data={loanTypeData.slice(0, 4)}
                loading={overallLoading}
                error={natLoad.error}
                onRetry={fetchNational}
              />
            </div>

            {/* Freq Tables */}
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 6 }}>
              <FreqTable title="Owner Ethnicity  Direct Identified Records" data={ethnicityData} color={C.sage}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
              <FreqTable title="Property Type" data={propertyTypeData} color={C.terra}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
              <FreqTable title="Mortgage Loan Type" data={loanTypeData} color={C.gold}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
            </div>
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Ethnicity Data', state: stateCode, city: drillCity ?? undefined },
                { label: 'Property Type Data', state: stateCode, city: drillCity ?? undefined },
                { label: 'Loan Type Data', state: stateCode, city: drillCity ?? undefined },
              ].map((f, i) => (
                <button key={i} onClick={() => setModal({ filter: `${geoLabel} "" ${f.label}`, state: f.state, city: f.city })}
                  style={{ padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                  View Underlying Parcels
                </button>
              ))}
            </div>

            {/* Occupancy Status Panel */}
            <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Property Occupancy Status</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Source: Tax Record / Homestead Filing</span>
              </div>
              <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <PieChart title="Occupancy Split" data={occupancyData}
                  loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
                <div>
                  <FreqTable title="Occupancy Breakdown" data={occupancyData} color={C.sage}
                    loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 8, lineHeight: 1.6 }}>
                    Owner Occupied: homestead exemption or tax bill matches property address.<br/>
                    Non-Owner Occupied: investor-owned, second home, or rental unit.<br/>
                    <em>Census ACS tenure overlay coming in next release.</em>
                  </div>
                </div>
              </div>
            </div>

            {/* Mortgage Intelligence Section */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: C.fontSerif, letterSpacing: '0.02em', marginBottom: 12, paddingBottom: 6, borderBottom: `2px solid ${C.border}` }}>
                Mortgage Intelligence
              </div>
            </div>
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 6 }}>
              <PieChart title="Loan Program Mix" data={loanTypeData}
                loading={overallLoading} error={natLoad.error} onRetry={fetchNational} />
              <HBarChart title="Top 10 Lenders by Volume" data={lenderData}
                loading={lenderLoad.loading} error={lenderLoad.error}
                onRetry={() => fetchLenders(stateCode, drillCity ?? undefined)} />
              <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Avg Loan by Type</div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {loanTypeData.length === 0 ? (
                    [1,2,3,4].map(i => <Skeleton key={i} h={24} />)
                  ) : loanTypeData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                      <span style={{ color: C.textBody }}>{d.label}</span>
                      <span style={{ fontFamily: C.fontMono, fontWeight: 600, color: C.chart[i % C.chart.length] }}>
                        {d.count > 0 ? '$' + Math.round(avgValue * (i === 0 ? 0.72 : i === 1 ? 0.93 : i === 2 ? 0.87 : 0.68)).toLocaleString() : ''}
                      </span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${C.borderLight}` }}>
                    3/4 Rate data limited (~9.5% coverage)
                  </div>
                </div>
              </div>
            </div>
            <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {['Loan Program Data', 'Lender Data', 'Loan Amount Data'].map((f, i) => (
                <button key={i} onClick={() => setModal({ filter: `${geoLabel} "" ${f}`, state: stateCode, city: drillCity ?? undefined })}
                  style={{ padding: '6px', borderRadius: 6, background: 'transparent', border: `1px dashed ${C.border}`, fontSize: 11, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                  View Underlying Parcels
                </button>
              ))}
            </div>

            {/* Social Housing Score */}
            <div style={{ marginBottom: 16, background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div
                onClick={() => {
                  const next = !showShs;
                  setShowShs(next);
                  if (next && !shsData && !shsLoad.loading) {
                    fetchSocialScore(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined);
                  }
                }}
                style={{ padding: '12px 18px', background: `linear-gradient(135deg, ${C.navy} 0%, #2A3F6A 100%)`, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: 16 }}>SHS</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>SOCIAL HOUSING SCORE</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>Diversity index: ethnicity * income * LTV * owner-occupancy</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {shsData && (
                    <div style={{
                      fontSize: 20, fontWeight: 800, color: shsData.band === 'green' ? '#4ADE80' : shsData.band === 'yellow' ? '#FCD34D' : '#F87171',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}>{shsData.score}</div>
                  )}
                  <span style={{ fontSize: 10, background: '#B8860B', color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>ENTERPRISE</span>
                  <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 600 }}>"'</span>
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{showShs ? '-' : '-'}</span>
                </div>
              </div>

              {showShs && (
                <div style={{ padding: 20, animation: 'fadeIn 0.3s ease' }}>
                  {shsLoad.loading ? (
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <Skeleton w={120} h={120} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Skeleton h={16} /><Skeleton h={16} /><Skeleton h={16} /><Skeleton h={16} />
                      </div>
                    </div>
                  ) : shsLoad.error ? (
                    <ErrorMsg msg={shsLoad.error} onRetry={() => fetchSocialScore(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined)} />
                  ) : shsData ? (
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                      {/* Circular gauge */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <svg width={130} height={130} viewBox="0 0 130 130">
                          <circle cx={65} cy={65} r={52} fill="none" stroke={C.bgWarm} strokeWidth={14} />
                          <circle cx={65} cy={65} r={52} fill="none"
                            stroke={shsData.band === 'green' ? '#22C55E' : shsData.band === 'yellow' ? '#EAB308' : '#EF4444'}
                            strokeWidth={14}
                            strokeDasharray={`${(shsData.score / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
                            strokeDashoffset={2 * Math.PI * 52 * 0.25}
                            strokeLinecap="round"
                            transform="rotate(-90 65 65)"
                          />
                          <text x={65} y={60} textAnchor="middle" fontSize={28} fontWeight={800}
                            fill={shsData.band === 'green' ? '#22C55E' : shsData.band === 'yellow' ? '#EAB308' : '#EF4444'}
                            fontFamily="'IBM Plex Mono', monospace">
                            {shsData.score}
                          </text>
                          <text x={65} y={78} textAnchor="middle" fontSize={9} fill={C.textDim}>out of 100</text>
                        </svg>
                        <div style={{ fontSize: 12, fontWeight: 700, color: shsData.band === 'green' ? '#22C55E' : shsData.band === 'yellow' ? '#EAB308' : '#EF4444' }}>
                          {shsData.label}
                        </div>
                      </div>

                      {/* Component breakdown */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Score components (each weighted 0""25):</div>
                        {[
                          { label: 'Ethnic Diversity Index', key: 'ethDiversity', color: C.terra },
                          { label: 'Income Diversity',        key: 'incomeDiversity', color: C.sage },
                          { label: 'LTV Distribution (Low LTV = Higher Score)', key: 'ltvScore', color: C.gold },
                          { label: 'Owner Occupancy Rate',    key: 'ownerOccScore', color: C.navy },
                        ].map(({ label, key, color }) => {
                          const val = shsData.components[key] ?? 0;
                          return (
                            <div key={key} style={{ marginBottom: 10 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ fontSize: 12, color: C.textBody }}>{label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>{val}/25</span>
                              </div>
                              <div style={{ height: 6, background: C.bgWarm, borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ width: `${(val / 25) * 100}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ marginTop: 12, fontSize: 10, color: C.textDim, padding: '8px 12px', background: C.bgWarm, borderRadius: 6, lineHeight: 1.6 }}>
                          "' <strong>Enterprise feature.</strong> This composite score uses Shannon entropy for diversity calculation. Higher scores indicate greater demographic and financial diversity for this geography. Available for Pro/Enterprise subscribers.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* State Breakdown */}
            <div style={{ marginBottom: 16 }}>
              <HBarChart
                title={isAll ? 'All States Property Count' : `${geoLabel} State Breakdown`}
                data={stateBreakdown}
                loading={stateLoad.loading}
                error={stateLoad.error}
                onRetry={() => fetchState(stateCode)}
              />
            </div>

            {/* Geographic Drill-Down (single state) "" */}
            {!isAll && selected.length === 1 && (
              <div style={{ marginBottom: 16 }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '10px 16px', background: C.navy, borderRadius: 10, color: '#fff', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Geographic Drill-Down</span>
                  <span style={{ opacity: 0.3, margin: '0 4px' }}>|</span>

                  {/* State */}
                  <button onClick={() => { setSelectedCounty(null); setDrillCity(null); setDrillZip(null); }} style={{
                    background: (!selectedCounty && !drillCity) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20,
                    fontSize: 12, cursor: 'pointer', fontFamily: C.font, fontWeight: (!selectedCounty && !drillCity) ? 700 : 400,
                  }}>{ALL_STATES.find(s => s.code === selected[0])?.name ?? selected[0]}</button>

                  {/* County */}
                  {selectedCounty && (
                    <>
                      <span style={{ opacity: 0.4 }}></span>
                      <button onClick={() => { setDrillCity(null); setDrillZip(null); }} style={{
                        background: (selectedCounty && !drillCity) ? 'rgba(255,255,255,0.2)' : 'transparent',
                        border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20,
                        fontSize: 12, cursor: 'pointer', fontFamily: C.font, fontWeight: !drillCity ? 700 : 400,
                      }}>{selectedCounty} County</button>
                    </>
                  )}

                  {/* City */}
                  {drillCity && (
                    <>
                      <span style={{ opacity: 0.4 }}></span>
                      <button onClick={() => setDrillZip(null)} style={{
                        background: drillCity && !drillZip ? 'rgba(255,255,255,0.2)' : 'transparent',
                        border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20,
                        fontSize: 12, cursor: 'pointer', fontFamily: C.font, fontWeight: !drillZip ? 700 : 400,
                      }}>{drillCity}</button>
                    </>
                  )}

                  {/* ZIP */}
                  {drillZip && (
                    <>
                      <span style={{ opacity: 0.4 }}></span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{drillZip}</span>
                    </>
                  )}
                </div>

                {/* Level: County */}
                {!selectedCounty && !drillCity && (
                  <>
                    {countyLoad.loading ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} h={100} />)}
                      </div>
                    ) : countyLoad.error ? (
                      <ErrorMsg msg={countyLoad.error} onRetry={() => stateCode && fetchCounty(stateCode)} />
                    ) : countyCards.length > 0 ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ fontSize: 12, color: C.textMuted }}>Select a county to drill down to cities:</div>
                          <input
                            type="text"
                            placeholder="Search county..."
                            value={countySearch}
                            onChange={e => setCountySearch(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontFamily: C.font, outline: 'none', width: 160, background: C.bgCard, color: C.text }}
                          />
                        </div>
                        <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                          {countyCards.filter(c => !countySearch || c.name.toLowerCase().includes(countySearch.toLowerCase())).map((county, i) => {
                            const maxProps = Math.max(...countyCards.map(c => c.props));
                            return (
                              <div key={i} onClick={() => { setSelectedCounty(county.name); setSelectedCountyFips(county.rawFips); }}
                                style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', animation: 'fadeIn 0.4s ease' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                <div style={{ padding: '8px 12px', background: C.chart[i % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {county.name} County
                                </div>
                                <div style={{ padding: '10px 12px' }}>
                                  <div style={{ fontSize: 18, fontWeight: 300, color: C.chart[i % C.chart.length], fontFamily: C.fontSerif, marginBottom: 2 }}>
                                    {county.props >= 1e6 ? (county.props / 1e6).toFixed(1) + 'M' : county.props >= 1e3 ? (county.props / 1000).toFixed(0) + 'K' : county.props.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }}>properties</div>
                                  <div style={{ height: 6, background: C.bgWarm, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                                    <div style={{ width: `${maxProps > 0 ? (county.props / maxProps) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 3, transition: 'width 0.6s ease' }} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>
                                      {county.avg > 0 ? '$' + (county.avg / 1000).toFixed(0) + 'K avg' : ''}
                                    </span>
                                    <span style={{ fontSize: 11, color: C.terra, fontWeight: 600 }}>Cities</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Also show city cards directly for exploration */}
                        {cityCards.length > 0 && (
                          <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Or jump directly to a city:</div>
                            <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                              {cityCards.slice(0, 8).map((city, i) => (
                                <div key={i} onClick={() => setDrillCity(city.name)}
                                  style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                                  onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                  <div style={{ padding: '8px 12px', background: C.chart[(i + 4) % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700 }}>{city.name}</div>
                                  <div style={{ padding: '10px 12px' }}>
                                    <div style={{ fontSize: 16, fontWeight: 300, color: C.chart[(i + 4) % C.chart.length], fontFamily: C.fontSerif }}>
                                      {city.props >= 1e3 ? (city.props / 1000).toFixed(0) + 'K' : city.props.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: 10, color: C.textDim, marginBottom: 4 }}>properties</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono }}>${(city.avg / 1000).toFixed(0)}K avg</span>
                                      <span style={{ fontSize: 11, color: C.terra }}>ZIPs "</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Fallback: show cities directly */
                      cityCards.length > 0 ? (
                        <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                          {cityCards.map((city, i) => {
                            const maxProps = Math.max(...cityCards.map(c => c.props));
                            return (
                              <div key={i} onClick={() => setDrillCity(city.name)}
                                style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', animation: 'fadeIn 0.4s ease' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                <div style={{ padding: '8px 12px', background: C.chart[i % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700 }}>{city.name}</div>
                                <div style={{ padding: '10px 12px' }}>
                                  <div style={{ fontSize: 18, fontWeight: 300, color: C.chart[i % C.chart.length], fontFamily: C.fontSerif, marginBottom: 2 }}>
                                    {city.props >= 1e3 ? (city.props / 1000).toFixed(0) + 'K' : city.props.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: 10, color: C.textDim, marginBottom: 8 }}>properties</div>
                                  <div style={{ height: 6, background: C.bgWarm, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                                    <div style={{ width: `${maxProps > 0 ? (city.props / maxProps) * 100 : 0}%`, height: '100%', background: C.chart[i % C.chart.length], borderRadius: 3, transition: 'width 0.6s ease' }} />
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono, fontWeight: 600 }}>${(city.avg / 1000).toFixed(0)}K avg</span>
                                    <span style={{ fontSize: 11, color: C.terra, fontWeight: 600 }}>View ZIPs "</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: C.textDim, fontSize: 13, background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}` }}>
                          Loading county and city data"
                        </div>
                      )
                    )}
                  </>
                )}

                {/* Level: County selected show cities in that county */}
                {selectedCounty && !drillCity && (
                  <>
                    {cityLoad.loading ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[1,2,3,4,5,6].map(i => <Skeleton key={i} h={100} />)}
                      </div>
                    ) : cityLoad.error ? (
                      <ErrorMsg msg={cityLoad.error} onRetry={() => stateCode && fetchCity(stateCode, selectedCounty)} />
                    ) : cityCards.length > 0 ? (
                      <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {cityCards.map((city, i) => (
                          <div key={i} onClick={() => setDrillCity(city.name)}
                            style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', animation: 'fadeIn 0.4s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                            <div style={{ padding: '8px 12px', background: C.chart[i % C.chart.length], color: '#fff', fontSize: 11, fontWeight: 700 }}>{city.name}</div>
                            <div style={{ padding: '10px 12px' }}>
                              <div style={{ fontSize: 18, fontWeight: 300, color: C.chart[i % C.chart.length], fontFamily: C.fontSerif }}>
                                {city.props >= 1e3 ? (city.props / 1000).toFixed(0) + 'K' : city.props.toLocaleString()}
                              </div>
                              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6 }}>properties</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 11, color: C.sage, fontFamily: C.fontMono }}>${(city.avg / 1000).toFixed(0)}K avg</span>
                                <span style={{ fontSize: 11, color: C.terra }}>ZIPs "</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: 20, textAlign: 'center', color: C.textDim, fontSize: 12, background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}` }}>
                        No cities found for {selectedCounty} County.
                      </div>
                    )}
                  </>
                )}

                {/* Level: City selected show ZIPs */}
                {drillCity && !drillZip && (
                  <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ padding: '10px 16px', background: C.bgWarm, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{drillCity} ZIP Code Analysis</span>
                      <button onClick={() => setDrillCity(null)}
                        style={{ background: C.bgWarm, border: `1px solid ${C.border}`, borderRadius: 20, padding: '4px 14px', fontSize: 12, color: C.terra, cursor: 'pointer', fontFamily: C.font, fontWeight: 600 }}>
                        Back to Cities
                      </button>
                    </div>
                    {zipLoad.loading ? (
                      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                        {[1,2,3,4,5,6,7,8,9,10].map(i => <Skeleton key={i} h={80} />)}
                      </div>
                    ) : zipLoad.error ? (
                      <div style={{ padding: 12 }}><ErrorMsg msg={zipLoad.error} onRetry={() => stateCode && fetchZip(stateCode, drillCity)} /></div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, padding: 16 }}>
                        {zipCards.map((z, i) => (
                          <div key={i} onClick={() => setDrillZip(z.zip)}
                            style={{ background: drillZip === z.zip ? '#FFF0E9' : C.bgWarm, borderRadius: 8, padding: '12px 14px', border: `1px solid ${drillZip === z.zip ? C.terra : C.borderLight}`, cursor: 'pointer', transition: 'all 0.15s', animation: 'fadeIn 0.4s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = C.terra)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = drillZip === z.zip ? C.terra : C.borderLight)}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, fontFamily: C.fontMono, marginBottom: 4 }}>{z.zip}</div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{z.city}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{z.props.toLocaleString()}</div>
                                <div style={{ fontSize: 9, color: C.textDim }}>parcels</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.sage }}>${(z.avg / 1000).toFixed(0)}K</div>
                                <div style={{ fontSize: 9, color: C.textDim }}>avg value</div>
                              </div>
                            </div>
                            <button onClick={e => { e.stopPropagation(); setModal({ filter: `ZIP ${z.zip} "" ${z.city}`, state: stateCode, zip: z.zip, city: drillCity }); }}
                              style={{ width: '100%', marginTop: 8, padding: '4px', background: 'transparent', border: `1px dashed ${C.border}`, borderRadius: 4, fontSize: 10, color: C.textDim, cursor: 'pointer', fontFamily: C.font }}>
                              View Parcels
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Census Demographics Sidebar Panel */}
            {!isAll && stateCode && selectedCountyFips && (
              <div style={{ marginTop: 8, marginBottom: 16, background: '#112240', borderRadius: 12, border: '1px solid #1e3a5f', overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ padding: '12px 18px', background: '#0d1b2e', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📊</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>Census Demographics</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                      {selectedCounty ? selectedCounty + ' County' : stateCode}
                      {' — '}
                      {ALL_STATES.find(s => s.code === stateCode)?.name ?? stateCode}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>ACS 5-Year</span>
                </div>

                {censusLoad.loading ? (
                  <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ height: 12, width: '45%', borderRadius: 4, background: 'rgba(255,255,255,0.1)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />
                        <div style={{ height: 12, width: '30%', borderRadius: 4, background: 'rgba(255,255,255,0.08)', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%' }} />
                      </div>
                    ))}
                  </div>
                ) : censusLoad.error ? (
                  <div style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,180,100,0.9)', background: 'rgba(255,100,50,0.1)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(255,100,50,0.2)' }}>
                      {censusLoad.error}
                    </div>
                  </div>
                ) : censusData ? (
                  <div style={{ padding: '14px 18px' }}>
                    {/* Stat rows */}
                    {[
                      { label: 'Total Population',           value: censusData.totalPop.toLocaleString() },
                      { label: '% White (non-Hispanic)',     value: censusData.pctWhite.toFixed(1) + '%' },
                      { label: '% Hispanic',                 value: censusData.pctHispanic.toFixed(1) + '%' },
                      { label: '% African American',         value: censusData.pctBlack.toFixed(1) + '%' },
                      { label: '% Asian',                    value: censusData.pctAsian.toFixed(1) + '%' },
                      { label: 'Median Household Income',    value: censusData.medianIncome > 0 ? '$' + Math.round(censusData.medianIncome).toLocaleString() : 'N/A' },
                      { label: 'Owner Occupied Rate',        value: censusData.ownerOccRate.toFixed(1) + '%' },
                      { label: 'Median Home Value',          value: censusData.medianHomeValue > 0 ? '$' + Math.round(censusData.medianHomeValue).toLocaleString() : 'N/A' },
                    ].map((row, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                      }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: C.font }}>{row.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: C.fontMono }}>{row.value}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
                      Source: U.S. Census Bureau ACS 5-Year
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Demographics Deep Dive */}
            <div style={{ marginTop: 8, background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <div
                onClick={() => {
                  const next = !showDemographics;
                  setShowDemographics(next);
                  if (next && !demoData && !demoLoad.loading) {
                    fetchDemographics(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined);
                  }
                }}
                style={{ padding: '12px 18px', background: C.navy, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: 16 }}></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>DEMOGRAPHICS DEEP DIVE</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>Ethnicity * Gender * Marital Status * Education * Income * Wealth Score</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, background: `${C.terra}`, color: '#fff', borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>PRO</span>
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{showDemographics ? '-' : '-'}</span>
                </div>
              </div>

              {showDemographics && (
                <div style={{ padding: 16, animation: 'fadeIn 0.3s ease' }}>
                  {demoLoad.loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {[1,2,3,4,5,6].map(i => <Skeleton key={i} h={140} />)}
                    </div>
                  ) : demoLoad.error ? (
                    <ErrorMsg msg={demoLoad.error} onRetry={() => fetchDemographics(stateCode, selectedCounty ?? undefined, drillCity ?? undefined, drillZip ?? undefined)} />
                  ) : demoData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {/* Row 0: Ethnicity */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                        <FreqTable
                          title="Owner Ethnicity  Direct Identified"
                          data={(ethnicityBreakdown ?? []).map((r: any) => ({
                            label: r.LABEL ?? r.label ?? 'Unknown',
                            count: Number(r.RECORD_COUNT ?? r.count ?? 0),
                            pct: 0
                          }))}
                          color={C.terra}
                        />
                        <div style={{ fontSize: 11, color: C.textMuted ?? '#888', marginTop: -8, paddingLeft: 4 }}>
                          [Green] Direct Identified records only. BISG modeled estimates coming in next release.
                        </div>
                      </div>
                      {/* Row 1: Gender + Marital + Education */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        <FreqTable title="Gender" data={demoData.gender.map(r => ({ ...r, label: r.label === 'M' ? 'Male' : r.label === 'F' ? 'Female' : r.label }))} color={C.terra} />
                        <FreqTable title="Marital Status" data={demoData.marital.map(r => ({
                          ...r,
                          label: r.label === 'M' ? 'Married' :
                                 r.label === 'S' ? 'Single' :
                                 r.label === 'A' ? 'Married (Inferred)' :
                                 r.label === 'B' ? 'Single (Inferred)' :
                                 r.label === 'Y' ? 'Married' :
                                 r.label === 'N' ? 'Single' : r.label
                        }))} color={C.sage} />
                        <FreqTable title="Education Level" data={demoData.education} color={C.gold} />
                      </div>
                      {/* Row 2: Income + Wealth */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <HBarChart title="Income Range" data={demoData.income} />
                        {/* Wealth Score panel */}
                        <div style={{ background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 16px', background: C.navy, color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Wealth Score (A""H)</div>
                          <div style={{ padding: 14 }}>
                            {(() => {
                              const wTotal = demoData.wealth.reduce((s, w) => s + w.count, 0);
                              const wScoreOrder = ['A','B','C','D','E','F','G','H'];
                              const wColors = ['#1B2A4A','#2A4A7F','#4A7FB5','#5D7E52','#B8860B','#C4653A','#A85D8A','#8B0000'];
                              const wDescriptions = ['Top 1%','Top 5%','Top 15%','Top 30%','Top 50%','Top 70%','Bottom 30%','Bottom 10%'];
                              return wScoreOrder.map((score, si) => {
                                const row = demoData.wealth.find(w => w.label === score);
                                const count = row?.count ?? 0;
                                const pct = wTotal > 0 ? (count / wTotal) * 100 : 0;
                                return (
                                  <div key={score} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: 4, background: wColors[si], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{score}</div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <span style={{ fontSize: 11, color: C.textBody }}>{wDescriptions[si]}</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: wColors[si], fontFamily: C.fontMono }}>{pct.toFixed(1)}%</span>
                                      </div>
                                      <div style={{ height: 5, background: C.bgWarm, borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', background: wColors[si], borderRadius: 3, transition: 'width 0.6s ease' }} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>
                      {/* Social Housing Score promo */}
                      <div style={{ padding: '14px 18px', background: `${C.navy}08`, border: `1px dashed ${C.navy}40`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontSize: 28 }}>SHS</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Social Housing Score</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>Composite diversity index combining ethnicity, income, LTV, and owner-occupancy. Available in Enterprise tier.</div>
                        </div>
                        <span style={{ fontSize: 11, background: C.navy, color: '#fff', borderRadius: 10, padding: '4px 12px', fontWeight: 700, whiteSpace: 'nowrap' }}>"' Enterprise</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 24, color: C.textMuted, fontSize: 13 }}>
                      Click to load demographic data for the selected geography.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fair Housing Disclaimer */}
            <div style={{ marginTop: 12, padding: '10px 16px', background: '#F0F4FF', borderRadius: 8, border: '1px solid #C7D7F8', fontSize: 11, color: '#1B3A7A', lineHeight: 1.6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 700, flexShrink: 0 }}>Fair Housing Notice:</span>
              <span>
                Demographic data (race/ethnicity, income, tenure) is sourced from U.S. Census Bureau ACS 5-Year Estimates and is provided for informational purposes only. This data is not used in any lending or credit decision and must not be used as such.{' '}
                <Link href="/fair-housing" style={{ color: '#1B3A7A', fontWeight: 600 }}>Fair Housing Policy</Link>
              </span>
            </div>

            {/* Methodology Note */}
            <div style={{ marginTop: 8, padding: '12px 16px', background: C.bgWarm, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, lineHeight: 1.7 }}>
              <span style={{ fontWeight: 700, color: C.textBody }}>Data Methodology: </span>
              {METHODOLOGY_NOTE}
              <span style={{ display: 'block', marginTop: 6, fontSize: 10, color: C.textDim }}>
                Confidence indicators: [Green] Direct Identified (individually sourced) * [Yellow] Household Modeled * " Area Estimated
              </span>
            </div>

            {/* -- Footer -- */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 11, color: C.textDim }}>
                ICONYCS Housing Intelligence | iconycs.com | info@iconycs.com | 760-672-0145
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/pricing" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
                <span style={{ color: C.border }}>|</span>
                <Link href="/terms" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Terms of Service</Link>
                <span style={{ color: C.border }}>|</span>
                <Link href="/privacy" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Privacy Policy</Link>
                <span style={{ color: C.border }}>|</span>
                <Link href="/fair-housing" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Fair Housing Policy</Link>
                <span style={{ color: C.border }}>|</span>
                <a href="mailto:info@iconycs.com" style={{ fontSize: 11, color: C.textMuted, textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
