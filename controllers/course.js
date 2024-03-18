const { ObjectId } = require("mongodb");
const database = require("../config/db");

class Controller {

    static async getCourse(req, res, next){
        try {
            const courseData = await database.collection("Courses").find()

            res.status(200).json({courseData})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async myCourse(req, res, next){
        try {
            const user = req.user

            const myCourse = await database.collection("UserCourses").find(
                {userId : user.id}
            ).toArray()

            res.status(200).json({myCourse})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async postCourse(req, res, next){
        try {

            const {name, sections} = req.body
            
            const course = await database.collection("Courses").insertOne({name, sections})

            res.status(201).json({course})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async firstCourse(req, res, next){
        try {
            const {course1, course2} = req.body

            if(!course1 || !course2) throw {name : "Data not found"}

            delete course1._id
            delete course2._id

            const response = await database.collection("UserCourses").insertMany(
                [
                    {
                        userId : req.user.id,
                        ...course1
                    },
                    {
                        userId : req.user.id,
                        ...course2
                    }
                ]
            )

            res.status(201).json({response})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async unlockCourse(req, res, next){
        try {
            const user = req.user

            const {courseId} = req.body

            const course = await database.collection("Courses").findOne({_id : new ObjectId(courseId)})

            if(!course) throw {name : "Data not found"}

            delete course._id

            const response = await database.collection("UserCourses").insertOne({
                userId : user.id,
                ...course
            })

            res.status(201).json({message : "Course unlocked"})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }    

    static async completeCourse(req, res, next){
        try {
            const user = req.user

            const {courseId, title, type} = req.body

            const response = await database.collection("UserCourses").updateOne(
                {_id : new ObjectId(courseId), userId : user.id , "sections.title" : title, "sections.content.type" : type},
                {$set : {"sections.$.content.$[elem].isComplete" : true}},
                {"arrayFilters" : [{"elem.type" : type}]}
            )

            res.status(200).json({message : "Course Completed"})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async getQuiz(req, res, next){
        try {
            const user = req.user

            const {courseId, title} = req.body

            const {sections} = await database.collection("UserCourses").findOne(
                {_id : new ObjectId(courseId), "sections.title" : title}
            )

            const searchSection = sections.filter((perSection) => perSection.title === title)[0]

            const quiz = searchSection.quiz

            res.status(200).json({quiz})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async submitQuiz(req, res, next){
        try {
            const user = req.user

            const {answers, courseId, title} = req.body

            const  {sections} = await database.collection("UserCourses").findOne(
                {_id : new ObjectId(courseId)}
            ) 

            const searchSection = sections.filter((perSection) => perSection.title === title)[0]

            const quizAnswer = searchSection.quizAnswer

            const correctAnswer = 0
            
            

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

}

module.exports = Controller