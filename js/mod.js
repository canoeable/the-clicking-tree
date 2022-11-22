let modInfo = {
	name: "The Clicking Tree",
	id: "theclickingtreeofficialregisteredsign",
	author: "not_h4re",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "The Clicks",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Game was made.<br>
		- Endgame: Completed 'No Prestige' challenge<br>
		- Probably poorly balanced<br>
		- Tip: buy are before names<br>
		- My first public mod!`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

function D(x) {
	return new Decimal(x)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	clicks: D(0),
	clickpower: D(1),
	cpdecay: D(0.05),
	maxcp: D(1),
	canfillcp: false,
	cgcf: true,
}}

// Display extra things at the top of the page
var displayThings = [ function() {if(inChallenge('p', 11)) return "You are "+format(player.points.log10().div(D(3.33e7).log(10)).mul(100).max(0).min(100))+"% to completion of the challenge"}, 
function() {if(player.p.unlocked) "Prestige points boost their requirement"}
]

// Determines when the game "ends"
function isEndgame() {
	return hasChallenge('p', 11)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

function clickPowerFillable(x) {
	let can = true
	let req = D(1)
	if(hasUpgrade('b', 15)) req = calcMaxCP().mul(0.05)
	if(hasUpgrade('b', 17)) req = calcMaxCP().mul(0.125)
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) req = req.mul(upgradeEffect('p', 21))}
	if(player.clickpower.gte(req)) can = false
	if(inChallenge('p', 11)) can = true
	if(x==0)return can
	if(x==1)return req
}

function getPointMul() {
	let base = D(1)
	base = base.mul(player.clickpower)
	if(hasUpgrade('b', 13)) base = base.mul(upgradeEffect('b', 13))
	base = base.mul(calcAchMult())
	if(hasUpgrade('b', 32)) base = base.mul(5)
	if(hasUpgrade('b', 33)) base = base.mul(3)
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 11)) base = base.mul(3.33333)}
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 12)) base = base.add(0.000000000000000001)}
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) base = base.mul(upgradeEffect('p', 21))}
	return base
}

function clickPowerDecay() {
	let base = D(0.05)
	if(inChallenge('p', 11)) base = D(0)
	return base
}

function onButtonClick(x) {
	mult = D(x)
	player.points = player.points.add(getPointMul().mul(mult))
	player.clickpower = player.clickpower.mul(D(1).sub(clickPowerDecay()).pow(mult))
	player.clicks = player.clicks.add(D(1).mul(mult))
}

function calcMaxCP() {
	let base = D(1)
	if(hasUpgrade('b', 11)) base = base.add(2)
	if(hasUpgrade('b', 14)) base = D(20)
	if(hasUpgrade('b', 31)) base = base.pow(1.15)
	if(hasUpgrade('b', 15)) base = base.mul(upgradeEffect('b', 15))
	if(hasUpgrade('b', 21)) base = base.mul(upgradeEffect('b', 21))
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) base = base.mul(upgradeEffect('p', 21))}
	return base
}

function calcAutoPerSec() {
	let base = D(0.01)
	if(hasUpgrade('b', 12)) base = base.mul(4)
	if(hasUpgrade('b', 16)) base = base.mul(5)
	if(hasUpgrade('b', 22)) base = base.mul(5)
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 13)) base = base.mul(upgradeEffect('p', 13))}
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) base = base.mul(upgradeEffect('p', 21))}
	return base
}

function calcHoldPerSec() {
	let base = D(0)
	if(hasUpgrade('b', 14)) base = base.add(2)
	if(hasUpgrade('b', 16)) base = base.add(1)
	if(hasUpgrade('b', 22)) base = base.add(2)
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) base = base.mul(upgradeEffect('p', 21))}
	return base
}

function calcRegenCP() {
	let base = D(0)
	if(hasUpgrade('b', 23)) base = base.add(5)
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 14)) base = base.mul(upgradeEffect('p', 14))}
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) base = base.mul(upgradeEffect('p', 21))}
	return base
}

function calcAchMult() {
	let base = D(1)
	if(hasAchievement('b', 11)) base = D(1.1)
	if(hasAchievement('b', 12)) base = D(1.21)
	if(hasAchievement('b', 13)) base = D(1.325)
	if(hasAchievement('b', 14)) base = D(1.733)
	if(hasAchievement('b', 15)) base = D(2.542)
	if(hasAchievement('b', 16)) base = D(3.235)
	if(hasAchievement('b', 17)) base = D(4.083)
	if(hasAchievement('b', 18)) base = D(4.947)
	if(hasAchievement('b', 19)) base = D(6)
	if(!hasUpgrade('b', 24)) base = D(1)
	if(!inChallenge('p', 11)) {if(hasUpgrade('p', 21)) base = base.mul(upgradeEffect('p', 21))}
	return base
}