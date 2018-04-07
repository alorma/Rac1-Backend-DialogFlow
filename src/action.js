var util = require('util');
var rac1api = require('./rac1api');

var process = async function(request) {
  const {originalRequest, result} = request;
  const action = result.action;
 
  let answer;
  let contextOut

  console.info("Action: " + action)
  
  if (action == null) {
    answer = "I not understand that"
  } else {
    answer = await getAnswerForAction(action)
    contextOut = buildLiveContextAnswer(answer);
  }

  return contextOut;
}

var buildLiveContextAnswer = function(answer) {
  const program = answer.program
  return { 
    messages: [
      {
        platform: "google",
        imageUrl: program.images.program,
        description: program.description,
        subtitle: program.subtitle,
        title: program.title,
        type: 1
      },
      {
        type: 0,
        speech: `Esta sonando ${program.title}`,
      }
    ]
  }
}

var getAnswerForAction = async function(action) {
  let answers 
  let program
  switch(action) {
    case 'question.live' : 
      program = await rac1api.now();
      answers = [
        `Esta sonando ${program.title}`,
        `Ahora mismo suena ${program.title}`,
      ]
      break
      case 'play.live' : 
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
  'process' : process
};
