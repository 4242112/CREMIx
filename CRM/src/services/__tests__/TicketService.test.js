import { TicketService, TicketStatus } from '../TicketService.js';
import apiClient from '../../apiClient.js';
import { getDemoTickets } from '../../data/sampleTickets.js';

// Mock apiClient
jest.mock('../../apiClient.js', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sampleTickets functions
jest.mock('../../data/sampleTickets.js', () => ({
  getDemoTickets: jest.fn(),
  initializeSampleTickets: jest.fn(),
}));

describe('TicketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('getAllTickets', () => {
    it('should return tickets from API when successful', async () => {
      const mockTickets = [
        { id: 1, subject: 'Test Ticket', status: 'NEW' },
        { id: 2, subject: 'Another Ticket', status: 'CLOSED' }
      ];
      apiClient.get.mockResolvedValue({ data: mockTickets });

      const result = await TicketService.getAllTickets();

      expect(apiClient.get).toHaveBeenCalledWith('/tickets');
      expect(result).toEqual(mockTickets);
    });

    it('should fallback to demo data when API fails', async () => {
      const mockDemoTickets = [
        { id: 'demo1', subject: 'Demo Ticket', status: 'CLOSED' }
      ];
      apiClient.get.mockRejectedValue(new Error('API Error'));
      getDemoTickets.mockReturnValue(mockDemoTickets);

      const result = await TicketService.getAllTickets();

      expect(apiClient.get).toHaveBeenCalledWith('/tickets');
      expect(getDemoTickets).toHaveBeenCalled();
      expect(result).toEqual(mockDemoTickets);
    });
  });

  describe('getTicketById', () => {
    it('should return ticket from API when successful', async () => {
      const mockTicket = { id: 1, subject: 'Test Ticket', status: 'NEW' };
      apiClient.get.mockResolvedValue({ data: mockTicket });

      const result = await TicketService.getTicketById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/tickets/1');
      expect(result).toEqual(mockTicket);
    });

    it('should fallback to demo data when API fails', async () => {
      const mockDemoTickets = [
        { id: 'demo1', subject: 'Demo Ticket 1', status: 'CLOSED' },
        { id: 'demo2', subject: 'Demo Ticket 2', status: 'NEW' }
      ];
      apiClient.get.mockRejectedValue(new Error('API Error'));
      getDemoTickets.mockReturnValue(mockDemoTickets);

      const result = await TicketService.getTicketById('demo1');

      expect(apiClient.get).toHaveBeenCalledWith('/tickets/demo1');
      expect(getDemoTickets).toHaveBeenCalled();
      expect(result).toEqual(mockDemoTickets[0]);
    });

    it('should return undefined for non-existent ticket in demo data', async () => {
      const mockDemoTickets = [{ id: 'demo1', subject: 'Demo Ticket', status: 'CLOSED' }];
      apiClient.get.mockRejectedValue(new Error('API Error'));
      getDemoTickets.mockReturnValue(mockDemoTickets);

      const result = await TicketService.getTicketById('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('createTicket', () => {
    it('should create ticket via API when successful', async () => {
      const ticketData = { subject: 'New Ticket', description: 'Test description' };
      const mockResponse = { id: 123, ...ticketData, status: 'NEW' };
      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await TicketService.createTicket(ticketData, 1);

      expect(apiClient.post).toHaveBeenCalledWith('/tickets/customer/1', { ...ticketData, status: 'NEW' });
      expect(result).toEqual(mockResponse);
    });

    it('should fallback to localStorage when API fails', async () => {
      const ticketData = { subject: 'New Ticket', description: 'Test description' };
      const existingTickets = [{ id: 'existing', subject: 'Existing Ticket' }];
      apiClient.post.mockRejectedValue(new Error('API Error'));
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingTickets));

      const result = await TicketService.createTicket(ticketData, 1);

      expect(apiClient.post).toHaveBeenCalledWith('/tickets/customer/1', { ...ticketData, status: 'NEW' });
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result.subject).toBe('New Ticket');
      expect(result.status).toBe('NEW');
      expect(result.customerId).toBe(1);
    });

    it('should preserve existing status if provided', async () => {
      const ticketData = { subject: 'New Ticket', status: 'IN_PROGRESS' };
      const mockResponse = { id: 123, ...ticketData };
      apiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await TicketService.createTicket(ticketData, 1);

      expect(apiClient.post).toHaveBeenCalledWith('/tickets/customer/1', ticketData);
      expect(result.status).toBe('IN_PROGRESS');
    });
  });

  describe('updateTicket', () => {
    it('should update ticket via API when successful', async () => {
      const ticketData = { subject: 'Updated Ticket', status: 'IN_PROGRESS' };
      const mockResponse = { id: 1, ...ticketData };
      apiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await TicketService.updateTicket(1, ticketData);

      expect(apiClient.put).toHaveBeenCalledWith('/tickets/1', ticketData);
      expect(result).toEqual(mockResponse);
    });

    it('should fallback to localStorage when API fails', async () => {
      const ticketData = { subject: 'Updated Ticket', status: 'CLOSED' };
      const existingTickets = [
        { id: 1, subject: 'Original Ticket', status: 'NEW' },
        { id: 2, subject: 'Another Ticket', status: 'OPEN' }
      ];
      apiClient.put.mockRejectedValue(new Error('API Error'));
      getDemoTickets.mockReturnValue(existingTickets);

      const result = await TicketService.updateTicket(1, ticketData);

      expect(apiClient.put).toHaveBeenCalledWith('/tickets/1', ticketData);
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(result.subject).toBe('Updated Ticket');
      expect(result.status).toBe('CLOSED');
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw error for non-existent ticket in demo data', async () => {
      const ticketData = { subject: 'Updated Ticket' };
      const existingTickets = [{ id: 1, subject: 'Existing Ticket' }];
      apiClient.put.mockRejectedValue(new Error('API Error'));
      getDemoTickets.mockReturnValue(existingTickets);

      await expect(TicketService.updateTicket(999, ticketData)).rejects.toThrow('Ticket 999 not found in demo data');
    });
  });

  describe('getTicketsByCustomerId', () => {
    it('should return customer tickets from API when successful', async () => {
      const mockTickets = [
        { id: 1, subject: 'Customer Ticket 1', customerId: 5 },
        { id: 2, subject: 'Customer Ticket 2', customerId: 5 }
      ];
      apiClient.get.mockResolvedValue({ data: mockTickets });

      const result = await TicketService.getTicketsByCustomerId(5);

      expect(apiClient.get).toHaveBeenCalledWith('/tickets/customer/5');
      expect(result).toEqual(mockTickets);
    });

    it('should fallback to filtering demo data when API fails', async () => {
      const mockDemoTickets = [
        { id: 1, subject: 'Ticket 1', customerId: 5, customerEmail: 'test@example.com' },
        { id: 2, subject: 'Ticket 2', customerId: 3 },
        { id: 3, subject: 'Ticket 3', customerEmail: 'test@example.com' }
      ];
      apiClient.get.mockRejectedValue(new Error('API Error'));
      getDemoTickets.mockReturnValue(mockDemoTickets);

      const result = await TicketService.getTicketsByCustomerId(5);

      expect(apiClient.get).toHaveBeenCalledWith('/tickets/customer/5');
      expect(result).toEqual([mockDemoTickets[0]]);
    });
  });

  describe('startWorkingOnTicket', () => {
    it('should update ticket status to IN_PROGRESS via API', async () => {
      const mockResponse = { id: 1, status: 'IN_PROGRESS' };
      apiClient.put.mockResolvedValue({ data: mockResponse });

      const result = await TicketService.startWorkingOnTicket(1);

      expect(apiClient.put).toHaveBeenCalledWith('/tickets/1', { status: 'IN_PROGRESS' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API fails', async () => {
      apiClient.put.mockRejectedValue(new Error('API Error'));

      await expect(TicketService.startWorkingOnTicket(1)).rejects.toThrow('API Error');
    });
  });

  describe('deleteTicket', () => {
    it('should delete ticket via API when successful', async () => {
      apiClient.delete.mockResolvedValue();

      await expect(TicketService.deleteTicket(1)).resolves.toBeUndefined();
      expect(apiClient.delete).toHaveBeenCalledWith('/tickets/1');
    });

    it('should throw error when API fails', async () => {
      apiClient.delete.mockRejectedValue(new Error('API Error'));

      await expect(TicketService.deleteTicket(1)).rejects.toThrow('API Error');
    });
  });

  describe('TicketStatus enum', () => {
    it('should have correct status values', () => {
      expect(TicketStatus.NEW).toBe('NEW');
      expect(TicketStatus.IN_PROGRESS).toBe('IN_PROGRESS');
      expect(TicketStatus.CLOSED).toBe('CLOSED');
      expect(TicketStatus.RESOLVED).toBe('RESOLVED');
      expect(TicketStatus.URGENT).toBe('URGENT');
    });
  });
});
