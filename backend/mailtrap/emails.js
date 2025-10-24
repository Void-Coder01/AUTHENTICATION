import { mailTrapClient, sender } from "./mailtrap.config.js"
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from './email.template.js'
import { Resend } from 'resend';


export const sendVerificationMail = async(email, verficationToken) => {
    /* const recepient = [{email},]//mailtrap recepeint mails are case sensitive remember that
    console.log(verficationToken);

    try {
        const response = await mailTrapClient.send({
            from:sender,
            to:recepient,
            subject : "verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verficationToken),//template m verficationCode yeh ek text h usse code ko replace krrhe h 
            category : "Email Verfication"
        })

        console.log("Email sent successfully", response);
    } catch (error) {
        console.error("Error while sending verfication mail", error.message);
        throw new Error(`Error while sending verfication mail ${error}`);
    } */

    try{
        const resend = new Resend('re_FFkZYFj4_8agzDEAV1G1abZpVum2yjbpx');

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'yogeshy200326@gmail.com',
            subject: 'Verification Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verficationToken)   
        });

        if(error){
            throw new Error("Error while sending verification mail")
        }

        console.log("verification email sent successfully", data);
    }catch(error){
        console.log( "error while sending verification mail" , error);
        throw new Error("Error while sending verification mail")
    }   
}

export const sendWelcomeEmail = async(email, name) => {
     try{
        const resend = new Resend('re_FFkZYFj4_8agzDEAV1G1abZpVum2yjbpx');

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'yogeshy200326@gmail.com',
            subject: 'Welcome email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", `Welcome ${name}`)   
        });

        if(error){
            throw new Error("Error while sending verification mail")
        }

        console.log("verification email sent successfully", data);
    }catch(error){
        console.log( "error while sending verification mail" , error);
        throw new Error("Error while sending verification mail")
    }   
};

export const sendForgotPasswordEmail = async(email, resetURL) => {
    try {
        const resend = new Resend('re_FFkZYFj4_8agzDEAV1G1abZpVum2yjbpx');

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'yogeshy200326@gmail.com',//idr email ayega user ka 
            subject: 'Reset email',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category : "reset-password"   
        });

        if(error){
            throw new Error("Error while sending reset-password mail")
        }

        console.log("reset-password email sent successfully", data);
    } catch (error) {
        console.log("error occurred while sending forgot email", error);
        throw new Error("Error while sending forgot email")
    }
}

export const sendResetSuccessfullEmail = async(email) => {
    try {
        const resend = new Resend('re_FFkZYFj4_8agzDEAV1G1abZpVum2yjbpx');

        const {data, error } = await resend.emails.send({
            from:'onboarding@resend.dev',
            to:'yogeshy200326@gmail.com',//idr email ayega
            subject : "Successfull Reset email",
            html : PASSWORD_RESET_SUCCESS_TEMPLATE,
            category : "reset password success"
        }) 

        if(error){
            throw new Error("Error while sending reset password success mail")
        }

        console.log("reset-password success email sent successfully", data);
    } catch (error) {
         console.log("error while sending reset password success mail" , error);
        throw new Error("Error while sending reset password success mail")
    }
}