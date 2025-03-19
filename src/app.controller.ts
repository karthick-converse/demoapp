import { Body, Controller, Delete, Get, Param, Post, Put, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Create_user } from './dto/create.user.dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

@Get('index')
@Render('index')
indexpage(){
  return {}
}

@Get('adduser')
@Render('adduser')
adduserpage(){
return {}
}




  @Post('/adduser')
  getHello(@Body() user_data:Create_user,@Res() res:Response ) {
    return this.appService.createUser(user_data,res);
  }


   // Show All Users Page
   @Get('/users')
   @Render('userview') // Render users.ejs
   async getAllUsers() {
     const users = await this.appService.getusers();
     return { users };
   }
 
   // Delete User
   @Get('/delete-user/:id')
   @Redirect('/users')
   async deleteUser(@Param('id') id: number) {
     await this.appService.deleteuser(id);
   }
 
   // Render Update Form
   @Get('/edit-user/:id')
   @Render('updateform') // edit-user.ejs
   async editUser(@Param('id') id: number) {
     const users = await this.appService.getusers();
     const user = users.find(u => u.id === Number(id));
     return { user };
   }
 
   // Handle Update Form Submission
   @Post('/update-user/:id')
   @Redirect('/users')
   async updateUser(@Param('id') id: number, @Body() body) {
     await this.appService.updateuser(id, body);
   }

}
