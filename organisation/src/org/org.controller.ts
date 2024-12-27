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
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { Types } from 'mongoose';
import { UpdateOrgDto } from './dto/update-org.dto';
import axios from 'axios';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { InviteUserDto } from './dto/invite-user.dto';

@Controller('org')
export class OrgController {
  constructor(
    private readonly orgService: OrgService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any) {
    console.log(data);

    const response = await this.orgService.createOrgFromEvent(data);
    if (response) {
      console.log('REDD ', response);
      this.userClient.emit('org_created', response);
    }
  }

  @Post()
  async createOrg(@Body() createOrg: CreateOrgDto): Promise<any> {
    try {
      const orgBody = {
        ...createOrg,
        owner_id: new Types.ObjectId(createOrg.owner_id),
      };

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
          const orgAuthRepsonse = await axios({
            url: process.env.AUTH0_DOMAIN + '/api/v2/organizations',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + response?.data?.access_token,
            },
            data: {
              name: orgBody?.name,
              display_name: orgBody?.display_name,
              branding: {
                logo_url:
                  'https://images.unsplash.com/photo-1730348669598-4ce96ef0345e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEzfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D',
                colors: {
                  primary: '#3F59E4',
                  page_background: '#f4f4f4',
                },
              },
              metadata: {},
              enabled_connections: [
                {
                  connection_id: process.env.AUTH0_CONNECTION_ID,
                  assign_membership_on_login: true,
                  show_as_button: true,
                  is_signup_enabled: true,
                },
              ],
            },
          })
            .then((orgg) => {
              return orgg;
            })
            .catch((err) => {
              console.log(err);
              throw new HttpException('Internal Server Error ' + err, 500);
            });

          return orgAuthRepsonse;
        })
        .catch((err) => {
          throw new HttpException('Internal Server Error ' + err, 500);
        });

      //   return { finalOutput: finalOutput?.data };
      const Org_Data = {
        org_id: finalOutput?.data?.id,
        name: finalOutput?.data?.name,
        display_name: finalOutput?.data?.display_name,
        owner_id: new Types.ObjectId(createOrg.owner_id),
        logo_url: finalOutput?.data?.branding?.logo_url,
      };
      return await this.orgService.createOrg(Org_Data);
    } catch (err) {
      throw new HttpException('Internal Server Err ' + err, 500);
    }
  }

  @Delete('/auth/:org_id')
  async deleteOrg(@Param('org_id') org_id: string) {
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
          const orgAuthRepsonse = await axios({
            url: process.env.AUTH0_DOMAIN + '/api/v2/organizations/' + org_id,
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + response?.data?.access_token,
            },
          })
            .then((orgg) => {
              return orgg;
            })
            .catch((err) => {
              console.log(err);
              throw new HttpException('Internal Server Error ' + err, 500);
            });

          return orgAuthRepsonse;
        })
        .catch((err) => {
          throw new HttpException('Internal Server Error ' + err, 500);
        });

      return { data: 'Deleted Org Successfully ' + finalOutput };
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Post('/invite')
  async inviteUserToORg(@Body() inviteUserDto: InviteUserDto) {
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
          const orgAuthRepsonse = await axios({
            url:
              process.env.AUTH0_DOMAIN +
              '/api/v2/organizations/' +
              inviteUserDto.org_id +
              '/invitations',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + response?.data?.access_token,
            },
            data: {
              inviter: {
                name: inviteUserDto.name,
              },
              invitee: {
                email: inviteUserDto.email,
              },
              client_id: process.env.AUTH0_INVITATION_CLIENT_ID,
              connection_id: process.env.AUTH0_CONNECTION_ID,
              app_metadata: {},
              user_metadata: {},
              ttl_sec: 0,
              roles: [inviteUserDto.roles],
              send_invitation_email: true,
            },
          })
            .then((orgg) => {
              return orgg;
            })
            .catch((err) => {
              console.log(err);
              throw new HttpException('Internal Server Error ' + err, 500);
            });

          return orgAuthRepsonse;
        })
        .catch((err) => {
          throw new HttpException('Internal Server Error ' + err, 500);
        });

      return finalOutput?.data;
    } catch (err) {
      throw new HttpException('Internal server error ' + err, 500);
    }
  }

  @Get('/orgs')
  async getAllOrgs(): Promise<any> {
    try {
      return await this.orgService.getAllOrg();
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Get(':org_id')
  async getSingleOrg(@Param('org_id') org_id: string): Promise<any> {
    try {
      return await this.orgService.readOrg(org_id);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @Put(':org_id')
  async updateOrg(
    @Body() updateOrgDto: UpdateOrgDto,
    @Param('org_id') org_id: string,
  ): Promise<any> {
    try {
      return await this.orgService.updateOrg(org_id, updateOrgDto);
    } catch (err) {
      throw new HttpException('Internal Server Error ' + err, 500);
    }
  }

  @EventPattern('auth_queue')
  async handleCreateOrg(@Payload() data: any) {
    console.log('AAAAA ', data);
  }
}
