export class Player {
  constructor(
    public readonly id: string,
    public readonly pseudo: string
  ) {
    if (!id) throw new Error("Player.id is required");
    if (!pseudo.trim()) throw new Error("Player.pseudo is required");
  }

  /** Affichage simple type "Pseudo (#xxxx)" si besoin */
  get displayName(): string {
    return this.pseudo;
  }

  /** Comparaison par id */
  isSame(other: Player | null | undefined): boolean {
    if (!other) return false;
    return this.id === other.id;
  }

  /** Pour (dé)sérialisation simple (localStorage) */
  static fromJSON(json: { id: string; pseudo: string }): Player {
    return new Player(json.id, json.pseudo);
  }
}
