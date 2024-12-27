import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { Types } from 'mongoose';
import { UpdateOrgDto } from './dto/update-org.dto';

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post()
  async createOrg(@Body() createOrg: CreateOrgDto): Promise<any> {
    try {
      const orgBody = {
        ...createOrg,
        owner_id: new Types.ObjectId(createOrg.owner_id),
      };

      return await this.orgService.createOrg(orgBody);
    } catch (err) {
      throw new HttpException('Internal Server Err ' + err, 500);
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

  @Get('/orgs')
  async getAllOrgs(): Promise<any> {
    try {
      return await this.orgService.getAllOrg();
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
}
