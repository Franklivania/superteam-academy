export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  username?: string;
  xp: number;
  level: number;
};

// Generate some random looking dummy data
const generate_dummy_data = (count: number, max_xp: number): LeaderboardEntry[] => {
  return Array.from({ length: count }).map((_, i) => ({
    rank: i + 1,
    user_id: `user_${Math.random().toString(36).substring(2, 10)}`,
    username: Math.random() > 0.3 ? `SolanaDev_${Math.floor(Math.random() * 1000)}` : undefined,
    xp: Math.floor(Math.random() * max_xp) + 100,
    level: Math.floor(Math.random() * 10) + 1,
  })).sort((a, b) => b.xp - a.xp).map((entry, index) => ({ ...entry, rank: index + 1 }));
};

export const dummy_leaderboard_data: Record<"24h" | "7d" | "30d" | "all_time", LeaderboardEntry[]> = {
  "24h": generate_dummy_data(15, 500),
  "7d": generate_dummy_data(25, 2000),
  "30d": generate_dummy_data(40, 5000),
  "all_time": generate_dummy_data(50, 15000),
};

export const dummy_admin_status = {
  last_refresh_at: new Date().toISOString(),
  total_indexed: 1420,
};
