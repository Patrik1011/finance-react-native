import reducer, {
  addEntry,
  fetchEntries,
  modifyEntry,
  removeEntry,
} from '@/redux/entrySlice';
import { createEntry, deleteEntry, getEntries } from '@/services/entryService';

jest.mock('../services/entryService', () => ({
  getEntries: jest.fn(),
  createEntry: jest.fn(),
  deleteEntry: jest.fn(),
  updateEntry: jest.fn(),
}));

const mockEntry = {
  id: 1,
  title: 'Test Entry',
  amount: 100,
  date: '2023-01-01',
  categoryId: 1,
};

const mockEntries = [
  mockEntry,
  {
    id: 2,
    title: 'Another Test Entry',
    amount: 200,
    date: '2023-01-02',
    categoryId: 2,
  },
];

describe('Entry Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Reducer tests', () => {
    it('should handle fetchEntries.pending', () => {
      const nextState = reducer(undefined, { type: fetchEntries.pending.type });
      expect(nextState.loading).toBe(true);
    });

    it('should handle fetchEntries.rejected', () => {
      const error = new Error('Failed to fetch entries');
      const nextState = reducer(undefined, {
        type: fetchEntries.rejected.type,
        error: { message: error.message },
      });
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(error.message);
    });

    it('should handle addEntry.fulfilled', () => {
      const initialState = { entries: [], loading: false };
      const nextState = reducer(initialState, {
        type: addEntry.fulfilled.type,
        payload: mockEntry,
      });
      expect(nextState.entries).toEqual([mockEntry]);
    });

    it('should handle removeEntry.fulfilled', () => {
      const initialState = { entries: mockEntries, loading: false };
      const nextState = reducer(initialState, {
        type: removeEntry.fulfilled.type,
        payload: 1,
      });
      expect(nextState.entries).toEqual([mockEntries[1]]);
    });

    it('should handle modifyEntry.fulfilled', () => {
      const initialState = { entries: mockEntries, loading: false };
      const updatedEntry = { ...mockEntry, title: 'Updated Entry' };
      const nextState = reducer(initialState, {
        type: modifyEntry.fulfilled.type,
        payload: updatedEntry,
      });
      expect(nextState.entries[0]).toEqual(updatedEntry);
    });
  });

  describe('Async thunk tests', () => {
    it('fetchEntries should call getEntries and return entries', async () => {
      (getEntries as jest.Mock).mockResolvedValue(mockEntries);

      const dispatch = jest.fn();
      const thunk = fetchEntries();

      await thunk(dispatch, () => ({}), undefined);

      expect(getEntries).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      const [start, end] = dispatch.mock.calls;
      expect(start[0].type).toBe(fetchEntries.pending.type);
      expect(end[0].type).toBe(fetchEntries.fulfilled.type);
      expect(end[0].payload).toEqual(mockEntries);
    });

    it('addEntry should call createEntry and return the created entry', async () => {
      (createEntry as jest.Mock).mockResolvedValue(mockEntry);

      const dispatch = jest.fn();
      const thunk = addEntry(mockEntry);

      await thunk(dispatch, () => ({}), undefined);

      expect(createEntry).toHaveBeenCalledWith(mockEntry);
      expect(dispatch).toHaveBeenCalledTimes(2);
      const [start, end] = dispatch.mock.calls;
      expect(start[0].type).toBe(addEntry.pending.type);
      expect(end[0].type).toBe(addEntry.fulfilled.type);
      expect(end[0].payload).toEqual(mockEntry);
    });

    it('removeEntry should call deleteEntry and return the deleted entry id', async () => {
      (deleteEntry as jest.Mock).mockResolvedValue(undefined);

      const dispatch = jest.fn();
      const entryId = 1;
      const thunk = removeEntry(entryId);

      await thunk(dispatch, () => ({}), undefined);

      expect(deleteEntry).toHaveBeenCalledWith(entryId);
      expect(dispatch).toHaveBeenCalledTimes(2);
      const [start, end] = dispatch.mock.calls;
      expect(start[0].type).toBe(removeEntry.pending.type);
      expect(end[0].type).toBe(removeEntry.fulfilled.type);
      expect(end[0].payload).toBe(entryId);
    });
  });
});
