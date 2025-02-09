import * as math from "mathjs";

/**
 * Fonction pour calculer la densité de noyau gaussien (KDE)
 * @param data Tableau des valeurs d'entrée (ex: ventes)
 * @param xPoints Points sur lesquels est évaluée la densité KDE
 * @returns Tableau des valeurs KDE évaluées sur xPoints
 */
export function gaussianKde(data: number[], xPoints: number[]): number[] {
  if (data.length === 0 || xPoints.length === 0) {
    return [];
  }

  const bandwidth = 1.06 * math.std(data) * Math.pow(data.length, -1 / 5); // Règle de Silverman
  const kdeValues = xPoints.map((x) =>
    math.mean(
      data.map(
        (xi) =>
          (1 / (bandwidth * Math.sqrt(2 * Math.PI))) *
          Math.exp(-0.5 * Math.pow((x - xi) / bandwidth, 2))
      )
    )
  );

  return kdeValues;
}
