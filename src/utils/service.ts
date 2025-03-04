import { defineProxyService, flattenPromise } from '@webext-core/proxy-service';
import { IDBPDatabase } from 'idb';

interface Todo {
  id: number | string | null | undefined;
  postContent: string | null | undefined;
  title: string | null | undefined;
  author: string | null | undefined;
  avatarUrl: string | null | undefined;
  comments: {
    content: string | null | undefined;
    author: string | null | undefined;
    avatarUrl: string | null | undefined;
  }[];
  postscripts: {
    content: string | null | undefined;
  }[];
  url: string | null | undefined;
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
