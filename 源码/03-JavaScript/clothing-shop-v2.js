function getIntegrityInfo(integrity) {
	if (integrity >= 900) return [7, "green"];
	if (integrity >= 500) return [6, "teal"];
	if (integrity >= 200) return [5, "lblue"];
	if (integrity >= 100) return [4, "blue"];
	if (integrity >= 50) return [3, "purple"];
	if (integrity >= 20) return [2, "pink"];
	return [1, "red"];
}
window.getIntegrityInfo = getIntegrityInfo;

function getRevealInfo(reveal) {
	if (reveal >= 900) return [7, "red"];
	if (reveal >= 700) return [6, "pink"];
	if (reveal >= 500) return [5, "purple"];
	if (reveal >= 300) return [4, "blue"];
	if (reveal >= 200) return [3, "lblue"];
	if (reveal >= 100) return [2, "teal"];
	return [1, "green"];
}
window.getRevealInfo = getRevealInfo;

function getWarmthInfo(warmth) {
	if (warmth >= 75) return [5, "warm-4"];
	if (warmth >= 50) return [4, "warm-3"];
	if (warmth >= 25) return [3, "warm-2"];
	if (warmth >= 10) return [2, "warm-1"];
	return [1, "warm-0"];
}
window.getWarmthInfo = getWarmthInfo;

// for outfits it adds the lower piece's warmth too
function getTrueWarmth(item) {
	let warmth = item.warmth || 0;

	if (item.outfitPrimary) {
		// sum of warmth of every secondary piece
		// outfitPrimary looks like this {'lower': 'item_name', 'head': 'item_name'}
		warmth += Object.keys(item.outfitPrimary) // loop through secondary items list
			.filter(x => item.outfitPrimary[x] !== "broken" && item.outfitPrimary[x] !== "split") // filter out broken pieces
			.map(x => setup.clothes[x].find(z => z.name === item.outfitPrimary[x] && z.modder === item.modder)) // find items in setup.clothes
			.reduce((sum, x) => sum + (x.warmth || 0), 0); // calculate sum of their warmth field
	}

	if (item.outfitSecondary) {
		if (item.outfitSecondary.length % 2 !== 0) console.log("WARNING: " + item.name + " has bad .outfitSecondary data!");

		// outfitSecondary looks like this ['upper', 'item_name', 'head', 'item_name']
		item.outfitSecondary.forEach((x, i) => {
			if (i % 2 === 0 && item.outfitSecondary[i + 1] !== "broken" && item.outfitSecondary[i + 1] !== "split") {
				warmth += setup.clothes[x].find(z => z.name === item.outfitSecondary[i + 1] && z.modder === item.modder).warmth || 0;
			}
		});
	}

	return warmth;
}
window.getTrueWarmth = getTrueWarmth;

function clothingSlotToIconName(slotName, outfits) {
	switch (slotName) {
	    /* 北极星模组 */
		case "over_upper":
			return outfits ? "overoutfit" : "overupper";
		case "over_lower":
			return "overlower";
		case "over_head":
			return "overhead";
		/* 北极星 */
		case "upper":
			return outfits ? "outfit" : "upper";
		case "under_upper":
			return outfits ? "underoutfit" : "underupper";
		case "under_lower":
			return "underlower";
		default:
			return slotName;
	}
}
window.clothingSlotToIconName = clothingSlotToIconName;

// Make .divs-links clickable as if they're anchors
function linkifyDivs(parentSelector = "") {
	$(() => {
		$(parentSelector + " .div-link").click(function (e) {
			$(this).find("a").first().click();
		});
	});
	$(() => {
		$(parentSelector + " .div-link a").click(function (e) {
			e.stopPropagation();
		});
	});
}
window.linkifyDivs = linkifyDivs;

// Hook custom colour sliders and preset dropdowns
function attachCustomColourHooks(slot = "") {
	$(() => {
		// throttling for smoother experience
		let updating = false;
		$(".custom-colour-sliders.primary input[type=range]").on("input change", () => {
			if (updating) return;
			updating = true;
			requestAnimationFrame(() => {
				updating = false;
				updateCustomColour("primary", slot);
				updateMannequin(slot);
			});
		});
		$(".custom-colour-sliders.secondary input[type=range]").on("input change", () => {
			if (updating) return;
			updating = true;
			requestAnimationFrame(() => {
				updating = false;
				updateCustomColour("secondary", slot);
				updateMannequin(slot);
			});
		});
		$(".custom-colour.primary > .custom-colour-presets > .presets-dropdown > select").on("change", () => {
			loadCustomColourPreset("primary");
			Wikifier.wikifyEval("<<updateclotheslist>>");
		});
		$(".custom-colour.secondary > .custom-colour-presets > .presets-dropdown > select").on("change", () => {
			loadCustomColourPreset("secondary");
			Wikifier.wikifyEval("<<updateclotheslist>>");
		});

		$(".custom-colour-sliders.primary > .colour-slider > div > input").on("input", e => {
			V.customColors.sepia.primary = 0;
		});
		$(".custom-colour-sliders.secondary > .colour-slider > div > input").on("input", e => {
			V.customColors.sepia.secondary = 0;
		});
	});
}
window.attachCustomColourHooks = attachCustomColourHooks;

function updateCustomColour(type, slot) {
	$(".colour-options-div." + type + " > .colour-button > .bg-custom").css("filter", getCustomColourStyle(type, true));
	const model = Renderer.locateModel("main", "shop");
	if (model) {
		const customColors = V.customColors;
		model.options.filters["worn_" + slot + (type === "primary" ? "_custom" : "_acc_custom")] = getCustomClothesColourCanvasFilter(
			customColors.color[type],
			customColors.saturation[type],
			customColors.brightness[type],
			customColors.contrast[type]
		);
	}
}
window.updateCustomColour = updateCustomColour;

function updateMannequin(slot = "") {
	Wikifier.wikifyEval("<<updatemannequin '" + slot + "'>>");
}
window.updateMannequin = updateMannequin;

function getCustomColourStyle(type, valueOnly = false) {
	if (type !== "primary" && type !== "secondary") return;
	return (
		(valueOnly ? "" : "filter: ") +
		"hue-rotate(" +
		V.customColors.color[type] +
		"deg) saturate(" +
		V.customColors.saturation[type] +
		") brightness(" +
		V.customColors.brightness[type] +
		") contrast(" +
		V.customColors.contrast[type] +
		")" +
		(valueOnly ? "" : ";")
	);
}
window.getCustomColourStyle = getCustomColourStyle;

function saveCustomColourPreset(slot = "primary") {
	const setName = prompt("Enter new colour preset name", "New preset");
	if (setName != null) {
		if (Object.keys(V.customColors.presets).includes(setName)) {
			alert("Preset '" + setName + "' already exists!");
			return;
		}

		V.customColors.presets[setName] = {
			ver: 3,
			color: V.customColors.color[slot],
			value: V.customColors.value[slot],
			brightness: V.customColors.brightness[slot],
			saturation: V.customColors.saturation[slot],
			contrast: V.customColors.contrast[slot],
		};
	}
}
window.saveCustomColourPreset = saveCustomColourPreset;

const colourPickerShopCustom = {};

function loadCustomColourPreset(slot = "primary") {
	const setName = T.preset_choice[slot];
	const preset = V.customColors.presets[setName];
	if (preset) {
		// ver 3 includes property "value" which is used to set the position of the "value"(aka brightness) custom slider at shop, see here : https://i.imgur.com/hmbFT4U.png
		if (preset.ver >= 3) {
			V.customColors.value[slot] = preset.value;
			// this effectively set the different sliders values
			colourPickerShopCustom[slot].color.hue = preset.color;
			colourPickerShopCustom[slot].color.saturation = (((preset.saturation / 32) * 100) / 4) * 100;
			colourPickerShopCustom[slot].color.value = preset.value;
		}
		// new version of preset (has only one set of colour parameters and doesn't have sepia)
		if (preset.ver >= 2) {
			V.customColors.color[slot] = preset.color;
			V.customColors.brightness[slot] = preset.brightness;
			V.customColors.saturation[slot] = preset.saturation;
			V.customColors.contrast[slot] = preset.contrast;
			V.customColors.sepia[slot] = 0;
		}
		// legacy preset (has both primary and secondary colours information)
		else {
			V.customColors.color.primary = preset.color.primary;
			V.customColors.brightness.primary = preset.brightness.primary;
			V.customColors.saturation.primary = preset.saturation.primary;
			V.customColors.contrast.primary = preset.contrast.primary;
			V.customColors.sepia.primary = preset.sepia.primary;

			V.customColors.color.secondary = preset.color.secondary;
			V.customColors.brightness.secondary = preset.brightness.secondary;
			V.customColors.saturation.secondary = preset.saturation.secondary;
			V.customColors.contrast.secondary = preset.contrast.secondary;
			V.customColors.sepia.secondary = preset.sepia.secondary;
		}
	}
}
window.loadCustomColourPreset = loadCustomColourPreset;

// adjusts available options for reveal dropdowns (makes sure upper bound is not below lower bound and vice versa)
function getFilterRevealOptions(type) {
	const optionsFrom = { unassuming: 0, smart: 100, tasteful: 200, comfy: 300, seductive: 500, risqué: 700, lewd: 900 };
	const optionsTo = { unassuming: 100, smart: 200, tasteful: 300, comfy: 500, seductive: 700, risqué: 900, lewd: 9999 };

	if (type === "from") {
		// this line removes values that are larger than reveal.to
		return Object.keys(optionsFrom)
			.filter(x => optionsFrom[x] < V.shopClothingFilter.reveal.to)
			.reduce((res, key) => {
				res[key] = optionsFrom[key];
				return res;
			}, {});
	} else {
		// this line removes values that are smaller than reveal.from
		return Object.keys(optionsTo)
			.filter(x => optionsTo[x] > V.shopClothingFilter.reveal.from)
			.reduce((res, key) => {
				res[key] = optionsTo[key];
				return res;
			}, {});
	}
}
window.getFilterRevealOptions = getFilterRevealOptions;

function getFilterOutfitOptions() {
	const options = { None: "none" };
	for (let i = 0; i < V.outfit.length; i++) {
		const outfit = V.outfit[i];
		let name = outfit.name;
		for (let j = 1; options[name] !== undefined; j++) {
			name = outfit.name + " (" + j + ")";
		}
		options[name] = i;
	}
	return options;
}
window.getFilterOutfitOptions = getFilterOutfitOptions;

// toggles checkboxes in filters menu
function toggleAllTraitsFilter() {
	const chboxes = $("#filter-traits input:not(:checked)");
	if (chboxes.length > 0) chboxes.click();
	else $("#filter-traits input:checked").click();
}
window.toggleAllTraitsFilter = toggleAllTraitsFilter;

// accepts a list of clothes, returns a filtered list of clothes
function applyClothingShopFilters(items) {
	const f = V.shopClothingFilter;
	if (!f.active) return items;

	// (example) turns f.gender object {female: true, neutral: true, male: false} into ["f", "n"], ready to compare with gender in items
	const allowedGenders = Object.keys(f.gender)
		.filter(x => f.gender[x])
		.map(x => x.first());

	let filterOutfit = f.outfit.index !== "none";
	if (filterOutfit && f.outfit.index >= V.outfit.length) {
		filterOutfit = false;
	}

	const filteredOutfitClothes = new Set();
	if (filterOutfit) {
		const outfit = V.outfit[f.outfit.index];
		for (const slot of setup.clothingLayer.all) {
			if (outfit[slot] != null) {
				filteredOutfitClothes.add(outfit[slot]);
			}
		}
	}

	items = items.filter(
		x =>
			allowedGenders.includes(x.gender) &&
			x.reveal >= f.reveal.from &&
			x.reveal < f.reveal.to &&
			x.warmth >= f.warmth.from &&
			x.warmth < f.warmth.to &&
			(f.traits.length === 0 || f.traits.includesAny(x.type)) &&
			(!filterOutfit || filteredOutfitClothes.has(x.name))
	);

	if (f.sorting.enabled) {
		const prop = f.sorting.prop;
		const isAsc = f.sorting.order === "asc";

		/* this is not good, I'm just doing this not to avoid refactoring the setup.clothes object again

		currently...
		we have a dedicated clothing.all array that has clones of all clothing objects spread out over different arrays per clothing
		then the cloned object is assigned the "realSlot" property, which contains the name of the slot from the array of which the object was cloned
		and so, when you click on "all items" in the shop, clothingShopSlot is all and can't be used to figure out the item's slot,
		but the items the function fetches are from the "all" slot so they have the realSlot property
		and when you click on a specific slot, clothingShopSlot is the name of the slot, and realSlot is null because we only added realSlot to the "all" slot's clones

		and we only really need the slot so that we can give it to the function that gets the properties of the item,
		  but the function uses findIndex with an arrow function for the lookup, so we might as well go through the "all" slot to find the item rather than
		  find the specific array (which does narrow down the search but when you could implement this in O(1) but you're using findIndex - the milliseconds are evidently not a priority)
		
		so really we don't even need the "slot" property at all, this all needs a refactor
	
		
		Here's how I would refactor it:
		1) we need to have a map, mapping the item's ID (or ID + modder name, I think both are only unique together?) to the item's setup object
		2) have an array of item IDs (just the strings) for each slot (or a set - doesn't matter, lookup is unnecessary if we implement point 3)
		   If we need to find all items in a specific slot - we simply iterate the Set/array. Lookup of the setup object is O(1), so it's just as fast as it is now.
		3) item instance objects would contain the ID of the item and all the dynamic information (so just like it is currently)
		4) (optional) I'd personally remove any and all dynamic properties from the setup object (stuff like integrity), 
			and get rid of all static/const properties from the item instance objects (stuff like integrity_max)
			additionally, instead of using a function to "trim" the setup object (cloning it and removing the const properties and adding the dynamic ones),
			  I'd just create an object, since ideally none of the values should be repeated/overlapped between the setup and instance (worn/bought) objects
					
		As a result, we'd have one setup.clothes map that contains all the actual setup objects, and a set for each slot that only contains IDs.
		No more clones of the same clothing, no more "all" slot. If you need all clothing - you simply iterate the map's values. 
		If you need specific slots - you iterate the IDs from the set and get the setup object from the map with O(1) lookup.

		If that sounds like a pain (even though that's less work than what we currently do to just get the price of an item), we can even have a generator function that
		  will yield the actual setup objects in a slot without you having to do clothing.items.get(id) every time (and since it's a generator - we wouldn't be looping twice).
		
		This way, we don't need to loop through items in order to find an item, and we don't need to do all this weird ritual dancing with V.clothingShopSlot and _realSlot
		
		This would necessitate a few changes and fixes (I'm only listing stuff I've seen, there's probably plenty more)
		1) currently the outfits store item names, instead of the IDs. The outfits should contain the IDs instead.
		2) I forgor.

		Just to clarify - this is mainly supposed to make the clothing data more organized, easier to manage and work with, less side-effects and weird lookup/cloning techniques.
		It will definitely drastically improve speed, but it will probably not have a noticable difference in performance.
		*/

		const getSlot = item_ => {
			if (V.clothingShopSlot === "all") {
				return item_.realSlot;
			}
			return V.clothingShopSlot;
		};

		// items is a shallow copy, so we're not mutating the passed array
		if (prop === "price") {
			items.sort((a, b) =>
				isAsc ? getClothingCost(a, getSlot(a)) - getClothingCost(b, getSlot(b)) : getClothingCost(b, getSlot(b)) - getClothingCost(a, getSlot(a))
			);
		} else if (prop === "protection") {
			items.sort((a, b) => (isAsc ? a.integrity_max - b.integrity_max : b.integrity_max - a.integrity_max));
		} else if (prop === "reveal") {
			items.sort((a, b) => (isAsc ? a.reveal - b.reveal : b.reveal - a.reveal));
		} else if (prop === "warmth") {
			items.sort((a, b) => (isAsc ? getTrueWarmth(a) - getTrueWarmth(b) : getTrueWarmth(b) - getTrueWarmth(a)));
		}
	}

	return items;
}
window.applyClothingShopFilters = applyClothingShopFilters;

function getWarmthScaleData(newWarmth) {
	let maxWarmth = Math.max(260, V.warmth * 1.04);
	if (newWarmth) maxWarmth = Math.max(maxWarmth, newWarmth * 1.04);
	const chill = V.chill;
	const cold = chill - 90;
	const warm = chill * 1.3 + 70;
	const hot = chill * 1.3 + 150;
	const minW = Math.min(V.warmth, newWarmth);
	const maxW = Math.max(V.warmth, newWarmth);

	return {
		cold: (cold / maxWarmth) * 100 + "%",
		chill: ((chill - Math.max(cold, 0)) / maxWarmth) * 100 + "%",
		ok: ((Math.min(warm, maxWarmth) - chill) / maxWarmth) * 100 + "%",
		warm: ((Math.min(hot, maxWarmth) - Math.min(warm, maxWarmth)) / maxWarmth) * 100 + "%",
		hot: ((maxWarmth - hot) / maxWarmth) * 100 + "%",
		nowarm: warm > maxWarmth ? "nowarm" : "",
		nohot: hot > maxWarmth ? "nohot" : "",
		nocold: cold < 0 ? "nocold" : "",
		player: (V.warmth / maxWarmth) * 100 + "%",
		playerNew: ((V.warmth > newWarmth ? minW : maxW) / maxWarmth) * 100 + "%",
		diffUpDown: V.warmth > newWarmth ? "down" : "up",
		diffStart: (minW / maxWarmth) * 100 + "%",
		diffWidth: ((maxW - minW) / maxWarmth) * 100 + "%",
	};
}
window.getWarmthScaleData = getWarmthScaleData;

function getWarmthWithOtherClothing(slot, clothingId) {
	const newClothing = setup.clothes[slot][clothingId];
	const worn = V.worn;

	let newWarmth = V.warmth + getTrueWarmth(newClothing);

	// subtract warmth of all clothes that would be taken off
	if (newClothing.outfitPrimary) {
		// newWarmth -= Object.keys(newClothing.outfitPrimary).reduce((sum, x) => sum + (worn[x].warmth || 0), 0);

		// compile a list of all primary clothes to be removed. It implies that item may have only one primary piece
		const clothesToRemove = [slot, ...Object.keys(newClothing.outfitPrimary)].map(x =>
			worn[x].outfitSecondary && worn[x].outfitSecondary[1] !== "broken" && worn[x].outfitSecondary[1] !== "split"
				? setup.clothes[worn[x].outfitSecondary[0]].find(z => z.name === worn[x].outfitSecondary[1])
				: worn[x]
		);
		const removedClothes = new Set();

		clothesToRemove.forEach(x => {
			if (!removedClothes.has(x.name)) {
				newWarmth -= getTrueWarmth(x);
				removedClothes.add(x.name);
			}
		});
	} else newWarmth -= worn[slot].warmth;

	return newWarmth;
}
window.getWarmthWithOtherClothing = getWarmthWithOtherClothing;

function allClothesSetup() {
	let clothes = [];
	Object.keys(setup.clothes).forEach(slot => {
		if (["all", "over_head", "over_upper", "over_lower"].includes(slot)) return;
		const items = clone(setup.clothes[slot]);
		items.forEach(item => (item.realSlot = slot));
		clothes = clothes.concat(items);
	});
	setup.clothes.all = clothes;
}
window.allClothesSetup = allClothesSetup;

function shopSearchReplacer(name) {
	return name.replace(/[^a-zA-Z0-9' -]+/g, "");
}
window.shopSearchReplacer = shopSearchReplacer;

function getOwnedClothingCount(index, type) {
	const wardrobe = V.wardrobes.shopReturn === "wardrobe" ? V.wardrobe : V.wardrobes[V.wardrobes.shopReturn] || V.wardrobe;
	return wardrobe[type].reduce((p, c) => p + Number(c.index === index), 0);
}
window.getOwnedClothingCount = getOwnedClothingCount;

function importCustomColour(acc) {
	const setName = prompt("Enter custom code", "");
	if (setName != null) {
		let color;
		try {
			color = JSON.parse(window.atob(setName));
		} catch (e) {
			document.getElementById("export-custom-colour-box").outerHTML = `
			<div id="export-custom-colour-box">
				<span class="export-custom-colour-error">Invalid string, make sure you copied it correctly without any spaces around it.</span>
			</div>`;
			return;
		}
		const colourProperties = Object.getOwnPropertyNames(color);

		if (colourProperties.sort().join(",") === ["color", "saturation", "value", "brightness", "contrast"].sort().join(",")) {
			V.customColors.color[acc] = color.color;
			V.customColors.saturation[acc] = color.saturation;
			V.customColors.value[acc] = color.value;
			V.customColors.contrast[acc] = color.contrast;
			V.customColors.brightness[acc] = color.brightness;
			colourPickerShopCustom[acc].color.hue = color.color;
			colourPickerShopCustom[acc].color.saturation = (((color.saturation / 32) * 100) / 4) * 100;
			colourPickerShopCustom[acc].color.value = color.value;
			document.getElementById("numberslider-input-customcolorscontrastprimary").value = color.contrast.toString();
			document.getElementById("numberslider-value-customcolorscontrastprimary").innerText = color.contrast.toString();
			document.getElementById("export-custom-colour-box").outerHTML = `
			<div id="export-custom-colour-box">
				<span class="export-custom-colour-alert">Imported!</span>
			</div>`;
			window.setTimeout(() => {
				if (document.getElementById("export-custom-colour-box"))
					document.getElementById("export-custom-colour-box").classList.add("successfully-exported");
			}, 100);
			updateMannequin();
		} else {
			document.getElementById("export-custom-colour-box").outerHTML = `
			<div id="export-custom-colour-box">
				<span class="export-custom-colour-error">Invalid code.</span>
			</div>`;
		}
	}
}
window.importCustomColour = importCustomColour;

function exportCustomColour(acc) {
	const obj = {
		color: V.customColors.color[acc],
		saturation: V.customColors.saturation[acc],
		value: V.customColors.value[acc],
		brightness: V.customColors.brightness[acc],
		contrast: V.customColors.contrast[acc],
	};

	navigator.clipboard.writeText(window.btoa(JSON.stringify(obj)));
	document.getElementById("export-custom-colour-box").outerHTML = `
	<div id="export-custom-colour-box">
		<span class="export-custom-colour-alert">Copied to clipboard!</span>
	</div>`;
	window.setTimeout(() => {
		if (document.getElementById("export-custom-colour-box")) document.getElementById("export-custom-colour-box").classList.add("successfully-exported");
	}, 100);
}
window.exportCustomColour = exportCustomColour;

function adaptSliderWidth() {
	if (window.innerWidth > 787) return 400;
	else if (window.innerWidth > 710) return 350;
	else if (window.innerWidth > 667) return 300;
	else if (window.innerWidth > 600) return 230;
	else if (window.innerWidth > 519) return 350;
	else if (window.innerWidth > 463) return 300;
	else return 250;
}

function shopClothCustomColorWheel(acc) {
	const container = document.createElement("label");
	colourPickerShopCustom[acc] = new iro.ColorPicker(container, {
		color: { h: 61, s: 47, v: 100 },
		width: adaptSliderWidth(),
		layout: [
			{
				component: iro.ui.Slider,
				options: {
					sliderType: "hue",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					sliderType: "saturation",
				},
			},
			{
				component: iro.ui.Slider,
				options: {
					sliderType: "value",
				},
			},
		],
	});
	colourPickerShopCustom[acc].color.hue = V.customColors.color[acc];
	colourPickerShopCustom[acc].color.saturation = (((V.customColors.saturation[acc] / 32) * 100) / 4) * 100;
	colourPickerShopCustom[acc].color.value = V.customColors.value[acc];
	//
	colourPickerShopCustom[acc].on(["color:init", "color:change"], function (color) {
		V.customColors.color[acc] = Math.round(color.hue);
		V.customColors.saturation[acc] = (((color.saturation * 32) / 100) * 4) / 100;
		V.customColors.brightness[acc] = (color.hsl.l * 4) / 100;
		V.customColors.value[acc] = color.value;
		if (document.getElementById("mannequin")) updateMannequin();
	});
	return container;
}
window.shopClothCustomColorWheel = shopClothCustomColorWheel;

function updateHueSlider(newValue, acc) {
	colourPickerShopCustom[acc].color.hue = newValue;
}
window.updateHueSlider = updateHueSlider;

window.addEventListener(
	"resize",
	function (event) {
		for (const cat in colourPickerShopCustom) {
			colourPickerShopCustom[cat].resize(adaptSliderWidth());
		}
	},
	true
);

Macro.add("shopclothingcustomcolourwheel", {
	handler() {
		if (this.args[0]) {
			const resp = shopClothCustomColorWheel(this.args[0], this.args[1]);
			this.output.append(resp.children[0]);
		}
	},
});

window.colourPickerShopCustom = colourPickerShopCustom;

function filterShopGroup(clothingItems) {
	if (!Array.isArray(clothingItems)) return [];
	T.itemGroups = {};
	return clothingItems.filter(item => {
		if (!item.shopGroup) return true;
		if (!T.itemGroups[item.shopGroup]) {
			T.itemGroups[item.shopGroup] = [item.index];
			return true;
		} else {
			T.itemGroups[item.shopGroup].push(item.index);
		};
	});
}
window.filterShopGroup = filterShopGroup;