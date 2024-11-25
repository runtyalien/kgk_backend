import { ResourceService } from '../services/resourceService.js';
import { AppDataSource } from '../config/database.js';
import { User } from '../entities/user.js';

export class ResourceController {
  constructor() {
    this.resourceService = new ResourceService();
    this.userRepository = AppDataSource.getRepository(User);
  }

  createResource = async (req, res) => {
    try {
      const { resourceUrl, expirationTime } = req.body;
      const user = await this.userRepository.findOne({ 
        where: { id: req.user.id } 
      });

      const resource = await this.resourceService.createResource(
        user, 
        resourceUrl, 
        expirationTime
      );

      res.status(201).json({
        message: 'Resource created successfully',
        resource: {
          id: resource.id,
          accessToken: resource.accessToken,
          expirationTime: resource.expirationTime
        }
      });
    } catch (error) {
        console.log(error.message);
        
      res.status(500).json({ message: error.message });
    }
  };

  getUserResources = async (req, res) => {
    try {
      const { status } = req.query;
      const resources = await this.resourceService.getUserResources(
        { id: req.user.id }, 
        status
      );

      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  accessResource = async (req, res) => {
    try {
      const { accessToken } = req.params;
      const resource = await this.resourceService.getResourceByAccessToken(accessToken);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found or expired' });
      }

      res.json({ resourceUrl: resource.resourceUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  deleteResource = async (req, res) => {
    try {
      const { id } = req.params;
      await this.resourceService.deleteResource(id, req.user.id);

      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
}