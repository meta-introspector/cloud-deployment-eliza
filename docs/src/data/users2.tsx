import {sortBy} from 'lodash';

export type TagType =
  | 'favorite'
  | 'opensource'
  | 'product'
  | 'design'
  | 'large'
  | 'personal';

export type User = {
  title: string;
  description: string;
  preview: string | null;
  website: string;
  source: string | null;
  tags: TagType[];
};

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export const Tags: {[type in TagType]: Tag} = {
  favorite: {
    label: 'Favorite',
    description: 'Our favorite projects that you must check out!',
    color: '#e9669e',
  },
  opensource: {
    label: 'Open Source',
    description: 'Open source projects can be useful for inspiration!',
    color: '#39ca30',
  },
  product: {
    label: 'Product',
    description: 'Projects related to commercial products!',
    color: '#dfd545',
  },
  design: {
    label: 'Design',
    description: 'Beautiful sites with custom designs!',
    color: '#a44fb7',
  },
  large: {
    label: 'Large',
    description: 'Large sites with lots of content!',
    color: '#8c2f00',
  },
  personal: {
    label: 'Personal',
    description: 'Personal websites and portfolios',
    color: '#14cfc3',
  }
};

export const TagList = Object.keys(Tags) as TagType[];

// Add your showcase sites here
const Users: User[] = [
  {
    title: 'Example Project',
    description: 'An example project built with our framework',
    preview: null, // Add image path here
    website: 'https://example.com',
    source: 'https://github.com/example/project',
    tags: ['opensource', 'personal'],
  },
  {
    title: 'My Project',
    description: 'A cool project built with our framework',
    preview: 'img/showcase/my-project.png',
    website: 'https://myproject.com',
    source: 'https://github.com/myproject',
    tags: ['opensource', 'product'],
  },
  // Add more sites here
];

function sortUsers() {
  let result = Users;
  // Sort by site name
  result = sortBy(result, (user) => user.title.toLowerCase());
  // Sort by favorite tag, favorites first
  result = sortBy(result, (user) => !user.tags.includes('favorite'));
  return result;
}

export const sortedUsers = sortUsers();
