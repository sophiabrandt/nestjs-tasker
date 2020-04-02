import { Test } from '@nestjs/testing'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TaskRepository } from './task.repository'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'

const mockUser = { id: 99, username: 'test user' }

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
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

    it('throws an error if task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null)

      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe('createTask', () => {
    it('creates a  new task', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled()
      const newTask = {
        title: 'New task',
        description: 'Create a new test task',
      }
      const newTaskDto: CreateTaskDto = {
        title: 'New task',
        description: 'Create a new test task',
      }
      taskRepository.createTask.mockResolvedValue(newTask)

      const result = await tasksService.createTask(newTaskDto, mockUser)
      expect(result).toEqual(newTask)
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        newTaskDto,
        mockUser
      )
    })

    it('throws an error if title or description is not provided', () => {
      taskRepository.createTask.mockResolvedValue(null)

      expect(tasksService.createTask('blabla', mockUser)).rejects.toThrow(
        InternalServerErrorException
      )
    })
  })

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask and deletes a task', async () => {
      expect(taskRepository.delete).not.toHaveBeenCalled()
      taskRepository.delete.mockResolvedValue({ affected: 1 })

      await tasksService.deleteTask(1, mockUser)
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      })
    })

    it('throws an error if the task is not found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 })

      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException
      )
    })
  })
})
