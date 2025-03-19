import { IsEmail, IsString } from "@nestjs/class-validator";




export class Update_user{
    
    
@IsString()
name?:string;

@IsEmail()
email?:string;

@IsString()
password?:string;

}