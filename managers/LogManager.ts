/*
 * @description Gestion des logs
*/
class LogManager {
  /**
   * @description Codes ANSI
   */
  private static colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
  };

  /**
   * @description Génère un timestamp
   */
  private static getTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * @description Log générique
   */
  private static logWithColor(message: string, color: string): void {
    const timestamp = this.getTimestamp();
    console.log(`${color}[${timestamp}] ${message}${this.colors.reset}`);
  }

  /**
   * @description Log info (vert)
   */
  static info(message: string): void {
    this.logWithColor(`INFO  ${message}`, this.colors.green);
  }

  /**
   * @description Log erreur (rouge)
   */
  static error(message: string): void {
    this.logWithColor(`ERROR ${message}`, this.colors.red);
  }

  /**
   * @description Log neutre (fallback)
   */
  static log(message: string): void {
    const timestamp = this.getTimestamp();
    console.log(`[${timestamp}] ${message}`);
  }
}

export default LogManager;