import type { MorpionRepository, PlayMoveInput } from "../ports/MorpionRepository";
import type { MorpionGame } from "../../../domain/morpion/morpion";

export class PlayMorpionMoveUseCase {
  constructor(private readonly repo: MorpionRepository) {}

  async execute(input: PlayMoveInput): Promise<MorpionGame> {
    // to do ajouter des validations front
    return this.repo.playMove(input);
  }
}
