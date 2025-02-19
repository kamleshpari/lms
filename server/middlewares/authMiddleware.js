import { clerkClient } from "@clerk/express";

//middleware{protect educator routes}

export const protectEducator=async(req,res)=>{
    try {
        const userId=req.auth.userId
        const respones=await clerkClient.users.getUser(userId)

        if(respones.publicMetadata.role !='educator'){
            return res.json({success:false,message:'Unauthorizes Access'})
        }

        next()
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}