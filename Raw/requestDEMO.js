// npm install request <- request package
// import request => js file 
let req=require("request");
// npm install cheerio
let cheerio=require("cheerio");
// preinstalled
let fs=require("fs");
const { SSL_OP_NO_TLSv1_2 } = require("constants");
// input => url , fn
req(" https://www.espncricinfo.com/series/8048/scorecard/1237178/royal-challengers-bangalore-vs-sunrisers-hyderabad-eliminator-indian-premier-league-2020-21", requestkAns);
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

    let tabelElement = sTool("div.card.content-block.match-scorecard-table");
    console.log(tabelElement.length);
    let Inninghtml="";
    for( let i=0;i<2; i++ ){
        let cInning= sTool(tabelElement[i]).html();
        Inninghtml+=cInning;
        console.log("''''''''''''''''");

    }
    fs.writeFileSync("innings.html", Inninghtml);

}
 