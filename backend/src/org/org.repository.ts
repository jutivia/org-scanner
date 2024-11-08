import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { OrgRepository } from './schema/org-repo.schema';

@Injectable()
export class OrganizationRepository extends AbstractRepository<OrgRepository> {
  protected readonly logger = new Logger(OrgRepository.name);

  constructor(
    @InjectModel(OrgRepository.name) orgRepoModel: Model<OrgRepository>,
  ) {
    super(orgRepoModel);
  }
}
