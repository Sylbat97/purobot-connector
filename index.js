const express = require('express');
const bodyParser = require('body-parser');
const datasource = require('purobot-datasource');
//const datasource = require('../purobot-datasource/index.js')

const app = express();
app.use(bodyParser.json());

(app);

app.post('/matches', function (req, res) {
    console.log('post')
    let message = '';
    if(req.body.nlp.entities.wrestler){
        //For the moment we are just taking one wrestler in param
        let match = datasource.getMatchByWrestler(req.body.nlp.entities.wrestler[0].value);
        message = parse(match);
    }else{
        let match = datasource.getRandomMatch();
        message = parse(match);
    }
    res.send({
        replies: [{
            type: 'text',
            content: message,
        }],
        conversation: {
        }
    })
});


const PORT = process.env.PORT || 5000;
app.listen(PORT , function () {
    console.log(`App is listening on port ${PORT}`);
});

function parse(match){
    let message = `Here is a match for you !\n${match.match}\n${match.date}\n`;
    if(match.other_data){
        message+= `${match.other_data}\n`;
    }
    message += `\n${match.link_jp}\n`;
    if(match.link_en){
        message += `Available in english: ${match.link_en}`
    }
    return message;
}