/* eslint-disable no-undef */

function getPregnancyObject(mother = "pc", returnGenital = false) {
	let pregnancy = {};
	let genital = "vagina";
	if (mother === "pc") {
		if (V.player.vaginaExist) {
			pregnancy = V.sexStats.vagina.pregnancy;
		} else {
			pregnancy = V.sexStats.anus.pregnancy;
			genital = "anus";
		}
	} else if (C.npc[mother] && C.npc[mother].pregnancy.enabled !== undefined) {
		pregnancy = C.npc[mother].pregnancy;
	}
	if (returnGenital) return [pregnancy, genital];
	return pregnancy;
}
window.getPregnancyObject = getPregnancyObject;

// Determins how used to being pregnant the player is
function playerNormalPregnancyTotal() {
	const result = V.sexStats.vagina.pregnancy.totalBirthEvents + V.sexStats.anus.pregnancy.totalBirthEvents;
	if (!isNaN(result)) return result;
	return 0;
}
window.playerNormalPregnancyTotal = playerNormalPregnancyTotal;

// `pregnancyOnly` is there intentially, please make use of it if you add to this function
function playerBellySize(pregnancyOnly = false) {
	let bellySize = V.bellySizeDebug || 0;
	const vpregnancy = V.sexStats.vagina.pregnancy;
	const apregnancy = V.sexStats.anus.pregnancy;
	if (!V.statFreeze && (vpregnancy.fetus.length || apregnancy.fetus.length)) {
		let pregnancyProgress = 0;
		if (vpregnancy.timerEnd) pregnancyProgress = Math.clamp(vpregnancy.timer / vpregnancy.timerEnd, 0, 1);
		if (apregnancy.timerEnd) pregnancyProgress = Math.clamp(apregnancy.timer / apregnancy.timerEnd, 0, 1);
		let maxSize = 0;
		switch (vpregnancy.type) {
			case "parasite":
				if (!pregnancyOnly) bellySize += Math.clamp(vpregnancy.fetus.length, 0, 4);
				break;
			case "human":
				if (!vpregnancy.gaveBirth) maxSize += 21 + Math.clamp(vpregnancy.fetus.length, 1, 3);
				break;
			// For human offspring, max sizes are 22 for single fetus, 23 for twins, and 24 for triplets.
			case "wolf":
				if (!vpregnancy.gaveBirth) maxSize += 20 + Math.clamp(vpregnancy.fetus.length / 2, 1, 4);
				break;
		}
		switch (apregnancy.type) {
			case "parasite":
				if (!pregnancyOnly) bellySize += Math.clamp(apregnancy.fetus.length, 0, 4);
				break;
			case "human":
				if (!apregnancy.gaveBirth) maxSize += 21 + Math.clamp(apregnancy.fetus.length, 1, 3);
				break;
			case "wolf":
				if (!apregnancy.gaveBirth) maxSize += 20 + Math.clamp(apregnancy.fetus.length / 2, 1, 4);
				break;
		}
		// The '+ 5' inflates the pregnancy belly size, meaning that the early stages of pregnancy will have no belly size increase due to it being reduced by the '- 5'
		bellySize += Math.clamp(pregnancyProgress * Math.clamp(maxSize + 5, 0, 24 + 5) - 5, 0, 24);
	}
	if (!V.statFreeze && V.daily.bloated && !pregnancyOnly) bellySize += Math.clamp(V.daily.bloated, 1, 2);

	return Math.floor(Math.clamp(bellySize, 0, 24));
}
window.playerBellySize = playerBellySize;

function playerBellyVisible(pregnancyOnly = false) {
	const size = playerBellySize(pregnancyOnly);
	if (size <= 7) return false;
	if (size <= 12 && ((V.worn.upper.name !== "naked" && !V.worn.upper.type.includes("bellyShow")) || !V.worn.over_upper.type.includes("naked"))) return false;
	if (size <= 17 && (V.worn.upper.type.includes("bellyHide") || !V.worn.over_upper.type.includes("naked"))) return false;

	return true;
}
window.playerBellyVisible = playerBellyVisible;

function npcBellySize(npc) {
	let bellySize = 0;
	if (C.npc[npc] && C.npc[npc].pregnancy && C.npc[npc].pregnancy.enabled !== undefined) {
		const pregnancy = C.npc[npc].pregnancy;
		let pregnancyProgress = 0;
		if (pregnancy.timerEnd) pregnancyProgress = Math.clamp(pregnancy.timer / pregnancy.timerEnd, 0, 1);
		let maxSize = 0;
		switch (pregnancy.type) {
			case "human":
				maxSize += 21 + Math.clamp(pregnancy.fetus.length, 1, 3);
				break;
			case "wolf":
				maxSize += 20 + Math.clamp(pregnancy.fetus.length / 2, 1, 4);
				break;
		}
		// The '+ 5' inflates the pregnancy belly size, meaning that the early stages of pregnancy will have no belly size increase due to it being reduced by the '- 5'
		bellySize += Math.clamp(pregnancyProgress * Math.clamp(maxSize + 5, 0, 24 + 5) - 5, 0, 24);
	}

	return Math.floor(Math.clamp(bellySize, 0, 24));
}
window.npcBellySize = npcBellySize;

function npcBellyVisible(npc) {
	const size = npcBellySize(npc);
	if (size <= 7) return false;

	return true;
}
window.npcBellyVisible = npcBellyVisible;

function npcIsPregnant(npc) {
	return C.npc[npc] && C.npc[npc].pregnancy && C.npc[npc].pregnancy.enabled !== undefined && C.npc[npc].pregnancy.type;
}
window.npcIsPregnant = npcIsPregnant;

function npcPregnancyEnding(npc) {
	return C.npc[npc] && C.npc[npc].pregnancy && C.npc[npc].pregnancy.waterBreaking;
}
window.npcPregnancyEnding = npcPregnancyEnding;

function playerIsPregnant() {
	return (
		(V.sexStats.vagina.pregnancy.type !== null && V.sexStats.vagina.pregnancy.type !== "parasite") ||
		(V.sexStats.anus.pregnancy.type !== null && V.sexStats.anus.pregnancy.type !== "parasite")
	);
}
window.playerIsPregnant = playerIsPregnant;

function playerPregnancyProgress(percent = true) {
	if (!V.sexStats) return null;
	const vpregnancy = V.sexStats.vagina.pregnancy;
	const apregnancy = V.sexStats.anus.pregnancy;
	if (percent) {
		if (vpregnancy.timerEnd) return Math.clamp(vpregnancy.timer / vpregnancy.timerEnd, 0, 1);
		if (apregnancy.timerEnd) return Math.clamp(apregnancy.timer / apregnancy.timerEnd, 0, 1);
	} else {
		if (vpregnancy.timerEnd) return vpregnancy.timer;
		if (apregnancy.timerEnd) return apregnancy.timer;
	}
	return null;
}
window.playerPregnancyProgress = playerPregnancyProgress;

function isPlayerNonparasitePregnancyEnding() {
	if (V.statFreeze) return null;
	return (
		(V.sexStats.vagina.pregnancy.waterBreaking && !V.sexStats.vagina.pregnancy.gaveBirth) ||
		(V.sexStats.anus.pregnancy.waterBreaking && !V.sexStats.anus.pregnancy.gaveBirth) ||
		false
	);
}
window.isPlayerNonparasitePregnancyEnding = isPlayerNonparasitePregnancyEnding;

function playerNormalPregnancyType() {
	if (V.player.vaginaExist && V.sexStats.vagina.pregnancy.type !== "parasite") {
		return V.sexStats.vagina.pregnancy.type;
	} else if (V.sexStats.anus.pregnancy.type !== "parasite") {
		return V.sexStats.anus.pregnancy.type;
	}
	return null;
}
window.playerNormalPregnancyType = playerNormalPregnancyType;

function wakingPregnancyEvent() {
	const pregnancy = getPregnancyObject();
	if (!pregnancy.fetus || V.statFreeze) return false;
	if ((!V.player.vaginaExist && playerNormalPregnancyTotal() === 0 && !playerIsPregnant()) || pregnancy.type === "parasite") return false;

	const rng = random(0, 100);
	const menstruation = V.sexStats.vagina.menstruation;
	const pills = V.sexStats.pills;
	const pregnancyStage = pregnancy.timerEnd ? Math.clamp(pregnancy.timer / pregnancy.timerEnd, 0, 1) : false;
	let wakingEffects;

	if (playerBellySize(true) >= 8 && !pregnancy.awareOf) {
		return "bellySize";
	} else if (
		V.cycledisable === "f" &&
		!menstruation.awareOfPeriodDelay &&
		V.awareness >= 200 &&
		!pregnancy.awareOf &&
		pregnancyStage !== false &&
		between(menstruation.currentDay, 3, 5) &&
		(random(0, 100) >= 105 - V.sciencetrait * 5 || playerNormalPregnancyTotal() >= 3)
	) {
		return "missedPeriod";
	} else if (
		playerBellySize() >= 12 &&
		["genitals", "under_upper", "upper", "under_lower", "lower"].find(slot => V.worn[slot].type.includes("constricting"))
	) {
		return "clothesRemoval";
	} else if (between(pregnancyStage, 0.9, 1)) {
		wakingEffects = "nearBirthEvent";
	} else if (between(pregnancyStage, 0.7, 0.9)) {
		wakingEffects = "nearBirth";
	} else if (between(pregnancyStage, 0.4, 0.7) && rng > 50) {
		wakingEffects = "midPregnancy";
	} else if (V.pregnancyStats.morningSicknessWaking >= 2) {
		wakingEffects = "morningSicknessOnly";
		V.pregnancyStats.morningSicknessWaking = 0;
	} else if (V.pregnancyStats.morningSicknessWaking >= 1 && rng >= 50) {
		wakingEffects = "morningSicknessPills";
		V.pregnancyStats.morningSicknessWaking = 0;
	} else if ((pills.pills.contraceptive.doseTaken >= 2 || pills.pills["fertility booster"].doseTaken >= 2) && rng >= 50) {
		wakingEffects = "morningSicknessPills";
	} else if ((pills.pills.contraceptive.doseTaken >= 1 || pills.pills["fertility booster"].doseTaken >= 1) && rng >= 75) {
		wakingEffects = "mildIssues";
	}
	const result = [];
	switch (wakingEffects) {
		case "mildIssues":
			return ["nothing", "nothing", "lightHeaded", "lightHeaded", "dizzy", "dizzy", "dizzy", "mildNausea"];
		case "morningSicknessPills":
			return ["lightHeaded", "dizzy", "dizzy", "dizzy", "mildNausea", "mildNausea", "mildNausea", "nausea", "headache"];
		case "morningSicknessOnly":
			return [
				"lightHeaded",
				"dizzy",
				"sensitiveBreasts",
				"mildNausea",
				"headache",
				"nausea",
				"nausea",
				"nausea",
				"nausea",
				"dryheaving",
				"dryheaving",
				"dryheaving",
			];
		case "midPregnancy":
			result.push("tired");
			if (V.submissive >= 1000) {
				result.push("crying");
			} else {
				result.push("angry");
			}
			switch (pregnancy.type) {
				case "wolf":
					result.push("meatCraving");
					break;
				default:
					result.push("foodCraving");
					break;
			}
			return result;
		case "nearBirth":
			return ["lightBabyKick", "babyKick", "babyMovement", "babyHiccup"];
		case "nearBirthEvent":
			return ["lightBabyKick", "babyKick", "babyMovement", "babyHiccup", "earlyContractions", "earlyContractions"];
	}
	return false;
}
window.wakingPregnancyEvent = wakingPregnancyEvent;

function dailyPregnancyEvent() {
	const pregnancy = getPregnancyObject();
	if (!pregnancy.fetus || V.statFreeze) return false;
	if ((!V.player.vaginaExist && playerNormalPregnancyTotal() === 0 && !playerIsPregnant()) || pregnancy.type === "parasite") return false;

	const rng = random(0, 100) + (V.daily.pregnancyEvent || 0);
	const menstruation = V.sexStats.vagina.menstruation;
	const pills = V.sexStats.pills;
	const pregnancyStage = pregnancy.timerEnd ? Math.clamp(pregnancy.timer / pregnancy.timerEnd, 0, 1) : false;
	let dailyEffects;

	if (pregnancy.gaveBirth) {
		/* Show no events right after giving birth */
	} else if ((between(pregnancyStage, 0.9, 0.95) && rng > 80) || (between(pregnancyStage, 0.95, 1) && rng >= 75)) {
		dailyEffects = "nearBirthEvent";
	} else if ((between(pregnancyStage, 0.7, 0.8) && rng > 85) || (between(pregnancyStage, 0.8, 0.9) && rng >= 80)) {
		dailyEffects = "nearBirth";
	} else if ((between(pregnancyStage, 0.4, 0.5) && rng > 90) || (between(pregnancyStage, 0.5, 0.7) && rng >= 85)) {
		dailyEffects = "midPregnancy";
	} else if (V.pregnancyStats.morningSicknessGeneral >= 2 && rng >= 85) {
		dailyEffects = "morningSicknessOnly";
		V.pregnancyStats.morningSicknessGeneral--;
	} else if (V.pregnancyStats.morningSicknessGeneral >= 1 && rng >= 90) {
		dailyEffects = "morningSicknessPills";
		V.pregnancyStats.morningSicknessGeneral--;
	} else if ((pills.pills.contraceptive.doseTaken >= 2 || pills.pills["fertility booster"].doseTaken >= 2) && rng >= 90) {
		dailyEffects = "morningSicknessPills";
	} else if ((pills.pills.contraceptive.doseTaken >= 1 || pills.pills["fertility booster"].doseTaken >= 1) && rng >= 95) {
		dailyEffects = "mildIssues";
	} else if (
		V.cycledisable === "f" &&
		menstruation.currentState === "normal" &&
		(menstruation.currentDay < 3 || (menstruation.currentDay >= menstruation.currentDaysMax - 1 && rng >= 80)) &&
		menstruation.periodEnabled
	) {
		dailyEffects = "periodIssues";
	}

	const result = [];
	switch (dailyEffects) {
		case "periodIssues":
			return ["nothing", "cramping", "bloated", "lightHeaded", "mildNausea", "nausea"];
		case "mildIssues":
			return ["nothing", "lightHeaded", "lightHeaded", "dizzy", "dizzy", "dizzy", "dizzy", "mildNausea"];
		case "morningSicknessPills":
			return ["lightHeaded", "dizzy", "dizzy", "dizzy", "mildNausea", "mildNausea", "mildNausea", "nausea", "headache"];
		case "morningSicknessOnly":
			return [
				"lightHeaded",
				"dizzy",
				"sensitiveBreasts",
				"mildNausea",
				"headache",
				"nausea",
				"nausea",
				"nausea",
				"nausea",
				"dryheaving",
				"dryheaving",
				"dryheaving",
			];
		case "midPregnancy":
			result.push("tired");
			if (V.submissive >= 1000) {
				result.push("crying");
			} else {
				result.push("angry");
			}
			switch (pregnancy.type) {
				case "wolf":
					result.push("meatCraving");
					break;
				default:
					result.push("foodCraving");
					break;
			}
			return result;
		case "nearBirth":
			return ["lightBabyKick", "babyKick", "babyMovement", "babyHiccup"];
		case "nearBirthEvent":
			return ["lightBabyKick", "babyKick", "babyMovement", "babyHiccup", "earlyContractions", "earlyContractions"];
	}
	return false;
}
window.dailyPregnancyEvent = dailyPregnancyEvent;

function pregnancyNameCorrection(name, caps = false) {
	switch (name) {
		case "Black Wolf":
		case "Great Hawk":
		case "Ivory Wraith":
		case "cum bucket":
			name = (caps ? "The " : "the ") + name;
			break;
		case "pc":
			name = caps ? "Yourself" : "yourself";
			break;
		default:
			name = name[0] === name[0].toLowerCase() ? (caps ? "A" : "a") + (["a", "e", "i", "o", "u"].includes(name[0]) ? "n " : " ") + name : name;
			break;
	}
	return name;
}
window.pregnancyNameCorrection = pregnancyNameCorrection;

function playerPregnancyRisk() {
	if (V.playerPregnancyHumanDisable === "t" && V.playerPregnancyBeastDisable === "t") return 6; // Player Pregnancy Disabled
	if (!V.player.vaginaExist && !canBeMPregnant()) return 6; // Player is male and can't become MPregnant
	const menstruation = V.sexStats.vagina.menstruation;

	if (V.cycledisable === "t") return menstruation.nonCycleRng[0];

	const pills = V.sexStats.pills;

	let risk;
	let daysTillEnd;
	let multi = 1;
	switch (V.pregnancytype) {
		case "realistic":
			// Was a pain to calculate, has already been adjusted once
			daysTillEnd = menstruation.stages[3] - menstruation.currentDay;
			if (daysTillEnd > 2) {
			    /* 北极星模组 */
				if ((V.skin.pubic.pen === "magic" || V.options.bjx_magicpreg) && V.skin.pubic.special === "pregnancy") multi += 1;
				/* 北极星 */
				if (pills.pills["fertility booster"].doseTaken >= 2) multi += 1;
				daysTillEnd = Math.clamp(Math.ceil(daysTillEnd / multi), 2, Infinity);
			}
			daysTillEnd += 4;

			// Re-calculate as the chance for pregnancy has ended
			if (daysTillEnd <= 0) {
				daysTillEnd = menstruation.currentDaysMax - menstruation.currentDay + menstruation.stages[3];
				/* 北极星模组 */
				if ((V.skin.pubic.pen === "magic" || V.options.bjx_magicpreg) && V.skin.pubic.special === "pregnancy") multi += 1;
				/* 北极星 */
				if (pills.pills["fertility booster"].doseTaken >= 2) multi += 1;
				daysTillEnd = Math.clamp(Math.ceil(daysTillEnd / multi), 2, Infinity);
				daysTillEnd += 4;
			}

			if (between(daysTillEnd, 4, 10)) {
				risk = 0;
			} else if (between(daysTillEnd, 2, 4) || between(daysTillEnd, 10, 12)) {
				risk = 1;
			} else if (between(daysTillEnd, 1, 2) || between(daysTillEnd, 12, 14)) {
				risk = 2;
			} else if (between(daysTillEnd, 0, 1) || between(daysTillEnd, 14, 15)) {
				risk = 3;
			} else if (between(daysTillEnd, 15, 16)) {
				risk = 4;
			} else if (between(daysTillEnd, 16, 17)) {
				risk = 5;
			} else {
				risk = 6;
			}
			break;
		case "fetish":
			switch (Math.abs(menstruation.stages[2] - menstruation.currentDay)) {
				case 0:
				case 0.5:
					risk = 0;
					break;
				case 1:
				case 1.5:
					risk = 1;
					break;
				case 2:
				case 2.5:
					risk = 2;
					break;
				case 3:
				case 3.5:
					risk = 3;
					break;
				case 4:
				case 4.5:
				case 5:
					risk = 4;
					break;
				case 5.5:
				case 6:
					risk = 5;
					break;
				default:
					risk = 6;
					break;
			}
			break;
	}
	return risk;
}
window.playerPregnancyRisk = playerPregnancyRisk;

function playerHeatMinArousal() {
	if (!V.sexStats || !V.sexStats.pills || V.statFreeze) return 0;
	if (!V.player.vaginaExist && !canBeMPregnant()) return 0;
	if (playerIsPregnant() && !V.pregnancyStats.heatStillEnabled) return 0;

	const pills = V.sexStats.pills.pills;
	const risk = playerPregnancyRisk();
	let minArousal = 0;

	// Should always be the first to modify minArousal
	if (risk <= 1 && pills.contraceptive.doseTaken === 0) {
		if (V.earSlime.growth > 50 && V.earSlime.focus === "pregnancy" && !V.earSlime.defyCooldown) {
			minArousal += Math.clamp(V.earSlime.growth, 0, 200) * 5 * (2 - risk);
		}
		if (V.wolfgirl >= 2) minArousal += Math.clamp(V.wolfbuild, 0, 100) * 10 * (2 - risk);
		if (V.cat >= 2) minArousal += Math.clamp(V.catbuild, 0, 100) * 10 * (2 - risk);
		if (V.cow >= 2) minArousal += Math.clamp(V.cowbuild, 0, 100) * 10 * (2 - risk);
		if (V.fox >= 2) minArousal += Math.clamp(V.foxbuild, 0, 100) * 10 * (2 - risk);
	}
	if (minArousal === 0) V.pregnancyStats.heatStillEnabled = !playerIsPregnant();

	if (pills["fertility booster"].doseTaken > 2) {
		minArousal += 500;
	}

	return minArousal;
}
window.playerHeatMinArousal = playerHeatMinArousal;

function playerRutMinArousal() {
	if (!V.player.penisExist || V.player.penissize < -1 || !V.sexStats || !V.sexStats.pills || V.statFreeze) return 0;

	const pills = V.sexStats.pills.pills;
	let minArousal = 0;

	if (pills.contraceptive.doseTaken === 0 && V.player.beastRut !== undefined && V.player.beastRut <= 1) {
		if (V.earSlime.growth > 50 && V.earSlime.focus === "impregnation" && !V.earSlime.defyCooldown) {
			minArousal += Math.clamp(V.earSlime.growth, 0, 200) * 5;
		}
		if (V.wolfgirl >= 2) minArousal += Math.clamp(V.wolfbuild, 0, 100) * 10;
		if (V.cat >= 2) minArousal += Math.clamp(V.catbuild, 0, 100) * 10;
		if (V.cow >= 2) minArousal += Math.clamp(V.cowbuild, 0, 100) * 10;
		if (V.fox >= 2) minArousal += Math.clamp(V.foxbuild, 0, 100) * 10;
	}
	if (pills["fertility booster"].doseTaken > 2) {
		minArousal += 500;
	}

	return minArousal;
}
window.playerRutMinArousal = playerRutMinArousal;

function playerAwareTheyCanBePregnant() {
	return V.player.vaginaExist || (canBeMPregnant() && V.sexStats.anus.pregnancy.totalBirthEvents >= 1) || playerAwareTheyArePregnant();
}
window.playerAwareTheyCanBePregnant = playerAwareTheyCanBePregnant;

function playerAwareTheyArePregnant() {
	return getPregnancyObject().awareOf;
}
window.playerAwareTheyArePregnant = playerAwareTheyArePregnant;

function playerAwareTheyAreInHeat() {
	return playerHeatMinArousal() && playerAwareTheyCanBePregnant();
}
window.playerAwareTheyAreInHeat = playerAwareTheyAreInHeat;

function pregnancyDaysEta(pregnancyObject) {
	if (
		!pregnancyObject ||
		!pregnancyObject.fetus ||
		!pregnancyObject.fetus.length ||
		!pregnancyObject.type ||
		pregnancyObject.timer === undefined ||
		pregnancyObject.timer === null ||
		!pregnancyObject.timerEnd
	) {
		return null;
	}
	const timerLeft = pregnancyObject.timerEnd - pregnancyObject.timer;
	switch (pregnancyObject.type) {
		case "human":
			return Math.floor(timerLeft / (9 / V.humanPregnancyMonths));
		case "wolf":
			return Math.floor(timerLeft / (12 / V.wolfPregnancyWeeks));
		default:
			return null;
	}
}
window.pregnancyDaysEta = pregnancyDaysEta;

function knowsAboutPregnancy(mother, whoToCheck, existingId) {
	const awareOfBirthId = V.pregnancyStats.awareOfBirthId;
	let birthId;
	let whoToCheckConverted;
	if (whoToCheck === "pc") {
		whoToCheckConverted = whoToCheck;
	} else if (V.NPCNameList.includes(whoToCheck)) {
		whoToCheckConverted = V.NPCNameList.indexOf(whoToCheck);
	} else {
		return false;
	}

	if (existingId !== undefined && awareOfBirthId[mother + existingId] && awareOfBirthId[mother + existingId].includes(whoToCheckConverted)) return true;

	if (mother === "pc" && playerIsPregnant()) {
		birthId = mother + getPregnancyObject().fetus[0].birthId;
	} else if (C.npc[mother] && npcIsPregnant(mother)) {
		birthId = mother + getPregnancyObject(mother).fetus[0].birthId;
	}

	if (birthId && awareOfBirthId[birthId] && awareOfBirthId[birthId].includes(whoToCheckConverted)) return true;

	return false;
}
window.knowsAboutPregnancy = knowsAboutPregnancy;

/*
	<<setKnowsAboutPregnancy "pc" "Whitney">> - When whitney is aware of the pc's current pregnancy
	<<setKnowsAboutPregnancy "pc" "Whitney" 0>> - When whitney is aware of the pc's first pregnancy

	Be sure to double check the usage when your providing an ID rather than "pc" or named npc's name

	pregnancyOverride is for random npc's specifically
*/
function setKnowsAboutPregnancy(mother, whoNowKnows, existingId, track, pregnancyOverride) {
	if (V.statFreeze) return null;
	const awareOfBirthId = V.pregnancyStats.awareOfBirthId;
	let birthId;
	let whoNowKnowsConverted;
	const tracked = {};
	if (whoNowKnows === "pc") {
		whoNowKnowsConverted = whoNowKnows;
	} else if (V.NPCNameList.includes(whoNowKnows)) {
		whoNowKnowsConverted = V.NPCNameList.indexOf(whoNowKnows);
	} else {
		return false;
	}

	if (track && !V.babyIntros) V.babyIntros = {};

	if (awareOfBirthId[mother + existingId]) {
		birthId = mother + existingId;
	} else if (mother === "pc") {
		if (playerIsPregnant()) {
			birthId = mother + getPregnancyObject().fetus[0].birthId;
			if (track) {
				tracked.birthId = getPregnancyObject().fetus[0].birthId;
				tracked.mother = getPregnancyObject().fetus[0].mother;
				tracked.children = getPregnancyObject().fetus.length;
			}
		}
	} else if (C.npc[mother] && npcIsPregnant(mother)) {
		birthId = mother + getPregnancyObject(mother).fetus[0].birthId;
		if (track) {
			tracked.birthId = getPregnancyObject(mother).fetus[0].birthId;
			tracked.mother = getPregnancyObject(mother).fetus[0].mother;
			tracked.children = getPregnancyObject(mother).fetus.length;
		}
	} else if (pregnancyOverride) {
		birthId = mother + pregnancyOverride.fetus[0].birthId;
		if (track) {
			tracked.birthId = pregnancyOverride.fetus[0].birthId;
			tracked.mother = pregnancyOverride.fetus[0].mother;
			tracked.children = pregnancyOverride.fetus.length;
		}
	}

	if (birthId) {
		if (!awareOfBirthId[birthId]) awareOfBirthId[birthId] = [];
		if (!awareOfBirthId[birthId].includes(whoNowKnowsConverted)) {
			awareOfBirthId[birthId].push(whoNowKnowsConverted);
			if (track) {
				if (!V.babyIntros[whoNowKnows]) V.babyIntros[whoNowKnows] = [];
				if (!V.babyIntros[whoNowKnows].find(intro => intro.birthId === tracked.birthId && intro.mother === tracked.mother)) {
					V.babyIntros[whoNowKnows].push(tracked);
				}
			}
			return true;
		}
	}

	return false;
}
DefineMacro("setKnowsAboutPregnancy", setKnowsAboutPregnancy);

function setKnowsAboutPregnancyCurrentLoaded() {
	if (V.statFreeze) return null;
	if (playerIsPregnant() && playerBellyVisible(true)) {
		V.NPCList.forEach(npc => {
			if (V.NPCList.includes(npc.fullDescription)) setKnowsAboutPregnancy("pc", npc.fullDescription);
		});
	}
}
DefineMacro("setKnowsAboutPregnancyCurrentLoaded", setKnowsAboutPregnancyCurrentLoaded);

/* 
	<<setKnowsAboutPregnancy "pc" "Bailey" "home">> - When Bailey is now aware of all the pc's current children at the orphanage, this excludes those they already know of
	This will set T.nowAwareOfChildren[whoNowKnows] to an array with all with birth id's so that u can use the filter below to get an array of all the children they are just now aware of
	Object.values(V.children).filter(child => V.babyIntros[whoNowKnows].includes(child.birthId))
*/
function setKnowsAboutPregnancyInLocation(motherOrFather, whoNowKnows, location, track) {
	if (V.statFreeze) return null;
	const children = Object.values(V.children).filter(
		child => child.location === location && (child.mother === motherOrFather || child.father === motherOrFather)
	);
	if (track && !V.babyIntros) V.babyIntros = {};

	children.forEach(child => {
		if (!knowsAboutPregnancy(child.mother, whoNowKnows, child.birthId)) {
			if (track) {
				let existing = V.babyIntros[whoNowKnows];
				if (existing) existing = existing.find(item => item.birthId === child.birthId && item.mother === child.mother);
				if (existing) {
					existing.children++;
				} else {
					if (!V.babyIntros[whoNowKnows]) V.babyIntros[whoNowKnows] = [];
					V.babyIntros[whoNowKnows].pushUnique({ birthId: child.birthId, mother: child.mother, children: 1 });
				}
			}
			setKnowsAboutPregnancy(child.mother, whoNowKnows, child.birthId);
		}
	});
}
DefineMacro("setKnowsAboutPregnancyInLocation", setKnowsAboutPregnancyInLocation);

function knowsAboutPregnancyTotal(motherOrFather, whoToCheck, location) {
	let whoToCheckConverted;
	if (whoToCheck === "pc") {
		whoToCheckConverted = whoToCheck;
	} else if (V.NPCNameList.includes(whoToCheck)) {
		whoToCheckConverted = V.NPCNameList.indexOf(whoToCheck);
	} else {
		return false;
	}
	const awareOfBirthId = Object.entries(V.pregnancyStats.awareOfBirthId).filter(awareOf => awareOf[1].includes(whoToCheckConverted));

	return awareOfBirthId.reduce((prev, curr) => {
		const splitId = curr[0].split(/(\d+)/);
		const child = Object.values(V.children).find(child => child.mother === splitId[0] && child.birthId === parseInt(splitId[1]));
		if (child && (child.mother === motherOrFather || child.father === motherOrFather) && (!location || child.location === location)) return prev + 1;
		return prev;
	}, 0);
}
window.knowsAboutPregnancyTotal = knowsAboutPregnancyTotal;

function knowsAboutAnyPregnancy(mother, whoToCheck) {
	let whoToCheckConverted;
	if (whoToCheck === "pc") {
		whoToCheckConverted = whoToCheck;
	} else if (V.NPCNameList.includes(whoToCheck)) {
		whoToCheckConverted = V.NPCNameList.indexOf(whoToCheck);
	} else {
		return false;
	}
	return !!Object.entries(V.pregnancyStats.awareOfBirthId)
		.filter(awareOf => awareOf[0].includes(mother))
		.find(awareOf => awareOf[1].includes(whoToCheckConverted));
}
window.knowsAboutAnyPregnancy = knowsAboutAnyPregnancy;

function knowsAboutChildrenTotal(motherOrFather, whoToCheck, location) {
	let whoToCheckConverted;
	if (whoToCheck === "pc") {
		whoToCheckConverted = whoToCheck;
	} else if (V.NPCNameList.includes(whoToCheck)) {
		whoToCheckConverted = V.NPCNameList.indexOf(whoToCheck);
	} else {
		return false;
	}
	const awareOfBirthId = Object.entries(V.pregnancyStats.awareOfBirthId).filter(awareOf => awareOf[1].includes(whoToCheckConverted));

	return awareOfBirthId.reduce((prev, curr) => {
		const splitId = curr[0].split(/(\d+)/);
		const children = Object.values(V.children).filter(child => child.mother === splitId[0] && child.birthId === parseInt(splitId[1]));
		let count = 0;
		children.forEach(child => {
			if (child && (child.mother === motherOrFather || child.father === motherOrFather) && (!location || child.location === location)) count++;
		});
		return prev + count;
	}, 0);
}
window.knowsAboutChildrenTotal = knowsAboutChildrenTotal;

function childrenCountBetweenParents(parent1, parent2) {
	return Object.values(V.children).reduce((prev, curr) => {
		if (curr.father !== curr.mother && [parent1, parent2].includes(curr.mother) && [parent1, parent2].includes(curr.father)) return prev + 1;
		return prev;
	}, 0);
}
window.childrenCountBetweenParents = childrenCountBetweenParents;

function pregnancyCountBetweenParents(parent1, parent2) {
	return Object.values(V.children).reduce((prev, curr) => {
		if (curr.father !== curr.mother && [parent1, parent2].includes(curr.mother) && [parent1, parent2].includes(curr.father))
			prev.pushUnique(curr.mother + curr.birthId);
		return prev;
	}, []).length;
}
window.pregnancyCountBetweenParents = pregnancyCountBetweenParents;

// Not required for random npc's at all, should only be used for the PC
function setBabyIntro(mother, introFor, birthId) {
	if (!mother || !introFor) return false;
	if (!V.babyIntros) V.babyIntros = {};
	if (!V.babyIntros[introFor]) V.babyIntros[introFor] = [];

	if (birthId !== undefined) {
		// Player already gave birth
		const children = Object.values(V.children).filter(child => child.mother === mother && child.birthId === birthId);
		if (children.length && !V.babyIntros[introFor].find(intro => intro.birthId === birthId && intro.mother === mother)) {
			V.babyIntros[introFor].push({ birthId: children[0].birthId, mother: children[0].mother, children: children.length });
		}
	} else {
		// Before the player gives birth
		const pregnancy = getPregnancyObject(mother === "pc" ? undefined : mother);
		if (
			pregnancy &&
			pregnancy.type !== null &&
			pregnancy.type !== "parasite" &&
			pregnancy.fetus &&
			pregnancy.fetus.length &&
			!V.babyIntros[introFor].find(intro => intro.birthId === pregnancy.fetus[0].birthId && intro.mother === pregnancy.fetus[0].mother)
		) {
			V.babyIntros[introFor].push({ birthId: pregnancy.fetus[0].birthId, mother: pregnancy.fetus[0].mother, children: pregnancy.fetus.length });
		}
	}
}
DefineMacro("setBabyIntro", setBabyIntro);

// Birth Id is required here
function removeBabyIntro(mother, introFor, birthId) {
	if (!V.babyIntros || !V.babyIntros[introFor] || !mother || !introFor || birthId === undefined) return false;
	const children = Object.values(V.children).filter(child => child.mother === mother && child.birthId === birthId);
	if (children.length) {
		V.babyIntros[introFor] = V.babyIntros[introFor].filter(intro => !(intro.birthId === birthId && intro.mother === mother));
		if (!V.babyIntros[introFor].length) delete V.babyIntros[introFor];
	}
}
DefineMacro("removeBabyIntro", removeBabyIntro);

/* Returns the total times a someone has talked about someone elses pregnancy */
function talkedAboutPregnancy(mother, whoToCheck, existingId) {
	const talkedAbout = V.pregnancyStats.talkedAboutPregnancy;
	let birthId;
	let whoToCheckConverted;
	if (whoToCheck === "pc") {
		whoToCheckConverted = whoToCheck;
	} else if (V.NPCNameList.includes(whoToCheck)) {
		whoToCheckConverted = V.NPCNameList.indexOf(whoToCheck);
	} else {
		return 0;
	}

	if (existingId !== undefined && talkedAbout[mother + existingId] && talkedAbout[mother + existingId][whoToCheckConverted]) {
		return talkedAbout[mother + existingId][whoToCheckConverted];
	}

	if (mother === "pc" && playerIsPregnant()) {
		birthId = mother + getPregnancyObject().fetus[0].birthId;
	} else if (C.npc[mother] && npcIsPregnant(mother)) {
		birthId = mother + getPregnancyObject(mother).fetus[0].birthId;
	}

	if (birthId && talkedAbout[birthId] && talkedAbout[birthId][whoToCheckConverted]) return talkedAbout[birthId][whoToCheckConverted];

	return 0;
}
window.talkedAboutPregnancy = talkedAboutPregnancy;

/* Increments the total times a someone has talked about someone elses pregnancy, should only be used for the players current pregnancy */
function setTalkedAboutPregnancy(mother, whoToIncrement, existingId) {
	const talkedAbout = V.pregnancyStats.talkedAboutPregnancy;
	let birthId;
	let whoToIncrementConverted;
	if (whoToIncrement === "pc") {
		whoToIncrementConverted = whoToIncrement;
	} else if (V.NPCNameList.includes(whoToIncrement)) {
		whoToIncrementConverted = V.NPCNameList.indexOf(whoToIncrement);
	} else {
		return 0;
	}

	if (talkedAbout[mother + existingId]) {
		birthId = mother + existingId;
	} else if (mother === "pc") {
		if (playerIsPregnant()) {
			birthId = mother + getPregnancyObject().fetus[0].birthId;
		}
	} else if (C.npc[mother] && npcIsPregnant(mother)) {
		birthId = mother + getPregnancyObject(mother).fetus[0].birthId;
	} else {
		return 0;
	}

	if (birthId) {
		if (!talkedAbout[birthId]) talkedAbout[birthId] = {};
		if (!talkedAbout[birthId][whoToIncrementConverted]) {
			talkedAbout[birthId][whoToIncrementConverted] = 0;
		}
		talkedAbout[birthId][whoToIncrementConverted]++;
		return talkedAbout[birthId][whoToIncrementConverted];
	}
	return 0;
}
DefineMacro("setTalkedAboutPregnancy", setTalkedAboutPregnancy);
