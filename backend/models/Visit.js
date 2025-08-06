const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "logs", "visits.json");

function logVisit(data) {
    const logs = fs.existsSync(logFile)
        ? JSON.parse(fs.readFileSync(logFile))
        : [];

    logs.push(data);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

function getVisits() {
    if (!fs.existsSync(logFile)) return [];
    return JSON.parse(fs.readFileSync(logFile));
}

module.exports = { logVisit, getVisits };