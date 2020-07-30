const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const shuffle = require("./shuffle")
const app = new express();
const cors = require('cors');
app.use(cors({origin: "*"}));
const bcrypt = require("bcryptjs")
const userdb = require('./src/Model/user')
const jwt = require("jsonwebtoken")
const checkAuth = require('./src/MiddleWare/check-auth')
const Quiz = require('./src/Model/Quiz')
const question = require('./src/Model/Question')
const calculatePoints = require('./Points')
app.use(express.urlencoded({extended: true}))
app.use(express.static("./public"));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
/*------login------*/
app.post('/login', function (req, res) {
  console.log(req.body.email)
  userdb.find({email: req.body.email}).exec()
    .then(
      user => {
        if (user.length < 1) {
          return res.status(401).json(
            {
              message: "Auth failed user not present in database",

            }
          )
        } else {

          bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {

              return res.status(401).json({
                message: "Auth failed"
              })
            } else if (result) {

              const token = jwt.sign(
                {
                  email: user[0].email,
                  userId: user[0]._id,
                  username: `${user[0].fname} ${user[0].lname}`,

                },
                'vivekkey',
                {
                  expiresIn: '2hr'
                }
              )
              console.log("authsuccessful")
              return res.status(200).json({
                message: "Auth successful",
                redirect: true,
                token: token,
                username: user[0].fname
              })

            } else {
              return res.status(401).json({
                message: "Auth failed wrong password"
              })
            }
          })
        }
      }
    )
    .catch(
      (err => {
        console.log(err);
        res.status(500).json({
          error: err
        })
      })
    )
})
/*-------signUp---------*/
app.post('/signUp', function (req, res) {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      console.log(req.body.email);
      userdb
        .find({email: req.body.email})
        .exec()
        .then((user) => {
          console.log(user);
          if (user.length >= 1) {
            return res.status(409).json({
              message: "User with the same mail exists",
            });
          } else {
            var data = {
              fname: req.body.firstName,
              lname: req.body.lastName,
              email: req.body.email,
              password: hash
            };
            console.log(data);
            userdb(data)
              .save()
              .then(() => {
                return res.status(200).json({
                  message: "Signup successful",
                  redirect: true
                });

              });
          }
        });
    }
  });
})
/*-----------post question--------------*/
app.post('/addQuestion', checkAuth, function (req, res) {

  console.log('inside add');
  Quiz.findOne({passCode: req.body.quiz_id}).exec().then(
    (data) => {
      console.log(data)
      console.log(data._id.toString());
      const Question = mongoose.model(data._id.toString() + 'question', question);
      Question(req.body.question).save().then(
        (data) => res.status(200).json(
          {
            message: 'question added!!',
            data: data
          }
        )
      ).catch(
        (err => {
          console.log(err);
          res.status(500).json({
            error: err
          })
        })
      )
    }
  ).catch(
    (err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  )
  //step2:get object id and create collection of question with quiz id as name

  //step 3: post Question in this collection


})
/*-----------------edit question--------------*/
app.put('/editQuestion', checkAuth, function (req, res) {
  console.log('inside edit');
  console.log(req.body);
  Quiz.findOne({passCode: req.body.quiz_id}).exec().then(
    (data) => {
      console.log(data)
      console.log(data._id.toString());
      const Question = mongoose.model(data._id.toString() + 'question', question);
      Question.findOneAndUpdate({_id: req.body.question._id}, req.body.question).then(
        (data) => res.status(200).json(
          {
            message: 'question updated!!',
            data: data
          }
        )
      ).catch(
        (err => {
          console.log(err);
          res.status(500).json({
            error: err
          })
        })
      )
    }
  ).catch(
    (err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  )


})
/*-------------------delete question------------*/
app.post('/deleteQuestion', checkAuth, function (req, res) {
  console.log('inside delete question');
  console.log(req.body);
  Quiz.findOne({passCode: req.body.quiz_id}).exec().then(
    (data) => {
      console.log(data)
      console.log(data._id.toString());
      const Question = mongoose.model(data._id.toString() + 'question', question);
      Question.findOneAndDelete({_id: req.body.question._id}).then(
        (data) => res.status(200).json(
          {
            message: 'question deleted!!',
            data: data
          }
        )
      ).catch(
        (err => {
          console.log(err);
          res.status(500).json({
            error: err
          })
        })
      )
    }
  ).catch(
    (err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  )


})
/*------------------get questions-------------*/
app.get('/:quiz_id/questions', checkAuth, function (req, res) {
  console.log('inside getquestions')
  Quiz.findOne({passCode: req.params.quiz_id}).exec().then(
    (data) => {
      console.log(data)
      if (data._id != null) {
        const Questions = mongoose.model(data._id.toString() + 'question', question);
        Questions.find({}).exec().then(
          (questions) => {
            return res.status(200).json({
              message: "successful",
              questions: questions
            })
          }
        ).catch((error) => {
            return res.status(401).json(
              {
                message: error
              }
            )
          }
        )
      }
    }
  );
});


/*****************Quiz section**********************/
/*-------------quiz section---------------*/


app.post('/addQuiz', checkAuth, function (req, res) {
  console.log('inside addquiz')
  console.log(req.userData);
  //attach quiz to user data
  console.log(req.body)
  Quiz
    .find({passCode: req.body.passCode})
    .exec()
    .then((quiz) => {
      if (quiz.length >= 1) {
        return res.status(409).json({
          message: "Passcode already used",
        });
      } else {
        userdb.findOneAndUpdate({_id: req.userData.userId}, {$push: {quizzes: [req.body]}})
          .exec()
          .then()
          .catch(
            (error) => {
              return res.status(401).json(
                {
                  message: error
                }
              )
            }
          )
        Quiz(req.body).save().then(
          (data) => {
            return res.status(200).json(
              {
                message: "successfully added your quiz",
                data: data
              }
            )
          }
        ).catch((error) => {
            return res.status(401).json(
              {
                message: error
              }
            )
          }
        );
      }
    })
})
/*--------------------edit quiz--------------*/

app.put('/editQuiz', checkAuth, function (req, res) {
  console.log('inside editquiz')
  console.log(req.body.quizPrev, req.body.quizUpdated);
  let prevPassCode = req.body.quizPrev.passCode;
  let updatedPassCode = req.body.quizUpdated.passCode;
  console.log('new', req.body);

  let updateQuizDetails = {
    name: req.body.quizUpdated.name,
    passCode: updatedPassCode,
    time: req.body.quizUpdated.time
  }

  if (prevPassCode != updatedPassCode) {
    Quiz
      .find({'passCode': updatedPassCode})
      .exec()
      .then((quiz) => {

        if (quiz.length >= 1) {
          console.log('here');
          return res.status(409).json({
            message: "Passcode already used",
          });
        } else {
          Quiz.findOneAndUpdate({'passCode': prevPassCode}, updateQuizDetails)
            .exec()
            .then(
              (data) => {
                userdb.findOneAndUpdate({
                  _id: req.userData.userId,
                  'quizzes._id': req.body.quizUpdated._id
                }, {$set: {'quizzes.$': req.body.quizUpdated}})
                  .exec()
                  .then()
                  .catch(
                    (error) => {
                      return res.status(401).json(
                        {
                          message: error
                        }
                      )
                    }
                  )
                return res.status(200).json(
                  {
                    message: 'successfully updated quiz',
                    data: data
                  }
                )
              }
            ).catch(
            (error) => {
              return res.status(401).json(
                {
                  message: error
                }
              )
            })
        }
      })
  } else {
    Quiz.findOneAndUpdate({'passCode': prevPassCode}, updateQuizDetails)
      .exec()
      .then(
        (data) => {
          userdb.findOneAndUpdate({
            _id: req.userData.userId,
            'quizzes._id': req.body.quizUpdated._id
          }, {$set: {'quizzes.$': req.body.quizUpdated}})
            .exec()
            .then()
            .catch(
              (error) => {
                return res.status(401).json(
                  {
                    message: error
                  }
                )
              }
            )
          console.log(data);
          return res.status(200).json(
            {
              message: 'successfully updated quiz',
              data: data
            }
          )
        }
      )
      .catch(
        (error) => {
          return res.status(401).json(
            {
              message: error
            }
          )
        }
      )
  }
})
/*-------------delete quizz------------------*/
app.delete('/deleteQuiz/:passCode', checkAuth, function (req, res) {
  console.log('inside deletequiz')
  passCode = req.params.passCode;

  Quiz.findOneAndDelete({'passCode': passCode}, function (err, doc) {
    if (err) {
      return res.status(502).json(
        {
          message: "Failed to delete",
        }
      )
    } else {
      console.log(doc);
      userdb.findOneAndUpdate({'email': req.userData.email}, {$pull: {quizzes: {'passCode': passCode}}}).exec().then(
        () => mongoose.connection.db.dropCollection(doc._id.toString() + 'questions', function (err, result) {
          console.log('collection removed!!')
        })
      ).catch(
        () => {
          return res.status(502).json(
            {
              message: "Failed to delete"
            }
          )
        }
      )
      return res.status(201).json(
        {
          message: "Quiz deleted !!",

        }
      )
    }
  });


})
/*----------get quizzes-----------------------*/
app.get('/quizzes', checkAuth, function (req, res) {
  console.log('insdie quizzes get');
  console.log(req.body)
  userdb.findOne({email: req.userData.email}).exec().then(
    data => {
      console.log(data);
      res.status(200).json(
        {
          message: " success",
          quizzes: data.quizzes
        }
      )
    }
  )
})
/*------------get quiz Details-------------*/
app.get('/getQuiz/:passCode', checkAuth, function (req, res) {
  console.log('insdie get quiz details');
  console.log(req.body)
  Quiz.findOne({passCode: req.params.passCode}).exec().then(
    data => {
      console.log(data);
      res.status(200).json(
        {
          message: " success",
          quizDetails: data
        }
      )
    }
  )
})
/*-----------take/attempt quiz ----------------*/
app.get('/takeQuiz/:quiz_id/questions', checkAuth, function (req, res) {
  console.log('inside take quiz getquestions')
  Quiz.findOne({passCode: req.params.quiz_id}).exec().then(
    (data) => {
      console.log(data)
      console.log(data._id.toString());
      const Questions = mongoose.model(data._id.toString() + 'question', question);
      Questions.find({}).exec().then(
        (questions) => {
          let questionsArray = questions.map(q => {
            return {
              '_id': q._id,
              'title': q.title,
              'options': [q.correctAnswer, q.option1, q.option2, q.option3],
              'selectedAnswer': '',
              'points': q.points
            }
          })
          let totalPoints = 0;
          questionsArray.map(q => {
            totalPoints += q.points;
            shuffle(q.options)
            return {
              'title': q.title,
              'option': q.options
            }
          })
          shuffle(questionsArray);
          return res.status(200).json({
            message: "successful",
            questions: questionsArray,
            totalPoints: totalPoints,
            time: data.time
          })
        }
      ).catch((error) => {
          return res.status(401).json(
            {
              message: error
            }
          )
        }
      )
    }
  );
});
/*----enter quiz-----*/
app.get('/enterQuiz/:passCode', checkAuth, function (req, res) {
  console.log('inside enter-quiz');

  Quiz.findOne({passCode: req.params.passCode}).exec().then(
    (data) => {
      if (data == null) {
        return res.json(
          {
            error: 'passcode not found'
          }
        )
      } else {
        var hasAlreadyTakenQuiz = data.Students.some(function (el) {
          return el.email === req.userData.email
        });
        console.log(hasAlreadyTakenQuiz);
        if (hasAlreadyTakenQuiz) {
          return res.json(
            {
              error: 'you have already taken the Quiz',
            }
          )
        }
        return res.json(
          {
            message: 'succesful',
            data: data
          }
        )
      }
    }
  ).catch((error) => {
    return res.status(401).json(
      {
        message: error
      }
    )
  })
})
/*----process submitted quiz-----*/
app.post('/takeQuiz/:quiz_id/submitquiz', checkAuth, function (req, res) {
  console.log('inside take submitted quiz')

  Quiz.findOne({passCode: req.params.quiz_id}).exec().then(
    (data) => {
      let hasStudentAlreadytakenQuiz = data.Students.some(el => el.email === req.userData.email)
      //no foul play :)
      if (hasStudentAlreadytakenQuiz) {
        return res.json(
          {
            error: {
              message: 'You have already taken the test!!'
            }
          }
        )
      }
      console.log(data)
      console.log(data._id.toString());
      const Questions = mongoose.model(data._id.toString() + 'question', question);
      const answers = req.body;
      Questions.find({}).exec().then(
        (questions) => {
          let points = calculatePoints(questions, answers);
          let studentData = {
            name: req.userData.username,
            email: req.userData.email,
            score: points
          }
          Quiz.findOneAndUpdate({passCode: req.params.quiz_id}, {$push: {Students: [studentData]}})
            .then(
              console.log('student added')
            )
            .catch(e => console.log(e));

          console.log(points);
          return res.status(200).json({
            message: "successful",
            report: {
              points: points
            }
          })
        }
      ).catch((error) => {
          return res.status(401).json(
            {
              message: error
            }
          )
        }
      )
    }
  );
});
/*---------mongoose connection------------*/

const connect = () => {
  return mongoose.connect('mongodb://localhost:27017/QuizMakerApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

};
connect().then(
  console.log("db connected")
).catch(e => console.log(e));

app.listen("3000");
console.log("Port:3000");
