import { describe, expect, it } from "vitest";
import { calculatePotentialMatchScore, computeNameScore, levenshteinDistance } from "./matching";

describe("calculatePotentialMatchScore", () => {
  it("weights attributes correctly", () => {
    const score = calculatePotentialMatchScore({
      name1: "John Doe",
      name2: "John Doe",
      ageScore: 80,
      locationScore: 50,
      dateScore: 90,
      otherScore: 100
    });
    
    expect(score).toBe(86);
  });
});

describe("levenshteinDistance", () => {
  it("computes correctly", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3);
  });
});

describe("computeNameScore", () => {
  it("computes correctly", () => {
    expect(computeNameScore("John", "John")).toBe(100);
    expect(computeNameScore("Jon", "John")).toBe(75);
  });
});
