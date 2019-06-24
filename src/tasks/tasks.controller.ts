import {
  Controller,
  Get,
  Delete,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TasksService } from './tasks.service'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe'
import { Task } from './task.entity'
import { GetUser } from '../auth/get-user.decorator'
import { User } from '../auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor (private tasksService: TasksService) {}

  @Get()
  getTasks (
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ) {
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById (
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask (
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Patch('/:id/status')
  updateTask (
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user)
  }

  @Delete('/:id')
  deleteTask (@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id)
  }
}
