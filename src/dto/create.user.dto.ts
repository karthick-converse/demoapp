import { IsEmail, IsString } from "@nestjs/class-validator";




export class Create_user{
    
    
@IsString()
name:string;

@IsEmail()
email:string;

@IsString()
password:string;

}