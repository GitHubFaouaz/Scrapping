import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { BsCalendar2Date } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { MdHomeWork } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";

export default async function Home() {
  // on va cherher les jobs enregistrés dans la base de donnée grace a la page route pour les affichés
  const jobs = await prisma.jobs.findMany({
    // Récupérer les enregistrements de db avec une condition sur la date
  });
  return (
    <div className="flex flex-col gap-4 max-w-4xl m-auto">
      <h1 className="bg-gradient-to-r from-blue-600 via-red-500 to-indigo-400 inline-block text-transparent bg-clip-text text-8xl">
        RemoteJobsFinder
      </h1>
      <ul className="flex flex-wrap gap-2 ">
        {jobs.map((j) => (
          <li key={j.id} className="w-[49%]">
            <Link href={j.url}>
              <Card className="hover:bg-muted/50 flex flex-col ">
                <div>
                  <img
                    src={j.img ?? ""}
                    alt="imgJob"
                    className="w-full h-[200px]  object-cover"
                    // className="w-[90%] h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 w-[100%] ">
                  <CardHeader className="flex flex-row gap-4 p-2">
                    <Avatar>
                      <AvatarFallback>{j.company[0]}</AvatarFallback>
                      {j.logo ? (
                        <AvatarImage src={j.logo} alt={j.company} />
                      ) : null}
                    </Avatar>
                    <span>{j.company}</span>
                  </CardHeader>

                  <CardTitle className="p-2 text-[20px]">{j.title}</CardTitle>

                  <CardDescription className="flex p-2">
                    <span className="flex items-center gap-1 bg-red-400 mr-1 p-1">
                      <GiNotebook />
                      {j.contract}
                    </span>
                    <span className="flex items-center bg-red-400 mr-1 p-1">
                      <MdHomeWork /> {j.typeWork}
                    </span>
                    <span className="flex items-center bg-red-400 mr-1 p-1">
                      <PiMoneyWavy />
                      {j.salary}
                    </span>
                  </CardDescription>

                  <CardFooter className="flex justify-between p-2">
                    <span className="flex  items-center gap-1">
                      <CiLocationOn /> {j.city}
                    </span>
                    <span className="flex  items-center gap-1">
                      <BsCalendar2Date />
                      {j.date}
                    </span>
                  </CardFooter>
                </div>
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
