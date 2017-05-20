const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const moment = require('moment-shortformat');

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
  channelId: "1485947520",
  channelSecret: "aecb64016ab41c179f0b31f8859fcdfe",
  channelAccessToken: "r6RJIufV4VqrvXoCUH9+URr4r0hlxp0YMIONbgN9EIbJs0afiXswzXb7wnFEHVyt6QiK4sYfuN5ICtoASmba25wkSLNwVaNV5PSePj2rDknU5mf0sOa/8vEqn/nt3MuqHaGjtmWLwnxsVd+kRxGVkAdB04t89/1O/w1cDnyilFU=",
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

const menuquestion = (event,qcode,title,text,answer,mode=0,match=[]) =>{
  let ans = []
  if(mode){
  ans = answer.map((answer,index) =>{return {type: 'message',
  label: answer,
  text: answer=='Cancel' ? `${qcode}:no`: `${qcode}:${match[index]}`}})
}else{
  ans = answer.map((answer,index) =>{return {type: 'message',
  label: answer,
  text: `${qcode}:${index}`}})
}
  event.reply({
        type: 'template',
        altText: 'Select a menu',
        template: {
        type: 'buttons',
        title,
        text,
        actions: ans
        }
})
}

const confirmtemplate = (event, qcode, question, answer, mode=0) => {
  if(mode){
    event.reply({
      type: 'template',
      altText: 'Please Answer the Question',
      template: {
        type: 'confirm',
        text: `${question}`,
        actions: [{
          type: 'message',
          label: 'Yes',
          text: `${qcode}:yes`
        }, {
          type: 'message',
          label: 'No',
          text: `${qcode}:no`
        }]
      }
    });
  }else{
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
}
const getUser = (profile) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref('line').once("value", function(data) {
      resolve({user:data.val().user[profile.userId],userId:profile.userId,share:data.val().share,uprofile:data.val().user})
    })
  });
}
bot.on('message', function(event) {
  const GreetingMsg = "Welcome to App"
  const question = [ 'What is your name? (e.g. Ms.Mari Ponboon)', 'What is your nick name? (e.g. Mike)', 'What is your student ID? (e.g. 5622771234)', 'What is your phone number? (e.g. 0812345678)', 'Do you have a car?', 'What is your car brand? (e.g. Toyota,Honda)', 'What is your car model? (e.g. Vios,Jazz)', 'What is your car color? (e.g. White,Black)', 'How many seats are reserved?', 'What is your car registration? (e.g. 1กก1234กรุงเทพมหานคร)']
  const confirm = [ 'Your name is', 'Your nick name is', 'Your student ID is', 'Your phone number is', '', 'Your car brand is', 'Your car model is', 'Your car color is', 'Reserved seat(s) is(are)', 'Your car registration is']
  const f1 = ['Please select a campus that is your source.','Please select period of time which you arrive the source.']
  const f1ans = [['Rangsit','Bangkadi'],['15 mins','30 mins','45 mins','1 hour']]
  const f1match = [['Bangkadi','Rangsit'],[15,30,45,60]]
  const n1 = ['What is your destination?','Please select share riding']
  const n1ans = [['Rangsit','Bangkadi']]
  const c1 = ['Do you want to cancel matching?']
  event.source.profile().then((profile)=>{
    return getUser(profile).then((data)=>{
      const {user,userId,share,uprofile} = data
      const postsRef = firebase.database().ref('line/user').child(userId);
      const shareRef = firebase.database().ref('line/share');
      const postRef = firebase.database().ref('line/posts');
      const reply = (text) => event.reply(text)
        if(!user){
          postsRef.update({
            step: 'Q0'
          });
          reply(question[0])
        }
        if (user&&user.step) {
          //answering question
          if(user.step.match(/Q[0-9]/i)){
          if (event.message.text.match(/Q[0-9]/i)) {
            let msg = event.message.text.split(':')[1]
            if (event.message.text[1] && event.message.text[1].length > 0) {
              switch (event.message.text[1]) {
                  case '0':
                    {
                      if (msg != "no") {
                        postsRef.update({
                          name: msg,
                          step: `Q${parseInt(event.message.text[1])+1}`
                        })
                        reply(question[parseInt(event.message.text[1]) + 1])
                      } else {
                        reply(question[parseInt(event.message.text[1])])
                      }
                      break
                    }
                case '1':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        nickname: msg,
                        step: `Q${parseInt(event.message.text[1])+1}`
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
                          studentid: msg,
                          step: `Q${parseInt(event.message.text[1])+1}`
                        })
                        reply(question[parseInt(event.message.text[1]) + 1])
                      } else {
                        reply(question[parseInt(event.message.text[1])])
                      }
                      break
                    }
                /*case '2':
                  {
                    if (msg != "no") {
                      if (user.hascar) {
                        postsRef.update({
                          studentid: msg,
                          step: `Q${parseInt(event.message.text[1])+1}`
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
                  }*/
                case '3':
                    {
                      if (msg != "no") {
                        postsRef.update({
                          phonenum: msg,
                          step: `Q${parseInt(event.message.text[1])+1}`
                        })
                        confirmtemplate(event, `Q${parseInt(user.step[1])+1}`, question[parseInt(user.step[1])+1], event.message.text,1);
                      } else {
                        reply(question[parseInt(event.message.text[1])])
                      }
                      break
                    }
                case '4':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        hascar: true,
                        step: `Q${parseInt(event.message.text[1])+1}`
                      })
                      reply(question[parseInt(event.message.text[1]) + 1])
                    } else {
                      postsRef.update({
                        hascar: false,
                        step: null
                      })
                      //reply(question[parseInt(event.message.text[1])])
                    }
                    break
                  }
                case '5':
                  {
                    if (msg != "no") {
                      postsRef.update({
                        carbrand: msg,
                        step: `Q${parseInt(event.message.text[1])+1}`
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
                          carmodel: msg,
                          step: `Q${parseInt(event.message.text[1])+1}`
                        })
                        reply(question[parseInt(event.message.text[1]) + 1])
                      } else {
                        reply(question[parseInt(event.message.text[1])])
                      }
                      break
                    }
                  case '7':
                    {
                      if (msg != "no") {
                        postsRef.update({
                          carcolor: msg,
                          step: `Q${parseInt(event.message.text[1])+1}`
                        })
                        reply(question[parseInt(event.message.text[1]) + 1])
                      } else {
                        reply(question[parseInt(event.message.text[1])])
                      }
                      break
                    }
                    case '8':
                      {
                        if (msg != "no") {
                          postsRef.update({
                            seat: msg,
                            step: `Q${parseInt(event.message.text[1])+1}`
                          })
                          reply(question[parseInt(event.message.text[1]) + 1])
                        } else {
                          reply(question[parseInt(event.message.text[1])])
                        }
                        break
                      }
                    case '9':
                      {
                        if (msg != "no") {
                          postsRef.update({
                            carregistration: msg,
                            step: null
                          })
                          reply(`Your registration is completed`)
                        } else {
                          reply(question[parseInt(event.message.text[1])])
                        }
                        break
                      }

              }
            }
          } else {
            confirmtemplate(event, user.step, confirm[user.step[1]], event.message.text)
          }
        }else if(user.step.match(/N[0-9]/i)){
        if (event.message.text.match(/N[0-9]/i)) {
          let msg = event.message.text.split(':')[1]
          if (event.message.text[1] && event.message.text[1].length > 0) {
            switch (event.message.text[1]) {
                case '0':
                  {
                      postsRef.update({
                        temp: { destination: n1ans[event.message.text[1]][msg]}
                      })
                      let drivers = Object.keys(share).filter((x)=> share[x].destination==n1ans[event.message.text[1]][msg])
                      if(drivers.length>0){
                        let filter = drivers.filter((x)=>{
                          return x!=userId
                        })
                        let match = []
                        let choice = filter.map((x)=>{
                          match.push(x)
                          return `${uprofile[x].nickname} ${moment(moment(share[x].timestamp) + (6e4 * share[x].time)).short(false, moment())}`
                        });
                        choice.push('Cancel')
                        menuquestion(event,`N${parseInt(user.step[1])+1}`,'Question',n1[parseInt(user.step[1])+1],choice,1,match)
                      }else{
                        postsRef.update({
                          step: null,
                          temp: null
                        });
                        reply('Sorry, nobody is sharing right now');
                      }
                    break
                  }
                  case '1':
                    {
                      if(msg!='no'){

                      let newshareRef = shareRef.child(`${msg}/match`).push()
                      let refid = newshareRef.key
                      newshareRef.set(
                        userId
                      )
                      postsRef.update({
                        step: null,
                        temp: null,
                        matchedwith: msg,
                        matchedkey: refid
                      })
                      bot.push(msg,`${user.nickname} wants to go with you`)
                      bot.push(userId,`${uprofile[msg].nickname} is your driver, here is his/her car information: brand: ${uprofile[msg].carbrand}, color: ${uprofile[msg].carcolor}, model: ${uprofile[msg].carmodel}, license plate: ${uprofile[msg].carregistration}, Meeting time: ${moment(moment(share[msg].timestamp) + (6e4 * share[msg].time)) .format("hh:mm A")}`)
                      reply('Matching is completed')
                      //confirmtemplate(event, `F${parseInt(user.step[1])+1}`, `Source: ${user.temp.source} in next ${f1ans[event.message.text[1]][msg]}, Destination: ${user.temp.destination}`,'',1)
                    }else{
                      postsRef.update({
                        step: null,
                        temp: null
                      });
                      reply('Type again to select a menu');
                    }
                      break
                    }
                }
          }
        }else{
          menuquestion(event,'N0','Question',n1[0],n1ans[0])
        }
        }else if(user.step.match(/F[0-9]/i)){
        if (event.message.text.match(/F[0-9]/i)) {
          let msg = event.message.text.split(':')[1]
          if (event.message.text[1] && event.message.text[1].length > 0) {
            switch (event.message.text[1]) {
                case '0':
                  {
                      postsRef.update({
                        step: `F${parseInt(event.message.text[1])+1}`,
                        temp: {source: f1ans[event.message.text[1]][msg],
                        destination: f1match[event.message.text[1]][msg]}
                      })
                      menuquestion(event,`F${parseInt(user.step[1])+1}`,'Question',f1[parseInt(user.step[1])+1],f1ans[parseInt(user.step[1])+1])
                    break
                  }
                  case '1':
                    {
                      postsRef.update({
                        step: `F${parseInt(event.message.text[1])+1}`,
                        temp: Object.assign(user.temp,{time: f1match[event.message.text[1]][msg],timestamp:firebase.database.ServerValue.TIMESTAMP})
                      })
                      confirmtemplate(event, `F${parseInt(user.step[1])+1}`, `Source: ${user.temp.source} in next ${f1ans[event.message.text[1]][msg]}, Destination: ${user.temp.destination}`,'',1)
                      break
                    }
                    case '2':
                      {
                        if(msg=="yes"){
                        postsRef.update({
                          step: null,
                          temp: null
                        })
                        shareRef.child(userId).set(user.temp)
                        reply("Your sharing is completed")
                      }else{
                        postsRef.update({
                          step: `F${parseInt(event.message.text[1])-2}`,
                        })
                        menuquestion(event,`F${parseInt(user.step[1])-2}`,'Question',f1[parseInt(user.step[1])-2],f1ans[parseInt(user.step[1])-2])
                      }
                        break
                      }
                }
          }
        }else{
          if(user.step[1]=='2'){
            postsRef.update({
              step: `F${parseInt(user.step[1])-2}`,
            })
            menuquestion(event,`F${parseInt(user.step[1])-2}`,'Question',f1[parseInt(user.step[1])-2],f1ans[parseInt(user.step[1])-2])
          }
          menuquestion(event,user.step,'Question',f1[user.step[1]],f1ans[user.step[1]])
        }
      }else if(user.step.match(/C[0-9]/i)){
        if (event.message.text.match(/C[0-9]/i)) {
          let msg = event.message.text.split(':')[1]
          if (event.message.text[1] && event.message.text[1].length > 0) {
            switch (event.message.text[1]) {
                case '0':
                  {
                    if(msg!='no'){
                      shareRef.child(`${user.matchedwith}/match`).update({
                        [user.matchedkey]: null
                      })
                      postsRef.update({
                        step:null,
                        matchedwith: null,
                        matchedkey: null
                      })
                      bot.push(user.matchedwith,`${user.nickname} has cancelled`)
                      reply('Your cancelation is completed')
                    }else{
                      postsRef.update({
                        step: null
                      })
                      reply('Type again to select a menu');
                    }
                    break
                  }

                }
          }
        }else{
          confirmtemplate(event, 'C0', c1[user.step[1]],'',1)
        }
        }
        } else {
          switch(event.message.text){
            case 'Menu1':{
                menuquestion(event,'F0','Question',f1[0],f1ans[0])
                postsRef.update({
                  step: 'F0'
                })
                break
            }
            case 'Menu2':{
              if(user.matchedwith){

                postsRef.update({
                  step: 'C0'
                })
                confirmtemplate(event, 'C0', c1[0],'',1)
              }else{
              menuquestion(event,'N0','Question',n1[0],n1ans[0])
              postsRef.update({
                step: 'N0'
              })
            }
              break
            }
            case 'Menu3':{

            }
            default: {
              event.reply({
  	type: 'template',
  	altText: 'this is a buttons template',
  	template: {
  		type: 'buttons',
  		title: 'Menu',
  		text: 'Please select',
  		actions: [{
  			type: 'message',
  			label: 'Share a ride',
  			text:'Menu1'
  		}, {
  			type: 'message',
  			label: `Find a ride`,
  			text:'Menu2'
  		}, {
  			type: 'message',
  			label: 'Edit your profile',
  			text: 'Menu3'
  		}]
  	}
  });
  break
            }
          }
        }
      // return user
    })
  }).catch(err=>console.log(err));

});

bot.listen('/linewebhook', process.env.PORT || 3000, function() {
  console.log('LineBot is running.');
});
