const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');

//firebase initialize
var config = {
  apiKey: "AIzaSyCv4o01sEGSFPj6q5WglthKYF2_p_60Qkg",
  authDomain: "line-bot-c1670.firebaseapp.com",
  databaseURL: "https://line-bot-c1670.firebaseio.com",
  projectId: "line-bot-c1670",
  storageBucket: "line-bot-c1670.appspot.com",
  messagingSenderId: "369577845897"
};
firebase.initializeApp(config);
const bot = linebot({
  channelId: "1511273166",
  channelSecret: "1e292d52e597d4ece66b0e6a3a553f53",
  channelAccessToken: "wpiByFfMb6rXbEG9X2kM2vo6XH8Et2N1EfH6up/4DVEnfbGiiEuAYBSIVMzKi38R62i62M3ImCK3OofegCvu55gVQ3q+CoSVaEamgtgTCvQKxiFgY7STL9jZk02/Sx4JS6FFEu4UqYV7RKZWMOhGlwdB04t89/1O/w1cDnyilFU=",
});

// bot.on('follow', async function(event) {
//   try {
//     var profile = await event.source.profile();
//     var user = await test(profile);
//   } catch (err) {
//     console.log(err)
//   }
//   let postsRef = firebase.database().ref('line/user').child(profile.userId);
//   if(!user){
//     postsRef.update({
//       step: 'Q0'
//     });
//     event.reply({
//       type: 'template',
//       altText: 'Please Answer the following question',
//       template: {
//         type: 'confirm',
//         text: 'Do you have a car?',
//         actions: [{
//           type: 'message',
//           label: 'Yes',
//           text: 'Q0:yes'
//         }, {
//           type: 'message',
//           label: 'No',
//           text: 'Q0:no'
//         }]
//       }
//     });
//   }
// });

const confirmtemplate = (event, qcode, question, answer) => {
  event.reply({
    type: 'template',
    altText: 'Please Confirm your Information',
    template: {
      type: 'confirm',
      text: `${question} ${answer}`,
      actions: [{
        type: 'message',
        label: 'Yes',
        text: `${qcode}:${answer}`
      }, {
        type: 'message',
        label: 'No',
        text: `${qcode}:no`
      }]
    }
  });
}
const test = (profile) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('line/user').child(profile.userId).once("value", function(data) {
      console.log('1:',data.val(),data.getKey())
      resolve(data.val(),data.getKey())
    })
  });
}
bot.on('message', function(event) {
  const GreetingMsg = "Welcome to App"
  const question = ['Do you have a car?', 'What is your name? (e.g. Ms.Mari Ponboon)', 'What is your nick name? (e.g. Mike)', 'What is your student ID? (e.g. 5622771234)', 'carbrand', 'color', 'vehicle']
  const confirm = ['', 'Your name is', 'Your nick name is', 'Your student ID is', 'carbr', 'colo', 'vehi']

  event.source.profile().then((profile)=>{
    return test(profile).then((user,userId)=>{
      console.log('2:',user,userId)
      const postsRef = firebase.database().ref('line/user').child(userId);
      const reply = (text) => event.reply(text)
        if(!user){
          postsRef.update({
            step: 'Q0'
          });
          event.reply({
            type: 'template',
            altText: 'Please Answer the following question',
            template: {
              type: 'confirm',
              text: 'Do you have a car?',
              actions: [{
                type: 'message',
                label: 'Yes',
                text: 'Q0:yes'
              }, {
                type: 'message',
                label: 'No',
                text: 'Q0:no'
              }]
            }
          });
        }
        if (user.step) {
          //answering question
          if (event.message.text.match(/Q[0-9]/i)) {
            let msg = event.message.text.split(':')[1]
            if (event.message.text[1] && event.message.text[1].length > 0) {
              switch (event.message.text[1]) {
                case '0':
                  {
                    if (msg == "yes") {
                      postsRef.update({
                        hascar: true,
                        step: 'Q1'
                      });
                    } else {
                      postsRef.update({
                        hascar: false,
                        step: 'Q1'
                      });
                    }
                    reply(question[parseInt(event.message.text[1]) + 1])
                    break
                  }
                case '1':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        name: msg,
                        step: 'Q2'
                      })
                      reply(question[parseInt(event.message.text[1]) + 1])
                    } else {
                      reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }
                case '2':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        nickname: msg,
                        step: 'Q3'
                      })
                      reply(question[parseInt(event.message.text[1]) + 1])
                    } else {
                      reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }
                case '3':
                  {
                    if (msg != "no") {
                      if (user.hascar) {
                        postsRef.update({
                          studentid: msg,
                          step: 'Q4'
                        })
                        reply(question[parseInt(event.message.text[1]) + 1])
                      } else {
                        postsRef.update({
                          studentid: msg,
                          step: null
                        })
                        reply(`Please type your Line ID:`)
                      }
                    } else {
                      reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }
                case '4':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        carbrand: msg,
                        step: 'Q5'
                      })
                      reply(question[parseInt(event.message.text[1]) + 1])
                    } else {
                      reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }
                case '5':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        carcolor: msg,
                        step: 'Q6'
                      })
                      reply(question[parseInt(event.message.text[1]) + 1])
                    } else {
                      reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }
                case '6':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        carcode: msg,
                        step: null
                      })
                      reply(`Please type your Line ID:`)
                    } else {
                      reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }

              }
            }
          } else {
            if(user.step=='Q0'){
              event.reply({
                type: 'template',
                altText: 'Please Answer the following question',
                template: {
                  type: 'confirm',
                  text: 'Do you have a car?',
                  actions: [{
                    type: 'message',
                    label: 'Yes',
                    text: 'Q0:yes'
                  }, {
                    type: 'message',
                    label: 'No',
                    text: 'Q0:no'
                  }]
                }
              });
            }else{
            confirmtemplate(event, user.step, confirm[user.step[1]], event.message.text)
          }
          }
        } else {
          if (!user.lineid) {
            //no line id
            if (event.message.text.match(/lineid/i) && event.message.text.split(':')[1].length > 0) {
              if (event.message.text.split(':')[1] != 'no') {
                postsRef.update({
                  lineid: event.message.text.split(':')[1]
                });
                reply(GreetingMsg)
              } else {
                reply(`Please type your Line ID:`)
              }
            } else {
              confirmtemplate(event, 'lineid', 'Your Line ID is', event.message.text)
            }
          }else{
            //completed register
            bot.push('Ue89cc6d57ead96006d38a18c1f88b85b',event.message.text)
            reply("SENT")
          }
        }
      // return user
    })
  }).catch(err=>console.log(err));

  // try {
  //   var profile = await event.source.profile();
  //   var user = await test(profile);
  // } catch (err) {
  //   console.log(err)
  // }



});

bot.listen('/linewebhook', process.env.PORT || 80, function() {
  console.log('LineBot is running.');
});
