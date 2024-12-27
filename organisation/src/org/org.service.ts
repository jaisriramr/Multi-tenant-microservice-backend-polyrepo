import { HttpException, Injectable } from '@nestjs/common';
import { OrgRepository } from './org.repository';
import axios from 'axios';
import { Types } from 'mongoose';

@Injectable()
export class OrgService {
  constructor(private readonly orgRepository: OrgRepository) {}

  async createOrgFromEvent(data: any): Promise<any> {
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
            name: data?.name,
            display_name: data?.name,
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

    const Org_Data = {
      org_id: finalOutput?.data?.id,
      name: finalOutput?.data?.name,
      display_name: finalOutput?.data?.display_name,
      owner_id: new Types.ObjectId(data._id),
      logo_url: finalOutput?.data?.branding?.logo_url,
    };
    return await this.createOrg(Org_Data);
  }

  async readOrg(org_id: string): Promise<any> {
    return await this.orgRepository.read(org_id);
  }

  async createOrg(createOrg: any): Promise<any> {
    return await this.orgRepository.create(createOrg);
  }

  async updateOrg(org_id: string, updateDto: any): Promise<any> {
    return await this.orgRepository.updateOrg(org_id, updateDto);
  }

  async deleteOrg(org_id: string): Promise<any> {
    return await this.orgRepository.removeOrg(org_id);
  }

  async getAllOrg(): Promise<any> {
    return await this.orgRepository.getAllOrg();
  }
}
