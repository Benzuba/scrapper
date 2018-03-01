const rp = require('request-promise');
const cheerio = require('cheerio'); //Jquery for node

var options = {
  uri: 'http://shirts4mike.com/shirts.php',
  transform: function (body) {
    return cheerio.load(body);
  }
};

let links = []; //array to store links of 8 shirts
rp(options)
  .then(function ($){
      $('.products li a').each(function(){
        let link = 'http://shirts4mike.com/' + $(this).attr('href');
        links.push(link);
      }); //.each loop
      for(i = 0; i < links.length; i++){ //beginning of loop to crawl into each tshirt link
        console.log(links[i]);
      }; //end for loop 


}) // close .then
  .catch(function (err){
    console.log(err);//crawling failed or cheerio joked
  });
