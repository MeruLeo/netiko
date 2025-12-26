export const PROJECT_FIELD_MAP: Record<string, string> = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  techs: 'techs',
  link: 'link',
  repo: 'repo',
  startDate: 'startDate',
  endDate: 'endDate',
  status: 'status',
  tags: 'tags',
  isPinned: 'isPinned',
};

export const ARRAY_FIELDS = ['techs', 'tags'] as const;
