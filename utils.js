const questions = require('./questions.json');
const { Random } = require('random-js');

const getRandomQuestion = (topic) => {
  const random = new Random();

  let questionTopic = topic.toLowerCase();

  if (questionTopic === 'random') {
    questionTopic =
      Object.keys(questions)[
        random.integer(0, Object.keys(questions).length - 1)
      ];
  }
  if (questionTopic === 'typescript') {
    questionTopic =
      Object.keys(questions)[
        Object.keys(questions).length - 1
      ];
  }

  const randomQuestionIndex = random.integer(
    0,
    questions[questionTopic].length - 1,
  );

  return {
    question: questions[questionTopic][randomQuestionIndex],
    questionTopic,
  };
};

const getCorrectAnswer = (topic, id) => {
  const question = questions[topic].find((question) => question.id === id);

  if (!question.hasOptions) {
    return question.answer;
  }

  return question.options.find((option) => option.isCorrect).text;
};

module.exports = { getRandomQuestion, getCorrectAnswer };
