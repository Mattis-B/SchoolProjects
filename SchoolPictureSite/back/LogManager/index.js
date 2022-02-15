const colors = require("colors");

module.exports = class LogManager {
  constructor(app){
    this.app = app;
  }
  getCurrentTime(){
    let date_ob = new Date();
    let date = this.IntTwoChars(date_ob.getDate());
    let month = this.IntTwoChars(date_ob.getMonth() + 1);
    let year = date_ob.getFullYear();
    let hours = this.IntTwoChars(date_ob.getHours());
    let minutes = this.IntTwoChars(date_ob.getMinutes());
    let seconds = this.IntTwoChars(date_ob.getSeconds());
    let milliseconds = this.IntThreeChars(date_ob.getMilliseconds());

    return date+"/"+month+"/"+year+" "+hours+":"+minutes+":"+seconds+":"+milliseconds;
  }
  IntTwoChars(i) {
    return (`0${i}`).slice(-2);
  }

  IntThreeChars(i) {
    return (`00${i}`).slice(-3);
  }

  Log(lmsg){
    process.stdout.write(`${colors.green("[")}${colors.brightGreen(this.getCurrentTime())}${colors.green("]")} ${colors.brightCyan(lmsg.toString())}\n`);
  }
  Error(err){
    process.stderr.write(`${colors.green("[")}${colors.brightGreen(this.getCurrentTime())}${colors.green("]")} ${colors.brightCyan(err.toString())}\n`)
  }
}
