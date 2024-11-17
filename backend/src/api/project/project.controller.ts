import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DRIZZLE_PROVIDER_TOKEN } from '../../shared/drizzle/drizzle.module';
import * as schema from '../../shared/drizzle/schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    @Inject(DRIZZLE_PROVIDER_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    this.db.insert(schema.projectTable).values({
      title: 'Test',
      status: 'active',
    });
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
