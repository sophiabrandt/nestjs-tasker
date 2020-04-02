import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TaskRepository } from './task.repository'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { TaskStatus } from './task-status.enum'

const mockUser = { id: 99, username: 'test user' }

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
})

describe('TasksService', () => {
  let tasksService
  let taskRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile()

    tasksService = await module.get<TasksService>(TasksService)
    taskRepository = await module.get<TaskRepository>(TaskRepository)
  })

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue')

      expect(taskRepository.getTasks).not.toHaveBeenCalled()
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      }
      const result = await tasksService.getTasks(filters, mockUser)
      expect(taskRepository.getTasks).toHaveBeenCalled()
      expect(result).toEqual('someValue')
    })
  })

  describe('getTaskbyId', () => {
    it('calls taskRepository.findOne() and successfully retrieves and returns the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test description',
      }
      taskRepository.findOne.mockResolvedValue(mockTask)

      const result = await tasksService.getTaskById(1, mockUser)
      expect(result).toEqual(mockTask)
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      })
    })

    it('throws an error if task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null)

      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException
      )
    })
  })
})
