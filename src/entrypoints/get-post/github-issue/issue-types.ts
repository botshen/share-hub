export interface User {
  __typename: string;
  login: string;
  id: string;
  avatarUrl: string;
  name?: string;
}

interface Label {
  id: string;
  color: string;
  name: string;
  nameHTML: string;
  description: string;
}

// 将 Comment 重命名为 IssueComment 以避免与 DOM API 的 Comment 类型冲突
export interface IssueComment {
  id: string;
  body: string;
  bodyHTML: string;
  createdAt: string;
  author: User;
}

interface PullRequest {
  title: string;
  url: string;
  number: number;
  state: string;
  repository: {
    name: string;
    owner: {
      login: string;
      id: string;
    };
    id: string;
  };
}

export interface Issue {
  id: string;
  title: string;
  number: number;
  state: string;
  stateReason: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  body: string;
  bodyHTML: string;
  labels: {
    edges: Array<{
      node: Label;
    }>;
  };
  assignees: {
    nodes: User[];
  };
  linkedPullRequests: {
    nodes: PullRequest[];
  };
  comments: IssueComment[];
}
