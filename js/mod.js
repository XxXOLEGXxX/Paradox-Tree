let modInfo = {
	name: "Paradox Tree",
	id: "paradox",
	author: "Holy Broly#0530",
	pointsName: "matters",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0069.420",
	name: "The Beginning.",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(player.p.points.gte(1)) gain = gain.mul(layers.p.effect())
	if(hasUpgrade("p", 11)) gain = gain.mul(2)
	if(hasUpgrade("p", 13) && player.points.gte(10)) gain = gain.div(3)
	else if(hasUpgrade("p", 13) && player.points.lt(10)) gain = gain.mul(3)
	if(hasUpgrade("p", 21)) gain = gain.mul(upgradeEffect("p", 21))
	if(gain.gte(new Decimal(2).pow(64))) gain = gain.log(player.p.points.log(10))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
function() {return "You have "+format(player.p.antimatter)+" antimatters"}
]

// Determines when the game "ends"
function isEndgame() {
	return player.t.points.gte(1)
}

// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600000) // Default is 1 hour which is just arbitrarily large
}
