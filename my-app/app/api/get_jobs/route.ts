// pages/api/get_jobs.ts

import { NextResponse } from "next/server";
import { Browser, chromium } from "playwright";
import { Jobs } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// export const GET = async (req: Request) => {
//   try {
//     // Lancer le navigateur
//     const browser = await chromium.launch();
//     const page = await browser.newPage();

//     // Naviguer vers la page web
//     await page.goto("https://remoteok.com/remote-engineer-jobs?order_by=date");

//     // Extraire les informations des offres d'emploi
//     const jobs = await page.$$eval("tr.job", (rows) => {
//       return rows.map((row) => {
//         const title =
//           row
//             .querySelector(".company_and_position [itemprop=title]")
//             ?.textContent?.trim() || "";
//         const company =
//           row
//             .querySelector(".company_and_position .companyLink h3")
//             ?.textContent?.trim() || "";
//         const location =
//           row.querySelector(".location")?.textContent?.trim() || "";
//         const salary =
//           row.querySelector(".salary")?.textContent?.trim() || null;
//         const url =
//           row.querySelector(".preventLink")?.getAttribute("href") || "";
//         const logo =
//           row.querySelector(".logo img")?.getAttribute("src") || null;

//         return { title, company, location, salary, url, logo };
//       });
//     });

//     // Fermer le navigateur
//     await browser.close();

//     // Retourner les résultats sous forme de JSON
//     return NextResponse.json({
//       jobs: jobs,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to fetch jobs",
//       },
//       { status: 500 }
//     );
//   }
// };
// export const GET = async (req: Request) => {
//   // pour démarrer un navigateur sans interface graphique (headless browser) et ouvrir une nouvelle page dans ce navigateur
//   // Lancer le navigateur
//   const browser = await chromium.launch();
//   const page = await browser.newPage(); //Ouverture d'une nouvelle page

//   // Naviguer vers la page web
//   await page.goto("https://remoteok.com/remote-engineer-jobs?order_by=date");

//   // get the tbody element and  log this content
//   const contentSite = await page.$eval("tbody", (el) => el.innerHTML);
//   // console.log(contentSite);

//   return NextResponse.json({
//     jobs: [],
//     // contentSite,
//   });
// };
export const GET = async (req: Request) => {
  // pour démarrer un navigateur sans interface graphique (headless browser) et ouvrir une nouvelle page dans ce navigateur
  // Lancer le navigateur
  const browser = await chromium.launch();
  const remotejobs = await getRemoteOkJobs(browser); // pour  1er scrapping
  const workRemoteJobs = await getWorkRemotlyJobs(browser); //pour le 2eme scrapping
  // console.log(contentSite);

  // Filtrer les valeurs undefined
  const filteredJobs = remotejobs.filter((job) => job !== undefined);
  // on insere les données dans la base de donnée avec createMany au lieu de create ; la méthode createMany pour insérer plusieurs enregistrements.
  if (Array.isArray(filteredJobs) && filteredJobs.length > 0) {
    await prisma.jobs.createMany({
      data: filteredJobs,
    });
  } else {
    console.error("The remotejobs variable is not an array or is empty");
  }

  return NextResponse.json({
    // remotejobs,//http://localhost:3000/api/get_jobs
    workRemoteJobs,
  });
};

//------------------------------------------------ 1er scrapping
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
      const h3Company = row.querySelector("h2");
      if (h3Company) {
        obj.company = h3Company.textContent?.trim() ?? "";
      }

      //recuperation de limage
      const hasLogoElement = row.querySelector(".has-logo"); // dans balise td
      if (hasLogoElement) {
        const img = hasLogoElement.querySelector("img");
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

//------------------------------------------ 2reme scrapping sur le site wwr de la meme maniere
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
      const h2Title = row.querySelector("h2"); // h2 de la page
      if (h2Title) {
        obj.title = h2Title.textContent?.trim() ?? "";
      }
      // recuperation de la company
      const h3Company = row.querySelector("h2");
      if (h3Company) {
        obj.company = h3Company.textContent?.trim() ?? "";
      }

      //recuperation de limage
      const hasLogoElement = row.querySelector(".has-logo"); // dans balise td
      if (hasLogoElement) {
        const img = hasLogoElement.querySelector("img");
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

// avec bright Data(site :https://brightdata.com/cp/zones/scraping_browser_faouaz/access_params) on va pouvoir scrapper pour recuperer les données dautres site
// pnpm install playwright

//  La méthode trim() en JavaScript est utilisée pour supprimer les espaces blancs au début et à la fin d'une chaîne de caractères. Cela inclut les espaces, les tabulations, les retours à la ligne, etc.
//  Nettoyage des Données : Garantit que les données extraites sont propres et sans espaces inutiles.
// Préparation des Données : Facilite la comparaison et la manipulation des chaînes de caractères, car les espaces blancs superflus peuvent entraîner des erreurs ou des comportements inattendus.
// let str3 = "\ntext with new line characters\n"; => console.log(str3.trim());  //"text with new line characters"

// Utilisez create :Lorsque vous insérez un seul enregistrement.
// Utilisez createMany :Lorsque vous insérez plusieurs enregistrements en même temps pour améliorer la performance.
