export type EncryptionLevelId = "none" | "aes-128" | "aes-256";

export const ENCRYPTION_LEVEL_OPTIONS: readonly {
  id: EncryptionLevelId;
  label: string;
}[] = [
  { id: "none", label: "None" },
  { id: "aes-128", label: "AES-128" },
  { id: "aes-256", label: "AES-256" },
];
