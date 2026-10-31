/**
 * Gestione del token anonimo del votante per la Community CentMeta.
 * Salvato in localStorage (nessun cookie né profilazione di terze parti),
 * garantisce la persistenza dei voti e del progresso anche su rete mobile 4G/5G
 * dove l'indirizzo IP cambia frequentemente.
 */
export function getVoterToken(): string {
  if (typeof window === "undefined") return "";
  try {
    let token = localStorage.getItem("centmeta_voter_token");
    if (!token) {
      token = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "voter_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("centmeta_voter_token", token);
    }
    return token;
  } catch {
    return "";
  }
}

