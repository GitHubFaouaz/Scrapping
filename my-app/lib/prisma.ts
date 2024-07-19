// PrismaClient est utilisé pour interagir avec votre base de données.
import { PrismaClient } from "@prisma/client";

export const prisma: PrismaClient =
  // Si global.prisma est défini (non null ou undefined), utilisez-le. Sinon, créez un nouveau PrismaClient.
  //@ts-ignore
  // Cela signifie que si global.prisma est null ou undefined, alors un nouveau PrismaClient sera créé.
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error"] // En production, ne loggez que les erreurs.
        : ["query", "info", "warn", "error"], // En développement, loggez tout.
  });

// En développement, stockez l'instance de PrismaClient dans global.prisma pour éviter de recréer l'instance à chaque fois.
if (process.env.NODE_ENV !== "production") {
  //@ts-ignore
  global.prisma = prisma;
}
// La ligne global.prisma ?? signifie que si global.prisma est défini, il sera utilisé, sinon un nouveau client Prisma sera créé. ?? est l'opérateur de coalescence null en JavaScript/TypeScript, qui retourne la valeur de droite uniquement si la valeur de gauche est null ou undefined.
// Types de Log Prisma :Prisma permet de spécifier les niveaux de log : "query", "info", "warn", "error". Assurez-vous que vous utilisez les valeurs exactes attendues par Prisma.

// Prévention des Multiples Instances : En environnement de développement, il est courant que les modules soient rechargés fréquemment, ce qui pourrait créer plusieurs instances de PrismaClient. Cela peut épuiser les connexions à la base de données et causer des erreurs.
// Performance et Stabilité : En réutilisant l'instance de PrismaClient, vous améliorez la performance et la stabilité de votre application.
