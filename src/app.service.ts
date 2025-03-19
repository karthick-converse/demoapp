import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Create_user } from './dto/create.user.dto';

@Injectable()
export class AppService {

  constructor(
  @InjectRepository(User)
      private readonly userRepository:Repository<User>
  ){}


  async createUser(user_data:Create_user,res) {
   try{
    const hashedPassword = await bcrypt.hash(user_data.password, 12);
    const user={
      ...user_data,
      password:hashedPassword,
    }
    const users=await this.userRepository.save(user)
    return res.redirect('/users')
  }

catch(err){
  console.log(err);
  return err; 
}
}


  async getusers(){
    try {
      const find_user=await this.userRepository.find()
      return find_user
    } catch (err) {
       console.log("error:",err);
       return err
             
    }
  }

  async deleteuser(user_id)  {
    try {
      const delete_user=await this.userRepository.delete({id:user_id})
      return delete_user;

    } catch (err) {
      console.log("error:",err);
       return err
    }
  }

  async updateuser(user_id,update_data)  {
    try {
      const find_user=await this.userRepository.findOne({where:{id:user_id}})
      if(!find_user){
        return "cannot get the user so give crt id"
      }
      const update_user=await this.userRepository.update({id:user_id},update_data)
      return update_user;

    } catch (err) {
      console.log("error:",err);
       return err
    }
  }

}
