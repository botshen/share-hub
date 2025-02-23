import { defineProxyService, flattenPromise } from '@webext-core/proxy-service';
import { IDBPDatabase } from 'idb';

interface Todo {
    id: number;
    postContent: string|null;
    title: string|null;
    author: string|null;
    avatarUrl: string|null;
    comments:{
        content: string|null;
        author: string|null;
        avatarUrl: string|null;
    }[];
    postscripts: {
        content: string|null;
    }[];
    url: string;
}
export const [registerTodosRepo, getTodosRepo] = defineProxyService('TodosRepo', createTodosRepo);

function createTodosRepo(idbPromise: Promise<IDBPDatabase>) {
  const idb = flattenPromise(idbPromise);

  return {
    async create(todo: Omit<Todo, 'id'>): Promise<void> {
      await idb.add('todos', todo);
    },
    getOne(id: number): Promise<Todo> {
      return idb.get('todos', id);
    },
    getAll(): Promise<Todo[]> {
      return idb.getAll('todos');
    },
    async update(todo: Todo): Promise<void> {
      await idb.put('todos', todo);
    },
    async delete(id: number): Promise<void> {
      await idb.delete('todos', id);
    },
    async clear(): Promise<void> {
      await idb.clear('todos');
    },
  };
}
