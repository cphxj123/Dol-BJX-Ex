setup.colours = {
	// Canvas renderer filters applied to different sprite palettes
	sprite_prefilters: {
		grayscale: {
			// For grayscale sprites with #808080 base
			desaturate: false,
			brightness: 0.0,
			contrast: 1.0,
		},
		hair: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		hair_fringe: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		brows: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		pbhair: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		eyes: {
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		clothes: {
			// For red-base clothes
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		clothes_bright: {
			// For red-base clothes with brighter, hair-like palette
			desaturate: true,
			brightness: 0.0,
			contrast: 1.0,
		},
		mascara: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		lipstick: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		eyeshadow: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
		condom: {
			desaturate: true,
			brightness: 0.4,
			contrast: 1.0,
		},
	},

	// Empty collections are populated later in this file
	hair: [],
	hair_map: {}, // Maps are auto-generated in the end of file
	hair_default: {
		// Default canvas filter options
		blendMode: "hard-light",
	},
	eyes: [],
	eyes_map: {},
	eyes_default: {
		blendMode: "hard-light",
	},
	clothes: [],
	clothes_map: {},
	clothes_default: {
		blendMode: "hard-light",
	},
	mascara: [],
	mascara_map: {},
	mascara_default: {
		blendMode: "hard-light",
	},
	lipstick: [],
	lipstick_map: {},
	lipstick_default: {
		blendMode: "hard-light",
	},
	eyeshadow: [],
	eyeshadow_map: {},
	eyeshadow_default: {
		blendMode: "hard-light",
	},
	condom: [],
	condom_map: {},
	condom_default: {
		blendMode: "hard-light",
	},

	skin_gradients: {
		light: ["#ffffff", "#ffd2ac"],
		medium: ["#ffd2ac", "#8a614d"],
		dark: ["#8a614d", "#39241a"],
		gyaru: ["#ffffff", "#ffd2ac", "#8a614d", "#39241a"],
		ylight: ["#f0ffe6", "#f0e4bc"],
		ymedium: ["#f0e4bc", "#8e7f68"],
		ydark: ["#8e7f68", "#483f35"],
		ygyaru: ["#f0ffe6", "#f0e4bc", "#8e7f68", "#483f35"],
		/* 北极星模组 */
		ghostly: ["#DBFFFF", "#DBFFFF"],
		ice: ["#E3FFFE", "#E3FFFE"],
		slimy: ["#CBFFCB", "#98FF98"],
		chilly: ["#a9eaf7", "#51dbff"],
		amethyst: ["#BBA9f5", "#8451FC"],
		green: ["#B5C47A", "#81A558"],
		dusky: ["#cfcba8", "#cfcba8"],
		water: ["#c3dfff", "#c3dfff"],
		flame: ["#FAC0C0", "#FAC0C0"],
		/* 北极星 */
	},
	/**
	 * Get canvas filter for skin of given type and tan progression (0..1).
	 *
	 * @param {any} type
	 * @param {any} tan
	 */
	getSkinFilter(type, tan) {
		return {
			blend: setup.colours.getSkinRgb(type, tan),
			blendMode: "multiply",
		};
	},
	getSkinRgb(type, tan) {
		tan = Math.clamp(0, tan, 1);
		const gradient = setup.colours.skin_gradients[type];
		if (!gradient) {
			Errors.report("Unknown skin gradient " + type);
			return "#ffffff";
		}
		return Renderer.lintRgbStaged(tan, gradient).toHexString();
	},
	/**
	 * Get CSS style filter that, when applied, transforms #FF0000 colour to a skin colour.
	 *
	 * @param {string} type One of [ light, medium, dark, gyaru, ylight, ymedium, ydark, ygyaru ].
	 * @param {number} tan How tanned the skin is, where 0 = the lightest, 100 = full tan.
	 * @returns {string} - CSS filter value. Note: return string doesn't start with 'filter:', you have to prepend it yourself
	 * Return example: 'hue-rotate(50deg) saturate(0.40) brightness(0.60)'.
	 */
	getSkinCSSFilter(type, tan = 0) {
		const slidersValues = setup.skinColor[type];
		return skinColor(true, tan, slidersValues);
	},
};

/**
 * Hair colour record:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - natural:boolean - Is option for natural hair
 * - dye:boolean - Is option for hair dyes
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.hair = [
	{
		variable: "random", // Only used at the start for a randomised colour
		name: "random",
		name_cap: "Random",
		csstext: "Random",
		natural: true,
		dye: false,
		canvasfilter: {
			blend: "#f53d43",
		},
	},
	{
		variable: "red",
		name: "red",
		name_cap: "Red",
		csstext: "red",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#f53d43",
		},
	},
	{
		variable: "jetblack",
		name: "jet black",
		name_cap: "Jet Black",
		csstext: "black",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#454545",
			brightness: -0.3,
		},
	},
	{
		variable: "black",
		name: "black",
		name_cap: "Black",
		csstext: "black",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#504949",
			brightness: -0.3,
		},
	},
	{
		variable: "blond",
		name: "blond",
		name_cap: "Blond",
		csstext: "gold",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#d5b43f",
		},
	},
	{
		variable: "softblond",
		name: "soft blond",
		name_cap: "Soft Blond",
		csstext: "softblond",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#d1b761",
		},
	},
	{
		variable: "platinumblond",
		name: "platinum blond",
		name_cap: "Platinum Blond",
		csstext: "platinum",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#ead27b",
		},
	},
	{
		variable: "golden",
		name: "golden",
		name_cap: "Golden",
		csstext: "gold",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ffc800",
		},
	},
	{
		variable: "ashyblond",
		name: "ashy blond",
		name_cap: "Ashy Blond",
		csstext: "ashy",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#b19981",
		},
	},
	{
		variable: "strawberryblond",
		name: "strawberry blond",
		name_cap: "Strawberry Blond",
		csstext: "strawberry",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#eb9e47",
		},
	},
	{
		variable: "darkbrown",
		name: "dark brown",
		name_cap: "Dark Brown",
		csstext: "brown",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#784a3a",
			brightness: -0.3,
		},
	},
	{
		variable: "brown",
		name: "brown",
		name_cap: "Brown",
		csstext: "brown",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#8f6e56",
			brightness: -0.3,
		},
	},
	{
		variable: "softbrown",
		name: "soft brown",
		name_cap: "Soft Brown",
		csstext: "softbrown",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#bf7540",
			brightness: -0.3,
		},
	},
	{
		variable: "lightbrown",
		name: "light brown",
		name_cap: "Light Brown",
		csstext: "lightbrown",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#e49b67",
			brightness: -0.3,
		},
	},
	{
		variable: "burntorange",
		name: "burnt orange",
		name_cap: "Burnt Orange",
		csstext: "burntorange",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#e08d52",
			brightness: -0.3,
		},
	},
	{
		variable: "ginger",
		name: "ginger",
		name_cap: "Ginger",
		csstext: "tangerine",
		natural: true,
		dye: true,
		canvasfilter: {
			blend: "#ff6a00",
		},
	},
	{
		variable: "bloodorange",
		name: "blood orange",
		name_cap: "Blood Orange",
		csstext: "bloodorange",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ff4000",
		},
	},
	{
		variable: "blue",
		name: "blue",
		name_cap: "Blue",
		csstext: "bluehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#3973ac",
			brightness: -0.3,
		},
	},
	{
		variable: "deepblue",
		name: "deep blue",
		name_cap: "Deep Blue",
		csstext: "deepblue",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#1349b5",
			brightness: -0.3,
		},
	},
	{
		variable: "neonblue",
		name: "neon blue",
		name_cap: "Neon Blue",
		csstext: "neonblue",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#00d5ff",
		},
	},
	{
		variable: "green",
		name: "green",
		name_cap: "Green",
		csstext: "greenhair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#007400",
		},
	},
	{
		variable: "darklime",
		name: "dark lime",
		name_cap: "Dark Lime",
		csstext: "darklime",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#4a8000",
		},
	},
	{
		variable: "toxicgreen",
		name: "toxic green",
		name_cap: "Toxic Green",
		csstext: "toxicgreen",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#99e600",
		},
	},
	{
		variable: "teal",
		name: "teal",
		name_cap: "Teal",
		csstext: "tealhair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#008040",
		},
	},
	{
		variable: "pink",
		name: "pink",
		name_cap: "Pink",
		csstext: "pinkhair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#e05281",
		},
	},
	{
		variable: "brightpink",
		name: "bright pink",
		name_cap: "Bright Pink",
		csstext: "brightpink",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ff80aa",
		},
	},
	{
		variable: "hotpink",
		name: "hot pink",
		name_cap: "Hot Pink",
		csstext: "hotpink",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ff4dc4",
		},
	},
	{
		variable: "softpink",
		name: "soft pink",
		name_cap: "Soft Pink",
		csstext: "softpink",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#d6855c",
			brightness: 0.2,
		},
	},
	{
		variable: "crimson",
		name: "crimson",
		name_cap: "Crimson",
		csstext: "crimson",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#b30000",
		},
	},
	{
		variable: "purple",
		name: "purple",
		name_cap: "Purple",
		csstext: "purplehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#6a0d89",
		},
	},
	{
		variable: "mediumpurple",
		name: "medium purple",
		name_cap: "Medium Purple",
		csstext: "mediumpurple",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#5113df",
		},
	},
	{
		variable: "brightpurple",
		name: "bright purple",
		name_cap: "Bright Purple",
		csstext: "brightpurple",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#ab66ff",
		},
	},
	{
		variable: "white",
		name: "white",
		name_cap: "White",
		csstext: "whitehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#BBBBBB",
			brightness: 0.3,
		},
	},
	{
		variable: "snowwhite",
		name: "snow white",
		name_cap: "Snow White",
		csstext: "snowwhitehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#FFFFFF",
		},
	},
	/* 北极星模组 */
	{
		variable: "snowblue",
		name: "雪蓝色",
		name_cap: "雪蓝色",
		csstext: "snowbluehair",
		natural: false,
		dye: true,
		canvasfilter: {
			blend: "#add8e6",
		},
	},
	{
		variable: "slimegreen",
		name: "怪绿色",
		name_cap: "史莱姆绿",
		csstext: "slimegreenhair",
		natural: true,
		dye: false,
		canvasfilter: {
			blend: "#85d6a5",
			opacity: 0.9
		},
	},
	{
		variable: "lilacpurple",
		name: "丁香紫色",
		name_cap: "丁香紫色",
		csstext: "lilacpurplehair",
		natural: true,
		dye: false,
		canvasfilter: {
			blend: "#D2AFFF",
			opacity: 0.9
		},
	},
	{
		variable: "chillyblue",
		name: "冷蓝色",
		name_cap: "冷蓝色",
		csstext: "chillybluehair",
		natural: true,
		dye: false,
		canvasfilter: {
			blend: "#7ce2fe",
			opacity: 0.9
		},
	},
	{
		variable: "amberyellow",
		name: "琥珀黄色",
		name_cap: "琥珀黄色",
		csstext: "slimegreenhair",
		natural: true,
		dye: false,
		canvasfilter: {
			blend: "#FFBF00",
			opacity: 0.9
		},
	},
	/* 北极星 */
];

/**
 * The records are split based on whether they are for fringe or sides,
 * then furhter based on hairstyles. Fallback entry is called 'all'.
 * Gradient hair record:
 *   gradient - canvas gradient type
 *   values - vector specifying the direction of the gradient
 *   lengthFunctions - functions specifying how the stops should move according to the hair length
 *   colors - pairs of stops and colors (colors will be replaced in renderer).
 */

setup.colours.hairgradients_prototypes = {
	fringe: {
		"high-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"low-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value - length / 1000 / 2, (length, value) => value - length / 1000 / 2],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		split: {
			parted: {
				gradient: "linear",
				values: [21, 255, 234, 0],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.63, "rgba(0, 0, 0, 1)"],
					[0.65, "rgba(0, 0, 0, 1)"],
				],
			},
			mohawk: {
				gradient: "radial",
				values: [93, 60, 0, 93, 100, 202],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.155, "rgba(0, 0, 0, 1)"],
					[0.16, "rgba(0, 0, 0, 1)"],
				],
			},
			overgrown: {
				gradient: "radial",
				values: [93, 60, 0, 93, 60, 200],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.155, "rgba(0, 0, 0, 1)"],
					[0.16, "rgba(0, 0, 0, 1)"],
				],
			},
			all: {
				gradient: "radial",
				values: [-40, 100, 0, -40, 100, 1070],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.155, "rgba(0, 0, 0, 1)"],
					[0.16, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"face-frame": {
			all: {
				gradient: "radial",
				values: [125, 103, 0, 125, 103, 350],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.15, "rgba(0, 0, 0, 1)"],
					[0.175, "rgba(0, 0, 0, 1)"],
				],
			},
		},
	},
	sides: {
		"high-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"low-ombre": {
			all: {
				gradient: "linear",
				values: [300, 200, 300, 0],
				lengthFunctions: [(length, value) => value - length / 1000 / 2, (length, value) => value - length / 1000 / 2],
				colors: [
					[0.6, "rgba(0, 0, 0, 1)"],
					[0.85, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		split: {
			all: {
				gradient: "linear",
				values: [0, 100, 600, 100],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.19, "rgba(0, 0, 0, 1)"],
					[0.21, "rgba(0, 0, 0, 1)"],
				],
			},
		},
		"face-frame": {
			all: {
				gradient: "linear",
				values: [0, 100, 600, 100],
				lengthFunctions: [(length, value) => value, (length, value) => value],
				colors: [
					[0.0, "rgba(0, 0, 0, 1)"],
					[0.0, "rgba(0, 0, 0, 1)"],
				],
			},
		},
	},
};

/**
 * Eyes colour record:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - natural:boolean - Is option for natural eyes
 * - lens:boolean - Is option for contact lenses
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.eyes = [
	{
		variable: "random", // Only used at the start for a randomised colour
		name: "random",
		name_cap: "Random",
		csstext: "Random",
		natural: true,
		lens: false,
		canvasfilter: {
			blend: "#b016d8",
		},
	},
	{
		variable: "purple",
		name: "purple",
		name_cap: "Purple",
		csstext: "purple",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#b016d8",
		},
	},
	{
		variable: "dark blue",
		name: "dark blue",
		name_cap: "Dark Blue",
		csstext: "blue",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#3b6ba4",
		},
	},
	{
		variable: "light blue",
		name: "light blue",
		name_cap: "Light Blue",
		csstext: "lblue",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#00D9F7",
			brightness: +0.2,
		},
	},
	{
		variable: "amber",
		name: "amber",
		name_cap: "Amber",
		csstext: "tangerine",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#f6ca70",
		},
	},
	{
		variable: "hazel",
		name: "hazel",
		name_cap: "Hazel",
		csstext: "brown",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#917742",
		},
	},
	{
		variable: "green",
		name: "green",
		name_cap: "Green",
		csstext: "green",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#95b521",
		},
	},
	{
		variable: "lime green",
		name: "lime green",
		name_cap: "Lime Green",
		csstext: "green",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#3ae137",
			brightness: +0.2,
		},
	},
	{
		variable: "light green",
		name: "light green",
		name_cap: "Light Green",
		csstext: "green",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#D5F075",
		},
	},
	{
		variable: "red",
		name: "red",
		name_cap: "Red",
		csstext: "red",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#f45b08",
		},
	},
	{
		variable: "pink",
		name: "pink",
		name_cap: "Pink",
		csstext: "pink",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#F76EF7",
			brightness: +0.2,
		},
	},
	{
		variable: "grey",
		name: "grey",
		name_cap: "Grey",
		csstext: "grey",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#a9a9a9",
		},
	},
	{
		variable: "light grey",
		name: "light grey",
		name_cap: "Light Grey",
		csstext: "grey",
		natural: true,
		lens: true,
		canvasfilter: {
			blend: "#d1d1d1",
			brightness: +0.2,
		},
	},
	{
		variable: "colorWheelTemporary0",
		name: "colorWheelTemporary0",
		name_cap: "colorWheelTemporary0",
		csstext: "colorWheelTemporary0",
		natural: false,
		lens: true,
		canvasfilter: {
			blend: "#d1d1d1",
			brightness: +0.2,
		},
	},
	{
		variable: "colorWheelTemporary1",
		name: "colorWheelTemporary1",
		name_cap: "colorWheelTemporary1",
		csstext: "colorWheelTemporary1",
		natural: false,
		lens: true,
		canvasfilter: {
			blend: "#d1d1d1",
			brightness: +0.2,
		},
	},
	{
		variable: "red possessed",
		name: "red possessed",
		name_cap: "Red Possessed",
		csstext: "redPossessed",
		natural: false,
		lens: false,
		canvasfilter: {
			blend: "#f40101",
			brightness: +0.2,
		},
	},
	{
		variable: "blue possessed",
		name: "blue possessed",
		name_cap: "Blue Possessed",
		csstext: "bluePossessed",
		natural: false,
		lens: false,
		canvasfilter: {
			blend: "#0F52BA",
			brightness: +0.4,
		},
	},
];

/**
 * Clothes colour record:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.clothes = [
	{
		variable: "blue",
		name: "blue",
		name_cap: "Blue",
		csstext: "blue",
		canvasfilter: { blend: "#0132ff" },
	},
	{
		variable: "light blue",
		name: "light blue",
		name_cap: "Light Blue",
		csstext: "light-blue",
		canvasfilter: { blend: "#559BC0" },
	},
	{
		variable: "white",
		name: "white",
		name_cap: "White",
		csstext: "white",
		canvasfilter: { blend: "#ffffff" },
	},
	{
		variable: "pale white",
		name: "pale white",
		name_cap: "Pale White",
		csstext: "white",
		canvasfilter: { blend: "#949494" },
	},
	{
		variable: "red",
		name: "red",
		name_cap: "Red",
		csstext: "red",
		canvasfilter: { blend: "#ff0000" },
	},
	{
		variable: "green",
		name: "green",
		name_cap: "Green",
		csstext: "green",
		canvasfilter: { blend: "#00aa00" },
	},
	{
		variable: "light green",
		name: "light green",
		name_cap: "Light Green",
		csstext: "green",
		canvasfilter: { blend: "#72AC72" },
	},
	{
		variable: "black",
		name: "black",
		name_cap: "Black",
		csstext: "black",
		canvasfilter: { blend: "#353535" },
	},
	{
		variable: "pink",
		name: "pink",
		name_cap: "Pink",
		csstext: "pink",
		canvasfilter: { blend: "#fe3288" },
	},
	{
		variable: "light pink",
		name: "light pink",
		name_cap: "Light Pink",
		csstext: "light-pink",
		canvasfilter: { blend: "#d67caf" },
	},
	{
		variable: "purple",
		name: "purple",
		name_cap: "Purple",
		csstext: "purple",
		canvasfilter: { blend: "#8f09f3" },
	},
	{
		variable: "tangerine",
		name: "tangerine",
		name_cap: "Tangerine",
		csstext: "tangerine",
		canvasfilter: { blend: "#ff6f00" },
	},
	{
		variable: "pale tangerine",
		name: "pale tangerine",
		name_cap: "Pale Tangerine",
		csstext: "pale-tangerine",
		canvasfilter: { blend: "#ff3300" },
	},
	{
		variable: "teal",
		name: "teal",
		name_cap: "Teal",
		csstext: "teal",
		canvasfilter: { blend: "#2bcece" },
	},
	{
		variable: "yellow",
		name: "yellow",
		name_cap: "Yellow",
		csstext: "yellow",
		canvasfilter: { blend: "#ffdd33", brightness: 0.2 },
	},
	{
		variable: "pale yellow",
		name: "pale yellow",
		name_cap: "Pale Yellow",
		csstext: "pale-yellow",
		canvasfilter: { blend: "#ffaa00" },
	},
	{
		variable: "brown",
		name: "brown",
		name_cap: "Brown",
		csstext: "brown",
		canvasfilter: { blend: "#703000" },
	},
	{
		variable: "tan",
		name: "tan",
		name_cap: "Tan",
		csstext: "tan",
		canvasfilter: { blend: "#c3ad91" },
	},
	{
		variable: "fleshy",
		name: "fleshy",
		name_cap: "Fleshy",
		csstext: "fleshy",
		canvasfilter: { blend: "#ffddc8" },
	},
	{
		variable: "grey",
		name: "grey",
		name_cap: "Grey",
		csstext: "grey",
		canvasfilter: { blend: "#b5aea6" },
	},
	{
		variable: "sand",
		name: "sand",
		name_cap: "Sand",
		csstext: "sand",
		canvasfilter: { blend: "#ebd1ad" },
	},
	{
		variable: "off-white",
		name: "off-white",
		name_cap: "Off-white",
		csstext: "off-white",
		canvasfilter: { blend: "#ecece8" },
	},
	{
		variable: "navy",
		name: "navy",
		name_cap: "Navy",
		csstext: "navy",
		canvasfilter: { blend: "#292934" },
	},
	{
		variable: "navy blue",
		name: "navy blue",
		name_cap: "Navy blue",
		csstext: "navy blue",
		canvasfilter: { blend: "#16168d" },
	},
	{
		variable: "olive",
		name: "olive",
		name_cap: "Olive",
		csstext: "olive",
		canvasfilter: { blend: "#5f5a44" },
	},
	{
		variable: "wine",
		name: "wine",
		name_cap: "Wine",
		csstext: "wine",
		canvasfilter: { blend: "#65252d" },
	},
	{
		variable: "apocalypse",
		name: "apocalypse",
		name_cap: "Apocalypse",
		csstext: "apocalypse",
		canvasfilter: { blend: "#5c271d" },
	},
	{
		variable: "steel",
		name: "steel",
		name_cap: "Steel",
		csstext: "steel",
		canvasfilter: { blend: "#999999" },
	},
	{
		variable: "blue steel",
		name: "blue steel",
		name_cap: "Blue Steel",
		csstext: "blue-steel",
		canvasfilter: { blend: "#646e82" },
	},
	{
		variable: "bronze",
		name: "bronze",
		name_cap: "Bronze",
		csstext: "bronze",
		canvasfilter: { blend: "#cd9932" },
	},
	{
		variable: "gold",
		name: "gold",
		name_cap: "Gold",
		csstext: "gold",
		canvasfilter: { blend: "#ffbf00", brightness: 0.1 },
	},
	{
		variable: "silver",
		name: "silver",
		name_cap: "Silver",
		csstext: "silver",
		canvasfilter: { blend: "#C0C0C0" },
	},
];
/**
 * Makeup colour records:
 * - variable:string - Value of variables
 * - name:string - Display name
 * - name_cap:string - Display name, capitalised
 * - csstext:string - CSS class added to text
 * - canvasfilter:object - Canvas model filter.
 */
setup.colours.lipstick = [
	{
		variable: "red",
		name: "red",
		name_cap: "Red",
		csstext: "red",
		canvasfilter: {
			blend: "#EC3535",
		},
	},
	{
		variable: "blue",
		name: "blue",
		name_cap: "Blue",
		csstext: "blue",
		canvasfilter: {
			blend: "#4372FF",
		},
	},
	{
		variable: "green",
		name: "green",
		name_cap: "Green",
		csstext: "green",
		canvasfilter: {
			blend: "#195205",
		},
	},
	{
		variable: "purple",
		name: "purple",
		name_cap: "Purple",
		csstext: "purple",
		canvasfilter: {
			blend: "#AA4BC8",
		},
	},
	{
		variable: "orange",
		name: "orange",
		name_cap: "Orange",
		csstext: "orange",
		canvasfilter: {
			blend: "#f28500",
		},
	},
	{
		variable: "lime",
		name: "lime",
		name_cap: "Lime",
		csstext: "lime",
		canvasfilter: {
			blend: "#38B20A",
		},
	},
	{
		variable: "pink",
		name: "pink",
		name_cap: "Pink",
		csstext: "pink",
		canvasfilter: {
			blend: "#E40081",
		},
	},
	{
		variable: "light pink",
		name: "light pink",
		name_cap: "Light Pink",
		csstext: "light-pink",
		canvasfilter: {
			blend: "#d67caf",
		},
	},
	{
		variable: "dark red",
		name: "dark red",
		name_cap: "Dark Red",
		csstext: "red",
		canvasfilter: {
			blend: "#BD0000",
		},
	},
	{
		variable: "black",
		name: "black",
		name_cap: "Black",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
];
setup.colours.eyeshadow = [
	{
		variable: "red",
		name: "red",
		name_cap: "Red",
		csstext: "red",
		canvasfilter: {
			blend: "#EC3535",
		},
	},
	{
		variable: "pink",
		name: "pink",
		name_cap: "Pink",
		csstext: "pink",
		canvasfilter: {
			blend: "#E40081",
		},
	},
	{
		variable: "light pink",
		name: "light pink",
		name_cap: "Light Pink",
		csstext: "light-pink",
		canvasfilter: {
			blend: "#d67caf",
		},
	},
	{
		variable: "green",
		name: "green",
		name_cap: "Green",
		csstext: "green",
		canvasfilter: {
			blend: "#38B20A",
		},
	},
	{
		variable: "light green",
		name: "light green",
		name_cap: "Light green",
		csstext: "green",
		canvasfilter: {
			blend: "#7caf7c",
		},
	},
	{
		variable: "blue",
		name: "blue",
		name_cap: "Blue",
		csstext: "blue",
		canvasfilter: {
			blend: "#4372FF",
		},
	},
	{
		variable: "light blue",
		name: "light blue",
		name_cap: "Light Blue",
		csstext: "light-blue",
		canvasfilter: {
			blend: "#559BC0",
		},
	},
	{
		variable: "purple",
		name: "purple",
		name_cap: "Purple",
		csstext: "purple",
		canvasfilter: {
			blend: "#AA4BC8",
		},
	},
	{
		variable: "orange",
		name: "orange",
		name_cap: "Orange",
		csstext: "orange",
		canvasfilter: {
			blend: "#f28500",
		},
	},
	{
		variable: "yellow",
		name: "yellow",
		name_cap: "Yellow",
		csstext: "yellow",
		canvasfilter: {
			blend: "#FFD700",
		},
	},
	{
		variable: "brown",
		name: "brown",
		name_cap: "Brown",
		csstext: "brown",
		canvasfilter: {
			blend: "#4C2217",
		},
	},
	{
		variable: "light brown",
		name: "light brown",
		name_cap: "Light Brown",
		csstext: "lightbrown",
		canvasfilter: {
			blend: "#C5793A",
		},
	},
	{
		variable: "dark brown",
		name: "dark brown",
		name_cap: "Dark Brown",
		csstext: "brown",
		canvasfilter: {
			blend: "#4C2217",
		},
	},
	{
		variable: "black",
		name: "black",
		name_cap: "Black",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
	{
		variable: "white",
		name: "white",
		name_cap: "White",
		csstext: "",
		canvasfilter: {
			blend: "#EEEEEE",
		},
	},
	{
		variable: "silver",
		name: "silver",
		name_cap: "Silver",
		csstext: "silver",
		canvasfilter: {
			blend: "#C0C0C0",
		},
	},
];
setup.colours.mascara = [
	{
		variable: "black",
		name: "black",
		name_cap: "Black",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
	{
		variable: "black waterproof",
		name: "black (waterproof)",
		name_cap: "Black (waterproof)",
		csstext: "black",
		canvasfilter: {
			blend: "#292929",
		},
	},
];
setup.colours.condom = [
	{
		variable: "red",
		name: "red",
		name_cap: "Red",
		csstext: "red",
		canvasfilter: {
			blend: "#EC3535",
		},
	},
	{
		variable: "blue",
		name: "blue",
		name_cap: "Blue",
		csstext: "blue",
		canvasfilter: {
			blend: "#4372FF",
		},
	},
	{
		variable: "lblue",
		name: "light blue",
		name_cap: "Light Blue",
		csstext: "lblue",
		canvasfilter: {
			blend: "#559BC0",
		},
	},
	{
		variable: "green",
		name: "green",
		name_cap: "Green",
		csstext: "green",
		canvasfilter: {
			blend: "#38B20A",
		},
	},
	{
		variable: "lime",
		name: "lime",
		name_cap: "Lime",
		csstext: "lime",
		canvasfilter: {
			blend: "#7caf7c",
		},
	},
	{
		variable: "purple",
		name: "purple",
		name_cap: "Purple",
		csstext: "purple",
		canvasfilter: {
			blend: "#AA4BC8",
		},
	},
	{
		variable: "orange",
		name: "orange",
		name_cap: "Orange",
		csstext: "orange",
		canvasfilter: {
			blend: "#f28500",
		},
	},
	{
		variable: "pink",
		name: "pink",
		name_cap: "Pink",
		csstext: "pink",
		canvasfilter: {
			blend: "#E40081",
		},
	},
	{
		variable: "plain",
		name: "plain",
		name_cap: "Plain",
		csstext: "plain",
		canvasfilter: {
			blend: "#f28500",
		},
	},
];

/*
 * Maps to easily access colour record by its variable code, ex. setup.colours.hair_map[$haircolour]
 */

function buildColourMap(name, mode) {
	const array = mode === "custom_eyecolours" ? V.custom_eyecolours : setup.colours[name];
	const map = setup.colours[name + "_map"];
	const defaultFilter = setup.colours[name + "_default"];
	for (const item of array) {
		if (defaultFilter) Renderer.mergeLayerData(item.canvasfilter, defaultFilter);
		const key = item.variable;
		if (key in map) {
			if (mode !== "custom_eyecolours") console.error("Duplicate " + name + " '" + key + "'");
		}
		map[key] = item;
	}
	return map;
}

window.buildColourMap = buildColourMap;

buildColourMap("hair");
buildColourMap("eyes");
buildColourMap("clothes");
buildColourMap("lipstick");
buildColourMap("mascara");
buildColourMap("eyeshadow");
buildColourMap("condom");

/**
 * Tries to guess colour in the map by removing spaces or replacing them with '-' and checking against name.
 * Return colour record if found, and null if no.
 *
 * @param {any} map
 * @param {any} colour
 */
setup.guessColourInMap = function (map, colour) {
	if (colour in map) return map[colour];

	let testname = colour.replace(/ /g, "");
	if (testname in map) return map[testname];

	testname = colour.replace(/ /g, "-");
	if (testname in map) return map[testname];

	for (const record of Object.values(map)) {
		if (record.name === colour) return record;
	}
	return null;
};
/**
 * Tries to guess readable name of the colour by looking it in all known maps.
 * If not found, return unchanged.
 *
 * @param {any} colour
 */
setup.colourName = function (colour) {
	for (const map of [
		setup.colours.hair_map,
		setup.colours.eyes_map,
		setup.colours.clothes_map,
		setup.colours.mascara_map,
		setup.colours.lipstick_map,
		setup.colours.eyeshadow_map,
		setup.colours.condom_map,
	]) {
		if (colour in map) return map[colour].name;
	}
	return colour;
};
