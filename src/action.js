var util = require('util');
var rac1api = require('./rac1api');

var process = async function (request) {
  const { originalRequest, result } = request;
  const action = result.action;

  let answer;
  let contextOut

  if (action == null) {
    answer = "I not understand that"
  } else {
    answer = await getAnswerForAction(action)
    contextOut = buildLiveContextAnswer(answer);
  }

  return contextOut;
}

var buildLiveContextAnswer = function (answer) {
  const program = answer.program
  return {
    speech: "this text is spoken out loud if the platform supports voice interactions",
    displayText: "this text is displayed visually",
    messages: {
      type: 1,
      title: "card title",
      subtitle: "card text",
      imageUrl: "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png"
    },
    data: {
      google: {
        expectUserResponse: true,
        richResponse: {
          items: [
            {
              simpleResponse: {
                textToSpeech: program.title
              }
            },
            {
              basicCard: {
                title: program.title,
                subtitle: program.subtitle,
                formattedText: program.description,
                image: {
                  url: program.images.share,
                  accessibilityText: program.title
              },
              }
            }
          ],
          suggestions: [
            {
              title: 'reproduir'
            }
          ]
        }
      }
    },
    contextOut: [
      {
        name: "live",
        lifespan: 5,
        parameters: {
          programId: program.id,
          programName: program.title
        }
      }
    ]
  }
}

var getAnswerForAction = async function (action) {
  let answers
  let program
  switch (action) {
    case 'question.live':
      program = await rac1api.now();
      answers = [
        `Esta sonando ${program.title}`,
        `Ahora mismo suena ${program.title}`,
      ]
      break
    case 'play.live':
      program = await rac1api.now();
      answers = [
        `De acuerdo, reproduciendo, ${program.title}`
      ]
      break
    default:
      answers = [
        `I don't know this`
      ]
  }
  return {
    program: program,
    text: pickupRandomPhrase(answers)
  }
}


var pickupRandomPhrase = function (array) {
  return array[Math.floor(Math.random() * Array.length)]
}

module.exports = {
  'process': process
};
