import {clerkClient} from '@clerk/express'
import Course from '../models/course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
//import { User } from '../models/User.js'


//update role to education
export const updateRoleToEducator=async(req,res)=>{
    try {
        const userId =req.auth.userId

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',

            }
        })
        res.json({success:true,message:"You can Publish a Course now"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//add new course

export const addCourse=async(req,res)=>{
    try {
        const {courseDate}=req.body
        const imageFile=req.file
        const educatorId=req.auth.userId

        if(!imageFile){
            return res.json({success:false,message:'Thumbnail Not Attached'})

        }
        const parsedCourseData=await JSON.parse(courseDate)
        parsedCourseData.educator=educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload=await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail=imageUpload.secure_url
        await newCourse.save()

        res.json({success:true,message:'Course added'})

    

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//get educator courses

export const  getEducatorCourses =async(req,res)=>{
    try {
        const educator=req.auth.userId 


        const courses =await Course.find({educator})
        res.json({success:true,courses})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//get educator dashboard data

export const educatorDashboardData=async(req,res)=>{
    try {
        const educator=req.auth.userId;
        const courses=await Course.find({educator})
        const totalCourses=courses.length;

        const courseIds=courses.map(course=>course._id);

        //calculat total earning from courses

        const Purchases=await Purchase.find({
            coursesId:{$in:courseIds},
            status:'completed'
        })

        const totalEarnings=Purchases.reduce((sum,purchase)=>sum + purchase.amount,0);
//collect unique enrolled student ids with their course title

const enrolledStudentsData=[];
for(const course of courses){
    const students=await User.find({
        _id:{$in:course.enrolledStudents}
    },'name imageUrl');

    students.forEach(student=>{
        enrolledStudentsData.push({
            courseTitle:course.courseTitle,
            student
        });
    }); 
}
res.json({success:true,dashboardData:{
        totalEarnings,
        enrolledStudentsData,
        totalCourses
}})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// get enrolleddata with student data purchase
export const getEnrolledStudentData=async(req,res)=>{
    try {
        const educator=req.auth.userId
        const courses=await Course.find({educator});
        const courseIds=courses.map(course=>course._id);

        const purchases=await Purchase.find({
            courseId:{$in:courseIds},
            status:'completed'
        }).populate('userId','name imageUrl').populate('courseId','courseTitle')

        const enrolledStudents =purchases.map(purchase=>({
            student:purchase.userId,
            courseTitle:purchase.courseId.courseTitle,
            purchaseData:purchase.createdAt
        }))

        res.json({success:true,enrolledStudents})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}