import gameOfLife from '../sample/gameOfLife/meta';

export type SourceInfo = {
  path: string;
};

export type SampleInfo = {
  name: string;
  tocName?: string;
  description: string;
  openInNewTab?: boolean;
  filename: string; // used if sample is local
  url?: string; // used if sample is remote
  sources: SourceInfo[];
};

type PageCategory = {
  title: string;
  description: string;
  samples: { [key: string]: SampleInfo };
};

export const pageCategories: PageCategory[] = [
  {
    title: 'GPGPU Demos',
    description: 'Visualizations of parallel GPU compute operations.',
    samples: {
      gameOfLife,
    },
  },
];
