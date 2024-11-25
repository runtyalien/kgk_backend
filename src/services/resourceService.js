import { AppDataSource } from '../config/database.js';
import { Resource } from '../entities/Resource.js';
import { generateAccessToken } from '../utils/tokenGenerator.js';
import cron from 'node-cron';

export class ResourceService {
  constructor() {
    this.resourceRepository = AppDataSource.getRepository(Resource);
  }

  async createResource(user, resourceUrl, expirationTime) {
    const resource = this.resourceRepository.create({
      resourceUrl,
      user,
      accessToken: generateAccessToken(),
      expirationTime: new Date(expirationTime),
      isExpired: false
    });

    return this.resourceRepository.save(resource);
  }

  async getResourceByAccessToken(accessToken) {
    const resource = await this.resourceRepository.findOne({
      where: { accessToken, isExpired: false },
      relations: ['user']
    });

    if (!resource || new Date() > resource.expirationTime) {
      if (resource) {
        resource.isExpired = true;
        await this.resourceRepository.save(resource);
      }
      return null;
    }

    return resource;
  }

  async getUserResources(user, status = 'active') {
    const isExpired = status === 'expired';
    return this.resourceRepository.find({
      where: { 
        user: { id: user.id }, 
        isExpired 
      },
      order: { createdAt: 'DESC' }
    });
  }

  async deleteResource(resourceId, userId) {
    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId, user: { id: userId } }
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    return this.resourceRepository.remove(resource);
  }

  setupExpirationCronJob() {
    cron.schedule('*/15 * * * *', async () => {
      await this.resourceRepository
        .createQueryBuilder()
        .update(Resource)
        .set({ isExpired: true })
        .where('expiration_time < NOW()')
        .execute();
    });
  }
}