const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
let arr = [];
const URL = 'https://www.imdb.com/search/title/?count=10&groups=top_1000&sort=user_rating';
request(URL, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.lister-item').each((i, el) => {
            let ob = {};
            // DONE Image
            ob.image = $('.lister-item-image').find('img').attr('loadlate');
            // DONE Header
            const header = $(el).find('.lister-item-header');
            ob.movieName = header.find('a').text();
            ob.movieYear = header.find('.lister-item-year').text().replace(/[{()}]/g, '');
            const details = $(el).find('.text-muted');
            ob.movieDuration = details.find('.runtime').text().slice(0, -4);;
            ob.movieGenre = details.find('.genre').text().trim();
            //DONE RATING
            ob.rating = $(el).find('.lister-item-content').find('.ratings-bar')
                .find('.ratings-imdb-rating').text().replace(/\s\s+/g, '');
            //DONE MONEY AND GROSS
            const spans = $(el).find('.sort-num_votes-visible').find('span');
            spans.each((i, ele) => {
                if ($(ele).attr('name') == 'nv') {
                    if (i == 1)
                        ob.vote = $(ele).text().replace(/,/g, "");
                    if (i == 4)
                        ob.gross = $(ele).text().slice(1, -1);
                }
            })
            arr.push(ob);
        });


        fs.writeFile("input.json", JSON.stringify(arr), function (err) {
            if (err) throw err;
            console.log('scrapping is completed');
        });
    }
});