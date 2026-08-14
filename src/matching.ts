export interface MatchInput {
  name1: string;
  name2: string;
  ageScore: number;
  locationScore: number;
  dateScore: number;
  otherScore: number;
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function computeNameScore(name1: string, name2: string): number {
  const dist = levenshteinDistance(name1, name2);
  const maxLen = Math.max(name1.length, name2.length);
  if (maxLen === 0) return 100;
  return Math.round((1 - dist / maxLen) * 100);
}

export function calculatePotentialMatchScore(input: MatchInput) {
  const nameScore = computeNameScore(input.name1, input.name2);
  const weights = {
    nameScore: 0.3,
    ageScore: 0.15,
    locationScore: 0.2,
    dateScore: 0.15,
    otherScore: 0.2
  };
  const score =
    nameScore * weights.nameScore +
    input.ageScore * weights.ageScore +
    input.locationScore * weights.locationScore +
    input.dateScore * weights.dateScore +
    input.otherScore * weights.otherScore;
  return Math.round(score);
}
