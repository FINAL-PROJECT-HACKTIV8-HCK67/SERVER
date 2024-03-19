const { ObjectId } = require("mongodb");
const database = require("../config/db");

class Controller {

    static async getCourse(req, res, next){
        try {
            const courseData = await database.collection("Courses").find().toArray()

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

    static async myCourseDetail(req, res, next){
        try {
            const user = req.user

            const {detail} = req.params

            const response = await database.collection("UserCourses").aggregate([
                {
                    $match:
                        {
                        userId: user.id,
                        },
                },
                {
                    $match:
                        {
                        name: detail,
                        },
                },
                {
                    $unwind:
                        {
                        path: "$sections",
                        },
                },
            ]).toArray()

            console.log(response, ">>>>>>>>");

            res.status(200).json({response})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async postCourse(req, res, next){
        try {

            const {name, sections, cost} = req.body
            
            const course = await database.collection("Courses").insertOne({name, sections, cost})

            res.status(201).json({course})

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

            const userStat = await database.collection("UserStats").findOne({userId : new ObjectId(user.id)})

            if(userStat.stats.coin < course.cost){
                throw {name : "Insufficient Coin", message : "Insufficient Coin", status : 400}
            }

            const hasBought = await database.collection("UserCourses").findOne({userId : user.id, name : course.name})

            if(hasBought) throw {name : "Course has been bought before", message : "Course has been bought before", status : 400}

            const response = await database.collection("UserCourses").insertOne({
                userId : user.id,
                ...course
            })

            const response2 = await database.collection("UserStats").updateOne(
                {userId : new ObjectId(user.id)},
                {$set : {"stats.coin" : userStat.stats.coin - course.cost}}
            )

            res.status(201).json({message : `Course unlocked, ${userStat.stats.coin - course.cost} coins remained`})

        } catch (error) {
            console.log(error);
            next(error)
        }
    }    

    static async completeCourse(req, res, next){
        try {
            const user = req.user

            const {courseTitle, title, index} = req.body

            // const response = await database.collection("UserCourses").updateOne(
            //     {_id : new ObjectId(courseId), userId : user.id , "sections.title" : title, "sections.content.type" : type},
            //     {$set : {"sections.$.content.$[elem].isComplete" : true}},
            //     {"arrayFilters" : [{"elem.type" : type}]}
            // )

            const updateQuery = {
                $set: {}
            }

            updateQuery.$set[`sections.0.content.${index}.isComplete`] = true

            const response = await database.collection("UserCourses").updateOne(
                {name : courseTitle, userId : user.id},
                updateQuery
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