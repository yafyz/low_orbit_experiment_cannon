const chp = require("child_process")

var synapsePath

function findSynapse() {
    synapsePath = "C:\\Users\\fyz\\Desktop\\synmain\\bin\\xejJ65CRceYrJzC.exe"
}

function launch(rbxargs) {
    if (synapsePath == undefined)
        findSynapse()

    return chp.spawn(synapsePath, [rbxargs])
}

module.exports = {
    launch: launch
}