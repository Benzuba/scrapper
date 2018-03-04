// VARIABLES ====================================

const rp = require('request-promise');
const cheerio = require('cheerio'); //Jquery for node
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

let links = []; //array to store links of 8 shirts
let shirts = []; //array to store  8 shirts



// CREATE DIRECTORY ============================
if (fs.existsSync('./data')){
}else {
  fs.mkdirSync('./data');
};

// SRCRAPE SHIRTS FOR MIKE ====================
let options = {
  uri: 'http://shirts4mike.com/shirts.php',
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options) //
  .then(function ($){
      $('.products li a').each(function(){
        let link = 'http://shirts4mike.com/' + $(this).attr('href');
        links.push(link); //build up array of shirt links
      }); //.each loop
      for(i = 0; i < links.length; i++){ //beginning of loop to crawl into each tshirt link
        let link_options = {
          uri: links[i],
          transform: function (body) {
            return cheerio.load(body);
          },
          index: i // store index of links to pass into second promise crawl
        };// end link_options declaration

        rp(link_options)
          .then(function ($){
                let j = link_options.index; //index passed into link_optinos per for loopo
                shirts[j] = {};
                shirts[j]['title'] = $('.breadcrumb').text().slice(9);
                shirts[j]['price'] = $('h1 span').text();
                shirts[j]['image'] = $('img').attr('src');
                shirts[j]['link'] = (link_options.uri);
                shirts[j]['time'] = (new Date());

          })
          .catch(function (err) {
              console.log("something went wrong in the second crawl")
          })
// CREATE CSV WRITE TO FILE ===============================
          .finally(function(){
            if (shirts.length === links.length){
            const Json2csvParser = require('json2csv').Parser;
            const fields = ['title', 'price', 'image', 'link', 'time'];
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(shirts);
            const date = new Date()
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            fs.writeFile('./data/'+year+ '-'+month+'-'+day+'.csv', csv);
          }
          })
      }; //end for loop
})
  .catch(function (err){
    console.log("sonething went wrong in the in the first crawl");
  })
