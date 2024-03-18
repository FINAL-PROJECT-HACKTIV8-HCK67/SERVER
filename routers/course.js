const express = require('express')
const router = express.Router()
const Controller = require('../controllers/course');
const authentication = require('../middlewares/authentication');

router.get('/course', Controller.getCourse)

router.post('/course', Controller.postCourse) // Nanti dihapus

router.post('/course/unlock-first-course', Controller.firstCourse)

router.get('/course/my-course', authentication, Controller.myCourse)

router.post('/course/unlock-course', authentication, Controller.unlockCourse)

router.post('/course/complete-course', authentication, Controller.completeCourse)

router.get('/course/get-quiz', authentication, Controller.getQuiz)

router.post('/course/submit-quiz', authentication, Controller.submitQuiz)

module.exports = router