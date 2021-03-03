const express = require('express');
const bodyParser = require('body-parser');
const datasource = require('purobot-datasource');
const en = require('./texts/en.json')
const fr = require('./texts/fr.json')
//const datasource = require('../purobot-datasource/index.js')

const app = express();
app.use(bodyParser.json());

app.post('/matches', function (req, res) {
    str = JSON.stringify(req.body, null, 4);
    //console.log(str);
    let message = '';
    if (req.body.nlp.entities.wrestler) {
        //For the moment we are just taking one wrestler in param
        let match = datasource.getMatchByWrestler(req.body.nlp.entities.wrestler[0].value);
        message = getMessage(match, req.body.nlp.language);
    } else {
        let match = datasource.getRandomMatch();
        message = getMessage(match, req.body.nlp.language);
    }
    sendMessage(res, message);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(`App is listening on port ${PORT}`);
});

function getMessage(match, language) {
    let texts = language === 'fr' ? fr : en;
    let message = `${texts.presentMatch}\n${match.match}\n${match.date}\n`;
    if (match.other_data) {
        message += `${match.other_data}\n`;
    }
    message += `\n${match.link_jp}\n`;
    if (match.link_en) {
        message += `\n${texts.enAvailable} ${match.link_en}`
    }
    return message;
}

function sendMessage(res, message) {
    res.send({
        replies: [{
            type: 'text',
            content: message,
        }],
        conversation: {
        }
    })
}
