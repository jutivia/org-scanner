import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/database/abstract.schema';

@Schema()
export class OrgRepository extends AbstractDocument {
  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  repositoryId: string;

  @Prop({ default: false })
  selected: boolean;
}

export const OrgRepositorySchema = SchemaFactory.createForClass(OrgRepository);
