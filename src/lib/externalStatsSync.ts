/**
 * External Telemetry Synchronizer
 * Safely fetches public LeetCode and GitHub profile stats with strict validation,
 * AbortController timeouts, and localStorage caching (15 min TTL).
 */

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  acceptanceRate: number;
  ranking: number;
  lastSynced: string;
}

export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  bio: string;
  profileUrl: string;
  lastSynced: string;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Validate username against strict security regex
 */
export function isValidUsername(username: string): boolean {
  if (!username) return false;
  const trimmed = username.trim();
  // Alphanumeric with hyphens/underscores, 1 to 39 characters
  return /^[a-zA-Z0-9_-]{1,39}$/.test(trimmed);
}

/**
 * Fetch public LeetCode statistics
 */
export async function fetchLeetCodeStats(rawUsername: string): Promise<LeetCodeStats> {
  const username = rawUsername.trim();
  if (!isValidUsername(username)) {
    throw new Error("Invalid username format. Must be alphanumeric (1-39 chars).");
  }

  const cacheKey = `ext_lc_cache_${username.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed._cachedAt < CACHE_TTL_MS) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore cache parse error
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    // Primary public community proxy for LeetCode public profile metrics
    const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(username)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`LeetCode profile fetch returned HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.status === "error" || data.message === "user does not exist") {
      throw new Error(data.message || `LeetCode user "${username}" was not found.`);
    }

    const stats: LeetCodeStats = {
      username,
      totalSolved: Number(data.totalSolved) || 0,
      easySolved: Number(data.easySolved) || 0,
      mediumSolved: Number(data.mediumSolved) || 0,
      hardSolved: Number(data.hardSolved) || 0,
      totalQuestions: Number(data.totalQuestions) || 3000,
      acceptanceRate: Number(data.acceptanceRate) || 0,
      ranking: Number(data.ranking) || 0,
      lastSynced: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Cache results
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: stats, _cachedAt: Date.now() })
      );
    } catch {}

    return stats;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. LeetCode API service took too long to respond.");
    }
    throw new Error(err.message || "Failed to fetch LeetCode statistics.");
  }
}

/**
 * Fetch public GitHub statistics
 */
export async function fetchGitHubStats(rawUsername: string): Promise<GitHubStats> {
  const username = rawUsername.trim();
  if (!isValidUsername(username)) {
    throw new Error("Invalid GitHub username format.");
  }

  const cacheKey = `ext_gh_cache_${username.toLowerCase()}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed._cachedAt < CACHE_TTL_MS) {
        return parsed.data;
      }
    }
  } catch {}

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    clearTimeout(timeoutId);

    if (res.status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    }
    if (res.status === 403) {
      throw new Error("GitHub API rate limit reached. Please wait a few minutes.");
    }
    if (!res.ok) {
      throw new Error(`GitHub API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const stats: GitHubStats = {
      username: data.login || username,
      name: data.name || data.login || username,
      avatarUrl: data.avatar_url || "",
      publicRepos: Number(data.public_repos) || 0,
      followers: Number(data.followers) || 0,
      following: Number(data.following) || 0,
      bio: data.bio || "",
      profileUrl: data.html_url || `https://github.com/${username}`,
      lastSynced: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: stats, _cachedAt: Date.now() })
      );
    } catch {}

    return stats;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("GitHub request timed out.");
    }
    throw new Error(err.message || "Failed to fetch GitHub profile.");
  }
}
