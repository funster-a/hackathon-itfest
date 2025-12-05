import type { IUniversity } from '../types';

export const universities: IUniversity[] = [
  {
    id: '1',
    name: 'KBTU (Kazakh-British Technical University)',
    description: 'Ведущий технический университет Казахстана, специализирующийся на IT, инженерии и бизнесе. Предлагает программы на английском языке и тесное сотрудничество с британскими университетами.',
    city: 'Алматы',
    price: 1500000,
    minEntScore: 85,
    hasDormitory: true,
    hasMilitaryDept: true,
    rating: 4.5,
    hasTour: true,
    tourUrl: 'https://my.matterport.com/show/?m=JGPnGQFhhcm',
  },
  {
    id: '2',
    name: 'SDU (Suleyman Demirel University)',
    description: 'Международный университет, предлагающий широкий спектр программ в области инженерии, бизнеса, медицины и гуманитарных наук. Известен качественным образованием и современной инфраструктурой.',
    city: 'Алматы',
    price: 1200000,
    minEntScore: 75,
    hasDormitory: true,
    hasMilitaryDept: false,
    rating: 4.2,
    hasTour: false,
  },
  {
    id: '3',
    name: 'NU (Nazarbayev University)',
    description: 'Флагманский университет Казахстана, созданный по модели ведущих мировых университетов. Предлагает программы бакалавриата и магистратуры на английском языке с международными стандартами образования.',
    city: 'Нур-Султан',
    price: 2000000,
    minEntScore: 95,
    hasDormitory: true,
    hasMilitaryDept: true,
    rating: 4.8,
    hasTour: true,
    tourUrl: 'https://my.matterport.com/show/?m=JGPnGQFhhcm',
  },
];

