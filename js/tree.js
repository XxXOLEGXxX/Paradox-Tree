var layoutInfo = {
    startTab: "none",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("a", {
    symbol: "a",
    branches: ["s"],
    color: '#6d3678',
    layerShown: true,
    canClick() {return player.points.gte(10)},
    tooltip: "Thanos your points",
    tooltipLocked: "Thanos your points",
    onClick() {player.points = player.points.div(2)}

}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]]
})