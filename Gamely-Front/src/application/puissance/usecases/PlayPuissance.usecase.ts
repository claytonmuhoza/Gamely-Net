import type { PuissanceRepository, PlayMoveInput } from "../ports/PuissanceRepository";
import type { PuissanceGame } from "../../../domain/puissance/puissance";

export class PlayPuissanceUsecase {
  constructor(private readonly repo: PuissanceRepository) {}

  async execute(input: PlayMoveInput): Promise<PuissanceGame> {
    if (!input) throw new Error("Input obligatoire");
    // validations frontales éventuelles (ex : columnIndex, playerId) peuvent être ajoutées ici
    return this.repo.playMove(input);
  }
}