import { Module } from '@nestjs/common';
import { OrganizationService } from './org.service';
import { OrganizationController } from './org.controller';
import { HttpModule } from '@nestjs/axios';
import { OrgRepositorySchema } from './schema/org-repo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationRepository } from './org.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrgRepository', schema: OrgRepositorySchema },
    ]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
