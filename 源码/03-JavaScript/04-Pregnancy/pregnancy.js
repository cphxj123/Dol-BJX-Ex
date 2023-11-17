/* eslint-disable no-undef */

// Should a name type for species be setup, say, human/wolf specific names
function generateBabyName(name, gender, childId) {
	let result = "";
	const usedNames = [];
	if (usedNames.length === 0) {
		Object.values(V.children).forEach(child => {
			if (!usedNames.includes(child.name) && child.childId !== childId && child.name !== "Unnamed") {
				usedNames.push(child.name);
			}
		});
	}
	if (!!name && name !== "Unnamed") {
		return name.replace(/[^a-zA-ZÀ-ÿ ]+/g, "").substring(0, 30);
	}
	let names = [];
	switch (gender) {
		case "m":
			// eslint-disable-next-line prettier/prettier
			names = ['Addison','Algernon','Allan','Alpha','Anton','Axel','Bazza','Benton','Bernard','Brand','Brett','Cale','Calvin','Carol','Chuck','Chucky','Clay','Cornelius','Crofton','Darden','Dax','Den','Deven','Digby','Don','Douglas','Driscoll','Duane','Duke','Edmund','Elsdon','Freeman','Gabby','Garland','George','Godfrey','Graeme','Grier','Hammond','Harlan','Hendrix','Herman','Hewie','Hugh','Indiana','Ingram','Jackie','Jasper','Jaxon','Jaycob','Jere','Kamden','Kelcey','Kendall','Kevin','Kian','Kieran','Kirby','Lanny','Lawson','Laz','Leland','Levi','Lindon','Linton','Lionel','Lonny','Lucas','Manley','Maverick','Merlyn','Michael','Monty','Murphy','Nate','Ned','Nowell','Odell','Ollie','Osbert','Otto','Paget','Pip','Quintin','Raymund','Ricky','Robert','Ross','Rudolph','Sammy','Scotty','Stacey','Thad','Theodore','Tommy','Trey','Tyson','Val','Vernon','Willis','Wilmer','Winton','Wisdom'];
			break;
		case "f":
			// eslint-disable-next-line prettier/prettier
			names = ['Adelyn','Alene','Alexa','Aliah','Alyson','Angelica','Annalise','Annora','Azaria','Bessie','Betsy','Bettie','Biddy','Brianne','Camellia','Camille','Camryn','Caroline','Chastity','Chelsea','Chelsey','Cindy','Clematis','Darla','Deb','Debby','Dortha','Eleanora','Eliana','Elsabeth','Elyse','Emerson','Emmeline','Erica','Ettie','Eustacia','Evelyn','Gabrielle','Georgiana','Harper','Harrietta','Haylie','Haze','Hunter','Hyacinth','Indiana','Indie','Jacquetta','Janie','Jannine','Jonquil','Kaelyn','Kam','Khloe','Kolleen','Korrine','Kourtney','Krystine','Lavena','Leeann','Lela','Lesleigh','Lindsie','Lorena','Lucile','Luvinia','Lyn','Lyssa','Madeleine','Marian','Maudie','Maureen','Maxine','Melody','Milani','Misti','Nat','Noelle','Ottoline','Paige','Pauline','Payton','Pearl','Perlie','Petronel','Phebe','Posie','Praise','Rexana','Serena','Sharalyn','Sharla','Shauna','Sky','Sybella','Tracy','Tresha','Trudi','Wallis','Wilda','Wren','Yvette'];
			break;
	}
	// eslint-disable-next-line prettier/prettier
	names.pushUnique('Aaren','Addison','Alex','Alpha','Andie','Arden','Ariel','Artie','Ashton','Aston','Aubrey','Beau','Bernie','Bertie','Beverly','Bobbie','Brooklyn','Caelan','Cameron','Carol','Cary','Casey','Channing','Charley','Cherokee','Cheyenne','Coby','Codie','Collyn','Cyan','Dale','Dallas','Dana','Darby','Dee','Derby','Devan','Devin','Emmerson','Emory','Finley','Flannery','Florence','Gabby','Garnet','Garnett','Gray','Hadyn','Harlow','Hollis','Jackie','Jade','Jae','Jaiden','Johnnie','Joyce','Justice','Kam','Kelcey','Kelsey','Leslie','Lindsey','Lorin','Lyric','Maitland','Marley','McKinley','Merlyn','Murphy','Nicky','Oakley','Odell','Pacey','Paget','Peyton','Presley','Rain','Raleigh','Reagan','Regan','Reilly','Remington','Robbie','Rory','Royale','Sage','Sam','Schuyler','Selby','Shae','Shaye','Shelly','Skylar','Sloan','Stacey','Stacy','Tayler','Tommie','Tracey','Tristen','Tristin','Val');
	names.delete(usedNames);

	result = names[random(0, names.length - 1)];
	if (!result) result = "Unnamed";
	return result;
}
window.generateBabyName = generateBabyName;

function spermObjectToArray(spermObject = [], player, disableRng) {
	const spermArray = [];
	const trackedNPCs = [];
	for (const sperm of spermObject) {
		if (V.incompletePregnancyDisable !== "f" && V.NPCNameList.includes(sperm.source) && !setup.pregnancy.canImpregnatePlayer.includes(sperm.source)) {
			continue;
		}

		switch (sperm.type) {
			case "human":
				if (V.playerPregnancyHumanDisable === "t" && player) continue;
				break;
			case "wolf":
			case "wolfboy":
			case "wolfgirl":
				if (V.playerPregnancyBeastDisable === "t" && player) continue;
				break;
			default:
				continue;
		}

		if (!trackedNPCs.find(npc => npc.source === sperm.source)) trackedNPCs.push({ type: sperm.type, source: sperm.source });
		for (let i = 0, l = sperm.quantity; i < l; i++) {
			if (!disableRng && sperm.mod < random(0, 100)) continue;

			spermArray.push({ type: sperm.type, source: sperm.source });
			if (!disableRng && sperm.mod > random(100, 200)) spermArray.push({ type: sperm.type, source: sperm.source });
		}
	}
	return [trackedNPCs, spermArray];
}
window.spermObjectToArray = spermObjectToArray;

/* V.pregnancytype === "fetish" uses this function */
function fetishPregnancy({ genital = "vagina", target = null, spermOwner = null, spermType = null, rngModifier = 100, quantity = 1, forcePregnancy = false }) {
	if (!target || !spermOwner || !spermType) return null;
	if (["realistic", "fetish"].includes(V.pregnancytype) && !["anus", "vagina"].includes(genital)) return null;
	if (V.pregnancytype === "silly" && !["hand", "kiss"].includes(genital)) return null;

	if (["hand", "kiss"].includes(genital)) genital = target === "pc" && !V.player.vaginaExist ? "anus" : "vagina";

	const motherObject = npcPregObject(target, true);
	const [pregnancy, fertility, magicTattoo] = pregPrep({ motherObject, genital });

	// Check the cycle settings
	let multi = 1;
	if (V.cycledisable === "f") {
		if (target === "pc") {
			const menstruation = V.sexStats.vagina.menstruation;
			if (menstruation.currentState !== "normal") return null;
			const diff = Math.abs(menstruation.stages[2] - menstruation.currentDay);
			multi = Math.clamp(diff > 1 ? 1 - diff * 0.15 : 1, 0, 1);
		} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
			const diff = Math.abs(pregnancy.cycleDangerousDay - pregnancy.cycleDay);
			multi = Math.clamp(diff > 1 ? 1 - diff * 0.15 : 1, 0, 1);
		}
	} else {
		// Other non-cycle modifiers
		if (target === "pc") {
			const menstruation = V.sexStats.vagina.menstruation;
			multi = 1 / Math.pow(4, menstruation.nonCycleRng[0]);
		} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
			multi = 1 / Math.pow(4, C.npc[target].pregnancy.nonCycleRng[0]);
		}
	}

	if (pregnancy && pregnancy.type === null) {
		let chance = 100 / (target === "pc" ? 100 - V.basePlayerPregnancyChance : 20 - V.baseNpcPregnancyChance);

		if (V.earSlime.growth >= 100 && V.earSlime.focus === "pregnancy") chance *= 2;
		if (V.earSlime.growth >= 100 && V.earSlime.focus === "impregnation") chance /= 2;

		if (!forcePregnancy && chance * quantity * (rngModifier / 100) * (1 + fertility + magicTattoo) * multi < random(1, 100)) return false;

		if (target === "pc") {
			const result = playerPregnancy(spermOwner, spermType, true, genital, undefined, true);
			if (result === true) {
				T.playerIsNowPregnant = spermOwner;
				return true;
			}
		} else if (C.npc[target]) {
			const result = namedNpcPregnancy(target, spermOwner, spermType, true);
			if (result === true) {
				T.npcIsNowPregnant = target;
				return true;
			}
		}
	}
	return false;
}
window.fetishPregnancy = fetishPregnancy;

/* Player pregnancy starts here */
/* V.pregnancytype === "realistic" uses this function */
function playerPregnancyAttempt(baseMulti = 1, genital = "vagina") {
	const pregnancy = V.sexStats[genital].pregnancy;

	if (pregnancy.fetus.length || isNaN(baseMulti) || baseMulti < 1 || V.pregnancytype !== "realistic") return false;

	const [trackedNPCs, spermArray] = spermObjectToArray(V.sexStats[genital].sperm, true);

	const pills = V.sexStats.pills;
	const contraceptive = Math.clamp(pills.pills.contraceptive.doseTaken || 0, 0, Infinity);

	if (spermArray.length === 0 || (contraceptive && (random(0, 100) >= 10 || contraceptive > 1))) return false;
	let fertilityBoost = 1;

	fertilityBoost -= Math.clamp(Math.clamp(pills.pills["fertility booster"].doseTaken || 0, 0, Infinity) * 0.2, 0, 0.7);

	/* 北极星模组 */
	if ((V.skin.pubic.pen === "magic" || V.options.bjx_magicpreg) && V.skin.pubic.special === "pregnancy") {
		fertilityBoost -= 0.4;
	}
	/* 北极星 */
	let baseChance = Math.floor((100 - V.basePlayerPregnancyChance) * Math.clamp(fertilityBoost, 0.1, 1) * baseMulti);

	if (V.earSlime.growth >= 100 && V.earSlime.focus === "pregnancy") baseChance = Math.floor(baseChance * 2);
	if (V.earSlime.growth >= 100 && V.earSlime.focus === "impregnation") baseChance = Math.floor(baseChance / 2);

	const rng = random(0, spermArray.length - 1 > baseChance ? spermArray.length - 1 : baseChance);

	if (spermArray[rng]) {
		const fatherKnown = Object.keys(trackedNPCs).length === 1;

		// Player becomes pregnant
		return playerPregnancy(spermArray[rng].source, spermArray[rng].type, fatherKnown, genital, trackedNPCs);
	}
	return false;
}
DefineMacro("playerPregnancyAttempt", playerPregnancyAttempt);
window.playerPregnancyAttemptTest = (baseMulti, genital) => {
	if (V.pregnancyTesting) return playerPregnancyAttempt(baseMulti, genital);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

const playerPregnancy = (npc, npcType, fatherKnown = false, genital = "vagina", trackedNPCs, awareOf = false) => {
	if (V.playerPregnancyHumanDisable === "t" && npcType === "human") return false; // Human player pregnancy disabled
	if (V.playerPregnancyBeastDisable === "t" && npcType !== "human") return false; // Beast player pregnancy disabled
	const pregnancy = clone(V.sexStats[genital].pregnancy);
	let newPregnancy;
	let backupSpermType;

	switch (npcType) {
		case "human":
			newPregnancy = pregnancyGenerator.human("pc", npc, fatherKnown, genital);
			backupSpermType = "human";
			break;
		case "wolf":
			newPregnancy = pregnancyGenerator.wolf("pc", npc, fatherKnown, genital);
			backupSpermType = "wolf";
			break;
		case "wolfboy":
		case "wolfgirl":
			newPregnancy = pregnancyGenerator.wolf("pc", npc, fatherKnown, genital, true);
			backupSpermType = "wolf";
			break;
	}
	if (newPregnancy && !(typeof newPregnancy === "string" || newPregnancy instanceof String) && newPregnancy.fetus.length) {
		V.sexStats[genital].pregnancy = {
			...pregnancy,
			...newPregnancy,
			potentialFathers: trackedNPCs || [{ type: backupSpermType, source: npc }],
			waterBreakingTimer: random(0, 24),
			waterBreaking: false,
			awareOf,
		};
		V.sexStats.vagina.menstruation.currentState = "pregnant";
		return true;
	}
	return false;
};
DefineMacro("playerPregnancy", playerPregnancy);
window.playerPregnancyTest = (npc, npcType, fatherKnown, genital, trackedNPCs, awareOf) => {
	if (V.pregnancyTesting) return playerPregnancy(npc, npcType, fatherKnown, genital, trackedNPCs, awareOf);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

// Run 2 times per day, math should reflect that
// eslint-disable-next-line no-unused-vars
function pregnancyProgress(genital = "vagina") {
	const pregnancy = V.sexStats[genital].pregnancy;
	if (!pregnancy || pregnancy.type === null || pregnancy.type === "parasite" || V.statFreeze) return null;

	V.pregnancyStats.totalDaysPregnant += 0.5;
	if (pregnancy.awareOf) V.pregnancyStats.totalDaysPregnancyKnown += 0.5;

	if (pregnancy.timer < pregnancy.timerEnd) {
		let multiplier = 1;
		switch (pregnancy.type) {
			case "human":
				multiplier = 9 / V.humanPregnancyMonths;
				break;
			case "wolf":
				multiplier = 12 / V.wolfPregnancyWeeks;
				break;
		}
		// The `0.5 * ` is because it runs at both midnight and noon
		pregnancy.timer += parseFloat((0.5 * multiplier).toFixed(3));

		/* Keeping fatigue low should help morning sickness */
		if (between(pregnancy.timer / pregnancy.timerEnd, 0.15, 0.25)) {
			/* Early Morning sickness */
			/* Light Nausea/dizzyness at any time of day, but mostly when waking up */
			if (random(0, 100) >= 30) {
				V.pregnancyStats.morningSicknessWaking = 1;
			}
			if (random(0, 100) >= 30) {
				V.pregnancyStats.morningSicknessGeneral = 1;
			}
		} else if (between(pregnancy.timer / pregnancy.timerEnd, 0.24, 0.45)) {
			/* Morning sickness */
			/* Nausea/dizzyness at any time of day, but mostly when waking up */
			/* First pregnancy should be worse */
			V.pregnancyStats.morningSicknessWaking = [1, 2, 2][random(0, 2)];
			if (pregnancy.totalBirthEvents === 0 && V.pregnancyStats.morningSicknessWaking < 2) {
				V.pregnancyStats.morningSicknessWaking = 2;
			}
		}
		if (pregnancy.timer >= pregnancy.timerEnd) {
			if (V.player.breastsize <= 4 && V.player.breastsize < V.breastsizemax) {
				V.player.breastsize += 1;
				if (V.player.breastsize <= 4 && V.player.breastsize < V.breastsizemax) V.player.breastsize += 1;
				V.breastgrowthtimer = 700;
				V.breastgrowthmessage = V.player.breastsize;
				V.effectsmessage = 1;
			}
			if (V.lactating !== 1 && V.breastfeedingdisable === "f" && V.player.breastsize > 0) {
				V.lactating = 1;
				V.lactation_pressure = 100;
				Wikifier.wikifyEval("<<milkvolume 50>>");
				V.effectsmessage = 1;
				V.lactationmessage = 1;
			}
		}
	}
}

// eslint-disable-next-line no-unused-vars
function playerEndWaterProgress() {
	const pregnancy = getPregnancyObject();
	if (!pregnancy || !pregnancy.type || pregnancy.type === "parasite" || pregnancy.timer < pregnancy.timerEnd || V.statFreeze) {
		// Fixes an issue when the above "parasite" was "parasites"
		if (pregnancy && (!pregnancy.type || pregnancy.type === "parasite") && pregnancy.waterBreaking) waterBreaking = false;
		return null;
	}

	if (
		!isNaN(pregnancy.waterBreakingTimer) &&
		pregnancy.waterBreakingTimer > 0 &&
		(pregnancy.waterBreakingTimer > 1 || (!V.NPCList[0].type && !V.possessed) || V.eventAllowsWaterBreaking)
	) {
		pregnancy.waterBreakingTimer--;
		if (pregnancy.waterBreakingTimer <= 0) {
			pregnancy.waterBreaking = true;
			// To prevent new events from occuring, allowing players to more easily go to the hospital or similar locations
			V.eventskip = 1;
			return true;
		}
		return false;
	} else if (!isNaN(pregnancy.waterBreakingTimer) && !pregnancy.waterBreaking && pregnancy.waterBreakingTimer <= 0) {
		pregnancy.waterBreaking = true;
		// To prevent new events from occuring, allowing players to more easily go to the hospital or similar locations
		V.eventskip = 1;
		return true;
	}
}

// Used only when the player is about to give birth to their children and the player can name them
function playerEndWaterBreaking() {
	V.sexStats.vagina.pregnancy.waterBreaking = null;
	V.sexStats.vagina.pregnancy.waterBreakingTimer = null;
	V.sexStats.anus.pregnancy.waterBreaking = null;
	V.sexStats.anus.pregnancy.waterBreakingTimer = null;
}
DefineMacro("playerEndWaterBreaking", playerEndWaterBreaking);

function endPlayerPregnancy(birthLocation, location) {
	const [pregnancy, genital] = getPregnancyObject("pc", true);
	const menstruation = V.sexStats.vagina.menstruation;

	if (!pregnancy || !pregnancy.fetus.length) return false;

	giveBirthToChildren("pc", birthLocation, location);

	switch (pregnancy.type) {
		case "human":
			menstruation.recoveryTime = random(2, 3) * V.humanPregnancyMonths;
			break;
		case "wolf":
			menstruation.recoveryTime = random(1, 2) * V.wolfPregnancyWeeks;
			break;
	}

	if ((genital === "vagina" && V.player.virginity.vaginal === true) || (genital === "anus" && V.player.virginity.anal === true)) {
		V.pregnancyStats.playerVirginBirths.pushUnique(pregnancy.fetus[0].birthId);
	}

	V.sexStats[genital].pregnancy = {
		...pregnancy,
		totalBirthEvents: (pregnancy.totalBirthEvents || 0) + 1,
		fetus: [],
		waterBreaking: false,
		waterBreakingTimer: null,
		type: null,
		timer: null,
		timerEnd: null,
		awareOf: null,
		awareOfMultiple: null,
		awareOfDetails: null,
		potentialFathers: [],
	};

	V.sexStats.vagina.menstruation = {
		...menstruation,
		currentState: "recovering",
		recoveryTimeStart: menstruation.recoveryTime,
		recoveryStage: 0,
		periodEnabled: false,
		awareOfPeriodDelay: false,
	};

	delete V.templeVirginPregnancy;
	delete V.caveHumanPregnancyDiscovered;

	delete C.npc.Alex.pregnancy.knowledge;
	delete C.npc.Alex.pregnancy.test;
	delete C.npc.Alex.pregnancy.sample;
	delete C.npc.Alex.pregnancy.noBirthControl;
	C.npc.Alex.pregnancy.pills = "contraceptive";
 	C.npc.Alex.pregnancyAvoidance = 50;

	if (Object.values(V.children).find(child => child.mother === "Alex" && child.location === "home") || Object.values(V.children).find(child => child.father === "Alex" && child.location === "home"))
	{
	
	} else {
		delete C.npc.Alex.pregnancy.fee;
	}

	return true;
}
DefineMacro("endPlayerPregnancy", endPlayerPregnancy);
window.endPlayerPregnancyTest = (birthLocation, location) => {
	if (V.pregnancyTesting && birthLocation && location) return endPlayerPregnancy(birthLocation, location);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only
/* Player pregnancy ends here */

/* Named NPC pregnancy starts here */
// eslint-disable-next-line no-unused-vars
function npcPregnancyCycle() {
	if (V.statFreeze) return null;
	for (const npcName of V.NPCNameList) {
		const npc = C.npc[npcName];
		if (!npc) continue;
		const pregnancy = npc.pregnancy;
		if (!pregnancy) continue;
		if (pregnancy.fetus && pregnancy.fetus.length) {
			let multiplier = 1;
			switch (pregnancy.type) {
				case "human":
					multiplier = 9 / V.humanPregnancyMonths;
					break;
				case "wolf":
					multiplier = 12 / V.wolfPregnancyWeeks;
					break;
			}
			pregnancy.timer += parseFloat(multiplier.toFixed(3));
			if (pregnancy.timer > pregnancy.timerEnd * 0.2 && !pregnancy.npcAwareOf) {
				pregnancy.npcAwareOf = true;
			}
			if (pregnancy.timer > pregnancy.timerEnd) {
				if (pregnancy.timer >= pregnancy.timerEnd + 14 * multiplier) {
					/* Player has not seen the npc recently, sort out the pregnancy in another way */
					let birthLocation = "";
					let location = "";
					switch (npcName) {
						case "Black Wolf":
							birthLocation = "wolf_cave";
							location = "wolf_cave";
							break;

						case "Alex":
							if (!C.npc.Alex.pregnancy.missedBirth) {
								C.npc.Alex.pregnancy.missedBirth = true;
								C.npc.Alex.pregnancy.missedBirthCount = 1;

							} else {
								C.npc.Alex.pregnancy.missedBirth = true;
								C.npc.Alex.pregnancy.missedBirthCount += 1;
							}

							if (C.npc.Alex.pregnancy.nursery === true) {
								birthLocation = "alex_cottage";
								location = "alex_cottage";

							} else {
								birthLocation = "alex_cottage";
								location = "home";

							}

							break;
					}
					[birthLocation, location] = defaultBirthLocations(pregnancy.type, birthLocation, location);
					endNpcPregnancy(npcName, birthLocation, location);
				} else {
					/* Can deal with the npc in the next event */
					pregnancy.waterBreaking = true;
				}
			}
		} else if (pregnancy.enabled && V.npcPregnancyDisable === "f") {
			if (V.cycledisable === "f") {
				pregnancy.cycleDay++;
				if (pregnancy.cycleDay >= pregnancy.cycleDaysTotal) {
					pregnancy.cycleDay = 1;
				} else if (between(pregnancy.cycleDay, pregnancy.cycleDangerousDay - 1, pregnancy.cycleDangerousDay + 1)) {
					namedNpcPregnancyAttempt(npcName);
				}
			} else {
				pregnancy.nonCycleRng.push(random(0, 4));
				pregnancy.nonCycleRng.deleteAt(0);
			}
		}
		updateRecordedSperm("vagina", npcName, 1);
	}
}

/* V.pregnancytype === "realistic" uses this function */
function namedNpcPregnancyAttempt(npcName) {
	if (!C.npc[npcName] || C.npc[npcName].vagina === "none" || V.pregnancytype !== "realistic") return false;

	const namedNpc = C.npc[npcName];
	const pregnancy = namedNpc.pregnancy;
	if (!pregnancy || !pregnancy.enabled || pregnancy.fetus.length) {
		// Pregnancy not supported or disabled by the player, or when they are already pregnant
		return false;
	}
	const [trackedNPCs, spermArray] = spermObjectToArray(pregnancy.sperm, false);

	const fertility = pregnancy.pills === "fertility" ? 0.8 : 1;
	const contraceptive = pregnancy.pills === "contraceptive";

	const baseChance = Math.floor((20 - V.baseNpcPregnancyChance) * fertility);
	const rng = random(0, spermArray.length > baseChance ? spermArray.length : baseChance);
	if (contraceptive && random(0, 100) >= 10) {
		/* NPC doesn't get pregnant due to contraceptive */
	} else if (spermArray[rng]) {
		const fatherKnown = Object.keys(trackedNPCs).length === 1;

		/* NPC gets pregnant */
		return namedNpcPregnancy(npcName, spermArray[rng].source, spermArray[rng].type, fatherKnown, trackedNPCs);
	}
	return false;
}

function namedNpcPregnancy(mother, father, fatherSpecies, fatherKnown = false, trackedNPCs, awareOf = false) {
	if (V.npcPregnancyDisable === "t") return false; // Npc pregnancy disabled
	const namedNpc = C.npc[mother];
	let namedNpcType;
	switch (mother) {
		case "Black Wolf":
			if ((V.monsterchance > random(0, 100) && (V.hallucinations >= 1 || V.monsterhallucinations === "f")) || V.blackwolfmonster === 2) {
				namedNpcType = "wolfgirl";
			} else {
				namedNpcType = namedNpc.type;
			}
			break;
		default:
			namedNpcType = namedNpc.type;
			break;
	}
	let newPregnancy;
	let backupSpermType;
	switch (fatherSpecies + namedNpcType) {
		case "humanhuman":
			newPregnancy = pregnancyGenerator.human(mother, father, fatherKnown, "vagina");
			backupSpermType = "human";
			break;
		case "wolfhuman":
		case "humanwolf":
		case "wolfwolf":
			newPregnancy = pregnancyGenerator.wolf(mother, father, fatherKnown, "vagina");
			backupSpermType = "wolf";
			break;
		case "humanwolfboy":
		case "wolfboyhuman":
		case "wolfwolfboy":
		case "wolfboywolf":
		case "wolfboywolfboy":
		case "humanwolfgirl":
		case "wolfgirlhuman":
		case "wolfwolfgirl":
		case "wolfgirlwolf":
		case "girlwolfgirlwolf":
			newPregnancy = pregnancyGenerator.wolf(mother, father, fatherKnown, "vagina", true);
			backupSpermType = "wolf";
			break;
	}
	if (newPregnancy && !(typeof newPregnancy === "string" || newPregnancy instanceof String) && newPregnancy.fetus.length) {
		namedNpc.pregnancy = {
			...namedNpc.pregnancy,
			...newPregnancy,
			potentialFathers: trackedNPCs || [{ type: backupSpermType, source: father }],
			npcAwareOf: false,
			pcAwareOf: awareOf,
		};
		return true;
	}
	return false;
}
DefineMacro("namedNpcPregnancy", namedNpcPregnancy);
window.namedNpcPregnancyTest = (mother, father, pregnancyType, fatherKnown, trackedNPCs, awareOf) => {
	if (V.pregnancyTesting) return namedNpcPregnancy(mother, father, pregnancyType, fatherKnown, trackedNPCs, awareOf);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only

function endNpcPregnancy(npcName, birthLocation, location) {
	if (!C.npc[npcName] || C.npc[npcName].vagina === "none" || C.npc[npcName].pregnancy.enabled === undefined) {
		return false;
	}
	const pregnancy = C.npc[npcName].pregnancy;

	if (!pregnancy || pregnancy.enabled === undefined || !pregnancy.fetus.length) return false;

	// Handled by Baileys Orphanage event and when naming them, this is backup for other situations
	if (location !== "home" && pregnancy.fetus[0].mother !== "pc" && pregnancy.fetus[0].father === "pc") {
		document.getElementById("passages").children[0].append(Wikifier.wikifyEval('<<earnFeat "First Fatherhood">>'));
	}

	giveBirthToChildren(npcName, birthLocation, location);

	const birthEvents = clone(pregnancy.totalBirthEvents) + 1;
	const cycleDay = clone(pregnancy.cycleDaysTotal) - 3;

	V.NPCName[V.NPCNameList.indexOf(npcName)].pregnancy = {
		...pregnancy,
		totalBirthEvents: (pregnancy.totalBirthEvents || 0) + 1,
		fetus: [],
		birthEvents,
		timer: null,
		timerEnd: null,
		waterBreaking: false,
		npcAwareOf: null,
		pcAwareOf: null,
		type: null,
		potentialFathers: [],
		cycleDay,
	};

	if (npcName === "Alex") {
		delete C.npc.Alex.pregnancy.knowledge;
		delete C.npc.Alex.pregnancy.test;
		delete C.npc.Alex.pregnancy.sample;
		delete C.npc.Alex.pregnancy.noBirthControl;

		C.npc.Alex.pregnancy.pills = "contraceptive";
 		C.npc.Alex.pregnancyAvoidance = 50;

		if (Object.values(V.children).find(child => child.mother === "Alex" && child.location === "home") || Object.values(V.children).find(child => child.father === "Alex" && child.location === "home"))
		{
		
		} else {
			delete C.npc.Alex.pregnancy.fee;
		}

	}

	V.pregnancyStats.npcTotalBirthEvents++;
	return true;
}
DefineMacro("endNpcPregnancy", endNpcPregnancy);
window.endNpcPregnancyTest = (npcName, birthLocation, location) => {
	if (V.pregnancyTesting && npcName && birthLocation && location) return endNpcPregnancy(npcName, birthLocation, location);
}; // V.pregnancyTesting Check should not be removed, debugging purposes only
/* Named NPC pregnancy ends here */

// eslint-disable-next-line no-unused-vars
function randomPregnancyProgress() {
	if (!V || !V.storedNPCs || V.statFreeze) return false;
	const toDelete = [];
	Object.keys(V.storedNPCs).forEach(npcKey => {
		const npc = V.storedNPCs[npcKey];
		if (npc.pregnancy) {
			let multiplier = 1;
			switch (npc.pregnancy.type) {
				case "human":
					multiplier = 9 / V.humanPregnancyMonths;
					break;
				case "wolf":
					multiplier = 12 / V.wolfPregnancyWeeks;
					break;
			}
			npc.pregnancy.timer += parseFloat(multiplier.toFixed(3));
			if (npc.pregnancy.timer >= npc.pregnancy.timerEnd) {
				let npcDecompressed;
				try {
					npcDecompressed = npcDecompressor(npc.npc);
				} catch (e) {
					console.error("randomPregnancyProgress", e);
					Errors.report(
						"randomPregnancyProgress - Compressed NPC '" +
							npcKey +
							"' cannot be decompressed for pregnancy compatibility check. Please export your save if reporting.",
						e
					);
				}
				const [birthLocation, location] = defaultBirthLocations(npc.pregnancy.type);
				if (npcDecompressed) {
					giveBirthToChildren(npcDecompressed.fullDescription, birthLocation, location, npc.pregnancy);
				} else {
					giveBirthToChildren(npc.pregnancy.fetus[0].mother, birthLocation, location, npc.pregnancy);
				}
				toDelete.push(npcKey);
			}
		}
	});
	toDelete.forEach(npcKey => delete V.storedNPCs[npcKey]);
	return true;
}

function defaultBirthLocations(type, birthLocation, location) {
	switch (type) {
		case "human":
			if (!birthLocation) birthLocation = "hospital";
			if (!location) location = "home";
			break;
		case "wolf":
			if (!birthLocation) birthLocation = "wolf_cave";
			if (!location) location = "wolf_cave";
			break;
		default: /* Considered an invalid location when the above is not updated */
			if (!birthLocation) birthLocation = "unknown";
			if (!location) location = "unknown";
			break;
	}
	return [birthLocation, location];
}

function giveBirthToChildren(mother, birthLocation, location, pregnancyOverride) {
	let pregnancy;
	if (mother === "pc") {
		pregnancy = getPregnancyObject();
	} else if (C.npc[mother]) {
		pregnancy = C.npc[mother].pregnancy;
	} else {
		pregnancy = pregnancyOverride;
	}
	if (!pregnancy || !pregnancy.fetus.length) return false;
	if (mother) {
		let parentId = parentFunction.findParent(mother, 0, true);
		if (parentId) {
			if (Array.isArray(parentId)) parentId = parentId[0];
			parentFunction.increaseBirths(parentId.id, 0);
			// Fix for previous named npc's not updating totalBirthEvents
			if (mother !== "pc") pregnancy.totalBirthEvents = parentId.births;
		}
	}

	const birthId = mother + pregnancy.fetus[0].birthId;
	switch (location) {
		case "home":
			setKnowsAboutPregnancy(mother, "Bailey", birthId, true, pregnancyOverride);
			break;
		case "wolf_cave":
			setKnowsAboutPregnancy(mother, "Black Wolf", birthId);
			break;
		default:
			break;
	}

	switch (pregnancy.type) {
		case "human":
			V.pregnancyStats.humanToysUnlocked = true;
			break;
		case "wolf":
			V.pregnancyStats.wolfToysUnlocked = true;
			break;
	}

	pregnancy.fetus.forEach(childObject => {
		pregnancy.givenBirth++;
		V.children[childObject.childId] = {
			...childObject,
			name: generateBabyName(childObject.name, childObject.gender, childObject.childId),
			born: { day: clone(Time.monthDay), month: clone(Time.monthName), year: clone(Time.year) },
			location,
			birthLocation,
		};
		if (childObject.mother === "pc") {
			V.pregnancyStats.playerChildren++;
		} else if (childObject.father === "pc") {
			V.pregnancyStats.npcChildren++;
		} else {
			V.pregnancyStats.npcChildrenUnrelatedToPlayer++;
		}
		switch (childObject.type) {
			case "human":
				V.pregnancyStats.humanChildren++;
				break;
			case "wolf":
				V.pregnancyStats.wolfChildren++;
				break;
		}
	});
	return true;
}

function recordSperm({
	genital = "vagina",
	target = null,
	spermOwner = null,
	spermType = null,
	daysTillRemovalOverride = null,
	rngModifier = 100,
	rngType,
	quantity = 1,
}) {
	if (!target || !spermOwner || !setup.pregnancy.typesEnabled.includes(spermType)) return null;
	if (V.activeNightmare) return false; // Should not work if the player is in a nightmare

	// Deal with earslime tasks, the player is not told about it being completed on purpose
	if (V.earSlime.event.includes("get sperm into your") && !V.earSlime.event.includes("completed") && target === "pc") {
		if (V.earSlime.event.includes("vagina") && genital === "vagina") V.earSlime.event += " completed";
		if (V.earSlime.event.includes("anus") && genital === "anus") V.earSlime.event += " completed";
	}
	if (V.earSlime.event.includes("get your own sperm into your") && !V.earSlime.event.includes("completed") && target === "pc" && spermOwner === "pc") {
		if (V.earSlime.event.includes("vagina") && genital === "vagina") V.earSlime.event += " completed";
		if (V.earSlime.event.includes("anus") && genital === "anus") V.earSlime.event += " completed";
	}

	if (V.disableImpregnation) return false; // To be set at the start of sex scenes, unset with <<endcombat>>
	if (V.playerPregnancyHumanDisable === "t" && spermType === "human" && target === "pc") return false; // Human player pregnancy disabled
	if (V.playerPregnancyBeastDisable === "t" && spermType !== "human" && target === "pc") return false; // Beast player pregnancy disabled
	if (V.npcPregnancyDisable === "t" && target !== "pc") return false; // Npc pregnancy disabled

	if (["realistic", "fetish"].includes(V.pregnancytype) && !["anus", "vagina"].includes(genital)) return null;
	if (V.pregnancytype === "silly") {
		if (!["hand", "kiss"].includes(genital)) return null;
		if ((target === "pc" || spermOwner === "pc") && genital === "hand" && V.worn.hands.name !== "naked") return null;
		if ((target === "pc" || spermOwner === "pc") && genital === "kiss" && V.worn.face.type.includes("covered")) return null;
		if (Object.values(V.loveInterest).find(name => V.NPCNameList.includes(name))) rngModifier = Math.clamp(rngModifier + 100, 0, 200);
	}

	let spermOwnerName;
	if (typeof spermOwner === "string" || spermOwner instanceof String) {
		spermOwnerName = spermOwner;
	} else if (C.npc[spermOwner.fullDescription]) {
		spermOwnerName = spermOwner.fullDescription;
	} else {
		if (!spermOwner.role) {
			spermOwnerName = spermOwner.fullDescription;
		} else if (spermOwner.role && spermOwner.role !== "normal" && spermOwner.name_known) {
			spermOwnerName = spermOwner.name + " the " + spermOwner.role;
		} else {
			spermOwnerName = spermOwner.fullDescription + (spermOwner.role && spermOwner.role !== "normal" ? " the " + spermOwner.role : "");
		}
	}
	if (setup.pregnancy.infertile.includes(spermOwnerName) || setup.pregnancy.infertile.includes(target)) return null;

	const forcePregnancy =
		(target === "pc" &&
			((V.vaginaaction === "forceImpregnation" && genital === "vagina") || (V.anusaction === "forceImpregnation" && genital === "anus"))) ||
		(target !== "pc" && spermOwner === "pc" && genital === "vagina" && T.npcForceImpregnation);

	if (!forcePregnancy && V.disableNormalImpregnation) return false; // To be set at the start of sex scenes, unset with <<endcombat>>

	if (["fetish", "silly"].includes(V.pregnancytype) || forcePregnancy) {
		// Sperm on the outside should not be able to get the player pregnant
		if (rngType === "canWash") return null;

		return fetishPregnancy({ genital, target, spermOwner: spermOwnerName, spermType, rngModifier, quantity, forcePregnancy });
	}

	let sperm;
	if (target === "pc") {
		sperm = V.sexStats[genital].sperm;
	} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
		sperm = C.npc[target].pregnancy.sperm;
	}
	if (sperm) {
		let daysTillRemoval = daysTillRemovalOverride || random(4, 8);

		// Normal sperm should only last a day
		if (V.cycledisable === "t") daysTillRemoval = Math.ceil(daysTillRemoval / 8);

		rngModifier = !isNaN(rngModifier) ? rngModifier : 100;

		if (spermOwnerName === "pc") {
			const pills = V.sexStats.pills;
			if (pills.pills["fertility booster"].doseTaken) {
				rngModifier += Math.clamp(pills.pills["fertility booster"].doseTaken || 0, 0, Infinity) * 25;
			} else if (pills.pills.contraceptive.doseTaken) {
				rngModifier -= Math.clamp(pills.pills.contraceptive.doseTaken || 0, 0, Infinity) * 50;
			}
		} else if (C.npc[spermOwnerName] && C.npc[spermOwnerName].pregnancy) {
			switch (C.npc[spermOwnerName].pregnancy.pills) {
				case "fertility":
					rngModifier += 25;
					break;
				case "contraceptive":
					rngModifier -= 50;
					break;
			}
		}
		rngModifier = Math.clamp(rngModifier, 0, 200);
		if (rngModifier === 0) return false;

		// The  number in `1 + rngType`, the number should match the number of times `updatePlayerRecordedSperm` should not delete the `canWash` tag
		switch (rngType) {
			case "canWash":
				rngType = 1 + rngType;
				break;
			default:
				break;
		}

		const spermFoundIndex = sperm.findIndex(
			item =>
				item.source === spermOwnerName &&
				item.type === spermType &&
				item.daysLeft === daysTillRemoval &&
				item.mod === rngModifier &&
				item.tag === rngType
		);

		if (spermFoundIndex !== -1) {
			sperm[spermFoundIndex].quantity += quantity;
			return true;
		} else {
			const newSperm = {
				source: spermOwnerName,
				type: spermType,
				quantity,
				daysLeft: daysTillRemoval,
			};
			if (rngType) newSperm.tag = rngType;
			if (rngModifier) newSperm.mod = rngModifier;

			sperm.push(newSperm);
			return true;
		}
	}
	return false;
}
DefineMacro("recordSperm", recordSperm);
DefineMacro("recordVaginalSperm", (target, spermOwner, spermType, daysTillRemovalOverride) =>
	recordSperm({ target, spermOwner, spermType, daysTillRemovalOverride })
);
DefineMacro("recordAnusSperm", (target, spermOwner, spermType, daysTillRemovalOverride) =>
	recordSperm({ genital: "anus", target, spermOwner, spermType, daysTillRemovalOverride })
);
window.recordSperm = recordSperm;

// Period is `1 divided how many timers per day the function is run`
function updateRecordedSperm(genital, target, period = 1) {
	let sperm;
	if (genital !== "vagina" && target !== "pc") return null;
	if (target === "pc") {
		sperm = V.sexStats[genital].sperm;
	} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
		sperm = C.npc[target].pregnancy.sperm;
	}
	if (sperm) {
		sperm.forEach(s => {
			s.daysLeft -= period;

			if (s.tag && s.tag.includes("canWash") && !isNaN(parseInt(s.tag))) {
				let canWashCount = parseInt(s.tag);
				canWashCount--;
				if (canWashCount >= 0) {
					s.tag = canWashCount + "canWash";
				} else {
					s.tag = "";
				}
			}
		});

		// Remove sperm that is too old now
		if (target === "pc") {
			V.sexStats[genital].sperm = sperm.filter(s => s.daysLeft > 0);
		} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
			C.npc[target].pregnancy.sperm = sperm.filter(s => s.daysLeft > 0);
		}
	}
}
DefineMacro("updateRecordedSperm", updateRecordedSperm);

function washRecordedSperm(genital, target) {
	if (genital !== "vagina" && target !== "pc") return null;
	if (target === "pc") {
		V.sexStats[genital].sperm = V.sexStats[genital].sperm.filter(s => !s.tag || (s.tag && !s.tag.includes("canWash")));
	} else if (C.npc[target] && C.npc[target].pregnancy && C.npc[target].pregnancy.enabled) {
		C.npc[target].pregnancy.sperm = C.npc[target].pregnancy.sperm.filter(s => !s.tag || (s.tag && !s.tag.includes("canWash")));
	}
}
DefineMacro("washRecordedSperm", washRecordedSperm);

function playerCanBreedWith(npc) {
	/* This function can accept either a named NPC's name, or an NPC object from either NPCList or NPCName.
	 * Examples: playerCanBreedWith("Kylar"), or playerCanBreedWith($NPCList[0]) or playerCanBreedWith($NPCName[$NPCNameList.indexOf("Kylar")])
	 * Returns true or false. If you give it garbage, like a totally wrong name, it'll return false, so be careful about silent failures like that.
	 * Should be used for NPC breeding lines ONLY.
	 */
	if (typeof npc === "string") npc = V.NPCName[V.NPCNameList.indexOf(npc)];

	return (
		((V.player.vaginaExist || (canBeMPregnant() && C.npc[npc.fullDescription] && knowsAboutAnyPregnancy("pc", npc.fullDescription))) &&
			npc.penis !== "none") ||
		(V.player.penisExist && npc.vagina !== "none")
	);
}
window.playerCanBreedWith = playerCanBreedWith;

function pregnancyCompatible(NPC) {
	if (playerPregnancyPossibleWith(NPC) === false || NPCPregnancyPossibleWithPlayer(NPC) === false) return false;
	return true;
}
window.pregnancyCompatible = pregnancyCompatible;

function playerPregnancyPossibleWith(NPC) {
	/* Like the above function, this will accept either a named NPC's name, or an NPC object from either NPCList or NPCName.
	 * This one checks if the player could become pregnant, rather than the NPC.
	 * Returns true or false, as well as sets T.pregFalseReason, so writers can make events around the specific reason why a player and NPC might not be compatible for pregnancy at any given time.
	 */
	T.pregFalseReason = "";
	let NPCObject;
	if (typeof NPC === "string" || V.NPCNameList.includes(NPC.fullDescription)) {
		// Check if this is a named NPC, whether the function is provided a string or NPCList object that belongs to a named NPC
		NPCObject = V.NPCName[V.NPCNameList.indexOf(typeof NPC === "string" ? NPC : NPC.fullDescription)];

		const NPCNameCheck = NPCObject.fullDescription || NPCObject.description; // .description is only for backup, should not be needed in normal cases
		if (
			setup.pregnancy.infertile.includes(NPCNameCheck) ||
			(V.incompletePregnancyDisable !== "f" && C.npc[NPCNameCheck] && !setup.pregnancy.canImpregnatePlayer.includes(NPCNameCheck))
		) {
			T.pregFalseReason = "infertile";
			return false; // Check for named NPC being "infertile"
			// "this check is placed here because it only applies to named NPCs" - hwp told me to put this here
		}
	}
	if (!NPCObject) {
		if (typeof NPC === "object" && !Array.isArray(NPC) && NPC !== null) {
			NPCObject = NPC;
		} else {
			T.pregFalseReason = "invalidNpc";
			return false; // Check if the npc is valid
		}
	}
	if (getPregnancyObject().fetus.length) {
		T.pregFalseReason = "playerPregnant";
		return false; // Check if player is already pregnant
	}
	switch (NPCObject.type) {
		case "human":
			if (V.playerPregnancyHumanDisable === "t") {
				T.pregFalseReason = "pregnantDisabled";
				return false;
			} else break; // Check Human and Beast pregnancy settings
		case "wolf":
		case "wolfboy":
		case "wolfgirl":
			// case "bird":
			if (V.playerPregnancyBeastDisable === "t") {
				T.pregFalseReason = "pregnantDisabled";
				return false;
			} else break;
		// Check if NPC species can impregnate the player yet
		default:
			T.pregFalseReason = "pregnantTypeUnsupported";
			return false;
	}
	if (!((V.player.vaginaExist || canBeMPregnant()) && NPCObject.gender === "m")) {
		T.pregFalseReason = "genitals";
		return false; // Check for genital compatibility for player pregnancy
	}
	return true;
}
window.playerPregnancyPossibleWith = playerPregnancyPossibleWith;

function NPCPregnancyPossibleWithPlayer(NPC) {
	/* Like the above function, this will accept either a named NPC's name, or an NPC object from either NPCList or NPCName.
	 * This one checks if the NPC could become pregnant, rather than the player.
	 * Returns true or false, as well as sets T.pregFalseReason, so writers can make events around the specific reason why a player and NPC might not be compatible for pregnancy at any given time.
	 */
	T.pregFalseReason = "";
	let NPCObject;
	if (typeof NPC === "string" || V.NPCNameList.includes(NPC.fullDescription)) {
		// Check if this is a named NPC, whether the function is provided a string or NPCList object that belongs to a named NPC
		NPCObject = V.NPCName[V.NPCNameList.indexOf(typeof NPC === "string" ? NPC : NPC.fullDescription)];
		const NPCNameCheck = NPCObject.fullDescription || NPCObject.description;
		if (!C.npc[NPCNameCheck]) {
			Errors.report("Named NPC " + NPCNameCheck + " is undefined for pregnancy compatibility check.");
			return false;
		}
		if (setup.pregnancy.infertile.includes(NPCNameCheck) || !NPCObject.pregnancy.enabled) {
			T.pregFalseReason = "infertile";
			return false; // Check for named NPC being "infertile"
			// "this check is placed here because it only applies to named NPCs" - hwp told me to put this here too
		}
		if (NPCObject.pregnancy.fetus.length) {
			T.pregFalseReason = "npcPregnant";
			return false; // Check if named NPC is already pregnant
		}
	} else {
		NPCObject = NPC;
		if (NPCObject.pregnancy) {
			T.pregFalseReason = "npcPregnant";
			return false; // Check if random NPC is already pregnant
		}
	}
	if (V.npcPregnancyDisable === "t") {
		T.pregFalseReason = "pregnantDisabled";
		return false; // Check if NPC pregnancy is enabled or possible in settings
	}
	if (!setup.pregnancy.typesEnabled.includes(NPCObject.type)) {
		T.pregFalseReason = "pregnantTypeUnsupported";
		return false; // Check if NPC species can get impregnated by the player yet
	}
	if (!V.player.penisExist || NPCObject.gender === "m") {
		T.pregFalseReason = "genitals";
		return false; // Check for genital compatibility for NPC pregnancy
	}
	return true;
}
window.NPCPregnancyPossibleWithPlayer = NPCPregnancyPossibleWithPlayer;

// eslint-disable-next-line no-unused-vars
function wearingCondom(npcNumber) {
	let condom;
	if (!isNaN(npcNumber) && V.NPCList[npcNumber] && V.NPCList[npcNumber].condom) {
		condom = V.NPCList[npcNumber].condom;
	} else if (npcNumber === "player") {
		condom = V.player.condom;
	}
	if (condom && condom.worn) {
		if (condom.state === "defective") return "defective";
		if (condom.state === "sabotaged") return "sabotaged";
		return "worn";
	}
	return false;
}
window.wearingCondom = wearingCondom;

function makeAwareOfDetails() {
	const pregnancy = getPregnancyObject();
	pregnancy.awareOfDetails = true;
	pregnancy.potentialFathers = pregnancy.potentialFathers.filter(s => s.type.includes(pregnancy.fetus[0].type));
	if (pregnancy.potentialFathers.length === 1) {
		pregnancy.fetus.forEach(child => {
			child.fatherKnown = true;
		});
	}
}
DefineMacro("makeAwareOfDetails", makeAwareOfDetails);
