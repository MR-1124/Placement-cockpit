import { describe, it, expect } from 'vitest';
import { ALL_PLANS, DEFAULT_DSA_TOPICS } from './curriculum';

describe('Curriculum Data', () => {
  it('contains primary plans', () => {
    expect(ALL_PLANS).toBeInstanceOf(Array);
    expect(ALL_PLANS.length).toBeGreaterThan(0);
    
    // Check if the primary mastery plan exists
    const masteryPlan = ALL_PLANS.find(p => p.id === '16-week-mastery');
    expect(masteryPlan).toBeDefined();
    expect(masteryPlan?.duration).toBe(16);
  });

  it('validates plan structures', () => {
    ALL_PLANS.forEach(plan => {
      expect(plan).toHaveProperty('id');
      expect(plan).toHaveProperty('title');
      expect(plan).toHaveProperty('duration');
      expect(plan.segments).toBeInstanceOf(Array);
      expect(plan.segments.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('contains valid DSA topics', () => {
    expect(DEFAULT_DSA_TOPICS).toBeInstanceOf(Array);
    expect(DEFAULT_DSA_TOPICS.length).toBeGreaterThan(0);

    // Each topic should have problems
    DEFAULT_DSA_TOPICS.forEach(topic => {
      expect(topic).toHaveProperty('id');
      expect(topic).toHaveProperty('name');
      expect(topic.problems).toBeInstanceOf(Array);
    });
  });
});
