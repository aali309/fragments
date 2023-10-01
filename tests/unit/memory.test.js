/* eslint-disable no-undef */
const MemoryIndex = require('../../src/model/data/memory/index');

describe('index', () => {
  test('writeFragments Returns undefine', async () => {
    info = { ownerId: 'a', id: 'a' };

    const result = await MemoryIndex.writeFragment(info);
    expect(result).toBe(undefined);
  });

  test('writeFragmentsData Returns undefine', async () => {
    const result = await MemoryIndex.writeFragmentData('a', 'b', 123);
    expect(result).toBe(undefined);
  });

  test('readFragmentData & writeFragmentData', async () => {
    const data = { value: 123 };

    await MemoryIndex.writeFragmentData('a', 'b', data);
    const result = await MemoryIndex.readFragmentData('a', 'b');
    expect(result).toEqual(data);
  });

  test('readFragment & writeFragments ', async () => {
    info = { ownerId: 'a', id: 'b' };

    await MemoryIndex.writeFragment(info);
    const result = await MemoryIndex.readFragment('a', 'b');
    expect(result).toEqual(info);
  });

  test('listFragments', async () => {
    info = { ownerId: 'a', id: 'c' };
    await MemoryIndex.writeFragment(info);

    const result = await MemoryIndex.listFragments('a');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  test('listFragments empty array', async () => {
    await MemoryIndex.writeFragmentData('a', 'a', { value: 1 });
    await MemoryIndex.writeFragmentData('a', 'n', { value: 2 });
    await MemoryIndex.writeFragmentData('a', 'c', { value: 3 });

    const result = await MemoryIndex.listFragments('b');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });

  test('deleteFragment', async () => {
    const result = await MemoryIndex.listFragments('a');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(['a', 'b', 'c']);

    await MemoryIndex.deleteFragment('a', 'a');
    const result2 = await MemoryIndex.listFragments('a');
    expect(result2).toEqual(['b', 'c']);
  });

  test('deleteFragments throw', async () => {
    expect(async () => await MemoryIndex.deleteFragment('b', 'b').reject.toThrow());
  });
});
