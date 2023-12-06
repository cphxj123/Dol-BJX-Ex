/* Time namespace
	Use Time prefix when accessing any getters or functions (e.g. Time.second, Time.schoolDay, or Time.getLastDayOfMonth(), etc.)
	Getters: (Most of these are being used in one way or another)

	Time.date - Returns Date object of current date.

	Time.holidayMonths - Returns array of all months that are considered holidays.

	Time.second - Returns current number of seconds since last whole minute.

	Time.minute - Returns current number of minutes since last whole hour.

	Time.hour - Returns current hour of the day.

	Time.weekDay - previously $weekday - Returns day of the week (1 being sunday, 7 being saturday)

	Time.weekDayName - Returns the day of the week, with first letter in uppercase. (e.g. Monday)

	Time.monthDay - Returns current date - (e.g. 12 if its the 12th)

	Time.month - previously $month - Returns current month of the year (1 being january, 12 being december)

	Time.monthName - Returns name of the current month, with first letter in uppercase. (e.g. January)

	Time.year - Returns current year

	Time.days - Returns total number of days since game start. (starts at 0)

	Time.season - Previously $season - Returns string of current season (e.g. "winter")

	Time.startDate - Returns Date object of start date

	Time.tomorrow - Returns Date object of day after today

	Time.yesterday - Returns Date object of day before today

	Time.schoolTerm - Returns true if current day is during a school term, and false if a holiday.

	Time.schoolDay - Returns true if current day is a school day, and false otherwise

	Time.schoolTime - Returns true if current time is between 8-15 and is a school day

	Time.dayState - previously $daystate - Returns string of day state (e.g. "dawn", or "day")

	Time.nightState - previously $nightstate- Returns string of night state (e.g. "evening", or "morning")

	Time.nextSchoolTermStartDate - Returns date object of the day when the next school term starts

	Time.nextSchoolTermEndDate - Returns date object of the day when the current school term ends

*/

/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable no-undef */
const Time = (() => {
	const secondsPerDay = 86400;
	const secondsPerHour = 3600;
	const secondsPerMinute = 60;
	const standardYearMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	const leapYearMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const holidayMonths = [4, 7, 8, 12];

	let currentDate = {};

	function set(timeStamp = V.timeStamp) {
		currentDate = new DateTime((V.startDate || 0) + timeStamp);
		V.timeStamp = timeStamp;
	}
	/*
	 * Changes date without "passing time"
	 */
	function setDate(date) {
		set(date.timeStamp - V.startDate);
	}

	function setTime(hour, minute) {
		setDate(new DateTime(currentDate.year, currentDate.month, currentDate.day, hour || 0, minute || 0));
	}

	function setTimeRelative(hour, minute) {
		setDate(new DateTime(currentDate.year, currentDate.month, currentDate.day, currentDate.hour + (hour || 0), currentDate.minute + (minute || 0)));
	}

	/**
	 *
	 * Pass X amount of seconds, executing code after reaching certain thresholds.
	 * Checks for: year, week, day, hour, minute, dawn, noon.
	 * Currently no function is called when only passing seconds (if minute mark is not reached)
	 *
	 * @param {number} seconds
	 */
	function pass(seconds) {
		const fragment = document.createDocumentFragment();

		if (seconds < 0) return fragment;

		const prevDate = new DateTime(currentDate);
		set(V.timeStamp + seconds);

		const minutes = Math.floor((currentDate.timeStamp - prevDate.timeStamp) / 60) || (60 + (currentDate.minute - prevDate.minute)) % 60;
		if (!minutes) return fragment;

		fragment.append(minutePassed(minutes));

		const hours = Math.floor(minutes / 60) || (24 + (currentDate.hour - prevDate.hour)) % 24;
		if (!hours) return fragment;

		fragment.append(hourPassed(hours));
		if (!V.statFreeze && currentDate.hour >= 6 && !V.daily.dawnCheck) {
			V.daily.dawnCheck = true;
			fragment.append(dawnCheck());
		}
		if (!V.statFreeze && currentDate.hour >= 12 && !V.daily.noonCheck) {
			V.daily.noonCheck = true;
			fragment.append(noonCheck());
		}

		const days = Math.floor(hours / 24) || (prevDate.lastDayOfMonth + currentDate.day - prevDate.day) % prevDate.lastDayOfMonth;
		if (!days) return fragment;

		if (prevDate.weekDay === 7 && currentDate.weekDay === 1) {
			fragment.append(weekPassed());
		}
		fragment.append(dayPassed());
		if (prevDate.yearDay < Time.startDate.yearDay && currentDate.yearDay >= Time.startDate.yearDay) {
			fragment.append(yearPassed());
		}

		return fragment;
	}

	function nextSchoolTermStartDate(date) {
		const newDate = new DateTime(date);
		if (!holidayMonths.includes(newDate.month) && date.day < newDate.getFirstWeekdayOfMonth(2).day) {
			return newDate.getFirstWeekdayOfMonth(2);
		}

		newDate.addMonths(holidayMonths.find(e => e > newDate.month) - newDate.month + 1);
		return newDate.getFirstWeekdayOfMonth(2);
	}

	function nextSchoolTermEndDate(date) {
		const newDate = new DateTime(date);
		newDate.addMonths(holidayMonths.find(e => e >= newDate.month) - newDate.month);
		return newDate.getFirstWeekdayOfMonth(2).addDays(-3).addHours(15);
	}

	function isSchoolTerm(date) {
		const termEndDate = nextSchoolTermEndDate(date).addDays(1);
		const firstMonday = date.getFirstWeekdayOfMonth(2);
		const prevMonth = ((date.month - 2 + 12) % 12) + 1;

		return !(
			date.timeStamp >= termEndDate.timeStamp ||
			(holidayMonths.includes(date.month) && date.day >= firstMonday.day) ||
			(holidayMonths.includes(prevMonth) && date.day < firstMonday.day)
		);
	}

	function isSchoolDay(date) {
		return isSchoolTerm(date) && date.weekDay > 1 && date.weekDay < 7;
	}

	function isSchoolTime(date) {
		return isSchoolDay(date) && date.hour > 8 && date.hour < 15;
	}

	return Object.create({
		get date() {
			return currentDate;
		},
		get holidayMonths() {
			return holidayMonths;
		},
		get second() {
			return currentDate.second;
		},
		get minute() {
			return currentDate.minute;
		},
		get hour() {
			return currentDate.hour;
		},
		get weekDay() {
			return currentDate.weekDay;
		},
		get weekDayName() {
			return currentDate.weekDayName;
		},
		get monthDay() {
			return currentDate.day;
		},
		get month() {
			return currentDate.month;
		},
		get monthName() {
			return currentDate.monthName;
		},
		get year() {
			return currentDate.year;
		},
		get days() {
			return Math.floor((currentDate.timeStamp - this.startDate.timeStamp) / Time.secondsPerDay);
		},
		get season() {
			return this.month > 11 || this.month < 3 ? "winter" : this.month > 8 ? "autumn" : this.month > 5 ? "summer" : "spring";
		},
		set startDate(value) {
			V.startDate = value.timeStamp;
		},
		get startDate() {
			return new DateTime(V.startDate);
		},
		get tomorrow() {
			const date = new DateTime(currentDate);
			return date.addDays(1);
		},
		get yesterday() {
			const date = new DateTime(currentDate);
			return date.addDays(-1);
		},
		get schoolTerm() {
			return isSchoolTerm(currentDate);
		},
		get schoolDay() {
			return isSchoolDay(currentDate);
		},
		get schoolTime() {
			return isSchoolTime(currentDate);
		},
		get dayState() {
			const hour = this.hour;
			return hour < 6 || hour >= 21 ? "night" : hour >= 18 ? "dusk" : hour >= 9 ? "day" : "dawn";
		},
		get nightState() {
			const hour = this.hour;
			return hour < 6 ? "morning" : hour >= 9 ? "evening" : undefined;
		},
		get nextSchoolTermStartDate() {
			return nextSchoolTermStartDate(currentDate);
		},
		get nextSchoolTermEndDate() {
			return nextSchoolTermEndDate(currentDate);
		},
		get lastDayOfMonth() {
			return currentDate.lastDayOfMonth;
		},
		set,
		setDate,
		setTime,
		setTimeRelative,
		pass,
		isSchoolTerm,
		isSchoolDay,
		isSchoolTime,

		secondsPerDay,
		secondsPerHour,
		secondsPerMinute,
		standardYearMonths,
		leapYearMonths,
		monthNames,
		daysOfWeek,

		getNextSchoolTermStartDate: nextSchoolTermStartDate,
		getNextSchoolTermEndDate: nextSchoolTermEndDate,
		getNextWeekdayDate: weekDay => currentDate.getNextWeekdayDate(weekDay),
		getPreviousWeekdayDate: weekDay => currentDate.getPreviousWeekdayDate(weekDay),
		isWeekEnd: () => currentDate.weekEnd,
	});
})();
window.Time = Time;

/* Local functions */

// Replaces <<year>>
function yearPassed() {
	const fragment = document.createDocumentFragment();

	V.scienceproject = "none";
	V.mathsproject = "none";
	V.englishPlay = "none";

	return fragment;
}

// Replaces <<week>>
function weekPassed() {
	const fragment = document.createDocumentFragment();

	if (V.science_exam >= 200 && V.sciencetrait < 4) {
		V.effectsmessage = 1;
		V.science_up_message = 1;
		fragment.append(wikifier("school_skill_up", "science"));
	} else if (V.science_exam <= -100 && V.sciencetrait >= 0) {
		V.effectsmessage = 1;
		V.science_down_message = 1;
		fragment.append(wikifier("school_skill_down", "science"));
	}
	if (V.maths_exam >= 200 && V.mathstrait < 4) {
		V.effectsmessage = 1;
		V.maths_up_message = 1;
		fragment.append(wikifier("school_skill_up", "maths"));
	} else if (V.maths_exam <= -100 && V.mathstrait >= 0) {
		V.effectsmessage = 1;
		V.maths_down_message = 1;
		fragment.append(wikifier("school_skill_down", "maths"));
	}
	if (V.english_exam >= 200 && V.englishtrait < 4) {
		V.effectsmessage = 1;
		V.english_up_message = 1;
		fragment.append(wikifier("school_skill_up", "english"));
	} else if (V.english_exam <= -100 && V.englishtrait >= 0) {
		V.effectsmessage = 1;
		V.english_down_message = 1;
		fragment.append(wikifier("school_skill_down", "english"));
	}
	if (V.history_exam >= 200 && V.historytrait < 4) {
		V.effectsmessage = 1;
		V.history_up_message = 1;
		fragment.append(wikifier("school_skill_up", "history"));
	} else if (V.history_exam <= -100 && V.historytrait >= 0) {
		V.effectsmessage = 1;
		V.history_down_message = 1;
		fragment.append(wikifier("school_skill_down", "history"));
	}
	if (Time.schoolTerm) {
	    /* 北极星模组 */
        if (!V.options.bjx_animal || V.dolphin < 6) {
    		V.science_exam = Math.clamp(V.science_exam - 7, -107, 200);
    		V.maths_exam = Math.clamp(V.maths_exam - 7, -107, 200);
    		V.english_exam = Math.clamp(V.english_exam - 7, -107, 200);
    		V.history_exam = Math.clamp(V.history_exam - 7, -107, 200);
		}
		/* 北极星 */
		fragment.append(wikifier("exam_difficulty"));
	}
	if (V.robinpaid === 1) V.robinPayout = 0;
	else {
		V.robinmoney -= 400;
		if (V.robinmoney <= 0 && V.robindebt >= 0) {
			V.robinmoney = 0;
			V.robindebt++;
		}
	}
	if (V.robinpaid !== 1 && V.robindebt >= V.robindebtlimit && V.robindebtevent <= 0) {
		fragment.append(wikifier("robinPunishment", "docks"));
		V.robineventnote = 1;
	}
	V.robinmoney += 300;
	/* 北极星模组 */
	if (V.options.bjx_robinincome) V.robinmoney += C.npc.Robin.dom * 40 -300;
	/* 北极星 */
	V.compoundcentre = 0;
	if (V.edenfreedom >= 1 && V.edenshopping === 2) V.edenshopping = 0;
	if (V.loft_kylar) V.loft_spray = 0;
	if (V.farm) {
		if (V.farm.tower_guard) {
			V.farm.tower_guard_unpaid++;
			V.farm.tower_guard_patience = 0;
		}
	}
	if (V.sydney) {
		if (V.sydney.glasses === "broken" || V.sydney.glasses === "playerbroken") {
			V.sydney.glasses = "glasses";
			V.sydneyGlassesNotice = 1;
		}
	}
	if (V.syndromewolves === 1) V.wolfcavepatrol = 1;
	if (V.photo) {
		if (V.photo.silly === "paid") V.photo.silly = 0;
		V.photo.shoot = 0;
	}
	if (V.nightmareTimer > 0) {
		V.nightmareTimer--;
		if (V.nightmareTimer <= 0) delete V.nightmareTimer;
	}
	if (V.brothelVending) {
		if (V.brothelVending.condoms === 0 && V.brothelVending.lube === 0) V.brothelVending.weeksEmpty += 1;
		V.brothelVending.weeksRent++;
	}

	fragment.append(wikifier("world_corruption", "soft", V.world_corruption_hard));

	delete V.weekly;
	V.weekly = { theft: {}, sewers: {} };

	return fragment;
}

// Replaces <<day>>
function dayPassed() {
	const fragment = document.createDocumentFragment();

	if (V.statFreeze) return fragment;

	fragment.append(wikifier("seenPassageChecks"));
	fragment.append(wikifier("earnAllFeats", true));
	fragment.append(wikifier("prison_day"));
	fragment.append(wikifier("clearNPC", "pharmNurse"));
	fragment.append(wikifier("weather_select"));

	V.physiquechange = 1;
	V.home_event_timer--;
	V.park_fame = Math.clamp(V.park_fame - 7, 0, 100);
	V.museuminterest = Math.clamp(V.museuminterest - (V.museuminterest >= 60 ? 5 : 2), 0, 100);

	if (V.gamemode !== "hard" && V.uncomfortable.lewd) {
		V.exhibitionism = Math.max(V.exhibitionism - 1, 0);
		V.promiscuity = Math.max(V.promiscuity - 1, 0);
		V.deviancy = Math.max(V.deviancy - 1, 0);
	}
	if (V.locker_suspicion > 0) fragment.append(wikifier("locker_suspicion", -1));
	if (V.whitneyromance || C.npc.Whitney.dom >= 20) {
		V.bullytimer += 20;
		V.bullytimeroutside += 10;
	} else {
		V.bullytimer += 10;
		V.bullytimeroutside += 5;
	}
	if (Time.weekDay === 7) {
		if (V.brothelshowdata.type !== "none" && !V.brothelshowdata.done && V.brothelshowdata.intro) {
			V.brothelshowdata.missed = true;
			V.brothelshowdata.type = "none";
		}
		V.brothelshowdata.done = false;
	}

	if (V.brothel_escortjob !== undefined && Time.date.timeStamp > V.brothel_escortjob.date) {
		V.brothel_escortjob.missed = true;
	}

	if (Time.weekDay === 2) {
		delete V.museumhorse;
		delete V.museumduck;
	}

	if (V.medicated) V.medicated = Math.max(Math.trunc((V.medicated - 1) * 0.5), 0);
	if (V.asylummedicated) V.asylummedicated = Math.max(Math.trunc((V.asylummedicated - 1) * 0.5), 0);
	if (V.brothel_rivalry_timer !== undefined) V.brothel_rivalry_timer--;
	if (V.orphanageWardIntro) V.home_event_ward_timer--;
	if (V.location === "asylum") V.asylumbound--;

	const rng = random(1, 100);
	if (rng >= 95) V.brothel_basement_price = 3000;
	else if (rng >= 85) V.brothel_basement_price = 2000;
	else if (rng >= 45) V.brothel_basement_price = 1000;
	else V.brothel_basement_price = 500;

	if (V.chef_rework > 0) V.chef_rework--;
	if (V.chef_sus > 0) V.chef_sus--;
	if (V.stall_rejected >= 1) V.stall_rejected = Math.clamp(V.stall_rejected - 1, 0, 100);
	if (V.temple_garden >= 1) V.temple_garden = Math.clamp(V.temple_garden - 10, 0, 100);
	if (V.temple_quarters >= 1) V.temple_quarters = Math.clamp(V.temple_quarters - 10, 0, 100);
	if (V.temple_chastity_timer > 0) V.temple_chastity_timer--;
	if (V.temple_rank !== "prospective" && V.temple_rank !== "initiate") {
		if (V.grace >= 1 && !V.daily.graceUp) fragment.append(wikifier("grace", -2));
	}
	if (V.temple_evaluation) {
		V.temple_evaluation--;
		if (V.temple_evaluation <= 0) delete V.temple_evaluation;
	}
	if (V.wolfcavebreast >= 1) delete V.wolfcavebreast;
	if (V.wolfcavepatrol === 1) V.wolfcavepatrolchance = random(1, 3);
	if (V.temple_jordan_prayer === 1) delete V.temple_jordan_prayer;
	if (V.temple_event !== undefined) V.temple_event = 1;
	if (V.school_crossdress_message >= 1 || V.school_herm_message >= 1) V.effectsmessage = 1;
	if (V.syndromewolves === 1) {
		fragment.append(wikifier("wolf_cave_update"));
		if (V.wolfchallengetimer === undefined) V.wolfchallengetimer = 14;
		else V.wolfchallengetimer--;
	}
	if (V.estatePersistent) {
		if (V.estatePersistent.suspicion && V.estatePersistent.suspicion >= 1) fragment.append(wikifier("blackjackSuspicion", -5 - C.npc.Wren.love / 5));
		if (V.estatePersistent.newDeckTimer > 0 && V.estatePersistent.markedCards && V.estatePersistent.markedCards.size > 0) {
			/*  we don't re-set this to 3 here - we only do that in the same
				passage where we actually reset the deck.
				we don't do that here because we acknowledge the timer and actually reset it
				when the player enters the cottage, to not confuse things mid-game
			*/
			V.estatePersistent.newDeckTimer--;
		}
	}

	earSlimeDaily();

	if (V.bell_timer) V.bell_timer--;
	if (V.lake_ice_broken >= 1) V.lake_ice_broken--;
	if (V.lake_ice_broken < 1) delete V.lake_ice_broken;
	if (V.community_service >= 1) {
		if (V.community_service_done !== 1 && !["asylum", "prison"].includes(V.location)) {
			fragment.append(wikifier("crimeUp", 200, "obstruction"));
			V.effectsmessage = 1;
			V.community_message = "missed";
		}
		delete V.community_service_done;
	}

	if (V.awareness >= 300) V.awarelevel = 2;
	else if (V.awareness >= 200) V.awarelevel = 1;
	else if (V.awareness <= -1) V.awarelevel = -1;
	else V.awarelevel = 0;

	if (V.awarelevel <= 1 && V.loveInterest.secondary !== "None") {
		V.loveInterest_message = 1;
		V.loveInterest.secondary = "None";
		V.effectsmessage = 1;
	} else if (V.awarelevel >= 2 && V.loveInterest.primary !== "None" && V.loveInterest.secondary === "None" && !V.loveInterestAwareMessage) {
		V.loveInterest_message = 2;
		V.effectsmessage = 1;
	}
	if (V.pound) {
		V.pound.compete = 0;
		/* 北极星模组 */
		if (!V.options.bjx_doglovenodown) fragment.append(wikifier("stray_happiness", -1));
		/* 北极星 */
		V.pound.tasks = [];
	}
	V.renttime--;

	if (V.flashbacktown > 0) V.flashbacktown--;
	if (V.flashbackhome > 0) V.flashbackhome--;
	if (V.flashbackbeach > 0) V.flashbackbeach--;
	if (V.flashbackunderground > 0) V.flashbackunderground--;
	if (V.flashbackschool > 0) V.flashbackschool--;

	if (V.flashbacktown === 1) V.flashbacktownready = 1;
	if (V.flashbackhome === 1) V.flashbackhomeready = 1;
	if (V.flashbackbeach === 1) V.flashbackbeachready = 1;
	if (V.flashbackunderground === 1) V.flashbackundergroundready = 1;
	if (V.flashbackschool === 1) V.flashbackschoolready = 1;

	if (V.smuggle_timer) {
		V.smuggle_timer--;
		if (V.smuggle_timer < 0) {
			V.smuggle_timer = random(4, 7);
			const rng = random(1, 100);
			if (rng >= 76) V.smuggle_location = "forest";
			else if (rng >= 51) V.smuggle_location = "sewer";
			else if (rng >= 26) V.smuggle_location = "beach";
			else V.smuggle_location = "bus";
			delete V.smuggler_known;
		}
	}

	if (V.tailorMonthlyService > 0) V.tailorMonthlyService--;
	else if (V.tailorMonthlyService === 0) delete V.tailorMonthlyService;

	if (V.wardrobeRepair && V.wardrobeRepair.timeLeft === 1) V.wardrobeRepair.timeLeft = 0;
	if (V.clothingShop.ban > 0) V.clothingShop.ban--;
	else V.clothingShop.banExtension = false;

	if (V.adultShop !== undefined) {
		if (V.adultShop.ban > 0) V.adultShop.ban--;
		else V.adultShop.banExtension = false;
	} else {
		V.adultShop = { ban: 0, banExtension: false, spotted: false, stolenClothes: 0, totalStolenClothes: 0, banCount: 0, rng: random(0, 1000) };
	}

	if (V.farm) {
		if (V.farm.milking.catchChance > random(10, 1000) / 10) V.farm.milking.caught = true;
		if (V.farm.milking.catchChance >= 4) V.farm.milking.catchChance = Math.clamp(V.farm.milking.catchChance * 0.9, 0, 100).toFixed(3);
		else V.farm.milking.catchChance = Math.clamp(V.farm.milking.catchChance * 0.95, 0, 100).toFixed(3);
	}

	if (V.moorLuck > 0) V.moorLuck--;
	if (V.officejobintro === 1) V.officelastcomplaintday++;

	delete V.glideScared;
	delete V.swimCrossdressPermission;
	delete V.masturbation_oralSkillMax;

	if (V.pubfame) {
		if (V.pubfame.timer >= 1) V.pubfame.timer--;
		if (V.pubfame.timer <= 0) {
			if (V.pubfame.status === "hiding") V.pubfame.detail = "hiding";
			if (V.pubfame.target) V.pubfame.status = "accepted";
			else V.pubfame.status = "ready";
			delete V.pubfame.timer;
		}
		for (const fameKeys of Object.keys(V.fameDecay)) {
			if (V.fameDecayTimer[fameKeys] >= 1) {
				V.fameDecayTimer[fameKeys]--;
				V.fame[fameKeys] -= V.fameDecay[fameKeys];
			} else if (V.fameDecayTimer[fameKeys] <= 0) {
				delete V.fameDecayTimer[fameKeys];
				delete V.fameDecay[fameKeys];
				V.fame[fameKeys] = Math.round(V.fame[fameKeys]);
			}
		}
	}

	if (V.randomNNPCStraponsToClear) {
		V.NPCName.forEach(npc => {
			if (npc.strapons && npc.strapons.length >= 1) {
				/* This removes all strapons that have the temp tag, and ignores any that lack this variable */
				npc.strapons = npc.strapons.filter(strapon => !strapon.temp);
				console.debug("Removed temp strap-ons");
			}
		});
	}

	if (V.adultshopprogress < 22 && Time.weekDay === 6) V.adultshopprogress++;
	else if (V.adultshopgrandopening) fragment.append(wikifier("unlockAdultShop"));
	else if (V.adultshopprogress >= 22 && !V.adultshopunlocked) V.adultshopgrandopening = true;
	else if (V.adultshopdegree < 15) V.adultshopdegree += 0.1;
	delete V.adultshophelped;

	V.smuggler_timer--;
	if (V.smuggler_timer < 0) {
		const rng = random(1, 100);
		V.smuggler_timer = random(4, 7);
		if (rng >= 76) V.smuggler_location = "forest";
		else if (rng >= 51) V.smuggler_location = "sewer";
		else if (rng >= 26) V.smuggler_location = "beach";
		else V.smuggler_location = "bus";
		delete V.smuggler_known;
	}

	if (V.location !== "tentworld") {
		delete V.tentacle_forest_lurker;
	}

	if (V.brothelVending) {
		const rng = random(Math.min(1, V.brothelVending.condoms), Math.min(10, V.brothelVending.condoms));
		V.brothelVending.condoms -= rng;
		V.brothelVending.condomsSold += rng;
		V.brothelVending.total = (V.brothelVending.total || 0) + rng;
	}

	if (V.brothelVending) {
		const rng = random(Math.min(1, V.brothelVending.lube), Math.min(10, V.brothelVending.lube));
		V.brothelVending.lube -= rng;
		V.brothelVending.lubeSold += rng;
		V.brothelVending.total = (V.brothelVending.total || 0) + rng;
	}

	fragment.append(wikifier("menstruationCycle", "daily"));
	pregnancyProgress();
	pregnancyProgress("anus");
	fragment.append(wikifier("rutCycle"));
	npcPregnancyCycle();
	randomPregnancyProgress();
	fragment.append(wikifier("physicalAdjustments"));

	fragment.append(dailyPlayerEffects());
	fragment.append(dailyMasochismSadismEffects());
	fragment.append(dailySchoolEffects());
	fragment.append(dailyFarmEvents());
	fragment.append(dailyLiquidEffects());
	fragment.append(dailyTransformationEffects());
	fragment.append(dailyNPCEffects());
	fragment.append(yearlyEventChecks());
	fragment.append(moonState());

    /* 北极星模组 */
    if (V.lakehouseinit !== undefined){
		fragment.append(dailyLakeHouseEvents());
	}
	/* 北极星 */
	
	parasiteProgressDay();
	parasiteProgressDay("vagina");
	fragment.append(wikifier("tending_day"));
	fragment.append(wikifier("creatureContainersProgressDay"));

	if (V.pillory_tenant.exists && V.pillory_tenant.endday < Time.days) fragment.append(wikifier("clear_pillory"));

	delete V.daily;
	V.daily = {
		school: { attended: {} },
		whitney: {},
		robin: {},
		kylar: {},
		morgan: {},
		eden: {},
		alex: {},
		sydney: {},
		ex: {},
		pharm: {},
		prison: {},
		livestock: {},
	};

	if (Number.isInteger(V.challengetimer)) {
		V.challengetimer--;
		if (V.challengetimer < 0) delete V.challengetimer;
	}

	if (V.whitneyRescueStatus) {
		V.whitneyRescueTimer = (V.whitneyRescueTimer || 8) - 1;
		if (V.whitneyRescueTimer <= 0) {
			if (V.whitneyRescueStatus === "humiliated") {
				V.whitneyRescueStatus = "shaken";
				V.whitneyRescueTimer = 14;
			} else {
				delete V.whitneyRescueTimer;
				delete V.whitneyRescueStatus;
			}
		}
	}
	
	/* 北极星模组 */
	V.dragonbreathuse = 0;
	V.seasong = 3;
    V.pigshit = 3;
    V.cobwebuse = 0;
    V.lizardrecover = 0;
	V.fungalstagelimiter = 0;
	V.fungalclotheslimiter = 1;
	V.moorburger = 0;
	V.raccoonrequired = Object.keys(setup.crimeNames).pluck();
	V.raccoonrequiredText = true;
	if (V.salempunishment >  0) V.salempunishment -= 1;
	/* 北极星 */
	
	return fragment;
}

// Replaces <<hour>>
function hourPassed(hours) {
	const fragment = document.createDocumentFragment();

	if (V.statFreeze) return fragment;

	for (let i = 0; i < hours; i++) {
		if (V.innocencestate === 1 && V.control <= 0) fragment.append(wikifier("awareness", 1));
		fragment.append(wikifier("control", 1));
		fragment.append(wikifier("orgasmHourlyRecovery"));
		fragment.append(wikifier("arousal", 0, "time"));
		fragment.append(wikifier("wetnessCalculate"));
		fragment.append(wikifier("bimboCheck", "upper"));
		fragment.append(wikifier("bimboCheck", "lower"));
		fragment.append(wikifier("bimboCheck", "feet"));

		if (V.ejactrait >= 1) V.stress -= (V.goocount + V.semencount) * 10;
		if (V.kylarwatched) V.kylarwatchedtimer--;
		if (V.parasite.nipples.name) fragment.append(wikifier("milkvolume", 1));
		if (V.worn.head.name === "hairpin") {
			V.hairlength++;
			V.fringelength++;
			fragment.append(wikifier("calchairlengthstage"));
		}
		if (V.earSlime.defyCooldown) {
			V.earSlime.defyCooldown--;
			if (V.parasite.left_ear.name === "slime" && V.parasite.right_ear.name === "slime" && V.earSlime.growth < 100) V.earSlime.defyCooldown--;
			if (V.earSlime.defyCooldown <= 0) V.earSlime.defyCooldown = 0;
		}
		playerEndWaterProgress();
	}

	if (
		V.sexStats.vagina.menstruation.running &&
		(V.sexStats.vagina.menstruation.currentState === "pregnant" ||
			(V.sexStats.vagina.menstruation.currentState === "normal" && (V.playerPregnancyHumanDisable === "f" || V.playerPregnancyBeastDisable === "f")))
	) {
		V.pregnancyDailyEvent = true;
	}

	V.openinghours = Time.hour >= 8 && Time.hour < 21 ? 1 : 0;
	fragment.append(wikifier("earnAllFeats"));

	temperatureHour();

	if (!V.wolfevent) V.wolfevent = 1;
	if (V.wolfpatrolsent >= 24) delete V.wolfpatrolsent;
	else if (V.wolfpatrolsent >= 1) V.wolfpatrolsent++;
	if (V.robinPillory && V.robinPillory.danger !== undefined) fragment.append(wikifier("robinPilloryHour"));
	if (V.pillory_tenant.exists && V.pillory_tenant.endday === Time.days && V.pillory_tenant.endhour < Time.hour) fragment.append(wikifier("clear_pillory"));
	if (C.npc.Sydney.init === 1) {
		fragment.append(wikifier("sydneySchedule"));
		if (T.sydney_location === "temple" && V.temple_rank !== undefined && V.temple_rank !== "prospective") {
			if (V.sydney_templeWork === "garden") {
				if (V.temple_garden >= 1) V.temple_garden++;
			} else if (V.sydney_templeWork === "quarters") {
				if (V.temple_quarters >= 1) V.temple_quarters++;
			}
		}
	}
	if (V.per_npc.pubfame_receptionist) {
		fragment.append(wikifier("clearNPC", "pubfame_receptionist"));
		V.pubfame.hospital = {};
		if (V.per_npc.pubfame_nurse) fragment.append(wikifier("clearNPC", "pubfame_nurse"));
	}

	V.home_gone++;

	return fragment;
}

function minutePassed(minutes) {
	const fragment = document.createDocumentFragment();
	// Stress
	// decay/rise and crossdresser trait
	const isCrossdresser = V.backgroundTraits.includes("crossdresser");
	const isCrossdressing = V.player.gender !== V.player.gender_appearance && V.player.gender !== "h";
	if (V.controlled === 0 && V.anxiety >= 2) V.stress += minutes * ((isCrossdresser && !isCrossdressing) + 1);
	else if (V.stress < V.stressmax && (V.controlled === 1 || V.anxiety === 0)) V.stress -= minutes * ((isCrossdresser && isCrossdressing) + 1);

	parasiteProgressTime(minutes);
	parasiteProgressTime(minutes, "vagina");
	if (isPlayerNonparasitePregnancyEnding()) {
		// To prevent new events from occurring, allowing players to more easily go to the hospital or similar locations
		V.eventskip = 1;
		V.stress += Math.floor(minutes * 40);
	}

    /* 北极星模组 */
    // 贪婪之杯自动产钱
    if (V.options.bjx_antiques && (V.museumAntiques.antiques.antiquegreed === "found" || V.museumAntiques.antiques.antiquegreed === "take")) V.money += minutes * 100;
    
    // 幽灵转化能量恢复
    if (V.ghost > 1) V.energy = Math.clamp(V.energy+minutes * 8, 0, V.energymax);
    else if (V.ghost == 1) V.energy = Math.clamp(V.energy+minutes * 12, 0, V.energymax);
    
    // 冰幽灵，炎幽灵体温效果
	if (V.options.bjx_eventTF && V.ghost === 2 && V.body_temperature === "cold") V.stress -= minutes * 2;
	else if (V.options.bjx_eventTF && V.ghost === 2 && V.body_temperature === "chilly") V.stress -= minutes;
	else if (V.options.bjx_eventTF && V.ghost === 3 && V.body_temperature === "cold") V.stress += minutes;
	else if (V.options.bjx_eventTF && V.ghost === 3 && V.body_temperature === "chilly") V.stress += minutes * 0.5;
	else if (V.body_temperature === "cold") V.stress += minutes * 2;
	else if (V.body_temperature === "chilly") V.stress += minutes;
    // 蘑菇转化效果
    if (V.mushroom >= 1) {
		if (V.location === "bog" || "forest") V.stress -= minutes * 3;
		if (V.outside === "1" && V.Time.dayState === "night") V.stress -= minutes * 2;
		if (V.location === "bog" || "forest") V.pain -= minutes * 3;
		if (V.outside === "1" && V.Time.dayState === "night") V.pain -= minutes * 2;
	}
	/* 北极星 */
	
	V.stress = Math.min(V.stress, V.stressmax);

	// Effects
	if (V.drunk > 0) fragment.append(wikifier("alcohol", -minutes));
	if (V.hallucinogen > 0) fragment.append(wikifier("hallucinogen", -minutes));
	if (V.drugged > 0) fragment.append(wikifier("drugs", -minutes));
	if (minutes < 1200) fragment.append(wikifier("tiredness", minutes * (V.drunk > 0 ? 2 : 1), "pass"));
	fragment.append(wikifier("pain", minutes, -1));

	// Arousal
	const arousalMultiplier = V.backgroundTraits.includes("lustful") ? 0.2 * (12 - Math.floor(V.purity / 80)) + 1 + (V.purity <= 50 ? 1 : 0) : -10;
	fragment.append(wikifier("arousal", minutes * arousalMultiplier + getArousal(minutes)));
	V.timeSinceArousal = V.arousal < V.arousalmax / 4 ? V.timeSinceArousal + minutes : 1;
	if (V.player.vaginaExist) fragment.append(passArousalWetness(minutes));

	// Tanning
	if (Time.dayState === "day" && V.weather === "clear" && V.outside && V.location !== "forest" && !V.worn.head.type.includes("shade")) {
		fragment.append(wikifier("tanned", minutes / (Time.season === "winter" ? 4 : Time.season === "summer" ? 1 : 2)));
	}

	const waterFragment = passWater(minutes);
	fragment.append(waterFragment);

	if (V["ob" + "j" + "ec" + "tVe" + "rs" + "ion"]["t" + "e" + "st"] !== undefined || V["ch" + "ea" + "td" + "isa" + "" + "bl" + "e"] === "f") {
		V["f" + "ea" + "" + "t" + "s"]["lo" + "ck" + "ed"] = true;
		V["ob" + "jec" + "tVe" + "rs" + "ion"]["te" + "st"] = true;
	}

	return fragment;
}

function noonCheck() {
	const fragment = document.createDocumentFragment();

	delete V.bartend_info;
	delete V.bartend_info_other;
	if (V.per_npc.bartend) fragment.append(wikifier("clearNPC", "bartend"));
	V.clothingShop.spotted = false;
	V.adultShop.spotted = false;
	fragment.append(wikifier("dailySellProduce"));
	if (V.lake_ice_broken >= 1) V.lake_ice_broken--;
	if (V.lake_ice_broken <= 0) delete V.lake_ice_broken;

	fragment.append(wikifier("menstruationCycle"));
	pregnancyProgress();
	pregnancyProgress("anus");

	delete V.birdSleep;
	delete V.edenbed;
	delete V.glideScared;
	if (V.pound) V.pound.sneak = 0;

	return fragment;
}

function dawnCheck() {
	const fragment = document.createDocumentFragment();

	V.robinwakeday = 0;
	V.wolfwake = 0;
	V.edenwake = 0;
	delete V.skul_dock_init;
	delete V.skul_dock;
	delete V.dock_security;
	delete V.alexwake;
	delete V.alex_bed;
	delete V.alex_bed_spurned;
	delete V.connudatus_stripped;
	delete V.robin_kicked_out;

	delete V.foxCrimeProgress;
	for (const crimeKeys of Object.keys(setup.crimeNames)) {
		if (V.crime[crimeKeys].daily >= C.crime.spree) {
			// If the player commits too much of the same type of crime in one day, they leave behind more evidence.
			V.crime[crimeKeys].current += Math.floor(V.crime[crimeKeys].daily * 0.1);
		}
		// Reset daily crime of all types to 0
		V.crime[crimeKeys].daily = 0;
	}

	/* 北极星模组 */
	// 蘑菇成长效果
	if (V.mushroom >= 1 && V.fungalstagelimiter === 0) {
		V.fungalgrowth += 1;
	}
	/* 北极星 */

	return fragment;
}

function dailyNPCEffects() {
	const fragment = document.createDocumentFragment();

	delete V.bird.satisfied;
	delete V.robinlocationoverride;

	// Winter
	if (Time.weekDay === 7) V.winterHint = "notGiven";

	// Whitney
	if (C.npc.Whitney.lust >= 1) {
		V.bullytimer += C.npc.Whitney.lust / 5;
		V.bullytimeroutside += C.npc.Whitney.lust / 10;
	}

	// Robin
	if (V.robindebtevent > 0) {
		V.robindebtevent--;
		switch (V.robinmissing) {
			case "dinner":
				fragment.append(wikifier("npcincr", "Robin", "trauma", 40));
				break;
			case "docks":
				fragment.append(wikifier("npcincr", "Robin", "trauma", 15));
				break;
			case "landfill":
				fragment.append(wikifier("npcincr", "Robin", "trauma", V.robindebtevent >= 1 ? 10 : 25));
				break;
		}
	}
	if (C.npc.Robin.trauma > 0) fragment.append(wikifier("npcincr", "Robin", "trauma", -1));

	if (V.robindebtevent === 0) V.robinmissing = 0;
	if (V.robinpaid >= 1) fragment.append(wikifier("trauma", -25));
	if (V.robinromance === 1 && C.npc.Robin.dom >= 40) fragment.append(wikifier("npcincr", "Robin", "lust", 1));
	if (V.robinPilloryFail) {
		delete V.robinPilloryFail;
		delete V.robinPillory;
	}

	// Alex
	if (V.farm_stage >= 7 && C.npc.Alex.dom >= 40) fragment.append(wikifier("npcincr", "Alex", "lust", 1));

	// Mason
	if (V.mason_pond === 3) {
		if (V.weather !== "rain" && V.weather !== "snow") V.mason_pond_timer--;
		if (V.mason_pond_timer < 1) {
			delete V.mason_pond_timer;
			V.mason_pond = 4;
		}
	}

	// Eden
	if (V.edencoat === 1) V.edencoat = 2;
	if (Time.monthName !== "November" && V.edenprepare) {
		delete V.edenprepare;
		delete V.edenwall;
		delete V.edenchimney;
		delete V.edenroof;
	}
	if (V.edenshoutrescue !== 1) V.edenwhip = 0;
	if (V.edendays !== undefined) V.edendays++;
	if (V.edengarden >= 1) V.edengarden--;
	if (V.edenshrooms >= 1) V.edenshrooms--;
	if (V.edenspring >= 1) V.edenspring--;

	if (C.npc.Eden.init === 1) fragment.append(wikifier("npcincr", "Eden", "lust", 1));

	// Kylar
	if (C.npc.Kylar.state === "active") {
		/* prevent kylar's stalker routine before they're even introduced to the player */
		fragment.append(wikifier("npcincr", "Kylar", "lust", 1));
		C.npc.Kylar.lust = Math.clamp(C.npc.Kylar.lust, 0, 100);
		C.npc.Kylar.love = Math.clamp(C.npc.Kylar.love, 0, 100);
		C.npc.Kylar.rage = Math.clamp(C.npc.Kylar.rage, 0, 100);
		V.kylar.timer.halls += 10 + C.npc.Kylar.lust / 4;
		V.kylar.timer.home += 10 + C.npc.Kylar.lust / 4;
		V.kylar.timer.street += 10 + C.npc.Kylar.lust / 4;
		if (V.kylar.riddle === 1) V.kylar.riddle = 2;
		else V.kylar.riddle = 0;
		if (V.kylarSeen.includes("fountainIntro") && random(1, 10) >= 2) V.kylar.fountain = 1;
		else V.kylar.fountain = 0;
	}

	// Avery
	if (C.npc.Avery.state !== "dismissed") {
		V.averyschoolpickup = 0;
		V.averyseen = 0;
		if (V.averydate) {
			V.averydate = 0;
			if (V.averydateattended !== 1) V.averydatemissed = 1;
			V.averydateattended = 0;
		}
		delete V.averydatedone;
		if (V.averyPub) {
			delete V.averyPub;
			fragment.append(wikifier("clearNPC", "avery_sidepiece"));
		}
	} else {
		delete V.averyDismissalSceneWait;
	}

	// Sydney
	if (C.npc.Sydney.init === 1) {
		statusCheck("Sydney");
		if (C.npc.Sydney.purity >= 1 && C.npc.Sydney.virginity.temple) fragment.append(wikifier("npcincr", "Sydney", "purity", 1));
		if (T.sydneyStatus.includes("corrupt")) C.npc.Sydney.title = "fallen";
		else C.npc.Sydney.title = "faithful";
		if (V.sydneyScience !== 1 || V.sydneySeen.includes("science")) delete V.sydneyLate;
		if (Time.schoolDay && random(1, 4) === 1) V.sydneyLate = 1;
		if (Time.weekDay === 2 && V.sydney && V.sydney.rank === "initiate") V.sydneyLate = 1;
		if (
			V.sydneySeen.includes("library") &&
			C.npc.Sydney.love >= 60 &&
			V.sydneyLibraryEvent === undefined &&
			C.npc.Whitney.init === 1 &&
			C.npc.Whitney.state !== "dungeon" &&
			!V.sydneyLeightonConfrontTimer
		) {
			V.sydneyLibraryEvent = 1;
		}
		if (V.sydneySeen.includes("library") && (V.sydneyLibraryEvent === 2 || V.libraryMoneyStolen || V.sydneyStolenKnown) && !V.sydneyLeightonConfrontTimer) {
			if (V.sydneyLibraryEvent === 2) {
				V.sydneyLeightonConfront = 1;
				V.sydneyLeightonWhitneyGuilty = 1;
			} else if (V.libraryMoneyStolen >= 100 || V.sydneyStolenKnown) {
				V.sydneyLeightonConfront = 1;
				V.sydneyLeightonPlayerGuilty = 1;
			}
		} else if (V.sydneyLeightonConfrontTimer) {
			V.sydneyLeightonConfrontTimer--;
			if (V.sydneyLeightonConfrontTimer <= 0) delete V.sydneyLeightonConfrontTimer;
		}
		if (
			V.sydneyromance === 1 &&
			V.sydneyChastityKnown &&
			C.npc.Sydney.love >= 90 &&
			T.sydneyStatus.includes("Lust") &&
			C.npc.Sydney.chastity.anus.includes("shield")
		) {
			C.npc.Sydney.chastity.anus = "";
			V.sydneyAnalShieldComment = true;
		}
	}

	// Wraith
	if (V.wraith.state) {
		if (V.wraithAngerCooldown) {
			if (V.wraithAngerCooldown > 0) V.wraithAngerCooldown--;
			else {
				V.wraith.offspring = "";
				delete V.wraithAngerCooldown;
			}
		}
		V.wraith.days++;
		if (V.wraith.days >= 31 && V.wraithIntro && !V.wraithCompoundCooldown && !V.wraithCompoundEvent && V.compoundcard === 2) {
			if (!V.wraithCompoundChance) {
				V.wraithCompoundChance = 0;
				if (V.wraith.offspring === "sold") V.wraithCompoundChance += 10;
			}
			if (V.world_corruption_soft >= 30) V.wraithCompoundChance++;
			if (V.wraithCompoundChance >= random(5, 60 - C.npc["Ivory Wraith"].lust)) {
				V.wraithCompoundEvent = true;
				delete V.wraithCompoundChance;
				V.wraithcompoundmessage = 1;
				V.effectsmessage = 1;
			}
		} else if (V.wraithCompoundCooldown > 0) V.wraithCompoundCooldown--;
		else if (V.wraithCompoundCooldown < 1) delete V.wraithCompoundCooldown;
	}

	fragment.append(wikifier("relationshipclamp"));

	return fragment;
}

function dailyPlayerEffects() {
	const fragment = document.createDocumentFragment();

	/* 北极星模组 */
	if (V.cow < 6 || !V.options.bjx_animal) V.willpower *= 0.99;
	/* 北极星 */

	fragment.append(wikifier("corruption", -1));
	if (V.parasite.left_ear.name === "slime") fragment.append(wikifier("corruption", 1));
	if (V.parasite.right_ear.name === "slime") fragment.append(wikifier("corruption", 1));

	if (V.awareness <= -200 && V.innocencestate !== 1) {
		V.innocencestate = 1;
		V.innocencemessage = "start";
		V.innocencetrauma = V.trauma;
		V.trauma = 0;
	} else if (V.awareness >= 0 && V.innocencestate === 1) {
		V.innocencestate = 0;
		V.trauma = V.innocencetrauma;
		V.innocencemessage = "end";
	}

	if (V.physique >= 1000) {
		if (V.farm_stage >= 6) V.physique = V.physique - V.physique / 3000;
		else V.physique = V.physique - V.physique / 2500;
	}

	/* PC loses 60 minutes of tanning every day */
	/* 北极星模组 */
	V.skinColor.sunBlock = false;
	fragment.append(wikifier("tanned", -60, true));
	/* 北极星 */

	V.hairlength += 3;
	V.fringelength += 3;
	fragment.append(wikifier("calchairlengthstage"));
	fragment.append(wikifier("beauty", 100 - (V.trauma / V.traumamax) * 100));
	fragment.append(wikifier("bimboUpdate"));

	if (V.orgasmstat >= 1000 && V.orgasmtrait === 0) {
		V.effectsmessage = 1;
		V.orgasm_trait_message = 1;
		V.orgasmtrait = 1;
	}
	if (V.ejacstat >= 1000 && V.ejactrait === 0) {
		V.effectsmessage = 1;
		V.cum_trait_message = 1;
		V.ejactrait = 1;
	}
	if (V.moleststat >= 1000 && V.molesttrait === 0) {
		V.effectsmessage = 1;
		V.molest_trait_message = 1;
		V.molesttrait = 1;
	}
	if (V.rapestat >= 500 && V.rapetrait === 0) {
		V.effectsmessage = 1;
		V.rape_trait_message = 1;
		V.rapetrait = 1;
	}
	if (V.beastrapestat >= 100 && V.bestialitytrait === 0) {
		V.effectsmessage = 1;
		V.bestiality_trait_message = 1;
		V.bestialitytrait = 1;
	}
	if (V.tentaclerapestat >= 50 && V.tentacletrait === 0) {
		V.effectsmessage = 1;
		V.tentacle_trait_message = 1;
		V.tentacletrait = 1;
	}
	if (V.swallowedstat >= 20 && V.voretrait === 0) {
		V.effectsmessage = 1;
		V.vore_trait_message = 1;
		V.voretrait = 1;
	}
	if (V.milk_drank_stat >= 1000 && V.milkdranktrait === 0) {
		V.effectsmessage = 1;
		V.milk_trait_message = 1;
		V.milkdranktrait = 1;
	}

	if (V.skulduggery >= 1000 && V.skulduggeryday < 1000) V.skulduggerymessage = 1;
	else if (V.skulduggery >= 900 && V.skulduggeryday < 900) V.skulduggerymessage = 2;
	else if (V.skulduggery >= 800 && V.skulduggeryday < 800) V.skulduggerymessage = 3;
	else if (V.skulduggery >= 700 && V.skulduggeryday < 700) V.skulduggerymessage = 4;
	else if (V.skulduggery >= 600 && V.skulduggeryday < 600) V.skulduggerymessage = 5;
	else if (V.skulduggery >= 500 && V.skulduggeryday < 500) V.skulduggerymessage = 6;
	else if (V.skulduggery >= 400 && V.skulduggeryday < 400) V.skulduggerymessage = 7;
	else if (V.skulduggery >= 300 && V.skulduggeryday < 300) V.skulduggerymessage = 8;
	else if (V.skulduggery >= 200 && V.skulduggeryday < 200) V.skulduggerymessage = 9;
	else if (V.skulduggery >= 100 && V.skulduggeryday < 100) V.skulduggerymessage = 10;
	if (V.skulduggerymessage) V.effectsmessage = 1;

	if (V.pbdisable === "f") {
		V.pbgrowth++;
		if (V.pbgrowth >= 24) V.pblevel = 9;
		else if (V.pbgrowth >= 19) V.pblevel = 8;
		else if (V.pbgrowth >= 14) V.pblevel = 7;
		else if (V.pbgrowth >= 10) V.pblevel = 6;
		else if (V.pbgrowth >= 7) V.pblevel = 5;
		else if (V.pbgrowth >= 5) V.pblevel = 3;
		else if (V.pbgrowth >= 2) V.pblevel = 2;
		else if (V.pbgrowth >= 1) V.pblevel = 1;
		if (V.player.ballsExist) {
			V.pbgrowthballs++;
			if (V.pbgrowthballs >= 24) V.pblevelballs = 9;
			else if (V.pbgrowthballs >= 19) V.pblevelballs = 7;
			else if (V.pbgrowthballs >= 10) V.pblevelballs = 5;
			else if (V.pbgrowthballs >= 5) V.pblevelballs = 3;
		}
	}

	fragment.append(wikifier("insecurity", "penis_tiny", -1));
	fragment.append(wikifier("insecurity", "penis_small", -1));
	fragment.append(wikifier("insecurity", "penis_big", -1));
	fragment.append(wikifier("insecurity", "breasts_tiny", -1));
	fragment.append(wikifier("insecurity", "breasts_small", -1));
	fragment.append(wikifier("insecurity", "breasts_big", -1));

	V.insecurity_penis_tiny = Math.clamp(V.insecurity_penis_tiny, 0, 1000);
	V.insecurity_penis_small = Math.clamp(V.insecurity_penis_small, 0, 1000);
	V.insecurity_penis_big = Math.clamp(V.insecurity_penis_big, 0, 1000);
	V.insecurity_breasts_tiny = Math.clamp(V.insecurity_breasts_tiny, 0, 1000);
	V.insecurity_breasts_small = Math.clamp(V.insecurity_breasts_small, 0, 1000);
	V.insecurity_breasts_big = Math.clamp(V.insecurity_breasts_big, 0, 1000);

	for (const bodypart of setup.bodyparts) {
		if (V.skin[bodypart].pen === "marker" && random(0, 1)) fragment.append(wikifier("bodywriting_clear", bodypart));
	}

	return fragment;
}

function dailyTransformationEffects() {
	const fragment = document.createDocumentFragment();

	/* 北极星模组 */
	if (V.fallenangel >= 5 && !(V.player.virginity.vaginal === true && V.player.virginity.penile === true)) {
        if (V.fallenangel >= 6 && V.purity >= 600) {
            V.fallenangelmessage = 3;
        	V.effectsmessage = 1;
            if (V.player.virginity.penile !== true) {
        	    V.player.virginity.penile = true;
        	    V.purity = V.purity + 100;
        	}
        	if (V.player.virginity.vaginal !== true) {
        	    V.player.virginity.vaginal = true;
        	    V.purity = V.purity + 100;
        	}
            if (V.player.virginity.temple !== true) {
                V.player.virginity.temple = true;
            }
        }
        else if (V.purity >= 600) {
            V.fallenangelmessage = 2;
        	V.effectsmessage = 1;
            if (V.player.virginity.penile !== true) {
        	    V.player.virginity.penile = true;
        	}
        	if (V.player.virginity.vaginal !== true) {
        	    V.player.virginity.vaginal = true;
        	}
            if (V.player.virginity.temple !== true) {
                V.player.virginity.temple = true;
            }
        }
        else if (V.purity >= 400) {
            V.fallenangelmessage = 4;
        	V.effectsmessage = 1;
        }
        else {
            V.fallenangelmessage = 1;
        	V.effectsmessage = 1;
        }
    }
    /* 北极星 */
    
	if (V.purity <= 0) {
		if (V.fallenangel >= 4) {
			V.fallenangelmessage = 1;
			V.effectsmessage = 1;
		} else if (V.fallenangel >= 2) {
			fragment.append(wikifier("fallenDescend"));
		} else {
			fragment.append(wikifier("transform", "demon", 1));
		}
	} else {
		fragment.append(wikifier("transform", "demon", -1));
	}

	if (V.fallenangel >= 2 && V.fallenangel <= 3) {
		if (V.purity >= 900) fragment.append(wikifier("transform", "fallen", 1));
		else fragment.append(wikifier("transform", "fallen", -1));
	}

	/* 北极星模组 */
	if (V.demon >= 1) {
        if (V.demonabsorb > 0) V.daynoabsorb = 0;
		else V.daynoabsorb += 1;
		if (V.daynoabsorb >= 14 && V.demonhunter < 2 && V.options.bjx_divine) fragment.append(wikifier("hunterTransform"));
    }
    if (V.demonhunter >= 2 && V.demonhunter <= 3) {
		if (V.daynoabsorb >= 7) fragment.append(wikifier("transform", "hunter", 1));
		else fragment.append(wikifier("transform", "hunter", -1));
	}
	if (V.purity >= 10 && V.demonhunter >= 2) {
		V.huntermessage = 2;
		V.purity = 0;
		V.effectsmessage = 1;
	}
	else if (V.purity >= 1 && V.demonhunter >= 2) {
	    V.huntermessage = 1;
		V.purity = 0;
		V.effectsmessage = 1;
    }
    /* 北极星 */
	if (V.purity >= 1 && (V.demon >= 6 || (V.demon >= 1 && V.demonFeat))) {
		V.demonmessage = 1;
		V.effectsmessage = 1;
	}

	let dailyPurity = 1;
	if (V.featsPurityBoost) dailyPurity += V.featsPurityBoost;
	/* 北极星模组 */
	if (V.fallenangel >= 2 && V.fallenangel <= 4) dailyPurity -= 10;
	/* 北极星 */
	if (V.player.virginity.vaginal === true && V.player.virginity.penile === true) dailyPurity += 2;
	fragment.append(wikifier("purity", dailyPurity));

	if (V.purity >= 1000) fragment.append(wikifier("transform", "angel", 1));
	else fragment.append(wikifier("transform", "angel", -1));

	if (V.angel >= 4) {
		V.angelBanishMax = Math.floor(V.angelbuild / 10);
		V.angelBanish = V.angelBanishMax;
	} else {
		V.angelBanish = 0;
	}

	fragment.append(wikifier("transformationStateUpdate"));

	return fragment;
}

function dailyLiquidEffects() {
	const fragment = document.createDocumentFragment();

	if (V.player.penisExist) {
		let amount = V.player.penissize - 1;
		if (V.semen_volume <= 24) amount++;
		amount -= Math.floor(V.semen_volume / 250);
		fragment.append(wikifier("semenvolume", amount));
	} else {
		V.semen_volume = 0;
		V.semen_amount = 0;
	}

	let pressureReduction = -1;
	if (V.earSlime.growth >= 75 && V.earSlime.focus === "impregnation") pressureReduction -= 2;
	if (V.earSlime.growth >= 75 && V.earSlime.focus === "pregnancy") pressureReduction += 2;
	if (pressureReduction < 0) {
		fragment.append(wikifier("milkvolume", pressureReduction * 2));
		fragment.append(wikifier("lactation_pressure", pressureReduction));
	}

	if (V.purity + V.semen_volume < 980) fragment.append(wikifier("semenvolume", 3));
	if (V.purity + V.milk_volume < 1000) V.milk_volume += 10;

	if (V.lactating) {
		if (V.lactation_pressure < 30 || V.player.breastsize <= 0) {
			V.lactating = 0;
			V.effectsmessage = 1;
			V.lactationmessage = 1;
		}
	} else {
		if (V.lactation_pressure >= 30 && V.breastfeedingdisable === "f" && V.player.breastsize >= 1) {
			V.lactating = 1;
			V.effectsmessage = 1;
			V.lactationmessage = 1;
		}
	}

	V.nectar_addiction = Math.clamp(V.nectar_addiction - 5, 0, 200);
	if (V.backgroundTraits.includes("plantlover")) {
		V.nectar_timer--;
		if (V.nectar_timer <= 0) {
			V.backgroundTraits.delete("plantlover");
			V.effectsmessage = 1;
			V.nectarmessage = "traitLost";
			V.nectar_addiction = 0;
		} else if (V.nectar_timer <= 14) {
			V.effectsmessage = 1;
			V.nectarmessage = "withdrawals";
		}
	} else {
		if (V.nectar_addiction >= 150) {
			V.backgroundTraits.pushUnique("plantlover");
			V.effectsmessage = 1;
			V.nectarmessage = "traitGain";
			V.nectar_timer = 21;
		}
	}

	return fragment;
}

function yearlyEventChecks() {
	const fragment = document.createDocumentFragment();

	// Valentines
	if (Time.monthName === "February" && Time.monthDay >= 6 && Time.monthDay <= 14) {
		V.valentines = 1;
	} else if (V.valentines) {
		delete V.valentines;
		delete V.valentines_eden;
		delete V.valentines_eden_bought;
		delete V.valentines_eden_bath;
		delete V.valentines_eden_breakfast;
	}

	// Halloween
	if (Time.monthName === "October" && Time.monthDay >= 21) {
		V.halloween = 1;
	} else if (V.halloween) {
		if (V.halloween_robin_costume && C.npc.Robin.outfits && C.npc.Robin.outfits.includes(V.halloween_robin_costume))
			fragment.append(wikifier("removeNNPCOutfit", "Robin", V.halloween_robin_costume));
		delete V.halloween;
		delete V.halloween_whitney;
		delete V.halloween_whitney_proposed;
		delete V.halloween_robin;
		delete V.halloween_robin_scare;
		delete V.halloween_robin_costume;
		delete V.halloween_winter_key;
		delete V.halloween_eden;
		delete V.halloween_eden_bought;
		delete V.halloween_eden_candy_given;
		delete V.halloween_trick_NPC;
	}
	if (Time.monthName === "November" && Time.monthDay >= 2) {
		delete V.halloween_kylar;
		delete V.halloween_kylar_proposed;
		delete V.halloween_lake;
		delete V.halloweenWolves;
	}

	// Christmas
	if (Time.monthName === "December" && Time.monthDay >= 18 && Time.monthDay <= 25) {
		V.christmas = 1;
	} else if (V.christmas) {
		delete V.christmas;
		delete V.christmas_event;
		delete V.christmas_event_2;
		delete V.christmas_gift;
		delete V.christmas_gift_robin;
		delete V.christmas_wrap;
		delete V.christmas_gift_robin_wrapped;
		delete V.christmas_robin_lewd;
		delete V.christmas_robin_gift_received;
		delete V.christmas_gift_robin_given;
		delete V.christmas_gift_eden;
		delete V.christmas_gift_eden_given;
		delete V.christmas_kylar;
		delete V.christmas_whitney;
		delete V.edenmeal;
		delete V.eden_christmas_dinner;
		delete V.christmas_wraith;
	}

	return fragment;
}

function moonState() {
	const fragment = document.createDocumentFragment();

	if (Time.monthDay === Time.lastDayOfMonth) {
		V.moonstate = "evening";
		V.moonEvent = true;
		fragment.append(wikifier("checkWraith", true));
	} else if (Time.monthDay === 1) {
		V.moonstate = "morning";
		fragment.append(wikifier("checkWraith", true));
	} else if (V.moonstate !== 0) {
		V.moonstate = 0;
		delete V.moonEvent;
		fragment.append(wikifier("clearWraith"));
		delete V.noEarSlime;
	}

	return fragment;
}

function dailySchoolEffects() {
	const fragment = document.createDocumentFragment();

	V.schooleventtimer--;
	if (V.scienceproject === "ongoing") {
		V.scienceprojectdays--;
		if (V.scienceprojectdays < 0) {
			V.scienceproject = "done";
			fragment.append(wikifier("scienceprojectfinish"));
		}
	}
	if (V.mathsproject === "ongoing") {
		V.mathsprojectdays--;
		if (V.mathsprojectdays < 0) {
			V.mathsproject = "done";
			fragment.append(wikifier("mathsprojectfinish"));
		}
		V.mathslibrarystudent = 0;
	}
	if (V.englishPlay === "ongoing") {
		V.englishPlayDays--;
		if (V.englishPlayLate) {
			V.englishPlayLate--;
			if (V.englishPlayLate < 0) {
				delete V.englishPlayLate;
				V.englishPlayRoles.Sydney = "Cass";
			}
		}
		if (V.englishPlayDays < 0) {
			fragment.append(wikifier("englishplayfinish"));
			V.englishPlay = "missed";
		}
	}
	if (V.schooltrait >= 4) fragment.append(wikifier("trauma", -50));
	else if (V.schooltrait === 3) fragment.append(wikifier("trauma", -40));
	else if (V.schooltrait === 2) fragment.append(wikifier("trauma", -30));
	else if (V.schooltrait === 1) fragment.append(wikifier("trauma", -20));
	else fragment.append(wikifier("trauma", -10));

	if (Time.isSchoolDay(Time.yesterday) && V.location !== "prison") {
	    /* 北极星模组 */
	    let attended = 5;
	    if (!V.options.bjx_goodstudent || C.npc.Leighton.love < V.npclovehigh && V.distinction_stat < 15) {
			if (!V.options.bjx_goodstudent || C.npc.Sirris.love < V.npclovehigh) V.schoolLessonsMissed.science += !Number(V.daily.school.attended.science);
        	if (!V.options.bjx_goodstudent || C.npc.River.love < V.npclovehigh) V.schoolLessonsMissed.maths += !Number(V.daily.school.attended.maths);
        	if (!V.options.bjx_goodstudent || C.npc.Doren.love < V.npclovehigh) V.schoolLessonsMissed.english += !Number(V.daily.school.attended.english);
        	if (!V.options.bjx_goodstudent || C.npc.Winter.love < V.npclovehigh) V.schoolLessonsMissed.history += !Number(V.daily.school.attended.history);
        	if (!V.options.bjx_goodstudent || C.npc.Mason.love < V.npclovehigh) V.schoolLessonsMissed.swimming += !Number(V.daily.school.attended.swimming);
        	if (!V.options.bjx_goodstudent || C.npc.Sirris.love < V.npclovehigh) attended -= !Number(V.daily.school.attended.science);
        	if (!V.options.bjx_goodstudent || C.npc.River.love < V.npclovehigh) attended -= !Number(V.daily.school.attended.maths);
        	if (!V.options.bjx_goodstudent || C.npc.Doren.love < V.npclovehigh) attended -= !Number(V.daily.school.attended.english);
        	if (!V.options.bjx_goodstudent || C.npc.Winter.love < V.npclovehigh) attended -= !Number(V.daily.school.attended.history);
        	if (!V.options.bjx_goodstudent || C.npc.Mason.love < V.npclovehigh) attended -= !Number(V.daily.school.attended.swimming);
		}
	    /* 北极星 */
		V.lessonmissed += 5 - attended * 2; // Reduce lessonmissed if lessons are attended
		V.lessonmissedtext = 5 - attended;
	}

	// Reset inspections before every term
	if (!Time.isSchoolTerm && V.schoolevent > 0) {
		V.schoolevent = 0;
		V.schooleventtimer = 10;
	}

	fragment.append(wikifier("schoolclothesreset"));

	if (Time.schoolTerm && Time.weekDay > 2) {
		let delinquencyDecay = 1;
		if (C.npc.Leighton.love >= V.npclovehigh) delinquencyDecay++;
		if (C.npc.Sirris.love >= V.npclovehigh) delinquencyDecay++;
		if (C.npc.River.love >= V.npclovehigh) delinquencyDecay++;
		if (C.npc.Doren.love >= V.npclovehigh) delinquencyDecay++;
		if (C.npc.Winter.love >= V.npclovehigh) delinquencyDecay++;
		if (C.npc.Mason.love >= V.npclovehigh) delinquencyDecay++;
		if (V.lessonmissedtext) delinquencyDecay = Math.floor(delinquencyDecay / 2);
		fragment.append(wikifier("delinquency", -delinquencyDecay / 4));
		if (V.schoolfameblackmail !== undefined) V.schoolfameblackmail++;
	}

	if (V.science_star >= 1) {
		fragment.append(wikifier("scienceskill", Math.clamp(V.science_star, 0, 3)));
		V.science_star = 0;
	}
	if (V.maths_star >= 1) {
		fragment.append(wikifier("mathsskill", Math.clamp(V.maths_star, 0, 3)));
		V.maths_star = 0;
	}
	if (V.english_star >= 1) {
		fragment.append(wikifier("englishskill", Math.clamp(V.english_star, 0, 3)));
		V.english_star = 0;
	}
	if (V.history_star >= 1) {
		fragment.append(wikifier("historyskill", Math.clamp(V.history_star, 0, 3)));
		V.history_star = 0;
	}

	V.school = V.science + V.english + V.maths + V.history;
	V.schooltrait = V.school >= 2800 ? 4 : V.school >= 2000 ? 3 : V.school >= 1600 ? 2 : V.school >= 1200 ? 1 : 0;

	if (V.studyBooks) {
		fragment.append(wikifier("passiveStudy"));
		if (V.studyBooks.rented !== "none" && Time.schoolTerm) {
			if (V.book_rent_timer >= 0) {
				V.book_rent_timer--;
			} else if (V.book_rent_timer < 0) {
				if (V.bookOverdue === undefined) V.bookOverdue = 0;
				V.bookOverdue++;
				if (V.bookOverdue >= 7) {
					V.bookoverduemessage = 1;
					V.effectsmessage = 1;
				} else {
					V.bookoverduemessage = 2;
					V.effectsmessage = 1;
				}
			}
		}
		if (V.studyBooks.stolen !== "none" && Time.schoolTerm) fragment.append(wikifier("crimeUp", 1, "thievery"));
		if (V.recentReturnTimer) {
			V.recentReturnTimer--;
			if (V.recentReturnTimer <= 0) delete V.recentReturnTimer;
		}
	}
	if (V.bookStolen === 1) {
		delete V.bookStolen;
		if (V.bookStolenKnown === undefined) V.bookStolenKnown = 1;
		if (V.libraryMoneyStolen === undefined) V.libraryMoneyStolen = 0;
		V.libraryMoneyStolen += 20;
		fragment.append(wikifier("crimeUp", 20, "thievery"));
	}

	if (V.island !== undefined) {
		if (V.island.walnut >= 1) {
			const rng = random(0, V.island.walnut);
			V.island.walnut -= rng;
			V.island.walnut_dried += rng;
		}
	}

	if (V.temple_initiate_days !== undefined) {
		V.temple_initiate_days += 1;
	}
	if (V.temple_monk_days !== undefined) {
		V.temple_monk_days += 1;
	}
	if (V.temple_spar !== undefined) {
		delete V.temple_spar;
	}

	return fragment;
}

function dailyMasochismSadismEffects() {
	const fragment = document.createDocumentFragment();

	const effects = (level, stat) => {
		switch (level) {
			case 0:
				if (stat >= 100) return { level: 1, message: "up 1" };
				break;
			case 1:
				if (stat >= 300) return { level: 2, message: "up 2" };
				else if (stat <= 50) return { level: 0, message: "down 1" };
				break;
			case 2:
				if (stat >= 500) return { level: 3, message: "up 3" };
				else if (stat <= 200) return { level: 1, message: "down 1" };
				break;
			case 3:
				if (stat >= 800) return { level: 4, message: "up 4" };
				else if (stat <= 400) return { level: 2, message: "down 2" };
				break;
			case 4:
				if (stat <= 700) return { level: 3, message: "down 3" };
				break;
		}
		return false;
	};

	/* 北极星模组 */
	if (V.options.bjx_animal && V.sheep >= 6) {
		V.masochism += 50;
	} else {
	    V.masochism *= 0.985;
	}
	/* 北极星 */
	const masochism = effects(V.masochism_level, V.masochism);
	if (masochism) {
		V.masochism_level = masochism.level;
		V.masochism_message = masochism.message;
		V.effectsmessage = 1;
	}
	/* 北极星模组 */
	if (V.options.bjx_animal && V.wolfgirl >= 6) {
		V.sadism += 50;
	} else {
	    V.sadism *= 0.985;
	}
	/* 北极星 */
	const sadism = effects(V.sadism_level, V.sadism);
	if (sadism) {
		V.sadism_level = sadism.level;
		V.sadism_message = sadism.message;
		V.effectsmessage = 1;
	}

	return fragment;
}

function dailyFarmEvents() {
	const fragment = document.createDocumentFragment();

	if (V.alex_greenhouse === 1) {
		if (V.weather !== "rain" && V.weather !== "snow") V.alex_greenhouse_timer--;
		if (V.alex_greenhouse_timer < 1) {
			delete V.alex_greenhouse_timer;
			V.alex_greenhouse = 2;
		}
	}
	if (V.farm_stage >= 2) fragment.append(wikifier("farm_work_update", "midnight"));
	if (V.farm_stage >= 5) {
		if (V.bailey_encroach >= 1) fragment.append(wikifier("farm_aggro", 15));
		if (V.bailey_encroach >= 2) fragment.append(wikifier("farm_aggro", V.bailey_encroach * 3));
		if (V.farm_stage >= 7) fragment.append(wikifier("farm_aggro", 5));
		fragment.append(wikifier("farm_aggro", 5));
	}
	if (V.farm_stage >= 7) {
		V.farm_attack_timer--;
		if (V.farm_attack_timer < 0) fragment.append(wikifier("farm_attack_auto"));
		if (V.farm.stock) {
			V.farm.stock.truffles = Math.trunc(V.farm.stock.truffles * 0.8);
			V.farm.stock.milk = Math.trunc(V.farm.stock.milk * 0.8);
			V.farm.stock.eggs = Math.trunc(V.farm.stock.eggs * 0.8);
		}
		if (V.farm.woodland >= 3) {
			fragment.append(wikifier("farm_stock", "truffles", 6, 12));
			fragment.append(wikifier("farm_pigs", -2));
		} else if (V.farm.woodland >= 1) {
			fragment.append(wikifier("farm_stock", "truffles", 3, 6));
			fragment.append(wikifier("farm_pigs", -1));
		}
		if (V.farm.barn >= 2) {
			fragment.append(wikifier("farm_stock", "milk", 12, 24));
		} else if (V.farm.barn >= 1) {
			fragment.append(wikifier("farm_stock", "milk", 6, 12));
		}
		if (V.farm.coop >= 2) {
			fragment.append(wikifier("farm_stock", "eggs", 12, 24));
		} else if (V.farm.coop >= 1) {
			fragment.append(wikifier("farm_stock", "eggs", 6, 12));
		}
		if (V.farm.kennel >= 1) {
			fragment.append(wikifier("farm_dogs", -1));
			fragment.append(wikifier("farm_cattle", -1));
		}
		fragment.append(wikifier("farm_build_day"));
	}
	if (V.farm_stage >= 9) {
		if (V.lurkers_stored >= 1) {
			V.farm.still_timer--;
			if (V.farm.still_timer < 1) {
				V.lurkers_stored--;
				V.phials_stored++;
				V.farm.still_timer = 7;
			}
		}
	}
	if (V.farm_countdown >= 1) V.farm_countdown--;
	if (V.farm_yield !== undefined) {
		if (!V.farm_yield_alex) V.farm_yield_alex = 0;
		V.farm_yield_alex += V.farm_yield;
		delete V.farm_yield;
	}
	if (V.alex_countdown >= 1) V.alex_countdown--;

	delete V.farm_work;
	delete V.farm_count;
	delete V.farm_naked;
	delete V.farm_event;
	delete V.farm_end;
	delete V.alex_breakfast;
	delete V.alex_tea;
	delete V.alex_to_bed;

	return fragment;
}

/* 北极星模组 */
// 湖边小屋每日事件
function dailyLakeHouseEvents() {
	const fragment = document.createDocumentFragment();

	// V.lakehouse_attack_timer--;
	// if (V.lakehouse_attack_timer < 0) fragment.append(wikifier("lakehouse_attack_auto"));
	fragment.append(wikifier("lakehouse_build_day"));
	if (V.lakehouse_countdown >= 1) V.lakehouse_countdown--;
    
    if (!V.lakehouse.owner && V.lakehouse.billsphase < 4) {
		V.lakehouse.bills--;
		if (V.lakehouse.bills < 0){
			V.lakehouse.billsphase++;
			V.lakehouse.bills = 7;
			if (V.lakehouse.billsphase >= 2){
    			V.lakehouse_bills = true;
    		}
		}
	}
	if (V.lakehouse.owner) V.lakehouse.billsphase = 0;
	
	return fragment;
}
/* 北极星 */

function temperatureHour() {
	V.chill = V.chill_day;
	if (Time.dayState === "night") V.chill += V.weather === "clear" ? 50 : 30;
	else if (Time.dayState === "dusk") V.chill = V.weather === "clear" ? V.chill - 5 : V.chill + 15;
	else if (Time.dayState === "day") V.chill = V.weather === "clear" ? V.chill - 10 : V.chill + 10;
	else V.chill += V.weather === "clear" ? 20 : 0;
}

// (Directly converted from passWater widget)
function passWater(passMinutes) {
	const fragment = document.createDocumentFragment();

	if (V.outside && V.weather === "clear") {
		if (V.upperwet) fragment.append(wikifier("upperwet", -passMinutes * 2));
		if (V.lowerwet) fragment.append(wikifier("lowerwet", -passMinutes * 2));
		if (V.underlowerwet) fragment.append(wikifier("underlowerwet", -passMinutes * (V.worn.lower.type.includes("naked") ? 2 : 1)));
		if (V.underupperwet) fragment.append(wikifier("underupperwet", -passMinutes * (V.worn.upper.type.includes("naked") ? 2 : 1)));
	/* 北极星模组 */
	} else if (V.outside && V.weather === "rain" && !(V.worn.head.type.includes("rainproof") || V.worn.over_head.type.includes("rainproof"))) {
	/* 北极星 */
		if (!V.worn.upper.type.includes("naked") && !waterproofCheck(V.worn.upper) && !waterproofCheck(V.worn.over_upper)) {
			fragment.append(wikifier("upperwet", passMinutes));
		}
		if (!V.worn.lower.type.includes("naked") && !waterproofCheck(V.worn.lower) && !waterproofCheck(V.worn.over_lower)) {
			fragment.append(wikifier("lowerwet", passMinutes));
		}
		// eslint-disable-next-line prettier/prettier
		if (!V.worn.under_lower.type.includes("naked") && !waterproofCheck(V.worn.under_lower) && !waterproofCheck(V.worn.lower) && !waterproofCheck(V.worn.over_lower)) {
			fragment.append(wikifier("underlowerwet", passMinutes));
		}
		// eslint-disable-next-line prettier/prettier
		if (!V.worn.under_upper.type.includes("naked") && !waterproofCheck(V.worn.under_upper) && !waterproofCheck(V.worn.upper) && !waterproofCheck(V.worn.over_upper)) {
			fragment.append(wikifier("underupperwet", passMinutes));
		}
	} else {
		if (V.upperwet) fragment.append(wikifier("upperwet", -passMinutes));
		if (V.lowerwet) fragment.append(wikifier("lowerwet", -passMinutes));
		if (V.underlowerwet) fragment.append(wikifier("underlowerwet", -passMinutes));
		if (V.underupperwet) fragment.append(wikifier("underupperwet", -passMinutes));
	}

	return fragment;
}

// (Directly converted from passArousalWetness widget - included comments)
function passArousalWetness(passMinutes) {
	const fragment = document.createDocumentFragment();

	let wetnessChange = 0;
	const arousalPercent = Math.clamp(V.arousal / V.arousalmax, 0, 1);

	// Vaginal lube is produced at a fairly linear rate, between 1-3 per minute based on arousal.
	if (V.arousal >= V.arousalmax * (2 / 5)) {
		wetnessChange = 1 + arousalPercent * 2;
		// It also gets harder to build up the closer you get to full wetness
		const wetnessPercent = Math.clamp(V.vaginaArousalWetness / 100, 0, 1);
		wetnessChange = Math.floor(wetnessChange * 2 * (1 - wetnessPercent));
	}

	// It dries up at a gradually increasing rate, starting at 0.1 per minute, but increasing the longer it's been since last arousal.
	// It also dries slower at high arousal, in an inverse relationship.
	wetnessChange -= 0.1 * V.timeSinceArousal * (1 - arousalPercent);

	// If wetnessChange would go negative, and arousal is high enough, wetness instead does not change.
	if (V.arousal >= V.arousalmax * (3 / 5) && wetnessChange < 0) wetnessChange = 0;
	V.vaginaArousalWetness += Math.round(wetnessChange * passMinutes);

	// Arbitrarily, we'll say that the player's vagina holds up to 60 units of lube, and it begins to leak out above 60.
	if (V.vaginaArousalWetness >= 60) {
		V.vaginaArousalWetness = Math.floor(120 - 3600 / V.vaginaArousalWetness);

		// Clothing dries at a rate of -1 * passMinutes. To offset that, it needs to be wet by at least 1 * passMinutes. -->
		// Expected rate: between 1 and 2.61, usually around 1.8
		const change = Math.clamp(1 + Math.log10(V.vaginaArousalWetness - 59), 1, 3);
		if (!V.worn.under_lower.type.includes("naked") && !V.worn.under_lower.type.includes("swim")) {
			fragment.append(wikifier("underlowerwet", Math.round(change * passMinutes)));
			fragment.append(wikifier("underlowerwet", Math.clamp(V.underlowerwet, 0, 100 + passMinutes)));
			V.pantiesSoaked = V.underlowerwet >= 100;
		}
	}
	if (V.earSlime.focus === "pregnancy" && V.earSlime.growth >= 75) {
		// Prevent it from dropping below 30 or 60 when the ear slime has fully grown with a focus on pregnancy
		V.vaginaArousalWetness = Math.clamp(V.vaginaArousalWetness, V.earSlime.growth >= 100 ? 60 : 30, 100);
	} else {
		V.vaginaArousalWetness = Math.clamp(V.vaginaArousalWetness, 0, 100);
	}
	fragment.append(wikifier("vaginaWetnessCalculate"));

	return fragment;
}

function getArousal(passMinutes) {
	const minuteMultiplier = passMinutes * 10;
	let addedArousal = 0;

	if (V.penilechastityparasite) addedArousal += minuteMultiplier * V.genitalsensitivity;
	if (V.vaginalchastityparasite) addedArousal += minuteMultiplier * V.genitalsensitivity;
	if (V.parasite.nipples.name) addedArousal += minuteMultiplier * V.breastsensitivity;
	if (V.parasite.penis.name) addedArousal += minuteMultiplier * V.genitalsensitivity;
	if (V.parasite.clit.name) addedArousal += minuteMultiplier * V.genitalsensitivity;
	if (V.parasite.bottom.name) addedArousal += minuteMultiplier * V.bottomsensitivity;
	if (V.analchastityparasite) addedArousal += minuteMultiplier;
	if (V.parasite.tummy.name) addedArousal += minuteMultiplier;
	if (V.parasite.left_arm.name) addedArousal += minuteMultiplier;
	if (V.parasite.right_arm.name) addedArousal += minuteMultiplier;
	if (V.parasite.left_thigh.name) addedArousal += minuteMultiplier;
	if (V.parasite.right_thigh.name) addedArousal += minuteMultiplier;
	if (V.drugged > 1) addedArousal += minuteMultiplier;
	if (playerHasButtPlug()) addedArousal += minuteMultiplier;
	if (V.parasite.left_ear.name === "slime" && random(1, 10) >= 9) wikifier("drugs", Math.min(60, passMinutes));
	if (V.parasite.right_ear.name === "slime" && random(1, 10) >= 9) wikifier("drugs", Math.min(60, passMinutes));
	if (V.earSlime.growth > 100 && random(1, 10) >= 9) wikifier("drugs", Math.min(60, passMinutes));

	if (V.worn.genitals.name === "chastity parasite") {
		if (!V.masturbating) {
			if (V.earSlime.corruption >= 100 && !V.earSlime.defyCooldown && !V.earSlime.vibration) {
				V.earSlime.lastVibration += passMinutes;
				if (V.earSlime.lastVibration > random(180, 720)) {
					V.earSlime.vibration = random(2, 60);
					V.earSlime.lastVibration = 0;
				}
			}
			if (V.earSlime.defyCooldown) {
				if (V.pain < 25) V.pain += Math.clamp(passMinutes, 0, 20 - Math.floor(V.pain));
				// Helps to reduce the penis size
				V.penisgrowthtimer += Math.floor(passMinutes / 4);
			} else if (V.earSlime.vibration > 0) {
				addedArousal += Math.clamp(minuteMultiplier, 0, V.earSlime.vibration * 10) * V.genitalsensitivity;
				V.earSlime.vibration -= Math.clamp(passMinutes, 0, V.earSlime.vibration);
				V.earSlime.lastVibration = Math.clamp(passMinutes - V.earSlime.vibration, 0, Infinity);
			}
		}
	} else {
		V.earSlime.vibration = 0;
		V.earSlime.lastVibration = 0;
	}

	return addedArousal;
}

function earSlimeDaily() {
	if (V.earSlime.eventTimer >= 1) V.earSlime.eventTimer--;
	if (V.earSlime.eventTimer < 1) V.earSlime.event = "";

	if (V.earSlime.corruption >= 60 && V.parasite.left_ear.name === "slime" && V.parasite.right_ear.name === "slime" && V.earSlimeTest) {
		if (V.earSlime.growth < 100) V.earSlime.growth++;
		if (V.earSlime.corruption >= 100) V.earSlime.growth++;
		V.earSlime.growth = Math.clamp(V.earSlime.growth, 0, V.earSlime.focus === "none" ? 50 : 200);
	} else if (V.earSlime.corruption < 30 && V.earSlime.growth <= 50 && V.earSlimeTest) {
		// Reduce the growth variable only if below or equal to 50
		V.earSlime.growth--;
	}

	if (V.earSlime.growth >= 75 && V.parasite.breasts.name !== "parasite") {
		wikifier("parasite", "breasts", "parasite", "noSuck");
		V.effectsmessage = 1;
		V.earSlimebreastsParasite = 1;
	}

	if (V.earSlime.growth >= 100) {
		if (
			(V.earSlime.growth >= 95 && V.player.gender !== "f" && V.parasite.penis.name !== "parasite") ||
			(V.earSlime.growth >= 100 && V.player.gender === "f" && V.parasite.clit.name !== "parasite")
		) {
			if (V.player.gender !== "f") {
				V.effectsmessage = 1;
				V.earSlimePenisParasite = 1;
				if (V.parasite.penis.name && V.parasite.penis.name !== "parasite") {
					V.earSlimePenisParasite = V.parasite.penis.name;
					wikifier("removeparasite", "penis");
				}
				wikifier("parasite", "penis", "parasite", "noSuck");
			} else {
				V.effectsmessage = 1;
				V.earSlimeClitParasite = 1;
				if (V.parasite.clit.name && V.parasite.clit.name !== "parasite") {
					V.earSlimeClitParasite = V.parasite.clit.name;
					wikifier("removeparasite", "clit");
				}
				wikifier("parasite", "clit", "parasite", "noSuck");
				if (["mixed", "impregnation"].includes(V.earSlime.focus) && V.player.gender === "f") V.player.penisExist = true;
			}
		}

		// Breaks chastity gear over time, attempts to equip a chastity parasite if it aplies
		if (!["naked", "chastity parasite"].includes(V.worn.genitals.name) && playerChastity()) {
			V.worn.genitals.integrity -= 500;
			if (V.worn.genitals.integrity <= 0) {
				V.effectsmessage = 1;
				V.penisslimebrokenchastitymessage = V.worn.genitals.name;
				V.worn.genitals.type.push("broken");
				wikifier("genitalsruined");
			}
		}

		if (V.earSlime.focus === "pregnancy" && V.player.penisExist) {
			if (V.worn.genitals.name === "naked" && !V.masturbating) {
				// Equips a chastity parasite
				V.effectsmessage = 1;
				V.penisslimecagemessage = 1;
				wikifier("genitalswear", 8);
				V.worn.genitals.origin = "ear slime";
			} else if (V.worn.genitals.name === "chastity parasite" && V.worn.genitals.integrity < clothingData("genitals", V.worn.genitals, "integrity_max")) {
				// Repairs the chastity parasite
				if (integrityKeyword(V.worn.genitals.integrity, "genitals") !== "full") {
					V.effectsmessage = 1;
					V.penisslimecagemessage = 2;
				}
				V.worn.genitals.integrity = clothingData("genitals", V.worn.genitals, "integrity_max");
			}
		}
		if (V.earSlime.forcedDressing) {
			V.earSlime.forcedDressing.days--;
			if (V.earSlime.forcedDressing.days < 0) delete V.earSlime.forcedDressing;
		}
	}
}
