import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BsCalendar2Date } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { FaQuoteRight } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { MdHomeWork } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";

export default async function Home() {
  // on va cherher les jobs enregistrés dans la base de donnée grace a la page route pour les affichés
  const jobs = await prisma.jobs.findMany({});
  return (
    <div className="flex flex-col gap-4  m-auto items-center">
      <h1 className="customH1 via-red-500 to-indigo-400 inline-block text-[#4d6170]   text-8xl ">
        RemoteJobsFinder
      </h1>
      <ul className="flex flex-col lg:grid grid-cols-3 gap-3  max-w-[1200px] m-auto p-[10px] customUl">
        {jobs.map((j) => (
          <li
            key={j.id}
            className=" bg-[#4d6170] p-1.5 rounded-[5px] relative customTransition "
          >
            <Link href={j.url}>
              <Card className=" flex flex-col h-full shadow-[0_0_10px_black]  animate-barre">
                <div>
                  <img
                    src={j.img ?? ""}
                    alt="imgJob"
                    className="w-full h-[200px]  object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 w-[100%] relative h-full rounded-bl-[10px] pl-5 customContaineElement">
                  <div className="customBarre customTransition   w-[5%] bg-[#425561] absolute left-0 h-full rounded-bl-[10px] "></div>
                  <CardHeader className="flex flex-row gap-4 p-2 min-h-[70px] z-10  items-center">
                    <Avatar className="absolute left-[-15px] border-[3px]  border-solid border-[#000] ">
                      <AvatarFallback>{j.company[0]}</AvatarFallback>
                      {j.logo ? (
                        <AvatarImage src={j.logo} alt={j.company} />
                      ) : null}
                    </Avatar>
                    <span className="pl-1">{j.company}</span>
                  </CardHeader>

                  <CardTitle className="p-2 mb-4 text-[18px] h-[60px] z-10 ">
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
                      <span className="flex items-center gap-1 bg-[#4d6170] mr-1 p-1  text-[#fff]">
                        <MdHomeWork /> {j.typeWork}
                      </span>
                    )}

                    {j.salary !== "" && (
                      <span className="flex items-center gap-1 bg-[#4d6170] mr-1 p-1 text-[#fff]">
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
