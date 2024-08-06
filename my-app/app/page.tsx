import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { CiLocationOn } from "react-icons/ci";

export default async function Home() {
  // on va cherher les jobs enregistrés dans la base de donnée grace a la page route pour les affichés
  const jobs = await prisma.jobs.findMany({
    // Récupérer les enregistrements de db avec une condition sur la date
    // where: {
    //   date: {
    //     gte: new Date(new Date().setDate(new Date().getDate() - 1)),
    //   },
    // },
  });
  return (
    <div className="flex flex-col gap-4 max-w-4xl m-auto">
      <h1 className="bg-gradient-to-r from-blue-600 via-red-500 to-indigo-400 inline-block text-transparent bg-clip-text text-8xl">
        RemoteJobsFinder
      </h1>
      <ul className="flex flex-col gap-2 ">
        {jobs.map((j) => (
          <li key={j.id}>
            <Link href={j.url}>
              <Card className="hover:bg-muted/50">
                <CardHeader className="flex flex-row gap-4">
                  <div>
                    <Avatar>
                      <AvatarFallback>{j.company[0]}</AvatarFallback>
                      {j.logo ? (
                        <AvatarImage src={j.logo} alt={j.company} />
                      ) : null}
                    </Avatar>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Image
                      src={j.img ?? ""}
                      alt="imageJob"
                      width={200}
                      height={100}
                    />
                    <CardTitle>{j.title}</CardTitle>
                    <CardDescription>
                      {j.company} - {j.salary}- <CiLocationOn /> {j.city}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// where : Ce champ permet de définir des conditions de filtrage pour la requête. Les enregistrements qui répondent aux conditions spécifiées seront retournés. where n'est pas une obligation dans une requête Prisma,Sans where, la requête renverra tous les enregistrements du modèle spécifié.

// date : C'est le champ de la table jobs sur lequel vous appliquez la condition.

// gte : C'est un opérateur Prisma qui signifie "greater than or equal" (plus grand ou égal à). Il est utilisé pour comparer des valeurs.

// new Date(new Date().setDate(new Date().getDate() - 1)) :

// new Date() : Crée un objet Date représentant la date et l'heure actuelles.
// new Date().getDate() : Récupère le jour du mois (1-31) de la date actuelle.
// new Date().setDate(new Date().getDate() - 1) : Définit la date à un jour avant la date actuelle.
// new Date() : Convertit le timestamp en un objet Date.
