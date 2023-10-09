
require('dotenv').config();
const {
   Bot,
   Keyboard,
   InlineKeyboard,
   GrammyError,
   HttpError,
} = require('grammy');
const { getRandomQuestion, getCorrectAnswer } = require('./utils');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
      const startKeyboard = new Keyboard()
      .text('HTML')
      .text('CSS')
      .row()
      .text('JavaScript')
      .text('React')
      .row()
      .text('TypeScript')
      .text('Random')
      .resized();
      await ctx.reply('Hello, I am Frontend Interview Prep Bot 🤖 \n I wanna help you to preparate to front-end interview',);
      await ctx.reply('For more information use command "/info"',);
      await ctx.reply('What is gonna be fist? Pick a topic bellow ⬇️', {
      reply_markup: startKeyboard,
   });
});

bot.command('info', async (ctx) => {//additional information
      await ctx.reply(`✋Hello! I'm your Interview Preparation Bot. Here's some information about me:\n
1. Problems ❌:\n - If you have any problems or questions, feel free to contact me by email : sovikmaksim7@gmail.com.
2. About the Bot ℹ️:
   - I'm here to help you prepare for interviews.
   - You can find a variety of popular interview questions with different levels of difficulty.
   - Some questions require one correct answer, while others need more descriptive responses.
   - I provide feedback and correct answers after you input your answers.
   - Over time we will improve this bot and add more questions.
3. Ideas 💡: \n - If you have any ideas on how to make the bot better or you know any good questions that you had on the interview, feel free to share with us by email: sovikmaksim7@gmail.com
4. Source Code 👩‍💻:\n - All source code of this bot you can find on my github account: https://github.com/HulumyluU
5. Good luck ! 🍀:\n - Good luck with your interview preparations! If you have any more questions or need assistance, don't hesitate to ask.`);
});

bot.hears(//hears : get input from the user
   ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Random'],
   async (ctx) => {
      const topic = ctx.message.text.toLowerCase();
      const { question, questionTopic } = getRandomQuestion(topic);
      let inlineKeyboard;
      if (question.hasOptions) {//is question has meny options for answer 
         const buttonRows = question.options.map((option) => [
         InlineKeyboard.text(
            option.text,
            JSON.stringify({
               type: `${questionTopic}-option`,//read ctx.message.text
               isCorrect: option.isCorrect,
               questionId: question.id,//id of answer (positio in array in json file)
            }),
         ),
      ]);
      inlineKeyboard = InlineKeyboard.from(buttonRows);//give our keyboard options for answer
      } else { //question has not options to answer
         inlineKeyboard = new InlineKeyboard().text(//InlineKeyboard : create a buttons with text below the quation line
         'Get the answer',
         JSON.stringify({
            type: questionTopic,//qustion topis is ctx.message.text : what user choose (in our case html,css,js or react);
            questionId: question.id,
         }),
      );
   }
      await ctx.reply(question.text, {
         reply_markup: inlineKeyboard,
      });
   },
);

bot.on('callback_query:data', async (ctx) => {//callback-query what should bot reply, when user clicked the button
   const callbackData = JSON.parse(ctx.callbackQuery.data);

   if (!callbackData.type.includes('option')) {
      const answer = getCorrectAnswer(callbackData.type, callbackData.questionId);
      await ctx.reply(answer, {
         parse_mode: 'HTML',//add links and text as in htnl (we can click links as well)
         disable_web_page_preview: true,//disables messages from webpages
      });
      await ctx.answerCallbackQuery();
      return;
   }
   if (callbackData.isCorrect) {//if user picked the right answer
      await ctx.reply('Correct ✅');
      await ctx.answerCallbackQuery();
      return;
   }
   const answer = getCorrectAnswer(callbackData.type.split('-')[0], callbackData.questionId);
   await ctx.reply(`Not correct ❌ The correct answer is : ${answer}`);
   await ctx.answerCallbackQuery();
});

bot.catch((err) => {
   const ctx = err.ctx;
   console.error(`Error while handling update ${ctx.update.update_id}:`);
   const e = err.error;
   if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
   } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
   } else {
      console.error("Unknown error:", e);
   }
});

bot.start();






