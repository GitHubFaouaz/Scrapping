import { NextResponse } from "next/server";
import { Browser, chromium } from "playwright";
import { Jobs } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const GET = async (req: Request) => {
  // pour démarrer un navigateur sans interface graphique (headless browser) et ouvrir une nouvelle page dans ce navigateur

  // Lancer le navigateur
  const browser = await chromium.launch();

  const workWelwomToTheJungle = await getWorkToTheJungle(browser);

  const jobs = [...workWelwomToTheJungle];

  // Filtrer les valeurs undefined
  const filteredJobs = jobs.filter((job) =>
    job.company == ""
      ? console.log("pas de donnée")
      : prisma.jobs.createMany({
          data: jobs,
        })
  );

  return NextResponse.json({
    filteredJobs,
  });
};

// reception enregistrement des works
const getWorkToTheJungle = async (instance: Browser) => {
  const page = await instance.newPage();

  await page.goto(
    "https://www.welcometothejungle.com/fr/pages/emploi-developpeur-full-stack-paris-75001"
  );

  // Attendre que les éléments soient chargés
  https: await page.waitForSelector(".sc-1udkli7-0 ul li .kkKAOM");

  // on cible la class .kkKAOM  des li de la page
  const jobs = await page.$$eval(".sc-1udkli7-0  ul li .kkKAOM", (rows) =>
    rows.map((RowLi) => {
      const obj = {
        date: "",
        title: "",
        company: "",
        salary: "",
        url: "",
        logo: "",
        img: "",
        city: "",
        contract: "",
        typeWork: "",
      } as Jobs;

      //containe des elements (image et info)
      const grandDivElemnts = RowLi.querySelector(".sc-bXCLTC ");

      //containe info(logo title ...)
      const containInfo = RowLi.querySelector(".sc-bXCLTC .gmdUeC");

      //recuperation de l'image
      if (grandDivElemnts) {
        const containsImg = grandDivElemnts.querySelector("a img");
        obj.img = containsImg?.getAttribute("src") ?? "";
      }

      //recuperation logo
      if (containInfo) {
        const containslogo = containInfo.querySelector(".fsJUzh .gdZgow img");
        obj.logo = containslogo?.getAttribute("src") ?? "";
      }

      //recuperation compagny
      if (containInfo) {
        const containCompany = containInfo.querySelector(".fsJUzh ");
        obj.company = containCompany?.textContent?.trim() ?? "";
      }

      //recuperation du titre
      if (containInfo) {
        const containTitle = containInfo.querySelector(".sc-1gjh7r6-7 a   ");
        obj.title = containTitle?.textContent?.trim() ?? "";
      }

      // localisation
      if (containInfo) {
        const containCity = containInfo.querySelector(
          ".sc-1gjh7r6-7 .hZOXdq .fYUqim"
        );
        obj.city = containCity?.textContent?.trim() ?? "";
      }

      // type de contrat, travail , salaire
      if (containInfo) {
        const jobDetails = containInfo.querySelectorAll(".hgwOmJ .sc-bOhtcR");

        // pour chaque element du jobDetails
        jobDetails.forEach((element) => {
          const icon = element.querySelector("i");
          const text = element.querySelector("span")?.textContent?.trim() ?? "";

          if (icon?.getAttribute("name") === "contract") {
            obj.contract = text;
          } else if (icon?.getAttribute("name") === "remote") {
            obj.typeWork = text;
          } else if (icon?.getAttribute("name") === "salary") {
            obj.salary = text;
          }
        });
      }

      // recuperation date
      if (containInfo) {
        const containDate = containInfo.querySelector(".bdexTn");
        obj.date = containDate?.textContent?.trim() ?? "";
      }

      //recuperation de l'Url
      if (containInfo) {
        const containLink = containInfo.querySelector(" .sc-1gjh7r6-7 a");
        obj.url =
          "https://www.welcometothejungle.com" +
            containLink?.getAttribute("href") ?? "";
      }
      return obj;
    })
  );

  return jobs;
};
