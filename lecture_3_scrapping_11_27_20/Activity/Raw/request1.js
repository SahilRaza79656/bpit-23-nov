// npm install request <- request package
// import request => js file 
let request=require("request");
// npm install cheerio
let cheerio=require("cheerio");
let path=require("path");
let xlsx=require("xlsx");
let fs=require("fs");// preinstalled
const { SSL_OP_NO_TLSv1_2 } = require("constants");
 
// input => url , fn
 // AllMatch URL 
request("https://www.espncricinfo.com/series/_/id/8048/season/2020/indian-premier-league",MainMatchCb)
function MainMatchCb(err,res,html){
    let sTool= cheerio.load(html);
    let allmatchPageUrl=  sTool("a[data-hover='View All Results']").attr("href");
    let fUrl="https://www.espncricinfo.com"+allmatchPageUrl;
    AllMatchPage(fUrl);
}
function AllMatchPage(fUrl){
    request (fUrl,getAMUrl);
function getAMUrl(err, res, html){
    let sTool= cheerio.load(html);
    let allmatchUrlElement=sTool("a[data-hover='Scorecard']");
    for( let i=0;i<allmatchUrlElement.length;i++){
        let href= sTool(allmatchUrlElement[i]).attr("href");
        let fUrl="https://www.espncricinfo.com"+href;
        finddataofAMatch(fUrl);
    }
}

function finddataofAMatch(url){
request(url, requestkAns);
// callback function
function requestkAns(err, res, html){
//    console.log(err);// prints error if any
//    console.log(res.statusCode);// only for machine
//     console.log(html);//data is present here
    // if(err){
    //     console.log("some error", err);
    // }
    // else{
    //     // data -> scrap
    //     console.log(html);

    // }
    console.log("recieved html");
    // create file => content
    fs.writeFileSync("abc.html", html);
    
    let sTool = cheerio.load(html);
    // let resultElement=sTool(" div.desc.text-truncate");
    // console.log(resultElement.text());

    let tabelElement = sTool("div.card.content-block.match-scorecard-table .Collapsible");
    console.log(tabelElement.length);
    // let Inninghtml="<table>";
    let count=0;
    for( let i=0;i<tabelElement.length; i++ ){
       let teamName= sTool(tabelElement[i]).find("h5.header-title.label").text();
       let rowsofATeam=sTool(tabelElement[i]).find(".table.batsman").find("tbody tr");
       // [Royal Challengers Banglore, ( 20 overs maximum)]
       // [Royal Challengers Bangalore , (20 overs maximum)]
       let teamStrArr= teamName.split("Innings");
       teamName=teamStrArr[0].trim();
        console.log(teamName);

       for(let j=0;j<rowsofATeam.length; j++){
           let rCols=sTool(rowsofATeam[j]).find("td");
           let isBatsmanRow= sTool(rCols[0]).hasClass("batsman-cell");
           if( isBatsmanRow==true){
  count++;
           let pName=sTool(rCols[0]).text().trim();
           let runs=sTool(rCols[2]).text().trim();
           let balls=sTool(rCols[3]).text().trim();
           let fours=sTool(rCols[5]).text().trim();
           let sixes=sTool(rCols[6]).text().trim();
           let sr=sTool(rCols[7]).text().trim();
           //console.log(`Name: ${pName} Runs: ${runs} Balls: ${balls} Fours: ${fours} Sixes: ${sixes} Sr: ${sr}`);
           processPlayer(teamName, pName, runs, balls, fours, sixes, sr);
           }
       }
        // let cInning= sTool(tabelElement[1]).html();
        // Inninghtml+=cInning;
        console.log("'''''''''''''''''''");
        console.log("No of batsmen in a Team", count);
        console.log(teamName);
        console.log("'''''''''''''''''''")
        count=0;
    }
    // fs.writeFileSync("innings.html", Inninghtml);
// console.log("No of batsmen in a Team", count);
// console.log(teamName);
// count=0;
}
} 
function processPlayer(team,name,runs,balls,fours,sixes,sr){
let dirPath=team;
let pMatchStats={
    Team:team,
    Name:name,
    Runs:runs,
    Balls:balls,
    Fours:fours,
    Sixes:sixes,
    Sr:sr
}
if (fs.existsSync(dirPath)){

}else{
    fs.mkdirSync(dirPath);
}
let playerFilepath= path.join(dirPath,name+".xlsx");
let pData=[];
if(fs.existsSync(playerFilepath)){
    pData=excelReader(playerFilepath, name );
    pData.push(pMatchStats);
}else{
    console.log("File of player", playerFilepath,"created");
    pData=[pMatchStats];
}
 excelWriter(playerFilepath,pData, name);
}}
function excelReader(filePath, name){
    if(!fs.existsSync(filePath)){
        return null;
    }else{
        let wt=xlsx.readFile(filePath);
        let excelData = wt.Sheets[name];
        let ans = xlsx.utils.sheet_to_json(excelData);
        return ans;
    }
}
function excelWriter(filePath, json, name){
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, name);
    xlsx.writeFile(newWB, filePath);
}