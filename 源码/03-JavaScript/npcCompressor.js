/**
 * Version 1.1.0
 *
 * The npcCompressor function takes in an NPC object like those stored in NPCList and created using the $basenpc values.
 *
 * The NPC code is the concatenation of the following strings:
 * - TYPE - npc.type index
 * - SPECIAL_TYPE - The following types are checked for separately as they are a renaming of a type: [centaur, harpy, bull]
 * - GENDER_AND_PRONOUN - npc.gender, npc.pronoun. These values are concatenated and an index for that combination is used.
 * - PENIS_SIZE - npc.penissize
 * - PENIS_DESC - npc.penisdesc index
 * - BREAST_SIZE - npc.breastsize
 * - INSECURITY - npc.insecurity index
 * - SIZE - npc.size index
 * - AGE - 1 for adult, 0 for teen
 * - [ SKIN_COLOUR ] - (for humans) npc.skincolour, 0 for white, 1 for black
 * - [ MONSTER ] - (for beasts) npc.monster, 1 for monsters, 0 for beasts
 * - DESCRIPTION - npc.description index. The list used for the index is changed based on the npc's gender, age, and if they are a beast.
 * - ".a" PREGNANCY_AVOIDANCE - npc.pregnancyAvoidance (raw value)
 * - [ ".p" PREGNANCY_TIMER ] - npc.pregnancyTimer (raw value) can be both positive and negative
 * - [ ".t" EVENT_TIMER ] - npc.eventTimer (raw value) only positive
 * - [ ".n" ] - indicates there's no ".p" or ".t" section
 *
 * "Index" is the index in an array of predefined values for that field.
 * Skin_colour and monster occupy the same place in the npc_data array with monster being the priority input.
 * If there is no timer present when their respective functions are called, it will add them to the NPC code.
 * The value of a timer can be any number but 0.
 *
 * All of the above numeric values are concatenated into a string before the [".a", ".n", ".t", ".p"] values are added.
 * This numeric string then has its zeros reduced. This only occurs when the number of consecutive zeros is 3 or more.
 * Zeros are converted to [0..9]"|" for a number of zeros less than 10 and [2..9]">" is added behind to the previous conversion for a number of zeros greater than 10.
 * In the case of zeros less than 18, no number is added in front of the ">".
 *
 * Once all the zeros have been reduced, the remaining numeric values are encoded alphanumerical
 * Alphanumerical encoding converts integers to base 64 using [0..9][a..z][A..Z][_+] for values 0...63
 * The converter takes into account the maximum number possible and will only compress batches of 15 characters at once.
 *
 * npcDecompressor will take this coded string and return it as an object that contains all of the stored values.
 * In order for the NPC to be ready for use, a new NPC should be generated and the following function should be used: mergeNPCData()
 *
 * To add items to the code created by compressing a NPC, add the relevant checks before the ".a" occurs.
 * If a values needs to be accessed at all times it should be added as a ".[a..zA..Z]" to the end of the NPC code.
 * This is not recommended as more functions to get, change, and remove this value must also be added.
 *
 * NOTE: An NPC generated this way does not have a name. The name should be the key used to store the NPC string and then be added once the NPC has been decompressed.
 *
 * RELEVANT FUNCTIONS:
 * - changeCNPCPregnancyAvoidance() - changes a compressed npc's pregnancy avoidance. The range is 1 to 100.
 * - getCNPCPregnancyAvoidance() - returns a compressed npc's pregnancy avoidance.
 * - changeCNPCPregnancyTimer() - changes a compressed npc's pregnancy timer. A positive value means that the NPC was impregnated by the player, while a negative value means the NPC was impregnated by an NPC.
 * - getCNPCPregnancyTimer() - returns a compressed npc's pregnancy timer.
 * - removeCNPCPregnancyTimer() - removes a compressed npc's pregnancy timer.
 * - changeCNPCEventTimer() - changes a compressed npc's event timer. Must be positive.
 * - getCNPCEventTimer() - returns a compressed npc's event timer.
 * - removeCNPCEventTimer() - removes a compressed npc's event timer.
 *
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * The childCompressor function takes in an NPC object like those created using the $basebaby values.
 *
 * The NPC code is the concatenation of the following strings:
 * - TYPE - child.type index
 * - SPECIAL_TYPE - The following types are checked for separately as they are a renaming of a type: [centaur, harpy, bull]
 * - GENDER - child.gender index
 * - BEAST_TRANSFORMATION - child.beastTransformation index
 * - DIVINE_TRANSFORMATION - child.divineTransformation index
 * - MONSTER - (for beasts) npc.monster, 1 for monsters, 0 for beasts or human
 * - SIZE - child.features.size index
 * - HAIR_COLOUR - child.features.hairColour index
 * - EYE_COLOUR - child.features.eyeColour index
 * - SKIN_COLOUR - child.features.skinColour index
 * - CLOTHES - child.features.clothes index
 * - IDENTICAL - child.features.identical value as 1 for true, 0 for false
 * - BIRTHID - child.birthId
 * - BIRTHLOCATION - child.birthLocation index
 * - LOCATION - child.location index
 * - CONCEIVEDLOCATION - child.conceivedLocation index
 * - MOTHER - child.mother - created from the child ID
 * - FATHER - child.father - created from the child ID
 * - ".c" CONCEIVED - child.conceived the date of conception saved in DDMMYYYY format
 * - ".b" BORN - child.born the date of birth saved in DDMMYYYY format
 * - ".i" CHILDID - child.childId - this should be in the format motherID + "." + kid number for this child  + "|" + fatherID + "." + kid number for this child
 *
 * "Index" is the index in an array of predefined values for that field
 * The concatenated string created from this is compressed by the same functions the npcCompressor uses.
 * Read the explanation in the npc section above for how those work or look at the functions for a more detailed breakdown.
 *
 * childDecompressor will take this coded string and return it as an object that contains all of the stored values.
 * In order for the child to be ready for use, a new child should be generated and the following function should be used: mergeNPCData()
 *
 * NOTE: A child generated this way does not have a name. The name should be the key used to store the child string and then be added once the child has been decompressed.
 *
 * RELEVANT FUNCTIONS:
 * - convertToDMYFormat() - converts a date in DDMMYYYY format to {day:#, month:[# or string], year:#} format.
 * - convertToDDFormat() - converts a date in {day:#, month:[# or string], year:#} format to DDMMYYYY format.
 * - getCChildConceptionDate() - returns the compressed child's conceived date.
 * - changeCChildConceptionDate() - changes the compressed child's conceived date. The date must be passed in DDMMYYYY format.
 * - removeCChildConceptionDate() - removes the compressed child's conceived date.
 * - getCChildBirthDate() - returns the compressed child's born date.
 * - changeCChildbirthDate() - changes the compressed child's born date. The date must be passed in DDMMYYYY format.
 * - removeCChildBirthDate() - removes the compressed child's born date.
 * - getCChildId() - returns the compressed child's childId.
 * - changeCChildId() - changes the compressed child's childId. childId should be in [0..9]+.[0..9]+|[0..9]+.[0..9]+ format. If a values is unknown, it should be set to [-1].
 *
 * ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 *
 * Updating the version:
 *      0.0. +1     for minor bug fixes
 *      0. +1 .0    for larger additions or subtractions such as adding/removing a key or a new function
 *      +1 .0.0     for overhauls that need to restructure the entire code base.
 *
 * Changes:
 *  1.0.0: The initial version.
 * 	1.1.0: Added the conceivedLocation Key to the child compressor.
 *
 */

const { npcCompressor, npcDecompressor, childCompressor, childDecompressor } = (function () {
	const compressorVersionNPC = 1;
	const compressorVersionChild = 2;
	/* 北极星模组 */
	const typeList = ["human","dog","cat","pig","wolf","dolphin","lizard","bear","boar","creature","horse","fox","hawk","cow","spider", "plant","sheep","deer","bee","wasp","dragon","ant","raccoon","frog","rat"];
	const beastList = ["dog","cat","pig","wolf","dolphin","lizard","bear","boar","creature","horse","fox","hawk","cow","spider","sheep","deer","bee","wasp","dragon","ant","raccoon","frog","rat"];
	/* 北极星 */
	const insecurityList = ["none", "vagina", "penis", "ethics", "weak", "skill", "looks"];
	const genproList = ["mm", "fm", "hm", "mf", "ff", "hf"]; /* stores gender first, pronoun second. */
	const breastdescList = ["nipple", "budding", "tiny", "small", "pert", "modest", "full", "large", "ample", "massive", "huge", "gigantic", "enormous"];
	const sizeList = ["tiny", "small", "normal", "large"];
	const skinColourList = ["white", "black", "light", "medium", "dark", "ylight", "ymedium", "ydark", "ghostlyPale", "gyaru", "ygyaru"];
	const noClawList = ["dog", "pig", "wolf", "dolphin", "boar", "fox", "hawk", "cow", "bull"];
	const teenFDescList = [
		"slight",
		"lithe",
		"lean",
		"thin",
		"slender",
		"lissome",
		"slim",
		"taut",
		"graceful",
		"trim",
		"mousy",
		"cute",
		"fit",
		"petite",
		"toned",
		"shapely",
		"robust",
		"plump",
		"wide-eyed",
		"vulgar",
		"minor demon",
		"tutorial",
		"debug",
	];
	const teenMDescList = [
		"slight",
		"lithe",
		"lean",
		"thin",
		"slender",
		"lissome",
		"slim",
		"taut",
		"graceful",
		"trim",
		"mousy",
		"cute",
		"fit",
		"petite",
		"toned",
		"shapely",
		"robust",
		"plump",
		"wide-eyed",
		"brutish",
		"minor demon",
		"tutorial",
		"debug",
	];
	const adultFDescList = [
		"slight",
		"lithe",
		"lean",
		"thin",
		"slender",
		"lissome",
		"slim",
		"taut",
		"petite",
		"trim",
		"muscular",
		"curvy",
		"toned",
		"plump",
		"plush",
		"shapely",
		"robust",
		"voluptuous",
		"lush",
		"vulgar",
		"demon",
		"tutorial",
		"debug",
	];
	const adultMDescList = [
		"petite",
		"slight",
		"slim",
		"thin",
		"slender",
		"lanky",
		"lissome",
		"lithe",
		"trim",
		"lean",
		"taut",
		"plump",
		"toned",
		"bulky",
		"broad",
		"robust",
		"rugged",
		"muscular",
		"burly",
		"brutish",
		"demon",
		"tutorial",
		"debug",
	];
	const beastDescList = ["large",
		"large",
		"fat",
		"enormous",
		"bottlenose",
		"scaly",
		"brown",
		"hairy",
		"strange",
		"huge",
		"large",
		"fierce",
		"slimy",
		"girthy",
		"mighty",
		"hefty",
		"colossal",
		"humongous"
	];
	const penisDescList = {
		human: [
			"none",
			"tiny penis",
			"penis",
			"thick cock",
			"hefty cock",
			"big cock",
			"large cock",
			"veiny cock",
			"meaty cock",
			"massive cock",
			"huge cock",
			"humongous cock",
			"immense cock",
			"gigantic cock",
			"enormous cock",
		],
		beast: [
			"knotted penis",
			"spiked penis",
			"penis",
			"knotted penis",
			"strange penis",
			"penis",
			"penis",
			"penis",
			"penis",
			"equine cock",
			"knotted penis",
			"avian cock",
			"bovine cock",
			"arachnid penis",
		],
	};
	const teenHealthList = [125, 175, 150, 150, 150, 175, 150, 200, 200, 200, 125, 200, 250, 125, 250, 200, 250, 250, 200, 300, 400];
	const adultFHealthList = [125, 175, 150, 150, 150, 175, 150, 200, 125, 200, 275, 200, 250, 250, 200, 200, 250, 200, 200, 350, 600];
	const adultMHealthList = [125, 125, 150, 150, 150, 150, 175, 175, 200, 200, 200, 200, 250, 250, 250, 250, 275, 275, 275, 400, 600];
	const beastHealthList = [200, 150, 200, 300, 200, 250, 500, 300, 200, 500, 200, 150, 400];

	// child items
	const hairColourList = {
		human: [
			"red",
			"jetblack",
			"black",
			"brown",
			"softbrown",
			"lightbrown",
			"burntorange",
			"blond",
			"softblond",
			"platinumblond",
			"ashyblond",
			"strawberryblond",
			"ginger",
			"dark brown",
		],
		wolf: ["gray", "brown", "tan", "white", "black"],
	};
	const eyeColourList = ["purple", "dark blue", "light blue", "amber", "hazel", "green", "lime green", "red", "pink", "grey", "light grey"];
	const monthNameList = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const tformList = {
		beast: ["none", "cat", "cow", "wolf", "bird"],
		divine: ["none", "angel", "devil"],
	};

	// All of these list will need to be expanded on in the future.
	const locationList = [
		"unknown",
		"home",
		"wolf_cave",
		"hospital",
		"alley",
		"beach",
		"sea",
		"school",
		"schoolgrounds",
		"pool",
		"town",
		"temple",
		"spa",
		"arcade",
		"cafe",
		"museum",
		"docks",
		"compound",
		"landfill",
		"underground",
		"drain",
		"sewers",
		"brothel",
		"strip_club",
		"pub",
		"estate",
		"kylarmanor",
		"pound",
		"factory",
		"park",
		"parkmens",
		"parkwomens",
		"parkcafe",
		"parktree",
		"forest",
		"cabin",
		"lake",
		"lake_ruin",
		"moor",
		"castle",
		"tower",
		"cliff",
		"farm",
		"plains",
		"alex_farm",
		"alex_cottage",
		"riding_school",
		"asylum",
		"prison",
		"tentworld",
		"dance_studio",
		"adult_shop",
		"shopping_centre",
		"police_station",
		"changingroom",
		"starfish",
		"promenade",
		"backyard",
		"garden",
		"seabeach",
		"searocks",
		"seadocks",
		"seacliffs",
		"coastpath",
		"seapirates",
		"residential",
		"domus",
		"barb",
		"danube",
		"commercial",
		"connudatus",
		"high",
		"nightingale",
		"oxford",
		"industrial",
		"mer",
		"elk",
		"harvest",
	];

	const childClothingList = [undefined, "naked", "clothed"];

	// base 64 conversion string.
	const table = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_+";
	const base = table.length;

	/**
	 * @description Takes in a passed NPC object and turns them in a coded string for the values that are required to make them again.
	 * @param {object} passedNPC The NPC the user wants to compress. The NPC should be an object with all keys.
	 * @returns {string} The NPC as a coded string.
	 */
	function npcCompressor(passedNPC) {
		// values to encode before all '.' values
		const npcData = [];
		let npcCode = "";

		// Pre-processing
		let npcType = passedNPC.type;
		const beast = npcType !== "human" && npcType !== "plant";
		let monster = 0;

		if (beast) {
			// Catches the alternate names that we've added because nothing can be simple
			if (npcType.includes("boy") || npcType.includes("girl")) {
				npcType = npcType.replace(/boy|girl/, "");
				monster = 1;
			}
			if (npcType === "centaur") {
				npcType = "horse";
				monster = 1;
			} else if (npcType === "harpy") {
				npcType = "hawk";
				monster = 1;
			} else if (npcType === "bull") {
				npcType = "cow";
				monster = 1;
			}
		}

		const npcTypeIndex = typeList.indexOf(npcType);
		if (npcTypeIndex === -1) throw new Error("An invalid NPC type: " + npcType + ", was passed!");

		let genderPronoun = genproList.indexOf(passedNPC.gender + passedNPC.pronoun);
		if (genderPronoun === -1) genderPronoun = 0;

		const penisSize = passedNPC.gender !== "f" && passedNPC.penissize ? passedNPC.penissize : 0;
		let penisDesc = !passedNPC.penisdesc
			? passedNPC.gender !== "f"
				? 2
				: 0
			: beast
			? penisDescList.beast.indexOf(passedNPC.penisdesc)
			: penisDescList.human.indexOf(passedNPC.penisdesc);
		if (penisDesc === -1) penisDesc = 0;
		const breastSize = passedNPC.breastsize ? passedNPC.breastsize : 0;

		let insecurityIndex = insecurityList.indexOf(passedNPC.insecurity);
		if (insecurityIndex === -1) insecurityIndex = 0;

		const sizeIndex = passedNPC.size ? sizeList.indexOf(passedNPC.size) : 2;
		const adult = passedNPC.adult ? passedNPC.adult : 0;
		const skin = passedNPC.skincolour ? skinColourList.indexOf(passedNPC.skincolour) : 0;

		let descriptionIndex = 0;
		if (beast) {
			descriptionIndex = beastDescList.indexOf(passedNPC.description);
		} else {
			// description for non-beast NPCs
			const descriptionList =
				passedNPC.teen === 1
					? passedNPC.pronoun === "f"
						? teenFDescList
						: teenMDescList
					: passedNPC.pronoun === "f"
					? adultFDescList
					: adultMDescList;
			descriptionIndex = descriptionList.indexOf(passedNPC.description);
		}

		// assigns all the values to their correct order. The number of items for beast and human type NPCs should be kept equal.
		npcData[0] = npcTypeIndex.toString().padStart(2, "0"); // can be above 10
		npcData[1] = genderPronoun;
		npcData[2] = penisSize;
		npcData[3] = penisDesc.toString().padStart(2, "0"); // can be above 10
		npcData[4] = breastSize.toString().padStart(2, "0"); // can be above 10
		npcData[5] = insecurityIndex.toString().padStart(2, "0"); // can be above 10
		npcData[6] = sizeIndex;
		npcData[7] = adult;
		npcData[8] = monster || skin;
		npcData[9] = descriptionIndex.toString().padStart(2, "0"); // can be above 10

		npcCode = (compressorVersionNPC < 10 ? "~" : "") + reduceZeros(compressorVersionNPC.toString() + npcData.join(""));

		// The pregnancy avoidance that the NPC has. Adds .a and then the avoidance value. Ranges between 1 to 100
		if (!passedNPC.pregnancyAvoidance) passedNPC.pregnancyAvoidance = 0;
		npcCode += ".a" + passedNPC.pregnancyAvoidance;

		/**
		 * checks any timers that the NPC has. Types are none (.n), pregnant (.p), or event (.t).
		 * notes For pregnancy, NPCs that are pregnant with kids not from the PC have a negative pregnancy timer. The final end value is the same just negative.
		 */
		if (!(passedNPC.pregnancyTimer || passedNPC.eventTimer)) {
			npcCode += ".n";
		} else {
			if (passedNPC.pregnancyTimer) {
				npcCode += ".p" + passedNPC.pregnancyTimer;
			}
			if (passedNPC.eventTimer) {
				npcCode += ".t" + passedNPC.eventTimer;
			}
		}

		return npcCode;
	}

	/**
	 * @description Takes in a passed coded string and turns them into a NPC with the required key values.
	 * @param {string} passedNPC The npc code as a string that you want returned as an object.
	 * @returns {object} The passed npc as an object with all relevent key's filled.
	 */
	function npcDecompressor(passedNPC) {
		const npcItems = {};
		let expandedNPC;
		let position = passedNPC.indexOf(".");
		if (passedNPC[0] === "~") expandedNPC = "0" + expandZeros(passedNPC.slice(1, position)) + passedNPC.slice(position);
		else expandedNPC = expandZeros(passedNPC.slice(0, position)) + passedNPC.slice(position);
		const cVersion = Number(expandedNPC.slice(0, 2));
		position = 2;

		// Sets the type of NPC
		let npcType = typeList[Number(expandedNPC.slice(position, position + 2))];
		const beast = !(npcType === "human" || npcType === "plant") ? beastList.indexOf(npcType) : 0;
		position += 2;

		// sets gender, pronoun, and genitals of the NPC
		const gpCombo = genproList[expandedNPC[position]];

		const gender = gpCombo[0];
		const pronoun = gpCombo[1];
		const notNone = npcType === "human" ? "clothed" : 0;
		const vagina = gender === "m" ? "none" : notNone;
		const penis = gender === "f" ? "none" : notNone;
		position++;

		const penissize = Number(expandedNPC[position]);
		position++;

		const penisdesc =
			penis === "none"
				? "none"
				: beast
				? penisDescList.beast[Number(expandedNPC.slice(position, position + 2))]
				: penisDescList.human[Number(expandedNPC.slice(position, position + 2))];
		position += 2;

		// Sets the breast size of the NPC
		const breastsize = Number(expandedNPC.slice(position, position + 2));
		const breastdesc = breastdescList[breastsize] + (breastsize > 0 ? " breast" : "");
		const breastsdesc = breastdesc + "s";
		position += 2;

		// Sets the insecurities of the NPC
		const insecurity = insecurityList[Number(expandedNPC.slice(position, position + 2))];
		position += 2;

		// Sets the physical size of the NPC
		const size = sizeList[expandedNPC[position]];
		position++;

		// sets the ages range of the npc
		const adult = Number(expandedNPC[position]);
		const teen = 1 - adult;
		position++;

		// sets the monster status or skin color depending on NPC type
		let monster, claws, skincolour;
		if (beast) {
			monster = Number(expandedNPC[position]) !== 0 ? "monster" : 0;

			// assign the correct claw type first
			if (["cow", "horse", "pig", "boar"].includes(npcType)) {
				claws = "hooves";
			} else if (["dolphin"].includes(npcType)) {
				claws = "flippers";
			} else if (["hawk"].includes(npcType)) {
				claws = "talons";
			} else {
				claws = "claws";
			}

			if (npcType === "cow" && gender === "m") npcType = "bull";

			if (monster !== 0) {
				// removes the claws on the monsters than don't keep them.
				if (noClawList.includes(npcType)) claws = null;

				switch (npcType) {
					case "horse":
						npcType = "centaur";
						break;
					case "hawk":
						npcType = "harpy";
						break;
					default:
						npcType += gender === "m" ? "boy" : "girl";
						break;
				}
			}
		} else {
			skincolour = skinColourList[Number(expandedNPC[position])];
		}
		position++;

		let health, healthmax, description, fullDescription;

		// Sets the description and health of the NPC
		if (beast) {
			health = beastHealthList[beast];
			healthmax = health;
			description = beastDescList[Number(expandedNPC.slice(position, position + 2))];
			fullDescription = description + (!monster ? (gender === "m" ? " male " : " female ") : " ") + npcType;
		} else {
			let descType;
			let healthType;

			if (teen === 1) {
				healthType = teenHealthList;
				descType = pronoun === "f" ? teenFDescList : teenMDescList;
			} else {
				healthType = pronoun === "f" ? adultFHealthList : adultMHealthList;
				descType = pronoun === "f" ? adultFDescList : adultMDescList;
			}

			description = descType[Number(expandedNPC.slice(position, position + 2))];
			health = healthType[Number(expandedNPC.slice(position, position + 2))];
			healthmax = health;

			// Sets the full description of the NPC
			const plant = npcType === "plant" ? " plant" : " ";
			const man = pronoun === "m" ? (teen === 1 ? "boy" : "man") : teen === 1 ? "girl" : "woman";
			fullDescription = description + plant + man;
		}
		position += 2;

		if (cVersion > 1) throw new Error("This should be unreachable.");

		// preg avoidance
		let pregnancyAvoidance = passedNPC.match(/\.a(\d+)/);
		pregnancyAvoidance = pregnancyAvoidance ? Number(pregnancyAvoidance[1]) : 1;

		// preg timer
		let pregnancyTimer = passedNPC.match(/\.p(-?\d+)/);
		pregnancyTimer = pregnancyTimer ? Number(pregnancyTimer[1]) : 0;

		// event timer
		let eventTimer = passedNPC.match(/\.t(\d+)/);
		eventTimer = eventTimer ? Number(eventTimer[1]) : 0;

		npcItems.type = npcType;
		npcItems.gender = gender;
		npcItems.pronoun = pronoun;
		npcItems.vagina = vagina;
		npcItems.penis = penis;
		npcItems.penissize = penissize;
		npcItems.penisdesc = penisdesc;
		npcItems.breastsize = breastsize;
		npcItems.breastdesc = breastdesc;
		npcItems.breastsdesc = breastsdesc;
		npcItems.insecurity = insecurity;
		npcItems.size = size;
		npcItems.adult = adult;
		npcItems.teen = teen;
		npcItems.monster = monster || 0;
		npcItems.claws = claws || null;
		npcItems.skincolour = skincolour || null;
		npcItems.health = health;
		npcItems.healthmax = healthmax;
		npcItems.description = description;
		npcItems.fullDescription = fullDescription;
		npcItems.pregnancyAvoidance = pregnancyAvoidance;
		npcItems.pregnancyTimer = pregnancyTimer;
		npcItems.eventTimer = eventTimer;

		if (!npcItems.claws) delete npcItems.claws;
		if (!npcItems.skincolour) delete npcItems.skincolour;

		return npcItems;
	}

	/**
	 * @description Takes in a passed child object and turns them into a coded string for the values that are required to make them again.
	 * @param {object} passedChild The child the user wants to compress. The child should be an object with all keys.
	 * @param {boolean} bothDates If true, both the conception and birth date will be added to the end of the compressed string. If false, it will add the more relevant one.
	 * @returns {string} The child as a coded string.
	 */
	function childCompressor(passedChild, bothDates = true) {
		const childData = [];
		let childCode = "";
		let monster;

		// should only be humans and wolves atm. Still set up to take in all the other types though.
		let childType = passedChild.type;
		const beast = childType !== "human" && childType !== "plant";

		if (beast) {
			// Catches the alternate names that we've added
			if (childType.includes("boy") || childType.includes("girl")) {
				childType = childType.replace(/boy|girl/, "");
				monster = 1;
			}
			if (childType === "centaur") {
				childType = "horse";
				monster = 1;
			} else if (childType === "harpy") {
				childType = "hawk";
				monster = 1;
			} else if (childType === "bull") {
				childType = "cow";
				monster = 1;
			}
		}

		const childTypeIndex = typeList.indexOf(childType);
		if (childTypeIndex === -1) throw new Error(`An invalid child type: ${childType}, was passed.`);

		let gender = ["m", "f", "h"].indexOf(passedChild.gender);
		if (gender < 0) gender = 1;

		// beast transforms and divine transforms
		const tformBeast = passedChild.features.beastTransform ? tformList.beast.indexOf(passedChild.features.beastTransform) : 0;
		const tformDivine = passedChild.features.divineTransform ? tformList.divine.indexOf(passedChild.features.divineTransform) : 0;

		monster = monster || (passedChild.features.monster ? 1 : 0);

		const size = passedChild.features.size ? sizeList.indexOf(passedChild.features.size) : 2;

		const hairType = Object.keys(hairColourList).includes(childType) ? childType : "human";
		const hair = passedChild.features.hairColour ? hairColourList[hairType].indexOf(passedChild.features.hairColour) : 0;

		const eyes = passedChild.features.eyeColour ? eyeColourList.indexOf(passedChild.features.eyeColour) : 7;
		let skin = passedChild.features.skinColour ? skinColourList.indexOf(passedChild.features.skinColour) : 2;
		if (skin === -1) skin = 2;

		let clothes = passedChild.features.clothes ? childClothingList.indexOf(passedChild.features.clothes) : 0; // make sure this can take in other types once clothing is more developed.
		if (clothes === -1) clothes = 0;

		// this needs to be expanded upon. talk about it later
		let twinplets;
		switch (passedChild.features.identical) {
			case undefined:
				twinplets = 0;
				break;
			case true:
				twinplets = 1;
				break;
			case false:
				twinplets = 2;
				break;
		}

		let birthID = passedChild.birthId;
		if (!birthID || birthID < 0 || isNaN(birthID))
			throw new Error(`The child compressor was passed a child with an invalid birth ID of: ${birthID}. birth ID values should be integers above 0.`);
		birthID = "" + birthID.toString().length + birthID;

		let birthLocation = locationList.indexOf(passedChild.birthLocation);
		if (birthLocation < 0) birthLocation = 0;

		let childLocation = locationList.indexOf(passedChild.location);
		if (childLocation < 0) childLocation = 0;

		let conceivedLocation = locationList.indexOf(passedChild.conceivedLocation);
		if (conceivedLocation < 0) conceivedLocation = 0;

		// Used to determine whether or not the child's parents are known. The final value is a combination of the mother's and father's known states.
		// mother: Unknown = 0 | known = 2; father: Unknown = 0 | known = 1;
		let parentsKnown = 0;

		if (passedChild.motherKnown) parentsKnown = 2;
		else parentsKnown = 0;

		if (passedChild.motherKnown) parentsKnown += 1;
		else parentsKnown += 0;

		// assigns all the values to their correct order.
		childData[0] = childTypeIndex.toString().padStart(2, "0"); // preplan this having 2 places.
		childData[1] = gender;
		childData[2] = tformBeast.toString().padStart(2, "0");
		childData[3] = tformDivine.toString().padStart(2, "0");
		childData[4] = monster;
		childData[5] = size;
		childData[6] = hair.toString().padStart(2, "0"); // needs 2 places
		childData[7] = eyes.toString().padStart(2, "0"); // needs 2 places
		childData[8] = skin.toString().padStart(2, "0"); // preplan this having 2 places.
		childData[9] = clothes.toString().padStart(2, "0"); // preplan this having 2 places.
		childData[10] = twinplets;
		childData[11] = birthID; // this can have up to 10 places. 9 for the id and 1 for the id length.
		childData[12] = birthLocation.toString().padStart(3, "0"); // preplan this having 2 places.
		childData[13] = childLocation.toString().padStart(3, "0"); // preplan this having 2 places.
		childData[14] = conceivedLocation.toString().padStart(3, "0"); // preplan this having 2 places.
		childData[15] = parentsKnown;

		childCode = (compressorVersionChild < 10 ? "~" : "") + reduceZeros(compressorVersionChild.toString() + childData.join(""));

		// Currently we have both dates added if they are there.
		let conceivedDate, birthDate;

		if (passedChild.conceived) {
			conceivedDate = ".c" + verifyPassedDate(passedChild.conceived);
		} else {
			conceivedDate = ".c" + "0".repeat(8);
		}

		if (passedChild.born) {
			birthDate = ".b" + verifyPassedDate(passedChild.born);
		} else {
			// birthDate +=".b" + "0".repeat(8);
		}

		if (bothDates) {
			if (conceivedDate) childCode += conceivedDate;
			if (birthDate) childCode += birthDate;
		} else {
			if (birthDate) childCode += birthDate;
			else childCode += conceivedDate;
		}

		// this should be in the format m#b#d#f#
		let childId = passedChild.childId;

		if (childId.match(/m(\d?[m,b,d,f]?[m,b,d,f]?\d+?)+/)) childCode += "." + childId;
		else {
			childId = `A child with either no childId or an invalid Id was passed to the compressor. Passed value: ${passedChild.childId}. Format should be m#b#d#f# with an unknown value being no number.
        m# should be the mother's Id, b# should be the birth number of this child for the mother, d# should be the father's Id, f# should be the birth number of this child for the father.
        In cases where a parent's information is not known, then no number should replace the # values. A known mother with an unknown father would be: m#b#df \n`;
			throw new Error(childId);
		}

		return childCode;
	}

	/**
	 * @description Takes in a passed coded string and turns them into a child with the required key values.
	 * @param {string} passedChild The child code as a string that you want returned as an object.
	 * @param {string} passedName The name of the Child that is being decompressed.
	 * @returns {object} The passed child as an object with all relevent key's filled.
	 */
	function childDecompressor(passedChild, passedName = null) {
		let childItems = {};
		let expandedChild;

		// get version number
		let position = passedChild.indexOf(".");
		if (passedChild[0] === "~") expandedChild = "0" + expandZeros(passedChild.slice(1, position)) + passedChild.slice(position);
		else expandedChild = expandZeros(passedChild.slice(0, position)) + passedChild.slice(position);
		const cVersion = Number(expandedChild.slice(0, 2));
		position = 2;

		// extract indexes from uncompressed string and get their values.
		let childType = typeList[Number(expandedChild.slice(position, position + 2))];
		const beast = !(childType === "human" || childType === "plant");
		position += 2;

		const gender = ["m", "f", "h"][Number(expandedChild[position])];
		position++;

		const beastTransform = tformList.beast[Number(expandedChild.slice(position, position + 2))];
		position += 2;

		const divineTransform = tformList.divine[Number(expandedChild.slice(position, position + 2))];
		position += 2;

		// we change the child type later, not at this stage because the mother and father code needs it as is.
		const monster = Number(expandedChild[position]) ? "monster" : 0;
		position++;

		const size = sizeList[Number(expandedChild[position])];
		position++;

		const hairType = Object.keys(hairColourList).includes(childType) ? childType : "human";
		const hairColour = hairColourList[hairType][Number(expandedChild.slice(position, position + 2))];
		position += 2;

		const eyeColour = eyeColourList[Number(expandedChild.slice(position, position + 2))];
		position += 2;

		const skinColour = skinColourList[Number(expandedChild.slice(position, position + 2))];
		position += 2;

		const clothes = childClothingList[Number(expandedChild.slice(position, position + 2))];
		position += 2;

		const identical = Number(expandedChild[position]) === 1;
		position++;

		const birthTemp = Number(expandedChild[position]);
		position++;

		const birthId = Number(expandedChild.slice(position, position + birthTemp));
		position += birthTemp;

		const birthLocation = locationList[Number(expandedChild.slice(position, position + 3))];
		position += 3;

		const location = locationList[Number(expandedChild.slice(position, position + 3))];
		position += 3;

		const conceivedLocation = locationList[Number(expandedChild.slice(position, position + 3))];
		position += 3;

		if (cVersion === 1) position +=6;

		let mother = expandedChild.match(/m-?\d+/);
		mother = mother ? findParent(Number(mother[0].replace("m",""))) : mother;
		if (!mother && mother !== 0) throw new Error(`The passed child string did not contain a valid child Id and was missing the mother ID property 'm'. Passed string: ${passedChild}`);
		mother = mother === -1 ? "unknown" : mother.name;
		
		let father = expandedChild.match(/d-?\d+/);
		father = father ? findParent(Number(father[0].replace("m",""))) : father;
		if (!father && father !== 0) throw new Error(`The passed child string did not contain a valid child Id and was missing the father ID property 'd'. Passed string: ${passedChild}`);
		father = father === -1 ? "unknown" : father.name;

		let fatherKnown, motherKnown;

		const parentsKnown = Number(expandedChild.slice(position, position + 1));

		switch (parentsKnown) {
			case 0:
				fatherKnown = false;
				motherKnown = false;
				break;
			case 1:
				fatherKnown = true;
				motherKnown = false;
				break;
			case 2:
				fatherKnown = false;
				motherKnown = true;
				break;
			case 3:
				fatherKnown = true;
				motherKnown = true;
				break;
		}

		if (beast) {
			if (childType === "cow" && gender === "m") childType = "bull";

			if (monster) {
				switch (childType) {
					case "horse":
						childType = "centaur";
						break;
					case "hawk":
						childType = "harpy";
						break;
					default:
						childType += gender === "m" ? "boy" : "girl";
						break;
				}
			}

			if (!childType) {
				console.error(
					`The compressed childType ${childType} was not on the list of types that could be pulled from. As a beast is expected, childType has been set to wolf`
				);
				childType = "wolf";
			}
		} else {
			const man = gender === "m" ? "boy" : "girl";
			childType += childType === "plant" ? man : "";
		}

		if (cVersion > 2) throw new Error("This should be unreachable.");

		let check;

		check = expandedChild.match(/\.c\d+/);
		check = check ? check[0].slice(2) : "01010000";
		const conceived = convertToDMYFormat(check);
		conceived.month = monthNameList[conceived.month];

		check = expandedChild.match(/\.b\d+/);
		check = check ? check[0].slice(2) : "01010000";
		const born = convertToDMYFormat(check);
		born.month = monthNameList[born.month];

		check = expandedChild.match(/\.m(\d?[m,b,d,f]?[m,b,d,f]?\d+?)+/);
		if (check) check = check[0].slice(1);
		else {
			check = `A child with either no childId or an invalid Id was passed to the decompressor. Passed value: ${expandedChild.match(
				/\.m.*/
			)}. Format should be .m#b#d#f# with an unknown being no number.
        m# should be the mother's Id, b# should be the birth number of this child for the mother, d# should be the father's Id, f# should be the birth number of this child for the father.
        In cases where a parent's information is not known, then no number should replace the # values. A known mother with an unknown father would be: m#b#df \n`;
			throw new Error(check);
		}
		const childId = check;

		// assignment of values
		childItems = {
			type: childType,
			gender,
			birthId,
			conceivedLocation,
			birthLocation,
			location,
			mother,
			motherKnown,
			father,
			fatherKnown,
			conceived,
			born,
			childId,
			features: { beastTransform, divineTransform, monster, size, hairColour, eyeColour, skinColour, clothes, identical },
		};

		if (passedName) {
			childItems.name = passedName;
		}

		return childItems;
	}

	/**
	 * @description converts the passed number from base 10 to base 64. If the number you need converted is bigger than the allowable max integer number, store than number as a string and pass it the same way you would a number.
	 * @param {number} passedNum The number you want to convert to base 64.
	 * @param {boolean} safe If the number is smaller than the max safe integer then this can be set to true.
	 * @returns {string} A string of base 64 characters with break points for overly large numbers.
	 */
	function toBase64(passedNum, safe = false) {
		if (!isFinite(passedNum)) return String(passedNum);
		if (passedNum === 0) return "0";
		if (passedNum < 0) return "-" + toBase64(-passedNum);

		if (passedNum.toString().length > 15 && !safe) {
			let zeroCheck = 0;

			while (passedNum.toString()[15 + zeroCheck] === 0) {
				zeroCheck++;
			}

			if (Number(passedNum.toString().slice(0, 15 + zeroCheck)) > Number.MAX_SAFE_INTEGER) {
				zeroCheck = 0;
				while (passedNum.toString()[15 + zeroCheck] === 0) {
					zeroCheck--;
				}
			}

			const frontSplit = passedNum.toString().slice(0, 15 + zeroCheck);
			const backSplit = passedNum.toString().slice(15 + zeroCheck);

			return toBase64(frontSplit, true) + "!" + toBase64(backSplit);
		}

		let str = "";
		let r;

		while (passedNum) {
			r = passedNum % base;
			passedNum -= r;
			passedNum /= base;
			str = table.charAt(r) + str;
		}

		return str;
	}

	/**
	 * @description converts the passed string from base 64 to base 10.
	 * @param {string} passedStr The base 64 string that is to be converted to base 10.
	 * @returns {string} The base 10 number as a string.
	 */
	function fromBase64(passedStr) {
		if (passedStr.length === 0 || passedStr === "0") return 0;
		if (passedStr === "NaN" || passedStr === "Infinity") return Number(passedStr);
		if (passedStr[0] === "-") return -fromBase64(passedStr.slice(1));

		if (passedStr.indexOf("!") >= 0)
			return "" + fromBase64(passedStr.slice(0, passedStr.indexOf("!"))) + fromBase64(passedStr.slice(passedStr.indexOf("!") + 1));

		let num = 0;
		let r;

		while (passedStr.length) {
			r = table.indexOf(passedStr.charAt(0));
			passedStr = passedStr.substring(1);
			num *= base;
			num += r;
		}

		return num;
	}

	/**
	 * @description Takes groups of 3 or more zeros and reduces them down to the number of zeros and a "|". If the number of consecutive zeros is greater than 9, a ">" is added with a value in front of it for the number of 9s it represents (27 = 3>). It then passes the result to the base 10 to base 64 converter above and finishes compressing it.
	 * @param {*} passedNumber An integer number as either a String or Number
	 * @returns {string} The passed number as a compressed string with no zeros and in base 64 format.
	 */
	function reduceZeros(passedNumber) {
		if (isNaN(passedNumber)) return passedNumber;
		if (passedNumber === 0) return "0";
		let result = String(passedNumber);

		result = result.replace(
			/0{3,}/g,
			zeros => "" + (zeros.length % 9) + "|" + (zeros.length > 9 ? (zeros.length > 17 ? Math.floor(zeros.length / 9) + ">" : ">") : "")
		);
		result = result.replace(/[0-9]{2,}/g, number => toBase64(number));

		return result;
	}

	/**
	 * @description Converts condensed zeros back to the correct number of zeros. It then passes the result to the base 64 to base 10 converter above and finishes decompressing it.
	 * @param {*} passedString The base 64 number with compressed zeros in it.
	 * @returns {string} The passed coded string as a number in base 10 as a string.
	 */
	function expandZeros(passedString) {
		if (passedString.length === 0 || passedString === "0") return 0;
		if (passedString === "NaN" || passedString === "Infinity") return Number(passedString);
		let result = passedString;

		result = result.replace(/[a-zA-Z0-9_+]+/g, group => fromBase64(group));
		result = result.replace(/([0-9]+)>/g, (_str, p1) => "0".repeat(Number(p1) * 9));
		result = result.replace(/>/g, "9|");
		result = result.replace(/!/g, "");
		result = result.replace(/([0-9])\|/g, (_str, p1) => (p1 > 0 ? "0".repeat(Number(p1)) : "0".repeat(9)));

		return result;
	}

	/**
	 * @description Makes sure that the passed dates are valid. If they are not, then it assigns default values.
	 * @param {object} dateObject The passed date in {day:#, month:#, year:#} format. The day in either type Number or String. The month as either a number or string name. The year as a 4 digit number in either type Number or String.
	 * @param {*} dateObject.day
	 * @param {*} dateObject.month
	 * @param {*} dateObject.year
	 * @returns {string} A string that is in the format DDMMYYYY for the passed date.
	 */
	function verifyPassedDate({ day, month, year }) {
		let tempDay, tempMonth, tempYear;
		const date = { day, month, year };

		if (!isNaN(date.day) && date.day > 0 && date.day < 32) tempDay = date.day.toString().padStart(2, "0");
		else tempDay = "01";

		if (isNaN(date.month)) {
			tempMonth = monthNameList.indexOf(date.month);
			tempMonth = tempMonth > 0 ? tempMonth.toString().padStart(2, "0") : "01";
		} else if (!isNaN(date.month) && date.day >= 0 && date.day < 12) tempMonth = date.month.toString().padStart(2, "0");
		else tempMonth = "01";

		if (!isNaN(date.year)) tempYear = date.year.toString().padStart(4, "0");
		else tempYear = "0000";

		return tempDay + tempMonth + tempYear;
	}

	return { npcCompressor, npcDecompressor, childCompressor, childDecompressor };
})();
window.npcCompressor = npcCompressor;
window.npcDecompressor = npcDecompressor;
window.childCompressor = childCompressor;
window.childDecompressor = childDecompressor;

/**
 * @description Takes in a coded NPC string and modifies the NPC's pregnancy avoidance.
 * @param {string} npcString The compressed NPC string.
 * @param {number} increment The amount added to the pregnancy avoidance.
 * @returns {string} The passed NPC code with the changed pregnancy avoidance.
 */
function changeCNPCPregnancyAvoidance(npcString, increment) {
	return npcString.replace(/\.a(\d+)/, (_str, p1) => ".a" + Math.max(1, Math.min(100, Number(p1) + increment)));
}
window.changeCNPCPregnancyAvoidance = changeCNPCPregnancyAvoidance;
DefineMacroS("changeCNPCPregnancyAvoidance", changeCNPCPregnancyAvoidance);

/**
 * @description Takes a compressed NPC and returns the current event timer value.
 * @param {string} npcString The compressed NPC string.
 * @returns {number} The current value of the event timer. Returns 0 if there is no timer.
 */
function getCNPCPregnancyAvoidance(npcString) {
	const match = npcString.match(/\.a(\d+)/);
	return match ? Number(match[1]) : 0;
}
window.getCNPCPregnancyAvoidance = getCNPCPregnancyAvoidance;
DefineMacro("getCNPCPregnancyAvoidance", getCNPCPregnancyAvoidance);

/**
 * @description Takes in a coded NPC string and modifies the NPC's pregnancy timer. If not timer is present it will add it.
 * @param {string} npcString The NPC code that is to be modified.
 * @param {number} increment The amount of time added to the pregnancy timer.
 * @returns {string} The passed NPC code with the changed pregnancy timer.
 */
function changeCNPCPregnancyTimer(npcString, increment) {
	// There is no timer, replace the no timer value (.n) with the pregnancy timer if the passed value isn't 0.
	if (npcString.indexOf(".n") > 0 && increment !== 0) return npcString.replace(/\.n/, ".p" + increment);

	// The pregnancy timer is present so its value is changed. removes the timer if the new value is 0.
	if (npcString.indexOf(".p") > 0)
		return npcString.replace(/\.p(-?\d+)/, (_str, p1) =>
			Number(p1) + increment !== 0 ? ".p" + (Number(p1) + increment) : npcString.indexOf(".t") > 0 ? "" : ".n"
		);

	// There is an event timer present. Places the pregnancy timer before the event timer.
	if (npcString.indexOf(".t") > 0) return npcString.replace(/\.t\d+/, _str => (increment !== 0 ? ".p" + increment + _str : _str));

	// If none of these work, returns the passed value unchanged.
	return npcString;
}
window.changeCNPCPregnancyTimer = changeCNPCPregnancyTimer;
DefineMacroS("changeCNPCPregnancyTimer", changeCNPCPregnancyTimer);

/**
 * @description Takes a compressed NPC and returns the current pregnancy timer value.
 * @param {string} npcString The compressed NPC string.
 * @returns {number} The current value of the pregnancy timer. Returns 0 if there is no timer.
 */
function getCNPCPregnancyTimer(npcString) {
	const match = npcString.match(/\.p(-?\d+)/);
	return match ? Number(match[1]) : 0;
}
window.getCNPCPregnancyTimer = getCNPCPregnancyTimer;
DefineMacro("getCNPCPregnancyTimer", getCNPCPregnancyTimer);

/**
 * @description Takes in a string containing a compressed npc and removes the pregnancy timer from them if they have one.
 * @param {string} npcString The NPC that has a pregnancy timer
 * @returns {string} The passed string without the prenancy timer.
 */
function removeCNPCPregnancyTimer(npcString) {
	// There is an event timer present
	if (npcString.indexOf(".t") > 0) return npcString.replace(/\.p-?\d+/, "");

	// No other timers
	return npcString.replace(/\.p-?\d+/, ".n");
}
window.removeCNPCPregnancyTimer = removeCNPCPregnancyTimer;
DefineMacro("removeCNPCPregnancyTimer", removeCNPCPregnancyTimer);

/**
 * @description Takes in a coded NPC string and modifies the NPC's event timer. Adds the timer if it's not present.
 * @param {string} npcString The NPC code that is to be modified.
 * @param {number} increment The amount of time added to the event timer.
 * @returns {string} The passed NPC code with the changed event timer.
 */
function changeCNPCEventTimer(npcString, increment) {
	// There is no timer, replace the no timer value (.n) with the event timer (.t) if the passed value isn't 0.
	if (npcString.indexOf(".n") > 0 && increment !== 0) return npcString.replace(".n", ".t" + increment);

	// The event timer is present so its value is changed.
	if (npcString.indexOf(".t") > 0)
		return npcString.replace(/\.t(\d+)/, (_str, p1) =>
			Number(p1) + increment !== 0 ? ".t" + (Number(p1) + increment) : npcString.indexOf(".p") > 0 ? "" : ".n"
		);

	// The pregnancy timer is present, add the event timer after the pregnancy timer
	if (npcString.indexOf(".p") > 0) return npcString.replace(/\.p(-?\d+)/, _str => _str + (increment !== 0 ? ".t" + increment : ""));

	// If none of these work, returns the passed value unchanged.
	return npcString;
}
window.changeCNPCEventTimer = changeCNPCEventTimer;
DefineMacroS("changeCNPCEventTimer", changeCNPCEventTimer);

/**
 * @description Takes a compressed NPC and returns the current event timer value.
 * @param {string} npcString The compressed NPC string.
 * @returns {number} The current value of the event timer. Returns 0 if there is no timer.
 */
function getCNPCEventTimer(npcString) {
	const match = npcString.match(/\.t(\d+)/);
	return match ? Number(match[1]) : 0;
}
window.getCNPCEventTimer = getCNPCEventTimer;
DefineMacro("getCNPCEventTimer", getCNPCEventTimer);

/**
 * @description Takes in a string containing a compressed npc and removes the event timer from them if they have one.
 * @param {string} npcString The NPC that has an event timer
 * @returns {string} The passed string without the event timer.
 */
function removeCNPCEventTimer(npcString) {
	// There is another timer present
	if (npcString.indexOf(".p") > 0) {
		return npcString.replace(/\.t(\d+)/, "");
	}

	// No other timers
	return npcString.replace(/\.t(\d+)/, ".n");
}
window.removeCNPCEventTimer = removeCNPCEventTimer;
DefineMacro("removeCNPCEventTimer", removeCNPCEventTimer);

/**
 * @description Takes in the passed NPCs and overwrites identical keys in the first NPC with the keys from the second NPC. Any keys not included in the first NPC, but are included the second NPC, will be added by the second NPC.
 * @param {object} generatedNPC The newly generated NPC that is going to be replaced by the decompressed NPC.
 * @param {object} decompressedNPC The decompressed NPC.
 * @returns {object} Returns a NPC object created from the second NPC overwriting identical keys in the first NPC.
 */
function mergeNPCData(generatedNPC, decompressedNPC) {
	return { ...generatedNPC, ...decompressedNPC };
}
window.mergeNPCData = mergeNPCData;
DefineMacro("mergeNPCData", mergeNPCData);

/**
 * @description Turns a date saved as a string to an object.
 * @param {string} dateString The date in ddmmyyyy format.
 * @param {boolean} stringMonth If true, then returns the month as it's string equivalent.
 * @returns {object} The passed date in {day:#, month:#, year:#} format. Values will be numbers. Month will be a string if stringMonth is true.
 */
const convertToDMYFormat = (dateString, stringMonth = false) => {
	const day = Number(dateString.slice(0, 2));
	let month = Number(dateString.slice(2, 4));
	const year = Number(dateString.slice(4));

	if (stringMonth)
		month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);

	return { day, month, year };
};
window.convertToDMYFormat = convertToDMYFormat;
DefineMacro("convertToDMYFormat", convertToDMYFormat);

/**
 * @description Turns a date saved as an object to a string.
 * @param {object} dateObject The passed date in {day:#, month:#, year:#} format. The day in either type Number or String. The month as either a number or string name. The year as a 4 digit number in either type Number or String.
 * @param {*} dateObject.day
 * @param {*} dateObject.month
 * @param {*} dateObject.year
 * @returns {string} The date in ddmmyyyy format.
 */
const convertToDDFormat = ({ day, month, year }) => {
	if (isNaN(month))
		month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);

	return "" + (day < 10 ? "0" + day : day) + (month < 10 ? "0" + month : month) + year.toString().padStart(4, "0");
};
window.convertToDDFormat = convertToDDFormat;
DefineMacro("convertToDDFormat", convertToDDFormat);

/**
 * @description Takes in a compressed child string and returns the child's conception date.
 * @param {string} childString A string that contains a compressed child's information.
 * @param {boolean} asString If true, returns the date in ddmmyyyy format.
 * @returns {object} Returns the date in {day:#, month:#, year:#} format. returns null if there is no conception date or an invalid date on the passed string.
 */
function getCChildConceptionDate(childString, asString = false) {
	let check = childString.match(/\.c\d+/);
	check = check ? check[0].slice(2) : null;

	if (check && !asString) return convertToDMYFormat(check);
	else return check;
}
window.getCChildConceptionDate = getCChildConceptionDate;
DefineMacro("getCChildConceptionDate", getCChildConceptionDate);

/**
 * @description Changes the conception date of the passed child string to the passed date. Adds the conceptino date if it is not present.
 * @param {string} childString A string that contains a compressed child's information.
 * @param {*} date The new date. can be in ddmmyyyy, {day:#, month:String, year:#}, or {day:#, month:#, year:#} format.
 * @returns {string} The child string with the new date in place of the old one.
 */
function changeCChildConceptionDate(childString, date) {
	if (typeof date === "object") date = convertToDDFormat(date);

	if (childString.includes(".c")) childString = childString.replace(/.c\d+/, ".c" + date);
	else childString = childString.slice(0, childString.indexOf(".")) + ".c" + date + childString.slice(childString.indexOf("."));

	return childString;
}
window.changeCChildConceptionDate = changeCChildConceptionDate;
DefineMacro("changeCChildConceptionDate", changeCChildConceptionDate);

/**
 * @description Removes the conceptino date from the child string if it is present.
 * @param {string} childString A string that contains a compressed child's information.
 * @returns {string} The child string with without the conception date.
 */
function removeCChildConceptionDate(childString) {
	if (childString.includes(".c")) childString = childString.replace(/.c\d+/, "");
	return childString;
}
window.removeCChildConceptionDate = removeCChildConceptionDate;
DefineMacro("removeCChildConceptionDate", removeCChildConceptionDate);

/**
 * @description Takes in a compressed child string and returns the child's birth date.
 * @param {string} childString A string that contains a compressed child's information.
 * @returns {object} Returns the date in {day:#, month:#, year:#} format. returns null if there is no birth date or an invalid date on the passed string.
 */
function getCChildBirthDate(childString) {
	let check = childString.match(/\.b\d+/);
	check = check ? check[0].slice(2) : null;

	if (check) return convertToDMYFormat(check);
	else return check;
}
window.getCChildBirthDate = getCChildBirthDate;
DefineMacro("getCChildBirthDate", getCChildBirthDate);

/**
 * @description Changes the birth date of the passed child string to the passed date. Adds the birth date if it is not present.
 * @param {string} childString A string that contains a compressed child's information.
 * @param {*} date The new date. can be in ddmmyyyy, {day:#, month:String, year:#}, or {day:#, month:#, year:#} format.
 * @returns {string} The child string with the new date in place of the old one.
 */
function changeCChildbirthDate(childString, date) {
	if (typeof date === "object") date = convertToDDFormat(date);

	if (childString.includes(".b")) childString = childString.replace(/.b\d+/, ".b" + date);
	else childString = childString.slice(0, childString.indexOf(".")) + ".b" + date + childString.slice(childString.indexOf("."));

	return childString;
}
window.changeCChildbirthDate = changeCChildbirthDate;
DefineMacro("changeCChildbirthDate", changeCChildbirthDate);

/**
 * @description Removes the birth date from the child string if it is present.
 * @param {string} childString A string that contains a compressed child's information.
 * @returns {string} The child string with without the birth date.
 */
function removeCChildBirthDate(childString) {
	if (childString.includes(".b")) childString = childString.replace(/.b\d+/, "");
	return childString;
}
window.removeCChildBirthDate = removeCChildBirthDate;
DefineMacro("removeCChildBirthDate", removeCChildBirthDate);

/**
 * @description Takes in a compressed child string and returns the child's childId.
 * @param {string} childString A string that contains a compressed child's information.
 * @returns {boolean} Returns false if there is no child ID or an invalid Id on the passed string.
 */
function getCChildId(childString) {
	let check = childString.match(/\.i-?\d+\.-?\d+\|-?\d+\.-?\d+/);
	check = check ? check[0].slice(2) : false;
	return check;
}
window.getCChildId = getCChildId;
DefineMacro("getCChildId", getCChildId);

/**
 * @description Takes in a child string and changes the child Id value on the end of the string.
 * @param {string} childString A string that contains a compressed child's information.
 * @param {string} id The new id that will be used. Pass a full id: x.x|x.x, a partial id: x.x, or a singe number for both, single parent, or single value respectively.
 * @param {number} parentChoice 0: Changes entire Id, 1: just the mother's Id, 2: just the father's Id.
 * @param {number} birthNumber 0 for nothing, 1 for the parent, 2 for the birth number
 */
function changeCChildId(childString, id, parentChoice = 0, birthNumber = 0) {
	const cId = getCChildId(childString);

	if (!cId) return childString;

	if (parentChoice === 0) childString = childString.replace(".i" + cId, ".i" + id);
	else if (parentChoice === 1) {
		if (birthNumber === 2) childString = childString.replace(/\.-?\d+\|/, "." + id + "|");
		else if (birthNumber === 1) childString = childString.replace(/\.i-?\d+/, ".i" + id);
		else childString = childString.replace(/\.i-?\d+\.-?\d+/, ".i" + id);
	} else if (parentChoice === 2) {
		if (birthNumber === 2) childString = childString.replace(/\.-?\d+$/, "." + id);
		else if (birthNumber === 1) childString = childString.replace(/\|-?\d+\./, "|" + id + ".");
		else childString = childString.replace(/-?\d+\.-?\d+$/, id);
	}

	return childString;
}
window.changeCChildId = changeCChildId;
DefineMacro("changeCChildId", changeCChildId);

/**
 * @description Takes in an object that contains npcs or children objects and compares them before and after compression.
 * @param {object} npcList An object that contains at least one npc or child object.
 * @param {boolean} result If true, returns an array containing whether each passed npc/child is correctly compressed.
 * @param {boolean} detail Prints basic details to the console if true.
 * @param {boolean} verboseDetail Prints more extensive details to the console if true.
 * @returns {boolean} True is all values are the same for the passed NPCs or children. Returns false otherwise
 */
function compressionVerifier(npcList, result = true, detail = false, verboseDetail = false) {
	let npcAsString = "";
	const returnOutput = [];
	let decompressedNPCString, currentNPC, type, textOutput, name; //, startTime, endTime, compressTime, decopmressTime, compressTimeAvg, decopmressTimeAvg;
	// const { performance } = require('perf_hooks');

	const { compareKeys, findDiffKeys, compareValues, findDiffValue, findByteSize, trun } = (function () {
		// Gets all keys in an object, including those in a nested object
		function getAllKeys(passedObject) {
			let list = Object.keys(passedObject);
			list.forEach(key => {
				// console.log(`key: ${key}; type: ${typeof passedObject[key]}`);
				if (typeof passedObject[key] === "object") list = list.concat(Object.keys(passedObject[key]));
			});

			return list;
		}

		// compares the keys of two objects to see if they are the same.
		function compareKeys(a, b) {
			const aKeys = getAllKeys(a).sort();
			const bKeys = getAllKeys(b).sort();
			return JSON.stringify(aKeys) === JSON.stringify(bKeys);
		}

		// finds the different keys between two objects
		function findDiffKeys(a, b, inObj = null, caught = []) {
			const aKeys = Object.keys(a).sort();
			const bKeys = Object.keys(b).sort();
			let str;

			aKeys.forEach(key => {
				str = `Second list missing key: ${key}`;
				if (typeof a[key] === "object") caught = caught.concat(findDiffKeys(a[key], b[key], key, caught));
				if (inObj) str += ` in object ${inObj}`;

				if (!bKeys.includes(key) && !caught.includes(key)) {
					caught.push(key);
					console.log(str.padEnd(38) + "\n");
				}
			});

			bKeys.forEach(key => {
				str = `First  list missing key: ${key}`;
				if (typeof b[key] === "object") caught = caught.concat(findDiffKeys(a[key], b[key], key, caught));

				if (inObj) {
					str += ` in object ${inObj}`;
				}

				if (!aKeys.includes(key) && !caught.includes(key)) {
					caught.push(key);
					console.log(str.padEnd(38) + "\n");
				}
			});

			return caught;
		}

		// compares the values of two objects to see if they are the same.
		function compareValues(a, b) {
			let equal = true;

			if (compareKeys(a, b)) {
				Object.keys(a).forEach(key => {
					if (typeof a[key] === "object") equal = compareValues(a[key], b[key]);
					else if (a[key] !== b[key]) equal = false;
				});
			} else {
				equal = false;
			}

			return equal;
		}

		// finds the values that are different between two objects with the same keys
		function findDiffValue(a, b, inObj = null) {
			let temp = "";

			Object.keys(a).forEach(key => {
				if (typeof a[key] === "object") findDiffValue(a[key], b[key], key);
				else if (a[key] !== b[key]) {
					if (inObj) temp = ` in object ${inObj}`;
					console.log(`Key ${key}${temp} has mismatched values. First list = ${a[key]} and second list = ${b[key]}`);
				}
			});
		}

		// finds the size of a passed string or object.
		function findByteSize(input) {
			let str = null;
			if (typeof input === "string") str = input;
			else str = JSON.stringify(input);
			const bytes = new TextEncoder().encode(str).length;
			return bytes;
		}

		// truncates a value to the desired number of places.
		function trun(value, places) {
			return Math.floor(value * 10 ** places) / 10 ** places;
		}

		return { compareKeys, findDiffKeys, compareValues, findDiffValue, findByteSize, trun };
	})();

	Object.keys(npcList).forEach(key => {
		currentNPC = npcList[key];

		// if (verboseDetail) {compressTime = 0; decopmressTime = 0; compressTimeAvg = 0; decopmressTimeAvg = 0;}

		if (Object.keys(currentNPC).includes("childId")) {
			name = currentNPC.name;
			type = "Child";

			// if (verboseDetail) startTime = performance.now()
			npcAsString = childCompressor(currentNPC);
			// if (verboseDetail) {endTime = performance.now(); compressTime = endTime - startTime; compressTimeAvg += compressTime;}

			// if (verboseDetail) startTime = performance.now()
			decompressedNPCString = childDecompressor(npcAsString, name);
			// if (verboseDetail) {endTime = performance.now(); decopmressTime = endTime - startTime; decopmressTimeAvg += decopmressTime;}
		} else {
			type = "NPC";
			// if (verboseDetail) startTime = performance.now()
			npcAsString = npcCompressor(currentNPC);
			// if (verboseDetail) {endTime = performance.now(); compressTime = endTime - startTime; compressTimeAvg += compressTime;}

			// if (verboseDetail) startTime = performance.now()
			decompressedNPCString = npcDecompressor(npcAsString);
			// if (verboseDetail) {endTime = performance.now(); decopmressTime = endTime - startTime; decopmressTimeAvg += decopmressTime;}
		}

		if (detail) {
			console.log("-".repeat(70));
			console.log(("Testing " + type + ":").padEnd(21, " ") + key);
		}

		if (verboseDetail) {
			console.log("Compressed string:   " + npcAsString);
			const cSize = findByteSize(npcAsString);
			const dSize = findByteSize(currentNPC);
			console.log("compressed size:     " + cSize);
			console.log("decompressed size:   " + dSize);
			console.log("size reduction:      " + trun((1 - cSize / dSize) * 100, 2) + "%");
			// console.log("compression time:    " + trun(compressTime, 3).toString().padEnd(5, " ") + " miliseconds")
			// console.log("decompression time:  " + trun(decopmressTime, 3).toString().padEnd(5, " ") + " miliseconds")
		}

		const keyStatus = compareKeys(currentNPC, decompressedNPCString);
		const valueStatus = compareValues(currentNPC, decompressedNPCString);

		// console.log(`keyStatus: ${keyStatus}, valueStatus ${valueStatus}`);

		if (!keyStatus || !valueStatus) {
			if (!keyStatus) {
				if (detail) console.log("\nKeys");
				findDiffKeys(currentNPC, decompressedNPCString);
				returnOutput.push(false);
			}
			if (!valueStatus) {
				if (detail) console.log("\nValues");
				findDiffValue(currentNPC, decompressedNPCString);
				returnOutput.push(false);
			}
		} else {
			textOutput = "\nAll keys and their values match for " + type + " " + key;
			returnOutput.push(true);
		}

		if (detail) {
			console.log(textOutput);
			console.log();
		}
	});

	// if (verboseDetail) {
	//     var count = Object.keys(npcList).length;
	//     console.log("-".repeat(70));
	//     console.log("average compression time:    " + trun(compressTimeAvg/count, 5).toString().padEnd(7, " ") + " miliseconds")
	//     console.log("average edcompression time:  " + trun(decopmressTimeAvg/count, 5).toString().padEnd(7, " ") + " miliseconds")
	//     console.log();
	// // (type + " " + key).padEnd(15," ") +
	// }

	if (result) return returnOutput;
}
window.compressionVerifier = compressionVerifier;
DefineMacro("compressionVerifier", compressionVerifier);
