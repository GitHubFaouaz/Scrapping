/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images.welcometothejungle.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
// reactStrictMode: true : Cela active le mode strict de React pour vous aider à identifier les problèmes potentiels dans votre application.
// images : Cette section configure Next.js pour autoriser le chargement des images depuis des domaines externes.
// remotePatterns : Vous pouvez définir des modèles de correspondance pour les domaines externes. Dans cet exemple, il permet le chargement des images depuis cdn-images.welcometothejungle.com avec n'importe quel chemin.
