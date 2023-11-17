const Furniture = (() => {
	setup.furniture = new Map();

	/* Keep set to false, unless during developer testing. If on true, set to false unless in use. */
	const FORCE_UPDATE = false; /* IMPORTANT: Switch to false before the next update. */
	const DEBUG_ENABLED = false;

	const print = (...args) => {
		if (DEBUG_ENABLED) console.debug(...args);
	};

	const Categories = Object.freeze({
		/* Generic categories */
		bed: "bed",
		table: "table",
		chair: "chair",
		desk: "desk",
		wardrobe: "wardrobe",
		decoration: "decoration",
		windowsill: "windowsill",
		poster: "poster",
		wallpaper: "wallpaper",
		/* Special category for Kylar event */
		owlplushie: "owlplushie",
		/* 北极星模组 */
		television: "television",
		gameconsole: "gameconsole",
		pc: "pc",
		bookshelf: "bookshelf",
		mirror: "mirror",
		/* 北极星 */
	});

	const Locations = Object.freeze({
		bedroom: "bedroom",
		cabin: "cabin",
		cottage: "cottage",
		/* 北极星模组 */
		lakehouse: "lakehouse",
		/* 北极星 */
	});

	let target = Locations.bedroom;

	function furnitureInit() {
		const mapper = setup.furniture;

		/*
		mapper.chairs.set('name', {
			name: "stools",					Name in lowercase.
			nameCap: "Wooden stools",		Capitalised name.
			category: ["chair"],			Used in the shop interface.
			type: ["chair", "expensive"],	Traits, can be multiple, shouldn't be shown because I'm too lazy to make a description /j
			cost: 160,						Cost, 100 is one pound.
			description: "A set of stools on which to sit on.",			Description for the shop interface to show.
			iconFile: "stool.png",			Used in image widgets; <img class="icon" @src="'img/misc/icon/furniture/' + $_chair.iconFile">
		});

		Egg armchairs are here to stay.
		Egg.
		*/

		/* ------------- CHAIRS ------------- */
		mapper.set("chair", {
			name: "chair",
			nameCap: "Chair",
			article: "a",
			nameSolo: "chair",
			category: ["chair"],
			type: ["starter"],
			cost: 0,
			description: "An old, hand-me-down chair. Wobbly and uncomfortable.",
			iconFile: "basicChair.png",
			iconFile2: "basicChairDesk.png",
			tier: 0,
		});
		mapper.set("stool", {
			name: "stools",
			nameCap: "Wooden stools",
			article: "a",
			nameSolo: "wooden stool",
			category: ["chair"],
			type: [],
			cost: 460,
			description: "A set of stools. Uncomfortable, but better than nothing.",
			iconFile: "stool.png",
			iconFile2: "stoolDesk.png",
			tier: 0,
		});
		mapper.set("woodenchair", {
			name: "wooden chairs",
			nameCap: "Wooden chairs",
			article: "a",
			nameSolo: "wooden chair",
			category: ["chair"],
			type: [],
			cost: 1280,
			description: "A set of regular wooden chairs. Not the most comfortable.",
			iconFile: "chair.png",
			iconFile2: "chairDesk.png",
			tier: 0,
		});
		mapper.set("swivelchair", {
			name: "swivel chairs",
			nameCap: "Swivel chairs",
			article: "a",
			nameSolo: "swivel chair",
			category: ["chair"],
			type: ["comfy"],
			cost: 1480,
			description: "A pair of swivel chairs. Comfortable and ergonomic.",
			iconFile: "swivelChair.png",
			iconFile2: "swivelChairDesk.png",
			tier: 1,
		});
		mapper.set("shellchair", {
			name: "shell chairs",
			nameCap: "Shell chairs",
			article: "a",
			nameSolo: "shell chair",
			category: ["chair"],
			type: ["comfy"],
			cost: 1750,
			description: "A set of wheeled chairs with a shell-shaped back. Luxurious.",
			iconFile: "shellChair.png",
			iconFile2: "shellChairDesk.png",
			tier: 1,
		});
		mapper.set("armchair", {
			name: "armchairs",
			nameCap: "Armchairs",
			article: "an",
			nameSolo: "armchair",
			category: ["chair"],
			type: ["comfy"],
			cost: 1970,
			description: "A set of armchairs. Soft, relaxing, and expensive.",
			iconFile: "armchair.png",
			iconFile2: "armchairDesk.png",
			tier: 1,
		});
		mapper.set("egg", {
			name: "egg armchairs",
			nameCap: "Egg armchairs",
			article: "an",
			nameSolo: "egg armchair",
			category: ["chair"],
			type: ["comfy"],
			cost: 2420,
			description: "A set of armchairs with a rounded back, in exotic colours. A chore to set up.",
			iconFile: "armchairegg.png",
			iconFile2: "armchaireggDesk.png",
			tier: 1,
		});

		/* ------------- TABLES ------------- */
		mapper.set("woodentable", {
			name: "wooden table",
			nameCap: "Wooden table",
			category: ["table"],
			type: [],
			cost: 1100,
			description: "Can be used as a working or gathering spot. Just add chairs.",
			iconFile: "table.png",
			tier: 0,
		});
		mapper.set("marbletable", {
			name: "marble-topped table",
			nameCap: "Marble-topped table",
			category: ["table"],
			type: [],
			cost: 1430,
			description: "A regular wooden table with a twist.",
			iconFile: "marbletable.png",
			tier: 1,
		});

		/* ------------- DESKS ------------- */
		mapper.set("desk", {
			name: "basic desk",
			nameCap: "Basic desk",
			category: ["desk"],
			type: ["stable", "starter"],
			cost: 0,
			description: "An old, hand-me-down desk. Desecrated with carvings from orphans of yesteryear.",
			iconFile: "desk.png",
		});
		mapper.set("deskGlass", {
			name: "glass desk",
			nameCap: "Glass desk",
			category: ["desk"],
			type: ["fragile"],
			cost: 1250,
			description: "A sleek, contemporary desk. Breakable.",
			iconFile: "deskGlass.png",
		});
		mapper.set("deskMidcentury", {
			name: "mid-century modern desk",
			nameCap: "Mid-century modern desk",
			category: ["desk"],
			type: ["stable"],
			cost: 1550,
			description: "A simple desk with modernist appeal. Popular in the mid-twentieth century.",
			iconFile: "deskMidcentury.png",
		});
		mapper.set("deskAntique", {
			name: "antique desk",
			nameCap: "Antique desk",
			category: ["desk"],
			type: ["sturdy"],
			cost: 3820,
			description: "An ornate, antique desk. Built to last a lifetime.",
			iconFile: "deskAntique.png",
		});

		/* ------------- BEDS ------------- */
		mapper.set("bed", {
			name: "basic bed",
			nameCap: "Basic bed",
			category: ["bed"],
			type: ["single", "starter"],
			cost: 0,
			description: "An old, poor bed. Uncomfortable.",
			iconFile: "bed.png",
			tier: 0,
		});
		mapper.set("singlebed", {
			name: "single bed",
			nameCap: "Single bed",
			category: ["bed"],
			type: ["single"],
			cost: 1680,
			description: "A bed for one.",
			iconFile: "singlebed.png",
			tier: 0,
		});
		mapper.set("singlebeddeluxe", {
			name: "deluxe single bed",
			nameCap: "Deluxe single bed",
			category: ["bed"],
			type: ["single", "comfy"],
			cost: 2400,
			description: "An ergonomically designed bed. Very comfortable.",
			iconFile: "singlebeddeluxe.png",
			tier: 1,
		});
		mapper.set("doublebed", {
			name: "double bed",
			nameCap: "Double bed",
			category: ["bed"],
			type: ["double"],
			cost: 3400,
			description: "A simple bed. Fits two.",
			iconFile: "doublebed.png",
			tier: 1,
			showCheck: "notBedroom",
		});
		mapper.set("doublebeddeluxe", {
			name: "deluxe double bed",
			nameCap: "Deluxe double bed",
			category: ["bed"],
			type: ["double", "comfy"],
			cost: 2840,
			description: "A beautiful bed with a soft mattress. Very comfortable, fits two.",
			iconFile: "doublebeddeluxe.png",
			tier: 2,
			showCheck: "notBedroom",
		});
		mapper.set("doublebedexotic", {
			name: "exotic double bed",
			nameCap: "Exotic double bed",
			category: ["bed"],
			type: ["double", "comfy"],
			cost: 4884,
			description: "A bed made in a contemporary, minimalist style. Very comfortable, fits two.",
			iconFile: "doublebedexotic.png",
			tier: 2,
			showCheck: "notBedroom",
		});
		mapper.set("doublebedwicker", {
			name: "wicker double bed",
			nameCap: "Wicker double bed",
			category: ["bed"],
			type: ["double", "comfy"],
			cost: 4860,
			description: "An authentic bed on a rattan frame. Very comfortable, fits two.",
			iconFile: "doublebedwicker.png",
			tier: 2,
			showCheck: "notBedroom",
		});

		/* ------------- MISC ------------- */
		mapper.set("plantpot", {
			name: "plant pot",
			nameCap: "Plant pot",
			category: ["windowsill"],
			type: [],
			cost: 680,
			description: "A clay pot with good soil. Flowers come pre-planted. Can be put on your windowsill.",
			iconFile: "flower.png",
		});
		mapper.set("bunnySucculent", {
			name: "bunny succulent",
			nameCap: "Bunny succulent",
			category: ["windowsill"],
			type: [],
			cost: 840,
			description: "A cement planter for small succulents. Pre-planted with 'Monilaria obconica', also known as a bunny succulent.",
			iconFile: "bunnySucculent.png",
		});
		mapper.set("jar", {
			name: "jar",
			nameCap: "Jar",
			category: ["windowsill"],
			type: [],
			cost: 1380,
			description: "A cylindrical jar. Can be put on your windowsill.",
			iconFile: "jar.png",
		});

		/* ------------- DECORATIONS ------------- */
		mapper.set("calendar", {
			name: "calendar",
			nameCap: "Calendar",
			category: ["decoration"],
			type: [],
			cost: 360,
			description: "The days of this calendar are numbered.",
			iconFile: "calendar.png",
		});
		mapper.set("painting", {
			name: "painting",
			nameCap: "Painting",
			category: ["decoration"],
			type: [],
			cost: 680,
			description: "It's not actually a painting. It's an illustration. ",
			iconFile: "painting.png",
		});
		mapper.set("banner", {
			name: "banner",
			nameCap: "Banner",
			category: ["decoration"],
			type: [],
			cost: 620,
			description: "A figure from an old movie is poised in the centre.",
			iconFile: "banner.png",
		});
		mapper.set("bannerlewd", {
			name: "lewd banner",
			nameCap: "Lewd banner",
			category: ["decoration"],
			type: [],
			cost: 790,
			description: "A banner with a tentacle.",
			iconFile: "banner.png",
		});
		mapper.set("bannerfestive", {
			name: "festive banner",
			nameCap: "Festive banner",
			category: ["decoration"],
			type: [],
			cost: 670,
			description: "It may or may not be in season, but it still looks cool.",
			iconFile: "bannerfestive.png",
		});
		mapper.set("bearplushie", {
			name: "large bear plushie",
			nameCap: "Large bear plushie",
			category: ["decoration"],
			type: [],
			cost: 1380,
			description: "Soft, cuddly and forever loyal.",
			iconFile: "bearplushie.png",
		});
		mapper.set("owlplushie", {
			name: "owl plushie",
			nameCap: "Owl plushie",
			category: ["owlplushie"],
			type: [],
			cost: 0,
			description: "Large eyes stare at the world.",
			iconFile: "owlplushie.png",
			showCheck: "disabled",
		});
		/* ------------- WARDROBES ------------- */
		/*	starter - 20 clothing slots for every type
			spacious - 30 clothing slots for every type
			organised - 40 clothing slots for every type */
		mapper.set("wardrobe", {
			name: "creaky wardrobe",
			nameCap: "Creaky wardrobe",
			category: ["wardrobe"],
			type: ["starter"],
			cost: 0,
			description: "An old, creaky wardrobe. Doesn't hold much.",
			iconFile: "wardrobe.png",
			tier: 0,
			showCheck: "disabled",
		});
		mapper.set("wardrobebasic", {
			name: "wardrobe",
			nameCap: "Wardrobe",
			category: ["wardrobe"],
			type: ["spacious"],
			cost: 3160,
			description: "A basic wardrobe cabinet.",
			iconFile: "wardrobebasic.png",
			tier: 1,
			showCheck: "isWardrobeHigherTier",
		});
		mapper.set("armoire", {
			name: "armoire",
			nameCap: "Armoire",
			category: ["wardrobe"],
			type: ["spacious"],
			cost: 3258,
			description: "A spacious wooden armoire.",
			iconFile: "armoire.png",
			tier: 1,
			showCheck: "isWardrobeHigherTier",
		});
		mapper.set("organiser", {
			name: "organiser wardrobe",
			nameCap: "Organiser wardrobe",
			category: ["wardrobe"],
			type: ["organiser"],
			cost: 4296,
			description: "A wardrobe with a lot of space.",
			iconFile: "wardrobeorganiser.png",
			tier: 2,
			showCheck: "isWardrobeHigherTier",
		});
		mapper.set("carved", {
			name: "carved armoire",
			nameCap: "Carved armoire",
			category: ["wardrobe"],
			type: ["organiser"],
			cost: 4620,
			description: "Carved by hand, it holds several drawers and garment rods.",
			iconFile: "armoirecarved.png",
			tier: 2,
			showCheck: "isWardrobeHigherTier",
		});
		/* --------------- POSTERS --------------- */
		mapper.set("poster", {
			name: "blank poster",
			nameCap: "Blank poster",
			category: ["poster"],
			type: ["poster", "starter"],
			cost: 135,
			description: "The poster is currently empty.",
			iconFile: "poster.png",
		});
		/* ------------- WALLPAPERS -------------- */
		mapper.set("wallpaper", {
			name: "blank wallpaper",
			nameCap: "Blank wallpaper",
			category: ["wallpaper"],
			type: ["wallpaper", "starter"],
			cost: 135,
			description: "The wallpaper is currently empty.",
			iconFile: "wallpaper.png",
		});
		/* 北极星模组 */
		/* ------------- TELEVISION -------------- */
		mapper.set("tv", {
			name: "television",
			nameCap: "电视",
			category: ["television"],
			type: [],
			cost: 3000,
			description: "一台电视。",
			iconFile: "indent.png",
		});
		/* ------------ GAME CONSOLE ------------- */
		mapper.set("gameconsole", {
			name: "game console",
			nameCap: "游戏机",
			category: ["gameconsole"],
			type: [],
			cost: 400,
			description: "一台游戏机。",
			iconFile: "arcade.gif",
		});
		/* ----------------- PC ------------------ */
		mapper.set("pc", {
			name: "personal computer",
			nameCap: "私人电脑",
			category: ["pc"],
			type: [],
			cost:5000,
			description: "一台电脑。",
			iconFile: "headdesk.png",
		});
		/* -------------- BOOKSHELF -------------- */
		mapper.set("bookshelf", {
			name: "bookshelf",
			nameCap: "书架",
			category: ["bookshelf"],
			type: [],
			cost: 2000,
			description: "一个书架。",
			iconFile: "library.png",
		});
		/* ---------------- MIRROR --------------- */
		mapper.set("mirror", {
			name: "mirror",
			nameCap: "镜子",
			category: ["mirror"],
			type: [],
			cost: 2000,
			description: "一面酷得昂贵的镜子。",
			iconFile: "mirrorhome.png",
		});
		/* 北极星 */
	}

	function furnitureGet(category, onlySetup = false) {
		print("Furniture.get > getting:", category);
		if (typeof category !== "string") {
			print("Furniture.Get expected an argument of type: string.", category);
			return null;
		}
		if (onlySetup) {
			return setup.furniture.get(category);
		}
		if (!V) {
			print("Furniture.Get called before SugarCube is ready, postpone execution next time.", category);
			return null;
		}
		const area = V.furniture[target];
		if (typeof area !== "object" && area === null) {
			print("Furniture.Get called with a location that doesn't exist:", target, area);
			return null;
		}
		const current = area[category];
		if (typeof current === "object" && current !== null) {
			const defaults = setup.furniture.get(current.id);
			const composite = Object.assign({}, defaults, current);
			return composite;
		} else {
			return null;
		}
	}

	function furnitureSet(id, category, overrides) {
		print("Furniture.set > setting:", id, category, overrides);
		if (!setup.furniture.has(id)) {
			Errors.report(`Furniture.Set was incorrectly passed an id not listed in furniture: ${id}`);
			return false;
		}
		if (!Categories[category]) {
			Errors.report(`Furniture.Set was incorrectly passed an invalid category : ${category}`);
			return false;
		}
		const home = V.furniture[target];

		home[category] = { id };
		if (typeof overrides === "object" && overrides !== null) {
			/* Object.defineProperties(home[category], propertyMap); */
			Object.assign(home[category], overrides);
		}
		// Log the id in case mistakes in the future occur and we need to track previous ownership.
		furnitureLog(id);
		return true;
	}

	function furnitureDelete(category) {
		print("Furniture.delete > Deleting:", category);
		delete V.furniture[target][category];
		return true;
	}

	function furnitureIn(location) {
		if (Object.values(Locations).includes(location)) {
			target = location;
		} else {
			Errors.report(`Location provided (${location}) does not exist in the furniture system.`);
		}
		return Furniture;
	}

	function furnitureUpdate(fromBackComp = false) {
		print("Furniture.update > Updating - from backcomp:", fromBackComp);
		const versions = V.objectVersion;
		let wallpaper;
		let decoration;
		let poster;
		if (versions.furniture === undefined || FORCE_UPDATE) {
			versions.furniture = 0;
		}
		switch (versions.furniture) {
			case 0:
				V.furniturePriceFactor = 1;
				V.furniture = {
					bedroom: {
						bed: {
							id: "bed",
						},
						wardrobe: {
							id: fromBackComp ? "organiser" : "wardrobe",
						},
						desk: {
							id: "desk",
						},
					},
				};
				wardrobeSpaceUpdater();
			// eslint-disable-next-line no-fallthrough
			case 1:
				/* Set the target to the bedroom in the unlikely event it wasn't preset. */
				furnitureIn(Locations.bedroom);
				/* Search for the wallpaper object, returns null if not found. */
				wallpaper = furnitureGet(Categories.wallpaper);
				if (wallpaper != null && wallpaper.name.includes("<<")) {
					const name = Util.escape(wallpaper.name);
					furnitureSet("wallpaper", Categories.wallpaper, {
						name,
						nameCap: name.toUpperFirst(),
					});
				}
				/* Search for the poster object, returns null if not found. */
				poster = furnitureGet(Categories.poster);
				if (poster != null && poster.name.includes("<<")) {
					const name = Util.escape(poster.name);
					furnitureSet("poster", Categories.poster, {
						name,
						nameCap: name.toUpperFirst(),
					});
				}
				versions.furniture = 2;
			// eslint-disable-next-line no-fallthrough
			case 2:
				/* Start log of existing items owned. */
				updaterLogAll();
				/* Fix owl-plushie being in the decoration category, as it can then be deleted,
					or potentially lock out decorations in the current system. */
				furnitureIn(Locations.bedroom);
				decoration = furnitureGet(Categories.decoration);
				if (decoration !== null && decoration.id === "owlplushie") {
					furnitureSet("owlplushie", Categories.owlplushie, {
						name: "owl plushie",
						nameCap: "Owl plushie",
					});
					furnitureDelete(Categories.decoration);
				}
				if ([2, 4, 7].includes(V.kylar_camera)) {
					furnitureSet("owlplushie", Categories.owlplushie, {
						name: "owl plushie",
						nameCap: "Owl plushie",
					});
				}
				versions.furniture = 3;
				break;
		}
	}

	function getWardrobeTier(wardrobe) {
		const type = wardrobe.type.find(e => ["spacious", "organiser"].includes(e)) || "starter";
		const tier = { starter: 0, spacious: 1, organiser: 2 }[type];
		return tier;
	}

	function isWardrobeHigherTier(wardrobe) {
		const current = Furniture.get("wardrobe");
		if (current) {
			const targetTier = getWardrobeTier(wardrobe);
			const currentTier = getWardrobeTier(current);
			if (targetTier <= currentTier) {
				return false;
			}
		}
		return true;
	}

	function showFn(item) {
		switch (item.showCheck) {
			case "isWardrobeHigherTier":
				// console.log("isWardrobeHigherTier", isWardrobeHigherTier(item));
				return isWardrobeHigherTier(item);
			case "notBedroom":
				// console.log("notBedroom", target !== "bedroom", target);
				return target !== "bedroom";
			case "disabled":
				// console.log("disabled");
				return false;
			default:
				return null;
		}
	}

	function wardrobeSpaceUpdater() {
		const wardrobe = V.wardrobe;
		const furniture = furnitureGet("wardrobe");
		if (typeof furniture !== "object") return;
		if (!(furniture.type instanceof Array)) return;
		/* Wardrobe object appears to be good: Is an object, type is an array. */
		if (furniture.type.includes("organiser")) {
			wardrobe.space = 40;
		} else if (furniture.type.includes("spacious")) {
			wardrobe.space = 30;
		} else {
			wardrobe.space = 20;
		}
	}

	function setPrice(pounds, pence = 0) {
		return Math.floor((pounds * 100 + pence) * V.furniturePriceFactor);
	}

	function updaterLogAll() {
		print("updaterLogAll > Logging all existing items.");
		for (const location in V.furniture) {
			const items = V.furniture[location];
			if (typeof items !== "object" || items === null) continue;
			for (const key in items) {
				const item = items[key];
				if (typeof item !== "object" || item === null) continue;
				furnitureLog(item.id);
			}
		}
	}

	function furnitureLog(id) {
		print("Furniture.log > Logging:", id);
		// Ensure furniture log exists.
		if (!Array.isArray(V.furnitureLog)) V.furnitureLog = [];
		if (!V.furnitureLog.includes(id)) V.furnitureLog.push(id);
	}

	/* Call the initiator function immediately. This happens when the game starts up and is loading. (Spinny wheel) */
	furnitureInit();

	return Object.freeze({
		init: furnitureInit,
		get: furnitureGet,
		set: furnitureSet,
		delete: furnitureDelete,
		in: furnitureIn,
		update: furnitureUpdate,
		wardrobeUpdate: wardrobeSpaceUpdater,
		log: furnitureLog,
		setPrice,
		showFn,
		get target() {
			return target;
		},
	});
})();
window.Furniture = Furniture;
