export interface MatchInput {
  nameScore: number;
  ageScore: number;
  locationScore: number;
  dateScore: number;
  otherScore: number;
}

export function calculatePotentialMatchScore(input: MatchInput) {
  const weights = {
    nameScore: 0.3,
    ageScore: 0.15,
    locationScore: 0.2,
    dateScore: 0.15,
    otherScore: 0.2
  };
  const score =
    input.nameScore * weights.nameScore +
    input.ageScore * weights.ageScore +
    input.locationScore * weights.locationScore +
    input.dateScore * weights.dateScore +
    input.otherScore * weights.otherScore;
  return Math.round(score);
}
