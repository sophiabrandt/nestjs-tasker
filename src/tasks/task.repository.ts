import { Repository, EntityRepository } from 'typeorm'
import { Logger, InternalServerErrorException } from '@nestjs/common'
import { CreateTaskDto } from './dto/create-task.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { Task } from './task.entity'
import { TaskStatus } from './task-status.enum'
import { User } from '../auth/user.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository')

  async getTasks (filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto
    const query = this.createQueryBuilder('task')

    query.where('task.userId = :userId', { userId: user.id })

    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` }
      )
    }

    try {
      const tasks = query.getMany()
      return tasks
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(
          filterDto
        )}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  async createTask (createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto

    const task = new Task()
    task.title = title
    task.description = description
    task.status = TaskStatus.OPEN
    task.user = user // associate task to user entity

    try {
      await task.save()
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${
          user.username
        }". DTO: ${JSON.stringify(createTaskDto)}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }

    delete task.user // delete user information from task object (already saved in DB)

    return task
  }
}
