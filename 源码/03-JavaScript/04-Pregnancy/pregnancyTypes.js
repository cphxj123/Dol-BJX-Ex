/* eslint-disable no-undef */
function maxParasites(genital = "anus") {
	switch (V.sexStats[genital].pregnancy.motherStatus) {
		case 1:
			return 2;
		case 2:
			return 4;
		default:
			return 1;
	}
}
window.maxParasites = maxParasites;

function canImpregnateParasite(genital = "anus") {
	if (V.parasitepregdisable === "t" || (genital === "vagina" && !V.player.vaginaExist)) return false;
	if (V.sexStats.pills.pills["Anti-Parasite Cream"] && V.sexStats.pills.pills["Anti-Parasite Cream"].doseTaken) return false;
	const pregnancy = V.sexStats[genital].pregnancy;

	if ((pregnancy.type !== null && pregnancy.type !== "parasite") || pregnancy.fetus.length >= maxParasites(genital)) return false;

	return true;
}
window.canImpregnateParasite = canImpregnateParasite;

function canBeMPregnant() {
	/* 北极星模组 */
	return (
		!V.player.vaginaExist &&
		(((V.skin.pubic.pen === "magic" || V.options.bjx_magicpreg) && V.skin.pubic.special === "pregnancy") ||
			(V.earSlime.growth >= 100 && ["pregnancy", "mixed"].includes(V.earSlime.focus)))
	);
	/* 北极星 */
}
window.canBeMPregnant = canBeMPregnant;

function npcPregObject(person, mother) {
	let result = "Invalid input";
	const parentType = mother ? 0 : 1;

	if (typeof person === "string" || person instanceof String) {
		let parentId = parentFunction.findParent(person, parentType, true);
		if (parentId === -1) {
			parentId = addToParentList(person, undefined, parentType);
		}
		if (person === "pc") {
			// pregnancy isnt required for the player
			result = {
				name: "pc",
				gender: V.player.gender,
				type: "human",
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: V.skinColor.natural,
				hairColour: V.naturalhaircolour,
				eyeColour: V.eyeselect,
			};
			/* 北极星模组 */
			if (V.options.bjx_eventTF) {
    			if (V.slime >= 1) {
    				result.type = "slime";
    			} else if (V.ghost >= 1) {
    				result.type = "ghost";
    			} else if (V.mushroom >= 1) {
    				result.type = "mushroom";
    			} else {
    				result.type = "human";
    			}
    		}
			/* 北极星 */
		} else if (C.npc[person]) {
			result = {
				name: C.npc[person].nam,
				pregnancy: C.npc[person].pregnancy,
				type: C.npc[person].type,
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: C.npc[person].skincolour,
				hairColour: C.npc[person].hairColour,
				eyeColour: C.npc[person].eyeColour,
			};
			if (C.npc[person].vagina !== "none" && C.npc[person].penis !== "none") {
				result.gender = "h";
			} else if (C.npc[person].vagina !== "none") {
				result.gender = "f";
			} else if (C.npc[person].penis !== "none") {
				result.gender = "m";
			} else {
				// No Gender detected
				return "Gender for Named NPC not found";
			}
		} else {
			// No NPC found, likely found from sperm name string
			return {
				name: person,
				type: "unknown",
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: random(0, 100) >= V.blackchance ? "black" : "white",
			};
		}
	} else {
		if (person.fullDescription) {
			let parentId = parentFunction.findParent(person.fullDescription, parentType, true);
			if (parentId === -1) {
				parentId = addToParentList(person.fullDescription, C.npc[person.fullDescription] ? undefined : person, parentType);
			}
			result = {
				name: person.fullDescription,
				pregnancy: person.pregnancy,
				type: person.type,
				parentId: Array.isArray(parentId) ? parentId[0] : parentId,
				skinColour: person.skincolour,
				hairColour: person.hairColour,
				eyeColour: person.eyeColour,
			};
			if (C.npc[person.fullDescription]) {
				if (!result.hairColour) result.hairColour = C.npc[person.fullDescription].hairColour;
				if (!result.eyeColour) result.eyeColour = C.npc[person.fullDescription].eyeColour;
			}
			if (person.vagina !== undefined && person.vagina !== "none" && person.penis !== undefined && person.penis !== "none") {
				result.gender = "h";
			} else if (person.vagina !== undefined && person.vagina !== "none") {
				result.gender = "f";
			} else if (person.penis !== undefined && person.penis !== "none") {
				result.gender = "m";
			} else {
				// No Gender detected
				return "Gender for object not found";
			}
		}
	}
	return result;
}

// When adding new types, be sure to adjust related checks in other pregnancy code that check for "human","wolf","wolfboy","wolfgirl" etc
function pregPrep({ motherObject, fatherObject, parasiteType = null, genital = null }) {
	let pregnancy;
	let fertility = 0;
	let magicTattoo = 0;
	if (!motherObject) {
		return [`mother object not provided`];
	} else if (!["anus", "vagina"].includes(genital)) {
		return [`Invalid genital '${genital}' set`];
	} else if (motherObject.name === "pc") {
		if (genital === "vagina" && !V.player.vaginaExist) return ["Player doesn't have a vagina for pregnancy"];

		/* 北极星模组 */
		if ((V.skin.pubic.pen === "magic" || V.options.bjx_magicpreg) && V.skin.pubic.special === "pregnancy") {
			magicTattoo = 1;
		}
		/* 北极星 */

		// Prevent Non-parasitic pregnancy in the anus unless the player is male with a magic tattoo
		if (genital === "anus" && !canBeMPregnant() && !parasiteType) return ["MPreg is not currently avaliable to the player"];

		pregnancy = V.sexStats[genital].pregnancy;

		// Prevent any pregnancy if a Non-parasitic pregnancy already exists
		if (pregnancy.type !== "parasite" && pregnancy.fetus.length) return ["Player currently pregnant and cannot support other types"];

		// Prevent any non-parasitic pregnancy a parasitic pregnancy already exists
		if (pregnancy.type === "parasite" && !parasiteType) return ["Player currently pregnant with parasite and cannot support other types"];

		// Prevent a parasitic pregnancy if there is not enough space
		if (parasiteType && pregnancy.fetus.length >= maxParasites(genital)) return ["Player does not have room for more parasites"];

		fertility += Math.clamp(V.sexStats.pills.pills["fertility booster"].doseTaken || 0, 0, Infinity);
	} else if (!parasiteType) {
		if (V.npcPregnancyDisable === "t") return ["NPC pregnancy disabled"];

		// Male or Unknown NPC pregnancies unsupported right now
		if (!motherObject.gender || motherObject.gender === "m") return ["Pregnancy not supported for NPC input"];

		if (C.npc[motherObject.name]) {
			pregnancy = motherObject.pregnancy;

			if (!pregnancy || !pregnancy.enabled) {
				return ["Pregnancy not supported or disabled by the player"];
			}
			if (pregnancy.pills === "fertility") {
				fertility += 1;
			}
		} else {
			// ToDo: Random npc pregnancy
			pregnancy = {
				type: motherObject.pregnancy === 0 ? null : motherObject.type,
			};
		}
	}

	if (fatherObject) {
		if (fatherObject.name === "pc") {
			/* 北极星模组 */
			if ((V.skin.pubic.pen === "magic" || V.options.bjx_magicpreg) && V.skin.pubic.special === "pregnancy") {
				magicTattoo = 1;
			}
			/* 北极星 */
			fertility += Math.clamp(V.sexStats.pills.pills["fertility booster"].doseTaken || 0, 0, Infinity);
		} else if (C.npc[fatherObject.name]) {
			if (fatherObject.pregnancy.pills === "fertility") {
				fertility += 1;
			}
		}
	}

	return [pregnancy, fertility, magicTattoo];
}

function bodySizeCalc(bodysize) {
	switch (bodysize) {
		case 0:
			return ["tiny", "tiny", "tiny", "small", "small", "normal", "large"][random(0, 6)];
		case 1:
			return ["tiny", "tiny", "small", "small", "small", "normal", "normal", "large"][random(0, 7)];
		case 2:
			return ["tiny", "small", "small", "normal", "normal", "normal", "large", "large"][random(0, 7)];
		case 3:
			return ["tiny", "small", "normal", "normal", "large", "large", "large"][random(0, 6)];
		default:
			return ["tiny", "small", "normal", "large"][random(0, 3)];
	}
}

function sizeName(bodysize) {
	switch (bodysize) {
		case 0:
			return "tiny";
		case 1:
			return "small";
		case 2:
			return "normal";
		case 3:
			return "large";
		default:
			return "normal";
	}
}

function eyeColourCalc(colour) {
	if (colour) return colour;
	return ["purple", "dark blue", "light blue", "amber", "hazel", "green", "lime green", "red", "pink", "grey", "light grey"][random(0, 10)];
}

function hairColourCalc(colour) {
	if (colour) return colour;
	return [
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
	][random(0, 13)];
}

function skinColourCalc(colour) {
	if (colour) return colour;
	return ["light", "medium", "dark", "ylight", "ymedium", "ydark"][random(0, 5)];
}

// Only applies to the pc
function beastTransform(mother, father) {
	if (mother === "pc" || father === "pc") {
		if (V.cat >= 10) return "cat";
		if (V.cow >= 6) return "cow";
		if (V.wolfgirl >= 6) return "wolf";
		if (V.harpy >= 6) return "bird";
		if (V.fox >= 6) return "fox";
		/* 北极星模组 */
		if (V.bee >= 6 && options.bjx_animal) return "bee";
		if (V.sheep >= 6 && options.bjx_animal) return "sheep";
		if (V.deer >= 6 && options.bjx_animal) return "deer";
		if (V.bear >= 6 && options.bjx_animal) return "bear";
		if (V.dragon >= 6 && options.bjx_animal) return "dragon";
		if (V.lizard >= 6 && options.bjx_animal) return "lizard";
		if (V.dolphin >= 6 && options.bjx_animal) return "dolphin";
		if (V.dog >= 6 && options.bjx_animal) return "dog";
		if (V.raccoon >= 6 && options.bjx_animal) return "raccoon";
		if (V.fish >= 6 && options.bjx_animal) return "fish";
		if (V.horse >= 6 && options.bjx_animal) return "horse";
		if (V.spider >= 6 && options.bjx_animal) return "spider";
		if (V.frog >= 6 && options.bjx_animal) return "frog";
		if (V.pig >= 6 && options.bjx_animal) return "pig";
		/* 北极星 */
	}
	return null;
}

function divineTransform(mother, father) {
	if (mother === "pc" || father === "pc") {
		if (V.angel >= 6) return "angel";
		if (V.fallenangel >= 4) return "fallen";
		/* 北极星模组 */
		if (V.hunter >= 4 && options.bjx_divine) return "hunter";
		/* 北极星 */
		if (V.demon >= 6) return "demon";
	}
	return null;
}

function removeNull(obj) {
	Object.entries(obj).forEach(([key, val]) => (val && typeof val === "object" && removeNull(val)) || (val === null && delete obj[key]));
	return obj;
}

const babyBase = ({
	mother = null,
	motherKnown = true,
	father = null,
	fatherKnown = false,
	birthId = null,
	childId = null,
	type = null,
	gender = "f",
	identical = null,
	size = null,
	hairColour = null,
	eyeColour = null,
	monster = null,
	skinColour = null,
	clothes = null,
	beastTransform = null,
	divineTransform = null,
}) => {
	return removeNull({
		type,
		mother,
		motherKnown: mother && motherKnown,
		father: father || null,
		fatherKnown: father && fatherKnown,
		born: { day: null, month: null, year: null },
		conceived: { day: Time.monthDay, month: Time.monthName, year: Time.year },
		conceivedLocation: mother === "pc" || (father === "pc" && (V.pregnancytype === "fetish" || T.npcForceImpregnation)) ? V.location : null,
		gender,
		features: {
			size,
			hairColour,
			eyeColour,
			identical,
			monster,
			clothes,
			skinColour,
			beastTransform,
			divineTransform,
		},
		name: null,
		// eslint-disable-next-line no-unneeded-ternary
		birthId,
		childId,
		location: null,
		birthLocation: null,
		localVariables: {},
	});
};

window.pregnancyGenerator = {
	human: (mother, father, fatherKnown = false, genital = "vagina") => {
		// Hard coded limit
		const limit = Object.values(V.children).length;
		if (limit >= 1000) return false;
		const motherObject = npcPregObject(mother, true);
		const fatherObject = npcPregObject(father);
		if (typeof motherObject === "string" || motherObject instanceof String) return motherObject;
		if (typeof fatherObject === "string" || fatherObject instanceof String) return fatherObject;

		if (
			V.incompletePregnancyDisable !== "f" &&
			motherObject.name === "pc" &&
			C.npc[fatherObject.name] &&
			!setup.pregnancy.canImpregnatePlayer.includes(fatherObject.name)
		) {
			return false;
		}

		if (
			V.incompletePregnancyDisable !== "f" &&
			fatherObject.name === "pc" &&
			C.npc[motherObject.name] &&
			!setup.pregnancy.canBePregnant.includes(motherObject.name)
		) {
			return false;
		}

		const [pregnancy, fertility, magicTattoo] = pregPrep({ motherObject, fatherObject, genital });
		if (typeof pregnancy === "string" || pregnancy instanceof String) {
			return pregnancy;
		} else if (pregnancy) {
			const result = { fetus: [], type: "human", timer: 0 };
			let count = 1;
			const alwaysIdentical = motherObject.name === fatherObject.name;
			const identical = alwaysIdentical || random(0, 100) > 66;
			const twinBoost = 20 * fertility + 20 * magicTattoo;
			const tripletBoost = 5 * fertility + 10 * magicTattoo;

			if (random(0, 100) > 94 - twinBoost) count++;
			if (random(0, 100) > 98 - tripletBoost) count++;
			/* Ready for the cloning of PurityGuy to begin */
			for (let i = 0; i < count; i++) {
				const childId =
					"m" + motherObject.parentId.id + "b" + motherObject.parentId.kids + "d" + fatherObject.parentId.id + "f" + fatherObject.parentId.kids;
				if (identical && result.fetus.length) {
					result.fetus.push(clone(result.fetus[0]));
					result.fetus.last().childId = childId;
					parentFunction.increaseKids(motherObject.parentId.id, 0, fatherObject.parentId.id);
					continue;
				}
				const birthId = motherObject.parentId.births;
				let gender = random(0, 100) > 50 ? "f" : "m";
				if ((motherObject.gender === "h" || fatherObject.gender === "h") && (motherObject.name === fatherObject.name || random(0, 100) >= 75))
					gender = "h";
				const baby = babyBase({
					childId,
					birthId,
					mother: motherObject.name,
					father: fatherObject.name,
					fatherKnown,
					type: "human",
					gender,
					identical: count > 1 ? identical : null,
					size: alwaysIdentical ? sizeName(V.bodysize) : bodySizeCalc(V.bodysize),
					eyeColour: [eyeColourCalc(motherObject.eyeColour), eyeColourCalc(fatherObject.eyeColour)][random(0, 1)],
					hairColour: [hairColourCalc(motherObject.hairColour), hairColourCalc(fatherObject.hairColour)][random(0, 1)],
					skinColour: [skinColourCalc(motherObject.skinColour), skinColourCalc(fatherObject.skinColour)][random(0, 1)],
					beastTransform: beastTransform(motherObject.name, fatherObject.name),
					divineTransform: divineTransform(motherObject.name, fatherObject.name),
					clothes: "naked",
				});
				result.fetus.push(baby);

				parentFunction.increaseKids(motherObject.parentId.id, 0, fatherObject.parentId.id);

				// Hard coded limit
				if (limit + result.fetus.length >= 1000) break;
			}
			result.timerEnd = random(255, 305) - count * 10;

			return result;
		}
		return false;
	},
	wolf: (mother, father, fatherKnown = false, genital = "vagina", monster = false) => {
		// Hard coded limit
		const limit = Object.values(V.children).length;
		if (limit >= 1000) return false;

		const motherObject = npcPregObject(mother, true);
		const fatherObject = npcPregObject(father);
		if (typeof motherObject === "string" || motherObject instanceof String) return motherObject;
		if (typeof fatherObject === "string" || fatherObject instanceof String) return fatherObject;

		if (
			V.incompletePregnancyDisable !== "f" &&
			motherObject.name === "pc" &&
			C.npc[fatherObject.name] &&
			!setup.pregnancy.canImpregnatePlayer.includes(fatherObject.name)
		) {
			return false;
		}

		if (
			V.incompletePregnancyDisable !== "f" &&
			fatherObject.name === "pc" &&
			C.npc[motherObject.name] &&
			!setup.pregnancy.canBePregnant.includes(motherObject.name)
		) {
			return false;
		}

		const [pregnancy, fertility, magicTattoo] = pregPrep({ motherObject, fatherObject, genital });
		if (typeof pregnancy === "string" || pregnancy instanceof String) return pregnancy;

		if (pregnancy) {
			const result = { fetus: [], type: "wolf", timer: 0 };
			const furColour = ["gray", "brown", "tan", "white"];
			if (motherObject.name === "Black Wolf" || fatherObject.name === "Black Wolf") {
				furColour.concat(["black", "black", "black"]);
			}
			for (let i = 0; i < 8; i++) {
				const childId =
					"m" + motherObject.parentId.id + "b" + motherObject.parentId.kids + "d" + fatherObject.parentId.id + "f" + fatherObject.parentId.kids;
				const birthId = motherObject.parentId.births;
				let gender = random(0, 100) > 50 ? "f" : "m";
				if ((motherObject.gender === "h" || fatherObject.gender === "h") && (motherObject.name === fatherObject.name || random(0, 100) >= 75))
					gender = "h";
				if ((mother === "pc" || father === "pc") && V.player.gender === "h" && random(0, 100) >= 75) gender = "h";
				const baby = babyBase({
					childId,
					birthId,
					mother: motherObject.name,
					father: fatherObject.name,
					fatherKnown,
					type: "wolf",
					monster: monster ? "monster" : 0,
					gender,
					size: bodySizeCalc(V.bodysize),
					eyeColour: [eyeColourCalc(motherObject.name), eyeColourCalc(fatherObject.name)][random(0, 1)],
					hairColour: furColour[random(0, furColour.length - 1)],
				});
				result.fetus.push(baby);
				parentFunction.increaseKids(motherObject.parentId.id, 0, fatherObject.parentId.id);
				if (i > 4 && random(0, 100) > 100 - i * Math.clamp(4 - fertility, 0, 4) && !magicTattoo) break;

				// Hard coded limit
				if (limit + result.fetus.length >= 1000) break;
			}
			result.timerEnd = random(70, 110);

			return result;
		}
		return false;
	},
	parasite: ({ mother = null, parasiteType = null, hermParasite = null, genital = "anus" }) => {
		const motherObject = npcPregObject(mother, true);
		if (typeof motherObject === "string" || motherObject instanceof String) return motherObject;

		const [pregnancy /* , fertility, magicTattoo */] = pregPrep({ motherObject, parasiteType, genital });
		if (typeof pregnancy === "string" || pregnancy instanceof String) return pregnancy;

		if (pregnancy) {
			/*
				creature: the type of creature it is. "Lurker", "Slime", "Pale Tentacle", etc
				fertilised: whether it's fertilised or not. Parasites need to be fertilised before they can be birthed
				daysLeft: how long until it can be birthed. Birthing is possible when it's 3 or less, but significantly more likely at 0
				timeLeft: how long until it prompts a daily event. Speed impacts how fast it goes down
				stats.growth: how long it takes to birth, and how much the parasite is worth when selling
				stats.speed: how often it prompts a daily event. Also determines the parasite's activity
			*/
			const result = { fetus: clone(pregnancy.fetus), type: "parasite" };
			const parasite = {
				creature: parasiteType,
				fertilised: !!hermParasite,
				daysLeft: 1,
				timeLeft: null,
				stats: {
					growth: random(7, 14),
					speed: random(60, 360),
				},
			};
			if (hermParasite) {
				parasite.daysLeft = Math.floor(hermParasite.stats.growth * 0.8);
				parasite.stats.growth = Math.floor(hermParasite.stats.growth * 0.8);
				parasite.stats.speed = Math.floor(hermParasite.stats.speed * 0.8);
			} else {
				if (parasiteType.includes("Pale")) {
					// Pale parasites have significantly better activity
					parasite.stats.speed *= 0.6;
				} else if (parasiteType.includes("Tentacle") || parasiteType.includes("Vine")) {
					// Tentacles and vines have better activity. Done in an elseif so pale tentacles don't get the calculation twice
					parasite.stats.speed *= 0.9;
				}
				if (parasiteType.includes("Vine") && random(0, 100) > 99) {
					// Vine Vine easter egg lol
					parasite.creature += " Vine";
					parasite.stats.growth--;
				}
				if (parasiteType.includes("Lurker")) {
					// Lurkers have better activity, but sell for less and take longer to birth
					parasite.stats.growth += 14;
					for (let i = 0; i < 3; i++) {
						if (parasite.stats.speed >= 100) {
							parasite.stats.speed -= 50;
						}
					}
				}
			}

			const genderCheck = random(0, 100);
			if (genderCheck < 70) {
				// Female parasites are most likely
				parasite.stats.gender = "Female";
			} else if (
				genderCheck > 90 &&
				maxParasites(genital) > 1 &&
				!pregnancy.fetus.find(currentParasite => currentParasite.stats.gender === "Hermaphrodite")
			) {
				// You can only get a futa if you're ready for a futa and don't currently have one
				parasite.stats.gender = "Hermaphrodite";
				parasite.stats.lastEgg = Math.floor(parasite.stats.growth / 3);
			} else {
				parasite.stats.gender = "Male";
			}
			result.fetus.push(clone(parasite));

			T.impregnatedParasite = genital;
			return result;
		}
		T.impregnatedParasite = null;
		return false;
	},
};
