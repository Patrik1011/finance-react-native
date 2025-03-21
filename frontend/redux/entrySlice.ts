import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getEntries,
  createEntry,
  deleteEntry,
  updateEntry,
} from '@/services/entryService';
import { Entries, Entry, CategoryEntries } from '@/services/entryService';

interface EntryState {
  entries: Entries[];
  categoryEntries?: CategoryEntries;
  loading: boolean;
  error?: string;
}

const initialState: EntryState = {
  entries: [],
  loading: false,
};

export const fetchEntries = createAsyncThunk('entry/fetchEntries', async () => {
  const response = await getEntries();
  return response;
});

export const addEntry = createAsyncThunk(
  'entry/addEntry',
  async (entry: Entry) => {
    const response = await createEntry(entry);
    return response;
  },
);

export const removeEntry = createAsyncThunk(
  'entry/removeEntry',
  async (id: number) => {
    await deleteEntry(id);
    return id;
  },
);

export const modifyEntry = createAsyncThunk(
  'entry/modifyEntry',
  async ({ id, entry }: { id: number; entry: Entry }) => {
    const response = await updateEntry(id, entry);
    return response;
  },
);

const entrySlice = createSlice({
  name: 'entry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
      })
      .addCase(removeEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter(
          (entry) => entry.id !== action.payload,
        );
      })
      .addCase(modifyEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(
          (entry) => entry.id === action.payload.id,
        );
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
  },
});

export const { actions, reducer } = entrySlice;

export default reducer;
