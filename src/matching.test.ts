import { describe, expect, it } from "vitest";
import { calculatePotentialMatchScore } from "./matching";

describe("calculatePotentialMatchScore", () => {
  it("uses the documented humanitarian demo weights", () => {
    expect(
      calculatePotentialMatchScore({
        nameScore: 92,
        ageScore: 100,
        locationScore: 90,
        dateScore: 75,
        otherScore: 82
      })
    ).toBe(88);
  });

  it("does not produce an automatic identity decision", () => {
    const score = calculatePotentialMatchScore({
      nameScore: 100,
      ageScore: 100,
      locationScore: 100,
      dateScore: 100,
      otherScore: 100
    });
    expect(score).toBe(100);
  });
});
