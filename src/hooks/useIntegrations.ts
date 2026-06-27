import { useState, useCallback } from "react";
import { useAppState } from "../context/AppStateContext";

// Simple wrapper for fetching GitHub events
// GitHub API rate limits unauthenticated requests to 60/hour.
export const useIntegrations = () => {
  const { state, updateSettings, toggleHabit } = useAppState();
  const [isSyncingLeetCode, setIsSyncingLeetCode] = useState(false);
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMessage = (type: "success" | "error", text: string) => {
    setSyncMessage({ type, text });
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const syncGitHub = useCallback(async () => {
    const username = state.settings.integrations?.githubUsername;
    if (!username) {
      showMessage("error", "No GitHub username configured.");
      return;
    }

    setIsSyncingGitHub(true);
    setSyncMessage(null);

    try {
      // Use the public events API. This doesn't require a token for public commits.
      const response = await fetch(`https://api.github.com/users/${username}/events/public`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const events = await response.json();
      
      // Determine if there was a PushEvent today
      const todayStr = new Date().toISOString().split('T')[0];
      const hasPushedToday = events.some((event: any) => {
        if (event.type === "PushEvent") {
          const eventDate = event.created_at.split('T')[0];
          return eventDate === todayStr;
        }
        return false;
      });

      if (hasPushedToday) {
        // Automatically check off the habit if not already done
        if (!state.dailyHabits.pushGithub) {
          toggleHabit("pushGithub");
        }
      }

      updateSettings({
        integrations: {
          ...state.settings.integrations,
          githubLastSynced: new Date().toISOString()
        }
      });

      showMessage("success", `GitHub synced successfully! ${hasPushedToday ? "Found commits today." : "No commits found today."}`);
    } catch (error: any) {
      showMessage("error", error.message || "Failed to sync GitHub.");
    } finally {
      setIsSyncingGitHub(false);
    }
  }, [state.settings.integrations, state.dailyHabits.pushGithub, toggleHabit, updateSettings]);

  const syncLeetCode = useCallback(async () => {
    const username = state.settings.integrations?.leetcodeUsername;
    if (!username) {
      showMessage("error", "No LeetCode username configured.");
      return;
    }

    setIsSyncingLeetCode(true);
    setSyncMessage(null);

    try {
      // Using community proxy as optional fallback (strict CORS constraints by LeetCode)
      // Note: This API might be unstable or slow.
      const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/submission`);
      if (!response.ok) {
        throw new Error(`LeetCode API proxy error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parse today's submissions
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      const todayUnix = Math.floor(todayStart.getTime() / 1000);

      const hasSubmittedToday = data.submission?.some((sub: any) => {
        return parseInt(sub.timestamp) >= todayUnix;
      });

      if (hasSubmittedToday) {
        if (!state.dailyHabits.solveDsa) {
          toggleHabit("solveDsa");
        }
      }

      updateSettings({
        integrations: {
          ...state.settings.integrations,
          leetcodeLastSynced: new Date().toISOString()
        }
      });

      showMessage("success", `LeetCode synced! ${hasSubmittedToday ? "Found submissions today." : "No recent submissions found."}`);
    } catch (error: any) {
      // Gracefully handle proxy failures
      showMessage("error", `LeetCode sync failed: ${error.message}. Proxy might be down or username invalid.`);
    } finally {
      setIsSyncingLeetCode(false);
    }
  }, [state.settings.integrations, state.dailyHabits.solveDsa, toggleHabit, updateSettings]);

  return {
    syncGitHub,
    syncLeetCode,
    isSyncingGitHub,
    isSyncingLeetCode,
    syncMessage
  };
};
