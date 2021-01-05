addLayer("p", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		antimatter: new Decimal(0),
		first: new Decimal(0)
    }},
	update(diff){
		let antimatterGain = new Decimal(diff).div(10)
		let secondaryGain = new Decimal(1.01)
		if(player.p.points.gte(1)) secondaryGain = secondaryGain.sub(1).div(layers.p.effect2()).add(1)
		if(hasUpgrade("p", 11)) {antimatterGain = antimatterGain.mul(2)
								 secondaryGain = secondaryGain.sub(1).mul(2).add(1)}
		if(hasUpgrade("p", 12)) {antimatterGain = antimatterGain.mul(2.5)}
		if(hasUpgrade("p", 14)) {secondaryGain = secondaryGain.pow(3)}
		if(hasUpgrade("p", 15)) {antimatterGain = antimatterGain.mul(upgradeEffect("p", 15))}
		if(hasUpgrade("p", 21)) {antimatterGain = antimatterGain.mul(upgradeEffect("p", 21))
								 secondaryGain = secondaryGain.sub(1).mul(upgradeEffect("p", 21)).add(1)}
		if(hasUpgrade("p", 23)) {antimatterGain = antimatterGain.mul(upgradeEffect("p", 23))}
		if(hasUpgrade("p", 24) && player.points.gte(10240)) antimatterGain = antimatterGain.mul(upgradeEffect("p", 24))
		if(player.points.gte(10) || player.p.antimatter.gt(0)) player.p.antimatter = player.p.antimatter.add(antimatterGain).mul(secondaryGain)
		if(player.p.antimatter.gte(player.points)) {player.p.points = player.p.points.add(tmp[this.layer].resetGain)
		                                            player.points = new Decimal(0)
													player.p.antimatter = new Decimal(0)
													player.p.first = new Decimal(1)}
	},
	tabFormat() {if(hasUpgrade("p", 25)) return ["main-display", "prestige-button", "upgrades"]
	             else return ["main-display", "upgrades"]},
    color: "#7DC7FB",                       // The color for this layer, which affects many elements.
	symbol: "P",
	position: 0,
    resource: "paradoxes",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
	effect() {return new Decimal(1.1).pow(player.p.points)},
	effect2() {let eff2 = new Decimal(1.1).pow(player.p.points)
			   if(hasUpgrade("p", 22)) eff2 = eff2.root(3)
			   return eff2},
	effectDescription() {return "boosting matter gain by x"+format(this.effect())+", but weakening antimatter's self-growth by /"+format(this.effect2())+". You have "+formatWhole(player.p.upgrades.length)+" paradox upgrades, cheapening your paradox upgrades by "+format(player.p.upgrades.length)+" paradoxes"},
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.1,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
		return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return player.p.points.gte(1) || player.p.first.gte(1) || player.t.first >= 1 },            // Returns a bool for if this layer's node should be visible in the tree
	
	upgrades:{
		rows: 4,
		cols: 5,
		11: {
			title: "Time Acceleration",
			description: "Time speed is multiplied by 2x",
			cost: new Decimal(1)
		},
		12: {
			title: "Antimatter Booster",
			description: "Boosts antimatter gain by 2.5x",
			cost() {return new Decimal(3).sub(player.p.upgrades.length).max(1)},
		},
		13: {
			title: "Matter Booster",
			description: "Boosts matter gain by 3x up until 10 matters, then nerfs it by 0.33x",
			cost() {return new Decimal(6).sub(player.p.upgrades.length).max(1)},
		},
		14: {
			title: "Anti-Self Boost",
			description: "Antimatter's self growth is cubed.",
			cost() {return new Decimal(10).sub(player.p.upgrades.length).max(1)},
		},
		15: {
			title: "Paradoxical Boost",
			description: "Matter boosts antimatter gain",
			cost() {return new Decimal(15).sub(player.p.upgrades.length).max(1)},
			effect() {return player.points.add(1).log(2)},
			effectDisplay() {return "x"+format(this.effect())}
		},
		21: {
			title: "Time Acceleration",
			description: "Time speed is multiplied based on how long you've played",
			cost() {return new Decimal(23).sub(player.p.upgrades.length).max(1)},
			effect() {return new Decimal(player.timePlayed).log(17)},
			effectDisplay() {return "x"+format(this.effect())},
			unlocked() {return hasUpgrade("p", 15) || player.t.first >= 1}
		},
		22: {
			title: "",
			description: "Paradox's second effect is cube rooted",
			cost() {return new Decimal(35).sub(player.p.upgrades.length).max(1)},
			unlocked() {return hasUpgrade("p", 15) || player.t.first >= 1}
		},
		23: {
			title: "Forbidden Dimension",
			description: "Antimatter boosts it's own gain",
			cost() {return new Decimal(53).sub(player.p.upgrades.length).max(1)},
			effect() {return player.p.antimatter.add(1).log(1.2).max(1)},
			effectDisplay() {return "x"+format(this.effect())},
			unlocked() {return hasUpgrade("p", 15) || player.t.first >= 1}
		},
		24: {
			title: "YOU CAN GET 2 PARADOXES!?!",
			description: "Antimatter gain is increased by matter's magnitude whenever matter is/over 10,240",
			cost() {return new Decimal(80).sub(player.p.upgrades.length).max(1)},
			effect() {return new Decimal(2).pow(player.points.e)},
			effectDisplay() {return "x"+format(this.effect())},
			unlocked() {return hasUpgrade("p", 15) || player.t.first >= 1}
		},
		25: {
			title: "Time Control",
			description: "You can prestige manually",
			cost() {return new Decimal(120).sub(player.p.upgrades.length).max(1)},
			onPurchase() {player.t.first += 1},
			unlocked() {return hasUpgrade("p", 15) || player.t.first >= 1}
		}
	},
	hotkeys: [
		{ key: "p", description: "P: Paradox Reset (Requires 10th upgrade)", onPress() { if(hasUpgrade("p", 25)) doReset(this.layer); } },
	],	
})

addLayer("t", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
		first: new Decimal(0)
		}},
    color: "#C18828",                       // The color for this layer, which affects many elements.
	symbol: "T",
	position: 0,
    resource: "challenge points",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "paradoxes",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.
    requires() {if(player.t.points.gte(1)) return new Decimal(Infinity)
				else return new Decimal(500)},              // The amount of the base needed to  gain 1 of the prestige currency.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.1,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
		return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return hasUpgrade("p", 25) || player.t.first >= 1 },            // Returns a bool for if this layer's node should be visible in the tree
	branches: ["p"],
	tooltip() {return "Trilemma"},
})