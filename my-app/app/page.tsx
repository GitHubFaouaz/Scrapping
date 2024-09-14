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
import { FaQuoteRight } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { MdHomeWork } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";

export default async function Home() {
  // on va cherher les jobs enregistrés dans la base de donnée grace a la page route pour les affichés
  const jobs = await prisma.jobs.findMany({
    // Récupérer les enregistrements de db avec une condition sur la date
  });
  return (
    <div className="flex flex-col gap-4  m-auto items-center">
      <h1 className="customH1 via-red-500 to-indigo-400 inline-block text-[#4d6170] animate-bounce  text-8xl ">
        RemoteJobsFinder
      </h1>
      <ul className="grid grid-cols-3 gap-3  max-w-[1200px] m-auto p-[10px] customUl">
        {jobs.map((j) => (
          <li
            key={j.id}
            className=" bg-[#4d6170] p-1.5 rounded-[5px] relative customTransition    "
          >
            <Link href={j.url}>
              <Card className=" flex flex-col h-full shadow-[0_0_10px_black]  ">
                <div>
                  <img
                    src={j.img ?? ""}
                    alt="imgJob"
                    className="w-full h-[200px]  object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 w-[100%] relative h-full rounded-bl-[10px] pl-5 customContaineElement">
                  <div className="customBarre customTransition   w-[5%] bg-[#425561] absolute left-0 h-full rounded-bl-[10px] "></div>
                  <CardHeader className="flex flex-row gap-4 p-2 min-h-[70px] items-center">
                    <Avatar className="absolute left-[-15px] border-[3px] border-solid border-[#000] ">
                      <AvatarFallback>{j.company[0]}</AvatarFallback>
                      {j.logo ? (
                        <AvatarImage src={j.logo} alt={j.company} />
                      ) : null}
                    </Avatar>
                    <span className="pl-1">{j.company}</span>
                  </CardHeader>

                  <CardTitle className="p-2 mb-4 text-[18px] h-[60px] z-10  animate-barre">
                    {j.title}
                  </CardTitle>

                  <CardDescription className="flex p-2 z-10">
                    {j.contract !== "" && (
                      <span className="flex items-center gap-1  bg-[#4d6170] mr-1 p-1  text-[#fff]">
                        <GiNotebook />
                        {j.contract}
                      </span>
                    )}

                    {j.typeWork !== "" && (
                      <span className="flex items-center  bg-[#4d6170] mr-1 p-1  text-[#fff]">
                        <MdHomeWork /> {j.typeWork}
                      </span>
                    )}

                    {j.salary !== "" && (
                      <span className="flex items-center bg-[#4d6170] mr-1 p-1 text-[#fff]">
                        <PiMoneyWavy />
                        {j.salary}
                      </span>
                    )}
                  </CardDescription>
                  <span className="flex  items-center gap-1 z-10">
                    <CiLocationOn className=" text-[#fff]" /> {j.city}
                  </span>
                  <CardFooter className="flex justify-between p-2 mt-[1rem] z-10">
                    <span className="flex  items-center gap-1">
                      <BsCalendar2Date />
                      {j.date}
                    </span>
                    <span className="flex  items-center gap-1  ">
                      <FaQuoteRight className="customFaQuoteRight customTransition   text-[#425561]" />
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
