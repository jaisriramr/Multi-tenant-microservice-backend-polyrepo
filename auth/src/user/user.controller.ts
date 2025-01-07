import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import axios from 'axios';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateRoleDto } from './dto/create-role.dto';
import { Types } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import * as jsonwebtoken from 'jsonwebtoken';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('ORG_SERVICE') private orgClient: ClientProxy,
  ) {}

  @EventPattern('org_created')
  async handleOrgCreated(@Payload() data: any) {
    console.log(data);

    await this.userService.updateOrgID(data?.owner_id, data?._id);
  }

  @Post('/role')
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<any> {
    try {
      return await this.userService.createRole(createRoleDto);
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Get('/role/:roleID')
  async readRole(@Param('roleID') roleID: string): Promise<any> {
    try {
      return await this.userService.readSingleRole(roleID);
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Get('/roles')
  async getAllRoles(): Promise<any> {
    try {
      return await this.userService.readAllRole();
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Delete('/role/:roleID')
  async deleteRole(@Param('roleID') roleID: string): Promise<any> {
    try {
      return await this.userService.deleteRole(roleID);
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Put('/role/:roleID')
  async updateRole(
    @Param('roleID') roleID: string,
    updateRoleDto: CreateRoleDto,
  ): Promise<any> {
    try {
      return await this.userService.updateRole(roleID, updateRoleDto);
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    try {
      const user = await this.userService.readUserByEmail(loginUserDto.email);
      if (user) {
        const passwordCompare = await bcrypt.compare(
          loginUserDto.password,
          user.passwordHash,
        );
        if (passwordCompare) {
          user.passwordHash = undefined;
          const response = await this.userService.userAggreateOrgsandRoles(
            user?.email,
          );
          if (response) {
            const jwt = await jsonwebtoken.sign(
              response,
              process.env.PRIVATEKEY,
              {
                expiresIn: '1h',
              },
            );
            return jwt;
          }
        } else {
          throw new HttpException('Password is incorrect!', 401);
        }
      } else {
        throw new HttpException('User not found!', 404);
      }
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    try {
      const checkUser = await this.userService.checkUser(createUserDto.email);
      console.log(checkUser);
      if (checkUser?.length > 0) {
        throw new HttpException('User Already Exist!', 401);
      } else {
        const roles: any = createUserDto.roles;

        const hashedPassword = await bcrypt.hash(
          createUserDto.password,
          Number(process.env.AUTH_SALT),
        );

        const user = await this.userService.createUser({
          ...createUserDto,
          passwordHash: hashedPassword,
          roles: [new Types.ObjectId(roles[0])],
        });
        this.orgClient.emit('user_created', user);
        return user;
      }
    } catch (err) {
      throw new HttpException(err?.response, err?.status);
    }
  }

  @Get(':user_id')
  async readUser(@Param('user_id') user_id: string) {
    try {
      return await this.userService.readUser(user_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get('/email/:email')
  async readUserEmail(@Param('email') email: string) {
    try {
      const data = await this.userService.readUserByEmail(email);

      if (data) {
        return data;
      }
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get('/orgs/:org_id')
  async getUserByOrg(@Param('org_id') org_id: string) {
    try {
      return await this.userService.getAllUserByOrg(org_id);
    } catch (err) {
      throw new HttpException('Internal Server Err ' + err, 500);
    }
  }

  @Delete(':user_id')
  async removeUser(@Param('user_id') user_id: string) {
    try {
      return await this.userService.removeUser(user_id);
    } catch (err) {
      throw new HttpException('Internal Server Err ' + err, 500);
    }
  }

  @Put(':user_id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('user_id') user_id: string,
  ) {
    try {
      return await this.userService.updateUser(user_id, updateUserDto);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Post('/user-to-org')
  async addUserToOrg(@Body() data: any): Promise<any> {
    try {
      const finalOutput = await axios({
        url: process.env.AUTH0_DOMAIN + '/oauth/token',
        method: 'POST',
        data: {
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_SECRET,
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: 'client_credentials',
        },
      })
        .then(async (response) => {
          const accessToken = response?.data?.access_token;

          const responseOfAddOrg = await axios({
            url:
              process.env.AUTH0_DOMAIN +
              '/api/v2/organizations/' +
              data?.org_id +
              '/members',
            headers: {
              Authorization: 'Bearer ' + accessToken,
            },
            data: {
              members: [data?.sub],
            },
          })
            .then((res) => {
              return res.data;
            })
            .catch((err) => {
              throw new HttpException(err?.response, 500);
            });

          return responseOfAddOrg;
        })
        .catch((err) => {
          throw new HttpException(err?.response, 500);
        });

      // const user = await axios({
      //   url: process.env.AUTH0_DOMAIN,
      //   headers:
      // });
      // return user.data;

      return finalOutput;
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }
}
