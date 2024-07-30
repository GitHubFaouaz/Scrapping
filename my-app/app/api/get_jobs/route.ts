// pages/api/get_jobs.ts
import { NextResponse } from "next/server";
import { Browser, chromium } from "playwright";
import { Jobs } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const GET = async (req: Request) => {
  // pour démarrer un navigateur sans interface graphique (headless browser) et ouvrir une nouvelle page dans ce navigateur

  // Lancer le navigateur
  const browser = await chromium.launch();
  // -------------------test-------------------
  // const page = await browser.newPage();
  // await page.goto(
  //   "https://www.welcometothejungle.com/fr/jobs?query=d%C3%A9veloppeur&refinementList%5Boffices.country_code%5D%5B%5D=FR"
  // );

  // const content = await page.$$eval(".sc-1udkli7-0  ul li  ", (items) =>
  //   items.map((item) => item.innerHTML)
  // );

  //------------------test---------------

  // const remotejobs = await getRemoteOkJobs(browser); // 1er scrapping
  // const workRemoteJobs = await getWorkRemotlyJobs(browser); // 2eme scrapping
  const workWelwomToTheJungle = await getWorkToTheJungle(browser); // 3eme scrapping

  // recuperation des 2 scrapping
  // const jobs = [...remotejobs, ...workRemoteJobs];
  const jobs = [...workWelwomToTheJungle];
  console.dir(jobs);

  // Filtrer les valeurs undefined
  // const filteredJobs = jobs.filter((job) => job !== undefined);

  // on insere les données dans la base de donnée avec createMany au lieu de create ; la méthode createMany pour insérer plusieurs enregistrements.
  // if (Array.isArray(filteredJobs) && filteredJobs.length > 0) {
  //   await prisma.jobs.createMany({
  //     data: filteredJobs,
  //   });
  // } else {
  //   console.error("The remotejobs variable is not an array or is empty");
  // }

  return NextResponse.json({
    // remotejobs,//http://localhost:3000/api/get_jobs
    // workRemoteJobs,
    jobs,
    // content,
  });
};

//------------------------------------------------ 1er scrapping(https://remoteok.com/)
const getRemoteOkJobs = async (instance: Browser) => {
  const page = await instance.newPage();
  await page.goto("https://remoteok.com/remote-engineer-jobs?order_by=date");

  // on cible le tr de la page remoteok.com
  const jobs = await page.$$eval("tr", (rows) => {
    return rows.map((row) => {
      // pour eviter dafficher des pubs on filtre avant
      if (row.classList.contains("ad")) return; // on retourne que ce qui contient la classList ad
      // ligne avec info par defaut a afficher
      const obj = {
        title: "",
        company: "",
        date: new Date(),
        logo: "",
        salary: "",
        url: "",
      } as Jobs; // on se base sur le jobs du schema.prisma

      // recuperation h2 de la page
      const h2Title = row.querySelector("h2"); // h2 de la page
      if (h2Title) {
        obj.title = h2Title.textContent?.trim() ?? "";
      }
      // recuperation de la company
      const company = row.querySelector("h2");
      if (company) {
        obj.company = company.textContent?.trim() ?? "";
      }

      //recuperation de limage
      const divLogo = row.querySelector(".has-logo"); // dans balise td
      if (divLogo) {
        const img = divLogo.querySelector("img");
        obj.logo = img?.getAttribute("src") ?? ""; // on envoi img et si nul ''
      }

      //recuperatiino de l'url
      const url = row.getAttribute("data-url");
      if (url) {
        obj.url = "https://remoteok.com" + url;
      }

      // recuperation du salaire
      const locationElement = row.querySelectorAll(".location");
      for (const locationElementOne of locationElement) {
        const location = locationElementOne.textContent?.trim() ?? "";
        if (location.startsWith("💰")) {
          //WIN + ; pour les emojie
          obj.salary = location;
        }
      }
      return obj;
    });
  });
  // on filtre si les elements sont undefied
  const JobsFiltered = jobs.filter((job) => {
    if (!job) return false;
    if (!job?.title) return false;
    if (!job?.url) return false;
    if (!job?.company) return false;
    return true;
  });
  return JobsFiltered;
};

//------------------------------------------ 2reme scrapping (https://weworkremotely.com/)
const getWorkRemotlyJobs = async (instance: Browser) => {
  const page = await instance.newPage();
  await page.goto(
    "https://weworkremotely.com/categories/remote-full-stack-programming-jobs#job-listings"
  );

  // on cible la class article li  de la page
  const jobs = await page.$$eval("article li", (rows) => {
    return rows.map((row) => {
      // pour eviter dafficher des pubs on filtre avant
      if (row.classList.contains("ad")) return; // on retourne que ce qui contient la classList ad
      // ligne avec info par defaut a afficher
      const obj = {
        title: "",
        company: "",
        date: new Date(),
        logo: "",
        salary: "",
        url: "",
      } as Jobs; // on se base sur le jobs du schema.prisma

      // recuperation h2 de la page
      const title = row.querySelector(".title"); // h2 de la page
      if (title) {
        obj.title = title.textContent?.trim() ?? "";
      }
      // recuperation de la company
      const company = row.querySelector(".company");
      if (company) {
        obj.company = company.textContent?.trim() ?? "";
      }

      //recuperation de limage (logo)
      const divLogo = row.querySelector(".flag-logo") as HTMLDivElement; // de la div
      if (divLogo) {
        const backgroundImage = divLogo.style.backgroundImage;
        const img = backgroundImage
          ?.replace("url(", "")
          .replace(")", "")
          .replace('"', "");
        obj.logo = img;
      }

      //recuperatiino de l'url
      const aElement = row.querySelectorAll("a")[1];
      if (aElement) {
        obj.url =
          "https://weworkremotely.com/" + aElement.getAttribute("href") ?? "";
      }

      return obj;
    });
  });
  // on filtre si les elements sont undefied
  const JobsFiltered = jobs.filter((job) => {
    if (!job) return false;
    if (!job?.title) return false;
    if (!job?.url) return false;
    if (!job?.company) return false;
    return true;
  });
  return JobsFiltered;
};

// reception enregistrement des works
const getWorkToTheJungle = async (instance: Browser) => {
  const page = await instance.newPage();
  await page.goto(
    "https://www.welcometothejungle.com/fr/jobs?query=d%C3%A9veloppeur&refinementList%5Boffices.country_code%5D%5B%5D=FR"
  );

  // on cible la class article li  de la page
  const jobs = await page.$$eval(".sc-1udkli7-0  ul li .kkKAOM", (rows) =>
    rows.map((li) => li.innerHTML)
  );

  // on filtre si les elements sont undefied
  // const JobsFiltered = jobs.filter((job) => {
  //   if (!job) return false;
  //   if (!job?.title) return false;
  //   if (!job?.url) return false;
  //   if (!job?.company) return false;
  //   return true;
  // });
  // return JobsFiltered;
  return jobs;
};

// avec bright Data(site :https://brightdata.com/cp/zones/scraping_browser_faouaz/access_params) on va pouvoir scrapper pour recuperer les données dautres site
// pnpm install playwright

//  La méthode trim() en JavaScript est utilisée pour supprimer les espaces blancs au début et à la fin d'une chaîne de caractères. Cela inclut les espaces, les tabulations, les retours à la ligne, etc.
//  Nettoyage des Données : Garantit que les données extraites sont propres et sans espaces inutiles.
// Préparation des Données : Facilite la comparaison et la manipulation des chaînes de caractères, car les espaces blancs superflus peuvent entraîner des erreurs ou des comportements inattendus.
// let str3 = "\ntext with new line characters\n"; => console.log(str3.trim());  //"text with new line characters"

// Utilisez create :Lorsque vous insérez un seul enregistrement.
// Utilisez createMany :Lorsque vous insérez plusieurs enregistrements en même temps pour améliorer la performance.
