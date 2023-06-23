const mapping: Record<string, string> = {
  assessments: 'assessment',
  organizations: 'organization',
  users: 'user',
  'user-assessments': 'user_assessment',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
