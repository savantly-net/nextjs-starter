import { describe, it, expect } from 'vitest';
import { matchRedirect } from './redirects';
import type { RedirectRule } from '@/types/site';

describe('matchRedirect', () => {
  it('expands $1 in destination with the first captured group', () => {
    const rules: RedirectRule[] = [
      { source: '^(.*)$', destination: '/new-path/$1', permanent: true }
    ];
    const result = matchRedirect('/old-path', rules);
    expect(result).toEqual({ destination: '/new-path/old-path', permanent: true });
  });
});